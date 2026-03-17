import { DatosSolicitudFormState } from '../../../shared/models/datos-solicitud.model';
import { Destinatario } from '../../../shared/models/terceros-relacionados.model';
import { Fabricante } from '../../../shared/models/terceros-relacionados.model';
import { Facturador } from '../../../shared/models/terceros-relacionados.model';
import { Injectable } from '@angular/core';
import { MercanciaForm } from '../../../shared/models/datos-solicitud.model';
import { PagoDerechosFormState } from '../../../shared/models/terceros-relacionados.model';
import { Proveedor } from '../../../shared/models/terceros-relacionados.model';
import { Store } from '@datorama/akita';
import { StoreConfig } from '@datorama/akita';
import { TABLA_OPCION_DATA } from '../../../shared/constantes/datos-solicitud.enum';
import { TablaMercanciasDatos } from '../../../shared/models/datos-solicitud.model';
import { TablaOpcionConfig } from '../../../shared/models/datos-solicitud.model';
import { TablaScianConfig } from '../../../shared/models/datos-solicitud.model';
/**
 * @interface
 * @name Tramite260217State
 * @description
 * Representa el estado de la tienda para el trámite 260217. Contiene datos relacionados
 * con destinatarios, facturadores, proveedores, fabricantes, formularios y configuraciones.
 */
export interface Tramite260217State {
  idSolicitud: number;
  
  /**
   * Array of final recipient data for the recipients table
   * @type {Destinatario[]}
   */
  destinatarioFinalTablaDatos: Destinatario[];

  /**
   * Array of biller/invoicer data for the billers table
   * @type {Facturador[]}
   */
  facturadorTablaDatos: Facturador[];

  /**
   * Array of supplier data for the suppliers table
   * @type {Proveedor[]}
   */
  proveedorTablaDatos: Proveedor[];

  /**
   * Array of manufacturer data for the manufacturers table
   * @type {Fabricante[]}
   */
  fabricanteTablaDatos: Fabricante[];

  /**
   * State object containing request form data
   * @type {DatosSolicitudFormState}
   */
  datosSolicitudFormState: DatosSolicitudFormState;

  /**
   * Form data structure for merchandise information
   * @type {MercanciaForm}
   */
  mercanciaForm: MercanciaForm;

  /**
   * Array of configuration options for data tables
   * @type {TablaOpcionConfig[]}
   */
  opcionConfigDatos: TablaOpcionConfig[];

  /**
   * Array of SCIAN (Mexican industry classification) configuration data
   * @type {TablaScianConfig[]}
   */
  scianConfigDatos: TablaScianConfig[];

  /**
   * Array of merchandise table configuration data
   * @type {TablaMercanciasDatos[]}
   */
  tablaMercanciasConfigDatos: TablaMercanciasDatos[];

  /**
   * Array of selected configuration options
   * @type {TablaOpcionConfig[]}
   */
  seleccionadoopcionDatos: TablaOpcionConfig[];

  /**
   * Array of selected SCIAN configuration data
   * @type {TablaScianConfig[]}
   */
  seleccionadoScianDatos: TablaScianConfig[];

  /**
   * Array of selected merchandise table data
   * @type {TablaMercanciasDatos[]}
   */
  seleccionadoTablaMercanciasDatos: TablaMercanciasDatos[];

  /**
   * Boolean flag indicating the collapsible options state (expanded/collapsed)
   * @type {boolean}
   */
  opcionesColapsableState: boolean;

  /**
   * State object containing payment rights form data
   * @type {PagoDerechosFormState}
   */
  pagoDerechos: PagoDerechosFormState;

  /**
   * Optional index of the currently selected tab
   * @type {number | undefined}
   */
  tabSeleccionado?: number;
}

/**
 * @function
 * @name createInitialState
 * @description
 * Crea el estado inicial para la tienda del trámite 260217.
 * @returns {Tramite260217State} Estado inicial.
 */
export function createInitialState(): Tramite260217State {
  return {
    idSolicitud: 0,
    destinatarioFinalTablaDatos: [],
    facturadorTablaDatos: [],
    proveedorTablaDatos: [],
    fabricanteTablaDatos: [],
    datosSolicitudFormState: {
      rfcSanitario: '',
      denominacionRazon: '',
      correoElectronico: '',
      codigoPostal: '',
      estado: '1',
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
      publico: 'si',
      representanteRfc: '',
      representanteNombre: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
    },
    mercanciaForm: {
      clasificacionProducto: '',
      especificarClasificacionProducto: '',
      denominacionEspecificaProducto: '',
      denominacionDistintiva: '',
      denominacionComun: '',
      tipoProducto: '',
      formaFarmaceutica: '',
      estadoFisico: '',
      fraccionArancelaria: '',
      descripcionFraccion: '',
      cantidadUmtValor: '',
      cantidadUmt: '',
      cantidadUmcValor: '',
      cantidadUmc: '',
      presentacion: '',
      numeroRegistroSanitario: '',
      fechaCaducidad: '',
      paisDeOriginDatos: [],
      paisDeProcedenciaDatos: [],
    },
    opcionConfigDatos: TABLA_OPCION_DATA,
    scianConfigDatos: [], // SCIAN_TABLA_DATA
    tablaMercanciasConfigDatos: [],
    seleccionadoopcionDatos: [],
    seleccionadoScianDatos: [],
    seleccionadoTablaMercanciasDatos: [],
    opcionesColapsableState: false,
    pagoDerechos: {
      claveReferencia: '',
      cadenaDependencia: '',
      estado: '',
      llavePago: '',
      fechaPago: '',
      importePago: '',
    },
    tabSeleccionado: 1,
  };
}

@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite260217', resettable: true })
/**
 * @class
 * @name Tramite260217Store
 * @description
 * Tienda para manejar el estado del trámite 260217. Proporciona métodos para actualizar
 * diferentes partes del estado.
 * @extends {Store<Tramite260217State>}
 */
export class Tramite260217Store extends Store<Tramite260217State> {
  constructor() {
    super(createInitialState());
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

  /**
   * @method updateFabricanteTablaDatos
   * @description Agrega nuevos fabricantes a la lista existente.
   * @param {Fabricante[]} newFabricantes - Lista de nuevos fabricantes.
   */
  public updateFabricanteTablaDatos(newFabricantes: Fabricante[]): void {
    this.update((state) => ({
      ...state,
      fabricanteTablaDatos: [...newFabricantes],
    }));
  }

  /**
   * @method updateDestinatarioFinalTablaDatos
   * @description Agrega nuevos destinatarios finales a la lista existente.
   * @param {Destinatario[]} newDestinatarios - Lista de nuevos destinatarios.
   */
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

  /**
   * @method updateProveedorTablaDatos
   * @description Agrega nuevos proveedores a la lista existente.
   * @param {Proveedor[]} newProveedores - Lista de nuevos proveedores.
   */
  public updateProveedorTablaDatos(newProveedores: Proveedor[]): void {
    this.update((state) => ({
      ...state,
      proveedorTablaDatos: [...newProveedores],
    }));
  }

  /**
   * @method updateFacturadorTablaDatos
   * @description Agrega nuevos facturadores a la lista existente.
   * @param {Facturador[]} newFacturadores - Lista de nuevos facturadores.
   */
  public updateFacturadorTablaDatos(newFacturadores: Facturador[]): void {
    this.update((state) => ({
      ...state,
      facturadorTablaDatos: [...newFacturadores],
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
  /**
   * @method updatePagoDerechos
   * @description Actualiza el estado del formulario de pago de derechos.
   * @param {PagoDerechosFormState} nuevoPagoDerechos - Nuevo estado del formulario.
   */
  public updatePagoDerechos(nuevoPagoDerechos: PagoDerechosFormState): void {
    this.update((state) => ({
      ...state,
      pagoDerechos: nuevoPagoDerechos,
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

  setIdSolicitud(idSolicitud: number): void {
    this.update((state) => ({
      ...state,
      idSolicitud,
    }));
  }
}
