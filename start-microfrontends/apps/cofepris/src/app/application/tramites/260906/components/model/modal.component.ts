import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Componente modal reutilizable.
 * Este componente se utiliza para mostrar contenido en una ventana modal.
 */
@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
})
export class ModalComponent {
  /**
   * Propiedad que indica si el modal está activo o visible.
   * 
   * @type {boolean}
   * @default false
   * @description Cuando es `true`, el modal se muestra en pantalla. Cuando es `false`, el modal está oculto.
   */
  @Input() active = false;
}