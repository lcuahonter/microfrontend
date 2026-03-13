import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import {
  CategoriaMensaje,
  ConsultaioQuery,
  Notificacion,
  NotificacionesComponent,
  TipoNotificacionEnum,
} from '@ng-mf/data-access-user';
import { Component, Inject, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Solicitud32605State, Solicitud32605Store } from '../../estados/solicitud32605.store';
import { Subject, map, takeUntil } from 'rxjs';
import { CTPAT_MENSAJE } from '../../constants/solicitud.enum';
import { CommonModule } from '@angular/common';
import { InputRadioComponent } from '@libs/shared/data-access-user/src';
import { OPCIONES_DE_BOTON_DE_RADIO } from '../../constants/datos-comunes.enum';
import { Solicitud32605Query } from '../../estados/solicitud32605.query';
import { SolicitudService } from '../../services/solicitud.service';

/**
 * Componente que gestiona el formulario relacionado con la certificación CTPAT.
 * Utiliza radio buttons para capturar respuestas de sí/no relacionadas con la solicitud.
 */
@Component({
  selector: 'app-c-tpat',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputRadioComponent,
    NotificacionesComponent,
  ],
  providers: [SolicitudService, BsModalService],
  templateUrl: './c-tpat.component.html',
  styleUrl: './c-tpat.component.scss',
})
/**
 * Componente que gestiona el formulario relacionado con la certificación CTPAT.
 * Utiliza radio buttons para capturar respuestas de sí/no relacionadas con la solicitud.
 */
export class CTPATComponent implements OnInit, OnDestroy {
  /** Formulario reactivo que contiene los campos de CTPAT identificados por sus IDs numéricos */
  ctpatForm!: FormGroup;

  /** Subject utilizado para cancelar las suscripciones activas al destruir el componente */
  public destroy$: Subject<void> = new Subject<void>();

  /** Estado actual de la solicitud obtenido desde el store */
  solicitud32605State: Solicitud32605State = {} as Solicitud32605State;

  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  esFormularioSoloLectura: boolean = false;
  /**
   * Referencia al modal de Bootstrap para mostrar mensajes informativos.
   */
  modalRef?: BsModalRef;
  /**
   * Referencia al template del modal de mensaje.
   */
  @ViewChild('template') template!: TemplateRef<void>;

  /**
   * Opciones disponibles para los botones de radio (Sí/No).
   * Utiliza las constantes definidas en `OPCIONES_DE_BOTON_DE_RADIO`.
   */
  opcionDeBotonDeRadio = OPCIONES_DE_BOTON_DE_RADIO;

  /**
   * Estado actual de la solicitud del trámite 32605.
   * Contiene toda la información del estado de la aplicación.
   */
  solicitudState!: Solicitud32605State;

  /**
   * Notificación que se muestra al usuario.
   */
  public nuevaNotificacion!: Notificacion;

  /**
   * Define si el diálogo exitoso está habilitado.
   *
   * @property esHabilitarElDialogo
   * @type {boolean}
   * @default false
   */
  esHabilitarElDialogo: boolean = false;

  /**
   * Mensaje relacionado con CTPAT.
   *
   * Esta constante almacena un texto que será utilizado en el sistema
   * para mostrar información, advertencias o mensajes asociados al
   * programa CTPAT (Customs-Trade Partnership Against Terrorism).
   *
   * @type {string}
   */
  CTPAT_MENSAJE: string = CTPAT_MENSAJE;
  /**
   * Constructor del componente. Inyecta dependencias necesarias y carga las opciones del radio button.
   */
  constructor(
    public fb: FormBuilder,
    public solicitudService: SolicitudService,
    public solicitud32605Store: Solicitud32605Store,
    public solicitud32605Query: Solicitud32605Query,
    public consultaioQuery: ConsultaioQuery,
    @Inject(BsModalService)
    private modalService: BsModalService
  ) {
    /**
     * Se suscribe al estado de `Consultaio` para obtener información actualizada del estado del formulario.
     *
     * - Asigna el valor de solo lectura (`readonly`) a la propiedad `esFormularioSoloLectura`.
     * - Llama a `inicializarEstadoFormulario()` para aplicar configuraciones basadas en el estado recibido.
     * - La suscripción se cancela automáticamente cuando `destroyNotifier$` emite un valor (para evitar fugas de memoria).
     */
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroy$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
  }

  /**
   * Inicializa el componente, crea el formulario y suscribe a los cambios en el estado de la solicitud.
   */
  ngOnInit(): void {
    this.inicializarEstadoFormulario();
  }

  /**
   * Evalúa si se debe inicializar o cargar datos en el formulario.
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario(); // Llama al método para cargar los datos del formulario
    } else {
      this.inicializarFormulario();
    }
  }

  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(): void {
    this.inicializarFormulario();
    if (this.esFormularioSoloLectura) {
      this.ctpatForm.disable();
    } else if (!this.esFormularioSoloLectura) {
      this.ctpatForm.enable();
    } else {
      // No se requiere ninguna acción en el formulario
    }
  }

  /**
   * Inicializa el formulario `ctpatForm` con los valores actuales del estado `solicitud32605State`.
   *
   * Este método crea un formulario reactivo usando `FormBuilder`, asignando los valores
   * de los campos `'2089'`, `'2090'` y `'2091'`. Además, se suscribe al observable
   * `selectSolicitud$` para escuchar actualizaciones del estado y aplicar los valores
   * actualizados al formulario.
   *
   * También gestiona la destrucción de la suscripción usando `takeUntil` con `destroy$`.
   */
  inicializarFormulario(): void {
    this.obtenerEstadoSolicitud();
    this.ctpatForm = this.fb.group({
      autorizacionCBP: [
        this.solicitudState?.autorizacionCBP,
        Validators.required,
      ],
      instalacionesCertificadasCBP: [
        this.solicitudState?.instalacionesCertificadasCBP,
        Validators.required,
      ],
      suspensionCancelacionCBP: [
        this.solicitudState?.suspensionCancelacionCBP,
        Validators.required,
      ],
    });
  }

  /**
   * Obtiene el estado actual de la solicitud desde el store.
   * Se suscribe a los cambios del estado y actualiza la tabla de datos.
   * Mantiene sincronizada la información entre el store y el componente.
   */
  obtenerEstadoSolicitud(): void {
    this.solicitud32605Query.selectSolicitud$
      ?.pipe(takeUntil(this.destroy$))
      .subscribe((data: Solicitud32605State) => {
        this.solicitudState = data;
      });
  }

  /**
   * Establece valores en el store desde un control de formulario específico.
   * Actualiza el estado global con el valor del campo si no es nulo o indefinido.
   *
   * param form - Formulario que contiene el control
   * param campo - Nombre del campo a actualizar en el store
   */
  setValoresStore(form: FormGroup | null, campo: string): void {
    const VALOR = this.ctpatForm.get('autorizacionCBP')?.value;
    if ((VALOR === '0' || VALOR === 0) && campo === 'autorizacionCBP') {
      this.enNuevaNotificacion(this.CTPAT_MENSAJE);
    }
    const VALOR1 = this.ctpatForm.get('instalacionesCertificadasCBP')?.value;
    if (
      (VALOR1 === '0' || VALOR1 === 0) &&
      campo === 'instalacionesCertificadasCBP'
    ) {
      this.enNuevaNotificacion(this.CTPAT_MENSAJE);
    }
    const VALOR2 = this.ctpatForm.get('suspensionCancelacionCBP')?.value;
    if (
      VALOR2 === '1' ||
      (VALOR2 === 1 && campo === 'suspensionCancelacionCBP')
    ) {
      this.enNuevaNotificacion(this.CTPAT_MENSAJE);
    }
    if (!form) {
      return;
    }
    const CONTROL = form.get(campo);
    if (CONTROL && CONTROL.value !== null && CONTROL.value !== undefined) {
      this.solicitud32605Store.actualizarEstado({ [campo]: CONTROL.value });
    }
  }

  /**
   * Envía los datos del formulario y muestra el modal de confirmación.
   */
  enNuevaNotificacion(datos: string): void {
    this.nuevaNotificacion = {
      tipoNotificacion: TipoNotificacionEnum.ALERTA,
      categoria: CategoriaMensaje.ALERTA,
      modo: 'modal',
      titulo: 'Mensaje',
      mensaje: datos,
      cerrar: false,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
    this.esHabilitarElDialogo = true;
  }

  /**
   * Maneja el cambio en el campo de suspensión/cancelación CBP.
   * Si se selecciona "Sí", muestra el modal con el mensaje informativo.
   * Actualiza el store con el nuevo valor seleccionado.
   *
   * param valor - Valor seleccionado en el radio button ('1' para Sí, '0' para No)
   */
  manejarCambioSuspensionCancelacion(event: Event): void {
    const TARGET = event.target as HTMLInputElement;
    const VALOR = TARGET.value;
    if (VALOR === '0') {
      this.enNuevaNotificacion(this.CTPAT_MENSAJE);
    }

    this.setValoresStore(this.ctpatForm, 'suspensionCancelacionCBP');
  }

  /**
   * Muestra el modal con el mensaje informativo sobre el requisito CBP.
   * Configura el modal como no dismissible para asegurar que el usuario lea el mensaje.
   */

  /**
   * Cierra el modal de mensaje informativo.
   * Se ejecuta cuando el usuario hace clic en el botón "Aceptar".
   */
  cerrarModal(): void {
    this.modalRef?.hide();
  }
  /**
   * Cancela todas las suscripciones activas al destruir el componente.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * @method esInvalido
   * Verifica si un control del formulario es inválido.
   * @param {string} nombreControl - Nombre del control a verificar.
   * @returns {boolean} - `true` si el control es inválido, de lo contrario `false`.
   */
  public esInvalido(nombreControl: string): boolean {
    const CONTROL = this.ctpatForm.get(nombreControl);
    return CONTROL
      ? CONTROL.invalid && (CONTROL.touched || CONTROL.dirty)
      : false;
  }

  /**
   * Verifica si el formulario `importadorExportadorForm` es válido.
   * Si el formulario es válido, retorna `true`.
   * Si no es válido, marca todos los campos como tocados para mostrar los errores y retorna `false`.
   */
  validarFormulario(): boolean {
    let esValido = true;

    if (this.ctpatForm.invalid) {
      this.ctpatForm.markAllAsTouched();
      esValido = false;
    }

    return esValido;
  }

  /**
   * Cierra el modal de CTPAT.
   *
   * Este método cambia el valor de la propiedad `esHabilitarElDialogo` a `false`
   * para indicar que el diálogo/modal de CTPAT debe cerrarse.
   *
   * @returns {void} No retorna ningún valor.
   */
  cerrarCTPATModal(): void {
    this.esHabilitarElDialogo = false;
  }
}
