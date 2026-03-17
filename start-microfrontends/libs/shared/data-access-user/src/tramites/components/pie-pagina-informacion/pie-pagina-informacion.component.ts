import { DomSanitizer } from '@angular/platform-browser';

import {
  INAI_LINK,
  POLITICAS_PRIVACIDAD,
  POLITICAS_PRIVACIDAD_URL
} from '../../../core/enums/politicas-privacidad.enum';
import {
  Notificacion,
  NotificacionesComponent,
} from '../notificaciones/notificaciones.component';
import {
  SIN_TITULO_MODAL,
  TEXTO_CERRAR,
} from '../../../core/enums/mensajes-modal-comunes.enum';
import { Component } from '@angular/core';
@Component({
  selector: 'lib-pie-pagina-informacion',
  standalone: true,
  imports: [NotificacionesComponent],
  templateUrl: './pie-pagina-informacion.component.html',
  styleUrl: './pie-pagina-informacion.component.scss',
})
export class PiePaginaInformacionComponent {
  /**
   * @description Objeto que representa la notificación que se mostrará al usuario.
   * @remarks Este objeto se utiliza para configurar el modal de notificación.
   */
  notificacion!: Notificacion;

  /**
   * @param sanitizer Instancia de `DomSanitizer` que se utiliza para sanitizar URLs y evitar vulnerabilidades XSS.
   * @description Constructor del componente `PiePaginaInformacionComponent`.
   */
  constructor(private sanitizer: DomSanitizer) {}

  /**
   * @description Método que abre un modal de notificación con información sobre las políticas de privacidad.
   * Este método configura el objeto `notificacion` con los detalles necesarios para mostrar
   */
  abreModalNotificacion(): void {
    this.notificacion = {
      tipoNotificacion: 'alert',
      categoria: '',
      modo: 'html',
      titulo: SIN_TITULO_MODAL,
      mensaje: POLITICAS_PRIVACIDAD(INAI_LINK),
      cerrar: false,
      txtBtnAceptar: TEXTO_CERRAR,
      txtBtnCancelar: '',
      tamanioModal: 'modal-lg',
      alineacionBtonoCerrar: 'boton-final',
    };
  }

  /**
   * Método que se ejecuta al hacer clic en un enlace para ver el PDF.
   *
   * @param url - La URL del PDF a visualizar.
   */
  // eslint-disable-next-line class-methods-use-this
  verPDF(): void {
    window.open(POLITICAS_PRIVACIDAD_URL, '_blank');
  }
}
