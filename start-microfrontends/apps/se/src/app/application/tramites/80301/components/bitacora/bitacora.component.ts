import { Component, OnDestroy } from '@angular/core';
import { Subject, map, takeUntil } from 'rxjs';
import { Bitacora } from '../../../../shared/models/bitacora.model';
import { BitacoraTablaComponent } from '../../../../shared/components/bitacora/bitacora.component';
import { Solicitud80301State } from '../../estados/tramite80301.store';
import { SolicitudService } from '../../services/solicitud.service';
import { Tramite80301Query } from '../../estados/tramite80301.query';

/**
 * Componente BitacoraComponent que maneja la visualización de la bitácora de modificaciones.
 * Proporciona funcionalidades para cargar y mostrar los registros de la bitácora
 * relacionados con el trámite 80301.
 * @component BitacoraComponent
 */
@Component({
  selector: 'app-bitacora',
  templateUrl: './bitacora.component.html',
  standalone: true,
  imports: [BitacoraTablaComponent],
})

/**
 * Clase que representa el componente de la bitácora de modificaciones.
 * @class BitacoraComponent
 */
export class BitacoraComponent implements OnDestroy {
  /**
   * Datos de la bitácora obtenidos desde el servicio.
   * Este arreglo almacena los registros de la bitácora que se mostrarán en la tabla.
   */
  datos: Bitacora[] = [];

  /**
   * Estado de la solicitud del trámite 80301.
   * @property {Solicitud80301State} solicitudState
   */
  solicitudState!: Solicitud80301State;

  /**
   * Subject utilizado para notificar cuando se debe completar y limpiar las suscripciones activas.
   * Esto evita fugas de memoria al completar las suscripciones cuando el componente es destruido.
   */
  destroyNotifier$: Subject<void> = new Subject();

  /**
   * Constructor del componente.
   * @param solicitudService Servicio para manejar las solicitudes relacionadas con el trámite.
   * @param tramite80301Query Consulta para obtener el estado del trámite 80301.
   */
  constructor(
    public solicitudService: SolicitudService,
    private tramite80301Query: Tramite80301Query
  ) {
    this.tramite80301Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((solicitudState) => {
          this.solicitudState = solicitudState;
        })
      )
      .subscribe();
    
    if (this.solicitudState.selectedIdPrograma) {
      this.loadBitacoraDatos(this.solicitudState.selectedIdPrograma);
    }
  }

  /**
   * Método para cargar los datos de la bitácora desde el servicio.
   * @param idPrograma Identificador del programa para el cual se obtendrán los datos de la bitácora.
   * @return {void}
   */
  loadBitacoraDatos(idPrograma: string): void {
    this.solicitudService
      .obtenerBitacora(idPrograma)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((response) => {
        this.datos =
          response.datos?.map((item: Bitacora) => ({
            tipoModificacion: item.tipoModificacion,
            fechaModificacion: item.fechaModificacion,
            valoresAnteriores: item.valoresAnteriores,
            valoresNuevos: item.valoresNuevos,
          })) || [];
      });
  }

  /**
   * Método que se ejecuta cuando el componente es destruido.
   * Notifica a todos los observables que deben completarse y cancela las suscripciones activas.
   * Esto asegura que no haya fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next(); // Se notifica a todos los observables que deben completarse.
    this.destroyNotifier$.unsubscribe(); // Se cancelan las suscripciones activas.
  }
}