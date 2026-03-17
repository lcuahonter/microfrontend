
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

import { DatosComunesTresState, DatosComunesTresStore } from './datos-comunes-tres.store';

/**
 * Decorador que marca esta clase como inyectable y especifica que su proveedor
 * estará disponible en el nivel raíz del inyector.
 */
@Injectable({ providedIn: 'root' })

/**
 * Clase que representa una consulta para el estado de DatosComunesTresStore.
 * Proporciona métodos para seleccionar y observar el estado completo del formulario de la solicitud.
 */
export class DatosComunesTresQuery extends Query<DatosComunesTresState> {
  /**
   * Observable que selecciona el estado completo de la solicitud.
   * Permite observar los cambios en el estado del formulario DatosComunesTres.
   */
  selectDatosComunesTres$ = this.select((state) => {
    return state;
  });

  /**
   * Constructor de la clase DatosComunesTresStore.
   * Inicializa la consulta con el almacén proporcionado.
   *
   * @param store - Instancia del almacén DatosComunesTresStore.
   */
  constructor(protected override store: DatosComunesTresStore) {
    super(store);
  }
}