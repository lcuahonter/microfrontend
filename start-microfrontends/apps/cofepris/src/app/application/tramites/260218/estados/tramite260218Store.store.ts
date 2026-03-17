import { DatosSolicitudFormState } from '../../../shared/models/datos-solicitud.model';
import { Destinatario } from '../../../shared/models/terceros-relacionados.model';
import { Fabricante } from '../../../shared/models/terceros-relacionados.model';
import { Facturador } from '../../../shared/models/terceros-relacionados.model';
import { Injectable } from '@angular/core';
import { MercanciaForm } from '../../../shared/models/datos-solicitud.model';
import { PRODUCTO_TABLA_DATA } from '../../../shared/constantes/datos-solicitud.enum';
import { PagoDerechosFormState } from '../../../shared/models/terceros-relacionados.model';
import { Proveedor } from '../../../shared/models/terceros-relacionados.model';
import { Store } from '@datorama/akita';
import { StoreConfig } from '@datorama/akita';
import { TABLA_OPCION_DATA } from '../../../shared/constantes/datos-solicitud.enum';
import { TablaMercanciasDatos } from '../../../shared/models/datos-solicitud.model';
import { TablaOpcionConfig } from '../../../shared/models/datos-solicitud.model';
import { TablaScianConfig } from '../../../shared/models/datos-solicitud.model';

/**
 * @interface Tramite260218State
 * Representa el estado completo de la solicitud para el trámite 260218.
 */
export interface Tramite260218State {

  /**
   * @property {number | null} idSolicitud
   * Identificador único de la solicitud asociada al trámite.
   */
  idSolicitud: number | null;

  /**
   * @property {Destinatario[]} destinatarioFinalTablaDatos
   * Lista de destinatarios finales asociados al trámite.
   */
  destinatarioFinalTablaDatos: Destinatario[];

  /**
   * @property {Facturador[]} facturadorTablaDatos
   * Lista de facturadores asociados al trámite.
   */
  facturadorTablaDatos: Facturador[];

  /**
   * @property {Proveedor[]} proveedorTablaDatos
   * Lista de proveedores asociados al trámite.
   */
  proveedorTablaDatos: Proveedor[];

  /**
   * @property {Fabricante[]} fabricanteTablaDatos
   * Lista de fabricantes asociados al trámite.
   */
  fabricanteTablaDatos: Fabricante[];

  /**
   * @property {DatosSolicitudFormState} datosSolicitudFormState
   * Estado del formulario de datos generales de la solicitud.
   */
  datosSolicitudFormState: DatosSolicitudFormState;

  /**
   * @property {MercanciaForm} mercanciaForm
   * Información relacionada con las mercancías del trámite.
   */
  mercanciaForm: MercanciaForm;

  /**
   * @property {TablaOpcionConfig[]} opcionConfigDatos
   * Configuración de las opciones seleccionables en la tabla de opciones.
   */
  opcionConfigDatos: TablaOpcionConfig[];

  /**
   * @property {TablaScianConfig[]} scianConfigDatos
   * Configuración de los datos relacionados con SCIAN (Sistema de Clasificación de Actividades Económicas).
   */
  scianConfigDatos: TablaScianConfig[];

  /**
   * @property {TablaMercanciasDatos[]} tablaMercanciasConfigDatos
   * Configuración de las mercancías en la tabla principal.
   */
  tablaMercanciasConfigDatos: TablaMercanciasDatos[];

  /**
   * @property {TablaOpcionConfig[]} seleccionadoopcionDatos
   * Opciones seleccionadas en la tabla de opciones.
   */
  seleccionadoopcionDatos: TablaOpcionConfig[];

  /**
   * @property {TablaScianConfig[]} seleccionadoScianDatos
   * Datos seleccionados de la tabla SCIAN.
   */
  seleccionadoScianDatos: TablaScianConfig[];

  /**
   * @property {TablaMercanciasDatos[]} seleccionadoTablaMercanciasDatos
   * Datos seleccionados de la tabla de mercancías.
   */
  seleccionadoTablaMercanciasDatos: TablaMercanciasDatos[];

  /**
   * @property {boolean} opcionesColapsableState
   * Estado de las opciones colapsables en la interfaz (expandido o colapsado).
   */
  opcionesColapsableState: boolean;

  /**
   * @property {PagoDerechosFormState} pagoDerechos
   * Información relacionada con el pago de derechos del trámite.
   */
  pagoDerechos: PagoDerechosFormState;

  /**
   * @property {number | undefined} tabSeleccionado
   * Índice de la pestaña seleccionada en la interfaz. Es opcional.
   */
  tabSeleccionado?: number;
}

// Función que inicializa el estado de la solicitud.
export function createInitialState(): Tramite260218State {
  return {
    idSolicitud: null, // Inicialmente no hay solicitud asociada.
    destinatarioFinalTablaDatos: [], // Lista vacía de destinatarios.
    facturadorTablaDatos: [], // Lista vacía de facturadores.
    proveedorTablaDatos: [], // Lista vacía de proveedores.
    fabricanteTablaDatos: [], // Lista vacía de fabricantes.
    datosSolicitudFormState: { // Datos iniciales del formulario de solicitud.
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
    mercanciaForm: { // Datos iniciales para la mercancía.
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
    opcionConfigDatos: TABLA_OPCION_DATA, // Datos iniciales de la tabla de opciones.
    scianConfigDatos: [], // Datos vacíos de la tabla SCIAN.
    tablaMercanciasConfigDatos: [], // Datos iniciales de las mercancías.
    seleccionadoopcionDatos: [], // Opciones seleccionadas vacías.
    seleccionadoScianDatos: [], // Datos seleccionados de SCIAN vacíos.
    seleccionadoTablaMercanciasDatos: [], // Datos seleccionados de mercancías vacíos.
    opcionesColapsableState: false, // Estado inicial de las opciones colapsables.
    pagoDerechos: { // Datos iniciales del pago de derechos.
      claveReferencia: '',
      cadenaDependencia: '',
      estado: '',
      llavePago: '',
      fechaPago: '',
      importePago: '',
    },
    tabSeleccionado: 1, // Pestaña seleccionada por defecto.
  };
}

@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite260218', resettable: true })
export class Tramite260218Store extends Store<Tramite260218State> {
  /**
   * @constructor
   * Inicializa el store `Tramite260218Store` con el estado inicial de la solicitud.
   */
  constructor() {
    super(createInitialState());
  }

  /**
   * @method updateDatosSolicitudFormState
   * @description Actualiza el estado del formulario de solicitud en el store.
   *
   * @param datosSolicitudFormState - Nuevo estado del formulario de solicitud.
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
   * @description Actualiza los datos de los fabricantes en el estado del store.
   * Agrega los nuevos fabricantes a la lista existente.
   *
   * @param newFabricantes - Lista de nuevos fabricantes a agregar.
   */
  public updateFabricanteTablaDatos(newFabricantes: Fabricante[]): void {
    this.update((state) => ({
      ...state,
      fabricanteTablaDatos: [...newFabricantes],
    }));
  }

  /**
   * @method updateDestinatarioFinalTablaDatos
   * @description Actualiza los datos de los destinatarios finales en el estado del store.
   * Agrega los nuevos destinatarios a la lista existente.
   *
   * @param newDestinatarios - Lista de nuevos destinatarios a agregar.
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
   * @description Actualiza los datos de los proveedores en el estado del store.
   * Agrega los nuevos proveedores a la lista existente.
   *
   * @param newProveedores - Lista de nuevos proveedores a agregar.
   */
  public updateProveedorTablaDatos(newProveedores: Proveedor[]): void {
    this.update((state) => ({
      ...state,
      proveedorTablaDatos: [...newProveedores],
    }));
  }

  /**
   * @method updateFacturadorTablaDatos
   * @description Actualiza los datos de los facturadores en el estado del store.
   * Agrega los nuevos facturadores a la lista existente.
   *
   * @param newFacturadores - Lista de nuevos facturadores a agregar.
   */
  public updateFacturadorTablaDatos(newFacturadores: Facturador[]): void {
    this.update((state) => ({
      ...state,
      facturadorTablaDatos: [...newFacturadores],
    }));
  }

  /**
   * @method updateOpcionConfigDatos
   * @description Actualiza los datos de configuración de las opciones en el estado del store.
   *
   * @param opcionConfigDatos - Nueva configuración de las opciones.
   */
  public updateOpcionConfigDatos(opcionConfigDatos: TablaOpcionConfig[]): void {
    this.update((state) => ({
      ...state,
      opcionConfigDatos,
    }));
  }

  /**
   * @method updateScianConfigDatos
   * @description Actualiza los datos de configuración de SCIAN en el estado del store.
   *
   * @param scianConfigDatos - Nueva configuración de SCIAN.
   */
  public updateScianConfigDatos(scianConfigDatos: TablaScianConfig[]): void {
    this.update((state) => ({
      ...state,
      scianConfigDatos,
    }));
  }

  /**
   * @method updateTablaMercanciasConfigDatos
   * @description Actualiza los datos de configuración de mercancías en el estado del store.
   *
   * @param tablaMercanciasConfigDatos - Nueva configuración de las mercancías.
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
   * @description Actualiza los datos de pago de derechos en el estado del store.
   *
   * @param nuevoPagoDerechos - Nuevos datos de pago de derechos.
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
