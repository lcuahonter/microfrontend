import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { FirmaElectronicaComponent } from '@libs/shared/data-access-user/src';

/**
 * Componente que representa el paso tres del proceso, generalmente relacionado con la firma electrónica.
 *
 * Este componente es **standalone** y utiliza:
 * - `FirmaElectronicaComponent`: Componente responsable de la funcionalidad de firma digital.
 * - `CommonModule`: Para acceso a directivas comunes de Angular (como *ngIf, *ngFor, etc.).
 *
 * Se renderiza con el selector `app-paso-tres`.
 *
 * @component
 * @selector app-paso-tres
 * @standalone
 * @imports CommonModule, FirmaElectronicaComponent
 * @template ./paso-tres.component.html
 * @style ./paso-tres.component.scss
 */
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
