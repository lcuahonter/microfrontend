import { Injectable } from "@angular/core";
import { Query } from "@datorama/akita";
import { Tramite40401State } from './../estados/tramites/tramite40401.store';
import { Tramite40401Store } from "../estados/tramites/tramite40401.store";

@Injectable({ providedIn: 'root' })
export class Tramite40401Query extends Query<Tramite40401State> {
  /**
   * Observable que selecciona el estado completo del trámite.
   *
   * Este observable emite el estado actual del trámite 40401.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });
 
  /**
   * Constructor de la clase Tramite40401Query.
   *
   * @param {Tramite40401Store} store - El store que contiene el estado del trámite 40401.
   */
  constructor(
    protected override store: Tramite40401Store) {
    super(store);
  }
}