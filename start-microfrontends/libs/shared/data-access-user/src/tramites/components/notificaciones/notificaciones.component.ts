import {
  BsModalRef,
  BsModalService,
  ModalDirective,
  ModalModule,
  ModalOptions,
} from 'ngx-bootstrap/modal';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { AlertComponent } from 'ngx-bootstrap/alert';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { FormGroup } from '@angular/forms';
import { PreviewDocumentoComponent } from '../preview-documento/preview-documento.component';
import { ToastrService } from 'ngx-toastr';

/**
 * Modelo que contiene los atributos necesarios para mostrar una notificación al usuario.
 */
export interface Notificacion {
  /**
   * @description El tipo de la notificación a mostrar.
   */
  tipoNotificacion: string;
  /**
   * @description Variable de entrada para definir qué tipo de notificación se va a mostrar.
   */
  categoria: string;
  /**
   * @description Variable de entrada para determinar si se requiere una confirmación por parte       del usuario.
   */
  modo: string;
  /**
   * @description Variable de entrada para obtener el título a mostrar en la notificación.
   */
  titulo: string;
  /**
   * @description Variable de entrada para obtener el mensaje a mostrar en la notificación.
   */
  mensaje: string;
  /**
   * @description Variable de entrada para obtener el mensaje a mostrar en la notificación.
   */
  ttl?: string;

  /**
   * @description Variable de entrada para mostrar el boton de cerrar el modal.
   */
  cerrar: boolean;

  /**
   * @description Variable de entrada para definir el tiempo en que se muestra el banner y despues desaparece, e tiempo esta en ms.
   */
  tiempoDeEspera?: number;

  /**
   * @description Variable de entrada para definir el texto del boton de aceptar.
   * @remarks Este texto se muestra en el modal de confirmación.
   */
  txtBtnAceptar: string;

  /**
   * @description Variable de entrada para definir el texto del boton de cancelar.
   * @remarks Este texto se muestra en el modal de confirmación.
   */
  txtBtnCancelar: string;

  /**
   * @description Variable de entrada para definir el tamaño del modal.
   */
  tamanioModal?: string;

  /**
   * @description Variable de entrada para definir la ruta del documento a mostrar en el modal.
   */
  ruta?: string;

  /**
   * @description Variable de entrada para definir la alineación del botón de cerrar.
   */
  alineacionBtonoCerrar?: string;

  /**
   * @description Variable de entrada para definir la alineacion del texto.
   */
  alineacionTexto?: string;
}

/**
 * Enum que contiene los tipos de noficiaciones que pueden ser mostrados dentro de la
 * aplicación.
 */
export enum TipoNotificacionEnum {
  ALERTA = 'alert',
  TOASTR = 'toastr',
  BANNER = 'banner',
}

/**
 * Enum que contiene los tipos de noficiaciones que pueden ser mostrados dentro de la
 * aplicación.
 */
export enum CategoriaMensaje {
  ALERTA = 'warning',
  EXITO = 'success',
  ERROR = 'danger',
  INFORMACION = 'info',
}

@Component({
  selector: 'lib-notificaciones',
  standalone: true,
  imports: [CommonModule, AlertComponent, ModalModule],
  providers: [BsModalService],
  templateUrl: './notificaciones.component.html',
  styleUrl: './notificaciones.component.scss',
})
export class NotificacionesComponent implements OnChanges {
  /**
   * @description Variable de entrada para definir qué tipo de notificación se va a mostrar.
   * @see ENUM
   */
  @Input()
  public notificacionInput!: Notificacion;

  @Input() forma: FormGroup | undefined;

  /**
   * Evento que emite un valor booleano para confirmar una acción.
   */
  @Output() confirmacionModal = new EventEmitter<boolean>();

  /**
   * Constantes para utilizar los valores de enumeración en la plantilla,
   * ya que no podemos hacer referencia a los valores de enumeración directamente.
   */
  public readonly eTipoNoficacionEnum = TipoNotificacionEnum;

  /**
   * Marcar para mostrar u ocultar modal
   */
  public mostrarModal: boolean = false;

  /**
   * Indica si el banner debe mostrarse.
   */
  public verBanner: boolean = false;

  /**
   * Referencia al modal de tipo `BsModalRef`.
   * Utilizada para manejar el estado y las acciones del modal.
   */
  public modalRef!: BsModalRef;

  /**
   * Referencia al modal automático mostrado.
   * Utiliza `ModalDirective` para controlar su comportamiento.
   */
  @ViewChild('modal', { static: false }) modal?: ModalDirective;

  /**
   * @description Bandera que define si se debe invertir el orden de los botones en el modal.
   *  false -> Aceptar - Cancelar  true -> Cancelar - Aceptar
   */
  @Input() invertirBotones: boolean = false; // bandera que define el orden  de los botones en el modal

  constructor(
    private toastr: ToastrService,
    private sanitizer: DomSanitizer,
    private modalService: BsModalService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['notificacionInput']) {
      this.notificacionInput = changes['notificacionInput'].currentValue;
      switch (this.notificacionInput?.tipoNotificacion) {
        case TipoNotificacionEnum.ALERTA:
          if (this.notificacionInput.modo === 'html') {
            this.sanitizarContenidoHtml();
            this.abrirModal();
          } else if (this.notificacionInput.modo === 'pdf') {
            const ESTADO_INICIAL: ModalOptions = {
              initialState: {
                ruta: this.notificacionInput.mensaje,
                title: this.notificacionInput.titulo,
              },
            };
            this.modalRef = this.modalService.show(
              PreviewDocumentoComponent,
              ESTADO_INICIAL
            );
          } else {
            this.abrirModal();
          }
          break;
        case TipoNotificacionEnum.TOASTR:
          this.creaToastr();
          break;
        case TipoNotificacionEnum.BANNER:
          this.sanitizarContenidoHtml();
          break;
        default:
          break;
      }
    }
  }

  // #Inicia lógica para el toastr
  /**
   * @description Metodo para definir el tipo de toastr a mostrar en pantalla
   */
  public creaToastr(): void {
    switch (this.notificacionInput?.categoria) {
      case CategoriaMensaje.ALERTA:
        this.toastr.warning(this.notificacionInput?.mensaje);
        break;
      case CategoriaMensaje.ERROR:
        this.toastr.error(this.notificacionInput?.mensaje);
        break;
      case CategoriaMensaje.EXITO:
        this.toastr.success(this.notificacionInput?.mensaje);
        break;
      case CategoriaMensaje.INFORMACION:
        this.toastr.info(this.notificacionInput?.mensaje);
        break;
      default:
        break;
    }
  }
  // #Termina lógica para el toastr

  // #Inicia lógica de modal

  /**
   * Abre el modal estableciendo la propiedad `mostrarModal` a `true`.
   * @returns {void} No retorna ningún valor.
   */
  abrirModal(): void {
    this.mostrarModal = true;
  }

  /**
   * Cierra el modal y emite un evento de confirmación.
   * @returns {void} No retorna ningún valor.
   */
  confirmarAccion(): void {
    this.modal?.hide();
    this.confirmacionModal.emit(true);
  }

  /**
   * Cierra el modal sin emitir ningún evento.
   * @returns {void} No retorna ningún valor.
   */
  declinarAccion(): void {
    this.confirmacionModal.emit(false);
    this.modal?.hide();
  }

  /**
   * Evento que se activa cuando el modal se oculta.
   * Establece la propiedad `mostrarModal` a `false`.
   * @returns {void} No retorna ningún valor.
   */
  onHidden(): void {
    this.mostrarModal = false;
  }
  // #Termina lógica de modal

  /**
   * Sanitiza el mensaje de entrada para evitar problemas de seguridad.
   *
   * @returns {void} No retorna ningún valor.
   */
  sanitizarContenidoHtml(): void {
    this.notificacionInput.mensaje = this.sanitizer.bypassSecurityTrustHtml(
      this.notificacionInput.mensaje
    ) as string;
  }
}
