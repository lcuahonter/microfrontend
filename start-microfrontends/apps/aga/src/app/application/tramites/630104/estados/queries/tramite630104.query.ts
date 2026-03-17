import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { Tramite630104State } from '../tramites/tramite630104.store';
import { Tramite630104Store } from '../tramites/tramite630104.store';

/**
 * Servicio de consulta (Query) para acceder al estado del trámite 630104.
 * Proporciona selectores para obtener datos específicos del estado.
 */
@Injectable({ providedIn: 'root' })
export class Tramite630104Query extends Query<Tramite630104State> {


  
  /**
   * Observable que emite el estado completo del trámite 630303.
   */
  selectTramite630104State$ = this.select((state) => state);

  /**
   * Constructor del servicio.
   * 
   * @param store - Instancia del store que contiene el estado del trámite 630303.
   */
  constructor(
    protected override store: Tramite630104Store
  ) {
    super(store);
  }
  
  /**
   * Observable que selecciona el estado completo de la sección.
   * Permite suscribirse a los cambios en el estado del trámite 420103.
   */
  selectSeccionState$ = this.select((state) => {
    return state;
  });

}