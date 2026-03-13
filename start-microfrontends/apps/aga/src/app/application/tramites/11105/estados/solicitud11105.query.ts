import { Solicitud11105State, Solicitud11105Store } from './solicitud11105.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';


/**
 * Servicio `Solicitud11105Query` que extiende de `Query` para exponer el estado reactivo de `Solicitud11105Store`.
 * Se utiliza para consultar (leer) el estado de la solicitud 11105.
 */
@Injectable({ providedIn: 'root' })
export class Solicitud11105Query extends Query<Solicitud11105State> {

  /**
   * @description Observable que expone el estado completo de la solicitud.
   * Puede ser utilizado para reaccionar ante cualquier cambio en el estado.
   */
  seleccionarSolicitud$ = this.select((state) => {
    return state;
  });

  /**
   * @description Constructor que inyecta el store asociado a la solicitud 11105.
   * Se pasa al constructor de la clase padre `Query`.
   * @param store Instancia del store `Solicitud11105Store` que contiene el estado de la solicitud.
   */
  constructor(
    protected override store: Solicitud11105Store
  ) {
    super(store);
  }
}
