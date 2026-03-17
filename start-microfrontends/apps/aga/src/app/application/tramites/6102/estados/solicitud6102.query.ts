import { Solicitud6102State, Solicitud6102Store } from './solicitud6102.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';


/**
 * Servicio `Solicitud6102Query` que extiende de `Query` para exponer el estado reactivo de `Solicitud6102Store`.
 * Se utiliza para consultar (leer) el estado de la solicitud 6102.
 */
@Injectable({ providedIn: 'root' })
export class Solicitud6102Query extends Query<Solicitud6102State> {

  /**
   * @description Observable que expone el estado completo de la solicitud.
   * Puede ser utilizado para reaccionar ante cualquier cambio en el estado.
   */
  seleccionarSolicitud$ = this.select((state) => {
    return state;
  });

  /**
   * @description Constructor que inyecta el store asociado a la solicitud 6102.
   * Se pasa al constructor de la clase padre `Query`.
   * @param store Instancia del store `Solicitud6102Store` que contiene el estado de la solicitud.
   */
  constructor(
    protected override store: Solicitud6102Store
  ) {
    super(store);
  }
}
