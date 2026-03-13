import { Anexo, Bitacora, Complimentaria, DatosDelModificacion, DatosImmex, DatosModificacion, DomicilioInfo, Federetarios, Operacions } from '../models/plantas-consulta.model';
import { Store, StoreConfig } from '@datorama/akita';
import { Catalogo } from '@ng-mf/data-access-user';
import { Injectable } from '@angular/core';
import { Plantas } from '../../../shared/models/complementaria.model';

/**
 * @interface TramiteState
 * Estado del trámite 80308
 */
export interface TramiteState {
  idSolicitud: number;
  datosModificacion: DatosModificacion;
  altaPlanta: Catalogo[];
  estado: Catalogo;
  formaValida: { [key: string]: boolean };
  domicilios: DomicilioInfo[];
  buscarDomicilios: DomicilioInfo[];
  datosSocios?: Complimentaria[];
  datosFederetarios?: Federetarios[];
  datosOperaciones?: Operacions[];
  datosEmpresas?: DatosImmex[];
  datosPlantas?: Plantas[];
  datosServiciosImmex?: DatosDelModificacion[];
  certificacionSAT?: string;
  datosExportacion?: Anexo[];
  datosImportacion?: Anexo[];
  datosFraccion?: Anexo[];
  bitacoraDatos?: Bitacora[]
}

/**
 * Estado inicial del trámite 80308
 */
export const INITIAL_STATE: TramiteState = {
  idSolicitud: 0,
  datosModificacion: {
    rfc: '',
    representacionFederal: '',
    tipoModalidad: '',
    descripcionModalidad: '',
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
  datosSocios: [],
  datosFederetarios: [],
  datosOperaciones: [],
  datosEmpresas: [],
  datosPlantas: [],
  datosServiciosImmex: [],
  certificacionSAT: '',
  datosExportacion: [],
  datosImportacion: [],
  datosFraccion: [],
  bitacoraDatos: []
};

/**
 * @class Tramite80308Store
 * Store de entidad para trámite 80308
 * @extends Store<TramiteState>
 */
@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'tramite-80308', resettable: true })
export class Tramite80308Store extends Store<TramiteState> {
  constructor() {
    super(INITIAL_STATE);
  }
  /**
   * Establece el ID de la solicitud en el estado
   * @param {number} idSolicitud
   */
  setIdSolicitud(idSolicitud: number): void {
    this.update((state) => ({
      ...state,
      idSolicitud,
    }));
  }

  /**
   * Establece los datos de modificación en el estado
   * @param {DatosModificacion} datosModificacion
   */
  setDatosModificacion(datosModificacion: DatosModificacion): void {
    this.update((state) => ({
      ...state,
      datosModificacion,
    }));
  }

  /**
   * Establece el estado en el almacén
   * @param {Catalogo} estado
   */
  setEstado(estado: Catalogo): void {
    this.update((state) => ({
      ...state,
      estado,
    }));
  }

  /**
   * Establece el alta de plantas en el almacén
   * @param {Catalogo[]} altaPlanta
   */
  setaltaPlanta(altaPlanta: Catalogo[]): void {
    this.update((state) => ({
      ...state,
      altaPlanta,
    }));
  }

  /**
   * Establece el estado de validación del formulario en el almacén
   * @param {{ [key: string]: boolean }} formaValida
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
   * Establece la lista de domicilios en el almacén
   * @param {DomicilioInfo[]} domicilios
   */
  setDomicilios(domicilios: DomicilioInfo[]): void {
    this.update((state) => ({
      ...state,
      domicilios,
    }));
  }

  /**
   * Elimina un domicilio de la lista de domicilios en el almacén
   * @param {DomicilioInfo} eliminarDomicilios
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
   * Agrega un domicilio a la lista de domicilios en el almacén
   * @param {DomicilioInfo} domicilios
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
   * Establece los domicilios que se van a buscar en el almacén
   * @param {DomicilioInfo[]} buscarDomicilios
   */
  setbuscarDomicilios(buscarDomicilios: DomicilioInfo[]): void {
    this.update((state) => ({
      ...state,
      buscarDomicilios,
    }));
  }
  /**
   * Establece los datos de los socios en el almacén
   * @param {Complimentaria[]} datosSocios
   */
  setDatosSocios(datosSocios: Complimentaria[]): void {
    this.update((state) => ({
      ...state,
      datosSocios,
    }));
  }

  /**
   * Establece los datos de los federetarios en el almacén
   * @param {Federetarios[]} datosFederetarios
   */
  setDatosFederetarios(datosFederetarios: Federetarios[]): void {
    this.update((state) => ({
      ...state,
      datosFederetarios,
    }));
  }

  /**
   * Establece los datos de las operaciones en el almacén
   * @param {Operacions[]} datosOperaciones
   */
  setDatosOperaciones(datosOperaciones: Operacions[]): void {
    this.update((state) => ({
      ...state,
      datosOperaciones,
    }));
  }

  /**
   * Establece los datos de las empresas en el almacén
   * @param {DatosImmex[]} datosEmpresas
   */
  setDatosEmpresas(datosEmpresas: DatosImmex[]): void {
    this.update((state) => ({
      ...state,
      datosEmpresas,
    }));
  }

  /**
   * Establece los datos de las plantas en el almacén
   * @param {Plantas[]} datosPlantas
   */
  setDatosPlantas(datosPlantas: Plantas[]): void {
    this.update((state) => ({
      ...state,
      datosPlantas,
    }));
  }

  /**
   * Establece los datos de los servicios IMMEX en el almacén
   * @param {DatosDelModificacion[]} datosServiciosImmex
   */
  setDatosServiciosImmex(datosServiciosImmex: DatosDelModificacion[]): void {
    this.update((state) => ({
      ...state,
      datosServiciosImmex,
    }));
  }

  /**
   * Establece la certificación SAT en el almacén
   * @param {string} certificacionSAT
   */
  setCertificacionSAT(certificacionSAT: string): void {
    this.update((state) => ({
      ...state,
      certificacionSAT,
    }));
  }

  /**
   * Establece los datos de exportación en el almacén
   * @param {Anexo[]} datosExportacion
   */
  setDatosExportacion(datosExportacion: Anexo[]): void {
    this.update((state) => ({
      ...state,
      datosExportacion,
    }));
  }

  /**
   * Establece los datos de importación en el almacén
   * @param {Anexo[]} datosImportacion
   */
  setDatosImportacion(datosImportacion: Anexo[]): void {
    this.update((state) => ({
      ...state,
      datosImportacion,
    }));
  }

  /**
   * Establece los datos de fracción en el almacén
   * @param {Anexo[]} datosFraccion
   */
  setDatosFraccion(datosFraccion: Anexo[]): void {
    this.update((state) => ({
      ...state,
      datosFraccion,
    }));
  }

  /**
   * Establece los datos de la bitácora en el almacén
   * @param {Bitacora[]} bitacoraDatos
   */
  setDatosBitacora(bitacoraDatos: Bitacora[]): void {
    this.update((state) => ({
      ...state,
      bitacoraDatos,
    }));
  }
}