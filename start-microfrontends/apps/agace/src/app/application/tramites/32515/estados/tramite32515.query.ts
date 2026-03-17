import { InformationGeneralSolicitanteState, Tramite32515Store } from '../estados/tramite32515.store';
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
export class Tramite32515Query extends Query<InformationGeneralSolicitanteState> {
  /**
   * Observable que selecciona el estado completo de la solicitud.
   * Permite observar los cambios en el estado del formulario CertiRegistro302.
   * 
   * @returns El estado completo de la solicitud como un observable.
   */
  select$ = this.select((state) => {
    return state;
  });

  /**
   * Constructor de la clase Tramite32515Query.
   * Inicializa la consulta con el almacén proporcionado.
   * 
   * @param store - Instancia del almacén Tramite32515Store.
   */
  constructor(protected override store: Tramite32515Store) {
    super(store);
  }
}
