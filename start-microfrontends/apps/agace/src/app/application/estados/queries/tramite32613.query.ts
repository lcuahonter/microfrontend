import { RubroTransporteFerrovario32613State, Tramite32613Store } from '../tramites/tramite32613.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * Decorador que marca esta clase como inyectable y especifica que su proveedor
 * estará disponible en el nivel raíz del inyector.
 */
@Injectable({ providedIn: 'root' })

/**
 * Clase que representa una consulta para el estado de Tramite32613Store.
 * Proporciona métodos para seleccionar y observar el estado completo del formulario de la solicitud.
 */
export class Tramite32613Query extends Query<RubroTransporteFerrovario32613State> {
  /**
   * Observable que selecciona el estado completo de la solicitud.
   * Permite observar los cambios en el estado del formulario Tramite32613.
   */
  selectRubroTransporteFerrovario$ = this.select((state) => {
    return state;
  });

  /**
   * Constructor de la clase Tramite32613Store.
   * Inicializa la consulta con el almacén proporcionado.
   * 
   * @param store - Instancia del almacén Tramite32613Store.
   */
  constructor(protected override store: Tramite32613Store) {
    super(store);
  }
}
