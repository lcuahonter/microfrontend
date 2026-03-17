import {
  DatosSolicitudFormState,
  MercanciaForm,
  TablaMercanciasDatos,
  TablaOpcionConfig,
  TablaScianConfig,
} from '../../../shared/models/shared2606/datos-solicitud.model';
import {
  Destinatario,
  Fabricante,
  Facturador,
  Proveedor,
} from '../../../shared/models/shared2606/terceros-relacionados.model';
import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { TABLA_OPCION_DATA } from '../../../shared/constantes/shared2606/datos-solicitud.enum';

/**
 * @interface Tramite260603State
 * @description
 * Representa el estado completo utilizado para gestionar el trámite 260603.
 * Contiene información relacionada con destinatarios, proveedores, fabricantes,
 * facturadores, datos de la solicitud, mercancías, configuraciones de tablas,
 * opciones seleccionadas, estados colapsables y pestañas activas.
 */
export interface Tramite260603State {
  /** Identificador único de la solicitud. */
  idSolicitud: number;

  /** Lista de destinatarios finales registrados. */
  destinatarioFinalTablaDatos: Destinatario[];

  /** Lista de facturadores registrados. */
  facturadorTablaDatos: Facturador[];

  /** Lista de proveedores registrados. */
  proveedorTablaDatos: Proveedor[];

  /** Lista de fabricantes registrados. */
  fabricanteTablaDatos: Fabricante[];

  /** Estado del formulario general de la solicitud. */
  datosSolicitudFormState: DatosSolicitudFormState;

  /** Estado del formulario de mercancías. */
  mercanciaForm: MercanciaForm;

  /** Configuración de opciones mostradas en la tabla. */
  opcionConfigDatos: TablaOpcionConfig[];

  /** Configuración SCIAN asociada. */
  scianConfigDatos: TablaScianConfig[];

  /** Configuración de la tabla de mercancías. */
  tablaMercanciasConfigDatos: TablaMercanciasDatos[];

  /** Opciones seleccionadas en el módulo de configuración. */
  seleccionadoopcionDatos: TablaOpcionConfig[];

  /** Configuración SCIAN seleccionada. */
  seleccionadoScianDatos: TablaScianConfig[];

  /** Datos de mercancías seleccionados. */
  seleccionadoTablaMercanciasDatos: TablaMercanciasDatos[];

  /** Estado del panel colapsable. */
  opcionesColapsableState: boolean;

  /** Pestaña activa en la interfaz (opcional). */
  tabSeleccionado?: number;
}

/**
 * @function createInitialState
 * @description
 * Crea el estado inicial para el trámite 260603 con valores predeterminados.
 * @returns {Tramite260603State} Estado inicial del trámite 260603.
 */
export function createInitialState(): Tramite260603State {
  /** Valores iniciales para el estado del trámite 260603 */
  return {
    /** Identificador de la solicitud */
    idSolicitud: 0,

    /** Tablas relacionadas con terceros y actores involucrados */
    destinatarioFinalTablaDatos: [],
    facturadorTablaDatos: [],
    proveedorTablaDatos: [],
    fabricanteTablaDatos: [],

    /** Información del solicitante y establecimiento */
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
      aduana: '',
      aeropuerto: false,
      publico: '',
      representanteRfc: '',
      representanteNombre: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
    },

    /** Información del formulario para mercancias */
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
      fechaDeMovimiento: '',
      paisDeOriginDatos: [],
      paisDeProcedenciaDatos: [],
      especifique: '',
      especifiqueForma: '',
    },

    /** Catálogos y configuraciones */
    opcionConfigDatos: TABLA_OPCION_DATA,
    scianConfigDatos: [],
    tablaMercanciasConfigDatos: [],
    seleccionadoopcionDatos: [],
    seleccionadoScianDatos: [],
    seleccionadoTablaMercanciasDatos: [],

    /** Estado UI */
    opcionesColapsableState: false,
    tabSeleccionado: 1,
  };
}

/**
 * @class Tramite260603Store
 * @description
 * Tienda que gestiona el estado del trámite 260603.
 * Proporciona métodos para actualizar diferentes partes del estado,
 * como datos de la solicitud, listas de terceros relacionados,
 * configuraciones de tablas y pestañas activas.
 */
@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'tramite260603', resettable: true })
/**
 * @class Tramite260603Store
 * @description
 * Tienda que gestiona el estado del trámite 260603.
 */
export class Tramite260603Store extends Store<Tramite260603State> {
  /** Inicializa el estado con los valores predeterminados. */
  constructor() {
    /**
     * Inicializa la tienda con el estado inicial del trámite 260603.
     */
    super(createInitialState());
  }

  /** Actualiza el formulario de datos de la solicitud. */
  public updateDatosSolicitudFormState(
    datosSolicitudFormState: DatosSolicitudFormState
  ): void {
    this.update((state) => ({
      ...state,
      datosSolicitudFormState,
    }));
  }

  /** Agrega fabricantes a la lista existente. */
  public updateFabricanteTablaDatos(newFabricantes: Fabricante[]): void {
    this.update((state) => ({
      ...state,
      fabricanteTablaDatos: [...state.fabricanteTablaDatos, ...newFabricantes],
    }));
  }

  /** Agrega destinatarios finales. */
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

  /** Agrega proveedores. */
  public updateProveedorTablaDatos(newProveedores: Proveedor[]): void {
    this.update((state) => ({
      ...state,
      proveedorTablaDatos: [...state.proveedorTablaDatos, ...newProveedores],
    }));
  }

  /** Agrega facturadores. */
  public updateFacturadorTablaDatos(newFacturadores: Facturador[]): void {
    this.update((state) => ({
      ...state,
      facturadorTablaDatos: [...state.facturadorTablaDatos, ...newFacturadores],
    }));
  }

  /** Actualiza configuración de opciones en la tabla. */
  public updateOpcionConfigDatos(opcionConfigDatos: TablaOpcionConfig[]): void {
    this.update((state) => ({
      ...state,
      opcionConfigDatos,
    }));
  }

  /** Actualiza configuración SCIAN. */
  public updateScianConfigDatos(scianConfigDatos: TablaScianConfig[]): void {
    this.update((state) => ({
      ...state,
      scianConfigDatos,
    }));
  }

  /** Actualiza configuración de mercancías. */
  public updateTablaMercanciasConfigDatos(
    tablaMercanciasConfigDatos: TablaMercanciasDatos[]
  ): void {
    this.update((state) => ({
      ...state,
      tablaMercanciasConfigDatos,
    }));
  }

  /** Cambia la pestaña activa. */
  public updateTabSeleccionado(tabSeleccionado: number): void {
    this.update((state) => ({
      ...state,
      tabSeleccionado,
    }));
  }

  /** Establece el ID de la solicitud. */
  public setIdSolicitud(idSolicitud: number): void {
    this.update((state) => ({
      ...state,
      idSolicitud,
    }));
  }

  /**
   * Restablece el estado de la tienda a su estado inicial.
   */
  resetStore(): void {
    this.reset();
  }
}
