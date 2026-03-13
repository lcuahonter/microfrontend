import { CommonModule } from '@angular/common';

import { Component, Input } from '@angular/core';

import { OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';


/**
 * @component DetallesFolioComponent
 * @description
 * Componente encargado de mostrar los detalles del folio del trámite.
 * Obtiene los datos a través del servicio de confirmación de notificación.
 *
 * @example
 * <app-detalles-folio></app-detalles-folio>
 */
@Component({
  selector: 'app-detalles-folio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detalles-folio.component.html',
  styleUrl: './detalles-folio.component.scss',
})
export class DetallesFolioComponent implements OnDestroy {
  /**
   * Subject utilizado para gestionar la desuscripción de observables.
   * Se completa en `ngOnDestroy()`.
   *
   * @private
   * @type {Subject<void>}
   */
  private unsubscribe$ = new Subject<void>();

  /**
   * Folio del trámite.
   *
   * @type {string}
   */
  @Input() folioTramite?: string;

  /**
   * Datos del folio, incluyendo tipo de solicitud y otros detalles.
   *
   * @type {string}
   */
  @Input() tipoSolicitud?: string;

  /**
   * Hook de destrucción del componente.
   * Libera recursos completando el observable `unsubscribe$`.
   *
   * @returns {void}
   */
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
