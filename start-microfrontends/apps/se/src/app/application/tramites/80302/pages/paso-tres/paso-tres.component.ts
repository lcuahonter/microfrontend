/**
 * @fileoverview Componente del tercer paso del trámite 80302 para modificaciones IMMEX
 * @description Este archivo contiene el componente Angular que maneja el tercer paso
 * del proceso de solicitud del trámite 80302, incluyendo la gestión de firma electrónica
 * y navegación hacia el acuse de recibo en el sistema VUCEM
 * @author Sistema VUCEM
 * @version 1.0.0
 * @since 2024
 */

import { Component, Inject, OnDestroy } from '@angular/core';
import { Subject, catchError, map, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { TramiteFolioService } from '@ng-mf/data-access-user';
import { TramiteStore } from '../../../../estados/tramite.store';

/**
 * Componente del tercer paso del trámite 80302
 * @component PasoTresComponent
 * @description Componente Angular que gestiona el tercer y último paso del proceso
 * de solicitud del trámite 80302 (modificaciones al programa IMMEX). Se encarga
 * de manejar la firma electrónica del solicitante y la finalización del trámite
 * @implements {OnDestroy}
 * @example
 * ```html
 * <app-paso-tres></app-paso-tres>
 * ```
 * @see {@link TramiteStore} Para gestión del estado del trámite
 * @see {@link TramiteFolioService} Para servicios de trámite y folio
 */
@Component({
  selector: 'app-paso-tres',
  templateUrl: './paso-tres.component.html',
  styleUrl: './paso-tres.component.css',
})
export class PasoTresComponent implements OnDestroy{
  /**
   * Tipo de persona del solicitante
   * @type {number}
   * @description Identificador numérico que determina el tipo de persona
   * (física o moral) que está realizando la solicitud del trámite 80302
   * @example 1 para persona física, 2 para persona moral
   * @public
   */
  tipoPersona!: number;

  /**
   * Subject para manejo de destrucción del componente
   * @type {Subject<void>}
   * @description Observable utilizado para completar suscripciones activas
   * cuando el componente es destruido, evitando memory leaks
   * @private
   */
  private destroy$: Subject<void> = new Subject<void>();

  /**
   * Constructor del componente del paso tres
   * @constructor
   * @description Inicializa el componente con las dependencias necesarias para
   * el manejo del trámite, navegación y gestión de estado
   * @param {Router} router - Servicio de enrutamiento de Angular para navegación
   * @param {TramiteFolioService} serviciosExtraordinariosServices - Servicio para operaciones de trámite y folio
   * @param {TramiteStore} tramiteStore - Store para gestión del estado del trámite
   */
  constructor(
    private router: Router,
    private serviciosExtraordinariosServices: TramiteFolioService,
    @Inject(TramiteStore) private tramiteStore: TramiteStore
  ) {
    // El constructor se utiliza para la inyección de dependencias.
  }

  /**
   * Establece el tipo de persona del solicitante
   * @method obtenerTipoPersona
   * @description Actualiza la propiedad tipoPersona con el valor proporcionado,
   * permitiendo identificar si se trata de una persona física o moral
   * @param {number} tipo - Identificador numérico del tipo de persona
   * @returns {void}
   * @example
   * ```typescript
   * // Para persona física
   * this.obtenerTipoPersona(1);
   * 
   * // Para persona moral
   * this.obtenerTipoPersona(2);
   * ```
   * @public
   */
  obtenerTipoPersona(tipo: number): void {
    this.tipoPersona = tipo;
  }

  /**
   * Procesa la firma electrónica y finaliza el trámite
   * @method obtieneFirma
   * @description Maneja el evento de obtención de firma electrónica, valida su presencia
   * y procede a obtener el trámite correspondiente para luego navegar al acuse de recibo
   * @param {string} ev - Cadena de texto que representa la firma electrónica obtenida
   * @returns {void}
   * @example
   * ```typescript
   * // Procesamiento de firma válida
   * this.obtieneFirma("firma_electronica_base64");
   * ```
   * @see {@link TramiteFolioService.obtenerTramite} Para obtención del trámite
   * @see {@link TramiteStore.establecerTramite} Para almacenamiento del estado
   * @public
   */
  obtieneFirma(ev: string): void {
    const FIRMA: string = ev;
    if (FIRMA) {
      this.serviciosExtraordinariosServices
        .obtenerTramite(19)
        .pipe(
          map((tramite) => {
            this.tramiteStore.establecerTramite(tramite.data, FIRMA);
            this.router.navigate(['servicios-extraordinarios/acuse']);
          }),
          catchError((_error) => {
            return _error;
          }),
          takeUntil(this.destroy$)
        )
        .subscribe();
    }
  }

  /**
   * Método del ciclo de vida de Angular para limpieza al destruir el componente
   * @method ngOnDestroy
   * @description Completa el subject destroy$ para cancelar todas las suscripciones
   * activas y evitar memory leaks cuando el componente es destruido
   * @returns {void}
   * @implements {OnDestroy.ngOnDestroy}
   * @public
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
