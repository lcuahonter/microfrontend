import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { Solicitud6101State } from './solicitud6101.store';
import { Solicitud6101Store } from './solicitud6101.store';


/**
 * Servicio `Solicitud6101Query` que extiende de `Query` para exponer el estado reactivo de `Solicitud6101Store`.
 * Se utiliza para consultar (leer) el estado de la solicitud 6101.
 */
@Injectable({ providedIn: 'root' })
export class Solicitud6101Query extends Query<Solicitud6101State> {

  /**
   * @description Observable que expone el estado completo de la solicitud.
   * Puede ser utilizado para reaccionar ante cualquier cambio en el estado.
   */
  seleccionarSolicitud$ = this.select((state) => {
    return state;
  });

  /**
   * @description Constructor que inyecta el store asociado a la solicitud 6101.
   * Se pasa al constructor de la clase padre `Query`.
   * @param store Instancia del store `Solicitud6101Store` que contiene el estado de la solicitud.
   */
  constructor(
    protected override store: Solicitud6101Store
  ) {
    super(store);
  }
}
