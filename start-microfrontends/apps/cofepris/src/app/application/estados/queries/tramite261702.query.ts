import { RetirosCofepris261702State, Tramite261702Store } from '../tramites/tramite261702.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * Decorador que marca esta clase como inyectable y especifica que su proveedor
 * estará disponible en el nivel raíz del inyector.
 */
@Injectable({ providedIn: 'root' })

/**
 * Clase que representa una consulta para el estado de CertiRegistro302.
 * Proporciona métodos para seleccionar y observar el estado completo del formulario de la solicitud.
 */
export class Tramite261702Query extends Query<RetirosCofepris261702State> {
  /**
   * Observable que selecciona el estado completo de la solicitud.
   * Permite observar los cambios en el estado del formulario CertiRegistro302.
   */
  selectRetiros$ = this.select((state) => {
    return state;
  });

  /**
 * Observable selector for retrieving the entire state.
 */
allStoreData$ = this.select((state) => state);

  /**
   * Constructor de la clase Tramite261702Store.
   * Inicializa la consulta con el almacén proporcionado.
   * 
   * @param store - Instancia del almacén Tramite302Store.
   */
  constructor(protected override store: Tramite261702Store) {
    super(store);
  }
}
