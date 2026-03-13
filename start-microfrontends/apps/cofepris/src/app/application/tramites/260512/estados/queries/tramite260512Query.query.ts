import { Tramite260512State, Tramite260512Store } from "../stores/tramite260512Store.store";
import { Injectable } from "@angular/core";
import { Query } from "@datorama/akita";

@Injectable({ providedIn: 'root' })
export class Tramite260512Query extends Query<Tramite260512State> {
  /**
   * @constructor
   * @description
   * Inicializa la consulta con la tienda correspondiente.
   *
   * @param {Tramite260512Store} store - La tienda que contiene el estado del trámite 260512.
   */
  constructor(protected override store: Tramite260512Store) {
    super(store);
  }
    /**
   * Obtiene el índice previo de la ruta.
   * @returns {Observable<number>} El índice previo de la ruta
   */
  public indicePrevioRuta$ = this.select((state) => state.idSolicitud);

    /**
   * @property {Observable<Tramite260513State>} selectTramiteState$
   * Observable que selecciona el estado completo del trámite.
   */
  selectTramiteState$ = this.select((state) => state);
  
   /**
   * @property {Observable<number | undefined>} getTabSeleccionado$
   * @description
   * Selecciona el índice de la pestaña actualmente seleccionada en el estado.
   */
  public getTabSeleccionado$ = this.select((state) => state.tabSeleccionado);

}