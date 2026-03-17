/**
 * @fileoverview Componente del tercer paso para el trámite de ampliación de servicios IMMEX.
 * 
 * Este componente representa el paso final del wizard de registro,
 * manejando la obtención de firma digital y navegación al acuse de recibo.
 * 
 * @component PasoTresComponent
 * @selector app-paso-tres
 * @templateUrl ./paso-tres.component.html
 */

import { Component } from '@angular/core';
import { Router } from '@angular/router';

/**
 * Componente del tercer y último paso en el flujo de trámites de ampliación de servicios.
 * 
 * Este componente maneja la finalización del proceso, incluyendo la obtención
 * de firma digital y la navegación hacia la página de acuse de recibo.
 * 
 * @class PasoTresComponent
 */
@Component({
  selector: 'app-paso-tres',
  templateUrl: './paso-tres.component.html',
  
})
export class PasoTresComponent {
  /**
   * Constructor del componente PasoTresComponent.
   * 
   * Inicializa el servicio de navegación requerido para redirigir
   * al usuario a diferentes rutas de la aplicación.
   * 
   * @constructor
   * @param {Router} router - Servicio de Angular Router para la navegación entre rutas
   */
  constructor(private router: Router) {
    // No se necesita lógica de inicialización adicional.
  }

  /**
   * Maneja el evento de obtención de firma digital y redirige al acuse.
   *
   * Procesa la firma obtenida del usuario y, si es válida,
   * navega automáticamente a la página de acuse de recibo.
   *
   * @method obtieneFirma
   * @param {string} ev - Cadena de texto que representa la firma digital obtenida
   * @returns {void} Este método no retorna ningún valor
   * 
   * @example
   * ```typescript
   * this.obtieneFirma('firma_digital_valida');
   * // Navega a: 'servicios-extraordinarios/acuse'
   * ```
   */
  obtieneFirma(ev: string): void {
    const FIRMA: string = ev;
    if (FIRMA) {
      this.router.navigate(['servicios-extraordinarios/acuse']);
    }
  }
}
