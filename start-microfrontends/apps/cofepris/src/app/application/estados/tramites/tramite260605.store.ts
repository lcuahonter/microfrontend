import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

/**
 * Interfaz que representa el estado de la Solicitud260605.
 */
export interface Solicitud260605State {
  /**
   * Número de permiso de importación.
   * 
   * @type {string}
   * @memberof Solicitud260605State
   */
  numeroDePermiso: string;

  /**
   * Costumbres actuales.
   * 
   * @type {string}
   * @memberof Solicitud260605State
   */
  cstumbresAtuales: string;

  /**
   * RFC del solicitante.
   * 
   * @type {string}
   * @memberof Solicitud260605State
   */
  rfc: string;

  /**
   * Nombre del solicitante.
   * 
   * @type {string}
   * @memberof Solicitud260605State
   */
  nombre: string;

  /**
   * Apellido paterno del solicitante.
   * 
   * @type {string}
   * @memberof Solicitud260605State
   */
  apellidoPaterno: string;

  /**
   * Apellido materno del solicitante.
   * 
   * @type {string}
   * @memberof Solicitud260605State
   */
  apellidoMaterno: string;

  /**
   * Aduanas disponibles.
   * 
   * @type {[]}
   * @memberof Solicitud260605State
   */
  aduanasDisponibles: [];

  /**
   * Aduanas seleccionadas.
   * 
   * @type {[]}
   * @memberof Solicitud260605State
   */
  aduanasSeleccionadas: [];

  /**
   * Cantidad solicitada.
   * 
   * @type {string}
   * @memberof Solicitud260605State
   */
  cantidadSolicitada: string;
  /**
   * Aduana actual.
   * 
   * @type {string}
   * @memberof Solicitud260605State
   */
  aduanaActual: string;
  /**
   * Identificador de la solicitud.
   * @type {number | null}
   * @memberof Solicitud260605State
   */
  idSolicitud: number | null;
  /**
   *  Indica si el botón continuar ha sido activado para ejecutar las validaciones del formulario.
   * @type {boolean}
   * @memberof Solicitud260605State
   */
  continuarTriggered?: boolean;
  /** 
   * Estado de validez de los formularios dentro del trámite. 
   */
  formValidity?: {
    aduanerasInformaciones?: boolean;
    representanteLegal?: boolean;
  };
}

/**
 * Función para crear el estado inicial de la Solicitud260605.
 * @returns {Solicitud260605State} El estado inicial.
 */
export function createInitialState(): Solicitud260605State {
  return {
    numeroDePermiso: '',
    cstumbresAtuales: '',
    rfc: '',
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    aduanasDisponibles: [],
    aduanasSeleccionadas: [],
    cantidadSolicitada: '',
    aduanaActual: '',
    continuarTriggered: false,
    formValidity: {},
    idSolicitud: 0
  };
}

@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite260605', resettable: true })
export class Tramite260605Store extends Store<Solicitud260605State> {
  /**
   * Crea una instancia de Tramite260605Store.
   * @constructor
   */
  constructor() {
    super(createInitialState());
  }

  /**
   * Establece el numeroDPmiso en el estado.
   * @param {string} numeroDPmiso - El numeroDPmiso a establecer.
   */
  public setNumeroDPmiso(numeroDePermiso: string):void {
    this.update((state) => ({
      ...state,
      numeroDePermiso,
    }));
  }

  /**
   * Establece el cstumbresAtuales en el estado.
   * @param {string} cstumbresAtuales - El cstumbresAtuales a establecer.
   */
  public setCstumbresAtuales(cstumbresAtuales: string):void {
    this.update((state) => ({
      ...state,
      cstumbresAtuales,
    }));
  }

  /**
   * Establece el rfc en el estado.
   * @param {string} rfc - El rfc a establecer.
   */
  public setRfc(rfc: string):void {
    this.update((state) => ({
      ...state,
      rfc,
    }));
  }

  /**
   * Establece el nombre en el estado.
   * @param {string} nombre - El nombre a establecer.
   */
  public setNombre(nombre: string):void {
    this.update((state) => ({
      ...state,
      nombre,
    }));
  }

  /**
   * Establece el apellidoPaterno en el estado.
   * @param {string} apellidoPaterno - El apellidoPaterno a establecer.
   */
  public setApellidoPaterno(apellidoPaterno: string):void {
    this.update((state) => ({
      ...state,
      apellidoPaterno,
    }));
  }

  /**
   * Establece el apellidoMaterno en el estado.
   * @param {string} apellidoMaterno - El apellidoMaterno a establecer.
   */
  public setApellidoMaterno(apellidoMaterno: string):void {
    this.update((state) => ({
      ...state,
      apellidoMaterno,
    }));
  }

  /**
   * Establece las aduanasDisponibles en el estado.
   * @param {[]} aduanasDisponibles - Las aduanasDisponibles a establecer.
   */
  public setAduanasDisponibles(aduanasDisponibles: []):void {
    this.update((state) => ({
      ...state,
      aduanasDisponibles,
    }));
  }

  /**
   * Establece las aduanasSeleccionadas en el estado.
   * @param {[]} aduanasSeleccionadas - Las aduanasSeleccionadas a establecer.
   */
  public setAduanasSeleccionadas(aduanasSeleccionadas: []):void {
    this.update((state) => ({
      ...state,
      aduanasSeleccionadas,
    }));
  }

  /**
   * Establece la cantidadSolicitada en el estado.
   * @param {string} cantidadSolicitada - La cantidadSolicitada a establecer.
   */
  public setCantidadSolicitada(cantidadSolicitada: string):void {
    this.update((state) => ({
      ...state,
      cantidadSolicitada,
    }));
  }
 /**
   * Establece la cantidadSolicitada en el estado.
   * @param {string} costumbresActuales - La cantidadSolicitada a establecer.
   */
  public setCostumbresActuales(costumbresActuales: string):void {
    this.update((state) => ({
      ...state,
      costumbresActuales,
    }));
  }

  /**
   * Establece la aduanaActual en el estado.
   * @param {string} aduanaActual - La aduanaActual a establecer.
   */
  public setAduanaActual(aduanaActual: string):void {
    this.update((state) => ({
      ...state,
      aduanaActual,
    }));
  }

  /**
   * @description Actualiza el identificador de la solicitud.
   * @param idSolicitud Identificador de la solicitud como un número.
   */
  public actualizarIdSolicitud(idSolicitud: number): void {
    this.update((state) => ({
      ...state,
      idSolicitud,
    }));
  }

/**
 * Actualiza el estado de validez de un formulario específico dentro del trámite.
 * @param formName Nombre del formulario a actualizar.
 * @param isValid Indica si el formulario es válido o no.
 */
  public setFormValidity(formName: string, isValid: boolean): void {
    this.update((state) => ({
      ...state,
      formValidity: {
        ...state.formValidity,
        [formName]: isValid,
      },
    }));
  }

/**
 * Establece el estado del botón continuar para activar o desactivar las validaciones del formulario.
 * @param continuarTriggered Indica si el botón continuar ha sido activado.
 */
  public setContinuarTriggered(continuarTriggered: boolean): void {
    this.update((state) => ({ ...state, continuarTriggered }));
  }
  /**
   * Restablece el estado al estado inicial.
   */
  public limpiarSolicitud():void {
    this.reset();
  }
}