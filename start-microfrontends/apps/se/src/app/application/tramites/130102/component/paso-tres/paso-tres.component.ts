/**
 * PasoTresComponent
 * */

import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FirmaElectronicaComponent } from '@libs/shared/data-access-user/src';
import { Router } from '@angular/router';

/**
 * PasoTresComponent
 * @nombre PasoTresComponent
 * @descripcion Componente que representa el tercer paso de un proceso. 
 * Este componente maneja la firma electrónica y redirige a otra página cuando se obtiene la firma.
 */
@Component({
  selector: 'app-paso-tres',
  standalone: true, 
  imports: [
    CommonModule, 
    FirmaElectronicaComponent, 
  ],
  templateUrl: './paso-tres.component.html', 
})
export class PasoTresComponent {
  /**
   * componente doc
   * @constructor
   * @param {Router} router - Servicio de Angular para la navegación entre rutas.
   */
  constructor(private router: Router,
    
  ) {
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
