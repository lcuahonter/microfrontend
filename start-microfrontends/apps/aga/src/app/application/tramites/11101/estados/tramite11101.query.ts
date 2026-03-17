import { Tramite11101Store,Tramitenacionales11101State } from './tramite11101.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * Servicio de consulta para gestionar el estado del trámite 11101.
 * Este servicio utiliza Akita para observar y consultar el estado almacenado.
 */
@Injectable({ providedIn: 'root' })
export class Tramite11101Query extends Query<Tramitenacionales11101State> {
  /**
   * Constructor de la clase.
   * Inicializa el servicio de consulta con el almacén correspondiente.
   * 
   * @param {Tramite11101Store} store - Almacén que contiene el estado del trámite 11101.
   */
  constructor(protected override store: Tramite11101Store) {
    super(store);
  }

  /**
   * Observable que selecciona el estado completo de la sección.
   * 
   * Este observable permite suscribirse a los cambios en el estado completo del trámite.
   * 
   * @type {Observable<Tramitenacionales11101State>}
   */
  selectSeccionState$ = this.select((state) => {
    return state;
  });
}