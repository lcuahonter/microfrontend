import { Anexo, FraccionSensible } from '../../models/datos-tramite.model';
import { CONFIGURACION_ANEXOS_IMPORTACION, CONFIGURACION_ANEXOS_TABLA, CONFIGURACION_FRACCION_SENSIBLE } from '../../constantes/modificacion.enum';
import { Component, OnDestroy } from '@angular/core';
import { ConfiguracionColumna, ConsultaioQuery, ConsultaioState, TablaDinamicaComponent, TituloComponent } from '@ng-mf/data-access-user';
import { Subject, filter, map, take, takeUntil } from 'rxjs';
import { SolicitudService } from '../../services/solicitud.service';
import { ToastrService } from 'ngx-toastr';
import { Tramite80316Query } from '../../estados/tramite80316.query';
import { Tramite80316Store } from '../../estados/tramite80316.store';

/**
 * Componente `DatosAnexosComponent` utilizado para gestionar y mostrar los datos de los anexos.
 * Este componente es independiente (standalone) y utiliza varios módulos y servicios relacionados.
 */
@Component({
  selector: 'app-datos-anexos',
  templateUrl: './datos-anexos.component.html',
  styleUrl: './datos-anexos.component.scss',
  standalone: true,
  imports: [TablaDinamicaComponent, TituloComponent],
  providers: [SolicitudService, ToastrService],
})
export class DatosAnexosComponent implements OnDestroy {
  /**
   * Subject utilizado para notificar cuando se debe completar y limpiar las suscripciones activas.
   * Esto evita fugas de memoria al completar las suscripciones al destruir el componente.
   * @private
   * @type {Subject<void>}
   */
  destroyNotifier$: Subject<void> = new Subject();

  /**
   * Configuración de las columnas de la tabla para los anexos.
   * Define cómo se mostrarán los datos de los anexos en la tabla.
   * @type {ConfiguracionColumna<Anexo>[]}
   */
  configuracionTablaAnexo: ConfiguracionColumna<Anexo>[] =
    CONFIGURACION_ANEXOS_TABLA;

  /**
   * Configuración de las columnas de la tabla para los anexos de importación.
   * Define cómo se mostrarán los datos de los anexos de importación en la tabla.
   * @type {ConfiguracionColumna<Anexo>[]}
   */
  configuracionTablaImportacion: ConfiguracionColumna<Anexo>[] =
    CONFIGURACION_ANEXOS_IMPORTACION;

  /**
   * Configuración de las columnas de la tabla para las fracciones sensibles.
   * Define cómo se mostrarán los datos de las fracciones sensibles en la tabla.
   * @type {ConfiguracionColumna<FraccionSensible>[]}
   */
  configuracionFraccionSensible: ConfiguracionColumna<FraccionSensible>[] =
    CONFIGURACION_FRACCION_SENSIBLE;

  /**
   * Datos de los anexos obtenidos desde el servicio.
   * Estos datos se muestran en la tabla de anexos.
   * @type {Anexo[]}
   */
  datosAnexo: Anexo[] = [];

  /**
   * Datos de los anexos de importación obtenidos desde el servicio.
   * Estos datos se muestran en la tabla de anexos de importación.
   * @type {Anexo[]}
   */
  datosImportacion: Anexo[] = [];

  /**
   * Datos de las fracciones sensibles obtenidos desde el servicio.
   * Estos datos se muestran en la tabla de fracciones sensibles.
   * @type {FraccionSensible[]}
   */
  datosFraccionSensible: FraccionSensible[] = [];

  /**
 * Buscar ID de la solicitud
 * @type {string[]}
 */
  buscarIdSolicitud!: string[];
  /**
   * Datos de consultaio
   */
  consultaDatos!: ConsultaioState;
  /**
   * Constructor del componente `DatosAnexosComponent`.
   * Inicializa los servicios necesarios y carga los datos de los anexos y fracciones sensibles.
   * 
   * @param {SolicitudService} solicitudService - Servicio para gestionar las solicitudes.
   * @param {ToastrService} toastr - Servicio para mostrar notificaciones al usuario.
   */
  constructor(
    private solicitudService: SolicitudService,
    private toastr: ToastrService,
    private tramite80316Query: Tramite80316Query,
    private tramite80316Store: Tramite80316Store,
    private consultaioQuery: ConsultaioQuery
  ) {
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaDatos = seccionState;
        })
      )
      .subscribe();

    this.tramite80316Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        filter((solicitud) => Boolean(solicitud?.buscarIdSolicitud?.length)),
        take(1)
      )
      .subscribe((solicitud) => {
        this.buscarIdSolicitud = solicitud?.buscarIdSolicitud || [];
        this.obteneComplimentariaExportacion();
        this.obteneComplimentariaImportacion();
        this.obteneFraccionSensible();
      });
  }

  /**
   * Método que obtiene los anexos complementarios desde el servicio.
   * Asigna los datos a las variables `datosAnexo` y `datosImportacion`.
   */
  obteneComplimentariaExportacion(): void {
    this.solicitudService
      .obtenerFraccionesExportacion(this.buscarIdSolicitud)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((fraccionesExportacion) => {
        this.datosAnexo =
          fraccionesExportacion.datos?.map((item: Anexo) => ({
            original: item,
            claveProductoExportacion: item.claveProductoExportacion,
            descripcion: (item.complemento?.descripcion || ''),
            tipoFraccion: item.tipoFraccion,
          })) || [];
        this.tramite80316Store.setFraccionesExportacion(this.datosAnexo);
      });
  }

  /**
   * Método que obtiene los anexos complementarios desde el servicio.
   * Asigna los datos a las variables `datosAnexo` y `datosImportacion`.
   */
  obteneComplimentariaImportacion(): void {
    this.solicitudService
      .obtenerFraccionesImportacion(this.buscarIdSolicitud)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((fraccionesImportacion) => {
        this.datosImportacion =
          fraccionesImportacion.datos?.map((item: Anexo) => ({
            original: item,
            fraccionPadre: item.fraccionPadre,
            cveFraccion: item.cveFraccion,
            descripcion: item.descripcion,
            tipoFraccion: item.tipoFraccion,
          })) || [];
        this.tramite80316Store.setFraccionesImportacion(this.datosImportacion);
      });
  }

  /**
   * Método que obtiene las fracciones sensibles desde el servicio.
   * Asigna los datos a la variable `datosFraccionSensible`.
   */
  obteneFraccionSensible(): void {
    this.solicitudService
      .obteneFraccionSensible(this.buscarIdSolicitud)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((fraccionesSensibles) => {
        this.datosFraccionSensible =
          fraccionesSensibles.datos?.map((item: FraccionSensible) => ({
            original: item,
            cantidad: item.cantidad,
            valor: item.valor,
            unidadMedidaTarifaria: item.unidadMedidaTarifaria,
          })) || [];
        this.tramite80316Store.setFraccionesSensibles(this.datosFraccionSensible);
      });
  }

  /**
   * Método que se ejecuta cuando el componente es destruido.
   * Notifica a todos los observables que deben completarse y limpia las suscripciones.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next(); // Notifica a todos los observables que deben completar.
    this.destroyNotifier$.complete(); // Finaliza el Subject para evitar fugas de memoria.
  }
}
