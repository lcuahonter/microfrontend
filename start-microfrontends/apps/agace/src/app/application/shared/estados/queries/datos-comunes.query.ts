import { DatosComunesState, DatosComunesStore } from '../stores/datos-comunes.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * Representa una clase de consulta para gestionar y seleccionar el estado de `DatosComunes`.
 * Esta clase extiende la clase base `Query` y proporciona funcionalidad para observar
 * y recuperar el estado completo de la característica `DatosComunes`.
 * @template DatosComunesState - El tipo que representa la estructura del estado.
 */
@Injectable({ providedIn: 'root' })
export class DatosComunesQuery extends Query<DatosComunesState> {
  /**
   * Selecciona el estado completo de la solicitud
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /** Guarda el estado completo del formulario de la solicitud */
  constructor(protected override store: DatosComunesStore) {
    super(store);
  }
}
