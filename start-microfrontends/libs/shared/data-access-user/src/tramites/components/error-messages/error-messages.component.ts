import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error-messages',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './error-messages.component.html',
  styleUrls: ['./error-messages.component.scss']
})
export class ErrorMessagesComponent {
  /**
   * Lista de errores para mostrar
   */
  @Input() errors: string[] = [];

  /**
   * Mensaje de éxito para mostrar
   */
  @Input() successMessage: string = '';

}
