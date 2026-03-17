import {
  AnexoExportacion,
  AnexoImportacion,
} from '../../models/complementaria.model';
import { Component, OnDestroy } from '@angular/core';
import { filter, Subject, take, takeUntil } from 'rxjs';
import { Anexo } from '../../../../shared/models/anexos.model';
import { AnexosComponent } from '../../../../shared/components/anexos/anexos.component';
import { CommonModule } from '@angular/common';
import { ModificacionProgramaImmexBajaSubmanufactureraService } from '../../services/modificacion-programa-immex-baja-submanufacturera.service';
import { Tramite80303Query } from '../../estados/tramite80303Query.query';
import { Tramite80303Store } from '../../estados/tramite80303Store.store';

@Component({
  selector: 'app-anexo-uno-pestana',
  standalone: true,
  imports: [CommonModule, AnexosComponent],
  templateUrl: './anexo-uno-pestana.component.html',
  styleUrl: './anexo-uno-pestana.component.scss',
})
export class AnexoUnoPestanaComponent implements OnDestroy {
 /**  Anexo exportacion tabla datos. */
  public anexoExportacionTablaDatos: AnexoExportacion[] = [];
  /**  Anexo importacion tabla datos. */
  public anexoImportacionTablaDatos: AnexoImportacion[] = [];
  /**  Sensibles tabla datos. */
  public sensiblesTablaDatos: Anexo[] = [];
 /**
   * Buscar ID de la solicitud
   * @type {string[]}
   */
  buscarIdSolicitud!: string[];
  /**  Destroy notifier$ subject. */
  private destroyNotifier$: Subject<void> = new Subject<void>();

  constructor(
    public modificacionProgramaImmexBajaSubmanufactureraService: ModificacionProgramaImmexBajaSubmanufactureraService,
    public tramite80303Querry: Tramite80303Query,
    public tramite80303Store: Tramite80303Store
  ) {
     this.tramite80303Querry.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        filter((solicitud) => Boolean(solicitud?.buscarIdSolicitud?.length)),
        take(1)
      )
      .subscribe((solicitud) => {
        if (solicitud?.buscarIdSolicitud) {

          this.buscarIdSolicitud = solicitud.buscarIdSolicitud;
          this.fetchAnexoExportacionTablaDatos();
          this.fetchAnexoImportacionTablaDatos();
          this.fetchSensiblesTablaDatos();
        }
      });
  }
/**
 * Fetch anexo importacion tabla datos.
 */
  fetchAnexoImportacionTablaDatos(): void {

    this.modificacionProgramaImmexBajaSubmanufactureraService
      .consultarMercanciasImportacion([this.buscarIdSolicitud?.[0] ?? ''])
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((response) => {
        if (response && response.codigo === '00' && response.datos) {
          this.anexoImportacionTablaDatos = response.datos;
          this.tramite80303Store.updateAnexoImportacionTablaDatos(response.datos);
        }
      });
  }

  /**
   * Fetch anexo exportacion tabla datos.
   */
  fetchAnexoExportacionTablaDatos(): void {

    this.modificacionProgramaImmexBajaSubmanufactureraService
      .consultarProductosExportacion(this.buscarIdSolicitud?.[0] ?? '')
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((response) => {
        if (response && response.codigo === '00' && response.datos) {
          this.anexoExportacionTablaDatos = response.datos;
          this.tramite80303Store.updateAnexoExportacionTablaDatos(response.datos);
        }
      });
  }

  /**
   * Fetch sensibles tabla datos.
   */
  fetchSensiblesTablaDatos(): void {

    this.modificacionProgramaImmexBajaSubmanufactureraService
      .consultarFraccionesSensibles(this.buscarIdSolicitud?.[0] ?? '')
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((response) => {
        if (response && response.codigo === '00' && response.datos) {
          this.sensiblesTablaDatos = response.datos;
          this.tramite80303Store.updateSensiblesTablaDatos(response.datos);
        }
      });
  }
  /**
 * Método del ciclo de vida de Angular que se ejecuta cuando el componente se destruye.
 * Limpia las suscripciones activas para prevenir fugas de memoria.
 * 
 * @description Este método notifica a todas las suscripciones que deben completarse
 * y libera los recursos asociados al Subject destroyNotifier$.
 * 
 * @returns {void} No retorna ningún valor.
 */
   ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}