import { Catalogo, ConsultaioQuery, ConsultaioState, Notificacion, NotificacionesComponent, TipoNotificacionEnum, TituloComponent } from '@ng-mf/data-access-user';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CuposDisponiblesBuscarResponse, DetalleSolicitudBuscarResponse, ObtenerCertificadosDisponiblesResponse } from '../../../../shared/models/cupos-disponibles.model';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Solicitud140205State, Solicitud140205Store } from '../../estados/store/solicitud140205.store';
import { Subject, Subscription, map, takeUntil } from 'rxjs';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/shared/base-response.model';
import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src/tramites/components/catalogo-select/catalogo-select.component';
import { CatalogoServices } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { ConfiguracionColumna } from '@libs/shared/data-access-user/src/core/models/shared/configuracion-columna.model';
import { DevolverComponent } from '../devolver/devolver.component';
import { ModalComponent } from '../model/modal.component';
import { NUEVO_CUPOS } from '../../constants/detalle.enum';
import { ServiciosService } from '../../../../shared/services/servicios.service';
import { Solicitud140205Query } from '../../estados/query/solicitud140205.query';
import { TablaDinamicaComponent } from '@libs/shared/data-access-user/src/tramites/components/tabla-dinamica/tabla-dinamica.component';
import { TablaSeleccion } from '@libs/shared/data-access-user/src/core/enums/tabla-seleccion.enum';

@Component({
  selector: 'app-cancelacion-de-certificado',
  standalone: true,
  imports: [
    CatalogoSelectComponent,
    CommonModule,
    FormsModule,
    NotificacionesComponent,
    ReactiveFormsModule,
    TablaDinamicaComponent,
    TituloComponent,
    ModalComponent,
    DevolverComponent
  ],
  templateUrl: './cancelacion-de-certificado.component.html',
  styleUrl: './cancelacion-de-certificado.component.css',
})
export class CancelacionDeCertificateComponent implements OnInit, OnDestroy {
  /**
   * Indica si el diálogo de notificación está habilitado.
   */
  public esHabilitarElDialogo: boolean = false;
  public showCapturaMontoModal:boolean =false;
  public showDevolverModal = false;
  /**
   * Lista de cupos disponibles obtenidos a partir de la búsqueda realizada.
   */
  CuposDisponiblesDatos: CuposDisponiblesBuscarResponse[] = [];

  /**
   * Lista de certificados disponibles obtenidos desde el servicio correspondiente.
   */
  CertificadosDisponiblesDatos: ObtenerCertificadosDisponiblesResponse[] = [];

  /**
   * Lista de certificados que pueden ser cancelados según la selección del usuario.
   */
  CertificadosCancelarDatos: ObtenerCertificadosDisponiblesResponse[] = [];

  //Seleccionados
  /**
   * Cupo disponible seleccionado actualmente por el usuario en la lista de cupos.
   */
  cuposDisponiblesSeleccionado: CuposDisponiblesBuscarResponse | null = null;

  /**
   * Certificado disponible seleccionado actualmente por el usuario en la lista de certificados.
   */
  CertificadosDisponiblesSeleccionado: ObtenerCertificadosDisponiblesResponse | null =
    null;

  /**
   * Certificado seleccionado por el usuario para cancelar.
   */
  certificadosCancelarSeleccionado: ObtenerCertificadosDisponiblesResponse | null =
    null;

  /**
   * Indica si se debe mostrar la sección de certificados para cancelar.
   */
  mostrarCertificadosCancelar: boolean = false;

  /**
   * Configuración del tipo de selección en la tabla (en este caso, se usa un checkbox).
   */
  TablaSeleccion = TablaSeleccion.CHECKBOX;

  /**
   * Formulario reactivo para la cancelación de certificados.
   */
  cancelacionForm!: FormGroup;

  /**
   * Formulario reactivo para los detalles del cupo seleccionado.
   */
  detalleForm!: FormGroup;

  /**
   * Formulario reactivo para los datos del oficio relacionados con la cancelación.
   */
  oficioForm!: FormGroup;

  /**
   * Catálogo de regímenes disponibles.
   */
  public regimenDatos!: Catalogo[];

  /**
   * Catálogo de mecanismos de asignación disponibles.
   */
  public mecanismoDatos!: Catalogo[];

  /**
   * Catálogo de tratados disponibles.
   */
  public tratadoDatos!: Catalogo[];

  /**
   * Catálogo de nombres de productos disponibles.
   */
  public nombreProductoDatos!: Catalogo[];

  /**
   * Catálogo de subproductos disponibles.
   */
  public subProductoDatos!: Catalogo[];

  /**
   * Catálogo de representaciones federales disponibles.
   */
  public representacionDatos!: Catalogo[];

  /**
   * @description
   * Objeto que representa una nueva notificación.
   * Se utiliza para mostrar mensajes de alerta o información al usuario.
   */
  public nuevaNotificacion!: Notificacion;

  /**
   * Estado actual de la solicitud 140205.
   */
  public solicitudState!: Solicitud140205State;

  /**
   * Subject utilizado para cancelar suscripciones y evitar fugas de memoria.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Estado actual de la consulta IO.
   */
  public consultaState!: ConsultaioState;

  /**
   * Indica si el formulario está en modo solo lectura.
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Indica si el formulario ha sido enviado.
   */
  submitted = false;

  /**
   * Suscripción utilizada para gestionar y limpiar las suscripciones a observables dentro del componente.
   * Se inicializa como una nueva instancia de Subscription y se utiliza para agregar todas las suscripciones
   * que deben ser canceladas cuando el componente se destruye.
   */
  private subscription: Subscription = new Subscription();

  /**
   * Identificador del trámite utilizado para cargar catálogos y realizar operaciones específicas del trámite 140205.
   */
  tramiteId = '140205';

  /**
   * Configuración de las columnas para la tabla de cupos disponibles.
   * Cada objeto define el encabezado, la clave de acceso y el orden de la columna.
   *
   * - `encabezado`: Título de la columna que se muestra en la tabla.
   * - `clave`: Función que recibe un elemento de tipo `CuposDisponiblesBuscarResponse` y retorna el valor a mostrar en la columna.
   * - `orden`: Posición de la columna en la tabla.
   */
  configuracionTabla: ConfiguracionColumna<CuposDisponiblesBuscarResponse>[] = [
    {
      encabezado: 'Cupo',
      clave: (item: CuposDisponiblesBuscarResponse) => item.idCupo,
      orden: 1,
    },
    {
      encabezado: 'Nombre de Producto',
      clave: (item: CuposDisponiblesBuscarResponse) => item.nombreProducto,
      orden: 2,
    },
    {
      encabezado: 'Nombre del Subproducto',
      clave: (item: CuposDisponiblesBuscarResponse) =>
        item.nombreSubproducto ?? undefined,
      orden: 3,
    },
    {
      encabezado: 'Mecanismo de Asignación',
      clave: (item: CuposDisponiblesBuscarResponse) => item.mecanismoAsignacion,
      orden: 4,
    },
    {
      encabezado: 'Tipo Cupo',
      clave: (item: CuposDisponiblesBuscarResponse) => item.tipoCupo,
      orden: 5,
    },
  ];

  /**
   * Configuración de las columnas para la tabla de certificados disponibles.
   * Cada objeto define el encabezado, la clave de acceso y el orden de la columna.
   *
   * - `encabezado`: Título de la columna que se muestra en la tabla.
   * - `clave`: Función que recibe un elemento de tipo `ObtenerCertificadosDisponiblesResponse` y retorna el valor a mostrar en la columna.
   * - `orden`: Posición de la columna en la tabla.
   */
  configuracionTablaCertificados: ConfiguracionColumna<ObtenerCertificadosDisponiblesResponse>[] =
    [
      {
        encabezado: 'Folio del oficio de certificado',
        clave: (item: ObtenerCertificadosDisponiblesResponse) =>
          item.numCertificado,
        orden: 1,
      },
      {
        encabezado: 'Nombre',
        clave: (item: ObtenerCertificadosDisponiblesResponse) =>
          item.numFolioOficio,
        orden: 2,
      },
      {
        encabezado: 'Denominación o Razón Social',
        clave: (item: ObtenerCertificadosDisponiblesResponse) =>
          item.denominacion,
        orden: 3,
      },
      {
        encabezado: 'Estado',
        clave: (item: ObtenerCertificadosDisponiblesResponse) => item.estado,
        orden: 4,
      },
      {
        encabezado: 'Monto expedido',
        clave: (item: ObtenerCertificadosDisponiblesResponse) =>
          item.montoExpedido,
        orden: 5,
      },
      {
        encabezado: 'Monto a cancelar',
        clave: (item: ObtenerCertificadosDisponiblesResponse) =>
          item.montoCancelado,
        orden: 6,
      },
      {
        encabezado: 'Monto utilizado',
        clave: (item: ObtenerCertificadosDisponiblesResponse) =>
          item.montoEjercidoCBP,
        orden: 7,
      },
    ];

  /**
   * Constructor del componente.
   *
   * @param fb Servicio para la construcción de formularios reactivos.
   * @param solicitud140205Store Store para el manejo del estado del trámite 140205.
   * @param tramite140205Query Query para obtener el estado del store de trámite 140205.
   * @param consultaioQuery Query para obtener el estado del store de consulta IO.
   * @param catalogoService Servicio para la obtención de catálogos.
   * @param regimenService Servicio para la obtención de regímenes.
   * @param serviciosService Servicio para operaciones relacionadas con los servicios del trámite.
   */
  constructor(
    private fb: FormBuilder,
    private solicitud140205Store: Solicitud140205Store,
    private solicitud140205Query: Solicitud140205Query,
    private consultaioQuery: ConsultaioQuery,
    private catalogoService: CatalogoServices,
    private serviciosService: ServiciosService
  ) {
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.inicializarEstadoFormulario();

          this.consultaState = seccionState;
          if (this.consultaState.update) {
            this.solicitud140205Store.update((state) => ({
              ...state,
              cancelacion: [...state.cancelacion, NUEVO_CUPOS],
            }));
          }
        })
      )
      .subscribe();
  }

  /**
   * @method ngOnInit
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   *
   * Inicializa el formulario reactivo mediante `inicializarFormulario()` y configura
   * su estado inicial llamando a `inicializarEstadoFormulario()`.
   */
  ngOnInit(): void {
    this.inicializarCatalogo(this.tramiteId);
    this.inicializarFormulario();
    this.inicializarEstadoFormulario();
  }

  /**
   * Determina si se debe cargar un formulario nuevo o uno existente.
   * Ejecuta la lógica correspondiente según el estado del componente.
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    }
  }

  /**
   * Inicializa los catálogos del componente a partir del archivo JSON importado.
   * Asigna los valores de cada catálogo a las propiedades correspondientes.
   * Puede ser llamado para recargar los catálogos si el JSON cambia dinámicamente.
   */
  inicializarCatalogo(tramite: string): void {
    this.subscription.add(
      this.catalogoService
        .regimenEnumCatalogo(tramite)
        .pipe(takeUntil(this.destroyNotifier$))
        .subscribe((response) => {
          const DATOS = response.datos as Catalogo[];

          if (response) {
            this.regimenDatos = DATOS;
          }
        })
    );
    this.subscription.add(
      this.catalogoService
        .tipoMecanismoAsignacionCatalogo(tramite)
        .pipe(takeUntil(this.destroyNotifier$))
        .subscribe((response) => {
          const DATOS = response.datos as Catalogo[];
          if (response) {
            this.mecanismoDatos = DATOS;
          }
        })
    );
    this.subscription.add(
      this.catalogoService
        .tratadosAcuerdoCatalogo(tramite, 'TITRAC.TA')
        .pipe(takeUntil(this.destroyNotifier$))
        .subscribe((response) => {
          const DATOS = response.datos as Catalogo[];
          if (response) {
            this.tratadoDatos = DATOS;
          }
        })
    );
    this.subscription.add(
      this.catalogoService
        .nombreProductoCatalogo(tramite)
        .pipe(takeUntil(this.destroyNotifier$))
        .subscribe((response) => {
          const DATOS = response.datos as Catalogo[];
          if (response) {
            this.nombreProductoDatos = DATOS;
          }
        })
    );
    this.subscription.add(
      this.catalogoService
        .nombreSubproductoCatalogo(tramite)
        .pipe(takeUntil(this.destroyNotifier$))
        .subscribe((response) => {
          const DATOS = response.datos as Catalogo[];
          if (response) {
            this.subProductoDatos = DATOS;
          }
        })
    );
    this.subscription.add(
      this.catalogoService
        .catalogoRepresentacionFederal(tramite)
        .pipe(takeUntil(this.destroyNotifier$))
        .subscribe((response) => {
          const DATOS = response.datos as Catalogo[];
          if (response) {
            this.representacionDatos = DATOS;
          }
        })
    );
  }

  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(): void {
    this.inicializarFormulario();
    if (this.cancelacionForm && this.esFormularioSoloLectura) {
      this.cancelacionForm.disable();
    } else if (!this.esFormularioSoloLectura) {
      this.cancelacionForm.enable();
    }
  }

  /**
   * Inicializa el formulario reactivo para la cancelación de certificados.
   * Configura los controles del formulario con sus validaciones y realiza la suscripción
   * al estado de la solicitud para actualizar los valores del formulario en base al store.
   *
   * - Crea el formulario con los campos requeridos y sus validaciones.
   * - Se suscribe al observable del estado de la solicitud para mantener sincronizados los valores.
   * - Realiza un patchValue para establecer los valores actuales del store en el formulario.
   */
  private inicializarFormulario(): void {
    this.cancelacionForm = this.fb.group({
      regimen: ['', Validators.required],
      mecanismo: ['', Validators.required],
      tratado: [-1],
      producto: [''],
      subproducto: [''],
      representacion: [''],
    });
    this.detalleForm = this.fb.group({
      regimen: [{ value: '', disabled: true }],
      descripcion: [{ value: '', disabled: true }],
      clasificacion: [{ value: '', disabled: true }],
      unidad: [{ value: '', disabled: true }],
      mecanismo: [{ value: '', disabled: true }],
      tratado: [{ value: '', disabled: true }],
      fracciones: [{ value: '', disabled: true }],
      paises: [{ value: '', disabled: true }],
      observaciones: [{ value: '', disabled: true }],
      fundamentos: [{ value: '', disabled: true }],
      inicio: [{ value: '', disabled: true }],
      fecha: [{ value: '', disabled: true }],
    });
    this.oficioForm = this.fb.group({
      sumaAprobada: [{ value: '', disabled: true }],
      montoDisponible: [{ value: '', disabled: true }],
      sumaExpedida: [{ value: '', disabled: true }],
      denominacionExposicion: [{ value: '', disabled: true }],
      cancelar:['']
    });
    this.suscribirseAlEstadoDeSolicitud();
  }

  /**
   * Se suscribe al observable del estado de la solicitud 140205 para mantener sincronizada
   * la propiedad `solicitudState` con el estado actual del store.
   *
   * Utiliza el operador `takeUntil` para cancelar la suscripción automáticamente cuando
   * el componente se destruye, evitando fugas de memoria.
   */
  suscribirseAlEstadoDeSolicitud(): void {
    this.solicitud140205Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState as Solicitud140205State;
        })
      )
      .subscribe();
  }

  /**
   * Maneja el evento de clic en una fila de la tabla de cupos disponibles.
   *
   * @param event - El objeto CuposDisponiblesBuscarResponse correspondiente a la fila seleccionada.
   *
   * Al seleccionar una fila, se actualiza la propiedad selectedCuposDisponibles y,
   * si existe una selección válida, se oculta la sección de certificados a cancelar.
   */
  filaClicCuposDisponibles(event: CuposDisponiblesBuscarResponse): void {
    this.cuposDisponiblesSeleccionado = event;
    if (this.cuposDisponiblesSeleccionado) {
      this.mostrarCertificadosCancelar = true;
      this.obtenerCertificadosDisponiblesDatos();
      this.obtenerDetalleSolicitud();
    }
  }

  /**
   * Busca los cupos disponibles según los valores seleccionados en el formulario.
   *
   * Este método valida que los campos requeridos (régimen y mecanismo) estén completos.
   * Si no lo están, emite un evento indicando que la búsqueda es inválida.
   * Si los campos requeridos están completos, construye el payload y llama al servicio
   * para obtener los cupos disponibles, actualizando la propiedad `CuposDisponiblesDatos`
   * con la respuesta. También emite un evento indicando que la búsqueda fue enviada y válida.
   *
   * @returns {void}
   */
  buscarCupoDisponible(): void {
    const REGIMEN_CONTROL = this.cancelacionForm.get('regimen');
    const MECANISMO_CONTROL = this.cancelacionForm.get('mecanismo');
    if (!REGIMEN_CONTROL?.value || !MECANISMO_CONTROL?.value) {
      return;
    }
    if (REGIMEN_CONTROL?.value && MECANISMO_CONTROL?.value) {
      const PAYLOAD = {
        rfc_solicitante: 'AAL0409235E6',
        cupo_disponible: {
          nombreProducto:
            this.cancelacionForm.get('producto')?.value?.toString().trim() ===
            ''
              ? '-1'
              : this.cancelacionForm.get('producto')?.value,
          nombreSubproducto:
            this.cancelacionForm
              .get('subproducto')
              ?.value?.toString()
              .trim() === ''
              ? '-1'
              : this.cancelacionForm.get('subproducto')?.value,
          mecanismoAsignacion:
            MECANISMO_CONTROL?.value?.toString().trim() === ''
              ? '-1'
              : MECANISMO_CONTROL?.value,
          claveRegimen:
            REGIMEN_CONTROL.value?.toString().trim() === ''
              ? '-1'
              : REGIMEN_CONTROL.value,
          idTratadoAcuerdo:
            this.cancelacionForm.get('tratado')?.value?.toString().trim() ===
              '' || isNaN(Number(this.cancelacionForm.get('tratado')?.value))
              ? -1
              : Number(this.cancelacionForm.get('tratado')?.value),
          claveRepresentacionFederal:
            this.cancelacionForm
              .get('representacion')
              ?.value?.toString()
              .trim() === ''
              ? '-1'
              : this.cancelacionForm.get('representacion')?.value,
        },
      };
      this.serviciosService
        .obtenerCuposDisponibles(this.tramiteId, PAYLOAD)
        .pipe(
          map(
            (data: BaseResponse<CuposDisponiblesBuscarResponse[]>) =>
              data.datos ?? []
          )
        )
        .subscribe({
          next: (response: CuposDisponiblesBuscarResponse[]) => {
            this.CuposDisponiblesDatos = response;
          },
          error: (err) => {
            console.error('Error al obtener cupos disponibles:', err);
          },
        });
    }
  }

  /**
   * Obtiene la lista de certificados disponibles según el régimen y el mecanismo
   * seleccionados en el formulario de cancelación.
   * @returns {void} No devuelve ningún valor directamente.
   */
  obtenerCertificadosDisponiblesDatos(): void {
    const REGIMEN_CONTROL = this.cancelacionForm.get('regimen');
    const MECANISMO_CONTROL = this.cancelacionForm.get('mecanismo');
    if (!REGIMEN_CONTROL?.value || !MECANISMO_CONTROL?.value) {
      return;
    }
    if (REGIMEN_CONTROL?.value && MECANISMO_CONTROL?.value) {
      const PAYLOAD = {
        rfc: 'AFC000526BJ2',
        mecanismo_asignacion: {
          idMecanismoAsignacion: 10226,
          ideTipoMecAsignacion: MECANISMO_CONTROL.value,
          cupo: {
            regimen: REGIMEN_CONTROL.value,
            ideTipoCupo: MECANISMO_CONTROL.value,
            cveUnidadMedidaOficialCupo: '',
          },
        },
      };
      this.serviciosService
        .obtenerCertificadosDisponibles(this.tramiteId, PAYLOAD)
        .pipe(
          map(
            (data: BaseResponse<ObtenerCertificadosDisponiblesResponse[]>) =>
              data.datos ?? []
          )
        )
        .subscribe({
          next: (response: ObtenerCertificadosDisponiblesResponse[]) => {
            this.CertificadosDisponiblesDatos = response;
          },
          error: (err) => {
            console.error('Error al obtener certificados disponibles:', err);
          },
        });
    }
  }

  obtenerDetalleSolicitud(): void {
    const PAYLOAD = {
      rfc: 'AAL0409235E6',
      id_mecanismo_asignacion: 10226,
    };

    this.serviciosService
      .obtenerDetalleSolicitud(this.tramiteId, PAYLOAD)
      .pipe(
        map((data: BaseResponse<DetalleSolicitudBuscarResponse>) => data.datos)
      )
      .subscribe(
        (DETALLE: DetalleSolicitudBuscarResponse | undefined) => {
          if (!DETALLE) {
            return;
          }
          this.detalleForm.patchValue({
            regimen: DETALLE.mecanismo_asignacion?.cupo?.regimen ?? '',
            descripcion:
              DETALLE.mecanismo_asignacion?.cupo?.producto?.descripcion ?? '',
            clasificacion:
              DETALLE.mecanismo_asignacion?.cupo?.clasificacionProducto ?? '',
            unidad:
              DETALLE.mecanismo_asignacion?.cupo?.cveUnidadMedidaOficialCupo ??
              '',
            mecanismo:
              DETALLE.mecanismo_asignacion?.nombreMecanismoAsignacion ?? '',
            tratado: DETALLE.mecanismo_asignacion?.cupo?.idTratadoAcuerdo ?? '',
            fracciones: DETALLE.cadena_fracciones_cupo_tpl ?? '',
            paises: (DETALLE.mecanismo_asignacion?.cupo?.paisesCupo ?? []).join(
              ', '
            ),
            observaciones: DETALLE.mecanismo_asignacion?.observaciones ?? '',
            fundamentos: DETALLE.mecanismo_asignacion?.cupo?.fundamentos ?? '',
            inicio: DETALLE.mecanismo_asignacion?.fechaInicioVigencia ?? '',
            fecha: DETALLE.mecanismo_asignacion?.fechaFinVigencia ?? '',
          });

          this.oficioForm.patchValue({
            sumaAprobada: '',
            montoDisponible: '',
            sumaExpedida: '',
            denominacionExposicion: DETALLE.denominacion_exposicion ?? '',
          });
        },
        (err) =>
          console.error('Error al obtener el detalle de la solicitud:', err)
      );
  }

  /**
   * Verifica si el formulario es válido para proceder con la operación.
   *
   * @returns {boolean} Retorna `true` si existen cupos disponibles, de lo contrario `false`.
   *
   * @memberof CancelacionDeCertificateComponent
   */
  public isFormValido(): boolean {
    if (!this.CuposDisponiblesDatos.length) {
      return false;
    }
    return true;
  }

  /**
   * Actualiza la fila seleccionada del listado de certificados disponibles.
   *
   * @param filasSeleccionadas Lista de filas seleccionadas por el usuario.
   * Si hay al menos una fila seleccionada, se asigna la primera a
   * `selectedCertificadosDisponiblesFila`. Si no hay selección, se asigna `null`.
   */
  filaSeleccionadaCertificadosDisponibles(
    filasSeleccionadas: ObtenerCertificadosDisponiblesResponse[]
  ): void {
    this.CertificadosDisponiblesSeleccionado =
      filasSeleccionadas.length > 0 ? filasSeleccionadas[0] : null;
  }

  /**
   * Actualiza la fila seleccionada del listado de certificados que se pueden cancelar.
   *
   * @param filasSeleccionadas Lista de filas seleccionadas por el usuario.
   * Si hay al menos una fila seleccionada, se asigna la primera a
   * `selectedCertificadosCancelarFila`. Si no hay selección, se asigna `null`.
   */
  filaSeleccionadaCertificadosCancelar(
    filasSeleccionadas: ObtenerCertificadosDisponiblesResponse[]
  ): void {
    this.certificadosCancelarSeleccionado =
      filasSeleccionadas.length > 0 ? filasSeleccionadas[0] : null;
  }

  /**
   * Maneja la acción de seleccionar un certificado disponible.
   *
   * - Si no hay certificado seleccionado (`selectedCertificados` es null), se
   *   envían los datos necesarios al diálogo mediante `enviarDialogData`.
   * - Habilita el diálogo estableciendo `esHabilitarElDialogo` en `true`.
   */
  onSeleccionarCertificadosDisponibles(): void {
    if (!this.CertificadosDisponiblesSeleccionado) {
      this.enviarDialogData();
      this.esHabilitarElDialogo = true;
    } else {
     this.showCapturaMontoModal=true;
    }
  }

    closeCapturaMontoModal():void {
    this.showCapturaMontoModal = false;
    this.CertificadosDisponiblesSeleccionado = null;
  }



/**
 * @method abrirDevolverFacturas
 * @description
 * Abre el modal para devolver facturas, estableciendo la variable `showDevolverModal` en `true`.
 * 
 * @memberof OficioComponent
 */
abrirDevolverFacturas() : void {
  this.showDevolverModal = true;
}
  /**
   * Maneja la acción de seleccionar un certificado para eliminar/cancelar.
   *
   * - Si no hay certificado seleccionado (`selectedCertificados` es null), se
   *   envían los datos necesarios al diálogo mediante `enviarDialogData`.
   * - Habilita el diálogo estableciendo `esHabilitarElDialogo` en `true`.
   * - Si hay un certificado seleccionado, se elimina del arreglo
   *   `CertificadosCancelarDatos` y se limpia `selectedCertificados`.
   */
  onSeleccionarCertificadoEliminar(): void {
    if (!this.certificadosCancelarSeleccionado) {
      this.enviarDialogData();
      this.esHabilitarElDialogo = true;
    } else {
      this.esHabilitarElDialogo = true;
      this.CertificadosCancelarDatos = this.CertificadosCancelarDatos.filter(
        (item) => item !== this.certificadosCancelarSeleccionado
      );
      this.certificadosCancelarSeleccionado = null;
    }
  }

  /**
   * Envía los datos del formulario y muestra el modal de confirmación.
   * Si el formulario es inválido, marca todos los campos como tocados.
   */
  enviarDialogData(): void {
    this.nuevaNotificacion = {
      tipoNotificacion: TipoNotificacionEnum.ALERTA,
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: 'Seleccione un registro.',
      cerrar: false,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
  }

  /**
   * Método para cerrar el modal de confirmación.
   * @returns {void}
   */
  cerrarModal(): void {
    this.esHabilitarElDialogo = false;
  }

  /**
   * @method setValoresStore
   * Asigna el valor de un campo del formulario al store correspondiente invocando un método específico.
   *
   * @param {FormGroup} form - El formulario reactivo que contiene los valores a establecer.
   * @param {string} campo - El nombre del campo dentro del formulario del cual se obtendrá el valor.
   * @param {keyof Solicitud140205Store} metodoNombre - El nombre del método del store que se invocará para actualizar el estado.
   *
   * Se obtiene el valor del campo especificado del formulario y se llama dinámicamente
   * al método correspondiente del `Solicitud140205Store` pasándole dicho valor.
   */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof Solicitud140205Store
  ): void {
    const VALOR = form.get(campo)?.value;
    (this.solicitud140205Store[metodoNombre] as (value: unknown) => void)(
      VALOR
    );
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta justo antes de destruir el componente.
   *
   * Este método se utiliza para limpiar recursos, específicamente para completar
   * el `Subject` `destroyNotifier$`, el cual es usado en combinación con el operador `takeUntil`
   * para cancelar automáticamente las suscripciones a observables y evitar fugas de memoria.
   *
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
    this.subscription.unsubscribe();
  }
}
