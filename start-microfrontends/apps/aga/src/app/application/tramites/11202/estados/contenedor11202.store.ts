import { Store, StoreConfig } from '@datorama/akita';
import { GridContenedores } from 'apps/aga/src/app/application/tramites/11202/models/datos-tramite.model';
import { Injectable } from '@angular/core';

/**
 * @interface Contenedor11202State
 * @description Representa el estado del contenedor en el trámite 11202.
 * 
 * @property {string} tipoBusqueda - Tipo de búsqueda realizada.
 * @property {string} idSolicitud - Identificador de la solicitud.
 * @property {string} inicialesContenedor - Iniciales del contenedor.
 * @property {string} aduana - Aduana asociada al contenedor.
 * @property {string} numeroContenedor - Número del contenedor.
 * @property {string} tipoContenedor - Tipo del contenedor.
 * @property {GridContenedores[]} contenedores - Lista de contenedores asociados.
 */
export interface Contenedor11202State {
  tipoBusqueda: string;
  idSolicitud: string;
  inicialesContenedor: string;
  aduana: string;
  numeroContenedor: string;
  tipoContenedor: string;
  digitoDeControl?: string;
  contenedores: GridContenedores[];
  datosDelCsvArchivo: [];
}

/**
 * @function createInitialState
 * @description Crea el estado inicial del contenedor en el trámite 11202.
 * 
 * @returns {Contenedor11202State} El estado inicial del contenedor.
 */
export function createInitialState(): Contenedor11202State {
  return {
    idSolicitud: '',
    tipoBusqueda: '',
    inicialesContenedor: '',
    aduana: '',
    numeroContenedor: '',
    tipoContenedor: '',
    digitoDeControl: '',
    contenedores: [],
    datosDelCsvArchivo: []
  };
}

@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'contenedor11202', resettable: true })
/**
 * @class Contenedor11202Store
 * @description Store de Akita para gestionar el estado del contenedor en el trámite 11202.
 * 
 * Este store permite actualizar y gestionar las propiedades del estado del contenedor.
 */
export class Contenedor11202Store extends Store<Contenedor11202State> {
  constructor() {
    super(createInitialState());
  }

  /**
   * @method setIdSolicitud
   * @description Guarda el identificador de la solicitud en el estado.
   * 
   * @param {string} idSolicitud - El identificador de la solicitud que se va a guardar.
   * @returns {void}
   */
  public setIdSolicitud(idSolicitud: string): void {
    this.update((state) => ({
      ...state,
      idSolicitud,
    }));
  }

  /**
   * @method setInicialesContenedor
   * @description Guarda las iniciales del contenedor en el estado.
   * 
   * @param {string} inicialesContenedor - Las iniciales del contenedor que se van a guardar.
   * @returns {void}
   */
  public setInicialesContenedor(inicialesContenedor: string): void {
    this.update((state) => ({
      ...state,
      inicialesContenedor,
    }));
  }

  /**
   * @method setAduana
   * @description Guarda la aduana asociada al contenedor en el estado.
   * 
   * @param {string} aduana - La aduana que se va a guardar.
   * @returns {void}
   */
  public setAduana(aduana: string): void {
    this.update((state) => ({
      ...state,
      aduana,
    }));
  }

  /**
   * @method setTipoBusqueda
   * @description Guarda el tipo de búsqueda en el estado.
   * 
   * @param {string} tipoBusqueda - El tipo de búsqueda que se va a guardar.
   * @returns {void}
   */
  public setTipoBusqueda(tipoBusqueda: string): void {
    this.update((state) => ({
      ...state,
      tipoBusqueda,
    }));
  }

  /**
   * @method setNumeroContenedor
   * @description Guarda el número del contenedor en el estado.
   * 
   * @param {string} numeroContenedor - El número del contenedor que se va a guardar.
   * @returns {void}
   */
  public setNumeroContenedor(numeroContenedor: string): void {
    this.update((state) => ({
      ...state,
      numeroContenedor,
    }));
  }

  /**
   * @method setTipoContenedor
   * @description Guarda el tipo del contenedor en el estado.
   * 
   * @param {string} tipoContenedor - El tipo del contenedor que se va a guardar.
   * @returns {void}
   */
  public setTipoContenedor(tipoContenedor: string): void {
    this.update((state) => ({
      ...state,
      tipoContenedor,
    }));
  }

  /**
   * @method setDigitoDeControl
   * @description Guarda el dígito de control del contenedor en el estado.
   * 
   * @param {string} digitoDeControl - El dígito de control que se va a guardar.
   * @returns {void}
   */
  public setDigitoDeControl(digitoDeControl: string): void {
    this.update((state) => ({
      ...state,
      digitoDeControl,
    }));
  }

  /**
   * @method setContenedores
   * @description Guarda la lista de contenedores en el estado.
   * 
   * @param {GridContenedores[]} contenedores - La lista de contenedores que se va a guardar.
   * @returns {void}
   */
  public setContenedores(contenedores: GridContenedores[]): void {
    this.update((state) => ({
      ...state,
      contenedores,
    }));
  }

  /**
   * Establece los datos del contenedor.
   * @param datosDelCsvArchivo Datos del contenedor.
   */
  public setDelCsv(datosDelCsvArchivo: []): void {
    console.log('Estableciendo datos del CSV:', datosDelCsvArchivo);
    this.update((state) => ({
      ...state,
      datosDelCsvArchivo,
    }));
  }

  /**
   * Limpia los datos de la solicitud.
   */
  public limpiarSolicitud(): void {
    this.reset();
  }
}