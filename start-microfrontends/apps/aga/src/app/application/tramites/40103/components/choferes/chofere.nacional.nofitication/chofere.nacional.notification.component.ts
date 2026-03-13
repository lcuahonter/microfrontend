/**
 * Componente de notificaciones para choferes nacionales en el trámite 40103.
 *
 * Este componente Angular gestiona la visualización de notificaciones específicas
 * para los choferes nacionales en el sistema de transportistas terrestres. Utiliza
 * el sistema de notificaciones compartido de la librería para mostrar mensajes
 * informativos, alertas y confirmaciones relacionadas con las operaciones de
 * choferes nacionales.
 *
 * El componente se encarga de:
 * - Recibir mensajes dinámicos como input desde componentes padre
 * - Configurar notificaciones tipo banner con categoría informativa
 * - Inicializar y actualizar el contenido de las notificaciones
 * - Integrar con el sistema de notificaciones de la aplicación
 *
 * @author Sistema de Gestión de Trámites - Frontend Team
 * @version 1.0.0
 * @since 1.0.0
 * @module ChofereNacionalNotificationComponent
 */

import {
  CategoriaMensaje,
  Notificacion,
  NotificacionesComponent,
  TipoNotificacionEnum,
} from '@libs/shared/data-access-user/src';
import { Component, Input, OnInit } from '@angular/core';

/**
 * Componente Angular para la gestión de notificaciones de choferes nacionales.
 *
 * Este componente especializado maneja la presentación de notificaciones relacionadas
 * con las operaciones de choferes nacionales en el trámite 40103. Implementa la
 * interfaz OnInit para configurar las notificaciones durante la inicialización
 * del componente y proporciona una interfaz consistente para mostrar mensajes
 * al usuario.
 *
 * Características principales:
 * - Componente standalone con importaciones selectivas
 * - Configuración automática de notificaciones tipo banner
 * - Integración con el sistema de notificaciones compartido
 * - Manejo dinámico de mensajes mediante inputs requeridos
 * - Configuración predeterminada para notificaciones informativas
 *
 * @component
 * @selector app-chofere-nacional-notification
 * @standalone true
 * @implements {OnInit}
 * 
 * @example
 * ```html
 * <app-chofere-nacional-notification 
 *   [mensaje]="'Chofer nacional registrado exitosamente'">
 * </app-chofere-nacional-notification>
 * ```
 *
 * @since 1.0.0
 */
@Component({
  selector: 'app-chofere-nacional-notification',
  templateUrl: './chofere.nacional.notification.component.html',
  styleUrls: ['./chofere.nacional.notification.component.scss'],
  standalone: true,
  imports: [
    NotificacionesComponent
  ],
})
export class ChofereNacionalNotificationComponent implements OnInit {
  /**
   * Texto del mensaje que se mostrará en la notificación.
   *
   * Este input requerido recibe el contenido del mensaje que será mostrado
   * al usuario en la notificación. El mensaje es proporcionado por el componente
   * padre y puede contener información sobre operaciones exitosas, errores,
   * advertencias o cualquier información relevante para el chofer nacional.
   *
   * @input
   * @required
   * @property {string} mensaje - Contenido textual de la notificación
   * 
   * @example
   * ```html
   * <app-chofere-nacional-notification 
   *   [mensaje]="'El chofer ha sido registrado correctamente'">
   * </app-chofere-nacional-notification>
   * ```
   *
   * @since 1.0.0
   */
  @Input({ required: true }) mensaje!: string;

  /**
   * Configuración de la notificación que será mostrada al usuario.
   *
   * Este objeto de tipo Notificacion contiene toda la configuración necesaria
   * para mostrar una notificación tipo banner con categoría informativa.
   * Se inicializa con valores predeterminados que definen el comportamiento
   * y apariencia de la notificación en el sistema.
   *
   * La configuración incluye:
   * - Tipo banner para mostrar en la parte superior de la interfaz
   * - Categoría informativa para el estilo visual apropiado
   * - Opción de cierre habilitada para el usuario
   * - Mensaje dinámico que se actualiza desde el input
   *
   * @property {Notificacion} alertaNotificacion - Objeto de configuración de la notificación
   * @readonly
   * 
   * @example
   * ```typescript
   * // La notificación se configura automáticamente como:
   * {
   *   tipoNotificacion: TipoNotificacionEnum.BANNER,
   *   categoria: CategoriaMensaje.INFORMACION,
   *   mensaje: 'Mensaje dinámico del input',
   *   cerrar: true
   * }
   * ```
   *
   * @since 1.0.0
   */
  public alertaNotificacion: Notificacion = {
    tipoNotificacion: TipoNotificacionEnum.BANNER,
    categoria: CategoriaMensaje.INFORMACION,
    modo: '',
    titulo: '',
    mensaje: this.mensaje,
    cerrar: true,
    txtBtnAceptar: '',
    txtBtnCancelar: '',
  }

  /**
   * Inicializa el componente y configura la notificación con el mensaje recibido.
   *
   * Este método del ciclo de vida de Angular se ejecuta después de que el
   * componente ha sido inicializado y todos los inputs han sido establecidos.
   * Su función principal es actualizar el mensaje de la notificación con el
   * valor recibido del input requerido, asegurando que la notificación muestre
   * el contenido correcto al usuario.
   *
   * El método es necesario porque el input 'mensaje' no está disponible durante
   * la inicialización del objeto alertaNotificacion, por lo que debe ser
   * actualizado en el momento apropiado del ciclo de vida del componente.
   *
   * @method ngOnInit
   * @implements {OnInit}
   * @returns {void}
   * 
   * @example
   * ```typescript
   * // Al inicializar el componente:
   * // 1. Angular establece el valor del input 'mensaje'
   * // 2. Se ejecuta ngOnInit()
   * // 3. Se actualiza alertaNotificacion.mensaje con el valor del input
   * // 4. La notificación está lista para ser mostrada
   * ```
   *
   * @since 1.0.0
   */
  ngOnInit(): void {
    this.alertaNotificacion.mensaje = this.mensaje;
  }
}
