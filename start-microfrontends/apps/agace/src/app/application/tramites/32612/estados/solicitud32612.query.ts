import { Solicitude32612State, Tramite32612Store } from './solicitud32612.store';
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
export class Tramite32612Query extends Query<Solicitude32612State> {
  /**
   * Observable que selecciona el estado completo de la solicitud.
   * Permite observar los cambios en el estado del formulario.
   */
  selectSolicitude$ = this.select((state) => {
    return state;
  });

  /**
   * Constructor de la clase Tramite31401Store.
   * Inicializa la consulta con el almacén proporcionado.
   * 
   * @param store - Instancia del almacén Tramite32612Store.
   */
  constructor(protected override store: Tramite32612Store) {
    super(store);
  }
}
