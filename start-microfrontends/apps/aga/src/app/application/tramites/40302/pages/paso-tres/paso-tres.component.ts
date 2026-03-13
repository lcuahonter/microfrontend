import { Component } from '@angular/core';
import { Router } from '@angular/router';

/**
 * # Documentación - PasoTresComponent
 * `PasoTresComponent` es un componente de Angular encargado de gestionar una sección específica en la aplicación.
 *
 * ### Selector
 * - **Selector del componente**: `app-paso-tres`
 * - **standalone**: `false`
 * - **templateUrl**: `./paso-tres.component.html`
 */
@Component({
  selector: 'app-paso-tres',
  standalone: false,
  templateUrl: './paso-tres.component.html',
})
export class PasoTresComponent {

  /**
   * ## Constructor
   * El constructor inicializa una instancia del enrutador (`Router`) proporcionado por Angular para manejar la navegación entre rutas.
   *
   * ### Dependencias
   * - `Router`: Utilizado para manejar la navegación en la aplicación.
   */
  constructor(private router: Router) {
    // Constructor del componente
  }

  /**
   * ## Método: obtieneFirma
   * Este método toma un evento `ev` como argumento, obtiene una firma y, si la firma está presente, navega a la ruta `servicios-extraordinarios/acuse`.
   *
   * #### Parámetros
   * - **ev**: Una cadena de texto que contiene la firma.
   *
   * #### Implementación
   * ```typescript
   * obtieneFirma(ev: string): void {
   *   const FIRMA: string = ev;
   *   if (FIRMA) {
   *     this.router.navigate(['servicios-extraordinarios/acuse']);
   *   }
   * }
   * ```
   */
  obtieneFirma(ev: string): void {
    const FIRMA: string = ev;
    if (FIRMA) {
      this.router.navigate(['servicios-extraordinarios/acuse']);
    }
  }
}

