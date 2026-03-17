import { AlertComponent, AnexarDocumentosComponent, Catalogo, TEXTOS, TituloComponent } from '@ng-mf/data-access-user';
import { Component, OnDestroy } from '@angular/core';
import { Subject, catchError, map, takeUntil } from 'rxjs';
import { Router } from '@angular/router';

import { TramiteFolioService, TramiteStore } from '@ng-mf/data-access-user';

/**
 * Componente para gestionar el paso dos del trámite.
 */
@Component({
  selector: 'app-paso-dos',
  templateUrl: './paso-dos.component.html',
  styleUrl: './paso-dos.component.scss',
  standalone: true,
  imports: [AnexarDocumentosComponent, AlertComponent, TituloComponent]
})

export class PasoDosComponent implements OnDestroy {
  /**
   * Subject para destruir notificador.
   */
  private destruirNotificador$: Subject<void> = new Subject();

  /**
   * Constructor del componente.
   * 
   * @param router Servicio de enrutamiento.
   * @param serviciosExtraordinariosServices Servicio para gestionar los servicios extraordinarios.
   * @param tramiteStore Almacén para gestionar el estado del trámite.
   */
  constructor(
    private router: Router,
    private tramiteFolioService: TramiteFolioService,
    private tramiteStore: TramiteStore
  ) {
    // El constructor se utiliza para la inyección de dependencias.
  }

  /**
   * Maneja el evento para obtener la firma y realiza acciones adicionales.
   * @param ev - La cadena de texto que representa la firma obtenida.
   */
  obtieneFirma(ev: string): void {
    const FIRMA: string = ev;
    if (FIRMA) {
      // Obtiene el número de trámite
      this.tramiteFolioService
        .obtenerTramite(19)
        .pipe(
          map((tramite) => {
            this.tramiteStore.establecerTramite(tramite.data, FIRMA);
            this.router.navigate(['servicios-extraordinarios/acuse']);
          }),
          catchError((_error) => {
            return _error;
          }),
          takeUntil(this.destruirNotificador$)
        )
        .subscribe();
    }
  }

  /**
   * Se ejecuta al destruir el componente.
   * Emite un valor y completa el subject `destruirNotificador$` para cancelar las suscripciones.
   */
  ngOnDestroy(): void {
    this.destruirNotificador$.next();
    this.destruirNotificador$.complete();
  }

  /**
     * Catálogo de documentos disponibles para el trámite.
     * @type {Catalogo[]}
     */
    catalogoDocumentos: Catalogo[] = [];

  /**
   * Clase CSS para mostrar alertas informativas.
   * @type {string}
   */
    infoAlert = 'alert-info';
    /**
     * Constante que contiene los textos utilizados en el componente.
     * @type {any}
     */
    TEXTOS = TEXTOS;
}
