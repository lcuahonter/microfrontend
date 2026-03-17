
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

import { RubroTransporteFerrovario32618State, Tramite32618Store } from './tramite32618.store';

/**
 * Decorador que marca esta clase como inyectable y especifica que su proveedor
 * estará disponible en el nivel raíz del inyector.
 */
@Injectable({ providedIn: 'root' })

/**
 * Clase que representa una consulta para el estado de Tramite32618Store.
 * Proporciona métodos para seleccionar y observar el estado completo del formulario de la solicitud.
 */
export class Tramite32618Query extends Query<RubroTransporteFerrovario32618State> {
  /**
   * Observable que selecciona el estado completo de la solicitud.
   * Permite observar los cambios en el estado del formulario Tramite32618.
   */
  selectRubroTransporteFerrovario$ = this.select((state) => {
    return state;
  });

  /**
   * Constructor de la clase Tramite32618Store.
   * Inicializa la consulta con el almacén proporcionado.
   * 
   * @param store - Instancia del almacén Tramite32618Store.
   */
  constructor(protected override store: Tramite32618Store) {
    super(store);
  }
}