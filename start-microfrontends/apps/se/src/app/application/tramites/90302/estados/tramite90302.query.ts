/**
 * @fileoverview
 * El `AmpliacionServiciosQuery` es una clase de Angular que utiliza Akita para consultar el estado relacionado con la ampliación de servicios.
 * Proporciona selectores para acceder a diferentes partes del estado y verificar la validez de los formularios.
 * 
 * @module AmpliacionServiciosQuery
 * @description
 * Este archivo define los selectores necesarios para acceder a los datos almacenados en el estado de ampliación de servicios.
 */

import { AmpliacionServiciosState } from './tramite90302.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { Tramite90302Store } from './tramite90302.store';

@Injectable({ providedIn: 'root' })
export class AmpliacionServiciosQuery extends Query<AmpliacionServiciosState> {
  /**
   * Selector para obtener la información de registro del estado.
   * @property {Observable<Servicios>} selectInfoRegistro$
   */
  selectInfoRegistro$ = this.select((state) => state.infoRegistro);

  /**
   * Constructor de la clase `AmpliacionServiciosQuery`.
   * @constructor
   * @param {Tramite90302Store} store - Instancia del store de ampliación de servicios.
   */
  constructor(protected override store: Tramite90302Store) {
    super(store);
  }

  /**
   * Selector para obtener todo el estado relacionado con el trámite.
   * @property {Observable<AmpliacionServiciosState>} selectSolicitudTramite$
   */
  selectSolicitudTramite$ = this.select((state) => {
    return state;
  });
}