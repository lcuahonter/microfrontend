/**
 * @file Tramite130121Query file.
 * @description This file contains the Tramite130121Query class which extends Akita's Query to retrieve and expose
 * various slices of the Tramite130121 state as observables.
 * @module Tramite130121Query
 */

import { Tramite130121State, Tramite130121Store } from '../tramites/tramites130121.store';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Query } from '@datorama/akita';

/**
 * Service that queries the Tramite130121 state.
 *
 * This service provides getters and observable properties to retrieve data from the Tramite130121 state.
 * It extends the Akita Query class and is decorated with @Injectable to be provided in the root.
 *
 * @export
 * @class Tramite130121Query
 * @extends {Query<Tramite130121State>}
 */
@Injectable({ providedIn: 'root' })
export class Tramite130121Query extends Query<Tramite130121State> {
  /**
   * Observable for the entire Tramite130121 state.
   *
   * @readonly
   * @type {Observable<Tramite130121State>}
   * @memberof Tramite130121Query
   */
  get selectSolicitud$(): Observable<Tramite130121State> {
    return this.select((state) => state);
  }

  /**
   * Observable for the "mostrarTabla" flag in the state.
   *
   * @readonly
   * @type {Observable<boolean>}
   * @memberof Tramite130121Query
   */
  get mostrarTabla$(): Observable<boolean> {
    return this.select((state) => state.mostrarTabla);
  }

  /**
   * Observable combining several properties from the state related to "mercancia".
   *
   * The returned object includes:
   * - plazo: unknown
   * - descripcion: string
   * - fraccion: string
   * - umt: string
   * - nico: string
   * - cantidad: number (converted from state.cantidad)
   * - valorPartidaUSD: number
   * - unidadMedida: string
   * - defaultPlazo: string
   *
   * @type {{
   *   plazo: unknown;
   *   descripcion: string;
   *   fraccion: string;
   *   umt: string;
   *   nico: string;
   *   cantidad: number;
   *   valorPartidaUSD: number;
   *   unidadMedida: string;
   *   defaultPlazo: string;
   * }}
   * @memberof Tramite130121Query
   */
  mercanciaState$: Observable<{
    plazo: unknown;
    descripcion: string;
    fraccion: string;
    umt: string;
    nico: string;
    cantidad: number;
    valorPartidaUSD: number;
  }> = this.select((state) => ({
    plazo: state.plazo,
    descripcion: state.descripcion,
    fraccion: state.fraccion,
    umt: state.umt,
    nico: state.nico,
    cantidad: Number(state.cantidad),
    valorPartidaUSD: state.valorPartidaUSD,
  }));

  /**
   * Creates an instance of Tramite130121Query.
   *
   * @param {Tramite130121Store} store The store managing the Tramite130121 state.
   * @memberof Tramite130121Query
   */
  constructor(protected override store: Tramite130121Store) {
    super(store);
  }
}
