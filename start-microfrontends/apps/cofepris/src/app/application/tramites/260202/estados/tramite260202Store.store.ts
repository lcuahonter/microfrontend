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
 * @name Tramite260202State
 * @description
 * Representa el estado de la tienda para el trámite 260202. Contiene datos relacionados
 * con destinatarios, facturadores, proveedores, fabricantes, formularios y configuraciones.
 */
/**
 * Representa el estado de la gestión del trámite 260202.
 */
export interface Tramite260202State {
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
 * Crea el estado inicial para la gestión del trámite 260202.
 * 
 * Este método devuelve un objeto que representa el estado inicial de la aplicación
 * para el trámite específico. Incluye datos relacionados con destinatarios, facturadores,
 * proveedores, fabricantes, formularios de solicitud, mercancías, configuraciones de tablas,
 * opciones seleccionadas, estado de colapsables, información de pago de derechos y la pestaña seleccionada.
 * 
 * @returns {Tramite260202State} El estado inicial del trámite 260202.
 * 
 * Propiedades del estado inicial:
 * - `destinatarioFinalTablaDatos`: Lista inicial vacía para los datos de destinatarios finales.
 * - `facturadorTablaDatos`: Lista inicial vacía para los datos de facturadores.
 * - `proveedorTablaDatos`: Lista inicial vacía para los datos de proveedores.
 * - `fabricanteTablaDatos`: Lista inicial vacía para los datos de fabricantes.
 * - `datosSolicitudFormState`: Estado inicial del formulario de solicitud, incluyendo campos como RFC, denominación, correo electrónico, dirección, teléfono, aviso, licencia sanitaria, régimen, entre otros.
 * - `mercanciaForm`: Estado inicial del formulario de mercancías, con información sobre clasificación, denominación, tipo de producto, forma farmacéutica, estado físico, fracción arancelaria, cantidad, presentación, registro sanitario, fecha de caducidad, y países de origen y procedencia.
 * - `opcionConfigDatos`: Configuración inicial de opciones de tabla.
 * - `scianConfigDatos`: Configuración inicial vacía para datos SCIAN.
 * - `tablaMercanciasConfigDatos`: Configuración inicial vacía para la tabla de mercancías.
 * - `seleccionadoopcionDatos`: Lista inicial vacía para las opciones seleccionadas.
 * - `seleccionadoScianDatos`: Lista inicial vacía para los datos SCIAN seleccionados.
 * - `seleccionadoTablaMercanciasDatos`: Lista inicial vacía para los datos de la tabla de mercancías seleccionados.
 * - `opcionesColapsableState`: Estado inicial del colapsable, por defecto `false`.
 * - `pagoDerechos`: Información inicial de pago de derechos, incluyendo clave de referencia, cadena de dependencia, estado, llave de pago, fecha de pago e importe.
 * - `tabSeleccionado`: Pestaña inicial seleccionada, por defecto `1`.
 */
export function createInitialState(): Tramite260202State {
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
      especifique: '',
      especifiqueForma: '',
    },
    opcionConfigDatos: [],
    scianConfigDatos: [], // SCIAN_TABLA_DATA
    tablaMercanciasConfigDatos: [],
    seleccionadoopcionDatos: [],
    seleccionadoScianDatos: [],
    seleccionadoTablaMercanciasDatos: [],
    opcionesColapsableState: false,
    pagoDerechos: {
      claveReferencia: '',
      cadenaDependencia: '',
      banco: '',
      llavePago: '',
      fechaPago: '',
      importePago: '',
    },
    tabSeleccionado: 1,
  };
}

/**
 * @method updateScianConfigDatos
 * @description Actualiza la configuración de SCIAN en el estado.
 * SCIAN (Sistema de Clasificación Industrial de América del Norte) es utilizado para clasificar actividades económicas.
 * Este método permite modificar la configuración relacionada con SCIAN en el estado de la tienda.
 * 
 * @param {TablaScianConfig[]} scianConfigDatos - Nueva configuración de SCIAN que se aplicará al estado.
 * 
 * @example
 * ```typescript
 * const nuevaConfigScian: TablaScianConfig[] = [
 *   { id: 1, descripcion: 'Industria manufacturera' },
 *   { id: 2, descripcion: 'Comercio al por mayor' },
 * ];
 * store.updateScianConfigDatos(nuevaConfigScian);
 * ```
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite260202', resettable: true })
/**
 * @class Tramite260202Store
 * @description Clase que representa la tienda de estado para el trámite `260202`.
 * 
 * Esta clase extiende la funcionalidad de una tienda base (`Store`) y proporciona métodos
 * para actualizar diferentes partes del estado relacionado con el trámite `260202`.
 * 
 * @remarks
 * La clase Tramite260202Store es utilizada para gestionar el estado de la aplicación
 * en el contexto de los trámites específicos del módulo `260202`. Proporciona métodos
 * para actualizar formularios, tablas de datos y configuraciones relacionadas con el trámite.
 * 
 * @example
 * ```typescript
 * const store = new Tramite260202Store();
 * store.updateDatosSolicitudFormState(datosSolicitudFormState);
 * store.updateFabricanteTablaDatos(newFabricantes);
 * ```
 */
export class Tramite260202Store extends Store<Tramite260202State> {

  /**
   * Constructor de la clase `Tramite260202Store`.
   * 
   * Este constructor inicializa el estado inicial de la tienda utilizando la función `createInitialState`.
   * La clase extiende una clase base que probablemente maneja la lógica de estado o almacenamiento.
   * 
   * @remarks
   * Este constructor es fundamental para establecer el estado inicial de la aplicación
   * en el contexto de los trámites relacionados con el módulo `260202`.
   * 
   * @example
   * ```typescript
   * const store = new Tramite260202Store();
   * ```
   */
  constructor() {
    super(createInitialState());
  }
    /**
   * @método
   * @nombre establecerDatos
   * @descripción
   * Actualiza el estado con los valores proporcionados.
   *
   * @param {Partial<Tramite260202State>} values - Valores parciales para actualizar el estado.
   */
  public establecerDatos(values: Partial<Tramite260202State>): void {
    this.update((state) => ({
      ...state,
      ...values,
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
