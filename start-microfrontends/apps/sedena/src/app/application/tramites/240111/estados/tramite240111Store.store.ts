import { DatosDelTramiteFormState } from '../../../shared/models/datos-del-tramite.model';
import { DestinoFinal } from '../../../shared/models/terceros-relacionados.model';
import { Injectable } from '@angular/core';
import { MercanciaDetalle } from '../../../shared/models/datos-del-tramite.model';
import { PagoDerechosFormState } from '../../../shared/models/pago-de-derechos.model';
import { Proveedor } from '../../../shared/models/terceros-relacionados.model';
import { Store } from '@datorama/akita';
import { StoreConfig } from '@datorama/akita';


/**
 * Interfaz que representa el estado completo del trámite 240111.
 *
 * @property {number} [tabSeleccionado] - Pestaña actualmente activa en el flujo.
 * @property {DestinoFinal[]} destinatarioFinalTablaDatos - Lista de destinatarios finales registrados.
 * @property {Proveedor[]} proveedorTablaDatos - Lista de proveedores registrados.
 * @property {PagoDerechosFormState} pagoDerechos - Información del formulario de pago de derechos.
 * @property {MercanciaDetalle[]} merccancialTablaDatos - Lista de mercancías registradas.
 * @property {DatosDelTramiteFormState} datosDelTramite - Información general del formulario de datos del trámite.
 */
export interface Tramite240111State {

  /**
   * @property {DestinoFinal | null} [modificarDestinarioDatos]
   * @description
   * Objeto con los datos del destinatario final que se está modificando, si aplica.
   * 
   * @remarks
   * Se usa para precargar los datos en el formulario de edición.
   * 
   * @example
   * modificarDestinarioDatos: { nombre: 'Empresa Z', direccion: 'Av. Reforma' }
   */
  modificarDestinarioDatos?: DestinoFinal | null;

  /**
   * @property {Proveedor | null} [modificarProveedorDatos]
   * @description
   * Objeto con los datos del proveedor que se está modificando, si aplica.
   * 
   * @remarks
   * Se utiliza cuando el usuario desea editar un proveedor existente.
   * 
   * @example
   * modificarProveedorDatos: { nombre: 'Proveedor A', pais: 'EE.UU.' }
   */
  modificarProveedorDatos?: Proveedor | null;

  /**
  * Identificador de la solicitud asociada al trámite.
  */
  idSolicitud?: number;

  /**
   * Índice de la pestaña actualmente seleccionada.
   */
  tabSeleccionado?: number;

  /**
   * Lista de destinatarios finales registrados en el trámite.
   */
  destinatarioFinalTablaDatos: DestinoFinal[];

  /**
   * Lista de proveedores registrados en el trámite.
   */
  proveedorTablaDatos: Proveedor[];

  /**
   * Información correspondiente al pago de derechos del trámite.
   */
  pagoDerechos: PagoDerechosFormState;

  /**
   * Lista de mercancías registradas en el trámite.
   */
  merccancialTablaDatos: MercanciaDetalle[];

  /**
   * Datos generales del trámite capturados en el formulario.
   */
  datosDelTramite: DatosDelTramiteFormState;

}

/**
 * Crea el estado inicial para el trámite 240111.
 *
 * @function createInitialState
 * @returns {Tramite240111State} El estado inicial del store.
 */
export function createInitialState(): Tramite240111State {
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
 * Store que maneja el estado del trámite 240111.
 * Utiliza Akita para el control reactivo del estado.
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite240111', resettable: true })
export class Tramite240111Store extends Store<Tramite240111State> {
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
 * Actualiza parcialmente el estado del trámite.
 * Combina el estado actual con las propiedades proporcionadas.
 *
 * @param partial Objeto con los valores del estado a actualizar.
 */
  public updateState(
    partial: Partial<Tramite240111State>
  ): void {
    this.update((state) => ({
      ...state,
      ...partial,
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
}
