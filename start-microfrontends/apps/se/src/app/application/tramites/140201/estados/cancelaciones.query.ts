import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

import { CancelacionesState, CancelacionesStore } from './cancelaciones.store';

/**
 * @description
 * Consulta para obtener el estado de las cancelaciones.
 * Esta clase proporciona observables para seleccionar partes específicas del estado.
 */
@Injectable({ providedIn: 'root' })
export class CancelacionesQuery extends Query<CancelacionesState> {
  /**
   * Observable para la entidad federativa.
   */
  entidadFederativa$ = this.select((state) => state.entidadFederativa);

  /**
   * Observable para la colonia.
   */
  colonia$ = this.select((state) => state.colonia);

  /**
   * Observable para la localidad.
   */
  localidad$ = this.select((state) => state.localidad);

  /**
   * Observable para el municipio.
   */
  municipio$ = this.select((state) => state.municipio);

  /**
   * Observable para el país ingresado.
   */
  paisInput$ = this.select((state) => state.paisInput);

  /**
   * Observable para el número interior.
   */
  numeroInterior$ = this.select((state) => state.numeroInterior);

  /**
   * Observable para el código postal.
   */
  codigoPostal$ = this.select((state) => state.codigoPostal);

  /**
   * Observable para el teléfono.
   */
  telefono$ = this.select((state) => state.telefono);

  /**
   * Observable para el nombre.
   */
  nombre$ = this.select((state) => state.nombre);

  /**
   * Observable para el apellido paterno.
   */
  apellidoPaterno$ = this.select((state) => state.apellidoPaterno);

  /**
   * Observable para el correo electrónico.
   */
  correoElectronico$ = this.select((state) => state.correoElectronico);

  /**
   * Observable para el RFC ingresado.
   */
  rfcIngresado$ = this.select((state) => state.rfcIngresado);

  /**
   * Observable para el motivo de cancelación.
   */
  motivoCancelacion$ = this.select((state) => state.motivoCancelacion);

  /**
   * Observable para la entidad externa.
   */
  entidadExterna$ = this.select((state) => state.entidadExterna);

  /**
   * Observable para el nombre del solicitante IPC.
   */
  nombreSolicitanteIPC$ = this.select((state) => state.nombreSolicitanteIPC);

  /**
   * Observable para el cargo del solicitante IPC.
   */
  cargoSolicitanteIPC$ = this.select((state) => state.cargoSolicitanteIPC);

  /**
   * Observable para el folio del oficio de solicitud IPC.
   */
  folioOficioSolicitudIPC$ = this.select((state) => state.folioOficioSolicitudIPC);

  /**
   * Observable para la fecha de pago.
   */
  fechaPago$ = this.select((state) => state.fechaPago);
  /**
   * Observable para el correo del solicitante IPC.
   */
  correoSolicitanteIPC$ = this.select((state) => state.correoSolicitanteIPC);

  /**
   * Selecciona el estado completo de la solicitud
   */
  selectSeccionState$ = this.select((state) => {
    return state;
  });
  
  /**
   * @ignore
   */
  constructor(private Store: CancelacionesStore) {
    super(Store);
  }
}