import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

/**
 * Creacion del estado inicial para la interfaz de tramite 11202
 * @returns Solicitud11202
 */
export interface Solicitud11202State {
  idSolicitud: number;
  rfc: string;
  denominacion: string;
  actividadEconomica: string;
  correoElectronico: string;
  pais: string;
  codigoPostal: number;
  estado: string;
  municipioAlcaldia: string;
  localidad: string;
  colonia: string;
  calle: string;
  numeroExterior: string;
  numeroInterior: string;
  lada: string;
  telefono: number;
}

/**
 * @function createInitialState
 * @description Crea el estado inicial para la solicitud del trámite 11202.
 * @returns {Solicitud11202State} Estado inicial con valores vacíos o por defecto.
 */
export function createInitialState(): Solicitud11202State {
  return {
    rfc: '',
    denominacion: '',
    actividadEconomica: '',
    correoElectronico: '',
    pais: '',
    codigoPostal: 0,
    estado: '',
    municipioAlcaldia: '',
    localidad: '',
    colonia: '',
    calle: '',
    numeroExterior: '',
    numeroInterior: '',
    lada: '',
    telefono: 0,
    idSolicitud: 0,
  };
}

/**
 * @class Solicitud11202Store
 * @description Store de Akita para gestionar el estado de la solicitud del trámite 11202.
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'solicitud11202', resettable: true })
export class Solicitud11202Store extends Store<Solicitud11202State> {
  /**
   * Constructor del store. Inicializa el estado con los valores por defecto.
   */
  constructor() {
    super(createInitialState());
  }

  /**
   * Guarda el RFC en el estado.
   * @param rfc - RFC a guardar.
   */
  public setRfc(rfc: string): void {
    this.update((state) => ({
      ...state,
      rfc,
    }));
  }

  /**
   * Guarda la denominación en el estado.
   * @param denominacion - Denominación o razón social a guardar.
   */
  public setDenominacion(denominacion: string): void {
    this.update((state) => ({
      ...state,
      denominacion,
    }));
  }

  /**
   * Guarda la actividad económica en el estado.
   * @param actividadEconomica - Actividad económica a guardar.
   */
  public setActividadEconomica(actividadEconomica: string): void {
    this.update((state) => ({
      ...state,
      actividadEconomica,
    }));
  }

  /**
   * Guarda el correo electrónico en el estado.
   * @param correoElectronico - Correo electrónico a guardar.
   */
  public setCorreoElectronico(correoElectronico: string): void {
    this.update((state) => ({
      ...state,
      correoElectronico,
    }));
  }

  public setIdSolicitud(idSolicitud: number): void {
    this.update((state) => ({
      ...state,
      idSolicitud,
    }));
  } 

  /**
   * Guarda el país en el estado.
   * @param pais - País a guardar.
   */
  public setPais(pais: string): void {
    this.update((state) => ({
      ...state,
      pais,
    }));
  }

  /**
   * Guarda el código postal en el estado.
   * @param codigoPostal - Código postal a guardar.
   */
  public setCodigoPostal(codigoPostal: number): void {
    this.update((state) => ({
      ...state,
      codigoPostal,
    }));
  }

  /**
   * Guarda el estado o entidad federativa en el estado.
   * @param estado - Estado o entidad federativa a guardar.
   */
  public setEstado(estado: string): void {
    this.update((state) => ({
      ...state,
      estado,
    }));
  }

  /**
   * Guarda el municipio o alcaldía en el estado.
   * @param municipioAlcaldia - Municipio o alcaldía a guardar.
   */
  public setMunicipioAlcaldia(municipioAlcaldia: string): void {
    this.update((state) => ({
      ...state,
      municipioAlcaldia,
    }));
  }

  /**
   * Guarda la localidad en el estado.
   * @param localidad - Localidad a guardar.
   */
  public setLocalidad(localidad: string): void {
    this.update((state) => ({
      ...state,
      localidad,
    }));
  }

  /**
   * Guarda la colonia en el estado.
   * @param colonia - Colonia a guardar.
   */
  public setColonia(colonia: string): void {
    this.update((state) => ({
      ...state,
      colonia,
    }));
  }

  /**
   * Guarda la calle en el estado.
   * @param calle - Calle a guardar.
   */
  public setCalle(calle: string): void {
    this.update((state) => ({
      ...state,
      calle,
    }));
  }

  /**
   * Guarda el número exterior en el estado.
   * @param numeroExterior - Número exterior a guardar.
   */
  public setNumeroExterior(numeroExterior: string): void {
    this.update((state) => ({
      ...state,
      numeroExterior,
    }));
  }

  /**
   * Guarda el número interior en el estado.
   * @param numeroInterior - Número interior a guardar.
   */
  public setnumeroInterior(numeroInterior: string): void {
    this.update((state) => ({
      ...state,
      numeroInterior,
    }));
  }

  /**
   * Guarda la lada telefónica en el estado.
   * @param lada - Lada a guardar.
   */
  public setLada(lada: string): void {
    this.update((state) => ({
      ...state,
      lada,
    }));
  }

  /**
   * Guarda el número telefónico en el estado.
   * @param telefono - Teléfono a guardar.
   */
  public setTelefono(telefono: number): void {
    this.update((state) => ({
      ...state,
      telefono,
    }));
  }

  /**
   * Limpia todos los datos de la solicitud, restableciendo el estado inicial.
   */
  public limpiarSolicitud(): void {
    this.reset();
  }
}
