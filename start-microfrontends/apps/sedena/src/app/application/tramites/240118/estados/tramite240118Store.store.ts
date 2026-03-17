/**
 * @fileoverview Store de estado para el trámite 240118 - Solicitud de Permiso Extraordinario para la Exportación de Sustancias Químicas.
 * @description Gestión reactiva del estado usando Akita Store Pattern para mantener la información
 * del formulario multi-paso y datos relacionados del trámite de SEDENA.
 * @author VUCEM Development Team
 * @since 1.0.0
 * @version 1.0.0
 */

import { DatosDelTramiteFormState } from '../../../shared/models/datos-del-tramite.model';
import { DestinoFinal } from '../../../shared/models/terceros-relacionados.model';
import { Injectable } from '@angular/core';
import { MercanciaDetalle } from '../../../shared/models/datos-del-tramite.model';
import { PagoDerechosFormState } from '../../../shared/models/pago-de-derechos.model';
import { Proveedor } from '../../../shared/models/terceros-relacionados.model';
import { Store } from '@datorama/akita';
import { StoreConfig } from '@datorama/akita';

/**
 * @interface Tramite240118State
 * @description Representa el estado completo de la aplicación para el trámite 240118.
 * Contiene información sobre las pestañas seleccionadas, datos de destinatarios,
 * proveedores, pagos, mercancías y otros detalles relacionados con el trámite.
 * 
 * Este estado se estructura para manejar un formulario multi-paso donde cada sección
 * mantiene su propio estado independiente pero coordinado.
 *
 * @property {number} [tabSeleccionado] - Número de la pestaña actualmente seleccionada (1-3).
 * @property {DestinoFinal[]} destinatarioFinalTablaDatos - Lista de datos de destinatarios finales registrados.
 * @property {Proveedor[]} proveedorTablaDatos - Lista de datos de proveedores registrados.
 * @property {PagoDerechosFormState} pagoDerechos - Información del formulario de pago de derechos.
 * @property {MercanciaDetalle[]} merccancialTablaDatos - Lista de detalles de mercancías a exportar.
 * @property {DatosDelTramiteFormState} datosDelTramite - Información del formulario principal de datos del trámite.
 * @property {DestinoFinal | null} [modificarDestinarioDatos] - Datos del destinatario en modo edición (opcional).
 * @property {Proveedor | null} [modificarProveedorDatos] - Datos del proveedor en modo edición (opcional).
 * @property {MercanciaDetalle | null} [modificarMercanciasDatos] - Datos de mercancía en modo edición (opcional).
 * 
 * @example
 * ```typescript
 * // Ejemplo de estado típico
 * const estado: Tramite240118State = {
 *   tabSeleccionado: 1,
 *   destinatarioFinalTablaDatos: [],
 *   proveedorTablaDatos: [],
 *   pagoDerechos: { claveReferencia: '123456', banco: 'BBVA' },
 *   merccancialTablaDatos: [],
 *   datosDelTramite: { permisoGeneral: 'PG001', paisDestino: 'USA' }
 * };
 * ```
 * 
 * @since 1.0.0
 */
export interface Tramite240118State {
  /** Pestaña actualmente seleccionada en la navegación del trámite */
  tabSeleccionado?: number;
  /** Listado de destinatarios finales agregados al trámite */
  destinatarioFinalTablaDatos: DestinoFinal[];
  /** Listado de proveedores agregados al trámite */
  proveedorTablaDatos: Proveedor[];
  /** Estado del formulario de pago de derechos */
  pagoDerechos: PagoDerechosFormState;
  /** Listado de mercancías con sus detalles para exportación */
  merccancialTablaDatos: MercanciaDetalle[];
  /** Estado del formulario principal de datos del trámite */
  datosDelTramite: DatosDelTramiteFormState;
  /** Datos del destinatario seleccionado para modificación */
  modificarDestinarioDatos?: DestinoFinal | null;
  /** Datos del proveedor seleccionado para modificación */
  modificarProveedorDatos?: Proveedor | null;
  /** Datos de la mercancía seleccionada para modificación */
  modificarMercanciasDatos?: MercanciaDetalle | null;
}

/**
 * Crea y retorna el estado inicial para el trámite 240118.
 * Esta función inicializa todos los campos del estado con valores por defecto,
 * preparando el store para comenzar un nuevo trámite desde cero.
 * 
 * @returns El estado inicial del store con valores por defecto.
 * 
 * @example
 * ```typescript
 * const initialState = createInitialState();
 * console.log(initialState.tabSeleccionado); // 1
 * console.log(initialState.destinatarioFinalTablaDatos.length); // 0
 * ```
 * 
 * @since 1.0.0
 */
export function createInitialState(): Tramite240118State {
  return {
    tabSeleccionado: 1,
    destinatarioFinalTablaDatos: [],
    proveedorTablaDatos: [],
    pagoDerechos: {
      claveReferencia: '',
      cadenaDependencia: '',
      banco: '',
      llavePago: '',
      fechaPago: '',
      importePago: '',
    },
    merccancialTablaDatos: [],
    datosDelTramite: {
      permisoGeneral: '',
      usoFinal: '',
      aduanasSeleccionadas: [],
      paisDestino: '',
    },
  };
}

/**
 * @class Tramite240118Store
 * @extends Store<Tramite240118State>
 * @description Store principal que maneja el estado reactivo del trámite 240118.
 * Utiliza Akita Store Pattern para proporcionar gestión de estado inmutable y reactiva.
 * 
 * Esta clase centraliza todas las operaciones de estado para el trámite de solicitud
 * de permiso extraordinario para exportación de sustancias químicas de SEDENA.
 * Proporciona métodos para actualizar diferentes secciones del formulario y
 * mantener la sincronización entre componentes.
 * 
 * @example
 * ```typescript
 * // Inyectar en un componente
 * constructor(private tramiteStore: Tramite240118Store) {}
 * 
 * // Actualizar tab seleccionado
 * this.tramiteStore.updateTabSeleccionado(2);
 * 
 * // Agregar nuevo proveedor
 * this.tramiteStore.updateProveedorTablaDatos([nuevoProveedor]);
 * ```
 * 
 * @injectable
 * @providedIn 'root'
 * @since 1.0.0
 * @author VUCEM Development Team
 * @version 1.0.0
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite240118', resettable: true })
export class Tramite240118Store extends Store<Tramite240118State> {
  /**
   * @constructor
   * @description Inicializa el store con el estado inicial del trámite 240118.
   * Configura Akita para permitir reset del estado cuando sea necesario.
   */
  constructor() {
    super(createInitialState());
  }

  /**
   * Cambia la pestaña actualmente seleccionada.
   *
   * @method updateTabSeleccionado
   * @param {number} tabSeleccionado - Índice de la nueva pestaña seleccionada.
   * @returns {void}
   */
  public updateTabSeleccionado(tabSeleccionado: number): void {
    this.update((state) => ({
      ...state,
      tabSeleccionado: tabSeleccionado,
    }));
  }

  /**
   * Actualiza los datos generales del formulario de trámite.
   *
   * @method updateDatosDelTramiteFormState
   * @param {DatosDelTramiteFormState} datosDelTramiteFormState - Estado actualizado del formulario.
   * @returns {void}
   */
  public updateDatosDelTramiteFormState(
    datosDelTramiteFormState: DatosDelTramiteFormState
  ): void {
    this.update((state) => ({
      ...state,
      datosDelTramite: datosDelTramiteFormState,
    }));
  }

  /**
   * Actualiza los datos del formulario de pago de derechos.
   *
   * @method updatePagoDerechosFormState
   * @param {PagoDerechosFormState} pagoDerechosFormState - Estado actualizado del formulario de pago.
   * @returns {void}
   */
  public updatePagoDerechosFormState(
    pagoDerechosFormState: PagoDerechosFormState
  ): void {
    this.update((state) => ({
      ...state,
      pagoDerechos: pagoDerechosFormState,
    }));
  }

  /**
   * Agrega nuevos registros a la tabla de destinatarios finales.
   *
   * @method updateDestinatarioFinalTablaDatos
   * @param {DestinoFinal[]} newDestinatarios - Nuevos destinatarios a agregar.
   * @returns {void}
   */
  public updateDestinatarioFinalTablaDatos(
    newDestinatarios: DestinoFinal[]
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
   * Agrega nuevos registros a la tabla de proveedores.
   *
   * @method updateProveedorTablaDatos
   * @param {Proveedor[]} newProveedores - Nuevos proveedores a agregar.
   * @returns {void}
   */
  public updateProveedorTablaDatos(newProveedores: Proveedor[]): void {
    this.update((state) => ({
      ...state,
      proveedorTablaDatos: [...state.proveedorTablaDatos, ...newProveedores],
    }));
  }

  /**
   * Agrega nuevos registros a la tabla de mercancías.
   *
   * @method updateMercanciaTablaDatos
   * @param {MercanciaDetalle[]} newMercancia - Nuevas mercancías a agregar.
   * @returns {void}
   */
  public updateMercanciaTablaDatos(newMercancia: MercanciaDetalle[]): void {
    this.update((state) => ({
      ...state,
      merccancialTablaDatos: [...state.merccancialTablaDatos, ...newMercancia],
    }));
  }

  /**
   * Actualiza el objeto de mercancía que se está modificando en el estado.
   *
   * @param {MercanciaDetalle} datos - Objeto de mercancía con los datos actualizados.
   */
  public actualizarMercancias(datos: MercanciaDetalle): void {
    this.update((state) => ({
      ...state,
      modificarMercanciasDatos: datos,
    }));
  }

  /**
   * Actualiza una mercancía existente en la lista de mercancías del estado,
   * reemplazando el elemento que coincide con el `tableIndex` del nuevo objeto proporcionado.
   * Después de la actualización, restablece el estado de modificación de mercancía a `null`.
   *
   * @param {MercanciaDetalle[]} datos - Arreglo que contiene la mercancía actualizada.
   */
  public actualizarMercanciasdatos(datos: MercanciaDetalle[]): void {
    this.update((state) => ({
      ...state,
      merccancialTablaDatos: state.merccancialTablaDatos.map((item) =>
        item.tableIndex === datos[0].tableIndex ? datos[0] : item
      ),
    }));
    this.setModificarMercanciasDatos(null);
  }

  /**
   * Establece el objeto de mercancía que se va a modificar en el estado.
   *
   * @param {MercanciaDetalle | null} mercancia - Objeto de mercancía a modificar o `null` para limpiar el estado.
   */
  public setModificarMercanciasDatos(mercancia: MercanciaDetalle | null): void {
    this.update((state) => ({
      ...state,
      modificarMercanciasDatos: mercancia,
    }));
  }

  /**
   * Reemplaza la lista completa de mercancías en el estado.
   *
   * @param {MercanciaDetalle[]} mercancias - Nueva lista de objetos de mercancía.
   */
  public setMercanciasDatosTabla(mercancias: MercanciaDetalle[]): void {
    this.update((state) => ({
      ...state,
      merccancialTablaDatos: [...mercancias],
    }));
  }

  /**
   * @method actualizarDatosDestinatario
   * @description Actualiza los datos de un destinatario final específico en el estado.
   * Establece el destinatario a modificar y limpia cualquier proveedor que esté
   * siendo modificado para evitar conflictos en la edición.
   * 
   * @param {DestinoFinal} datos - Datos completos del destinatario final a modificar.
   * @returns {void}
   * 
   * @example
   * ```typescript
   * const destinatario: DestinoFinal = {
   *   nombre: 'Empresa Destino S.A.',
   *   rfc: 'EDE123456789',
   *   direccion: 'Calle Principal 123'
   * };
   * this.tramiteStore.actualizarDatosDestinatario(destinatario);
   * ```
   * 
   * @since 1.0.0
   */
  public actualizarDatosDestinatario(datos: DestinoFinal): void {
    this.update((state) => ({
      ...state,
      modificarDestinarioDatos: datos,
      modificarProveedorDatos: null,
    }));
  }

  /**
   * Actualiza los datos de un proveedor específico.
   *
   * @method actualizarDatosProveedor
   * @param {Proveedor} datos - Datos del proveedor a modificar.
   * @returns {void}
   */
  public actualizarDatosProveedor(datos: Proveedor): void {
    this.update((state) => ({
      ...state,
      modificarProveedorDatos: datos,
      modificarDestinarioDatos: null,
    }));
  }
  /**
   * @method eliminarDestinatarioFinal
   * @description Elimina un destinatario específico de la tabla de destinatarios finales.
   * Busca el destinatario por coincidencia de propiedades y lo remueve del estado.
   * 
   * @param {DestinoFinal} destinatarioFinal - El destinatario que se eliminará de la tabla.
   * @returns {void}
   * 
   * @example
   * ```typescript
   * const destinatarioAEliminar: DestinoFinal = {
   *   id: 123,
   *   nombre: 'Empresa a eliminar'
   * };
   * this.tramiteStore.eliminarDestinatarioFinal(destinatarioAEliminar);
   * ```
   * 
   * @since 1.0.0
   */
  eliminarDestinatarioFinal(destinatarioFinal: DestinoFinal): void {
    this.update((state) => {
      const INDICE_A_ELIMINAR = state.destinatarioFinalTablaDatos.findIndex(
        (ele) =>
          Object.keys(destinatarioFinal).some(
            (key) =>
              destinatarioFinal[key as keyof DestinoFinal] ===
              ele[key as keyof DestinoFinal]
          )
      );

      if (INDICE_A_ELIMINAR !== -1) {
        state.destinatarioFinalTablaDatos.splice(INDICE_A_ELIMINAR, 1);
      }

      return {
        ...state,
        destinatarioFinalTablaDatos: [...state.destinatarioFinalTablaDatos],
      };
    });
  }

  /**
   * Elimina un Proveedor de la tabla de Proveedor.
   *
   * @param proveedorFinal - El Proveedor que se eliminará de la tabla de Proveedor.
   * @returns void
   */
  eliminareliminarProveedorFinal(proveedorFinal: Proveedor): void {
    this.update((state) => {
      const INDICE_A_ELIMINAR = state.proveedorTablaDatos.findIndex((ele) =>
        Object.keys(proveedorFinal).some(
          (key) =>
            proveedorFinal[key as keyof Proveedor] ===
            ele[key as keyof Proveedor]
        )
      );

      if (INDICE_A_ELIMINAR !== -1) {
        state.proveedorTablaDatos.splice(INDICE_A_ELIMINAR, 1);
      }

      return {
        ...state,
        proveedorTablaDatos: [...state.proveedorTablaDatos],
      };
    });
  }

  /**
   * Elimina una mercancía específica de la lista `merccancialTablaDatos` en el estado.
   *
   * @param datos Los detalles de la mercancía que se desea eliminar.
   *
   * @remarks
   * Esta función actualiza el estado filtrando la mercancía que coincida exactamente con todos los campos de `datos`.
   *
   * @example
   * eliminarMercancias({ id: 1, nombre: 'Producto A', cantidad: 10 });
   */
  eliminarMercancias(datos: MercanciaDetalle): void {
    this.update((state) => {
      const MERCANCIAS_ACTUALIZADAS = state.merccancialTablaDatos.filter(
        (ele) =>
          !Object.keys(datos).every(
            (key) =>
              datos[key as keyof MercanciaDetalle] ===
              ele[key as keyof MercanciaDetalle]
          )
      );
      return {
        ...state,
        merccancialTablaDatos: MERCANCIAS_ACTUALIZADAS,
      };
    });
  }

  /**
   * @method setState
   * @description Actualiza el estado completo del store con un nuevo estado.
   * Esta operación reemplaza todo el estado actual, útil para restaurar
   * un estado guardado o reinicializar completamente el trámite.
   * 
   * @param {Tramite240118State} newState - El nuevo estado completo que se establecerá en el store.
   * @returns {void}
   * 
   * @example
   * ```typescript
   * const nuevoEstado: Tramite240118State = {
   *   tabSeleccionado: 2,
   *   destinatarioFinalTablaDatos: [...],
   *   // ... resto del estado
   * };
   * this.tramiteStore.setState(nuevoEstado);
   * ```
   * 
   * @warning Esta operación reemplaza completamente el estado actual.
   * @since 1.0.0
   */
  public setState(newState: Tramite240118State): void {
    this.update(newState);
  }
}
