import {
  DatosDelTramiteFormState,
  MercanciaDetalle
} from '../../../shared/models/datos-del-tramite.model';
import { DestinoFinal, Proveedor } from '../../../shared/models/terceros-relacionados.model';
import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';


/**
 * Representa el estado de la gestión para el trámite 240122.
 */
export interface Tramite240122State {
 /**
   * Índice de la pestaña actualmente seleccionada en la interfaz, si aplica.
   */
  tabSeleccionado?: number;
  /**
   * Lista de destinatarios finales mostrados en la tabla de datos.
   */
  destinatarioFinalTablaDatos: DestinoFinal[];
  /**
   * Lista de proveedores mostrados en la tabla de datos.
   */
  proveedorTablaDatos: Proveedor[];
  /**
   * Estado del formulario relacionado con el pago de derechos.
   */
  /**
   * Lista de detalles de mercancía mostrados en la tabla de datos.
   */
  merccancialTablaDatos: MercanciaDetalle[];
  /**
   * Estado del formulario con los datos generales del trámite.
   */
   /**
   * Estado del formulario con los datos generales del trámite.
   */
  datosDelTramite: DatosDelTramiteFormState;
  /**
   * Datos del destinatario final que se está modificando, o null si no hay ninguno.
   */
  modificarDestinarioDatos?: DestinoFinal | null;
  /**
   * Datos del proveedor que se está modificando, o null si no hay ninguno.
   */
  modificarProveedorDatos?: Proveedor | null;
}

/**
 * Crea el estado inicial para el trámite 240122.
 *
 * @function createInitialState
 * @returns {Tramite240122State} El estado inicial del store.
 */
export function createInitialState(): Tramite240122State {
  return {
    tabSeleccionado: 1,
    destinatarioFinalTablaDatos: [],
    proveedorTablaDatos: [],
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
 * Store que maneja el estado del trámite 240122.
 * Utiliza Akita para el control reactivo del estado.
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite240122', resettable: true })
export class Tramite240122Store extends Store<Tramite240122State> {
  /**
   * Constructor del store.
   * Inicializa el estado con los valores definidos en `createInitialState`.
   */
  constructor() {
    super(createInitialState());
  }

/**
 * Updates the currently selected tab index in the application state.
 *
 * This method triggers a state update to reflect the new tab selection,
 * which can be used to control tabbed navigation or UI rendering logic.
 *
 * @param {number} tabSeleccionado - The index of the tab to be selected.
 * @returns {void}
 *
 * @example
 * // Select the third tab (index 2)
 * this.updateTabSeleccionado(2);
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
   * Actualiza los datos del destinatario final en el estado.
   *
   * @method actualizarDatosDestinatario
   * @param {DestinoFinal} datos - Datos del destinatario final a modificar.
   * @returns {void}
   */
  public actualizarDatosDestinatario(datos: DestinoFinal): void {
    this.update((state) => ({
      ...state,
      modificarDestinarioDatos: datos,
      modificarProveedorDatos: null,
    }));
  }

  /**
   * Actualiza los datos del proveedor en el estado.
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
   * @method actualizarTrimateState
   * @description Actualiza el estado del trámite con los datos proporcionados.
   * @param {Tramite240122State} datos - Objeto que contiene las nuevas propiedades del estado a actualizar.
   * @returns {void}
   */
  public actualizarTrimateState(datos: Tramite240122State): void {
    this.update((state)=>({
      ...state,
      ...datos
    }))
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
    this.update(state => {
      const MERCANCIAS_ACTUALIZADAS = state.merccancialTablaDatos.filter(ele =>
        !Object.keys(datos).every(
          key => datos[key as keyof MercanciaDetalle] === ele[key as keyof MercanciaDetalle]
        )
      );
      return {
        ...state,
        merccancialTablaDatos: MERCANCIAS_ACTUALIZADAS,
      };
    });
  }
}
