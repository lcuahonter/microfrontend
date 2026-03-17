import { DatosSolicitudFormState, MercanciaForm, TablaMercanciasDatos, TablaOpcionConfig, TablaScianConfig } from '../../../shared/models/datos-solicitud.model';
import { Destinatario, Fabricante, Facturador, PagoDerechosFormState, Proveedor } from '../../../shared/models/terceros-relacionados.model';
import { Injectable } from '@angular/core';
import { Store } from '@datorama/akita';
import { StoreConfig } from '@datorama/akita';
import { TABLA_OPCION_DATA } from '../../../shared/constantes/datos-solicitud.enum';

/**
 * @interface
 * @name Tramite260910State
 * @description
 * Representa el estado de la tienda para el trámite 260910. Contiene datos relacionados
 * con destinatarios, facturadores, proveedores, fabricantes, formularios y configuraciones.
 */
export interface Tramite260910State {

  /**
   * Identificador de la solicitud (opcional).
  */
  idSolicitud: number;

  /**
   * Lista de destinatarios finales en la tabla de datos.
   */
  destinatarioFinalTablaDatos: Destinatario[];

  /**
   * Lista de facturadores en la tabla de datos.
   */
  facturadorTablaDatos: Facturador[];

  /**
   * Lista de proveedores en la tabla de datos.
   */
  proveedorTablaDatos: Proveedor[];

  /**
   * Lista de fabricantes en la tabla de datos.
   */
  fabricanteTablaDatos: Fabricante[];

  /**
   * Estado del formulario de datos de la solicitud.
   */
  datosSolicitudFormState: DatosSolicitudFormState;

  /**
   * Información del formulario de mercancías.
   */
  mercanciaForm: MercanciaForm;

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
   * Estado de colapsabilidad de las opciones.
   */
  opcionesColapsableState: boolean;

  /**
   * Estado del formulario de pago de derechos.
   */
  pagoDerechos: PagoDerechosFormState;

  /**
   * Identificador de la pestaña seleccionada (opcional).
   */
  tabSeleccionado?: number;
}

/**
 * @function
 * @name createInitialState
 * @description
 * Crea el estado inicial para la tienda del trámite 260910.
 * @returns {Tramite260910State} Estado inicial.
 */
export function createInitialState(): Tramite260910State {
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
@StoreConfig({ name: 'tramite260910', resettable: true })

/**
 * @class
 * @name Tramite260910Store
 * @description
 * Tienda para manejar el estado del trámite 260910. Proporciona métodos para actualizar
 * diferentes partes del estado.
 * @extends {Store<Tramite260910State>}
 */
export class Tramite260910Store extends Store<Tramite260910State> {
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
   * @description
   * Agrega nuevos fabricantes a la tabla de datos de fabricantes.
   *
   * @param {Fabricante[]} newFabricantes
   * Lista de nuevos fabricantes a agregar.
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
