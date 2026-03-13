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
 * @interface Tramite260604State
 * @description
 * Representa el estado completo utilizado para gestionar el trámite 260604.
 * Contiene información relacionada con destinatarios, proveedores, fabricantes,
 * facturadores, datos de la solicitud, mercancías, configuraciones de tablas,
 * opciones seleccionadas, estados colapsables y pestañas activas.
 */
export interface Tramite260604State {

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
 * Devuelve el estado inicial del trámite 260604.
 * Este estado se utiliza para inicializar la tienda y establecer valores por defecto
 * en listas, formularios y configuraciones.
 *
 * @returns {Tramite260604State} Estado inicial completo.
 */
/**
 * Crea y retorna el estado inicial del trámite 260604.
 *
 * @function createInitialState
 * @description
 * Este método genera un objeto con todos los valores por defecto
 * utilizados por el store del trámite 260604. Garantiza que todas las
 * propiedades estén definidas, evitando errores por valores undefined.
 *
 * @returns {Tramite260604State} Estado inicial completamente tipado.
 */
export function createInitialState(): Tramite260604State {
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
 * @class Tramite260604Store
 * @extends Store<Tramite260604State>
 * @description
 * Representa la tienda (store) que gestiona el estado del trámite 260604.
 * Permite actualizar diferentes secciones del estado: datos de solicitud,
 * tablas, configuraciones, IDs y opciones seleccionadas.
 */
@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'tramite260604', resettable: true })
export class Tramite260604Store extends Store<Tramite260604State> {

  /** Inicializa el estado con los valores predeterminados. */
  constructor() {
    super(createInitialState());
  }

  /** Actualiza el formulario de datos de la solicitud. */
  public updateDatosSolicitudFormState(datosSolicitudFormState: DatosSolicitudFormState): void {
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
  public updateDestinatarioFinalTablaDatos(newDestinatarios: Destinatario[]): void {
    this.update((state) => ({
      ...state,
      destinatarioFinalTablaDatos: [...state.destinatarioFinalTablaDatos, ...newDestinatarios],
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
  public updateTablaMercanciasConfigDatos(tablaMercanciasConfigDatos: TablaMercanciasDatos[]): void {
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
}
