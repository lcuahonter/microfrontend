import { Tramite630103State, Tramite630103Store } from './tramite630103.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * Servicio que permite realizar consultas al estado del trámite 630103.
 * Extiende la clase `Query` de Akita para proporcionar acceso al estado almacenado.
 */
@Injectable({ providedIn: 'root' })
export class Tramite630103Query extends Query<Tramite630103State> {

  /**
   * Observable que emite el estado completo del trámite 630103.
   */
  selectTramite630103State$ = this.select((state) => state);

  /**
   * Constructor del servicio.
   * 
   * @param store - Instancia del store que contiene el estado del trámite 630103.
   */
  constructor(
    protected override store: Tramite630103Store
  ) {
    super(store);
  }
}