import { Tramite630303State, Tramite630303Store } from './tramite630303.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * Servicio que permite realizar consultas al estado del trámite 630303.
 * Extiende la clase `Query` de Akita para proporcionar acceso al estado almacenado.
 */
@Injectable({ providedIn: 'root' })
export class Tramite630303Query extends Query<Tramite630303State> {

  /**
   * Observable que emite el estado completo del trámite 630303.
   */
  selectTramite630303State$ = this.select((state) => state);

  /**
   * Constructor del servicio.
   * 
   * @param store - Instancia del store que contiene el estado del trámite 630303.
   */
  constructor(
    protected override store: Tramite630303Store
  ) {
    super(store);
  }
}