import { DatosDelTramiteFormState } from '../../../shared/models/datos-del-tramite.model';
import { DestinoFinal } from '../../../shared/models/terceros-relacionados.model';
import { Injectable } from '@angular/core';
import { MercanciaDetalle } from '../../../shared/models/datos-del-tramite.model';
import { PagoDerechosFormState } from '../../../shared/models/pago-de-derechos.model';
import { Proveedor } from '../../../shared/models/terceros-relacionados.model';
import { Store } from '@datorama/akita';
import { StoreConfig } from '@datorama/akita';

/**
 * Representa el estado de la aplicación para el trámite 240119.
 * 
 * @property tabSeleccionado - (Opcional) Número del tab actualmente seleccionado.
 * @property destinatarioFinalTablaDatos - Lista de datos de los destinatarios finales.
 * @property proveedorTablaDatos - Lista de datos de los proveedores.
 * @property pagoDerechos - Estado del formulario relacionado con el pago de derechos.
 * @property merccancialTablaDatos - Lista de detalles de la mercancía.
 * @property datosDelTramite - Estado del formulario con los datos del trámite.
 * @property modificarDestinarioDatos - (Opcional) Datos del destinatario final que se está modificando, o `null` si no hay ninguno.
 * @property modificarProveedorDatos - (Opcional) Datos del proveedor que se está modificando, o `null` si no hay ninguno.
 */
export interface Tramite240119State {
   idSolicitud?: number;  
  tabSeleccionado?: number;
  destinatarioFinalTablaDatos: DestinoFinal[];
  proveedorTablaDatos: Proveedor[];
  pagoDerechos: PagoDerechosFormState;
  merccancialTablaDatos: MercanciaDetalle[];
  datosDelTramite: DatosDelTramiteFormState;
  modificarDestinarioDatos?: DestinoFinal | null;
  modificarProveedorDatos?: Proveedor | null;
}


/**
 * Crea el estado inicial para el trámite 240119.
 *
 * @returns {Tramite240119State} El estado inicial del trámite, que incluye:
 * - `tabSeleccionado`: Número del tab seleccionado inicialmente (por defecto 1).
 * - `destinatarioFinalTablaDatos`: Lista vacía para los datos de destinatarios finales.
 * - `proveedorTablaDatos`: Lista vacía para los datos de proveedores.
 * - `pagoDerechos`: Información inicial del pago de derechos, incluyendo:
 *   - `claveReferencia`: Clave de referencia vacía.
 *   - `cadenaDependencia`: Cadena de dependencia vacía.
 *   - `banco`: Banco vacío.
 *   - `llavePago`: Llave de pago vacía.
 *   - `fechaPago`: Fecha de pago vacía.
 *   - `importePago`: Importe de pago vacío.
 * - `merccancialTablaDatos`: Lista vacía para los datos de mercancías.
 * - `datosDelTramite`: Información inicial del trámite, incluyendo:
 *   - `permisoGeneral`: Permiso general vacío.
 *   - `usoFinal`: Uso final vacío.
 *   - `aduanasSeleccionadas`: Lista vacía de aduanas seleccionadas.
 *   - `paisDestino`: País de destino vacío.
 *   - `anoEnCurso`: Indicador booleano del año en curso (por defecto `false`).
 *   - `dosSemestre`: Información del segundo semestre vacía.
 *   - `unoSemestre`: Información del primer semestre vacía.
 * - `modificarDestinarioDatos`: Datos del destinatario a modificar (inicialmente `null`).
 * - `modificarProveedorDatos`: Datos del proveedor a modificar (inicialmente `null`).
 */
export function createInitialState(): Tramite240119State {
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
      anoEnCurso: false,
      dosSemestre: '',
      unoSemestre: '',
    },
    modificarDestinarioDatos: null,
    modificarProveedorDatos: null
  };
}

/**
 * Store que maneja el estado del trámite 240119.
 * Utiliza Akita para el control reactivo del estado.
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite240119', resettable: true })
export class Tramite240119Store extends Store<Tramite240119State> {
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
 * Actualiza los datos del destinatario en el estado de la tienda.
 *
 * @param datos - Objeto de tipo `DestinoFinal` que contiene la información del destinatario
 *                que se debe actualizar en el estado.
 *
 * @remarks
 * Este método también establece `modificarProveedorDatos` como `null` en el estado.
 */
  public actualizarDatosDestinatario(datos: DestinoFinal): void {
    this.update((state) => ({
      ...state,
      modificarDestinarioDatos: datos,
      modificarProveedorDatos: null
    }));
  }

  /**
   * Actualiza los datos del proveedor en el estado de la tienda.
   * 
   * @param datos - Objeto de tipo `Proveedor` que contiene la información actualizada del proveedor.
   * 
   * Este método modifica el estado actual de la tienda, asignando los nuevos datos del proveedor
   * y estableciendo los datos del destinatario como `null`.
   */
  public actualizarDatosProveedor(datos: Proveedor): void {
    this.update((state) => ({
      ...state,
      modificarDestinarioDatos: null,
      modificarProveedorDatos: datos,
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
      };
    });
  }

  /**
 * Actualiza de manera parcial el estado del store del trámite.
 * Combina el estado actual con las propiedades proporcionadas en `partial`.
 *
 * @param partial Objeto parcial con los campos que se desean actualizar en el estado.
 */
   public updateState(
      partial: Partial<Tramite240119State>
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
