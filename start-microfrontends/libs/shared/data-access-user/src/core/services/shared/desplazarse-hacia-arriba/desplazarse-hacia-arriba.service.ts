import { Injectable } from '@angular/core';

/**
 * Servicio para realizar un desplazamiento suave hacia la parte superior de la página.
 *
 * Este servicio puede ser inyectado en cualquier componente para mejorar la experiencia de usuario,
 * permitiendo que la vista se desplace automáticamente al inicio de la página cuando sea necesario.
 *
 * @export
 * @class DesplazarseHaciaArribaService
 */
@Injectable({
  providedIn: 'root'
})
export class DesplazarseHaciaArribaService {
  /**
   * Define el comportamiento del desplazamiento (por defecto: 'smooth').
   */
  private comportamientoDesplazamiento: ScrollBehavior = 'smooth';
 
  /**
   * Realiza un scroll suave hacia la parte superior de la página.
   */
  desplazarArriba(): void {
    window.scrollTo({ top: 0, behavior: this.comportamientoDesplazamiento });
  }
}
