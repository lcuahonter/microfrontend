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
 * @name Tramite260219State
 * @description
 * Representa el estado de la tienda para el trámite 260219. Contiene datos relacionados
 * con destinatarios, facturadores, proveedores, fabricantes, formularios y configuraciones.
 */
export interface Tramite260219State {
  
  /**
   * Datos de la tabla de destinatarios finales.
   * @type {Destinatario[]}
   */
  destinatarioFinalTablaDatos: Destinatario[];

  /**
   * Datos de la tabla de facturadores.
   * @type {Facturador[]}
   */
  facturadorTablaDatos: Facturador[];

  /**
   * Datos de la tabla de proveedores.
   * @type {Proveedor[]}
   */
  proveedorTablaDatos: Proveedor[];

  /**
   * Datos de la tabla de fabricantes.
   * @type {Fabricante[]}
   */
  fabricanteTablaDatos: Fabricante[];

  /**
   * Estado del formulario de datos de la solicitud.
   * @type {DatosSolicitudFormState}
   */
  datosSolicitudFormState: DatosSolicitudFormState;

  /**
   * Datos del formulario de mercancías.
   * @type {MercanciaForm}
   */
  mercanciaForm: MercanciaForm;

  /**
   * Configuración de opciones para la tabla.
   * @type {TablaOpcionConfig[]}
   */
  opcionConfigDatos: TablaOpcionConfig[];

  /**
   * Configuración de SCIAN para la tabla.
   * @type {TablaScianConfig[]}
   */
  scianConfigDatos: TablaScianConfig[];

  /**
   * Configuración de datos para la tabla de mercancías.
   * @type {TablaMercanciasDatos[]}
   */
  tablaMercanciasConfigDatos: TablaMercanciasDatos[];

  /**
   * Opciones seleccionadas de la tabla de configuración.
   * @type {TablaOpcionConfig[]}
   */
  seleccionadoopcionDatos: TablaOpcionConfig[];

  /**
   * Datos seleccionados de la configuración SCIAN.
   * @type {TablaScianConfig[]}
   */
  seleccionadoScianDatos: TablaScianConfig[];

  /**
   * Datos seleccionados de la tabla de mercancías.
   * @type {TablaMercanciasDatos[]}
   */
  seleccionadoTablaMercanciasDatos: TablaMercanciasDatos[];

  /**
   * Estado de las opciones colapsables.
   * @type {boolean}
   */
  opcionesColapsableState: boolean;

  /**
   * Estado del formulario de pago de derechos.
   * @type {PagoDerechosFormState}
   */
  pagoDerechos: PagoDerechosFormState;

  /**
   * Pestaña seleccionada actualmente (opcional).
   * @type {number | undefined}
   */
  tabSeleccionado?: number;
}

/**
 * @function
 * @name createInitialState
 * @description
 * Crea el estado inicial para la tienda del trámite 260219.
 * @returns {Tramite260219State} Estado inicial.
 */
export function createInitialState(): Tramite260219State {
  return {
    destinatarioFinalTablaDatos: [],
    facturadorTablaDatos: [],
    proveedorTablaDatos: [],
    fabricanteTablaDatos: [],
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
      banco:''
    },
    tabSeleccionado: 1,
  };
}

/**
 * @class Tramite260219Store
 * @description
 * Clase que extiende `Store` para administrar el estado de `Tramite260219State`.
 * Proporciona métodos para actualizar diferentes secciones del estado relacionado con el trámite 260219.
 *
 * @providedIn root
 * Este servicio está disponible en toda la aplicación a través del inyector raíz.
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite260219', resettable: true })
/**
 * @class
 * @name Tramite260219Store
 * @description
 * Tienda para manejar el estado del trámite 260219. Proporciona métodos para actualizar
 * diferentes partes del estado.
 * @extends {Store<Tramite260219State>}
 */
export class Tramite260219Store extends Store<Tramite260219State> {
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
      fabricanteTablaDatos: [...state.fabricanteTablaDatos, ...newFabricantes],
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
        ...state.destinatarioFinalTablaDatos,
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
      proveedorTablaDatos: [...state.proveedorTablaDatos, ...newProveedores],
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
      facturadorTablaDatos: [...state.facturadorTablaDatos, ...newFacturadores],
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
}
