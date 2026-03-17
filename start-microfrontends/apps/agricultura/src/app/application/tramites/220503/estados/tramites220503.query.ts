import {
  Solicitud220503State,
  Solicitud220503Store,
} from './tramites220503.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Solicitud220503Query extends Query<Solicitud220503State> {
  /**
   * Constructor de la clase Solicitud220502Query.
   * Extiende Query de Akita para proporcionar un acceso reactivo al estado de Solicitud220503Store.
   *
   * @param Solicitud220503Store - Instancia del store que maneja el estado de la solicitud.
   */
  constructor(protected Solicitud220503Store: Solicitud220503Store) {
    super(Solicitud220503Store);
  }

    certificadosAutorizados$ = this.select(
    state => state.certificadosAutorizados
  );
  /**
   * Observable que selecciona el estado completo de la solicitud.
   * Proporciona una suscripción reactiva a los cambios en el estado de la store.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });
  isRevisionDocumental$ = this.certificadosAutorizados$.pipe(
    map(certificado =>
      certificado !== null &&
      certificado !== undefined &&
      certificado !== '' &&
      certificado !== 0
    )
  );
  
  /**
   * Observable que emite el tercero relacionado actualmente seleccionado.
   * Proporciona acceso reactivo al tercero que está siendo editado o visualizado.
   * Utilizado en modales y formularios para mostrar datos del tercero seleccionado.
   * 
   * @public
   * @readonly
   * @type {Observable<TercerosrelacionadosdestinoTable>}
   * @memberof AcuiculturaQuery
   */
seletedTerceros$ = this.select(estado => estado.selectedTerceros);
}
