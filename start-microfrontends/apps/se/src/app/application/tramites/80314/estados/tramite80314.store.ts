import { DatosModificacion, DomicilioInfo } from './models/plantas-consulta.model';
import { Store, StoreConfig } from '@datorama/akita';
import { Catalogo } from '@ng-mf/data-access-user';
import { DatosCertificacion } from '../models/datos-tramite.model';
import { Injectable } from '@angular/core';

/**
 * Interfaz que define el estado de la entidad Tramite.
 *
 * @export
 * @interface TramiteState
 */
export interface TramiteState {
  /**
   * Datos de modificación relacionados con el trámite.
   *
   * @type {DatosModificacion}
   * @memberof TramiteState
   */
  datosModificacion: DatosModificacion;

  /**
   * Lista de plantas a dar de alta.
   *
   * @type {Catalogo[]}
   * @memberof TramiteState
   */
  altaPlanta: Catalogo[];

  /**
   * Estado actual del trámite.
   *
   * @type {Catalogo}
   * @memberof TramiteState
   */
  estado: Catalogo;

  /**
   * Validación de los campos del formulario.
   *
   * @type {{ [key: string]: boolean }}
   * @memberof TramiteState
   */
  formaValida: { [key: string]: boolean };

  /**
   * Lista de domicilios asociados al trámite.
   *
   * @type {DomicilioInfo[]}
   * @memberof TramiteState
   */
  domicilios: DomicilioInfo[];

  /**
   * Lista de domicilios que se van a buscar.
   *
   * @type {DomicilioInfo[]}
   * @memberof TramiteState
   */
  buscarDomicilios: DomicilioInfo[];

   /**
   * Lista de actividades productivas.
   */
  actividadProductiva: Catalogo[] | null;

  /**
   * Fecha de inicio del trámite.
   */
  fechaInicio: string;

  /**
   * Fecha de vigencia del trámite.
   */
  fechaVigencia: string;

  /**
   * Estado de certificación.
   */
  certificion: string;
}

/**
 * Estado inicial para el manejo del estado de un trámite específico.
 * 
 * @constant
 * @type {TramiteState}
 * 
 * @property {object} datosModificacion - Contiene los datos relacionados con la modificación del trámite.
 * @property {string} datosModificacion.rfc - RFC asociado al trámite.
 * @property {string} datosModificacion.representacionFederal - Representación federal del trámite.
 * @property {string} datosModificacion.tipoModalidad - Tipo de modalidad del trámite.
 * @property {string} datosModificacion.descripcionModalidad - Descripción de la modalidad del trámite.
 * @property {string} datosModificacion.actividadProductivaActual - Actividad productiva actual relacionada con el trámite.
 * 
 * @property {Array} altaPlanta - Lista de plantas asociadas al trámite.
 * 
 * @property {object} estado - Representa el estado actual del trámite.
 * @property {number} estado.id - Identificador del estado.
 * @property {string} estado.descripcion - Descripción del estado.
 * 
 * @property {object} formaValida - Indica la validez de ciertos campos del formulario.
 * @property {boolean} formaValida.entidadFederativa - Validez de la entidad federativa.
 * 
 * @property {Array} domicilios - Lista de domicilios asociados al trámite.
 * 
 * @property {Array} buscarDomicilios - Lista de domicilios buscados relacionados con el trámite.
 */
export const INITIAL_STATE: TramiteState = {
  datosModificacion: {
    rfc: '',
    representacionFederal: '',
    tipoModalidad: '',
    descripcionModalidad: '',
    actividadProductivaActual: '',
  },
  altaPlanta: [],
  estado: {
    id: -1,
    descripcion: '',
  },
  formaValida: {
    entidadFederativa: false
  },
  domicilios:[],
  buscarDomicilios: [],
  actividadProductiva: null,
  fechaInicio: '',
  fechaVigencia: '',
  certificion: ''
};

/**
 * Tramite entity store
 *
 * @export
 * @class TramiteStore
 * @extends {Store<TramiteState>}
 */
@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'tramite-80314', resettable: true })
export class Tramite80314Store extends Store<TramiteState> {
  constructor() {
    super(INITIAL_STATE);
  }

  /**
   * Establece los datos de modificación en el estado.
   * 
   * @param {DatosModificacion} datosModificacion - Los datos de modificación que se van a establecer en el estado.
   * 
   * @returns {void} - No devuelve ningún valor.
   */
  setDatosModificacion(datosModificacion: DatosModificacion): void {
    this.update((state) => ({
      ...state,
      datosModificacion,
    }));
  }

  /**
   * Establece el estado en el almacén.
   * 
   * @param {Catalogo} estado - El estado que se va a establecer en el almacén.
   * 
   * @returns {void} - No devuelve ningún valor.
   */
  setEstado(estado: Catalogo): void {
    this.update((state) => ({
      ...state,
      estado,
    }));
  }

  /**
   * Establece el alta de plantas en el almacén.
   * 
   * @param {Catalogo[]} altaPlanta - Un array de objetos `Catalogo` que representa las plantas a dar de alta.
   * 
   * @returns {void} - No devuelve ningún valor.
   */
  setaltaPlanta(altaPlanta: Catalogo[]): void {
    this.update((state) => ({
      ...state,
      altaPlanta,
    }));
  }

  /**
   * Establece el estado de validación del formulario en el almacén.
   * 
   * @param {Object} formaValida - Un objeto donde las claves son los nombres de los campos del formulario y los valores son booleanos que indican si el campo es válido o no.
   * 
   * @returns {void} - No devuelve ningún valor.
   */
  setFormValida(formaValida: { [key: string]: boolean }) :void {
    this.update(state => {
      const IS_VALID = {...state.formaValida, ...formaValida}
      return {
        ...state,
        formaValida: IS_VALID
      }
    })
  }

  /**
   * Establece la lista de domicilios en el almacén.
   * 
   * @param {DomicilioInfo[]} domicilios - Un array de objetos `DomicilioInfo` que representa la lista de domicilios.
   * 
   * @returns {void} - No devuelve ningún valor.
   */
  setDomicilios(domicilios: DomicilioInfo[]): void {
    this.update((state) => ({
      ...state,
      domicilios,
    }));
  }

  /**
   * Elimina un domicilio de la lista de domicilios en el almacén.
   * 
   * @param {DomicilioInfo} eliminarDomicilios - El objeto `DomicilioInfo` que representa el domicilio a eliminar.
   * 
   * @returns {void} - No devuelve ningún valor.
   */
  eliminarDomicilios(eliminarDomicilios: DomicilioInfo): void {
    this.update(state => {
      const DOMICILIOS = [...state.domicilios].filter(ele => ele.id !== eliminarDomicilios.id);
      return {
        ...state,
        domicilios: DOMICILIOS
      }
    })
  }

  /**
   * Agrega un domicilio a la lista de domicilios en el almacén.
   * 
   * @param {DomicilioInfo} domicilios - El objeto `DomicilioInfo` que representa el domicilio a agregar.
   * 
   * @returns {void} - No devuelve ningún valor.
   */
  aggregarDomicilios(domicilios: DomicilioInfo): void {
    this.update(state => {
      const DOMICILIOS = [...state.domicilios , domicilios];
      return {
        ...state,
        domicilios: DOMICILIOS
      }
    })
  }

  /**
   * Establece los domicilios que se van a buscar en el almacén.
   * 
   * @param {DomicilioInfo[]} buscarDomicilios - Un array de objetos `DomicilioInfo` que representa la lista de domicilios que se van a buscar.
   * 
   * @returns {void} - No devuelve ningún valor.
   */
  setbuscarDomicilios(buscarDomicilios: DomicilioInfo[]): void {
    this.update((state) => ({
      ...state,
      buscarDomicilios,
    }));
  }

  /**
   * Establece las actividades productivas en el estado.
   *
   * @param {Catalogo[]} actividadProductiva - Lista de actividades productivas.
   */
  public setActividadProductiva(actividadProductiva: Catalogo[] | null): void {
    this.update((state) => ({
      ...state,
      actividadProductiva,
    }));
  }

  /**
   * Establece la fecha de inicio en el estado.
   *
   * @param {string} fechaInicio - Fecha de inicio.
   */
  public setFechaInicio(fechaInicio: string): void {
    this.update((state) => ({
      ...state,
      fechaInicio,
    }));
  }

  /**
   * Establece la fecha de vigencia en el estado.
   *
   * @param {string} fechaVigencia - Fecha de vigencia.
   */
  public setFechaVigencia(fechaVigencia: string): void {
    this.update((state) => ({
      ...state,
      fechaVigencia,
    }));
  }

  /**
   * Establece el estado de certificación en el estado.
   *
   * @param {string} certificion - Estado de certificación.
   */
  public setCertificion(certificion: string): void {
    this.update((state) => ({
      ...state,
      certificion,
    }));
  }

  /**
   * Establece los datos de certificación en el estado.
   *
   * @param {DatosCertificacion} datosCertificacion - Datos de certificación.
   */
  public setDatosCertificacion(datosCertificacion: DatosCertificacion): void {
    this.update((state) => ({
      ...state,
      datosCertificacion,
    }));
  }

}
