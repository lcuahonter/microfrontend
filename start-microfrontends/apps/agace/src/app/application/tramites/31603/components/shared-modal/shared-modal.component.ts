import { Component, EventEmitter, Input, Output } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';

/**
 * Componente modal reutilizable con animación de aparición y desaparición.
 *
 * Este componente muestra un modal simple con un mensaje y un botón para cerrar.
 * Utiliza animaciones para hacer un efecto de fade-in y fade-out al mostrarse y ocultarse.
 *
 * @example
 * <app-shared-modal
 *   [visible]="mostrarModal"
 *   [message]="'Mensaje de ejemplo'"
 *   (closed)="cerrarModal()"
 * ></app-shared-modal>
 *
 * @selector app-shared-modal
 * @standalone
 * @imports [CommonModule]
 * @animations fadeInOut
 */
@Component({
  selector: 'app-shared-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shared-modal.component.html',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.9)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'scale(1)' })),
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'scale(0.9)' })),
      ]),
    ]),
  ]
})
export class SharedModalComponent {
 /**
   * Controla la visibilidad del modal.
   * Si es true, el modal se muestra; si es false, se oculta.
   */
  @Input() visible = false;
   /**
   * Mensaje que se muestra dentro del modal.
   */
  @Input() message = '';
  /**
   * Evento emitido cuando el usuario cierra el modal.
   */
  @Output() closed = new EventEmitter<void>();

   /**
   * Método que emite el evento de cerrado.
   */
  onClose():void {
    this.closed.emit();
  }
}
