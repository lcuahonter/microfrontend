/**
 * El `AmpliacionServiciosQuery` es una clase de Angular que utiliza Akita para consultar el estado relacionado con la ampliación de servicios.
 * Proporciona selectores para acceder a diferentes partes del estado y verificar la validez de los formularios.
 * Este archivo define los selectores necesarios para acceder a los datos almacenados en el estado de ampliación de servicios.
 */

import { AmpliacionServiciosState } from './tramite80206.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { Tramite80206Store } from './tramite80206.store';

@Injectable({ providedIn: 'root' })
export class AmpliacionServiciosQuery extends Query<AmpliacionServiciosState> {
  /**
   * Selector para obtener la información de registro del estado.
   */
  selectInfoRegistro$ = this.select((state) => state.infoRegistro);

  /**
   * Selector para obtener los datos IMMEX del estado.
   */
  selectDatosImmex$ = this.select((state) => state.datosImmex);

  /**
   * Selector para obtener los datos generales del estado.
   */
  selectDatos$ = this.select((state) => state.datos);

  /**
   * Selector para obtener la aduana de ingreso seleccionada del estado.
   */
  selectAduanaDeIngresoSelecion$ = this.select((state) => state.aduanaDeIngresoSelecion);

  /**
   * Selector para verificar si todos los campos del formulario son válidos.
   */
  FormaValida$ = this.select((state) => {
    return Object.values(state.formaValida).every(value => value === true);
  });

  /**
   * Constructor de la clase `AmpliacionServiciosQuery`.
   */
  constructor(protected override store: Tramite80206Store) {
    super(store);
  }

  /**
   * Selector para obtener todo el estado relacionado con el trámite.
   */
  selectSolicitudTramite$ = this.select((state) => {
    return state;
  });
}