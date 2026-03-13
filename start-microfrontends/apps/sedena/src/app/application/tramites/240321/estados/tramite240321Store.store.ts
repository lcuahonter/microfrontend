import { DatosDelTramiteFormState, JustificacionTramiteFormState } from '../../../shared/models/datos-del-tramite.model';
import { DestinoFinal } from '../../../shared/models/terceros-relacionados.model';
import { Injectable } from '@angular/core';
import { MercanciaDetalle } from '../../../shared/models/datos-del-tramite.model';
import { PagoDerechosFormState } from '../../../shared/models/pago-de-derechos.model';
import { Proveedor } from '../../../shared/models/terceros-relacionados.model';
import { Store } from '@datorama/akita';
import { StoreConfig } from '@datorama/akita';

/**
 * Representa el estado de la gestión para el trámite 240321.
 */
export interface Tramite240321State {
  idSolicitud?: number;
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
  pagoDerechos: PagoDerechosFormState;
  /**
   * Lista de detalles de mercancía mostrados en la tabla de datos.
   */
  merccancialTablaDatos: MercanciaDetalle[];
  /**
 * Estado del formulario con los datos generales del trámite.
 */
  datosDelTramite: DatosDelTramiteFormState;
  /**
   * Estado del formulario de justificación del trámite.
   */
  justificacionTramiteFormState: JustificacionTramiteFormState;
  /**
   * Folio asociado al estado del trámite.
   */
  folio: string;

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
 * Crea el estado inicial para el trámite 240321.
 *
 * @function createInitialState
 * @returns {Tramite240321State} El estado inicial del store.
 */
export function createInitialState(): Tramite240321State {
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
    justificacionTramiteFormState: {
      justificacion: ''
    },
    folio: '89900012344556787898'
  };
}

/**
 * Store que maneja el estado del trámite 240321.
 * Utiliza Akita para el control reactivo del estado.
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite240321', resettable: true })
export class Tramite240321Store extends Store<Tramite240321State> {
  constructor() {
    super(createInitialState());
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
   * @method updateJustificacionFormulario
   * @description Actualiza el estado del formulario de justificación del trámite.
   * Permite modificar los datos capturados en el formulario de justificación.
   * 
   * @param {JustificacionTramiteFormState} justificacionTramiteFormState - Estado actualizado del formulario de justificación.
   * @returns {void}
   */
  public updateJustificacionFormulario(
    justificacionTramiteFormState: JustificacionTramiteFormState
  ): void {
    this.update((state) => ({
      ...state,
      justificacionTramiteFormState: justificacionTramiteFormState,
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
  }/**
   * Actualiza un registro existente en la tabla de destinatarios finales.
   *
   * @method actualizaExistenteEnDestinatarioDatos
   * @param {DestinoFinal[]} newDestinatarios - Nuevos destinatarios a agregar.
   * @returns {void}
   */
  public actualizaExistenteEnDestinatarioDatos(
    newDestinatarios: DestinoFinal[]
  ): void {
    this.update((state) => ({
      ...state,
      destinatarioFinalTablaDatos: state.destinatarioFinalTablaDatos.map(
        (item) => item.codigoPostal === newDestinatarios[0].codigoPostal
          ? newDestinatarios[0]
          : item
      ),
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
   * Actualiza un registro existente en la tabla de proveedores.
   *
   * @method actualizaExistenteEnProveedorDatos
   * @param {Proveedor[]} newProveedores - Nuevos proveedores a agregar.
   * @returns {void}
   */

  public actualizaExistenteEnProveedorDatos(newProveedores: Proveedor[]): void {
    this.update((state) => ({
      ...state,
      proveedorTablaDatos: state.proveedorTablaDatos.map((item) =>
        item.numeroInterior === newProveedores[0].numeroInterior ? newProveedores[0] : item
      ),
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
   * Actualiza un registro existente en la tabla de mercancías.
   *
   * @method actualizaExistenteEnMercanciaDatos
   * @param {MercanciaDetalle[]} newMercancia - Nuevas mercancías a agregar.
   * @returns {void}
   */

  /**
   * Actualiza el valor del folio en el estado de la tienda.
   *
   * @param folio - El nuevo valor de folio a establecer.
   * @remarks
   * Utilice este método para cambiar el folio asociado al estado actual.
   */
  public updateFolio(folio: string): void {
    this.update((state) => ({
      ...state,
      folio: folio,
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
    partial: Partial<Tramite240321State>
  ): void {
    this.update((state) => ({
      ...state,
      ...partial,
    }));
  }

  /**
   * Actualiza el estado completo con un nuevo estado.
   * @param newState El nuevo estado a establecer.
   */
  public setState(newState: Tramite240321State): void {
    this.update(newState);
  }
}
