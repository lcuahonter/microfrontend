import { Injectable } from '@angular/core';
import { Store } from '@datorama/akita';
import { StoreConfig } from '@datorama/akita';

import { Destinatario, Fabricante, Facturador, PagoDerechosFormState, Proveedor } from '../../../shared/models/terceros-relacionados.model';

import { DatosSolicitudFormState, TablaMercanciasDatos, TablaOpcionConfig, TablaScianConfig } from '../../../shared/models/datos-solicitud.model';
/**
 * Interfaz que define el estado inicial para los datos de un trámite.
 * Contiene todas las propiedades necesarias para gestionar la información
 * relacionada con un trámite.
 */
export interface DatosProcedureState {
    idSolicitud: number;
  /**
   * Identificador genérico del trámite.
   * @type {string}
   */
  ideGenerica1: string;

  /**
   * Observaciones relacionadas con el trámite.
   * @type {string}
   */
  observaciones: string;

  /**
   * Denominación del trámite.
   * @type {string}
   */
  denominacion: string;

  /**
   * Código del trámite.
   * @type {string}
   */
  codigo: string;

  /**
   * Estado donde se realiza el trámite.
   * @type {string}
   */
  estado: string;

  /**
   * Municipio donde se realiza el trámite.
   * @type {string}
   */
  municipio: string;

  /**
   * Localidad donde se realiza el trámite.
   * @type {string}
   */
  localidad: string;

  /**
   * Colonia donde se realiza el trámite.
   * @type {string}
   */
  colonia: string;

  /**
   * Calle donde se realiza el trámite.
   * @type {string}
   */
  calle: string;

  /**
   * Correo electrónico asociado al trámite.
   * @type {string}
   */
  correo: string;

  /**
   * Información sanitaria relacionada con el trámite.
   * @type {string}
   */
  sanitario: string;

  /**
   * Lada telefónica asociada.
   * @type {string}
   */
  lada: string;

  /**
   * Teléfono de contacto.
   * @type {string}
   */
  telefono: string;

  /**
   * Información sobre el funcionamiento del trámite.
   * @type {string}
   */
  funcionamiento: string;

  /**
   * Licencia asociada al trámite.
   * @type {string}
   */
  licencia: string;

  /**
   * RFC del representante legal.
   * @type {string}
   */
  representanteLegalRFC: string;

  /**
   * Nombre del representante legal.
   * @type {string}
   */
  representanteLegalNombre: string;

  /**
   * Campo de búsqueda relacionado con el trámite.
   * @type {string}
   */
  buscar: string;

  /**
   * Apellido paterno del representante legal.
   * @type {string}
   */
  representanteLegalApPaterno: string;

  /**
   * Apellido materno del representante legal.
   * @type {string}
   */
  representanteLegalApMaterno: string;

  /**
   * Régimen asociado al trámite.
   * @type {string}
   */
  regimen: string;

  /**
   * Información confidencial relacionada con el trámite.
   * @type {string}
   */
  informacionConfidencial: string;

  /**
   * Información sobre aduanas.
   * @type {string}
   */
  aduanas: string;

  /**
   * Clave de referencia del trámite.
   * @type {string}
   */
  claveDeReferencia: string;

  /**
   * Cadena de pago de la dependencia.
   * @type {string}
   */
  cadenaPagoDependencia: string;

  /**
   * Clave del banco asociada al trámite.
   * @type {string}
   */
  bancoClave: string;

  /**
   * Llave de pago asociada al trámite.
   * @type {string}
   */
  llaveDePago: string;

  /**
   * Fecha de pago del trámite.
   * @type {string}
   */
  fecPago: string;

  /**
   * Importe del pago realizado.
   * @type {string}
   */
  impPago: string;
 
    pagoDerechos: PagoDerechosFormState;
    
      /**
       * Configuración de opciones para la tabla.
       */
      opcionConfigDatos: TablaOpcionConfig[];
    
      /**
       * Configuración de SCIAN para la tabla.
       */
      scianConfigDatos: TablaScianConfig[];
    
      /**
       * Configuración de datos de la tabla de mercancías.
       */
      tablaMercanciasConfigDatos: TablaMercanciasDatos[];
      
  // /**
  //  * Estado de colapsabilidad de las opciones.
  //  */
  // opcionesColapsableState: boolean;

  /**
   * Opciones seleccionadas en la tabla de configuración.
   */
  seleccionadoopcionDatos: TablaOpcionConfig[];

  /**
   * Datos seleccionados de SCIAN en la tabla.
   */
  seleccionadoScianDatos: TablaScianConfig[];

  /**
   * Datos seleccionados de la tabla de mercancías.
   */
  seleccionadoTablaMercanciasDatos: TablaMercanciasDatos[];
   /**
   * Estado del formulario de datos de la solicitud.
   */
  datosSolicitudFormState: DatosSolicitudFormState;
  
  /**
     * Lista de fabricantes en la tabla de datos.
     */
    fabricanteTablaDatos: Fabricante[];
    /**
     * Lista de proveedores en la tabla de datos.
     */
    proveedorTablaDatos: Proveedor[];
     /**
     * Lista de destinatarios finales en la tabla de datos.
     */
    destinatarioFinalTablaDatos: Destinatario[];
   /**
     * Lista de facturadores en la tabla de datos.
     */
    facturadorTablaDatos: Facturador[];
}

/**
 * Función que crea el estado inicial para los datos del trámite.
 * @returns {DatosProcedureState} Estado inicial del trámite.
 */
export function createInitialState(): DatosProcedureState {
  return {
    idSolicitud: 0,
    ideGenerica1: '',
    observaciones: '',
    denominacion: '',
    codigo: '',
    estado: '',
    municipio: '',
    localidad: '',
    colonia: '',
    calle: '',
    correo: '',
    sanitario: '',
    lada: '',
    telefono: '',
    funcionamiento: '',
    licencia: '',
    representanteLegalRFC: '',
    representanteLegalNombre: '',
    buscar: '',
    representanteLegalApPaterno: '',
    representanteLegalApMaterno: '',
    regimen: '',
    informacionConfidencial: '',
    aduanas: '1',
    claveDeReferencia: '',
    cadenaPagoDependencia: '',
    bancoClave: '',
    llaveDePago: '',
    fecPago: '',
    impPago: '',
      pagoDerechos: {
      claveReferencia: '',
      cadenaDependencia: '',
      estado: '',
      llavePago: '',
      fechaPago: '',
      importePago: '',
      
    },
      // opcionesColapsableState: false,
      opcionConfigDatos: [],
      scianConfigDatos: [],
      tablaMercanciasConfigDatos: [],
      seleccionadoopcionDatos: [],
      seleccionadoScianDatos: [],
      seleccionadoTablaMercanciasDatos: [],
       datosSolicitudFormState: {
      rfcSanitario: '',
      denominacionRazon: '',
      correoElectronico: '',
      codigoPostal: '',
      estado: '',
      municipioAlcaldia: '',
      localidad: '',
      colonia: '',
      calle: '',
      lada: '',
      telefono: '',
      aviso: '',
      licenciaSanitaria: '',
      regimen: '',
      adunasDeEntradas: '',
      aeropuerto: false,
      publico: '',
      representanteRfc: '',
      representanteNombre: '',
      apellidoPaterno: '',
      apellidoMaterno: '',

    },
      fabricanteTablaDatos: [],
      proveedorTablaDatos: [],
      destinatarioFinalTablaDatos: [],
      facturadorTablaDatos: [],
  };
}

/**
 * Clase que representa el store para gestionar el estado de los datos del trámite.
 * Utiliza Akita para la gestión del estado.
 */
@Injectable({
  providedIn: 'root',
})

/**
 * Configuración del store para gestionar el estado de los datos del trámite.
 * 
 * @param {string} name - Nombre único del store. En este caso, 'tramite261101'.
 * @param {boolean} resettable - Indica si el estado del store puede ser reiniciado a su estado inicial.
 *                               Si es `true`, se puede restablecer el estado utilizando el método `reset()`.
 */
@StoreConfig({ name: 'tramite261103', resettable: true })

/**
 * Clase que representa el store para gestionar el estado de los datos del trámite.
 * Utiliza Akita para la gestión del estado.
 */
export class DatosProcedureStore extends Store<DatosProcedureState> {
  /**
   * Constructor de la clase DatosProcedureStore.
   * Inicializa el store con el estado inicial definido en la función createInitialState.
   */
  constructor() {
    super(createInitialState());
  }

  /**
   * Método para actualizar el estado del store con nuevos valores.
   * @param {Partial<DatosProcedureState>} values Valores parciales para actualizar el estado.
   */
  public establecerDatos(values: Partial<DatosProcedureState>): void {
    this.update((state) => ({
      ...state,
      ...values,
    }));
  }
   public updatePagoDerechos(nuevoPagoDerechos: PagoDerechosFormState): void {
      this.update((state) => ({
        ...state,
        pagoDerechos: nuevoPagoDerechos,
      }));
    }
    
  /**
   * @method updateOpcionConfigDatos
   * @description
   * Actualiza la configuración de opciones de la tabla en el estado.
   *
   * @param {TablaOpcionConfig[]} opcionConfigDatos - Nueva configuración de opciones de la tabla.
   */
  public updateOpcionConfigDatos(opcionConfigDatos: TablaOpcionConfig[]): void {
    this.update((state) => ({
      ...state,
      opcionConfigDatos,
    }));
  }

  /**
   * @method updateSeleccionadoOpcionDatos
   * @description Actualiza la opción seleccionada en el estado.
   * @param {TablaOpcionConfig[]} seleccionadoOpcionDatos - Nueva opción seleccionada.
   */
  public updateScianConfigDatos(scianConfigDatos: TablaScianConfig[]): void {
    this.update((state) => ({
      ...state,
      scianConfigDatos,
    }));
  }
  
  /**
   * @method updateSeleccionadoOpcionDatos
   * @description Actualiza la opción seleccionada en el estado.
   * @param {TablaOpcionConfig[]} seleccionadoOpcionDatos - Nueva opción seleccionada.
   */
  public updateTablaMercanciasConfigDatos(
    tablaMercanciasConfigDatos: TablaMercanciasDatos[]
  ): void {
    this.update((state) => ({
      ...state,
      tablaMercanciasConfigDatos,
    }));
  }
       
        public updateOpcionesColapsableState(opcionesColapsableState: boolean): void {
    this.update((state) => ({
      ...state,
      opcionesColapsableState,
    }));
  }

   /**
     * @method updateDatosSolicitudFormState
     * @description Actualiza el estado del formulario de datos de la solicitud.
     * @param {DatosSolicitudFormState} datosSolicitudFormState - Nuevo estado del formulario.
     */
    public updateDatosSolicitudFormState(
      datosSolicitudFormState: DatosSolicitudFormState
    ): void {
      this.update((state) => ({
        ...state,
        datosSolicitudFormState,
      }));
    }
    
      public updateSeleccionadoOpcionDatos(seleccionadoopcionDatos: TablaOpcionConfig[]): void {
    this.update((state) => ({
      ...state,
      seleccionadoopcionDatos,
    }));
  }
  public updateSeleccionadoScianDatos(seleccionadoScianDatos: TablaScianConfig[]): void {
    this.update((state) => ({
      ...state,
      seleccionadoScianDatos,
    }));
  }
  public updateSeleccionadoTablaMercanciasDatos(seleccionadoTablaMercanciasDatos: TablaMercanciasDatos[]): void {
    this.update((state) => ({
      ...state,
      seleccionadoTablaMercanciasDatos,
    }));
  }
  public updateFabricanteTablaDatos(newFabricantes: Fabricante[]): void {
    this.update((state) => ({
      ...state,
      fabricanteTablaDatos: [
        ...newFabricantes,
      ],
    }));
  }
    public updateProveedorTablaDatos(newProveedores: Proveedor[]): void {
    this.update((state) => ({
      ...state,
      proveedorTablaDatos: [
        ...newProveedores,
      ],
    }));
  }
    public updateDestinatarioFinalTablaDatos(
    newDestinatarios: Destinatario[]
  ): void {
    this.update((state) => ({
      ...state,
      destinatarioFinalTablaDatos: [
        ...newDestinatarios,
      ],
    }));
  }
  public updateFacturadorTablaDatos(
    newFacturadores: Facturador[]
  ): void {
    this.update((state) => ({
      ...state,
      destinatarioFinalTablaDatos: [
        ...newFacturadores,
      ],
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
}