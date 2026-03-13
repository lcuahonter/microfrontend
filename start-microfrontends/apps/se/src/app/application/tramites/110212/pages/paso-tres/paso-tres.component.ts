import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FirmaElectronicaComponent } from "@libs/shared/data-access-user/src";
import { Router } from '@angular/router';

/**
 * @class PasoTresComponent
 * @description
 * Este componente gestiona el tercer paso de un trámite, donde se obtiene la firma electrónica del usuario.
 *
 * @since 1.0.0
 * @version 1.0.0
 * @license MIT
 *
 * @selector app-paso-tres
 * @standalone true
 * @requires CommonModule
 * @requires FirmaElectronicaComponent
 *
 * @templateUrl ./paso-tres.component.html
 * @styleUrl ./paso-tres.component.scss
 */
@Component({
  selector: 'app-paso-tres',
  standalone: true,
  imports: [CommonModule, FirmaElectronicaComponent],
  templateUrl: './paso-tres.component.html',
  styleUrl: './paso-tres.component.scss',
})
export class PasoTresComponent {

  /**
   * @constructor
   * @description
   * Constructor que inyecta `Router` para la navegación.
   *
   * @param {Router} router - Servicio de Angular para manejar la navegación.
   * @access public
   */
  constructor(private router: Router) {
    // Constructor
  }

  /**
   * @method obtieneFirma
   * @description
   * Método que maneja la obtención de la firma electrónica.
   * Si la firma es válida, navega a la página de acuse.
   *
   * @param {string} ev - Evento que contiene la firma electrónica.
   * @returns {void}
   * @access public
   */
  obtieneFirma(ev: string): void {
    const FIRMA = ev;
    if (FIRMA) {
      this.router.navigate(['inicialmente-certificado-origen/acuse']);
    }
  }
}