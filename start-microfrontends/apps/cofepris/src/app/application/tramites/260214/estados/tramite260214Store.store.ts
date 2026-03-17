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
 * @interface Tramite260214State
 * @description
 * Representa el estado global del trámite `260214` en la aplicación.
 *
 * @property {Destinatario[]} destinatarioFinalTablaDatos
 * Lista de destinatarios finales relacionados con el trámite.
 *
 * @property {Facturador[]} facturadorTablaDatos
 * Lista de facturadores relacionados con el trámite.
 *
 * @property {Proveedor[]} proveedorTablaDatos
 * Lista de proveedores relacionados con el trámite.
 *
 * @property {Fabricante[]} fabricanteTablaDatos
 * Lista de fabricantes relacionados con el trámite.
 *
 * @property {DatosSolicitudFormState} datosSolicitudFormState
 * Estado del formulario de datos de la solicitud.
 *
 * @property {MercanciaForm} mercanciaForm
 * Información relacionada con las mercancías del trámite.
 *
 * @property {TablaOpcionConfig[]} opcionConfigDatos
 * Configuración de opciones de la tabla.
 *
 * @property {TablaScianConfig[]} scianConfigDatos
 * Configuración de datos de la tabla SCIAN.
 *
 * @property {TablaMercanciasDatos[]} tablaMercanciasConfigDatos
 * Configuración de datos de la tabla de mercancías.
 *
 * @property {TablaOpcionConfig[]} seleccionadoopcionDatos
 * Opciones seleccionadas en la tabla de opciones.
 *
 * @property {TablaScianConfig[]} seleccionadoScianDatos
 * Datos seleccionados en la tabla SCIAN.
 *
 * @property {TablaMercanciasDatos[]} seleccionadoTablaMercanciasDatos
 * Datos seleccionados en la tabla de mercancías.
 *
 * @property {boolean} opcionesColapsableState
 * Estado de colapsabilidad de las opciones.
 *
 * @property {PagoDerechosFormState} pagoDerechos
 * Información relacionada con el pago de derechos.
 *
 * @property {number} [tabSeleccionado]
 * Índice de la pestaña seleccionada en el flujo del trámite.
 */
export interface Tramite260214State {
  /**
   * Identificador de la solicitud (opcional).
  */
  idSolicitud: number;
  /**
   * Lista de destinatarios finales relacionados con el trámite.
   */
  destinatarioFinalTablaDatos: Destinatario[];

  /**
   * Lista de facturadores relacionados con el trámite.
   */
  facturadorTablaDatos: Facturador[];

  /**
   * Lista de proveedores relacionados con el trámite.
   */
  proveedorTablaDatos: Proveedor[];

  /**
   * Lista de fabricantes relacionados con el trámite.
   */
  fabricanteTablaDatos: Fabricante[];

  /**
   * Lista de destinatarios finales relacionados con el trámite.
   */
  destinatarioFinalTablaModificaDatos: Destinatario[];

  /**
   * Lista de facturadores relacionados con el trámite.
   */
  facturadorTablaModificaDatos: Facturador[];

  /**
   * Lista de proveedores relacionados con el trámite.
   */
  proveedorTablaModificaDatos: Proveedor[];

  /**
   * Lista de fabricantes relacionados con el trámite.
   */
  fabricanteTablaModificaDatos: Fabricante[];

  /**
   * Estado del formulario de datos de la solicitud.
   */
  datosSolicitudFormState: DatosSolicitudFormState;

  /**
   * Información relacionada con las mercancías del trámite.
   */
  mercanciaForm: MercanciaForm;

  /**
   * Configuración de opciones de la tabla.
   */
  opcionConfigDatos: TablaOpcionConfig[];

  /**
   * Configuración de datos de la tabla SCIAN.
   */
  scianConfigDatos: TablaScianConfig[];

  /**
   * Configuración de datos de la tabla de mercancías.
   */
  tablaMercanciasConfigDatos: TablaMercanciasDatos[];

  /**
   * Opciones seleccionadas en la tabla de opciones.
   */
  seleccionadoopcionDatos: TablaOpcionConfig[];

  /**
   * Datos seleccionados en la tabla SCIAN.
   */
  seleccionadoScianDatos: TablaScianConfig[];

  /**
   * Datos seleccionados en la tabla de mercancías.
   */
  seleccionadoTablaMercanciasDatos: TablaMercanciasDatos[];

  /**
   * Estado de colapsabilidad de las opciones.
   */
  opcionesColapsableState: boolean;

  /**
   * Información relacionada con el pago de derechos.
   */
  pagoDerechos: PagoDerechosFormState;

  /**
   * Índice de la pestaña seleccionada en el flujo del trámite.
   */
  tabSeleccionado?: number;
}

/**
 * Crea y retorna el estado inicial para el store de la funcionalidad Tramite260214.
 *
 * El estado inicial incluye valores por defecto para todos los campos de formularios, tablas,
 * opciones de configuración y estado de la interfaz de usuario relevantes para el flujo del trámite 260214.
 * Esta función se utiliza normalmente para inicializar el store o restablecerlo a su estado por defecto.
 *
 * @returns {Tramite260214State} El objeto de estado inicial para el store Tramite260214.
 */
export function createInitialState(): Tramite260214State {
  return {
    idSolicitud: 0,
    destinatarioFinalTablaDatos: [],
    facturadorTablaDatos: [],
    proveedorTablaDatos: [],
    fabricanteTablaDatos: [],
    destinatarioFinalTablaModificaDatos: [],
    facturadorTablaModificaDatos: [],
    proveedorTablaModificaDatos: [],
    fabricanteTablaModificaDatos: [],
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
      manifesto: false,
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
 * @class Tramite260214Store
 * @description
 * Clase que representa el estado global del trámite `260214` utilizando Akita Store.
 * Esta clase gestiona el estado de los datos relacionados con el trámite, incluyendo
 * destinatarios, fabricantes, proveedores, facturadores, mercancías, y más.
 *
 * @extends Store<Tramite260214State>
 * Extiende la clase `Store` de Akita para manejar el estado del trámite.
 *
 * @decorator Injectable
 * Marca la clase como un servicio inyectable en Angular.
 *
 * @decorator StoreConfig
 * Configura el nombre del store como `tramite260214` y permite que el estado sea reiniciable.
 *
 * @property {Tramite260214State} state
 * Representa el estado inicial del trámite, definido por la función `createInitialState`.
 *
 * @method updateDatosSolicitudFormState
 * Actualiza el estado del formulario de datos de la solicitud.
 *
 * @method updateFabricanteTablaDatos
 * Agrega nuevos fabricantes a la tabla de datos de fabricantes.
 *
 * @method updateDestinatarioFinalTablaDatos
 * Agrega nuevos destinatarios a la tabla de datos de destinatarios finales.
 *
 * @method updateProveedorTablaDatos
 * Agrega nuevos proveedores a la tabla de datos de proveedores.
 *
 * @method updateFacturadorTablaDatos
 * Agrega nuevos facturadores a la tabla de datos de facturadores.
 *
 * @method updateOpcionConfigDatos
 * Actualiza la configuración de opciones de la tabla.
 *
 * @method updateScianConfigDatos
 * Actualiza la configuración de datos de la tabla SCIAN.
 *
 * @method updateTablaMercanciasConfigDatos
 * Actualiza la configuración de datos de la tabla de mercancías.
 *
 * @method updatePagoDerechos
 * Actualiza los datos relacionados con el pago de derechos.
 *
 * @method updateTabSeleccionado
 * Actualiza el índice de la pestaña seleccionada en el estado.
 *
 * @example
 * // Crear una instancia del store
 * const store = new Tramite260214Store();
 *
 * // Actualizar el estado del formulario de datos de la solicitud
 * store.updateDatosSolicitudFormState({
 *   rfcSanitario: 'ABC123456789',
 *   denominacionRazon: 'Empresa Ejemplo',
 *   correoElectronico: 'ejemplo@correo.com',
 *   ...
 * });
 *
 * // Agregar un nuevo fabricante
 * store.updateFabricanteTablaDatos([{ nombre: 'Fabricante 1', direccion: 'Dirección 1' }]);
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite260214', resettable: true })
export class Tramite260214Store extends Store<Tramite260214State> {
  constructor() {
    super(createInitialState());
  }

  /**
   * @method updateDatosSolicitudFormState
   * @description
   * Actualiza el estado del formulario de datos de la solicitud.
   *
   * @param {DatosSolicitudFormState} datosSolicitudFormState
   * Objeto que contiene los datos actualizados del formulario de la solicitud.
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
   * @description
   * Agrega nuevos fabricantes a la tabla de datos de fabricantes.
   *
   * @param {Fabricante[]} newFabricantes
   * Lista de nuevos fabricantes a agregar.
   */
  public updateFabricanteTablaDatos(newFabricantes: Fabricante[]): void {
    this.update((state) => {
      return {
        ...state,
        fabricanteTablaDatos: newFabricantes,
      };
    });
  }

  /**
   * @method updateDestinatarioFinalTablaDatos
   * @description
   * Agrega nuevos destinatarios a la tabla de datos de destinatarios finales.
   *
   * @param {Destinatario[]} newDestinatarios
   * Lista de nuevos destinatarios a agregar.
   */
  public updateDestinatarioFinalTablaDatos(
    newDestinatarios: Destinatario[]
  ): void {
     this.update((state) => {
      return {
        ...state,
     destinatarioFinalTablaDatos: newDestinatarios,
      };
    });
  }

  /**
   * @method updateProveedorTablaDatos
   * @description
   * Agrega nuevos proveedores a la tabla de datos de proveedores.
   *
   * @param {Proveedor[]} newProveedores
   * Lista de nuevos proveedores a agregar.
   */
  public updateProveedorTablaDatos(newProveedores: Proveedor[]): void {
    this.update((state) => {
      return {
        ...state,
        proveedorTablaDatos: newProveedores,
      };
    });
  }

  /**
   * @method updateFacturadorTablaDatos
   * @description
   * Agrega nuevos facturadores a la tabla de datos de facturadores.
   *
   * @param {Facturador[]} newFacturadores
   * Lista de nuevos facturadores a agregar.
   */
  public updateFacturadorTablaDatos(newFacturadores: Facturador[]): void {
    this.update((state) => {
      return {
        ...state,
        facturadorTablaDatos: newFacturadores,
      };
    });
  }

  /**
   * @method updateOpcionConfigDatos
   * @description
   * Actualiza la configuración de opciones de la tabla.
   *
   * @param {TablaOpcionConfig[]} opcionConfigDatos
   * Lista de configuraciones de opciones a actualizar.
   */
  public updateOpcionConfigDatos(opcionConfigDatos: TablaOpcionConfig[]): void {
    this.update((state) => ({
      ...state,
      opcionConfigDatos,
    }));
  }

  /**
   * @method updateScianConfigDatos
   * @description
   * Actualiza la configuración de datos de la tabla SCIAN.
   *
   * @param {TablaScianConfig[]} scianConfigDatos
   * Lista de configuraciones SCIAN a actualizar.
   */
  public updateScianConfigDatos(scianConfigDatos: TablaScianConfig[]): void {
    this.update((state) => ({
      ...state,
      scianConfigDatos,
    }));
  }

  /**
   * @method updateTablaMercanciasConfigDatos
   * @description
   * Actualiza la configuración de datos de la tabla de mercancías.
   *
   * @param {TablaMercanciasDatos[]} tablaMercanciasConfigDatos
   * Lista de configuraciones de mercancías a actualizar.
   */
  public updateTablaMercanciasConfigDatos(
    tablaMercanciasConfigDatos: TablaMercanciasDatos[]
  ): void {
    this.update((state) => ({
      ...state,
      tablaMercanciasConfigDatos: tablaMercanciasConfigDatos,
      seleccionadoTablaMercanciasDatos: [],
    }));
  }

  /**
   * @method updatePagoDerechos
   * @description
   * Actualiza los datos relacionados con el pago de derechos.
   *
   * @param {PagoDerechosFormState} nuevoPagoDerechos
   * Objeto que contiene los datos actualizados del pago de derechos.
   */
  public updatePagoDerechos(nuevoPagoDerechos: PagoDerechosFormState): void {
    this.update((state) => ({
      ...state,
      pagoDerechos: nuevoPagoDerechos,
    }));
  }

  /**
   * @method updateTabSeleccionado
   * @description
   * Actualiza el índice de la pestaña seleccionada en el estado.
   *
   * @param {number} tabSeleccionado
   * Índice de la pestaña seleccionada.
   */
  public updateTabSeleccionado(tabSeleccionado: number): void {
    this.update((state) => ({
      ...state,
      tabSeleccionado: tabSeleccionado,
    }));
  }

  /**
   * @method facturadorTablaModificaDatos
   * @description
   * Modifica los datos seleccionados en la tabla de facturadores dentro del estado del trámite.
   * Reemplaza la lista actual por la nueva lista recibida.
   *
   * @param {Facturador[]} tabSeleccionado - Lista de facturadores seleccionados que se asignarán al estado.
   * @returns {void} Este método no retorna ningún valor.
   */
  public facturadorTablaModificaDatos(tabSeleccionado: Facturador[]): void {
    this.update((state) => ({
      ...state,
      facturadorTablaModificaDatos: tabSeleccionado,
    }));
  }

  /**
   * @method fabricanteTablaModificaDatos
   * @description
   * Actualiza los datos seleccionados en la tabla de fabricantes en el estado del trámite.
   * Sustituye el arreglo actual por el nuevo conjunto de fabricantes.
   *
   * @param {Fabricante[]} tabSeleccionado - Lista de fabricantes seleccionados que se asignarán al estado.
   * @returns {void} Este método no retorna ningún valor.
   */
  public fabricanteTablaModificaDatos(tabSeleccionado: Fabricante[]): void {
    this.update((state) => ({
      ...state,
      fabricanteTablaModificaDatos: tabSeleccionado,
    }));
  }

  /**
   * @method destinatarioFinalTablaModificaDatos
   * @description
   * Modifica los datos seleccionados en la tabla de destinatarios finales en el estado del trámite.
   * Reemplaza el contenido anterior con la nueva lista proporcionada.
   *
   * @param {Destinatario[]} tabSeleccionado - Lista de destinatarios finales seleccionados que se asignarán al estado.
   * @returns {void} Este método no retorna ningún valor.
   */
  public destinatarioFinalTablaModificaDatos(
    tabSeleccionado: Destinatario[]
  ): void {
    this.update((state) => ({
      ...state,
      destinatarioFinalTablaModificaDatos: tabSeleccionado,
    }));
  }

  /**
   * @method proveedorTablaModificaDatos
   * @description
   * Actualiza los datos seleccionados en la tabla de proveedores dentro del estado del trámite.
   * Sobrescribe la lista previa con los proveedores seleccionados.
   *
   * @param {Proveedor[]} tabSeleccionado - Lista de proveedores seleccionados que se asignarán al estado.
   * @returns {void} Este método no retorna ningún valor.
   */
  public proveedorTablaModificaDatos(tabSeleccionado: Proveedor[]): void {
    this.update((state) => ({
      ...state,
      proveedorTablaModificaDatos: tabSeleccionado,
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
