import { Tramite120402State, Tramite120402Store } from '../tramites/tramite120402.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * @class Tramite120402Query
 * @description
 * Proporciona consultas reactivas para acceder al estado de Tramite120402.
 * Este servicio utiliza Akita para gestionar el estado de la aplicación y permite suscribirse a cambios específicos
 * en las propiedades del estado relacionadas con el trámite 120402.
 * 
 * @property {Observable<any>} entidad$ - Observable que emite el valor de la propiedad `entidad` del estado.
 * @property {Observable<any>} representacion$ - Observable que emite el valor de la propiedad `representacion` del estado.
 * @property {Observable<any>} regimen$ - Observable que emite el valor de la propiedad `regimen` del estado.
 * @property {Observable<any>} tratado$ - Observable que emite el valor de la propiedad `tratado` del estado.
 * @property {Observable<any>} nombreProducto$ - Observable que emite el valor de la propiedad `nombreProducto` del estado.
 * @property {Observable<any>} nombreSubproducto$ - Observable que emite el valor de la propiedad `nombreSubproducto` del estado.
 * @property {Observable<any>} cantidadSolicitada$ - Observable que emite el valor de la propiedad `cantidadSolicitada` del estado.
 * @property {Observable<any>} tramiteState$ - Observable que emite el estado completo de Tramite120402.
 * 
 * @constructor
 * @param {Tramite120402Store} tramiteStore - Instancia del store que contiene el estado de Tramite120402.
 */

@Injectable({ providedIn: 'root' })
export class Tramite120402Query extends Query<Tramite120402State> {
  /**
   * Observable que emite el valor de la propiedad `entidad` del estado.
   */
  entidad$ = this.select((state) => state.entidad);

  /**
   * Observable que emite el valor de la propiedad `representacion` del estado.
   */
  representacion$ = this.select((state) => state.representacion);

  /**
   * Observable que emite el valor de la propiedad `regimen` del estado.
   */
  regimen$ = this.select((state) => state.regimen);

  /**
   * Observable que emite el valor de la propiedad `tratado` del estado.
   */
  tratado$ = this.select((state) => state.tratado);

  /**
   * Observable que emite el valor de la propiedad `producto` del estado.
   */
  nombreProducto$ = this.select((state) => state.nombreProducto);

  /**
   * Observable que emite el valor de la propiedad `subproducto` del estado.
   */
  nombreSubproducto$ = this.select((state) => state.nombreSubproducto);

  /**
   * Observable que emite el valor de la propiedad `cantidadSolicitada` del estado.
   */
  cantidadSolicitada$ = this.select((state) => state.cantidadSolicitada);

  /**
   * Observable que emite el estado completo de Tramite120402.
   */
  tramiteState$ = this.select((state) => state);

  /**
   * Constructor del servicio.
   * 
   * @param {Tramite120402Store} tramiteStore - Instancia del store que contiene el estado de Tramite120402.
   */
  constructor(tramiteStore: Tramite120402Store) {
    super(tramiteStore);
  }
}