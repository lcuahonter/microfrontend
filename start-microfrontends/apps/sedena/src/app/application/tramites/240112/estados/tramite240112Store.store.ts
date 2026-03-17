import { DatosDelTramiteFormState } from '../../../shared/models/datos-del-tramite.model';
import { DestinoFinal } from '../../../shared/models/terceros-relacionados.model';
import { Injectable } from '@angular/core';
import { MercanciaDetalle } from '../../../shared/models/datos-del-tramite.model';
import { PagoDerechosFormState } from '../../../shared/models/pago-de-derechos.model';
import { Proveedor } from '../../../shared/models/terceros-relacionados.model';
import { Store } from '@datorama/akita';
import { StoreConfig } from '@datorama/akita';

/**
 * Interface que define la estructura del estado para el trámite 240112.
 * Centraliza la información sobre la pestaña activa, tablas de destinatarios, proveedores,
 * datos de pago y detalles generales del trámite.
 */
export interface Tramite240112State {
  /**
 * Identificador de la solicitud.
 * Se utiliza para consultar o actualizar
 * la información asociada al trámite.
 */
  idSolicitud?: number;
  /**
   * Índice de la pestaña actualmente seleccionada.
   * Puede ser indefinido al inicio.
   */
  tabSeleccionado?: number;

  /**
   * Arreglo con los datos de los destinatarios finales.
   */
  destinatarioFinalTablaDatos: DestinoFinal[];

  /**
   * Arreglo con los datos de proveedores asociados.
   */
  proveedorTablaDatos: Proveedor[];

  /**
   * Estado del formulario de pago de derechos.
   */
  pagoDerechos: PagoDerechosFormState;

  /**
  * Objeto de destinatario que se está modificando actualmente (si aplica).
  */
  modificarDestinarioDatos?: DestinoFinal | null;

  /**
   * Objeto de proveedor que se está modificando actualmente (si aplica).
   */
  modificarProveedorDatos?: Proveedor | null;

  /**
   * Arreglo con los detalles de la mercancía.
   */
  merccancialTablaDatos: MercanciaDetalle[];

  /**
  * Objeto de mercancía que se está modificando actualmente (si aplica).
  */
  modificarMercanciasDatos?: MercanciaDetalle | null;

  /**
   * Datos generales del trámite.
   */
  datosDelTramite: DatosDelTramiteFormState;
}

/**
 * Función que crea el estado inicial del store para el trámite 240112.
 * 
 * @returns {Tramite240112State} Estado inicial completo con valores por defecto.
 */
export function createInitialState(): Tramite240112State {
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
 * Store encargado de manejar el estado del trámite 240112.
 * Utiliza la librería Akita para la gestión reactiva y centralizada del estado.
 * 
 * @decorator Injectable - Permite la inyección del store como servicio singleton.
 * @decorator StoreConfig - Configura el nombre del store y habilita la función de reset.
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite240112', resettable: true })
export class Tramite240112Store extends Store<Tramite240112State> {

  /**
   * Constructor que inicializa el store con el estado inicial definido.
   */
  constructor() {
    super(createInitialState());
  }

  /**
   * Actualiza la pestaña seleccionada en la interfaz de usuario.
   * 
   * @param {number} tabSeleccionado - Índice numérico de la pestaña a activar.
   * @returns {void}
   */
  public updateTabSeleccionado(tabSeleccionado: number): void {
    this.update((state) => ({
      ...state,
      tabSeleccionado,
    }));
  }

  /**
 * Elimina una mercancía específica del estado del trámite.
 * La eliminación se realiza comparando todas las propiedades
 * del objeto recibido con los elementos existentes en la tabla.
 *
 * @param datos Información de la mercancía a eliminar.
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
   * Actualiza el estado completo de los datos generales del trámite.
   * 
   * @param {DatosDelTramiteFormState} datosDelTramiteFormState - Nuevo estado con los datos actualizados.
   * @returns {void}
   */
  public updateDatosDelTramiteFormState(datosDelTramiteFormState: DatosDelTramiteFormState): void {
    this.update((state) => ({
      ...state,
      datosDelTramite: datosDelTramiteFormState,
    }));
  }

  /**
   * Actualiza el estado del formulario de pago de derechos.
   * 
   * @param {PagoDerechosFormState} pagoDerechosFormState - Nuevos datos de pago.
   * @returns {void}
   */
  public updatePagoDerechosFormState(pagoDerechosFormState: PagoDerechosFormState): void {
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

  public updateState(
    partial: Partial<Tramite240112State>
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
