import { DatosDelTramiteFormState, MercanciaDetalle } from '../../../shared/models/datos-del-tramite.model';
import { DestinoFinal, Proveedor } from '../../../shared/models/terceros-relacionados.model';
import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { PagoDerechosFormState } from '../../../shared/models/pago-de-derechos.model';

/**
 * Estado de la gestión del trámite 240105.
 */
export interface Tramite240105State {
   idSolicitud?: number;    
  /**
   * Número del tab actualmente seleccionado en la interfaz de usuario.
   */
  tabSeleccionado?: number;

  /**
   * Lista de destinatarios finales mostrados en la tabla.
   */
  destinatarioFinalTablaDatos: DestinoFinal[];

  /**
   * Lista de proveedores mostrados en la tabla.
   */
  proveedorTablaDatos: Proveedor[];

  /**
   * Información del formulario de pago de derechos.
   */
  pagoDerechos: PagoDerechosFormState;

  /**
   * Lista de mercancías detalladas en la tabla.
   */
  merccancialTablaDatos: MercanciaDetalle[];

  /**
   * Información general del trámite capturada en el formulario.
   */
  datosDelTramite: DatosDelTramiteFormState;

  /**
   * Objeto de destinatario que se está modificando actualmente (si aplica).
   */
  modificarDestinarioDatos?: DestinoFinal | null;

  /**
   * Objeto de proveedor que se está modificando actualmente (si aplica).
   */
  modificarProveedorDatos?: Proveedor | null;
}

/**
 * Crea el estado inicial para el trámite 240101.
 *
 * @function createInitialState
 * @returns {Tramite240105State} El estado inicial del store.
 */
export function createInitialState(): Tramite240105State {
  return {
    idSolicitud: undefined, 
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
 * Store que maneja el estado del trámite 240105.
 * Utiliza Akita para el control reactivo del estado.
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite240105', resettable: true })
export class Tramite240105Store extends Store<Tramite240105State> {
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
    this.update((state) => {

      const EXISTING_LIST = state.destinatarioFinalTablaDatos;

      const UPDATED_LIST = [...EXISTING_LIST];

      for (const NEW_DEST of newDestinatarios) {
        const INDEX = EXISTING_LIST.findIndex(
          (existing) => existing.id === NEW_DEST.id
        );

        if (INDEX !== -1) {
          UPDATED_LIST[INDEX] = NEW_DEST;
        } else {
          UPDATED_LIST.push(NEW_DEST);
        }
      }

      return {
        ...state,
        destinatarioFinalTablaDatos: UPDATED_LIST,
        modificarDestinarioDatos: null
      };
    });
  }


  /**
   * Agrega nuevos registros a la tabla de proveedores.
   *
   * @method updateProveedorTablaDatos
   * @param {Proveedor[]} newProveedores - Nuevos proveedores a agregar.
   * @returns {void}
   */
  public updateProveedorTablaDatos(newProveedores: Proveedor[]): void {
    this.update((state) => {

      const EXISTING_LIST = state.proveedorTablaDatos;

      const UPDATED_LIST = [...EXISTING_LIST];

      for (const NEW_DEST of newProveedores) {
        const INDEX = EXISTING_LIST.findIndex(
          (existing) => existing.id === NEW_DEST.id
        );

        if (INDEX !== -1) {
          UPDATED_LIST[INDEX] = NEW_DEST;
        } else {
          UPDATED_LIST.push(NEW_DEST);
        }
      }

      return {
        ...state,
        proveedorTablaDatos: UPDATED_LIST,
        modificarProveedorDatos: null
      };
    });
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

  /**
 * Elimina un destinatario de la tabla de destinatarios.
 *
 * @param destinatarioFinal - El destinatario que se eliminará de la tabla de destinatarios.
 * @returns void
 */
  eliminarDestinatarioFinal(destinatarioFinal: DestinoFinal): void {
    this.update(state => {
      const INDICE_A_ELIMINAR = state.destinatarioFinalTablaDatos.findIndex(ele =>
        Object.keys(destinatarioFinal).some(key => destinatarioFinal[key as keyof DestinoFinal] === ele[key as keyof DestinoFinal])
      );

      if (INDICE_A_ELIMINAR !== -1) {
        state.destinatarioFinalTablaDatos.splice(INDICE_A_ELIMINAR, 1);
      }

      return {
        ...state,
        destinatarioFinalTablaDatos: [...state.destinatarioFinalTablaDatos],
        modificarDestinarioDatos: null
      };
    });
  }
  
  /**
 * Actualiza el estado con los datos del proveedor proporcionados y limpia los datos del destinatario.
 * 
 * Esta función se utiliza para establecer nuevos datos del proveedor (`modificarProveedorDatos`)
 * en el estado del store, asegurando que los datos del destinatario se reinicien a `null`.
 *
 * @param {Proveedor} datos - Objeto con la información actualizada del proveedor.
 * @returns {void}
 */
  public actualizarDatosProveedor(datos: Proveedor): void {
    this.update((state) => ({
      ...state,
      modificarProveedorDatos: datos,
      modificarDestinarioDatos: null
    }));
  }

  /**
* Elimina un Proveedor de la tabla de Proveedor.
*
* @param proveedorFinal - El Proveedor que se eliminará de la tabla de Proveedor.
* @returns void
*/
  eliminareliminarProveedorFinal(proveedorFinal: Proveedor): void {
    this.update(state => {
      const INDICE_A_ELIMINAR = state.proveedorTablaDatos.findIndex(ele =>
        Object.keys(proveedorFinal).some(key => proveedorFinal[key as keyof Proveedor] === ele[key as keyof Proveedor])
      );

      if (INDICE_A_ELIMINAR !== -1) {
        state.proveedorTablaDatos.splice(INDICE_A_ELIMINAR, 1);
      }

      return {
        ...state,
        proveedorTablaDatos: [...state.proveedorTablaDatos],
        modificarProveedorDatos: null
      };
    });
  }
  
  /**
 * Actualiza el estado con los datos del destinatario proporcionados y limpia los datos del proveedor.
 * 
 * Esta función se utiliza para establecer nuevos datos del destinatario (`modificarDestinarioDatos`)
 * en el estado del store, asegurando que los datos del proveedor se reinicien a `null`.
 *
 * @param {DestinoFinal} datos - Objeto con la información actualizada del destinatario.
 * @returns {void}
 */
  public actualizarDatosDestinatario(datos: DestinoFinal): void {
    this.update((state) => ({
      ...state,
      modificarDestinarioDatos: datos,
      modificarProveedorDatos: null
    }));
  }

  /**
   * Limpia los datos de terceros del store de trámite.
   */
  public clearTercerosDatos(): void {
    this.update((state) => {
      return {
        ...state,
        modificarDestinarioDatos: null,
        modificarProveedorDatos: null,
      };
    });

  }

  /**
 * Actualiza parcialmente el estado del trámite.
 * 
 * Fusiona el estado actual con los nuevos valores proporcionados,
 * permitiendo modificar solo las propiedades necesarias sin afectar
 * el resto del estado almacenado.
 *
 * @param partial - Objeto con los campos del estado que se desean actualizar.
 */
 public updateState(
    partial: Partial<Tramite240105State>
  ): void {
    this.update((state) => ({
      ...state,
      ...partial,
    }));
  }
}

