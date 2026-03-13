import { Tramite630307State, Tramite630307Store } from './tramite630307.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * Servicio que permite realizar consultas al estado del trámite 630307.
 * Extiende la clase `Query` de Akita para proporcionar acceso al estado almacenado.
 */
@Injectable({ providedIn: 'root' })
export class Tramite630307Query extends Query<Tramite630307State> {

  /**
   * Observable que emite el estado completo del trámite 630307.
   */
  selectTramite630307State$ = this.select((state) => state);

  /**
   * Constructor del servicio.
   * 
   * @param store - Instancia del store que contiene el estado del trámite 630307.
   */
  constructor(
    protected override store: Tramite630307Store
  ) {
    super(store);
  }
}