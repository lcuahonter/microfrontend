import { Solicitud230901State, Tramite230901Store } from '../store/tramite230901.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * Servicio de consulta para el estado de la "Solicitud 230901".
 * Este servicio permite acceder al estado actual del trámite y suscribirse a los cambios en el estado.
 */
@Injectable({ providedIn: 'root' })
export class Tramite230901Query extends Query<Solicitud230901State> {

  /**
   * Observable que emite el estado actual de la "Solicitud 230901".
   * Se puede usar para suscribirse a los cambios en el estado.
   *
   * {Observable<Solicitud230901State>}
   */
  selectSolicitud$ = this.select(state => state);

  /**
   * Constructor del servicio de consulta.
   * Inicializa el servicio con el almacén correspondiente.
   *
   * {Tramite230901Store} store - Almacén que contiene el estado de la "Solicitud 230901".
   */
  constructor(
    protected override store: Tramite230901Store) {
    super(store);
  }
}
