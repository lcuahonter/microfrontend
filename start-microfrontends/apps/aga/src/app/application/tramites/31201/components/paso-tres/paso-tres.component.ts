import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FirmaElectronicaComponent } from '@libs/shared/data-access-user/src';
import { Router } from '@angular/router';

/**
 * @component
 * @name PasoTresComponent
 * @description
 * Componente que representa el tercer paso de un proceso.
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
   * @constructor
   * @name PasoTresComponent
   * @description
   * Constructor del componente `PasoTresComponent`.
   * @param {Router} router - Servicio de Angular para la navegación entre rutas.
   */
  constructor(private router: Router) {
    // Constructor
  }

  /**
   * @method
   * @name obtieneFirma
   * @description
   * Recibe la firma electrónica y redirige a la página de acuse si la firma es válida.
   * @param {string} ev - Cadena que representa la firma electrónica obtenida.
   */
  obtieneFirma(ev: string): void {
    const FIRMA: string = ev;
    if (FIRMA) {
      this.router.navigate(['servicios-extraordinarios/acuse']); // Navegación a la página de acuse
    }
  }
}
