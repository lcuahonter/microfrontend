import { EstadoSolicitud31908 } from '../../models/estado-solicitud-31908';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { Tramite31908Store } from '../store/tramite31908.store';

/**
 * Query de Akita para observar y seleccionar el estado del trámite 31908.
 * Proporciona selectores individuales para acceder a partes específicas del estado.
 */
@Injectable({ providedIn: 'root' })
export class Tramite31908Query extends Query<EstadoSolicitud31908> {
  /**
   * Observable que emite todo el estado del trámite 31908.
   * @return {Observable<EstadoSolicitud31908>} Observable del estado completo.
   */
  estadoSolicitud$ = this.select();

  /**
   * Constructor que inyecta el store del trámite 31908.
   * @param store Instancia del store del trámite 31908.
   */
  constructor(protected override store: Tramite31908Store) {
    super(store);
  }
}
