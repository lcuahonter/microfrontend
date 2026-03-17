import { ImmexAmpliacionSensiblesStore, ImmexRegistroState } from './immex-ampliacion-sensibles.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

@Injectable({ providedIn: 'root' })
export class ImmexAmpliacionSensiblesQuery extends Query<ImmexRegistroState> {
  /**
   * Observable que selecciona el estado completo de la solicitud.
   * 
   * @returns El estado actual de la solicitud con importacion y exportacion.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**
   * Observable que selecciona solo los datos de importación.
   * 
   * @returns Array de immexInfo con datos de importación.
   */
  selectImportacion$ = this.select(state => state.importacion);

  /**
   * Observable que selecciona solo los datos de exportación.
   * 
   * @returns Array de fraccionInfo con datos de exportación.
   */
  selectExportacion$ = this.select(state => state.exportacion);

  /**
   * Constructor de la clase que inicializa el store específico para 
   * manejar el estado de "Immex Ampliación Sensibles".
   * 
   * @param store - Instancia del store `ImmexAmpliacionSensiblesStore` 
   *                que se utiliza para gestionar el estado.
   */
  constructor(protected override store: ImmexAmpliacionSensiblesStore) {
    super(store);
  }
}
