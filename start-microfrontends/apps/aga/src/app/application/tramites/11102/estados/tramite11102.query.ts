import { Solicitud11102State, Tramite11102Store } from './tramite11102.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * Servicio de consulta (Query) para acceder al estado de la solicitud 11102 (donaciones IMMEX).
 * Utiliza Akita para exponer flujos observables de datos relacionados al estado de la solicitud.
 */
@Injectable({ providedIn: 'root' })
export class Tramite11102Query extends Query<Solicitud11102State> {
  /**
   * Observable que emite el estado completo de la solicitud.
   * Útil para suscribirse a cambios globales del formulario.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**
   * Constructor del Query que inicializa el store de la solicitud.
   * 
   * @param store - Instancia del store asociado al trámite 11102.
   */
  constructor(protected override store: Tramite11102Store) {
    super(store);
  }
}
