import { Component } from '@angular/core';
import { Router } from '@angular/router';

/**
 * Componente para el paso tres del trámite 32605.
 * Este componente se utiliza para mostrar los pasos del asistente - 32605
 * Lista de pasos
 * Índice del paso
 */
@Component({
  selector: 'app-paso-tres',
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
      this.router.navigate(['temporal-contenedores/acuse']); // Navegación a la página de acuse
    }
  }
}
