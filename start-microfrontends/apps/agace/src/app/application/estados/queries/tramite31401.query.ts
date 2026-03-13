import { CancelacionGarantia270101State, Tramite31401Store } from '../tramites/tramite31401.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * Decorador que marca esta clase como inyectable y especifica que su proveedor
 * estará disponible en el nivel raíz del inyector.
 */
@Injectable({ providedIn: 'root' })

/**
 * Clase que representa una consulta para el estado.
 * Proporciona métodos para seleccionar y observar el estado completo del formulario de la solicitud.
 */
export class Tramite31401Query extends Query<CancelacionGarantia270101State> {
  /**
   * Observable que selecciona el estado completo de la solicitud.
   * Permite observar los cambios en el estado del formulario.
   */
  selectCancelacionGarantia$ = this.select((state) => {
    return state;
  });

  /**
   * Constructor de la clase Tramite31401Store.
   * Inicializa la consulta con el almacén proporcionado.
   * 
   * @param store - Instancia del almacén Tramite31401Store.
   */
  constructor(protected override store: Tramite31401Store) {
    super(store);
  }
}
