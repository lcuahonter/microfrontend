/**
 * @fileoverview Componente correspondiente al Paso 3 del flujo de trámite.
 * Este componente gestiona la obtención de la firma electrónica por parte del usuario
 * y realiza la navegación al acuse una vez que la firma ha sido proporcionada correctamente.
 */

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FirmaElectronicaComponent } from '@libs/shared/data-access-user/src';
import { Router } from '@angular/router';

/**
 * @class PasoTresComponent
 * @selector app-paso-tres
 * @descripcion
 * Componente que representa el tercer paso dentro del proceso del trámite.
 * Su función principal es recibir la firma electrónica emitida por el usuario
 * mediante el componente de firma y, una vez validada, dirigir al usuario a la
 * página de acuse del trámite.
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
   * @descripcion
   * Inicializa el componente e inyecta el servicio de navegación para permitir
   * redireccionamientos a otras rutas dentro de la aplicación.
   *
   * @param {Router} router - Servicio de Angular utilizado para gestionar la navegación entre rutas.
   */
  constructor(private router: Router) {}

  /**
   * @método obtieneFirma
   * @descripcion
   * Método ejecutado cuando se recibe la firma electrónica desde el componente hijo.
   * En caso de que la firma sea válida (cadena no vacía), se realiza la navegación
   * automática hacia la vista de acuse del trámite.
   *
   * @param {string} ev - Firma electrónica generada por el usuario.
   * @returns {void}
   *
   * @ejemplo
   * ```typescript
   * // Evento emitido desde el componente FirmaElectronicaComponent
   * <app-firma-electronica (firmaGenerada)="obtieneFirma($event)"></app-firma-electronica>
   * ```
   */
  obtieneFirma(ev: string): void {
    const FIRMA: string = ev;

    if (FIRMA) {
      this.router.navigate(['servicios-extraordinarios/acuse']);
    }
  }
}
