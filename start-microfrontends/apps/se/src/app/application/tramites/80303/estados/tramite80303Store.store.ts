import {
  AnexoExportacion,
  AnexoImportacion,
  Federatario,
  FederatarioRealizaranLasOperaciones,
  ServiciosImmex,
} from '../models/complementaria.model';
import {
  Bitacora,
  DatosModificacion,
  EmpresaSubmanufacturera,
  ModificacionDatos,
  
} from '../models/modificacion-programa-immex-baja-submanufacturera.model';
import { Complimentaria, Empresas, Plantas } from '../../../shared/models/complementaria.model';
import { Anexo } from '../../../shared/models/anexos.model';
import { Injectable } from '@angular/core';
import { Store } from '@datorama/akita';
import { StoreConfig } from '@datorama/akita';

import{ProgramaLista} from '../models/modificacion-programa-immex-baja-submanufacturera.model';


/**
 * Representa el estado de Tramite80303 en la aplicación.
 * Este estado contiene información relacionada con diferentes tablas de datos y configuraciones específicas del trámite.
 */
export interface Tramite80303State {
  /**
   * RFC del usuario que ha iniciado sesión.
   * @type {string}
   */
  rfc: string;
  /**
   * Rol del capturista.
   */
  rol_capturista: string;
  /**
   * Identificador del tab actualmente seleccionado.
   * @type {number | undefined}
   */
  tabSeleccionado?: number;

  /**
   * Identificador del sub-tab actualmente seleccionado.
   * @type {number | undefined}
   */
  subTabSeleccionado?: number;

  /**
   * Datos de la tabla de anexos de exportación.
   * @type {AnexoExportacion[]}
   */
  anexoExportacionTablaDatos: AnexoExportacion[];

  /**
   * Datos de la tabla de anexos de importación.
   * @type {AnexoImportacion[]}
   */
  anexoImportacionTablaDatos: AnexoImportacion[];

  /**
   * Datos de la tabla de productos sensibles.
   * @type {Anexo[]}
   */
  sensiblesTablaDatos: Anexo[];

  /**
   * Datos de la tabla de accionistas.
   * @type {Complimentaria[]}
   */
  accionistasTablaDatos: Complimentaria[];

  /**
   * Datos de la tabla de federatarios.
   * @type {Federatario[]}
   */
  federatariosTablaDatos: Federatario[];

  /**
   * Datos de las plantas IMMEX que realizarán las operaciones.
   * @type {FederatarioRealizaranLasOperaciones[]}
   */
  plantasIMMEXDatos: FederatarioRealizaranLasOperaciones[];

  /**
   * Datos de la tabla de empresas submanufactureras.
   * @type {Empresas[]}
   */
  empresasSubmanufacturerasTablaDatos: Empresas[];

  /**
   * Datos de la tabla de plantas manufactureras.
   * @type {Plantas[]}
   */
  plantasManufacturerasTablaDatos: Plantas[];

  /**
   * Datos de la tabla de servicios IMMEX.
   * @type {ServicioImmex[]}
   */
  serviciosImmexTablaDatos: ServiciosImmex[];

  /**
   * Datos de la tabla de bitácora.
   * @type {Bitacora[]}
   */
  bitacoraTablaDatos: Bitacora[];

  /**
   * Datos de la tabla de empresas submanufactureras.
   * @type {EmpresaSubmanufacturera[]}
   */
  submanufacturerasTablaDatos: EmpresaSubmanufacturera[];

  /**
   * Información relacionada con la modificación de datos.
   * @type {ModificacionDatos}
   */
  modificacionDatos: ModificacionDatos;
  
  /**
   * Folio del programa seleccionado.
   */
  selectedFolioPrograma: string;

  /**
   * Información relacionada con la modificación.
   */
  datosModificacion: DatosModificacion | undefined;
  /**
   * Tipo de programa seleccionado.
   */
  selectedTipoPrograma: string;

  /**
   * ID del programa seleccionado.
   */
  selectedIdPrograma: string;

  /**
   * Certificación SAT
   * @type {string}
   */
  certificacionSAT: string;
   /**
   * ID de la solicitud.
   * @type {number}
   */
  idSolicitud?:number;
  

  /**
   * ID de la solicitud buscada.
   * @type {string[]}
   */
  buscarIdSolicitud?: string[];
 
}

/**
 * Crea el estado inicial para el trámite 80303.
 *
 * @function createInitialState
 * @returns {Tramite80303State} El estado inicial del store.
 */
export function createInitialState(): Tramite80303State {
  return {
    rfc: '',
    rol_capturista: '',
    tabSeleccionado: 1,
    subTabSeleccionado: 1,
    anexoExportacionTablaDatos: [],
    anexoImportacionTablaDatos: [],
    sensiblesTablaDatos: [],
    accionistasTablaDatos: [],
    federatariosTablaDatos: [],
    plantasIMMEXDatos: [],
    empresasSubmanufacturerasTablaDatos: [],
    plantasManufacturerasTablaDatos: [],
    serviciosImmexTablaDatos: [],
    bitacoraTablaDatos: [],
    submanufacturerasTablaDatos: [],
    selectedFolioPrograma: '',
    selectedTipoPrograma: '',
    selectedIdPrograma: '',
    certificacionSAT: '',
    datosModificacion: {
      rfc: '',
      representacionFederal: '',
      tipo: '',
      programa: ''
    },
    modificacionDatos: {
      rfc: '',
      representacionFederal: '',
      tipoModificacion: '',
      modificacionPrograma: '',
    },
     idSolicitud: 0,
    
  };
  
}

/**
 * Store que maneja el estado del trámite 80303.
 * Utiliza Akita para el control reactivo del estado.
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite80303', resettable: true })
export class Tramite80303Store extends Store<Tramite80303State> {
  constructor() {
    super(createInitialState());
  }

  /**
   * Cambia la pestaña actualmente seleccionada.
   *
   * @method updateTabSeleccionado
   * @param {number} tabSeleccionado - Índice de la nueva pestaña seleccionada.
   * @returns {void}
   */
  public updateTabSeleccionado(tabSeleccionado: number): void {
    this.update((state) => ({
      ...state,
      tabSeleccionado: tabSeleccionado,
    }));
  }
  /**
   * Actualiza los datos de modificación en el estado del store.
   * @method updateDatosModificacion
   * @param {DatosModificacion} datosModificacion - Nuevos datos de modificación a establecer.
   * @returns {void}
   */
  public updateDatosModificacion(datosModificacion: DatosModificacion): void {
    this.update({ datosModificacion });
  }
 /**
  * 
  * @param idSolicitud 
  */
 public updateIdSolicitud(idSolicitud: number): void {
    this.update((state) => ({
      ...state,
      idSolicitud,
    }));
  }
  
  /**
   * Cambia la pestaña actualmente seleccionada.
   *
   * @method updateSubTabSeleccionado
   * @param {number} tabSeleccionado - Índice de la nueva pestaña seleccionada.
   * @returns {void}
   */
  public updateSubTabSeleccionado(subTabSeleccionado: number): void {
    this.update((state) => ({
      ...state,
      subTabSeleccionado,
    }));
  }

  /**
   * Actualiza la lista de datos de anexo de exportación.
   *
   * @method updateAnexoExportacionTablaDatos
   * @param {AnexoExportacion[]} anexoExportacionTablaDatos - Nueva lista de datos de anexo de exportación.
   * @returns {void}
   */
  public updateAnexoExportacionTablaDatos(
    anexoExportacionTablaDatos: AnexoExportacion[]
  ): void {
    this.update((state) => ({
      ...state,
      anexoExportacionTablaDatos,
    }));
  }

  /**
   * Actualiza la lista de datos de anexo de importación.
   *
   * @method updateAnexoImportacionTablaDatos
   * @param {AnexoImportacion[]} anexoImportacionTablaDatos - Nueva lista de datos de anexo de importación.
   * @returns {void}
   */
  public updateAnexoImportacionTablaDatos(
    anexoImportacionTablaDatos: AnexoImportacion[]
  ): void {
    this.update((state) => ({
      ...state,
      anexoImportacionTablaDatos,
    }));
  }

  /**
   * Actualiza la lista de datos sensibles.
   *
   * @method updateSensiblesTablaDatos
   * @param {Anexo[]} sensiblesTablaDatos - Nueva lista de datos sensibles.
   * @returns {void}
   */
  public updateSensiblesTablaDatos(sensiblesTablaDatos: Anexo[]): void {
    this.update((state) => ({
      ...state,
      sensiblesTablaDatos,
    }));
  }

  /**
   * Actualiza la lista de datos de accionistas.
   *
   * @method updateAccionistasTablaDatos
   * @param {Complimentaria[]} accionistasTablaDatos - Nueva lista de datos de accionistas.
   * @returns {void}
   */
  public updateAccionistasTablaDatos(
    accionistasTablaDatos: Complimentaria[]
  ): void {
    this.update((state) => ({
      ...state,
      accionistasTablaDatos,
    }));
  }

  /**
   * Actualiza la lista de datos de federatarios.
   *
   * @method updateFederatariosTablaDatos
   * @param {Federatario[]} federatariosTablaDatos - Nueva lista de datos de federatarios.
   * @returns {void}
   */
  public updateFederatariosTablaDatos(
    federatariosTablaDatos: Federatario[]
  ): void {
    this.update((state) => ({
      ...state,
      federatariosTablaDatos,
    }));
  }

  /**
   * Actualiza la lista de datos de plantas IMMEX.
   *
   * @method updatePlantasIMMEXDatos
   * @param {FederatarioRealizaranLasOperaciones[]} plantasIMMEXDatos - Nueva lista de datos de plantas IMMEX.
   * @returns {void}
   */
  public updatePlantasIMMEXDatos(
    plantasIMMEXDatos: FederatarioRealizaranLasOperaciones[]
  ): void {
    this.update((state) => ({
      ...state,
      plantasIMMEXDatos,
    }));
  }

  /**
   * Actualiza la lista de datos de empresas submanufactureras.
   *
   * @method updateEmpresasSubmanufacturerasTablaDatos
   * @param {Empresas[]} empresasSubmanufacturerasTablaDatos - Nueva lista de datos de empresas submanufactureras.
   * @returns {void}
   */
  public updateEmpresasSubmanufacturerasTablaDatos(
    empresasSubmanufacturerasTablaDatos: Empresas[]
  ): void {
    this.update((state) => ({
      ...state,
      empresasSubmanufacturerasTablaDatos,
    }));
  }

  /**
   * Actualiza la lista de datos de plantas manufactureras.
   *
   * @method updatePlantasManufacturerasTablaDatos
   * @param {Plantas[]} plantasManufacturerasTablaDatos - Nueva lista de datos de plantas manufactureras.
   * @returns {void}
   */
  public updatePlantasManufacturerasTablaDatos(
    plantasManufacturerasTablaDatos: Plantas[]
  ): void {
    this.update((state) => ({
      ...state,
      plantasManufacturerasTablaDatos,
    }));
  }

  /**
   * Actualiza la lista de datos de servicios IMMEX.
   *
   * @method updateServiciosImmexTablaDatos
   * @param {ServicioImmex[]} serviciosImmexTablaDatos - Nueva lista de datos de servicios IMMEX.
   * @returns {void}
   */
  public updateServiciosImmexTablaDatos(
    serviciosImmexTablaDatos: ServiciosImmex[]
  ): void {
    this.update((state) => ({
      ...state,
      serviciosImmexTablaDatos,
    }));
  }

  /**
   * Actualiza la lista de datos de bitácora.
   *
   * @method updateBitacoraTablaDatos
   * @param {Bitacora[]} bitacoraTablaDatos - Nueva lista de datos de bitácora.
   * @returns {void}
   */
  public updateBitacoraTablaDatos(bitacoraTablaDatos: Bitacora[]): void {
    this.update((state) => ({
      ...state,
      bitacoraTablaDatos,
    }));
  }
  /**
   * Actualiza la lista de datos de submanufactureras.
   *
   * @method updateSubmanufacturerasTablaDatos
   * @param {EmpresaSubmanufacturera[]} submanufacturerasTablaDatos - Nueva lista de datos de submanufactureras.
   * @returns {void}
   * */

  public updateSubmanufacturerasTablaDatos(
    submanufacturerasTablaDatos: EmpresaSubmanufacturera[]
  ): void {
    this.update((state) => ({
      ...state,
      submanufacturerasTablaDatos,
    }));
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
   * 
   * @param idPrograma 
   */
setSelectedIdPrograma(idPrograma: string): void {
  this.update(state => ({
    ...state,
    selectedIdPrograma: idPrograma
  }));
}
/**   * 
   * @param tipoPrograma 
   */
setSelectedTipoPrograma(tipoPrograma: string): void {
  this.update(state => ({
    ...state,
    selectedTipoPrograma: tipoPrograma
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
 


}
