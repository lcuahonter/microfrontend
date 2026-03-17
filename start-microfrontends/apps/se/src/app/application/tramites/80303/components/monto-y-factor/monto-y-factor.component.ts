import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

/**
 * @@Component
 * Decorador que define un componente en Angular. 
 * Este decorador se utiliza para asociar metadatos con la clase del componente, 
 * permitiendo que Angular reconozca y maneje el componente dentro de la aplicación.
 * 
 * Propiedades:
 * - `selector`: Define el nombre del selector que se utilizará para instanciar este componente en una plantilla HTML.
 * - `standalone`: Indica si el componente es independiente y no depende de un módulo específico.
 * - `imports`: Lista de módulos que este componente necesita para funcionar correctamente.
 * - `templateUrl`: Ruta del archivo HTML que define la estructura visual del componente.
 * - `styleUrl`: Ruta del archivo SCSS que contiene los estilos específicos para este componente.
 * 
 * Este decorador es esencial para crear componentes reutilizables y modulares en Angular.
 */
@Component({
  selector: 'app-monto-y-factor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './monto-y-factor.component.html',
  styleUrl: './monto-y-factor.component.scss',
})
export class MontoYFactorComponent {}
