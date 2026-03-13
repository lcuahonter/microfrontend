import { AcuseReciboComponent } from '../acuse-recibo/acuse-recibo.component';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DetallesFolioComponent } from '../detalles-folio/detalles-folio.component';
import { FirmaElectronicaComponent } from '@ng-mf/data-access-user';
import { NotificacionActoAdministrativoComponent } from '../notificacion-acto-administrativo/notificacion-acto-administrativo.component';
import { Router } from '@angular/router';
import { TituloComponent } from '@ng-mf/data-access-user';

/**
 * @component ConfirmarNotificacionComponent
 * @description
 * Componente encargado de gestionar el flujo de confirmación de una notificación.
 * Maneja el cambio de pasos entre los componentes internos como Acuse de Recibo, Firma Electrónica, y detalles del acto administrativo.
 *
 * @example
 * <ng-mf-confirmar-notificacion></ng-mf-confirmar-notificacion>
 */
@Component({
  selector: 'ng-mf-confirmar-notificacion',
  standalone: true,
  imports: [
    CommonModule,
    TituloComponent,
    DetallesFolioComponent,
    NotificacionActoAdministrativoComponent,
    AcuseReciboComponent,
    FirmaElectronicaComponent,
  ],
  templateUrl: './confirmar-notificacion.component.html',
  styleUrl: './confirmar-notificacion.component.scss',
})
export class ConfirmarNotificacionComponent {
  /**
   * @property indiceDePaso
   * @description
   * Controla el índice del paso actual en el flujo.
   * - 1: Inicio
   * - 2: Acto Administrativo
   * - 3: Acuse de Recibo / Firma Electrónica
   *
   * El valor inicial es 1. Si la navegación actual incluye el estado `isAcuseRecibo`, se establece en 3.
   *
   * @type {number}
   */
  public indiceDePaso = 1;

  /**
   * @constructor
   * @param {Router} router - Servicio de Angular Router para la navegación entre rutas.
   */
  constructor(private router: Router) {
    const CURRENT_NAVIGATION = this.router.getCurrentNavigation();
    if (CURRENT_NAVIGATION?.extras.state?.['isAcuseRecibo']) {
      this.indiceDePaso = 3;
    }
  }

  /**
   * @method alContinuar
   * @description
   * Incrementa el `indiceDePaso` para avanzar al siguiente paso en el flujo.
   *
   * @returns {void}
   */
  alContinuar(): void {
    this.indiceDePaso = this.indiceDePaso + 1;
  }

  /**
   * @method obtieneFirma
   * @description
   * Método invocado cuando se obtiene la firma electrónica.
   * Ajusta el `indiceDePaso` directamente al paso 3.
   *
   * @param {string} ev - Evento recibido (firmado).
   * @returns {void}
   */
  obtieneFirma(ev: string): void {
    this.indiceDePaso = 3;
  }

  /**
   * @method cerrar
   * @description
   * Finaliza el flujo y redirige al usuario a la bandeja de tareas pendientes.
   *
   * @returns {void}
   */
  cerrar(): void {
    this.router.navigate(['/bandeja-de-tareas-pendientes']);
  }
}
