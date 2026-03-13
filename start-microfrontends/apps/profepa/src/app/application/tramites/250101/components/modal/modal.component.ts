/**
 * Importa las decoraciones necesarias para crear un componente de Angular.
 */
import { Component, Input } from '@angular/core';

/**
 * Decorador que define el componente ModalComponent.
 * Este componente se utiliza para mostrar un modal en la aplicación.
 * 
 * @selector app-modal
 */
@Component({
  /**
   * Selector que identifica el componente en el HTML.
   */
  selector: 'app-modal',

  /**
   * Indica que este componente es independiente y no requiere un módulo.
   */
  standalone: true,

  /**
   * Lista de componentes o directivas que se importan en este componente.
   */
  imports: [],

  /**
   * Ruta al archivo HTML que contiene la plantilla del componente.
   */
  templateUrl: './modal.component.html',

  /**
   * Ruta al archivo CSS que contiene los estilos del componente.
   */
  styleUrls: ['./modal.component.scss'], // Corregido a styleUrls
})
export class ModalComponent {

  /**
   * Propiedad que indica si el modal está activo o no.
   * Esta propiedad se puede pasar desde un componente padre utilizando la decoración @Input.
   * 
   * @property {boolean} active
   * @default false
   */
  @Input() active = false;
}
