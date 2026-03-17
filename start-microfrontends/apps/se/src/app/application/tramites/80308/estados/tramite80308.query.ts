import { Tramite80308Store, TramiteState } from './tramite80308.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * @class Tramite80308Query
 * Query para el estado del trámite 80308
 * @extends Query<TramiteState>
 */
@Injectable({ providedIn: 'root' })
export class Tramite80308Query extends Query<TramiteState> {
  /** Observable del estado actual */
  selectEstado$ = this.select((state) => state.estado);

  /** Observable que indica si el formulario es válido */
  FormaValida$ = this.select((state) => Object.values(state.formaValida).every(value => value === true));

  /** Observable de los domicilios a buscar */
  selectBuscarDomicilios$ = this.select((state) => state.buscarDomicilios);

  /** Observable de los domicilios */
  selectDomicilios$ = this.select((state) => state.domicilios);

  /** Observable de las plantas a dar de alta */
  selectAltaPlanta$ = this.select((state) => state.altaPlanta);

  /** Observable del estado completo del trámite */
  tramiteState$ = this.select((state) => state);

  /**
   * Constructor de la query del trámite 80308
   * @param {Tramite80308Store} store
   */
  constructor(protected override store: Tramite80308Store) {
    super(store);
  }
}
