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
 * @name Tramite260216State
 * @description
 * Representa el estado de la tienda para el trámite 260216. Contiene datos relacionados
 * con destinatarios, facturadores, proveedores, fabricantes, formularios y configuraciones.
 *
 * @property {Destinatario[]} destinatarioFinalTablaDatos
 * Lista de destinatarios finales asociados al trámite.
 *
 * @property {Facturador[]} facturadorTablaDatos
 * Lista de facturadores asociados al trámite.
 *
 * @property {Proveedor[]} proveedorTablaDatos
 * Lista de proveedores asociados al trámite.
 *
 * @property {Fabricante[]} fabricanteTablaDatos
 * Lista de fabricantes asociados al trámite.
 *
 * @property {DatosSolicitudFormState} datosSolicitudFormState
 * Estado del formulario de datos de la solicitud.
 *
 * @property {MercanciaForm} mercanciaForm
 * Estado del formulario de mercancías.
 *
 * @property {TablaOpcionConfig[]} opcionConfigDatos
 * Configuración de opciones de la tabla.
 *
 * @property {TablaScianConfig[]} scianConfigDatos
 * Configuración de SCIAN en la tabla.
 *
 * @property {TablaMercanciasDatos[]} tablaMercanciasConfigDatos
 * Configuración de la tabla de mercancías.
 *
 * @property {TablaOpcionConfig[]} seleccionadoopcionDatos
 * Opciones seleccionadas en la tabla de opciones.
 *
 * @property {TablaScianConfig[]} seleccionadoScianDatos
 * Opciones seleccionadas en la tabla de SCIAN.
 *
 * @property {TablaMercanciasDatos[]} seleccionadoTablaMercanciasDatos
 * Mercancías seleccionadas en la tabla de mercancías.
 *
 * @property {boolean} opcionesColapsableState
 * Estado de colapsabilidad de las opciones.
 *
 * @property {PagoDerechosFormState} pagoDerechos
 * Estado del formulario de pago de derechos.
 *
 * @property {number | undefined} tabSeleccionado
 * Índice de la pestaña seleccionada.
 */
export interface Tramite260216State {
   idSolicitud: number;
  /**
   * Lista de destinatarios finales asociados al trámite.
   */
  destinatarioFinalTablaDatos: Destinatario[];

  /**
   * Lista de facturadores asociados al trámite.
   */
  facturadorTablaDatos: Facturador[];

  /**
   * Lista de proveedores asociados al trámite.
   */
  proveedorTablaDatos: Proveedor[];

  /**
   * Lista de fabricantes asociados al trámite.
   */
  fabricanteTablaDatos: Fabricante[];

  /**
   * Estado del formulario de datos de la solicitud.
   */
  datosSolicitudFormState: DatosSolicitudFormState;

  /**
   * Estado del formulario de mercancías.
   */
  mercanciaForm: MercanciaForm;

  /**
   * Configuración de opciones de la tabla.
   */
  opcionConfigDatos: TablaOpcionConfig[];

  /**
   * Configuración de SCIAN en la tabla.
   */
  scianConfigDatos: TablaScianConfig[];

  /**
   * Configuración de la tabla de mercancías.
   */
  tablaMercanciasConfigDatos: TablaMercanciasDatos[];

  /**
   * Opciones seleccionadas en la tabla de opciones.
   */
  seleccionadoopcionDatos: TablaOpcionConfig[];

  /**
   * Opciones seleccionadas en la tabla de SCIAN.
   */
  seleccionadoScianDatos: TablaScianConfig[];

  /**
   * Mercancías seleccionadas en la tabla de mercancías.
   */
  seleccionadoTablaMercanciasDatos: TablaMercanciasDatos[];

  /**
   * Estado de colapsabilidad de las opciones.
   */
  opcionesColapsableState: boolean;

  /**
   * Estado del formulario de pago de derechos.
   */
  pagoDerechos: PagoDerechosFormState;

  /**
   * Índice de la pestaña seleccionada.
   */
  tabSeleccionado?: number;
}

/**
 * @function
 * @name createInitialState
 * @description
 * Crea el estado inicial para la tienda del trámite 260216. Este estado inicializa todas las propiedades necesarias
 * para gestionar los datos relacionados con el trámite, incluyendo destinatarios, facturadores, proveedores, fabricantes,
 * formularios, configuraciones de tablas y más.
 *
 * @returns {Tramite260216State} Estado inicial del trámite 260216.
 *
 * @example
 * ```typescript
 * const initialState = createInitialState();
 * console.log(initialState.destinatarioFinalTablaDatos); // []
 * ```
 */
export function createInitialState(): Tramite260216State {
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
 * @decorator
 * @name Injectable
 * @description
 * Marca la clase `Tramite260216Store` como un servicio inyectable en Angular.
 * Esto permite que el servicio sea proporcionado en el nivel raíz del módulo,
 * asegurando que haya una única instancia compartida en toda la aplicación.
 *
 * @providedIn 'root'
 * Indica que el servicio está disponible en el nivel raíz del módulo,
 * lo que significa que puede ser inyectado en cualquier parte de la aplicación.
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite260216', resettable: true })
/**
 * @class
 * @name Tramite260216Store
 * @description
 * Tienda para manejar el estado del trámite 260216. Proporciona métodos para actualizar
 * diferentes partes del estado.
 * @extends {Store<Tramite260216State>}
 */
export class Tramite260216Store extends Store<Tramite260216State> {
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
      this.update((state) => {
        const ACTUALIZADA = [...state.fabricanteTablaDatos];
  
        newFabricantes.forEach((nuevo) => {
          if (!nuevo?.id) {
            nuevo.id =
              ACTUALIZADA.length > 0
                ? Math.max(...ACTUALIZADA.map((f) => f.id ?? 0)) + 1
                : 1;
          }
  
          const INDICE = ACTUALIZADA.findIndex((f) => f.id === nuevo.id);
  
          if (INDICE > -1) {
            ACTUALIZADA[INDICE] = { ...ACTUALIZADA[INDICE], ...nuevo };
          } else {
            ACTUALIZADA.push(nuevo);
          }
        });
  
        return {
          ...state,
          fabricanteTablaDatos: ACTUALIZADA,
        };
      });
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
      proveedorTablaDatos: [
        ...newProveedores
      ],
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
      facturadorTablaDatos: [
        ...newFacturadores
      ],
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
      seleccionadoTablaMercanciasDatos: []
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
