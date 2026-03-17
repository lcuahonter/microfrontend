import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-action-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './action-message.component.html'
})
export class ActionMessageComponent {
  /**
   * El mensaje que se mostrará en el componente.
   */
  @Input() message: string = '';

  @Input() showCancelBtn: boolean = true;

  /**
   * Texto opcional para el botón 'Si'. Por defecto 'Si'.
   */
  @Input() confirmText: string = 'Si';

  /**
   * Texto opcional para el botón 'No'. Por defecto 'No'.
   */
  @Input() cancelText: string = 'No';

  /**
   * Emite un evento cuando se hace clic en el botón 'Si'.
   */
  @Output() confirmAction = new EventEmitter<void>();

  /**
   * Emite un evento cuando se hace clic en el botón 'No'.
   */
  @Output() cancelAction = new EventEmitter<void>();

  onConfirm(): void {
    this.confirmAction.emit();
  }

  onCancel(): void {
    this.cancelAction.emit();
  }
}
