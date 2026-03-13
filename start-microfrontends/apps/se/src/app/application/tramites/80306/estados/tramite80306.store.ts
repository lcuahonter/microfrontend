import { Anexo, Complimentaria, DatosModificacion, DomicilioInfo, FederetariosDatos } from './models/plantas-consulta.model';
import { BitacoraModificacion, DatosEmpresa, DatosServicios, OperacionsImmex, Plantas, ProductoExportacion, ProgramaLista } from '../models/datos-tramite.model';
import { Store, StoreConfig } from '@datorama/akita';
import { Catalogo } from '@ng-mf/data-access-user';
import { Injectable } from '@angular/core';

export interface TramiteState {
  /** ID de la solicitud */
  idSolicitud: number | null;
  /** Datos de la modificación */
  datosModificacion: DatosModificacion;
  /** Alta de plantas */
  altaPlanta: Catalogo[];
  /** Estado del trámite */
  estado: Catalogo;
  /** Validación del formulario */
  formaValida: { [key: string]: boolean };
  /** Lista de domicilios */
  domicilios: DomicilioInfo[];
  /** Lista de domicilios para buscar */
  buscarDomicilios: DomicilioInfo[];
    /**
   * RFC de inicio de sesión.
   * @type {string}
   */
  loginRfc: string;
  /**
   * Tipo de programa seleccionado.
   */
  selectedTipoPrograma: string;

    /**
   * Lista de datos del programa.
   */
  programaListaDatos: ProgramaLista[];

  /**
   * Folio del programa seleccionado.
   */
  selectedFolioPrograma: string;

    /**
   * ID del programa seleccionado.
   */
  selectedIdPrograma: string;

  /**
   * Datos de la complimentaria.
   */
  datosComplimentaria: Complimentaria[];

    /**
   * Datos de los federetarios.
   */
  datosFederetarios: FederetariosDatos[];

    /**
   * Datos de las operaciones.
   */
  datosOperacions: OperacionsImmex[];

  /** Datos de las empresas */
  datosEmpresas: DatosEmpresa[];

  /** Datos de manufacturera */
  datosManufacturera: Plantas[];

  /** Datos de los servicios */
  datosServicios: DatosServicios[];

  /** Datos de certificación SAT */
  certificacionSAT: string | null;

  /** Datos de anexos de exportación */
  datosExportacion: ProductoExportacion[];

  /** Datos de anexos de importación */
  datosImportacion: Anexo[];

  /** Datos de anexos de fracciones sensibles */
  datosFraccion: Anexo[];

  /** Datos de la bitácora de modificaciones */
  datosBitacora: BitacoraModificacion[];

}

/**
 * Estado inicial para el store de trámite 80306.
 * @const {TramiteState}
 */
export const INITIAL_STATE: TramiteState = {
  /** Datos de la modificación */
  datosModificacion: {
    rfc: '',
    representacionFederal: '',
    tipoModalidad: '',
    descripcionModalidad: '',
  },
  /** ID de la solicitud */
  idSolicitud: 0,
  /** Alta de plantas */
  altaPlanta: [],
  /** Estado del trámite */
  estado: {
    id: -1,
    descripcion: '',
  },
  /** Validación del formulario */
  formaValida: {
    entidadFederativa: false
  },
  /** Lista de domicilios */
  domicilios:[],
  /** Lista de domicilios para buscar */
  buscarDomicilios: [],
  /** RFC de inicio de sesión */
  loginRfc: '',
  /** Tipo de programa seleccionado */
  selectedTipoPrograma: '',
  /** Lista de datos del programa */
  programaListaDatos: [],
  /** Folio del programa seleccionado */
  selectedFolioPrograma: '',
  /** ID del programa seleccionado */
  selectedIdPrograma: '',
  /** Datos de la complimentaria */
  datosComplimentaria: [],
  /** Datos de los federetarios */
  datosFederetarios: [],
  /** Datos de las operaciones */
  datosOperacions: [],
  /** Datos de las empresas */
  datosEmpresas: [],
  /** Datos de manufacturera */
  datosManufacturera: [],
  /** Datos de los servicios */
  datosServicios: [],
  /** Datos de certificación SAT */
  certificacionSAT: '',
  /** Datos de anexos de exportación */
  datosExportacion: [],
  /** Datos de anexos de importación */
  datosImportacion: [],
  /** Datos de anexos de fracciones sensibles */
  datosFraccion: [],
  /** Datos de la bitácora de modificaciones */
  datosBitacora: [],
};

/**
 * Tramite entity store
 *
 * @export
 * @class TramiteStore
 * @extends {Store<TramiteState>}
 */
@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'tramite-80306', resettable: true })
export class Tramite80306Store extends Store<TramiteState> {
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
   * Establece el ID de la solicitud en el almacén.
   * @param {number | null} idSolicitud - El ID de la solicitud que se va a establecer en el almacén.
   * @returns {void} - No devuelve ningún valor.
   */
  setIdSolicitud(idSolicitud: number | null): void {
    this.update((state) => ({
      ...state,
      idSolicitud,
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
   * Establece el RFC de inicio de sesión en el almacén.
   * @param {string} loginRfc - El RFC de inicio de sesión que se va a establecer en el almacén.
   * @returns {void} - No devuelve ningún valor.
   */
  setLoginRfc(loginRfc: string): void {
    this.update((state) => ({
      ...state,
      loginRfc,
    }));
  }
    /**
   * Establece el tipo de programa seleccionado en el almacén.
   * @param {string} tipoPrograma - El tipo de programa seleccionado que se va a establecer en el almacén.
   * @returns {void} - No devuelve ningún valor.
   */
  setSelectedTipoPrograma(tipoPrograma: string): void {
    this.update((state) => ({
      ...state,
      selectedTipoPrograma: tipoPrograma,
    }));
  }
    /**
   * Establece los datos de la lista de programas en el almacén.
   * @param {ProgramaLista[]} programaListaDatos - Un array de objetos `ProgramaLista` que representa los datos de la lista de programas.
   * @return {void} - No devuelve ningún valor.
   */
  setProgramaListaDatos(programaListaDatos: ProgramaLista[]): void {
    this.update((state) => ({
      ...state,
      programaListaDatos,
    }));
  }
    /**
   * Establece el folio del programa seleccionado en el almacén.
   * @param {string} folioPrograma - El folio del programa seleccionado que se va a establecer en el almacén.
   * @return {void} - No devuelve ningún valor.
   */
  setSelectedFolioPrograma(folioPrograma: string): void {
    this.update((state) => ({
      ...state,
      selectedFolioPrograma: folioPrograma,
    }));
  }
    /**
   * Establece el ID del programa seleccionado en el almacén.
   * @param {string} idPrograma - El ID del programa seleccionado que se va a establecer en el almacén.
   * @return {void} - No devuelve ningún valor.
   */
  setSelectedIdPrograma(idPrograma: string): void {
    this.update((state) => ({
      ...state,
      selectedIdPrograma: idPrograma,
    }));
  }
    /**
   * Establece los datos de la complimentaria en el almacén.
   * @param {Complimentaria[]} datosComplimentaria - Un array de objetos `Complimentaria` que representa los datos de la complimentaria.
   * @return {void} - No devuelve ningún valor.
   */
  setDatosComplimentaria(datosComplimentaria: Complimentaria[]): void {
    this.update((state) => ({
      ...state,
      datosComplimentaria,
    }));
  }
    /**
   * Establece los datos de los federetarios en el almacén.
   * @param {FederetariosDatos[]} datosFederetarios - Un array de objetos `FederetariosDatos` que representa los datos de los federetarios.
   * @return {void} - No devuelve ningún valor.
   */
  setDatosFederatarios(datosFederetarios: FederetariosDatos[]): void {
    this.update((state) => ({
      ...state,
      datosFederetarios,
    }));
  }

    /**
   * Establece los datos de las operaciones en el almacén.
   * @param {OperacionsImmex[]} datosOperacions - Un array de objetos `OperacionsImmex` que representa los datos de las operaciones.
   * @return {void} - No devuelve ningún valor.
   */
  setDatosOperacions(datosOperacions: OperacionsImmex[]): void {
    this.update((state) => ({
      ...state,
      datosOperacions,
    }));
  }
    /**
   * Establece los datos de las empresas en el almacén.
   * @param {DatosEmpresa[]} datosEmpresas - Un array de objetos `DatosEmpresa` que representa los datos de las empresas.
   * @return {void} - No devuelve ningún valor.
   */
  setDatosEmpresas(datosEmpresas: DatosEmpresa[]): void {
    this.update((state) => ({
      ...state,
      datosEmpresas,
    }));
  }

    /**
   * Establece los datos de manufacturera en el almacén.
   * @param {Plantas[]} datosManufacturera - Un array de objetos `Plantas` que representa los datos de manufacturera.
   * @return {void} - No devuelve ningún valor.
   */
  setDatosManufacturera(datosManufacturera: Plantas[]): void {
    this.update((state) => ({
      ...state,
      datosManufacturera,
    }));
  }
    /**
   * Establece los datos de los servicios en el almacén.
   * @param {DatosServicios[]} datosServicios - Un array de objetos `DatosServicios` que representa los datos de los servicios.
   * @return {void} - No devuelve ningún valor.
   */
  setDatosServicios(datosServicios: DatosServicios[]): void {
    this.update((state) => ({
      ...state,
      datosServicios,
    }));
  }
    /**
   * Establece los datos de certificación SAT en el almacén.
   * @param {string | null} certificacionSAT - Una cadena que representa los datos de certificación SAT.
   * @return {void} - No devuelve ningún valor.
   */
  setCertificacionSAT(certificacionSAT: string | null): void {
    this.update((state) => ({
      ...state,
      certificacionSAT,
    }));
  }
    /**
   * Establece los datos de anexos de exportación en el almacén.
   * @param {Anexo[]} datosExportacion - Un array de objetos `Anexo` que representa los datos de anexos de exportación.
   * @return {void} - No devuelve ningún valor.
   */
  setDatosExportacion(datosExportacion: ProductoExportacion[]): void {
    this.update((state) => ({
      ...state,
      datosExportacion,
    }));
  }
    /**
   * Establece los datos de anexos de importación en el almacén.
   * @param {Anexo[]} datosImportacion - Un array de objetos `Anexo` que representa los datos de anexos de importación.
   * @return {void} - No devuelve ningún valor.
   */
  setDatosImportacion(datosImportacion: Anexo[]): void {
    this.update((state) => ({
      ...state,
      datosImportacion,
    }));
  }
    /**
   * Establece los datos de anexos de fracciones sensibles en el almacén.
   * @param {Anexo[]} datosFraccion - Un array de objetos `Anexo` que representa los datos de anexos de fracciones sensibles.
   * @return {void} - No devuelve ningún valor.
   */
  setDatosFraccion(datosFraccion: Anexo[]): void {
    this.update((state) => ({
      ...state,
      datosFraccion,
    }));
  }
    /**
   * Establece los datos de la bitácora de modificaciones en el almacén.
   * @param {BitacoraModificacion[]} datosBitacora - Un array de objetos `BitacoraModificacion` que representa los datos de la bitácora de modificaciones.
   * @return {void} - No devuelve ningún valor.
   */
  setDatosBitacora(datosBitacora: BitacoraModificacion[]): void {
    this.update((state) => ({
      ...state,
      datosBitacora,
    }));
  }
}
