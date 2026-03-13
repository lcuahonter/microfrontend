/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Injectable } from '@angular/core';

import { Store, StoreConfig } from '@datorama/akita';
import { Catalogo } from '@libs/shared/data-access-user/src';

/**
 * @description
 * Estado de las cancelaciones.
 * Esta interfaz define la estructura del estado para las cancelaciones.
 */
export interface CancelacionesState {
  entidadFederativa: Catalogo | null;
  colonia: Catalogo | null;
  localidad: Catalogo | null;
  municipio: Catalogo | null;
  paisInput: null;
  numeroInterior: null;
  codigoPostal: null;
  telefono: null;
  nombre: null;
  apellidoPaterno: null;
  correoElectronico: null;
  rfcIngresado: string;
  motivoCancelacion: string;
  entidadExterna: string;
  nombreSolicitanteIPC: string;
  cargoSolicitanteIPC: string;
  folioOficioSolicitudIPC: string;
  fechaPago: string;
  correoSolicitanteIPC: string;
}

/**
 * @description
 * Crea el estado inicial para las cancelaciones.
 * @returns {CancelacionesState} El estado inicial.
 */
export function createInitialState(): CancelacionesState {
  return {
    entidadFederativa: null,
    colonia: null,
    localidad: null,
    municipio: null,
    paisInput: null,
    numeroInterior: null,
    codigoPostal: null,
    telefono: null,
    nombre: null,
    apellidoPaterno: null,
    correoElectronico: null,
    rfcIngresado: '',
    motivoCancelacion: '',
    entidadExterna: '',
    nombreSolicitanteIPC: '',
    cargoSolicitanteIPC: '',
    folioOficioSolicitudIPC: '',
    fechaPago: '',
    correoSolicitanteIPC: '',
  };
}

/**
 * @description
 * Almacén para manejar el estado de las cancelaciones.
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'cancelaciones', resettable: true })
export class CancelacionesStore extends Store<CancelacionesState> {
  /**
   * @ignore
   */
  constructor() {
    super(createInitialState());
  }

  /**
   * Establece la entidad federativa en el estado.
   * @param {Catalogo} entidadFederativa - La entidad federativa a establecer.
   */
  public setEntidadFed(entidadFederativa: Catalogo): void {
    this.update((state) => ({
      ...state,
      entidadFederativa,
    }));
  }

  /**
   * Establece la colonia en el estado.
   * @param {Catalogo} colonia - La colonia a establecer.
   */
  public setColonia(colonia: Catalogo): void {
    this.update((state) => ({
      ...state,
      colonia,
    }));
  }

  /**
   * Establece la localidad en el estado.
   * @param {Catalogo} localidad - La localidad a establecer.
   */
  public setLocalidad(localidad: Catalogo): void {
    this.update((state) => ({
      ...state,
      localidad,
    }));
  }

  /**
   * Establece el municipio o alcaldía en el estado.
   * @param {Catalogo} municipio - El municipio o alcaldía a establecer.
   */
  public setMunicipiosAlcaldia(municipio: Catalogo): void {
    this.update((state) => ({
      ...state,
      municipio,
    }));
  }

  /**
   * Establece el país ingresado en el estado.
   * @param {any} paisInput - El país ingresado a establecer.
   */
  public setPaisInput(paisInput: any): void {
    this.update((state) => ({
      ...state,
      paisInput,
    }));
  }

  /**
   * Establece el número interior en el estado.
   * @param {any} numeroInterior - El número interior a establecer.
   */
  public setNumeroInterior(numeroInterior: any): void {
    this.update((state) => ({
      ...state,
      numeroInterior,
    }));
  }

  /**
   * Establece el código postal en el estado.
   * @param {any} codigoPostal - El código postal a establecer.
   */
  public setCodigoPostal(codigoPostal: any): void {
    this.update((state) => ({
      ...state,
      codigoPostal,
    }));
  }

  /**
   * Establece el teléfono en el estado.
   * @param {any} telefono - El teléfono a establecer.
   */
  public setTelefono(telefono: any): void {
    this.update((state) => ({
      ...state,
      telefono,
    }));
  }

  /**
   * Establece el nombre en el estado.
   * @param {any} nombre - El nombre a establecer.
   */
  public setNombre(nombre: any): void {
    this.update((state) => ({
      ...state,
      nombre,
    }));
  }

  /**
   * Establece el apellido paterno en el estado.
   * @param {any} apellidoPaterno - El apellido paterno a establecer.
   */
  public setApellidoPaterno(apellidoPaterno: any): void {
    this.update((state) => ({
      ...state,
      apellidoPaterno,
    }));
  }

  /**
   * Establece el correo electrónico en el estado.
   * @param {any} correoElectronico - El correo electrónico a establecer.
   */
  public setCorreoElectronico(correoElectronico: any): void {
    this.update((state) => ({
      ...state,
      correoElectronico,
    }));
  }

  /**
   * Establece el RFC ingresado en el estado.
   * @param {string} rfcIngresado - El RFC ingresado a establecer.
   */
  public setRfcIngresado(rfcIngresado: string) {
    this.update((state) => ({
      ...state,
      rfcIngresado,
    }));
  }

  /**
   * Establece el motivo de cancelación en el estado.
   * @param {string} motivoCancelacion - El motivo de cancelación a establecer.
   */
  public setMotivoCancelacion(motivoCancelacion: string) {
    this.update((state) => ({
      ...state,
      motivoCancelacion,
    }));
  }

  /**
   * Establece la entidad externa en el estado.
   * @param {string} entidadExterna - La entidad externa a establecer.
   */
  public setEntidadExterna(entidadExterna: string) {
    this.update((state) => ({
      ...state,
      entidadExterna,
    }));
  }

  /**
   * Establece el nombre del solicitante IPC en el estado.
   * @param {string} nombreSolicitanteIPC - El nombre del solicitante IPC a establecer.
   */
  public setNombreSolicitanteIPC(nombreSolicitanteIPC: string) {
    this.update((state) => ({
      ...state,
      nombreSolicitanteIPC,
    }));
  }

  /**
   * Establece el cargo del solicitante IPC en el estado.
   * @param {string} cargoSolicitanteIPC - El cargo del solicitante IPC a establecer.
   */
  public setCargoSolicitanteIPC(cargoSolicitanteIPC: string) {
    this.update((state) => ({
      ...state,
      cargoSolicitanteIPC,
    }));
  }

  /**
   * Establece el folio del oficio de solicitud IPC en el estado.
   * @param {string} folioOficioSolicitudIPC - El folio del oficio de solicitud IPC a establecer.
   */
  public setFolioOficioSolicitudIPC(folioOficioSolicitudIPC: string) {
    this.update((state) => ({
      ...state,
      folioOficioSolicitudIPC,
    }));
  }
  /**
   * Establece la fecha de pago en el estado.
   * @param {string} fechaPago - La fecha de pago a establecer.
   */
  public setFechaPago(fechaPago: string) {
    this.update((state) => ({
      ...state,
      fechaPago,
    }));
  }

  /**
   * Establece el correo del solicitante IPC en el estado.
   * @param {string} correoSolicitanteIPC - El correo del solicitante IPC a establecer.
   */
  public setCorreoSolicitanteIPC(correoSolicitanteIPC: string) {
    this.update((state) => ({
      ...state,
      correoSolicitanteIPC,
    }));
  }
}