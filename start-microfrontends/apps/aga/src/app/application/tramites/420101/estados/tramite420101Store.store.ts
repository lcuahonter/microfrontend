import { DatosDelRegistrar, DatosDelRegistrarManual } from '../models/proveedores.model';
import { CROSLISTA_DE_DATOS } from '../constants/proveedores.enum';
import { Injectable } from '@angular/core';
import { Store } from '@datorama/akita';
import { StoreConfig } from '@datorama/akita';

/**
 * @interface Tramite420101State
 * @description
 * Representa el estado de la tienda para el trámite 420101, incluyendo información del contribuyente,
 * pestaña seleccionada, datos de proveedores y lista cruzada de datos.
 */
export interface Tramite420101State {

  /**
   * RFC del contribuyente.
   * @type {string}
   */
  registroFederalContribuyente: string;

  /**
   * Razón social del contribuyente.
   * @type {string}
   */
  razonSocial: string;

  /**
   * Domicilio fiscal del contribuyente.
   * @type {string}
   */
  domicilioFiscal: string;

  /**
   * Índice de la pestaña seleccionada.
   * @type {number | undefined}
   */
  tabSeleccionado?: number;

  /**
   * Lista cruzada de datos de uso de norma.
   * @type {string[]}
   */
  usoCrossListDatos: string[];

  /**
   * Datos de los proveedores registrados manualmente.
   * @type {DatosDelRegistrarManual[]}
   */
  datosProveedoresManual: DatosDelRegistrarManual[];

  /**
   * Datos de los proveedores que se muestran en la tabla.
   * @type {DatosDelRegistrar[]}
   */
  datosTabla: DatosDelRegistrar[];

}


/**
 * Crea y retorna el estado inicial para el trámite 420101.
 *
 * @returns {Tramite420101State} El estado inicial del trámite, incluyendo la pestaña seleccionada,
 * los datos de proveedores manuales, el RFC, la razón social, el domicilio fiscal, el uso de la lista cruzada de datos y los datos de la tabla.
 */
export function createInitialState(): Tramite420101State {
  return {
    tabSeleccionado: 1,
    datosProveedoresManual: [],
    registroFederalContribuyente: '',
    razonSocial: '',
    domicilioFiscal: '',
    usoCrossListDatos: CROSLISTA_DE_DATOS,
    datosTabla: [],
  };
}

/**
 * @class Tramite420101Store
 * @description
 * Tienda para manejar el estado del trámite 420101. Proporciona métodos para actualizar
 * diferentes partes del estado.
 * @extends {Store<Tramite420101State>}
 */

/**
 * Crea una nueva instancia de Tramite420101Store y establece el estado inicial llamando a la función `createInitialState`.
 * Utiliza el constructor de la clase base mediante `super`.
 */

/**
 * Actualiza la lista de proveedores registrados manualmente en la tabla.
 * @param {DatosDelRegistrarManual[]} datosProveedoresManual - Nuevos datos de los proveedores registrados manualmente.
 */

/**
 * Actualiza la lista de datos de uso de norma.
 * @param {string[]} usoNormaDatos - Nuevos datos de uso de norma.
 */

/**
 * Actualiza el índice de la pestaña seleccionada.
 * @param {number} tabSeleccionado - Nuevo índice de la pestaña seleccionada.
 */

/**
 * Actualiza el RFC del contribuyente.
 * @param {string} registroFederalContribuyente - Nuevo RFC del contribuyente.
 */

/**
 * Actualiza la razón social del contribuyente.
 * @param {string} razonSocial - Nueva razón social del contribuyente.
 */

/**
 * Actualiza el domicilio fiscal del contribuyente.
 * @param {string} domicilioFiscal - Nuevo domicilio fiscal del contribuyente.
 */

/**
 * Actualiza el estado del formulario con los datos proporcionados.
 * @param {Tramite420101State} DATOS - Estado de la solicitud con la información del tipo de solicitud a actualizar en el store.
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite420101', resettable: true })

  /**
   * @class
   * @name Tramite420101Store
   * @description
   * Tienda para manejar el estado del trámite 420101. Proporciona métodos para actualizar
   * diferentes partes del estado.
   * @extends {Store<Tramite420101State>}
   */
  export class Tramite420101Store extends Store<Tramite420101State> {

  
  /**
   * Crea una nueva instancia de la clase y establece el estado inicial llamando a la función `createInitialState`.
   * Utiliza el constructor de la clase base mediante `super`.
   */
  constructor() {
    super(createInitialState());
  }

  /**
   * @method updateProveedoresTabla
   * @description Actualiza la lista de proveedores registrados manualmente en la tabla.
   * @param {DatosDelRegistrarManual[]} datosProveedoresManual - Nuevos datos de los proveedores.
   */
  public updateProveedoresTabla(datosProveedoresManual: DatosDelRegistrarManual[]): void {
    this.update((state) => ({
      ...state,
      datosProveedoresManual
    }));
  }

  /**
   * @method updateCrossListDatos
   * @description Actualiza la lista de datos de uso de norma.
   * @param {string[]} usoNormaDatos - Nuevos datos de uso de norma.
   */
  public updateCrossListDatos(usoNormaDatos: string[]): void {
    this.update((state) => ({
      ...state,
      usoNormaDatos
    }));
  }

  /**
   * @method updateTabSeleccionado
   * @description Actualiza el índice de la pestaña seleccionada.
   * @param {number} tabSeleccionado - Nuevo índice de la pestaña.
   */
  public updateTabSeleccionado(tabSeleccionado: number): void {
    this.update((state) => ({
      ...state,
      tabSeleccionado: tabSeleccionado,
    }));
  }

  /**
   * @method updateRegistroFederalContribuyente
   * @description Actualiza el RFC del contribuyente.
   * @param {string} registroFederalContribuyente - Nuevo RFC del contribuyente.
   */
  public updateRegistroFederalContribuyente(registroFederalContribuyente: string): void {
    this.update((state) => ({
      ...state,
      registroFederalContribuyente,
    }));
  }

  /**
   * @method updateRazonSocial
   * @description Actualiza la razón social del contribuyente.
   * @param {string} razonSocial - Nueva razón social del contribuyente.
   */
  public updateRazonSocial(razonSocial: string): void {
    this.update((state) => ({
      ...state,
      razonSocial,
    }));
  }

  /**
   * @method updateDomicilioFiscal
   * @description Actualiza el domicilio fiscal del contribuyente.
   * @param {string} domicilioFiscal - Nuevo domicilio fiscal del contribuyente.
   */
  public updateDomicilioFiscal(domicilioFiscal: string): void {
    this.update((state) => ({
      ...state,
      domicilioFiscal,
    }));
  }

    /**
 * @method actualizarEstadoFormulario
 * @description Actualiza el estado del formulario con los datos proporcionados.
 * @param {Tramite420101State} DATOS - Estado de la solicitud con la información 
 *                del tipo de solicitud a actualizar en el store.
 */
  actualizarEstadoFormulario(DATOS: Tramite420101State): void {
    this.update((state) => ({
      ...state,
      ...DATOS
    }))
  }
}
