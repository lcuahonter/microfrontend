/**
 * tramites220103.query.ts
 */
import { Tramite220103State, Tramite220103Store } from '../tramites/tramites220103.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * Servicio que permite realizar consultas al estado del trámite 220103.
 * Extiende la clase `Query` de Akita para proporcionar acceso al estado almacenado.
 */
@Injectable({ providedIn: 'root' })
export class Tramite220103Query extends Query<Tramite220103State> {

  /**
   * Observable que emite el estado completo del trámite 220103.
   */
  selectTramite220103State$ = this.select((state) => state);

  /**
   * Constructor del servicio.
   * 
   * @param store - Instancia del store que contiene el estado del trámite 220103.
   */
  constructor(
    protected override store: Tramite220103Store
  ) {
    super(store);
  }
}