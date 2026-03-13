import { AutorizacionProsecStore } from "../estados/autorizacion-prosec.store";
import { Injectable } from "@angular/core";
import { ProsecState } from "../estados/autorizacion-prosec.store";
import { Query } from "@datorama/akita";

/**
 * @description
 * Query encargada de gestionar y exponer el estado del trámite de autorización PROSEC.
 * Permite consultar y suscribirse a los cambios del estado global de PROSEC a través de observables.
 * 
 * Esta clase extiende de `Query` de Akita y utiliza el store `AutorizacionProsecStore` para acceder al estado.
 * 
 * @author Equipo VUCEM
 * @since 2025
 */
@Injectable({ providedIn: 'root' })
export class AUtorizacionProsecQuery extends Query<ProsecState> {

  /**
   * @property {Observable<ProsecState>} selectProsec$
   * @description
   * Observable que expone el estado completo de PROSEC.
   * Permite suscribirse a los cambios del estado global del trámite de autorización PROSEC.
   */
  selectProsec$ = this.select((state) => {
    return state;
  });

  /**
   * @constructor
   * @description
   * Constructor que inyecta la instancia del store de autorización PROSEC.
   * Inicializa la clase base `Query` con el store correspondiente.
   * 
   * @param store Instancia de AutorizacionProsecStore utilizada para acceder al estado.
   */
  constructor(protected override store: AutorizacionProsecStore) {
    super(store);
  }
}