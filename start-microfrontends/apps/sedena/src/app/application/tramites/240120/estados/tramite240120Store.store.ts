import { DatosDelTramiteFormState } from '../../../shared/models/datos-del-tramite.model';
import { DestinoFinal } from '../../../shared/models/terceros-relacionados.model';
import { Injectable } from '@angular/core';
import { MercanciaDetalle } from '../../../shared/models/datos-del-tramite.model';
import { PagoDerechosFormState } from '../../../shared/models/pago-de-derechos.model';
import { Proveedor } from '../../../shared/models/terceros-relacionados.model';
import { Store } from '@datorama/akita';
import { StoreConfig } from '@datorama/akita';

/**
 * Interfaz que representa el estado completo del trámite 240120.
 *
 * @property {number} [tabSeleccionado] - Pestaña actualmente activa en el flujo.
 * @property {DestinoFinal[]} destinatarioFinalTablaDatos - Lista de destinatarios finales registrados.
 * @property {Proveedor[]} proveedorTablaDatos - Lista de proveedores registrados.
 * @property {PagoDerechosFormState} pagoDerechos - Información del formulario de pago de derechos.
 * @property {MercanciaDetalle[]} merccancialTablaDatos - Lista de mercancías registradas.
 * @property {DatosDelTramiteFormState} datosDelTramite - Información general del formulario de datos del trámite.
 * @property {DestinoFinal | null} [modificarDestinarioDatos] - Destinatario final que está siendo editado actualmente, o null si no hay ninguno.
 * @property {Proveedor | null} [modificarProveedorDatos] - Proveedor que está siendo editado actualmente, o null si no hay ninguno.
 * @property {MercanciaDetalle | null} [modificarMercanciasDatos] - Mercancía que está siendo editada actualmente, o null si no hay ninguna.
 */
export interface Tramite240120State {
  /** Pestaña actualmente activa en el flujo del trámite */
  tabSeleccionado?: number;
  /** Lista de destinatarios finales registrados */
  destinatarioFinalTablaDatos: DestinoFinal[];
  /** Lista de proveedores registrados */
  proveedorTablaDatos: Proveedor[];
  /** Información del formulario de pago de derechos */
  pagoDerechos: PagoDerechosFormState;
  /** Lista de mercancías registradas */
  merccancialTablaDatos: MercanciaDetalle[];
  /** Información general del formulario de datos del trámite */
  datosDelTramite: DatosDelTramiteFormState;
  /** Destinatario final que está siendo editado actualmente, o null si no hay ninguno */
  modificarDestinarioDatos?: DestinoFinal | null;
  /** Proveedor que está siendo editado actualmente, o null si no hay ninguno */
  modificarProveedorDatos?: Proveedor | null;
  /** Mercancía que está siendo editada actualmente, o null si no hay ninguna */
  modificarMercanciasDatos?: MercanciaDetalle | null;
}

/**
 * Crea el estado inicial para el trámite 240120.
 *
 * @function createInitialState
 * @returns {Tramite240120State} El estado inicial del store.
 */
export function createInitialState(): Tramite240120State {
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
 * Store que maneja el estado del trámite 240120.
 * Utiliza Akita para el control reactivo del estado y proporciona métodos para actualizar,
 * eliminar y modificar los datos de destinatarios finales, proveedores, mercancías y formularios asociados al trámite.
 *
 * Este store permite:
 * - Cambiar la pestaña seleccionada.
 * - Actualizar los datos generales del trámite y del pago de derechos.
 * - Agregar, actualizar y eliminar destinatarios finales y proveedores.
 * - Agregar y eliminar mercancías.
 * - Gestionar la edición de destinatarios y proveedores mediante propiedades auxiliares.
 * - Reemplazar listas completas de destinatarios o proveedores.
 *
 * @export
 * @class Tramite240120Store
 * @extends {Store<Tramite240120State>}
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite240120', resettable: true })
export class Tramite240120Store extends Store<Tramite240120State> {
  constructor() {
    super(createInitialState());
  }

  /**
   * Cambia la pestaña actualmente seleccionada.
   * @param {number} tabSeleccionado - Índice de la nueva pestaña seleccionada.
   */
  public updateTabSeleccionado(tabSeleccionado: number): void {
    this.update((state) => ({
      ...state,
      tabSeleccionado: tabSeleccionado,
    }));
  }

  /**
   * Actualiza los datos generales del formulario de trámite.
   * @param {DatosDelTramiteFormState} datosDelTramiteFormState - Estado actualizado del formulario.
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
   * @param {PagoDerechosFormState} pagoDerechosFormState - Estado actualizado del formulario de pago.
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
   * @param {DestinoFinal[]} newDestinatarios - Nuevos destinatarios a agregar.
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
   * @param {Proveedor[]} newProveedores - Nuevos proveedores a agregar.
   */
  public updateProveedorTablaDatos(newProveedores: Proveedor[]): void {
    this.update((state) => ({
      ...state,
      proveedorTablaDatos: [...state.proveedorTablaDatos, ...newProveedores],
    }));
  }

  /**
   * Agrega nuevos registros a la tabla de mercancías.
   * @param {MercanciaDetalle[]} newMercancia - Nuevas mercancías a agregar.
   */
  public updateMercanciaTablaDatos(newMercancia: MercanciaDetalle[]): void {
    this.update((state) => ({
      ...state,
      merccancialTablaDatos: [...state.merccancialTablaDatos, ...newMercancia],
    }));
  }

  /**
   * Actualiza los datos de un destinatario final específico para su edición.
   * También limpia el estado de edición de proveedor.
   * @param {DestinoFinal} datos - Datos del destinatario final a modificar.
   */
  public actualizarDatosDestinatario(datos: DestinoFinal): void {
    this.update((state) => ({
      ...state,
      modificarDestinarioDatos: datos,
      modificarProveedorDatos: null
    }));
  }

  /**
   * Actualiza los datos de un proveedor específico para su edición.
   * También limpia el estado de edición de destinatario.
   * @param {Proveedor} datos - Datos del proveedor a modificar.
   */
  public actualizarDatosProveedor(datos: Proveedor): void {
    this.update((state) => ({
      ...state,
      modificarProveedorDatos: datos,
      modificarDestinarioDatos: null
    }));
  }

  /**
   * Elimina un destinatario de la tabla de destinatarios.
   * @param {DestinoFinal} destinatarioFinal - El destinatario que se eliminará.
   */
  eliminarDestinatarioFinal(destinatarioFinal: DestinoFinal): void {
    this.update(state => {
      const DESTINATARIOS_ACTUALIZADOS = state.destinatarioFinalTablaDatos.filter(ele =>
        !Object.keys(destinatarioFinal).every(
          key => destinatarioFinal[key as keyof DestinoFinal] === ele[key as keyof DestinoFinal]
        )
      );
      return {
        ...state,
        destinatarioFinalTablaDatos: DESTINATARIOS_ACTUALIZADOS,
      };
    });
  }
    

   /**
   * Elimina uno o varios destinatarios de la tabla de destinatarios finales.
   *
   * @method eliminarDestinatarioMultiple
   * @description
   * Permite eliminar múltiples destinatarios finales del estado. La comparación para eliminar se realiza
   * preferentemente por la propiedad `tableindex` si está disponible en ambos objetos, de lo contrario,
   * se comparan todos los campos del objeto para determinar coincidencia.
   *
   * @param {DestinoFinal[] | DestinoFinal} destinatarioFinal - Uno o varios destinatarios a eliminar.
   * Puede ser un solo objeto o un arreglo de objetos `DestinoFinal`.
   *
   * @returns {void}
   */
  eliminarDestinatarioMultiple(destinatarioFinal: DestinoFinal[] | DestinoFinal): void {
    this.update(state => {
      const TO_DELETE_ARRAY: DestinoFinal[] = Array.isArray(destinatarioFinal) ? destinatarioFinal : [destinatarioFinal];
      const UPDATEDDESTINARIOS = state.destinatarioFinalTablaDatos.filter(itemState => {
        //Intenta encontrar una coincidencia en toDeleteArray
        const MATCH = TO_DELETE_ARRAY.find(itemToDelete => {
          // Preferir el índice de tabla si está disponible
          if (
            itemToDelete.tableindex !== undefined &&
            itemState.tableindex !== undefined
          ) {
            return itemToDelete.tableindex === itemState.tableindex;
          }
          // Por defecto: compara todas las claves
          return Object.keys(itemToDelete).every(
            key =>
              itemToDelete[key as keyof DestinoFinal] ===
              itemState[key as keyof DestinoFinal]
          );
        });
        // Mantener si no coincide para la eliminación
        return !MATCH;
      });
      return {
        ...state,
        destinatarioFinalTablaDatos: UPDATEDDESTINARIOS,
      };
    });
  }

     /**
   * Elimina un Proveedor de la tabla de Proveedor.
   *
   * @param proveedorFinal - El Proveedor que se eliminará de la tabla de Proveedor.
   * @returns void
   */
    eliminarProveedorFinal(proveedorFinal: Proveedor): void {
    this.update(state => {
      const PROVEEDORES_ACTUALIZADOS = state.proveedorTablaDatos.filter(ele =>
        !Object.keys(proveedorFinal).every(
          key => proveedorFinal[key as keyof Proveedor] === ele[key as keyof Proveedor]
        )
      );
      return {
        ...state,
        proveedorTablaDatos: PROVEEDORES_ACTUALIZADOS,
      };
    });
    }

    /**
   * Elimina múltiples mercancías de la lista merccancialTablaDatos comparando los objetos.
   *
   * @param {MercanciaDetalle[]} mercancias - Array de mercancías a eliminar.
   * @returns {void}
   */
  public eliminarMultiplesPorComparacion(mercancias: MercanciaDetalle[]): void {
    this.update(state => {
      const FILTERED_ARRAY = state.merccancialTablaDatos.filter(itemState =>
        !mercancias.some(itemToDelete =>
          Object.keys(itemToDelete).every(
            key => itemToDelete[key as keyof MercanciaDetalle] === itemState[key as keyof MercanciaDetalle]
          )
        )
      );
      return {
        ...state,
        merccancialTablaDatos: FILTERED_ARRAY,
      };
    });
  }
  /**
   * @method actualizaExistenteEnDestinatarioDatos
   * @description
   * Actualiza un destinatario existente en la lista de destinatarios finales, reemplazando el elemento que coincide con el `tableindex` del nuevo destinatario proporcionado.
   * Después de la actualización, restablece el estado de modificación del destinatario a `null`.
   *
   * @param {DestinoFinal[]} newDestinatarios - Arreglo que contiene el destinatario actualizado. Se utiliza el primer elemento para realizar la comparación y actualización.
   *
   * @returns {void}
   */
  public actualizaExistenteEnDestinatarioDatos(
    newDestinatarios: DestinoFinal[]
  ): void {
    this.update((state) => ({
      ...state,
      destinatarioFinalTablaDatos: state.destinatarioFinalTablaDatos.map(
        (item) => item.tableindex === newDestinatarios[0].tableindex
      ? newDestinatarios[0]
      : item
      ),
    }));
    this.setModificarDestinarioDatos(null);
  }
  /**
   * @method actualizaExistenteEnProveedorDatos
   * @description
   * Actualiza un proveedor existente en la lista de proveedores, reemplazando el elemento que coincide con el `tableIndex` del nuevo proveedor proporcionado.
   * Después de la actualización, restablece el estado de modificación del proveedor a `null`.
   *
   * @param {Proveedor[]} newProveedor - Arreglo que contiene el proveedor actualizado. Se utiliza el primer elemento para realizar la comparación y actualización.
   *
   * @returns {void}
   */
  public actualizaExistenteEnProveedorDatos(
    newProveedor: Proveedor[]
  ): void {
    this.update((state) => ({
      ...state,
      proveedorTablaDatos: state.proveedorTablaDatos.map(
        (item) => item.tableIndex === newProveedor[0].tableIndex
      ? newProveedor[0]
      : item
      ),
    }));
    this.setModificarProveedorDatos(null);
  }

  /**
   * Reemplaza la lista completa de destinatarios finales en el estado.
   *
   * @method setDestinatarioFinalTablaDatos
   * @param {DestinoFinal[]} destinatarios - Nueva lista de destinatarios finales.
   * @returns {void}
   */
  public setDestinatarioFinalTablaDatos(destinatarios: DestinoFinal[]): void {
    this.update(state => ({
      ...state,
      destinatarioFinalTablaDatos: [...destinatarios],
    }));
  }

  /**
   * Reemplaza la lista completa de proveedores en el estado.
   *
   * @method setProveedorTablaDatos
   * @param {Proveedor[]} proveedor - Nueva lista de proveedores.
   * @returns {void}
   */
  public setProveedorTablaDatos(proveedor: Proveedor[]): void {
  this.update(state => ({
    ...state,
    proveedorTablaDatos: [...proveedor],
  }));
  }
  /**
   * Establece el valor de modificarDestinarioDatos en el estado.
   *
   * @param {DestinoFinal | null} destinatario - El destinatario a establecer o null.
   * @returns {void}
   */
  public setModificarDestinarioDatos(destinatario: DestinoFinal | null): void {
    this.update(state => ({
      ...state,
      modificarDestinarioDatos: destinatario,
    }));
  }

    /**
   * Establece el valor de modificarProveedorDatos en el estado.
   *
   * @param {Proveedor | null} proveedor - El proveedor a establecer o null.
   * @returns {void}
   */
    public setModificarProveedorDatos(proveedor: Proveedor | null): void {
    this.update(state => ({
      ...state,
      modificarProveedorDatos: proveedor,
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
      merccancialTablaDatos: state.merccancialTablaDatos.map(
        (item) => item.tableIndex === datos[0].tableIndex
          ? datos[0]
          : item
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
    this.update(state => ({
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
    this.update(state => ({
      ...state,
      merccancialTablaDatos: [...mercancias],
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
