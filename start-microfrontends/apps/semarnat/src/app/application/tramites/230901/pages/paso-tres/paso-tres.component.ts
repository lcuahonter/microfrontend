import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { UtilidadesService } from '../../services/utilidades.service';

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
  selector: 'paso-tres',
  templateUrl: './paso-tres.component.html',
  styleUrl: './paso-tres.component.scss',
})
export class PasoTresComponent {
  /**
 * Utilidades a reutilizar dentro del tramite
 */
  public utils = inject(UtilidadesService);
  /** 
   * Inicializa el estado del formulario 
  */
  public solicitudState = this.utils.solicitud;

  /** 
   * Estado actual de la consulta gestionado por el store `ConsultaioQuery`. 
  */
  public consultaState = this.utils.consultaState;

  /**
   * @constructor
   * @description
   * Constructor que inyecta `Router` para la navegación.
   *
   * @param {Router} router - Servicio de Angular para manejar la navegación.
   * @access public
   */

  idSolicitud = signal(+this.solicitudState().idSolicitud)

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
      this.router.navigate(['servicios-extraordinarios/acuse']);
    }
  }
}