import { Component } from '@angular/core';

/**
 * Componente para gestión de monto y factor de ampliación
 * @component MontoFactorComponent
 * @description Componente Angular standalone que maneja la captura y validación
 * del monto de importaciones y factor de ampliación en el trámite 80302.
 * Permite al usuario ingresar los valores financieros requeridos para el
 * cálculo de capacidad del programa IMMEX
 * @author Sistema VUCEM
 * @version 1.0.0
 * @since 2024
 * @standalone
 */
@Component({
  selector: 'app-monto-factor',
  templateUrl: './monto-factor.component.html',
  styleUrl: './monto-factor.component.scss',
  standalone: true
})
export class MontoFactorComponent {
  /**
   * Constructor del componente MontoFactorComponent
   * @constructor
   * @description Inicializa el componente para la gestión de montos y factores
   * de ampliación en programas IMMEX
   */
  constructor() {
    // Componente inicializado sin dependencias
  }
}
