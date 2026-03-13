/**
 * @description
 * Componente para gestionar un modal.
 * Este componente permite mostrar y ocultar un modal en la interfaz de usuario.
 */
import { Component } from '@angular/core';

/**
 * @description
 * Decorador del componente Angular que define el selector, la plantilla y los estilos del componente.
 */
@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'], // Fixed typo: changed `styleUrl` to `styleUrls`
})
export class ModalComponent {
  /**
   * @description
   * Constructor del componente ModalComponent.
   * Inicializa el componente.
   */
  constructor() {
    // Initialize any required properties or call necessary methods here
  }
}