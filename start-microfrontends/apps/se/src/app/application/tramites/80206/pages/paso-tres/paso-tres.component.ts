/**
 * El `PasoTresComponent` es un componente de Angular diseñado para gestionar la funcionalidad del tercer paso del trámite.
 * Proporciona la lógica para manejar la firma electrónica y redirigir al usuario a la página de acuse.
 * 
 * Este componente utiliza el servicio de enrutamiento de Angular (`Router`) para redirigir al usuario después de obtener la firma electrónica.
 */

import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-paso-tres',
  templateUrl: './paso-tres.component.html',
})
export class PasoTresComponent {
  /**
   * Constructor del componente.
   * 
   */
  constructor(private router: Router) {
    // No se necesita lógica de inicialización adicional.
  }

  /**
   * Maneja la firma electrónica obtenida y redirige al usuario a la página de acuse.
   * 
   */
  obtieneFirma(ev: string): void {
    const FIRMA: string = ev;
    if (FIRMA) {
      this.router.navigate(['servicios-extraordinarios/acuse']);
    }
  }
}