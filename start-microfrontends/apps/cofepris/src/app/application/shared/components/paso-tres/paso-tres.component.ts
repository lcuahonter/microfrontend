import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { FirmaElectronicaComponent } from '@libs/shared/data-access-user/src';

@Component({
  selector: 'app-paso-tres',
  standalone: true,
  imports: [ CommonModule, 
    FirmaElectronicaComponent, ],
  templateUrl: './paso-tres.component.html',
  styleUrl: './paso-tres.component.scss',
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
