import { Component, NgZone } from '@angular/core';
import { akitaDevtools } from '@datorama/akita';

/**
 * Componente raíz de la aplicación Cofepris.
 * 
 * @export
 * @class AppComponent
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  /**
   * Título de la aplicación.
   * 
   * @type {string}
   * @memberof AppComponent
   */
  title = 'vucem-3.0-frontend';

  /**
   * Constructor del componente.
   * 
   * @param {NgZone} ngZone - Zona de Angular para la detección de cambios.
   * @memberof AppComponent
   */
  constructor(
    private ngZone: NgZone,
  ) {
    akitaDevtools(ngZone, {});
  }
}