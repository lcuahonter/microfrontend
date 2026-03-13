import { EstadoSolicitud31909 } from '../../models/estado-solicitud-31909';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { Tramite31909Store } from '../store/tramite31909.store';

/**
 * Query de Akita para observar y seleccionar el estado del trámite 31909.
 * Proporciona selectores individuales para acceder a partes específicas del estado.
 */
@Injectable({ providedIn: 'root' })
export class Tramite31909Query extends Query<EstadoSolicitud31909> {
  /**
   * Observable que emite todo el estado del trámite 31909.
   * @return {Observable<EstadoSolicitud31909>} Observable del estado completo.
   */
  estadoSolicitud$ = this.select();

  /**
   * Constructor que inyecta el store del trámite 31909.
   * @param store Instancia del store del trámite 31909.
   */
  constructor(protected override store: Tramite31909Store) {
    super(store);
  }
}
