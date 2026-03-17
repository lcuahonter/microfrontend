import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

export interface Catalogo {
  id: number;
  descripcion: string;
}
/**
 * Creacion del estado inicial para la interfaz de tramite 10301
 * @returns Solicitud10301
 */
/**
 * Represents the state for Solicitud 105.
 */
export interface Solicitud105State {
  /**
   * Indicates if the operation involves importation.
   */
  importacion: boolean;

  /**
   * Indicates if the operation involves exportation.
   */
  exportacion: boolean;

  /**
   * Indicates if the operation involves fiscal deposit for gas.
   */
  depositoFiscalGas: boolean;

  /**
   * Indicates if the operation involves fiscal deposit for vehicles.
   */
  depositoFiscalVehiculos: boolean;

  /**
   * Specifies the gas distribution details.
   */
  distribucionGas: string;

  /**
   * Specifies the services provided by third parties.
   */
  serviciosTerceros: string;

  /**
   * Specifies the details related to the automotive industry.
   */
  industriaAutomotriz: string;

  // Ubicación

  /**
   * Indicates if the operation involves a domicile.
   */
  domicilio: boolean;

  /**
   * Indicates if the operation involves a specific location.
   */
  ubicacion: boolean;

  // Inputs importación

  /**
   * List of countries involved in the operation.
   */
  pais: string | null;

  /**
   * Postal code of the location.
   */
  codigoPostal: string | number | null;

  /**
   * List of federal entities involved in the operation.
   */
  entidadFederativa: string | null;

  /**
   * List of municipalities or delegations involved in the operation.
   */
  municipioDelegacion: string | null;

  /**
   * Name of the locality.
   */
  localidad: string;

  /**
   * List of colonies involved in the operation.
   */
  colonia: string | null;

  /**
   * Name of the second federal entity, if applicable.
   */
  entidadFederativaDos: string | null;

  /**
   * Name of the street.
   */
  calle: string;

  /**
   * Exterior number of the location.
   */
  numeroExterior: string | number | null;

  /**
   * Interior number of the location.
   */
  numeroInterior: string | number | null;

  /**
   * Description of the location.
   */
  ubicacionDescripcion: string;

  /**
   * List of customs offices involved in the operation.
   */
  aduana: string | null;

  /**
   * List of tariff fractions involved in the operation.
   */
  fraccionarancelaria: string | null;

  /**
   * Description of the loading and unloading procedure.
   */
  procedimientoCargaDescarga: string;

  /**
   * Description of the measurement systems used at the location.
   */
  sistemasMedicionUbicacion: string;

  /**
   * Reason for not dispatching at customs.
   */
  motivoNoDespachoAduana: string;

  /**
   * List of operations involved in the process.
   */
  operaciones: string | null;

  /**
   * Indicates if the first form is valid.
   */
  validFormularioUno?: boolean | number | null;

  /**
   * Indicates if the second form is valid.
   */
  validFormularioTramiteDo?: boolean | number | null;
    /**
   * ID de la solicitud asociada al trámite.
   */
  idSolicitud: number;

}

export function createInitialState(): Solicitud105State {
  return {
     idSolicitud: 0,
    importacion: false,
    exportacion: false,
    depositoFiscalGas: false,
    depositoFiscalVehiculos: false,
    distribucionGas: '',
    serviciosTerceros: '',
    industriaAutomotriz: '',
    domicilio: false,
    ubicacion: false,
    pais: null,
    codigoPostal: null,
    entidadFederativa: null,
    municipioDelegacion: null,
    localidad:'',
    colonia:null,
    entidadFederativaDos: null,
    calle: '',
    numeroExterior: null,
    numeroInterior: null,
    ubicacionDescripcion: '',
    aduana: null,
    fraccionarancelaria: null,
    procedimientoCargaDescarga: "",
    sistemasMedicionUbicacion: "",
    motivoNoDespachoAduana: "",
    operaciones:"",
    validFormularioUno: null,
    validFormularioTramiteDo: null
  };
}
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite105', resettable: true })
export class Tramite105Store extends Store<Solicitud105State> {
  constructor() {
    super(createInitialState());
  }

  /**
 * @method setImportacion
 * @description Actualiza el estado de importación.
 * @param {boolean} importacion - Valor de importación.
 */

  public setImportacion(importacion: boolean): void {
    this.update((state) => ({
      ...state,
      importacion,
    }));
  }
 /**
   * @method setIdSolicitud
   * @description Establece el identificador de la solicitud.
   * @param {number} idSolicitud - Nuevo identificador de la solicitud.
   */
  public setIdSolicitud(idSolicitud: number): void {
    this.update((state) => ({
        ...state,
        idSolicitud,
    }));
  }
  
/**
 * @method setExportacion
 * @description Actualiza el estado de exportación.
 * @param {boolean} exportacion - Valor de exportación.
 */

  public setExportacion(exportacion: boolean): void {
    this.update((state) => ({
      ...state,
      exportacion,
    }));
  }

  /**
 * @method setDepositoFiscalGas
 * @description Actualiza el estado del depósito fiscal de gas.
 * @param {boolean} depositoFiscalGas - Valor del depósito fiscal de gas.
 */

  public setDepositoFiscalGas(depositoFiscalGas: boolean): void {
    this.update((state) => ({
      ...state,
      depositoFiscalGas,
    }));
  }

/**
 * @method setDepositoFiscalVehiculos
 * @description Actualiza el estado del depósito fiscal de vehículos.
 * @param {boolean} depositoFiscalVehiculos - Valor del depósito fiscal de vehículos.
 */

  public setDepositoFiscalVehiculos(depositoFiscalVehiculos: boolean): void {
    this.update((state) => ({
      ...state,
      depositoFiscalVehiculos,
    }));
  }

  /**
 * @method setDistribucionGas
 * @description Actualiza el valor de la distribución de gas.
 * @param {string} distribucionGas - Valor de la distribución de gas.
 */

  public setDistribucionGas(distribucionGas: string): void {
    this.update((state) => ({
      ...state,
      distribucionGas,
    }));
  }

/**
 * @method setServiciosTerceros
 * @description Actualiza el valor de los servicios de terceros.
 * @param {string} serviciosTerceros - Valor de los servicios de terceros.
 */

  public setServiciosTerceros(serviciosTerceros: string): void {
    this.update((state) => ({
      ...state,
      serviciosTerceros,
    }));
  }

/**
 * @method setIndustriaAutomotriz
 * @description Actualiza el estado de la industria automotriz.
 * @param {boolean} industriaAutomotriz - Valor de la industria automotriz.
 */

  public setIndustriaAutomotriz(industriaAutomotriz: string): void {
    this.update((state) => ({
      ...state,
      industriaAutomotriz,
    }));
  }

/**
 * @method setDomicilio
 * @description Actualiza el estado del domicilio.
 * @param {boolean} domicilio - Valor del domicilio.
 */

  public setDomicilio(domicilio: boolean): void {
    this.update((state) => ({
      ...state,
      domicilio,
    }));
  }

/**
 * @method setUbicacion
 * @description Actualiza el estado de la ubicación.
 * @param {boolean} ubicacion - Valor de la ubicación.
 */

  public setUbicacion(ubicacion: boolean): void {
    this.update((state) => ({
      ...state,
      ubicacion,
    }));
  }

  /**
 * @method setPais
 * @description Actualiza el valor del país.
 * @param {string} pais - Lista de países.
 */

  public setPais(pais: string): void {
    this.update((state) => ({
      ...state,
      pais,
    }));
  }

  /**
 * @method setCodigoPostal
 * @description Actualiza el valor del código postal.
 * @param {string | number | null} codigoPostal - Valor del código postal.
 */

  public setCodigoPostal(codigoPostal: string | number | null): void {
    this.update((state) => ({
      ...state,
      codigoPostal,
    }));
  }

      /**
       * Actualiza el estado de validez del formulario uno (`validFormularioUno`).
       *
       * @param {boolean | number | null} validFormularioUno - Valor que indica si el formulario uno es válido.
       *
       * Este método actualiza la propiedad `validFormularioUno` en el estado del store.
       */
    public setValidFormularioUno(validFormularioUno: boolean | number | null): void {
    this.update((state) => ({
      ...state,
      validFormularioUno,
    }));
  }


      /**
       * Actualiza el estado de validez del formulario dos (`validFormularioTramiteDo`).
       *
       * @param {boolean | number | null} validFormularioTramiteDo - Valor que indica si el formulario dos es válido.
       *
       * Este método actualiza la propiedad `validFormularioTramiteDo` en el estado del store.
       */
     public setValidFormularioTramiteDo(validFormularioTramiteDo: boolean | number | null): void {
    this.update((state) => ({
      ...state,
      validFormularioTramiteDo,
    }));
  }
   /**
 * @method setEntidadFederativa
 * @description Actualiza el valor de la entidad federativa.
 * @param {string} entidadFederativa - Lista de entidades federativas.
 */


  /**
   * Actualiza el estado de la tabla de mercancías en el store.
   * @param {tableDatos[]} mercanciTablaDatos - Arreglo de objetos tableDatos.
   */
  public setValidFormularioMercinia(mercanciTablaDatos: any[]): void {
    this.update((state) => ({
      ...state,
      mercanciTablaDatos,
    }));
  }

 /**
   * Actualiza el estado de la tabla de mercancías en el store.
   * @param {tableDatos[]} mercanciTablaDatos - Arreglo de objetos tableDatos.
   */
  public setValidFormularioMerciniaDos(registradosTablaDatosRegistore: any[]): void {
    this.update((state) => ({
      ...state,
      registradosTablaDatosRegistore,
    }));
  }
  
  /**
 * @method setEntidadFederativa
 * @description Actualiza el valor de la entidad federativa.
 * @param {string} entidadFederativa - Lista de entidades federativas.
 */


  public setEntidadFederativa(entidadFederativa: string): void {
    this.update((state) => ({
      ...state,
      entidadFederativa,
    }));
  }

  /**
 * @method setMunicipioDelegacion
 * @description Actualiza el valor del municipio o delegación.
 * @param {string} municipioDelegacion - Lista de municipios o delegaciones.
 */

  public setMunicipioDelegacion(municipioDelegacion: string): void {
    this.update((state) => ({
      ...state,
      municipioDelegacion,
    }));
  }

/**
 * @method setLocalidad
 * @description Actualiza el valor de la localidad.
 * @param {string} localidad - Valor de la localidad.
 */

  public setlocalidad(localidad: string): void {
    this.update((state) => ({
      ...state,
      localidad,
    }));
  }

/**
 * @method setColonia
 * @description Actualiza el valor de la colonia.
 * @param {string} colonia - Lista de colonias.
 */

  public setColonia(colonia: string): void {
    this.update((state) => ({
      ...state,
      colonia,
    }));
  }

/**
 * @method setEntidadFederativaDos
 * @description Actualiza el valor de la segunda entidad federativa.
 * @param {string | null} entidadFederativaDos - Valor de la segunda entidad federativa.
 */

  public setEntidadFederativaDos(entidadFederativaDos: string | null): void {
    this.update((state) => ({
      ...state,
      entidadFederativaDos,
    }));
  }

/**
 * @method setCalle
 * @description Actualiza el valor de la calle.
 * @param {string} calle - Valor de la calle.
 */

  public setCalle(calle: string): void {
    this.update((state) => ({
      ...state,
      calle,
    }));
  }

  /**
 * @method setNumeroExterior
 * @description Actualiza el valor del número exterior.
 * @param {string | number | null} numeroExterior - Valor del número exterior.
 */

  public setNumeroExterior(numeroExterior: string | number | null): void {
    this.update((state) => ({
      ...state,
      numeroExterior,
    }));
  }

/**
 * @method setNumeroInterior
 * @description Actualiza el valor del número interior.
 * @param {string | number | null} numeroInterior - Valor del número interior.
 */

  public setNumeroInterior(numeroInterior: string | number | null): void {
    this.update((state) => ({
      ...state,
      numeroInterior,
    }));
  }

  /**
 * @method setUbicacionDescripcion
 * @description Actualiza la descripción de la ubicación.
 * @param {string} ubicacionDescripcion - Descripción de la ubicación.
 */

  public setUbicacionDescripcion(ubicacionDescripcion: string): void {
    this.update((state) => ({
      ...state,
      ubicacionDescripcion,
    }));
  }

/**
 * @method setAduana
 * @description Actualiza el valor de la aduana.
 * @param {string} aduana - Lista de aduanas.
 */

  public setAduana(aduana: string): void {
    this.update((state) => ({
      ...state,
      aduana,
    }));
  }

  /**
 * @method setFraccionarancelaria
 * @description Actualiza el valor de la fracción arancelaria.
 * @param {string} fraccionarancelaria - Lista de fracciones arancelarias.
 */

  public setFraccionarancelaria(fraccionarancelaria: string): void {
    this.update((state) => ({
      ...state,
      fraccionarancelaria,
    }));
  }

  /**
 * @method setProcedimientoCargaDescarga
 * @description Actualiza el procedimiento de carga y descarga.
 * @param {string} procedimientoCargaDescarga - Valor del procedimiento de carga y descarga.
 */

  public setProcedimientoCargaDescarga(procedimientoCargaDescarga: string): void {
    this.update((state) => ({
      ...state,
      procedimientoCargaDescarga,
    }));
  }

  /**
 * @method setSistemasMedicionUbicacion
 * @description Actualiza los sistemas de medición de la ubicación.
 * @param {string} sistemasMedicionUbicacion - Valor de los sistemas de medición de la ubicación.
 */

  public setSistemasMedicionUbicacion(sistemasMedicionUbicacion: string): void {
    this.update((state) => ({
      ...state,
      sistemasMedicionUbicacion,
    }));
  }

  /**
 * @method setMotivoNoDespachoAduana
 * @description Actualiza el motivo por el cual no se realiza el despacho en la aduana.
 * @param {string} motivoNoDespachoAduana - Motivo del no despacho en la aduana.
 */

  public setMotivoNoDespachoAduana(motivoNoDespachoAduana: string): void {
    this.update((state) => ({
      ...state,
      motivoNoDespachoAduana,
    }));
  }

  /**
 * @method setOperaciones
 * @description Actualiza el valor de las operaciones.
 * @param {string} operaciones - Lista de operaciones.
 */

  public setOperaciones(operaciones: string): void {
    this.update((state) => ({
      ...state,
      operaciones,
    }));
  }
}
