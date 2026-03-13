import { Component } from '@angular/core';

/**
 * Componente `MontoFactorComponent`
 *
 * Este componente representa la sección de "Monto y Factor" en la interfaz de usuario.
 * Es un componente independiente (`standalone`) que puede ser usado sin necesidad de declararse en un módulo.
 */
@Component({
  selector: 'app-monto-factor', // Selector para usar el componente en plantillas HTML
  templateUrl: './monto-factor.component.html', // Ruta del archivo de plantilla HTML
  styleUrl: './monto-factor.component.scss', // Ruta del archivo de estilos SCSS
  standalone: true // Marca este componente como independiente
})
export class MontoFactorComponent {
  /**
   * Constructor vacío.
   * Puedes implementar lógica de inicialización aquí si se requieren datos o servicios en el futuro.
   */
  constructor() {
    // Aquí puedes inicializar variables o servicios si es necesario
  }
}
