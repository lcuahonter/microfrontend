import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ConfirmarNotificacionService } from '../services/confirmar-notificacion.service';
import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs';

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
export class DetallesFolioComponent implements OnInit, OnDestroy {
  /**
   * Subject utilizado para gestionar la desuscripción de observables.
   * Se completa en `ngOnDestroy()`.
   *
   * @private
   * @type {Subject<void>}
   */
  private unsubscribe$ = new Subject<void>();

  /**
   * Objeto que almacena los datos del folio del trámite.
   * Incluye el tipo de solicitud y el folio del trámite.
   *
   * @type {{ tipoDeSolicitud: string; folioDelTramite: string; }}
   */
  public folioTablaDatos = {
    tipoDeSolicitud: '',
    folioDelTramite: '',
  };

  /**
   * @constructor
   * @param {ConfirmarNotificacionService} confirmarNotificacionService - Servicio para obtener datos de folio.
   */
  constructor(
    private confirmarNotificacionService: ConfirmarNotificacionService
  ) {
    // Constructor necesario para el servicio.
  }

  /**
   * Hook de inicialización del componente.
   * Obtiene los datos de folio de trámite al cargar el componente.
   *
   * @returns {void}
   */
  ngOnInit(): void {
    this.confirmarNotificacionService
      .getFolioDatos()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        this.folioTablaDatos = data;
      });
  }

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
