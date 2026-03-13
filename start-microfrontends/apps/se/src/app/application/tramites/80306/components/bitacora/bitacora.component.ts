import { Component, OnDestroy } from '@angular/core';
import { ConfiguracionColumna, TablaDinamicaComponent, doDeepCopy, esValidArray, esValidObject } from '@ng-mf/data-access-user';
import { Subject, map, takeUntil } from 'rxjs';
import { Tramite80306Store, TramiteState } from '../../estados/tramite80306.store';
import { BitacoraModificacion } from '../../models/datos-tramite.model';
import { CONFIGURACION_BITACORA_TABLA } from '../../constantes/modificacion.enum';
import { ComplementariaImmexComponent } from '../complementaria-immex/complementaria-immex.component';
import { ImmerModificacionService } from '../../service/immer-modificacion.service';
import { TituloComponent } from '@ng-mf/data-access-user';
import { ToastrService } from 'ngx-toastr';
import { Tramite80306Query } from '../../estados/tramite80306.query';

/**
 * Componente para gestionar la bitácora de modificaciones del trámite 80306.
 */
@Component({
  selector: 'app-bitacora',
  templateUrl: './bitacora.component.html',
  styleUrl: './bitacora.component.scss',
  standalone: true,
  imports: [
    TablaDinamicaComponent,
    TituloComponent,
    ComplementariaImmexComponent,
  ],
  providers: [ImmerModificacionService, ToastrService],
})
/**   * Clase del componente BitacoraComponent.
 * Proporciona la funcionalidad para gestionar la bitácora de modificaciones del trámite 80306,
 * incluyendo la visualización de una tabla con el historial de modificaciones.
 */
export class BitacoraComponent implements OnDestroy {
  /**
   * Subject utilizado para notificar cuando se debe completar y limpiar las suscripciones activas.
   * Esto evita fugas de memoria al completar las suscripciones al destruir el componente.
   * @private
   * @type {Subject<void>}
   */
  destroyNotifier$: Subject<void> = new Subject();

  /**
   * Configuración de las columnas de la tabla que muestra la bitácora.
   * @type {ConfiguracionColumna<Bitacora>[]}
   */
  configuracionTabla: ConfiguracionColumna<BitacoraModificacion>[] =
    CONFIGURACION_BITACORA_TABLA;

  /**
   * Datos de la bitácora obtenidos desde el servicio.
   * @type {BitacoraModificacion[]}
   */
  datosBitacora: BitacoraModificacion[] = [];

    
    /**
     * Estado actual de la solicitud del trámite 80302
     * @type {TramiteState}
     * @description Almacena el estado completo de la solicitud, incluyendo información
     * relevante para el proceso de firma electrónica y validaciones
     */
    public solicitudState!: TramiteState;

  /**
   * Constructor de la clase BitacoraComponent.
   *
   * @param modificionService - Servicio utilizado para obtener y manejar la bitácora de solicitudes.
   * @param toastr - Servicio para mostrar notificaciones al usuario.
   *
   * Este constructor inicializa el componente y realiza una suscripción al método `obtenerBitacora` del servicio
   * `ImmerModificacionService`. Los datos obtenidos se almacenan en la variable `datos`. En caso de error,
   * se muestra una notificación al usuario utilizando el servicio `ToastrService`.
   */
  constructor(
    public modificionService: ImmerModificacionService,
    public toastr: ToastrService,
    private tramite80306Store: Tramite80306Store,
    private tramite80306Query: Tramite80306Query
  ) {
    this.tramite80306Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      ).subscribe();
      this.obtenerDatosBitacora();
  }

    /**
   * Obtiene y carga los datos del historial de la bitácora
   * @method obtenerDatosBitacora
   * @description Realiza una consulta al servicio para obtener el historial completo
   * de modificaciones del programa IMMEX. Filtra los datos válidos, actualiza
   * la tabla de visualización y almacena la información en el store del trámite
   * @returns {void}
   * @example
   * ```typescript
   * this.obtenerDatosBitacora();
   * // Carga datos del historial y actualiza la vista
   * ```
   * @see {@link SolicitudService.obtenerBitacora} Para la consulta de datos
   * @see {@link datos} Para el array de datos resultante
   * @see {@link Tramite80302Store.setDatosBitacora} Para almacenamiento en el estado
   * @public
   */
  obtenerDatosBitacora():void {
    const PARAMS = { idPrograma: this.solicitudState.selectedIdPrograma || '' };
        this.modificionService.obtenerBitacora80306(PARAMS)
          .pipe(takeUntil(this.destroyNotifier$))
          .subscribe(
            (data) => {
              if(esValidObject(data)) {
                const RESPONSE = doDeepCopy(data);
                if(esValidArray(RESPONSE.datos)) {
                  this.datosBitacora = RESPONSE.datos.filter(
                    (obj: BitacoraModificacion) => Object.values(obj).some(value => value !== null)
                  ); // Almacena los datos de operaciones.
                  this.tramite80306Store.setDatosBitacora(this.datosBitacora);
                }
              }
            },
            () => {
              this.toastr.error('Error al cargar los anexos de exportación');
            }
          );
  }

  /**
   * Método que se ejecuta cuando el componente es destruido.
   * Notifica a todos los observables que deben completarse y limpia las suscripciones.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next(); // Notifica a todos los observables que deben completar.
    this.destroyNotifier$.unsubscribe(); // Cancela cualquier suscripción activa.
  }
}
