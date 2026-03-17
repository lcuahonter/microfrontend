import { Solicitud130102State, Tramite130102Store } from '../../estados/tramites/tramite130102.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * Servicio de consulta para el trámite 130102.
 * Proporciona acceso al estado actual de la solicitud.
 */
@Injectable({ providedIn: 'root' })
export class Tramite130102Query extends Query<Solicitud130102State> {
  
  /**
   * Observable que selecciona y proporciona el estado completo de la solicitud.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**
   * Constructor de Tramite130102Query.
   * Inicializa el servicio con el almacenamiento de estado del trámite 130102.
   * @param store - Instancia de Tramite130102Store que gestiona el estado.
   */
  constructor(protected override store: Tramite130102Store) {
    super(store);
  }
}
