import { DatosDelTramiteFormState } from '../../../shared/models/datos-del-tramite.model';
import { DestinoFinal } from '../../../shared/models/terceros-relacionados.model';
import { Injectable } from '@angular/core';
import { MercanciaDetalle } from '../../../shared/models/datos-del-tramite.model';
import { PagoDerechosFormState } from '../../../shared/models/pago-de-derechos.model';
import { Proveedor } from '../../../shared/models/terceros-relacionados.model';
import { Store } from '@datorama/akita';
import { StoreConfig } from '@datorama/akita';

/**
 * @interface Tramite240114State
 * @description Representa el estado de la aplicación para el trámite 240114.
 * Contiene información sobre las pestañas seleccionadas, datos de destinatarios,
 * proveedores, pagos, mercancías y otros detalles relacionados con el trámite.
 *
 * @property {number} [tabSeleccionado] - Número de la pestaña actualmente seleccionada.
 * @property {DestinoFinal[]} destinatarioFinalTablaDatos - Lista de datos de destinatarios finales.
 * @property {Proveedor[]} proveedorTablaDatos - Lista de datos de proveedores.
 * @property {PagoDerechosFormState} pagoDerechos - Información del formulario de pago de derechos.
 * @property {MercanciaDetalle[]} merccancialTablaDatos - Lista de detalles de mercancías.
 * @property {DatosDelTramiteFormState} datosDelTramite - Información del formulario de datos del trámite.
 * @property {DestinoFinal | null} [modificarDestinarioDatos] - Datos del destinatario a modificar (opcional).
 * @property {Proveedor | null} [modificarProveedorDatos] - Datos del proveedor a modificar (opcional).
 *
 * @command Este estado se utiliza para gestionar y almacenar los datos relacionados con el trámite 240114.
 */
export interface Tramite240114State {
  tabSeleccionado?: number;
  destinatarioFinalTablaDatos: DestinoFinal[];
  proveedorTablaDatos: Proveedor[];
  pagoDerechos: PagoDerechosFormState;
  merccancialTablaDatos: MercanciaDetalle[];
  datosDelTramite: DatosDelTramiteFormState;
  modificarDestinarioDatos?: DestinoFinal | null;
  modificarProveedorDatos?: Proveedor | null;
  modificarMercanciasDatos?: MercanciaDetalle | null;
}

/**
 * Crea el estado inicial para el trámite 240114.
 *
 * @function createInitialState
 * @returns {Tramite240114State} El estado inicial del store.
 */
export function createInitialState(): Tramite240114State {
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
 * Store que maneja el estado del trámite 240114.
 * Utiliza Akita para el control reactivo del estado.
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite240114', resettable: true })
export class Tramite240114Store extends Store<Tramite240114State> {
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
   * Actualiza los datos de un destinatario final específico.
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
   * Elimina un destinatario de la tabla de destinatarios.
   *
   * @param destinatarioFinal - El destinatario que se eliminará de la tabla de destinatarios.
   * @returns void
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
   * Actualiza el estado del store con un nuevo estado.
   *
   * @param newState - El nuevo estado que se establecerá en el store.
   */
  public setState(newState: Tramite240114State): void {
    this.update(newState);
  }
}
