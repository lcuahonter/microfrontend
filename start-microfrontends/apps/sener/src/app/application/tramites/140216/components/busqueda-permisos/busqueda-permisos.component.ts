import { BusquedaPermisos140216State, Tramite140216Store } from '../../estados/tramites/tramite140216.store';
import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FECHA_SALIDA, PERMISOS_VIGENTES_ENCABEZADO_DE_TABLA } from '../../constantes/suspension-permiso.enum';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputFecha, InputFechaComponent, Notificacion, NotificacionesComponent, TablaDinamicaComponent, TablaSeleccion, TituloComponent } from '@libs/shared/data-access-user/src';
import { PermisosVigentes, PermisosVigentesRespuesta } from '../../models/suspension-permiso.model';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { DetalleDelPermisoComponent } from '../detalle-del-permiso/detalle-del-permiso.component';
import { DetalleTitularComponent } from '../detalle-titular/detalle-titular.component';
import { Modal } from 'bootstrap';
import { PersonasNotificarComponent } from '../personas-notificar/personas-notificar.component';
import { SuspensionPermisoService } from '../../services/suspension-permiso/suspension-permiso.service';
import { Tramite140216Query } from '../../estados/queries/tramite140216.query';
import { ValidacionesFormularioService } from '@libs/shared/data-access-user/src/core/services/shared/validaciones-formulario/validaciones-formulario.service';

/**
 * Componente para la búsqueda de permisos.
 */
@Component({
  selector: 'app-busqueda-permisos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TituloComponent,
    TablaDinamicaComponent,
    InputFechaComponent,
    DetalleDelPermisoComponent,
    DetalleTitularComponent,
    PersonasNotificarComponent,
    NotificacionesComponent,
  ],
  templateUrl: './busqueda-permisos.component.html',
  styleUrl: './busqueda-permisos.component.scss',
})
export class BusquedaPermisosComponent implements OnDestroy {
  /**
   * Referencia al formulario reactivo de busquedaPermisos.
   * @type {FormGroup}
   */
  busquedaPermisosForm!: FormGroup;

  /**
   * Referencia al store de la sección de tramite 140216.
   */
  public busquedaPermisosState!: BusquedaPermisos140216State;

  /**
   * Configuración para el encabezado de la tabla de permisos vigentes.
   * @type {ConfiguracionColumna<PermisosVigentes>[]}
   */
  permisosVigentesEncabezadoDeTabla = PERMISOS_VIGENTES_ENCABEZADO_DE_TABLA;

  /**
   * Referencia a la lista de permisos vigentes.
   * @type {PermisosVigentes[]}
   */
  permisosVigentesTabla: PermisosVigentes[] = [];

  /**
   * Referencia a la lista de permisos vigentes seleccionados en la tabla.
   * @type {PermisosVigentes[]}
   */
  seleccionadaPermisosVigentesTabla: PermisosVigentes[] = [];

  /**
   * Configuración de tabla para selección de tipo checkbox.
   */
  tablaSeleccionCheckbox: TablaSeleccion = TablaSeleccion.CHECKBOX;

  /**
   * Fecha final de entrada.
   */
  fechaFinalInput: InputFecha = FECHA_SALIDA;

  /**
   * Referencia al elemento modal para mostrar detalles del RFC de la facultad.
   * @type {ElementRef}
   */
  @ViewChild('detalle-rfc-facultad', { static: false })
  modalDetalleRfcFacultad!: ElementRef;

  /**
   * Referencia al elemento modal para mostrar detalles del permiso.
   * @type {ElementRef}
   */
  @ViewChild('detalle-del-permiso', { static: false })
  modalDetallePermiso!: ElementRef;

  /**
   * Referencia al elemento modal para mostrar personas a notificar.
   * @type {ElementRef}
   */
  @ViewChild('personas-notificar', { static: false })
  modalPersonasNotificar!: ElementRef;

  /**
   * Elemento modal para mostrar información adicional.
   */
  modalElemento!: HTMLElement | null;

  /**
   * Notificación para mostrar mensajes al usuario.
   */
  public nuevaAlertaNotificacion!: Notificacion;

  /**
   * Configuración de notificación para mostrar mensajes al usuario.
   */
  public alertaFolioNotificacion!: Notificacion;

  /**
   * Notificación para mostrar mensajes al usuario cuando el folio es incorrecto.
   * @type {Notificacion}
   */
  public alertaFolioIncorrectoNotificacion!: Notificacion;

  /**
   * @property {boolean} formularioDeshabilitado
   * @description Indica si el formulario está deshabilitado (solo lectura).
   */
  formularioDeshabilitado: boolean = false;

  /**
   * Subject para destruir notificador.
   */
  private destruirNotificador$: Subject<void> = new Subject();

  /**
   * Constructor del componente.
   * @param fb - FormBuilder para crear formularios reactivos.
   * @param tramite140216Store - Store para gestionar el estado del trámite 140216.
   * @param tramite140216Query - Query para obtener datos del store del trámite 140216.
   * @param consultaioQuery - Consulta para obtener el estado de la consulta.
   * @param suspensionPermisoService - Servicio para gestionar permisos de suspensión.
   * @param validacionesService Servicio para validar formularios.
   */
  constructor(
    private fb: FormBuilder,
    private tramite140216Store: Tramite140216Store,
    private tramite140216Query: Tramite140216Query,
    private consultaioQuery: ConsultaioQuery,
    private suspensionPermisoService: SuspensionPermisoService,
    private validacionesService: ValidacionesFormularioService
  ) {
    this.tramite140216Query.selectSeccionState$
      .pipe(
        takeUntil(this.destruirNotificador$),
        map((seccionState) => {
          this.busquedaPermisosState = seccionState;
          this.permisosVigentesTabla = seccionState.permisosVigentesTabla || [];
        })
      )
      .subscribe();

    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destruirNotificador$),
        map((seccionState) => {
          this.formularioDeshabilitado = seccionState.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();

    // Inicializar el formulario principal
    this.crearBusquedaPermisosForm();
  }

  /**
   * Inicializa el formulario reactivo
   * @returns {void}
   */
  crearBusquedaPermisosForm(): void {
    this.busquedaPermisosForm = this.fb.group({
      folioTramiteBusqueda: [
        this.busquedaPermisosState?.folioTramiteBusqueda,
        [Validators.required],
      ],
      motivoSuspension: [
        this.busquedaPermisosState?.motivoSuspension,
        [Validators.required, Validators.maxLength(5000)],
      ],
      numAutorizacion: [
        this.busquedaPermisosState?.numAutorizacion,
        [Validators.required, Validators.maxLength(20)],
      ],
      fechaSuspension: [
        this.busquedaPermisosState?.fechaSuspension,
        [Validators.required],
      ],
    });

    this.inicializarEstadoFormulario();
  }

  /**
   * @method inicializarEstadoFormulario
   * @description Inicializa el estado del formulario `busquedaPermisosForm` basado en si el formulario está deshabilitado o no.
   * Si el formulario está deshabilitado, se deshabilita el campo `busquedaPermisosForm`.
   * Si no está deshabilitado, se habilita el campo `busquedaPermisosForm`.
   * @returns {void}
   */
  inicializarEstadoFormulario(): void {
    if (this.formularioDeshabilitado) {
      this.busquedaPermisosForm?.disable();
    } else if (!this.formularioDeshabilitado) {
      this.busquedaPermisosForm?.enable();
    }
  }

  /**
   * Método que se ejecuta al hacer clic en el botón "Buscar".
   * Actualiza los valores en el store y llama al servicio para buscar permisos vigentes.
   * @returns {void}
   */
  relanzarGrid(folioTramiteBusqueda: string): void {
    if (folioTramiteBusqueda?.length <= 0 || folioTramiteBusqueda === null) {
      this.abrirAlertaFolioModal();
    } else {
      this.suspensionPermisoService
        .obtenerPermisosVigentes()
        .pipe(takeUntil(this.destruirNotificador$))
        .subscribe({
          next: (permisosVigentes: PermisosVigentesRespuesta) => {
            const PERMISOS_FILTRADOS = permisosVigentes.data.filter(
              (permiso: PermisosVigentes) =>
                permiso.folioTramite === folioTramiteBusqueda
            );
            if (PERMISOS_FILTRADOS.length === 0) {
              this.permisosVigentesTabla = [];
              this.tramite140216Store.setPermisosVigentesTabla(
                this.permisosVigentesTabla
              );
              this.abrirModalAlertaFolioIncorrecto();
            } else {
              this.permisosVigentesTabla = permisosVigentes.data.map(
                (permiso: PermisosVigentes) => {
                  return {
                    numeroResolucion: permiso.numeroResolucion,
                    tipoSolicitud: permiso.tipoSolicitud,
                    regimen: permiso.regimen,
                    clasificacionRegimen: permiso.clasificacionRegimen,
                    periodoDeVigencia: permiso.periodoDeVigencia,
                    fraccionArancelaria: permiso.fraccionArancelaria,
                    unidad: permiso.unidad,
                    nico: permiso.nico,
                    nicoDescripcion: permiso.nicoDescripcion,
                    acotacion: permiso.acotacion,
                    cantidadAutorizada: permiso.cantidadAutorizada,
                    valorAutorizado: permiso.valorAutorizado,
                    fechaInicioVigencia: permiso.fechaInicioVigencia,
                    fechaFinVigencia: permiso.fechaFinVigencia,
                  };
                }
              );
              this.tramite140216Store.setPermisosVigentesTabla(
                this.permisosVigentesTabla
              );
            }
          },
        });
    }
  }

  /**
   * Método que se ejecuta al seleccionar una fila en la tabla de permisos vigentes.
   * Actualiza la lista de permisos vigentes seleccionados.
   * @param {PermisosVigentes[]} event - Lista de permisos vigentes seleccionados.
   * @returns {void}
   */
  listaDeFilaSeleccionada(event: PermisosVigentes[]): void {
    this.seleccionadaPermisosVigentesTabla = event;
  }

  /**
   * Método que se ejecuta al hacer clic en el botón "Limpiar".
   * @returns {void}
   */
  limpiarGrid(): void {
    this.permisosVigentesTabla = [];
    this.tramite140216Store.setPermisosVigentesTabla(
      this.permisosVigentesTabla
    );
    this.tramite140216Store.setFolioTramiteBusqueda('');
    this.tramite140216Store.setMotivoSuspension('');
    this.tramite140216Store.setNumAutorizacion('');
    this.tramite140216Store.setFechaSuspension('');
    this.busquedaPermisosForm.reset();
  }

  /**
   * Método que se ejecuta al hacer clic en el botón "Detalle del permiso".
   * @returns {void}
   */
  obtenerDetallePermiso(): void {
    if (this.seleccionadaPermisosVigentesTabla.length > 0) {
      this.mostrarModal('detalle-del-permiso');
    } else {
      this.abrirAlertaModal();
    }
  }

  /**
   * Abre un modal de alerta si no se ha seleccionado ningún elemento.
   * @returns {void}
   */
  abrirAlertaModal(): void {
    this.nuevaAlertaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: 'Alerta',
      mensaje: 'Debe seleccionar un elemento',
      cerrar: false,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
  }

  /**
   * Abre un modal de alerta si el campo "Folio trámites" está vacío.
   * @returns {void}
   */
  abrirAlertaFolioModal(): void {
    this.alertaFolioNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: 'Alerta',
      mensaje: 'Folio trámites es un campo obligatorio.',
      cerrar: false,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
  }

  /**
   * Abre un modal de alerta si el folio del trámite ingresado es incorrecto.
   * @returns {void}
   */
  abrirModalAlertaFolioIncorrecto(): void {
    this.alertaFolioIncorrectoNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: 'Alerta',
      mensaje:
        'El Folio del trámite ingresado no puede ser suspendido.Favor de verificar',
      cerrar: false,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
  }

  /**
   * Método que se ejecuta al hacer clic en el botón "Detalle titular".
   * @returns {void}
   */
  obtenerDetalleTitular(): void {
    if (this.seleccionadaPermisosVigentesTabla.length > 0) {
      this.mostrarModal('detalle-rfc-facultad');
    } else {
      this.abrirAlertaModal();
    }
  }

  /**
   * Método que se ejecuta al hacer clic en el botón "Personas a notificar".
   * @returns {void}
   */
  obtenerPersonasNotificacion(): void {
    if (this.seleccionadaPermisosVigentesTabla.length > 0) {
      this.mostrarModal('personas-notificar');
    } else {
      this.abrirAlertaModal();
    }
  }

  /**
   * Método que se ejecuta al cambiar la fecha de suspensión.
   * Actualiza el valor en el formulario y en el store.
   * @param {string} nuevo_valor - Nuevo valor de la fecha de suspensión.
   * @returns {void}
   */
  cambioFechaSuspension(nuevo_valor: string): void {
    this.busquedaPermisosForm.patchValue({
      fechaSuspension: nuevo_valor,
    });
    this.tramite140216Store.setFechaSuspension(nuevo_valor);
  }

  /**
   * Muestra un modal específico.
   * @param id - El ID del modal que se va a mostrar.
   * @returns {void}
   */
  mostrarModal(id: string): void {
    this.modalElemento = document.getElementById(id);
    if (this.modalElemento) {
      const MODAL = Modal.getOrCreateInstance(this.modalElemento);
      MODAL.show();
    }
  }

  /**
   * Método para validar el formulario.
   * @param form Formulario a validar.
   * @param field Campo a validar.
   * @returns {boolean} Regresa un booleano si el campo es válido o no.
   */
  isValid(form: FormGroup, field: string): boolean {
    return this.validacionesService.isValid(form, field) === true;
  }

  /**
   * Método para validar el formulario.
   * @returns boolean
   */
  validarFormulario(): boolean {
    if (this.busquedaPermisosForm.invalid) {
      this.busquedaPermisosForm.markAllAsTouched();
    }
    return this.busquedaPermisosForm.valid;
  }

  /**
   * Establece los valores en el store de tramite140216.
   *
   * @param {FormGroup} form - El formulario del cual se obtiene el valor.
   * @param {string} campo - El nombre del campo del formulario cuyo valor se va a obtener.
   * @param {string} metodoNombre - El nombre del método en el store que se va a invocar con el valor del campo.
   * @returns {void}
   */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof Tramite140216Store
  ): void {
    const VALOR = form.get(campo)?.value;
    (this.tramite140216Store[metodoNombre] as (value: unknown) => void)(VALOR);
  }

  /**
   * Se ejecuta al destruir el componente.
   * Emite un valor y completa el subject `destruirNotificador$` para cancelar las suscripciones.
   */
  ngOnDestroy(): void {
    this.destruirNotificador$.next();
    this.destruirNotificador$.complete();
  }
}