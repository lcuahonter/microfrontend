import { Component } from '@angular/core';
import { Router } from '@angular/router';

/**
 * Componente PasoTresComponent
 * @description Este componente es parte del proceso de firma electrónica en el trámite 260504.
 *              Se encarga de recibir la firma electrónica y redirigir al usuario a la página de acuse.
 */
@Component({
  selector: 'app-paso-tres',
  templateUrl: './paso-tres.component.html',
})
export class PasoTresComponent {
  /**
   * componente doc
   * @constructor
   * @param {Router} router - Servicio de Angular para la navegación entre rutas.
   */
  constructor(private router: Router) {
    // Constructor del componente
  }

  /**
   * componente doc
   * @método obtieneFirma
   * @descripcion Recibe la firma electrónica y redirige a la página de acuse si la firma es válida.
   * @param {string} ev - Cadena que representa la firma electrónica obtenida.
   */
  obtieneFirma(ev: string): void {
    const FIRMA: string = ev;
    if (FIRMA) {
      this.router.navigate(['servicios-extraordinarios/acuse']); // Navegación a la página de acuse
    }
  }
}
