import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Decorador que define el componente ModalComponent.
 * Este componente se utiliza para mostrar un modal en la aplicación.
 * 
 * @selector app-modal
 */
@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
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

/**   * Propiedad que indica si el modal debe ocupar todo el ancho disponible.
   * Esta propiedad se puede pasar desde un componente padre utilizando la decoración @Input.
   *
   * @property {boolean} anchoCompleto
   * @default false
   */
 @Input() anchoCompleto = false;
}
