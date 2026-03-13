import * as formData from '@libs/shared/theme/assets/json/140105/datos-del-formulario.json';
import { AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import {
  CategoriaMensaje,
  TipoNotificacionEnum,
} from '@ng-mf/data-access-user';
import { Subject, map, takeUntil } from 'rxjs';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/shared/base-response.model';
import { Cancelacion } from '../../models/cancelacion-de-solicitus.model';
import { Component } from '@angular/core';
import { ConfiguracionColumna } from '@libs/shared/data-access-user/src';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { DesistimientoQuery } from '../../estados/desistimiento-de-permiso.query';
import { DesistimientoStore } from '../../estados/desistimiento-de-permiso.store';
import { DetalleDelBuscarResponse } from '../../../../shared/models/detalleDelPermiso.model';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { Modal } from 'bootstrap';
import { Notificacion } from '@ng-mf/data-access-user';
import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { ServicioDeMensajesService } from '../../services/servicio-de-mensajes.service';
import { ServiciosService } from '../../../../shared/services/servicios.service';
import { Solicitud140104State } from '../../estados/desistimiento-de-permiso.store';
import { TablaSeleccion } from '@libs/shared/data-access-user/src';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-cancelacion-de-solicitud',
  templateUrl: './cancelacion-de-solicitud.component.html',
  styleUrl: './cancelacion-de-solicitud.component.scss',
})
export class CancelacionDeSolicitudComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  /**
   * Identificador del trámite.
   */
  tramiteID = '140104';
  /**
   * Represents the current state of the Solicitud 140104 process within the Cancelación de Solicitud component.
   * Used to manage and track the application's workflow and data for the cancellation request.
   */
  public solicitudState!: Solicitud140104State;
  /**
   * Sujeto para gestionar la destrucción del componente y evitar fugas de memoria.
   */
  private destroyNotificationSubject$ = new Subject<void>();
  /**
   * Formulario para capturar el motivo de cancelación.
   */
  public cancelacionForm!: FormGroup;

  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * @descripcion
   * Instancia del modal de modificación.
   */
  modalInstanceDos!: Modal;

  /**
   * Instancia del modal para gestionar archivos.
   *
   * Se utiliza para abrir o cerrar el modal de archivos.
   */
  modalInstances: Modal | null = null;

  /**
   * Configuración de las columnas de la tabla de solicitudes de cancelación.
   */
  configuracionColumnasSolicitud: ConfiguracionColumna<Cancelacion>[] = [
    {
      encabezado: 'Número Resolución',
      clave: (fila) => fila.numeroResolucion,
      orden: 1,
    },
    {
      encabezado: 'Tipo solicitud',
      clave: (fila) => fila.general,
      orden: 2,
    },
    { encabezado: 'Régimen', clave: (fila) => fila.regimen, orden: 3 },
    {
      encabezado: 'Clasificación Régimen',
      clave: (fila) => fila.clasificacionRegimen,
      orden: 4,
    },
    {
      encabezado: 'Condición de la mercancía',
      clave: (fila) => fila.condicionMercancia,
      orden: 5,
    },
    {
      encabezado: 'Fracción arancelaria',
      clave: (fila) => fila.fraccionArancelaria,
      orden: 6,
    },
    {
      encabezado: 'Unidad de medida',
      clave: (fila) => fila.unidadMedida,
      orden: 7,
    },
    {
      encabezado: 'Cantidad autorizada',
      clave: (fila) => fila.cantidadImportarExportar,
      orden: 8,
    },
    {
      encabezado: 'Valor autorizado',
      clave: (fila) => fila.valorAutorizado,
      orden: 9,
    },
    {
      encabezado: 'Fecha Inicio de Vigencia de la Resolución',
      clave: (fila) => fila.inicioResolucion,
      orden: 10,
    },
    {
      encabezado: 'Fecha Fin de Vigencia de la resolución',
      clave: (fila) => fila.vigenciaResolucion,
      orden: 11,
    },
  ];
  /**
   * Configuración para la selección de filas en la tabla.
   */
  tipoSeleccionSolicitud: TablaSeleccion = TablaSeleccion.CHECKBOX;
  /**
   * Almacena los registros de cancelación para mostrar en la tabla.
   */
  cuerpoTablaCancelacion: Cancelacion[] = [];

  /**
   * Almacena los registros seleccionados de la tabla de cancelación.
   *
   * @property {Cancelacion[]} cuerpoTablaSeleccionado
   * @description Contiene los registros seleccionados por el usuario para realizar acciones como eliminar.
   */
  cuerpoTablaSeleccionado: Cancelacion[] = [];

  /**
   * Referencia al elemento del modal para buscar mercancías.
   *
   * Se utiliza para abrir o cerrar el modal de búsqueda.
   */
  @ViewChild('modalBuscar') modalBuscar!: ElementRef;

  /**
   * Indica si el usuario tiene permiso para realizar ciertas acciones.
   */
  public datosDePermiso: boolean = false;

  /**
   * @descripcion
   * Referencia al elemento del modal de modificación.
   */
  @ViewChild('modifyModal', { static: false }) modifyModal!: ElementRef;

  /**
   * Referencia al botón para cerrar el modal.
   *
   * Se utiliza para cerrar el modal de manera programada.
   */
  @ViewChild('closeModal') closeModal!: ElementRef;

  /**
   * @public
   * @property {Notificacion} nuevaNotificacion
   * @description Representa una nueva notificación que se utilizará en el componente.
   * @command Este campo debe ser inicializado antes de su uso.
   */
  public nuevaNotificacion!: Notificacion;
  /**
   * @public
   * @property {Notificacion} nuevaNotificacion
   * @description Representa una nueva notificación que se utilizará en el componente.
   * @command Este campo debe ser inicializado antes de su uso.
   */
  public nuevaNotificacionUno!: Notificacion;

  /**
   * Formulario utilizado para capturar el número de folio del trámite.
   * Este formulario incluye validaciones requeridas y de patrón numérico.
   */
  public busquedaForm!: FormGroup;
  /**
   * Indica si una fila de la tabla está seleccionada.
   * Cuando es `true`, significa que al menos una fila ha sido seleccionada por el usuario.
   * Esto puede ser útil para habilitar o deshabilitar acciones basadas en la selección.
   * */
  esRowSelected: boolean = false;

  /**
   * Indica si se está en el proceso de eliminación de registros.
   * Cuando es `true`, significa que el usuario ha iniciado una acción para eliminar uno o más registros.
   * Esto puede activar la visualización de un modal de confirmación o habilitar opciones relacionadas con la eliminación.
   * */
  esEliminarDos: boolean = false;

  /**
   * Almacena los datos detallados del permiso obtenidos por folio de resolución.
   * Se utiliza para mostrar la información en el modal de modificación.
   */
  detalleDelPermisoDatos: DetalleDelBuscarResponse[] | null = null;

  storeData!: Solicitud140104State;

  /**
   * Constructor del componente.
   *
   * @param fb Servicio para la creación de formularios reactivos.
   * @param servicioDeMensajesService Servicio para la gestión de mensajes y datos compartidos.
   * @param consultaQuery Consulta para obtener el estado de la sección de consulta.
   * @param desistimientoQuery Consulta para obtener el motivo de cancelación.
   */
  constructor(
    private fb: FormBuilder,
    private servicioDeMensajesService: ServicioDeMensajesService,
    private consultaQuery: ConsultaioQuery,
    private desistimientoQuery: DesistimientoQuery,
    private serviciosService: ServiciosService,
    private store: DesistimientoStore
  ) {
    this.establecerBusquedaForm();
    this.desistimientoQuery.selectSolicitud$.pipe(
      takeUntil(this.destroyNotificationSubject$)
    ).subscribe((state) => {
      this.storeData = state;
      this.cancelacionForm.patchValue({
        motivoCancelacion: this.storeData.motivoCancelacion
      });
    });
  }
  /**
   * Método que se ejecuta al iniciar el componente.
   * Inicializa los formularios de solicitud y cancelación,
   * así como sus validaciones. También suscribe a los datos
   * del servicio de mensajes para actualizar la tabla y los datos
   * de la solicitud de cancelación.
   */
  ngOnInit(): void {
    this.cancelacionForm = this.fb.group({
      motivoCancelacion: [this.storeData.motivoCancelacion, [Validators.required, Validators.maxLength(250)]],
    });

    this.servicioDeMensajesService.datos$.subscribe((datos) => {
      this.datosDePermiso = datos;
      if (this.datosDePermiso) {
        this.servicioDeMensajesService.actualizarDatosForma(
          this.cuerpoTablaCancelacion as Cancelacion[]
        );
      }
    });

    // Suscripción a los datos del servicio para llenar la tabla
    this.servicioDeMensajesService
      .obtenerDatos()
      .pipe(takeUntil(this.destroyNotificationSubject$))
      .subscribe((data) => {
        if (Array.isArray(data)) {
          this.cuerpoTablaCancelacion = data as Cancelacion[];
        } else {
          this.cuerpoTablaCancelacion = [];
        }
      });

    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotificationSubject$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          if(this.esFormularioSoloLectura === true) {
            this.cancelacionForm.get('motivoCancelacion')?.disable();
          }
        })
      )
      .subscribe();
  }

  /**
   * @description Actualiza las ventas totales en el store y recalcula el reporte.
   * @param evento - Evento del input para capturar el valor introducido.
   */
  motivoCancelacion(evento: Event): void {
    const VALUE = (evento.target as HTMLInputElement).value;
    this.servicioDeMensajesService.actualizarEstadoFormulario({
      motivoCancelacion: VALUE,
    });
  }

  /**
   * Muestra el formulario modal para buscar mercancías.
   * Inicializa la instancia del modal si no está creada y luego lo muestra.
   * @return void
   * */
  showForm(): void {
    if (this.modalBuscar) {
      if (!this.modalInstances) {
        this.modalInstances = new Modal(this.modalBuscar.nativeElement);
      }
    }
    this.modalInstances?.show();
  }

  /**
   * Inicializa el formulario de búsqueda de trámites.
   * Contiene el campo `folioResolucion` con validaciones de requerido y solo números.
   */
  public establecerBusquedaForm(): void {
    this.busquedaForm = this.fb.group({
      folioResolucion: ['', [Validators.required]],
    });
  }

  /**
   * Cierra el modal activo.
   *
   * Este método utiliza la referencia al botón de cierre del modal para cerrarlo
   * y resetea el estado de validación del formulario de mercancía.
   */
  cerrarModal(): void {
    if (this.closeModal) {
      this.closeModal.nativeElement.click();
    }

    if (this.modalInstances) {
      this.modalInstances.hide();
    }
  }

  /**
   * @descripcion
   * Hook del ciclo de vida que se llama después de que la vista del componente se haya inicializado.
   * Inicializa el modal de modificación.
   */
  ngAfterViewInit(): void {
    if (this.modifyModal) {
      this.modalInstanceDos = new Modal(this.modifyModal.nativeElement);
    }
  }

  /**
   * Busca el folio de resolución ingresado en el formulario.
   * Valida que el campo no esté vacío y muestra una notificación si es requerido.
   * Si el valor es válido, obtiene el detalle del permiso y abre el modal de modificación.
   */
  buscarFolioResolucion(): void {
    const FOLIORESOLUCIONVALUE =
      this.busquedaForm.get('folioResolucion')?.value;

    if (!FOLIORESOLUCIONVALUE || FOLIORESOLUCIONVALUE === '') {
      this.nuevaNotificacion = {
        tipoNotificacion: TipoNotificacionEnum.ALERTA,
        categoria: CategoriaMensaje.ALERTA,
        modo: 'action',
        titulo: '',
        mensaje: 'El Folio de Resolución es un dato requerido',
        cerrar: false,
        tiempoDeEspera: 2000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
      return;
    }
    if (FOLIORESOLUCIONVALUE || FOLIORESOLUCIONVALUE !== '') {
      this.obtenerDetalleDelPermisoDatos();
      if (this.modalInstanceDos) {
        this.modalInstanceDos.show();
      }
    }
  }

  /**
   * Obtiene el detalle del permiso según el folio de resolución ingresado.
   * Realiza la petición al servicio y mapea la respuesta para mostrarla en el modal.
   */
  obtenerDetalleDelPermisoDatos(): void {
    const PAYLOAD = {
      id_solicitud: Number(this.tramiteID),
      rfc_solicitante: 'AAL0409235E6',
      clave_entidad_federativa: 'SIN',
      id_tipo_tramite: Number(this.tramiteID),
      folio_cancelar: this.busquedaForm.get('folioResolucion')?.value,
    };

    this.serviciosService
      .obtenerDetalleDelPermisoDatos(this.tramiteID, PAYLOAD)
      .pipe(
        map((data: BaseResponse<DetalleDelBuscarResponse[]>) =>
          (data.datos ?? []).map((item) => this.mapDetalleDelPermiso(item))
        )
      )
      .subscribe({
        next: (response: DetalleDelBuscarResponse[]) => {
          this.detalleDelPermisoDatos = response;
        },
        error: (err) => {
          console.error('Error al obtener detalle del permiso:', err);
        },
      });
  }

  /**
   * Mapea los campos relacionados con mercancía y valores de la respuesta.
   * @param item DetalleDelBuscarResponse
   * @returns Campos seleccionados de DetalleDelBuscarResponse
   */
  private mapMercanciaYValores(
    item: DetalleDelBuscarResponse
  ): Pick<
    DetalleDelBuscarResponse,
    | 'descripcionMercancia'
    | 'condicionMercancia'
    | 'fraccion'
    | 'clasificacionRegimen'
    | 'esquemaReglaOctava'
    | 'regimen'
    | 'usoEspecifico'
    | 'cantidadAutorizada'
    | 'cantidadSolicitada'
    | 'valorSolicitado'
    | 'valorFacturaUSD'
    | 'saldoDisponible'
    | 'unidadMedidaUMT'
    | 'unidadMedidaUMC'
    | 'unidadMedicion'
    | 'claveEntidadFederativaSolicitante'
    | 'fechaInicioVigencia'
    | 'fechaFinVigencia'
  > {
    return {
      descripcionMercancia: item.descripcionMercancia ?? null,
      condicionMercancia: item.condicionMercancia ?? null,
      fraccion: item.fraccion ?? null,
      clasificacionRegimen: item.clasificacionRegimen ?? null,
      esquemaReglaOctava: item.esquemaReglaOctava ?? null,
      regimen: item.regimen ?? null,
      usoEspecifico: item.usoEspecifico ?? null,
      cantidadAutorizada: item.cantidadAutorizada ?? null,
      cantidadSolicitada: item.cantidadSolicitada ?? null,
      valorSolicitado: item.valorSolicitado ?? null,
      valorFacturaUSD: item.valorFacturaUSD ?? null,
      saldoDisponible: item.saldoDisponible ?? null,
      unidadMedidaUMT: item.unidadMedidaUMT ?? null,
      unidadMedidaUMC: item.unidadMedidaUMC ?? null,
      unidadMedicion: item.unidadMedicion ?? null,
      claveEntidadFederativaSolicitante:
        item.claveEntidadFederativaSolicitante ?? null,
      fechaInicioVigencia: item.fechaInicioVigencia ?? null,
      fechaFinVigencia: item.fechaFinVigencia ?? null,
    };
  }

  /**
   * Mapea los campos generales e identificadores de la respuesta.
   * @param item DetalleDelBuscarResponse
   * @returns Campos seleccionados de DetalleDelBuscarResponse
   */
  private mapGeneralYIds(
    item: DetalleDelBuscarResponse
  ): Omit<
    DetalleDelBuscarResponse,
    | 'descripcionMercancia'
    | 'condicionMercancia'
    | 'fraccion'
    | 'clasificacionRegimen'
    | 'esquemaReglaOctava'
    | 'regimen'
    | 'usoEspecifico'
    | 'cantidadAutorizada'
    | 'cantidadSolicitada'
    | 'valorSolicitado'
    | 'valorFacturaUSD'
    | 'saldoDisponible'
    | 'unidadMedidaUMT'
    | 'unidadMedidaUMC'
    | 'unidadMedicion'
    | 'claveEntidadFederativaSolicitante'
    | 'fechaInicioVigencia'
    | 'fechaFinVigencia'
  > {
    return {
      aviso: item.aviso ?? '',
      tipoSolicitud: item.tipoSolicitud ?? null,
      tipoSolicitudPexim: item.tipoSolicitudPexim ?? null,
      numFolioTramite: item.numFolioTramite ?? null,
      numeroResolucion: item.numeroResolucion ?? null,
      justificacion: item.justificacion ?? null,
      observacion: item.observacion ?? null,
      textoDictamen: item.textoDictamen ?? null,
      idResolucion: item.idResolucion ?? null,
      idSolicitud: item.idSolicitud ?? null,
      idSolicitudTemporal: item.idSolicitudTemporal ?? null,
      idTipoTramite: item.idTipoTramite ?? null,
      ideEstadoResolucion: item.ideEstadoResolucion ?? null,
      ideEstadoSolicitud: item.ideEstadoSolicitud ?? null,
      general: item.general ?? null,
      paises: item.paises ?? null,
      rfcSolicitante: item.rfcSolicitante ?? null,
    };
  }

  /**
   * Combina los mapeos de mercancía/valores y generales/ids en un solo objeto.
   * @param item DetalleDelBuscarResponse
   * @returns DetalleDelBuscarResponse
   */
  private mapDetalleDelPermiso(
    item: DetalleDelBuscarResponse
  ): DetalleDelBuscarResponse {
    return {
      ...this.mapMercanciaYValores(item),
      ...this.mapGeneralYIds(item),
    };
  }

  /**
   * Cierra el modal de modificación y resetea el formulario de búsqueda.
   */
  cerrarModificarModal(): void {
    if (this.modalInstances) {
      this.modalInstances.hide();
      this.busquedaForm.reset();
    }
    if (this.modalInstanceDos) {
      this.modalInstanceDos.hide();
    }
  }

  /**
   * Método que se ejecuta al destruir el componente.
   * Limpia los datos de permiso en el servicio de mensajes
   * para evitar posibles fugas de memoria o actualizaciones
   * innecesarias cuando el componente ya no está activo.
   */
  ngOnDestroy(): void {
    this.servicioDeMensajesService.establecerDatosDePermiso(false);
    this.destroyNotificationSubject$.next();
    this.destroyNotificationSubject$.complete();
  }

  /**
   * Método que se ejecuta al realizar una búsqueda.
   * Envía un mensaje al servicio para indicar que se ha iniciado una búsqueda.
   *
   * @param event Evento que desencadena la búsqueda.
   */

  public busqueda(_event: Event): void {
    this.servicioDeMensajesService.enviarMensaje(true);
  }

  /**
   * Obtiene los datos del subfabricante por eliminar.
   * @method cueroEliminar
   * @param {SubfabricanteDireccionModelo[]} event - Evento con los datos del subfabricante por eliminar.
   */
  cuerpoTablaSelectionEliminar(event: Cancelacion[]): void {
    this.cuerpoTablaSeleccionado = event;
  }

  /**
   * Método para cerrar el modal de confirmación.
   * @returns {void}
   */
  cerrarTabla(): void {
    this.esRowSelected = false;
  }

  /**
   * Elimina las empresas nacionales seleccionadas del grid.
   * @method eliminarEmpresasNacionales
   * @return {void}
   */

  cerrarEliminarDos(evento: boolean): void {
    this.esEliminarDos = false;
    if (evento === true) {
      this.cuerpoTablaCancelacion = [];
      this.servicioDeMensajesService.actualizarDatosForma(
        this.cuerpoTablaCancelacion as Cancelacion[]
      );
      this.cuerpoTablaSeleccionado = [];
    }
  }
  /**
   * Método que se ejecuta al eliminar un registro de la tabla.
   * Limpia el contenido de la tabla de cancelación y actualiza los datos
   * en el servicio de mensajes.
   *
   * @param event Evento que desencadena la eliminación.
   */
  eliminarRegistro(): void {
    if (this.cuerpoTablaSeleccionado.length === 0) {
      this.nuevaNotificacionUno = {
        tipoNotificacion: TipoNotificacionEnum.ALERTA,
        categoria: CategoriaMensaje.ALERTA,
        modo: 'action',
        titulo: '',
        mensaje: 'Seleccione un registro a eliminar.',
        cerrar: false,
        tiempoDeEspera: 200,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
      this.esRowSelected = true;
    } else {
      this.nuevaNotificacionUno = {
        tipoNotificacion: TipoNotificacionEnum.ALERTA,
        categoria: CategoriaMensaje.ALERTA,
        modo: 'modal',
        titulo: '',
        mensaje: '¿Esta seguro que desea eliminar el registro marcado?',
        cerrar: false,
        tiempoDeEspera: 200,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: 'Cancelar',
      };
      this.esEliminarDos = true;
    }
  }

  /**
   * Establece los valores en el store del trámite 120501.
   *
   * LicitacionesVigentesComponent
   * El formulario que contiene los valores.
   * El nombre del campo en el formulario.
   * El nombre del método en el store a invocar.
   *
   */
  setValoresStore(form: FormGroup, campo: string): void {
    const VALOR = form.get(campo)?.value;
    this.store.actualizarEstado({ [campo]: VALOR });
  }
}
