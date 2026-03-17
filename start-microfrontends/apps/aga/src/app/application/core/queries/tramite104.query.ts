import { DatosDelInmueble104State, DatosDelInmueble104Store } from '../estados/tramites/tramite104.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * **Query para acceder al estado del formulario**
 */
@Injectable({
  providedIn: 'root',
})
export class DatosDelInmueble104Query extends Query<DatosDelInmueble104State> {
  
  /** Obtiene los datos completos del formulario de fomento a la exportación */
  fomentoExportacion$ = this.select((state) => state.fomentoExportacion);

  /** Obtiene los datos completos del formulario de dirección */
  direccion$ = this.select((state) => state.direccion);

  /**
   * **Constructor para inyectar el store y crear la query**
   * @param store - Store para gestionar el estado del formulario.
   */
  constructor(protected override store: DatosDelInmueble104Store) {
    super(store);
  }
}
