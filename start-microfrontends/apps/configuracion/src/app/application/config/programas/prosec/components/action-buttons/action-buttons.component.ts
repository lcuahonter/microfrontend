import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorMessagesComponent } from '@libs/shared/data-access-user/src';

@Component({
  selector: 'app-action-buttons',
  standalone: true,
  imports: [CommonModule, ErrorMessagesComponent],
  templateUrl: './action-buttons.component.html'
})
export class ActionButtonsComponent {
  /**
   * Lista de errores para mostrar
   */
  @Input() errors: string[] = [];

  /**
   * Mensaje de éxito para mostrar
   */
  @Input() successMessage: string = '';

  /**
   * Evento al hacer click en Guardar
   */
  @Output() save = new EventEmitter<void>();

  /**
   * Evento al hacer click en Cancelar
   */
  @Output() cancel = new EventEmitter<void>();

  @Input() saveButtonDisabled: boolean = false;

  onSave(): void {
    this.save.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
