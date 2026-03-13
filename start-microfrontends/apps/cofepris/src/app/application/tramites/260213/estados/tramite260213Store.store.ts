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
 * @interface Tramite260213State
 * @description Interfaz que define la estructura del estado
 * para el trámite 260213 dentro de la aplicación. Incluye
 * propiedades para almacenar datos de destinatarios, facturadores,
 * proveedores, fabricantes, mercancías, formularios y más.
 **/
export interface Tramite260213State {
    /** Identificador de la solicitud, puede ser nulo si aún no se ha creado. */
  idSolicitud: number;
  /**
   * @property destinatarioFinalTablaDatos
   * @description Arreglo de destinatarios finales para el trámite.
   * @type {Destinatario[]}
   */
  destinatarioFinalTablaDatos: Destinatario[];

  /**
   * @property facturadorTablaDatos
   * @description Arreglo de facturadores para el trámite.
   * @type {Facturador[]}
   */
  facturadorTablaDatos: Facturador[];

  /**
   * @property proveedorTablaDatos
   * @description Arreglo de proveedores para el trámite.
   * @type {Proveedor[]}
   */
  proveedorTablaDatos: Proveedor[];

  /**
   * @property fabricanteTablaDatos
   * @description Arreglo de fabricantes para el trámite.
   * @type {Fabricante[]}
   */
  fabricanteTablaDatos: Fabricante[];

  /**
   * @property datosSolicitudFormState
   * @description Estado del formulario de datos de la solicitud.
   * @type {DatosSolicitudFormState}
   */
  datosSolicitudFormState: DatosSolicitudFormState;

  /**
   * @property mercanciaForm
   * @description Objeto que define la estructura del formulario de mercancías.
   * @type {MercanciaForm}
   */
  mercanciaForm: MercanciaForm;

  /**
   * @property opcionConfigDatos
   * @description Configuración de opciones para la tabla de selección.
   * @type {TablaOpcionConfig[]}
   */
  opcionConfigDatos: TablaOpcionConfig[];

  /**
   * @property scianConfigDatos
   * @description Configuración de datos SCIAN para la tabla.
   * @type {TablaScianConfig[]}
   */
  scianConfigDatos: TablaScianConfig[];

  /**
   * @property tablaMercanciasConfigDatos
   * @description Configuración de datos de mercancías para la tabla.
   * @type {TablaMercanciasDatos[]}
   */
  tablaMercanciasConfigDatos: TablaMercanciasDatos[];

  /**
   * @property seleccionadoopcionDatos
   * @description Opciones seleccionadas en la tabla de opciones.
   * @type {TablaOpcionConfig[]}
   */
  seleccionadoopcionDatos: TablaOpcionConfig[];

  /**
   * @property seleccionadoScianDatos
   * @description Datos SCIAN seleccionados en la tabla.
   * @type {TablaScianConfig[]}
   */
  seleccionadoScianDatos: TablaScianConfig[];

  /**
   * @property seleccionadoTablaMercanciasDatos
   * @description Datos de mercancías seleccionadas en la tabla.
   * @type {TablaMercanciasDatos[]}
   */
  seleccionadoTablaMercanciasDatos: TablaMercanciasDatos[];

  /**
   * @property opcionesColapsableState
   * @description Indica si se encuentra colapsada la sección de opciones.
   * @type {boolean}
   */
  opcionesColapsableState: boolean;

  /**
   * @property pagoDerechos
   * @description Estado del formulario de pago de derechos.
   * @type {PagoDerechosFormState}
   */
  pagoDerechos: PagoDerechosFormState;

  /**
   * @property tabSeleccionado
   * @description Indica la pestaña seleccionada en la interfaz.
   * @type {number | undefined}
   */
  tabSeleccionado?: number;
}

/**
 * @function createInitialState
 * @description Crea y retorna el estado inicial del trámite 260213.
 * @returns {Tramite260213State} El estado inicial configurado.
 */
export function createInitialState(): Tramite260213State {
  return {
      /** Identificador de la solicitud, puede ser nulo si aún no se ha creado. */
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
    scianConfigDatos: [],
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


/**
 * @class Tramite260213Store
 * @description
 * Clase que extiende `Store` para administrar el estado de `Tramite260213State`.
 * Provee métodos para actualizar diferentes secciones del estado relacionado con el trámite 260213.
 *
 * @providedIn root
 * Este servicio está disponible en toda la aplicación a través del inyector raíz.
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite260214', resettable: true })
export class Tramite260213Store extends Store<Tramite260213State> {
  /**
   * @constructor
   * @description Inicializa la clase `Tramite260213Store` con
   * el estado inicial definido en `createInitialState()`.
   */
  constructor() {
    super(createInitialState());
  }

  /**
   * @method updateDatosSolicitudFormState
   * @description Actualiza el estado del formulario de datos de la solicitud.
   * @param {DatosSolicitudFormState} datosSolicitudFormState -
   * Objeto con los datos del formulario a actualizar.
   * @returns {void}
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
   * @description Agrega nuevos fabricantes al arreglo existente en el estado.
   * @param {Fabricante[]} newFabricantes - Lista de fabricantes que se añadirán.
   * @returns {void}
   */
  public updateFabricanteTablaDatos(newFabricantes: Fabricante[]): void {
    this.update((state) => ({
      ...state,
      fabricanteTablaDatos: [...state.fabricanteTablaDatos, ...newFabricantes],
    }));
  }

  /**
   * @method updateDestinatarioFinalTablaDatos
   * @description Agrega destinatarios finales al arreglo existente en el estado.
   * @param {Destinatario[]} newDestinatarios - Lista de destinatarios a añadir.
   * @returns {void}
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
   * @description Agrega proveedores al arreglo existente en el estado.
   * @param {Proveedor[]} newProveedores - Lista de proveedores a añadir.
   * @returns {void}
   */
  public updateProveedorTablaDatos(newProveedores: Proveedor[]): void {
    this.update((state) => ({
      ...state,
      proveedorTablaDatos: [...state.proveedorTablaDatos, ...newProveedores],
    }));
  }

  /**
   * @method updateFacturadorTablaDatos
   * @description Agrega facturadores al arreglo existente en el estado.
   * @param {Facturador[]} newFacturadores - Lista de facturadores a añadir.
   * @returns {void}
   */
  public updateFacturadorTablaDatos(newFacturadores: Facturador[]): void {
    this.update((state) => ({
      ...state,
      facturadorTablaDatos: [...state.facturadorTablaDatos, ...newFacturadores],
    }));
  }

  /**
   * @method updateOpcionConfigDatos
   * @description Actualiza la configuración de opciones para la tabla.
   * @param {TablaOpcionConfig[]} opcionConfigDatos - Nueva configuración de opciones.
   * @returns {void}
   */
  public updateOpcionConfigDatos(opcionConfigDatos: TablaOpcionConfig[]): void {
    this.update((state) => ({
      ...state,
      opcionConfigDatos,
    }));
  }

  /**
   * @method updateScianConfigDatos
   * @description Actualiza la configuración de datos SCIAN en el estado.
   * @param {TablaScianConfig[]} scianConfigDatos - Nuevos datos SCIAN.
   * @returns {void}
   */
  public updateScianConfigDatos(scianConfigDatos: TablaScianConfig[]): void {
    this.update((state) => ({
      ...state,
      scianConfigDatos,
    }));
  }

  /**
   * @method updateTablaMercanciasConfigDatos
   * @description Actualiza los datos de configuración de la tabla de mercancías.
   * @param {TablaMercanciasDatos[]} tablaMercanciasConfigDatos - Nueva configuración de mercancías.
   * @returns {void}
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
   * @description Actualiza el formulario de pago de derechos con los nuevos valores.
   * @param {PagoDerechosFormState} nuevoPagoDerechos - Objeto con datos de pago de derechos.
   * @returns {void}
   */
  public updatePagoDerechos(nuevoPagoDerechos: PagoDerechosFormState): void {
    this.update((state) => ({
      ...state,
      pagoDerechos: nuevoPagoDerechos,
    }));
  }

  /**
   * @method updateTabSeleccionado
   * @description Actualiza la pestaña seleccionada en la interfaz.
   * @param {number} tabSeleccionado - Número de la pestaña seleccionada.
   * @returns {void}
   */
  public updateTabSeleccionado(tabSeleccionado: number): void {
    this.update((state) => ({
      ...state,
      tabSeleccionado: tabSeleccionado,
    }));
  }
  
 /**
   * Actualiza el estado con el nuevo valor de `idSolicitud`.
   */
  setIdSolicitud(idSolicitud: number): void {
    this.update((state) => ({
      ...state,
      idSolicitud,
    }));
  }
}
