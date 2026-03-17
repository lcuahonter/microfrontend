import { Complimentaria, EmpresasSubmanufactureras, Federetarios, Operacions, Plantas, ProgramaLista } from '../models/plantas-consulta.model';
import { DatosModificacion, ExportacionImportacionDatos } from '../../../shared/models/modificacion.model';
import { Anexo } from '../../../shared/models/anexos.model';
import { Injectable } from '@angular/core';
import { ServiciosImmex } from '../../../shared/models/complementaria.model';
import { Store } from '@datorama/akita';
import { StoreConfig } from '@datorama/akita';

/**
 * Interface que encapsula el estado completo de la solicitud 80301.
 */
export interface Solicitud80301StateObj {
  /** Objeto que contiene los datos generales de la modificación */
  datosModificacion: Solicitud80301State;
}

/**
 * Representa el estado de la solicitud 80301.
 */
export interface Solicitud80301State {
  /**
   * RFC de inicio de sesión.
   * @type {string}
   */
  loginRfc?: string;

  /**
   * Lista de socios accionistas.
   */
  sociosAccionistas?: Complimentaria[];

  /**
   * Datos de los notarios.
   */
  notarios?: Federetarios[];

  /**
   * Datos de las plantas.
   */
  planta?: Operacions[];

  /**
   * Datos de los servicios IMMEX.
   */
  servicios?: ServiciosImmex[];

  /**
   * Fracciones de exportación.
   */
  fraccionesExportacion?: Anexo[];

  /**
   * Fracciones de importación.
   */
  fraccionesImportacion?: Anexo[];

  /**
   * Información relacionada con la modificación.
   */
  datosModificacion?: DatosModificacion;

  /**
   * Datos de exportación.
   */
  datosExportacion?: ExportacionImportacionDatos[];

  /**
   * Datos de importación.
   */
  datosImportacion?: ExportacionImportacionDatos[];

  /**
   * Lista de datos del programa.
   */
  programaListaDatos?: ProgramaLista[];

  /**
   * Folio del programa seleccionado.
   */
  selectedFolioPrograma?: string;

  /**
   * Tipo de programa seleccionado.
   */
  selectedTipoPrograma?: string;

  /**
   * ID del programa seleccionado.
   */
  selectedIdPrograma?: string;

  /**
   * Certificación SAT
   * @type {string}
   */
  certificacionSAT?: string;

  /**
   * ID de la solicitud.
   * @type {number}
   */
  idSolicitud?: number;

  /**
   * ID de la solicitud buscada.
   * @type {string[]}
   */
  buscarIdSolicitud?: string[];

  /**
   * Tipo de programa (IMMEX o PROSEC)
   * @type {string}
   */
  tipoPrograma?: string;

  /**
   * Datos de las plantas manufactureras.
   * @type {Plantas[]}
   */
  datosPlantas?: Plantas[];

  /**
   * Datos de las empresas submanufactureras.
   * @type {EmpresasSubmanufactureras[]}
   */
  datosEmpresas?: EmpresasSubmanufactureras[];
}

/**
 * Crea el estado inicial para la solicitud 80301.
 * @returns {Solicitud80301State} Estado inicial de la solicitud 80301.
 */
export function createInitialState(): Solicitud80301State {
  return {
    loginRfc: '',
    sociosAccionistas: [],
    notarios: [],
    planta: [],
    servicios: [],
    fraccionesExportacion: [],
    fraccionesImportacion: [],
    datosModificacion: {
      rfc: '',
      representacionFederal: '',
      tipo: 'Baja',
      programa: ''
    },
    datosExportacion: [],
    datosImportacion: [],
    programaListaDatos: [],
    selectedFolioPrograma: '',
    selectedTipoPrograma: '',
    selectedIdPrograma: '',
    certificacionSAT: '',
    idSolicitud: 0,
    buscarIdSolicitud: [],
    tipoPrograma: '',
    datosPlantas: [],
    datosEmpresas: []
  };
}

/**
 * Clase almacén inyectable para gestionar el estado del trámite 80301.
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite80301', resettable: true })
/**
 * Almacén para gestionar el estado del trámite 80301.
 * @class Tramite80301Store
 */
export class Tramite80301Store extends Store<Solicitud80301State> {
  /**
   * Constructor de la clase Tramite80301Store.
   * @constructor
   */
  constructor() {
    /**
     * Inicializa el almacén con el estado inicial.
     */
    super(createInitialState());
  }
  
  /**
   * Establece el RFC de inicio de sesión en el estado.
   *
   * @param loginRfc - RFC del usuario que ha iniciado sesión.
   */
  public setLoginRfc(loginRfc: string): void {
    this.update((state) => ({
      ...state,
      loginRfc,
    }));
  }

  /**
   * Establece los socios accionistas en el estado.
   *
   * @param sociosAccionistas - Arreglo de objetos Complimentaria que representan los socios accionistas.
   */
  public setSociosAccionistas(sociosAccionistas: Complimentaria[]): void {
    this.update((state) => ({
      ...state,
      sociosAccionistas,
    }));
  }

  /**
   * Establece los notarios en el estado.
   *
   * @param notarios - Arreglo de objetos Federetarios que representan los notarios.
   */
  public setNotarios(notarios: Federetarios[]): void {
    this.update((state) => ({
      ...state,
      notarios,
    }));
  }

  /**
   * Establece las plantas en el estado.
   *
   * @param planta - Arreglo de objetos Operacions que representan las plantas.
   */
  public setPlanta(planta: Operacions[]): void {
    this.update((state) => ({
      ...state,
      planta,
    }));
  }

  /**
   * Establece los servicios IMMEX en el estado.
   *
   * @param servicios - Arreglo de objetos ServiciosImmex que representan los servicios IMMEX.
   */
  public setServiciosImmex(servicios: ServiciosImmex[]): void {
    this.update((state) => ({
      ...state,
      servicios,
    }));
  }

  /**
   * Establece las fracciones de exportación en el estado.
   * 
   * @param fraccionesExportacion - Arreglo de objetos Anexo que representan las fracciones de exportación.
   */
  public setFraccionesExportacion(fraccionesExportacion: Anexo[]): void {
    this.update((state) => ({
      ...state,
      fraccionesExportacion,
    }));
  }

  /**
   * Establece las fracciones de importación en el estado.
   * 
   * @param fraccionesImportacion - Arreglo de objetos Anexo que representan las fracciones de importación.
   */
  public setFraccionesImportacion(fraccionesImportacion: Anexo[]): void {
    this.update((state) => ({
      ...state,
      fraccionesImportacion,
    }));
  }

  /**
   * Establece la información relacionada con la modificación en el estado.
   * 
   * @param datosModificacion - Objeto DatosModificacion que contiene la información de modificación.
   */
  public setDatosModificacion(datosModificacion: DatosModificacion): void {
    this.update((state) => ({
      ...state,
      datosModificacion,
    }));
  }

  /**
   * Establece los datos de exportación en el estado.
   * 
   * @param datosExportacion - Arreglo de objetos ExportacionImportacionDatos que representan los datos de exportación.
   */
  public setDatosExportacion(datosExportacion: ExportacionImportacionDatos[]): void {
    this.update((state) => ({
      ...state,
      datosExportacion,
    }));
  }
  
  /**
   * Establece los datos de importación en el estado.
   * 
   * @param datosImportacion - Arreglo de objetos ExportacionImportacionDatos que representan los datos de importación.
   */
  public setDatosImportacion(datosImportacion: ExportacionImportacionDatos[]): void {
    this.update((state) => ({
      ...state,
      datosImportacion,
    }));
  }

  /**
   * Establece la lista de datos del programa en el estado.
   * 
   * @param programaListaDatos - Arreglo de objetos ProgramaLista que representan la lista de datos del programa.
   */
  public setProgramaListaDatos(programaListaDatos: ProgramaLista[]): void {
    this.update((state) => ({
      ...state,
      programaListaDatos,
    }));
  }

  /**
   * Establece el folio del programa seleccionado en el estado.
   *
   * @param selectedFolioPrograma - El folio del programa seleccionado.
   */
  public setSelectedFolioPrograma(selectedFolioPrograma: string): void {
    this.update((state) => ({
      ...state,
      selectedFolioPrograma,
    }));
  }
  
  /**
   * Establece el tipo de programa seleccionado en el estado.
   * 
   * @param selectedTipoPrograma - El tipo de programa seleccionado.
   */
  public setSelectedTipoPrograma(selectedTipoPrograma: string): void {
    this.update((state) => ({
      ...state,
      selectedTipoPrograma,
    }));
  }

  /**
   * Establece el ID del programa seleccionado en el estado.
   *
   * @param selectedIdPrograma - El ID del programa seleccionado.
   */
  public setSelectedIdPrograma(selectedIdPrograma: string): void {
    this.update((state) => ({
      ...state,
      selectedIdPrograma,
    }));
  }

  /**
   * Establece el valor de la certificación SAT en el estado.
   *
   * @param certificacionSAT - El nuevo valor de la certificación SAT que se asignará al estado.
   */
  public setCertificacionSAT(certificacionSAT: string): void {
    this.update((state) => ({
      ...state,
      certificacionSAT,
    }));
  }

  /**
   * Establece el ID de la solicitud a establecer en el estado.
   *
   * @param idSolicitud - El ID de la solicitud a establecer en el estado.
   */
  public setIdSolicitud(idSolicitud: number): void {
    this.update((state) => ({
      ...state,
      idSolicitud,
    }));
  }

  /**
   * Establece el ID de la solicitud buscada en el estado.
   *
   * @param buscarIdSolicitud - El ID de la solicitud buscada a establecer en el estado.
   */
  public setBuscarIdSolicitud(buscarIdSolicitud: string[]): void {
    this.update((state) => ({
      ...state,
      buscarIdSolicitud,
    }));
  }

  /**
   * Establece el tipo de programa en el estado.
   *
   * @param tipoPrograma - El tipo de programa a establecer en el estado.
   */
  public setTipoPrograma(tipoPrograma: string): void {
    this.update((state) => ({
      ...state,
      tipoPrograma,
    }));
  }

  /**
   * Establece los datos de las plantas manufactureras en el estado.
   *
   * @param datosPlantas - Arreglo de objetos Plantas que representan los datos de las plantas manufactureras.
   */
  public setDatosPlantas(datosPlantas: Plantas[]): void {
    this.update((state) => ({
      ...state,
      datosPlantas,
    }));
  }

  /**
   * Establece los datos de las empresas submanufactureras en el estado.
   *
   * @param datosEmpresas - Arreglo de objetos EmpresasSubmanufactureras que representan los datos de las empresas submanufactureras.
   */
  public setDatosEmpresas(datosEmpresas: EmpresasSubmanufactureras[]): void {
    this.update((state) => ({
      ...state,
      datosEmpresas,
    }));
  }

  /**
   * Limpia los datos de la solicitud
   */
  public limpiarSolicitud(): void {
    this.reset();
  }
}