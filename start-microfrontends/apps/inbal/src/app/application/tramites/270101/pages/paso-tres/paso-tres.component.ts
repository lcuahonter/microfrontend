import { Component } from '@angular/core';
import { Router } from '@angular/router';

/**
 * Componente que representa el paso tres de un proceso.
 */
@Component({
  selector: 'app-paso-tres',
  templateUrl: './paso-tres.component.html',
})
export class PasoTresComponent {
  /**
   * Constructor del componente que inyecta el servicio Router.
   * @param router Servicio de navegación.
   */
  constructor(private router: Router) {
    // Constructor del componente
  }

  /**
   * Obtiene la firma electrónica y navega a la página de acuse si la firma es válida.
   * @param ev Evento que contiene la firma electrónica como string.
   */
  obtieneFirma(ev: string): void {
    const FIRMA: string = ev;
    if (FIRMA) {
      this.router.navigate(['servicios-extraordinarios/acuse']); // Navegación a la página de acuse
    }
  }
}
