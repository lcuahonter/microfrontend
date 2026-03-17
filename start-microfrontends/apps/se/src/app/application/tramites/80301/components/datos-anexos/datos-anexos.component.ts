import { Component, OnDestroy } from '@angular/core';
import { Subject, filter, take, takeUntil } from 'rxjs';
import { Anexo } from '../../../../shared/models/anexos.model';
import { AnexosComponent } from '../../../../shared/components/anexos/anexos.component';
import { SolicitudService } from '../../services/solicitud.service';
import { Tramite80301Query } from '../../estados/tramite80301.query';
import { Tramite80301Store } from '../../estados/tramite80301.store';

/**
 * Componente DatosAnexosComponent que maneja la visualización de los anexos de exportación e importación.
 * Proporciona funcionalidades para cargar y mostrar los anexos relacionados con el trámite 80301.
 * @component DatosAnexosComponent
 */
@Component({
  selector: 'app-datos-anexos',
  templateUrl: './datos-anexos.component.html',
  styleUrl: './datos-anexos.component.scss',
  standalone: true,
  imports: [AnexosComponent],
  providers: [SolicitudService],
})

/**
 * Clase que representa el componente de anexos de exportación e importación.
 * @class DatosAnexosComponent
 */
export class DatosAnexosComponent implements OnDestroy {
  /**
   * Datos de los anexos de exportación obtenidos desde el servicio.
   * @type {Anexo[]}
   */
  datosExportacion: Anexo[] = [];

  /**
   * Datos de los anexos de importación obtenidos desde el servicio.
   * @type {Anexo[]}
   */
  datosImportacion: Anexo[] = [];

  /**
   * Buscar ID de la solicitud
   * @type {string[]}
   */
  buscarIdSolicitud!: string[];

  /**
   * Subject utilizado para notificar cuando se debe completar y limpiar las suscripciones activas.
   * Esto evita fugas de memoria al completar las suscripciones al destruir el componente.
   * @private
   * @type {Subject<void>}
   */
  destroyNotifier$: Subject<void> = new Subject();

  /**
   * Constructor del componente DatosAnexosComponent.
   * @param solicitudService Servicio para manejar las solicitudes de modificación.
   * @param tramite80301Query Consulta para obtener el estado del trámite 80301.
   * @param tramite80301Store Almacén para gestionar el estado del trámite 80301.
   */
  constructor(
    public solicitudService: SolicitudService,
    private tramite80301Query: Tramite80301Query,
    private tramite80301Store: Tramite80301Store
  ) {
    this.tramite80301Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        filter((solicitud) => Boolean(solicitud?.buscarIdSolicitud?.length)),
        take(1)
      )
      .subscribe((solicitud) => {
        this.buscarIdSolicitud = solicitud?.buscarIdSolicitud || [];

        this.obtenerFraccionesExportacion();
        this.obtenerFraccionesImportacion();
      });
  }

  /**
   * Método que obtiene los anexos de exportación desde el servicio.
   * Asigna los datos a la variable `datosExportacion`.
   * @returns {void}
   */
  obtenerFraccionesExportacion(): void {
    this.solicitudService
      .obtenerFraccionesExportacion(this.buscarIdSolicitud)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((fraccionesExportacion) => {
        this.datosExportacion =
          fraccionesExportacion.datos?.map((item: Anexo) => ({
            claveProductoExportacion: item.claveProductoExportacion,
            descripcion:
              (item.fraccionArancelaria?.descripcion || '') +
              (item.complemento?.descripcion || ''),
            tipoFraccion: item.tipoFraccion,
          })) || [];
        this.tramite80301Store.setFraccionesExportacion(this.datosExportacion);
      });
  }

  /**
   * Método que obtiene los anexos complementarios desde el servicio.
   * Asigna los datos a las variables `datosAnexo` y `datosImportacion`.
   * @return {void}
   */
  obtenerFraccionesImportacion(): void {
    this.solicitudService
      .obtenerFraccionesImportacion(this.buscarIdSolicitud)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((fraccionesImportacion) => {
        this.datosImportacion =
          fraccionesImportacion.datos?.map((item: Anexo) => ({
            fraccionPadre: item.fraccionPadre,
            cveFraccion: item.cveFraccion,
            descripcion: item.descripcion,
            tipoFraccion: item.tipoFraccion,
          })) || [];
        this.tramite80301Store.setFraccionesImportacion(this.datosImportacion);
      });
  }

  /**
   * Método que se ejecuta cuando el componente es destruido.
   * Notifica a todos los observables que deben completarse y limpia las suscripciones.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}