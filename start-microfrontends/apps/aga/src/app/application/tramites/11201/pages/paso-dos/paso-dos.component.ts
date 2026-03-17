import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FormGroup, } from '@angular/forms';
import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { ReactiveFormsModule, } from '@angular/forms';
import { Solicitud11201State } from '../../../../core/estados/tramites/tramite11201.store';
import { TituloComponent, Notificacion } from '@ng-mf/data-access-user';
import { Tramite11201Query } from '../../estados/queries/tramite11201.query';
import { Tramite11201Store } from '../../estados/tramites/tramite11201.store';
import { Validators } from '@angular/forms';
import { DatosTramiteService } from '../../services/datos-tramite.service';
import { ToastrService } from 'ngx-toastr';
import {
  TablaDinamicaComponent,
  TablaSeleccion,
  ConfiguracionColumna,
  TEXTO_ACEPTAR,
  TEXTO_CANCELAR,
  TEXTO_CERRAR,
  TEXTO_ELIMINAR_SOLICITUD,
  MSG_ALERTA_ELIMINAR_ELEMENTO,
  NotificacionesComponent,
  CAMPO_VACIO,
  MSG_ELIMINA_ELEMENTO
} from '@libs/shared/data-access-user/src';
import { LineaCaptura } from '../../../../core/models/5701/linea-captura.model';
import {
  CONFIGURACION_ENCABEZADO_TABLA_PAGOS,
} from '../../../../core/enums/5701/tramite5701.enum';
import { TITULO_MODAL_AVISO } from '@libs/shared/data-access-user/src/tramites/constantes/terceros.enums';
import {
  CONFIRMAR_ELIMINAR_SOLICITUD,
  MSG_ADUANA_PEDIMENTO,
  MSG_ERROR_RFC_NO_ENCONTRADO,
  MSG_ERROR_SELECCIONE_REGISTRO,
  MSG_MONTO_PAGADO_CUBIERTO,
  MSJ_ERROR_FECHAS_NO_SELECCIONADAS,
  MSJ_ERROR_FECHA_DIA,
  MSJ_ERROR_FECHA_FINAL_NO_SELECCIONADA,
  MSJ_ERROR_FECHA_INICIAL_NO_SELECCIONADA,
  MSJ_ERROR_FECHA_MES,
  MSJ_ERROR_FECHA_SEMANA,
  MSJ_ERROR_FOLIO_DDEX,
  MSJ_ERROR_HORA_FINAL_MENOR_INICIAL,
  MSJ_ERROR_ID_SOCIO_COMERCIAL,
  MSJ_ERROR_LINEA_CAPTURA,
  MSJ_ERROR_LINEA_CAPTURA_NO_VALIDA,
  MSJ_FECHA_DENTRO_DE_HORARIO_ADUANA,
  MSJ_LINEA_CAPTURA_DUPLICADA,
  MSJ_LINEA_CAPTURA_NO_PAGADA,
  MSJ_LINEA_CAPTURA_USADA,
  MSJ_NO_RELACION_ENCARGO_CONFERIDO,
} from '../../../../core/enums/5701/mensajes-modal-5701.enum';
import {
  EMPTY,
  Observable,
  Subject,
  catchError,
  delay,
  forkJoin,
  map,
  merge,
  switchMap,
  takeUntil,
  tap,
  throwError,
  timer,
} from 'rxjs';
/**
 * Componente para el paso dos del trámite de contenedores temporales.
 * 
 * Este componente maneja el formulario de pago de derechos, incluyendo
 * la captura de información de líneas de captura y montos a pagar.
 * Gestiona la interacción con el store del trámite para persistir datos.
 * 
 * @component
 */
@Component({
  selector: 'app-paso-dos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TituloComponent, TablaDinamicaComponent, NotificacionesComponent],
  templateUrl: './paso-dos.component.html',
  styleUrl: './paso-dos.component.scss',
  providers: [ToastrService],

})
export class PasoDosComponent implements OnInit, OnDestroy {
  /**
   * Formulario reactivo que contiene los campos de datos del importador/exportador.
   * El formulario incluye un campo 'linea' y un campo 'monto' con validaciones de 'required'.
   *
   * @type {FormGroup}
   */
  formSolicitud!: FormGroup;

  /**
   * Estado de la solicitud de la sección 301.
   */
  public solicitudState!: Solicitud11201State;

  /**
   * Subject para notificar la destrucción del componente.
   */
  public destroyNotifier$: Subject<void> = new Subject();

  /** Configuración de la tabla para la selección de pagos. */
public tablaSeleccionPagos = TablaSeleccion;

/** Mensaje que indica los campos obligatorios del formulario. */
public mensajeCamposObligatorios: string = '* Campos obligatorios';

  /**
 * Datos de la tabla de pagos.
 */
  public datosTablaPagos: LineaCaptura[] = [];

  /**
  *@description Alamcena las lineas de capturas seleccionadas por el usuario en la tabla.
  */
  lineaCapturaSeleccionados: LineaCaptura[] = [];

  /** Notificación actual del trámite (puede ser null). */
  public nuevaNotificacion!: Notificacion | null;
  /**
   * GUarda el tipo de proceso que se eligió y de acuerdo a lo elegido se tomá decision en el modal.
   */
  public procesoModal!: string;

  /**
   * Event emitted when the user cancels the current step of the workflow.
   *
   * Listeners should use this to perform cleanup, undo any temporary changes,
   * or navigate back to the previous screen. The event carries no payload.
   *
   * @example
   * // Parent component
   * childComponent.cancelEvent.subscribe(() => {
   *   // handle cancellation (e.g., navigate away or reset state)
   * });
   *
   * @public
   */
  @Output() cancelEvent = new EventEmitter<void>();

  /**
   * Evento emitido cuando el usuario solicita continuar al siguiente paso del flujo.
   *
   * Emite sin payload (void). El componente padre puede suscribirse a este evento
   * para ejecutar lógica de navegación, validaciones adicionales o persistencia
   * antes de avanzar.
   *
   * @example
   * <app-paso-dos (continuarEvento)="onContinuar()"></app-paso-dos>
   *
   * @remarks
   * Se emite típicamente al pulsar el botón "Continuar". No realiza ninguna acción
   * por sí mismo; la responsabilidad de manejar el avance recae en el componente padre.
   */
  @Output() continuarEvento = new EventEmitter<void>();

  /**
 * Encabezado de la tabla de pagos.
 */
  public encabezadoDeTablaPagos: ConfiguracionColumna<LineaCaptura>[] = CONFIGURACION_ENCABEZADO_TABLA_PAGOS;

  /**
   * Constructor del componente `PagoDeDerechosComponent`.
   *
   * Inicializa la instancia de `FormBuilder` para crear formularios reactivos.
   *
   * @param {FormBuilder} fb - Instancia de FormBuilder utilizada para construir formularios reactivos.
   */
  constructor(
    private fb: FormBuilder,
    private tramite11201Store: Tramite11201Store,
    private tramite11201Query: Tramite11201Query,
    private datosTramiteService: DatosTramiteService,
    private toastrService: ToastrService,
  ) { }

  /**
   * Método del ciclo de vida `ngOnInit()`.
   * Este método se ejecuta cuando el componente se inicializa y realiza las siguientes acciones:
   * - Inicializa el formulario reactivo `FormSolicitud` con dos campos: `linea` y `monto`.
   * - Llama al método `campoDeDormularioDeActualización()` para configurar el campo 'monto', deshabilitándolo y estableciendo un valor predeterminado.
   *
   * @memberof PagoDeDerechosComponent
   */
  ngOnInit(): void {
    // Inicializa el formulario con validaciones requeridas
    this.tramite11201Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe()

    this.formSolicitud = this.fb.group({
      pagoDeDerechos: this.fb.group({
        linea: [this.solicitudState?.linea, Validators.required],
        monto: ['', Validators.required],
        montoPagar: [this.solicitudState?.monto],
        lineaCheckbox: [this.solicitudState?.lineaCheckbox],
      }),
    });

    this.getMontoConstanciaITC();
  }

  /**
   * Método `campoDeDormularioDeActualizacion()`.
   * Este método se encarga de actualizar el campo 'monto' dentro del formulario:
   * - Deshabilita el campo 'monto'.
   * - Establece el valor predeterminado de 'monto' a '352'.
   *
   * @memberof PagoDeDerechosComponent
   */
  campoDeDormularioDeActualizacion(): void {
    // Deshabilita el campo 'monto' y asigna el valor '352'
    this.formSolicitud.get('pagoDeDerechos.montoPagar')?.disable();
    this.formSolicitud.get('pagoDeDerechos.montoPagar')?.setValue('352');
  }

  /**
  * Obtiene el grupo de formulario 'datosServicio' del formulario principal 'FormSolicitud'.
  *
  * @returns {FormGroup} El grupo de formulario 'datosServicio'.
  */
  get datosServicio(): FormGroup {
    return this.formSolicitud?.get('pagoDeDerechos') as FormGroup;
  }

  /**
   * Fetches the "monto constancia ITC" from the datosTramiteService and updates the form accordingly.
   *
   * Subscribes to datosTramiteService.getMontoConstanciaITC() and automatically unsubscribes when
   * this.destroyNotifier$ emits (uses takeUntil) to prevent memory leaks.
   *
   * Behavior:
   * - If respuesta?.codigo === '00':
   *   - Disables the form control at 'pagoDeDerechos.montoPagar' (if present).
   *   - Sets that control's value to respuesta.datos.
   * - Otherwise:
   *   - Shows an error toast with respuesta.error.
   *
   * Side effects:
   * - Mutates the form (disables and sets value of a control).
   * - Emits a toast on failure.
   *
   * Expectations:
   * - The service response is expected to have a shape containing at least 'codigo' and either
   *   'datos' (on success) or 'error' (on failure).
   * - The form control access uses optional chaining, so absence of the control is safely ignored.
   *
   * @returns void
   */
  getMontoConstanciaITC(): void {
    this.datosTramiteService.getMontoConstanciaITC()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((respuesta: any) => {
        if (respuesta?.codigo === '00') {
          this.formSolicitud.get('pagoDeDerechos.montoPagar')?.disable();
          this.formSolicitud.get('pagoDeDerechos.montoPagar')?.setValue(respuesta.datos);
        } else {
          this.toastrService.error(respuesta.error);
        }
      });
  }

  /**
   * Método `onSubmit()`.
   * Este método se ejecuta cuando se envía el formulario y realiza las siguientes acciones:
   * - Valida si el formulario es válido.
   * - Llama al método `setValoresStore()` para guardar los valores del formulario en el estado.
   *
   * @param {FormGroup} form - Formulario reactivo que contiene los campos de datos del importador/exportador.
   * @memberof PagoDeDerechosComponent
   */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof Tramite11201Store
  ): void {
    const VALOR = form.get(campo)?.value;
    (this.tramite11201Store[metodoNombre] as (value: Tramite11201Store) => void)(VALOR);
  }

  /**
   * Validates the payment information entered in the form.
   *
   * This method checks if the 'linea' and 'monto' fields in the form are valid.
   * If both fields are valid, it calls the `validarPago` method of `datosTramiteService`
   * with the provided values. The response is observed until the component is destroyed.
   * If the response code is '00', a success alert is shown to the user.
   */
  validarPago(): void {
    if (
      this.formSolicitud.get('pagoDeDerechos.linea')?.valid &&
      this.formSolicitud.get('pagoDeDerechos.monto')?.valid
    ) {
      const linea_captura = this.formSolicitud.get('pagoDeDerechos.linea')?.value;
      const monto = this.formSolicitud.get('pagoDeDerechos.monto')?.value;
      const PAYLOAD = { linea_captura, monto };
      this.datosTramiteService
        .validarPago(PAYLOAD)
        .pipe(takeUntil(this.destroyNotifier$))
        .subscribe((respuesta: any) => {
          if (respuesta?.codigo === '00') {
           const PAGO = {
            lineaCaptura: linea_captura,
            monto: respuesta.datos.pago_model.importe,
          };
          //check duplicate before adding.
          const existeDuplicado = this.datosTablaPagos.some(
            (pago) => pago.lineaCaptura === PAGO.lineaCaptura
          );
          if (existeDuplicado) {
            this.toastrService.error(MSJ_LINEA_CAPTURA_DUPLICADA);
          } else {
           this.datosTablaPagos = [...this.datosTablaPagos, PAGO];
          }
          }
          if (respuesta?.codigo !== '00') {
            this.toastrService.error(respuesta.error);

          }
        });
    }
  }

  /**
  * Elimina un elemento de la tabla de lineas de captura
  * @returns {void} No retorna ningún valor.
  */
  eliminarLineaCaptura(): void {
    if (this.lineaCapturaSeleccionados.length === 0) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: '',
        modo: 'action',
        titulo: TITULO_MODAL_AVISO,
        mensaje: MSG_ERROR_SELECCIONE_REGISTRO,
        cerrar: false,
        txtBtnAceptar: 'Cerrar',
        txtBtnCancelar: '',
      };
      return;
    }

    this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: '',
      modo: 'action',
      titulo: TITULO_MODAL_AVISO,
      mensaje: MSG_ALERTA_ELIMINAR_ELEMENTO,
      cerrar: false,
      txtBtnAceptar: TEXTO_ACEPTAR,
      txtBtnCancelar: TEXTO_CANCELAR,
    };
    this.procesoModal = 'linea_captura';
  }

  // #Seccion Modal
  /**
   * Método que maneja el evento de aceptar o no una accion del componente Notificación cuando este es un modal.
   */
  confirmacionModal(confirmar: boolean): void {
    switch (this.procesoModal) {
      case 'linea_captura':
        if (confirmar) {
          this.limpiarNotificacion();
          this.datosTablaPagos = this.datosTablaPagos.filter(
            (item) =>
              !this.lineaCapturaSeleccionados.some(
                (seleccionado) =>
                  seleccionado.lineaCaptura === item.lineaCaptura
              )
          );
          this.lineaCapturaSeleccionados = [];

          timer(500)
            .pipe(
              tap(() => {
                this.nuevaNotificacion = {
                  tipoNotificacion: 'alert',
                  categoria: '',
                  modo: 'action',
                  titulo: TITULO_MODAL_AVISO,
                  mensaje: MSG_ELIMINA_ELEMENTO,
                  cerrar: false,
                  txtBtnAceptar: TEXTO_ACEPTAR,
                  txtBtnCancelar: CAMPO_VACIO,
                };
              }),
              takeUntil(this.destroyNotifier$)
            )
            .subscribe();
          this.procesoModal = '';
        }
        break;
      default:
        break;
    }
  }

  /**
  * Lipia el objeto de notificación y el proceso modal.
  * @returns {void} No retorna ningún valor.
  */
  limpiarNotificacion(): void {
    this.nuevaNotificacion = null;
    this.procesoModal = '';
  }

  /**
   * Emits the component's cancelEvent to notify parent components or listeners that the current
   * operation should be cancelled.
   *
   * @public
   * @remarks
   * This method performs no additional logic or state changes; it simply emits the event
   * synchronously. Listeners should handle any cleanup or navigation resulting from the cancellation.
   *
   * @returns void
   */
  cancelar(): void {
    this.cancelEvent.emit();
  }

  /**
   * Emite el EventEmitter `continuarEvento` para notificar a los suscriptores
   * que se debe continuar al siguiente paso.
   *
   * Dispara los manejadores registrados en `continuarEvento` y no devuelve valor.
   *
   * @remarks
   * Invocar desde la interfaz (por ejemplo, al pulsar un botón) para delegar en el
   * componente padre la lógica de navegación o la continuación del flujo.
   *
   * @returns void
   */
  continuar(): void {
    this.continuarEvento.emit();
  }

  /**
   * Persists the current payments table to the backend and advances the flow on success.
   *
   * Constructs a request payload from `this.datosTablaPagos` (mapping each row to
   * `{ linea_captura, monto }`), obtains the solicitud id from `this.solicitudState.idSolicitud`
   * and calls `this.datosTramiteService.guardarPagosSolicitud(PAYLOAD, idSolicitud)`.
   * The subscription is tied to `this.destroyNotifier$` to ensure automatic unsubscription.
   * If the response contains `codigo === '00'`, the component's `continuar()` method is invoked.
   *
   * Remarks:
   * - No explicit error handling or user feedback is implemented here; consider adding
   *   error and completion handlers to show messages or refresh UI state as appropriate.
   * - Side effects: network request, potential navigation/flow continuation via `continuar()`.
   *
   * @returns void
   */
  pagosGuardar(): void {
    const PAYLOAD = {
      "pagos": this.datosTablaPagos.map(pago => ({
        linea_captura: pago.lineaCaptura,
        monto: pago.monto
      }))
    }
    const idSolicitud = this.solicitudState.idSolicitud;
    this.datosTramiteService
      .guardarPagosSolicitud(PAYLOAD, idSolicitud)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe(
        (respuesta) => {
          // Manejar éxito, posiblemente refrescar la grilla o mostrar mensaje
          if (respuesta?.codigo === '00') {
            this.continuar();
          }
        }
      );
  } 

  /**
   * Método `ngOnDestroy()`.
   * Este método se ejecuta cuando el componente se destruye y realiza las siguientes acciones:
   * - Desuscribe la suscripción a los cambios en el formulario reactivo.
   *
   * @memberof PagoDeDerechosComponent
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete()
  }
}
