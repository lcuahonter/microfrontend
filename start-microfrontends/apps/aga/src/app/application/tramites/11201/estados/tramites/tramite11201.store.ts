import { DatosDelContenedor, DatosSolicitante } from '@libs/shared/data-access-user/src/core/models/11201/datos-tramite.model';
import { Injectable } from '@angular/core';
import { Store, } from '@datorama/akita';
import { StoreConfig } from '@datorama/akita';

/**
 * Creacion del estado inicial para la interfaz de tramite 11201
 * @returns Solicitud11201
 */

export interface Solicitud11201State {
  idSolicitud?: number;
  menuDesplegable: string;
  datosSolicitante: DatosSolicitante
  datosDelContenedor: DatosDelContenedor[];
  tipoBusqueda: string;
  aduana: string;
  fechaIngreso: string;
  inicialesContenedor: string;
  numeroContenedor: string;
  digitoDeControl: string;
  contenedores: string;
  aduanaMenuDesplegable: string;
  casillaDeVerificacionindividual: boolean[];
  numeroManifiesta: string;
  fechaDeIngreso: string;
  archivoSeleccionado: string;
  /**
 * linea
 * @type {string}
 */
  linea: string;

  /**
* linea checkbox
* @type {string}
*/
  lineaCheckbox: string;

  monto: string;

}

export function createInitialState(): Solicitud11201State {
  return {
    menuDesplegable: '',
    datosSolicitante: {
      rfc: "",
      denominacion: "",
      actividadEconomica: "",
      correoElectronico: ""
    },
    datosDelContenedor: [],
    tipoBusqueda: '',
    aduana: '',
    inicialesContenedor: '',
    numeroContenedor: '',
    digitoDeControl: '',
    contenedores: '',
    fechaIngreso: '',
    aduanaMenuDesplegable: '',
    casillaDeVerificacionindividual: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
    numeroManifiesta: '',
    fechaDeIngreso: '',
    archivoSeleccionado: '',
    linea: '',
    lineaCheckbox: '',
    monto: '',
    idSolicitud: 0

  };
}

@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite11201', resettable: true })
export class Tramite11201Store extends Store<Solicitud11201State> {
  constructor() {
    super(createInitialState());
  }

  /**
   * Guarda el tipo de solicitud en el estado.
   *
   * @param casillaDeVerificacionindividual - El tipo de solicitud que se va a guardar.
   */
  public setCasillaDeVerificacionindividual(casillaDeVerificacionindividual: []): void {
    this.update((state) => ({
      ...state,
      casillaDeVerificacionindividual,
    }));
  }

  /**
   * Updates the store state with a new manifest number.
   *
   * Calls the store's update function to produce a new state object that preserves
   * existing properties and sets the `numeroManifiesta` field to the provided value.
   *
   * @param numeroManifiesta - The manifest number to set in the state.
   */ 
  public setNumeroManifiesta(numeroManifiesta: string): void {
    this.update((state) => ({
      ...state,
      numeroManifiesta,
    }));
  }

  /**
   * Establece el valor de la propiedad `menuDesplegable` en el estado del store.
   *
   * Actualiza el estado llamando a `this.update` y fusionando el estado actual con
   * la nueva cadena `menuDesplegable`, preservando el resto de las propiedades del estado.
   *
   * @param menuDesplegable - Nueva cadena que representará el valor del menú desplegable.
   * @returns void
   */
  public setMenuDesplegable(menuDesplegable: string): void {
    this.update((state) => ({
      ...state,
      menuDesplegable,
    }));
  }

  /**
   * Establece el valor de `aduanaMenuDesplegable` en el estado del store.
   *
   * Actualiza de manera inmutable el estado interno asignando el valor proporcionado
   * a la propiedad `aduanaMenuDesplegable`.
   *
   * @param aduanaMenuDesplegable - Nuevo valor para el menú desplegable de aduana.
   * @returns void
   */
  public setAduanaMenuDesplegable(aduanaMenuDesplegable: string): void {
    this.update((state) => ({
      ...state,
      aduanaMenuDesplegable,
    }));
  }

  /**
   * Updates the store state by setting the fechaDeIngreso field.
   *
   * Performs an immutable update (via this.update) so any subscribers/selectors
   * observing the store will receive the new state.
   *
   * @param fechaDeIngreso - The date of entry as a string (e.g., ISO 8601 or app-specific format).
   * @returns void
   */
  public setFechaDeIngreso(fechaDeIngreso: string): void {
    this.update((state) => ({
      ...state,
      fechaDeIngreso,
    }));
  }


  /**
   * Updates the store by setting the datosSolicitante field to the provided DatosSolicitante object.
   *
   * The update is performed immutably (merging the new datosSolicitante into the existing state
   * while preserving other state properties) and will notify any subscribers of the change.
   *
   * @param datosSolicitante - The DatosSolicitante object to store in the state.
   * @returns void
   */
  public setDatosSolicitante(datosSolicitante: DatosSolicitante): void {
    this.update((state) => ({
      ...state,
      datosSolicitante
    }));
  }

  /**
   * Set the store's `datosDelContenedor` field to the provided array.
   *
   * This method updates the current state by merging the existing state with
   * a new `datosDelContenedor` value and triggers the store's update mechanism.
   * The provided array is assigned as-is (no deep copy is performed), so if you
   * need to avoid external mutation consider passing a copied array.
   *
   * @param datosDelContenedor - Array of DatosDelContenedor objects to store.
   * @returns void
   */
  public setDelContenedor(datosDelContenedor: DatosDelContenedor[]): void {
    this.update((state) => ({
      ...state,
      datosDelContenedor
    }));
  }
  /**
   * Updates the store's `tipoBusqueda` property.
   *
   * Calls `this.update` to merge the provided `tipoBusqueda` into the current state,
   * ensuring an immutable state update for consumers of the store.
   *
   * @param tipoBusqueda - The new search type to set in the state.
   * @returns void
   */
  public setTipoBusqueda(tipoBusqueda: string): void {
    this.update((state) => ({
      ...state,
      tipoBusqueda
    }));
  }
  /**
   * Sets the `aduana` field in the store state.
   *
   * This method updates the store immutably by merging the provided `aduana`
   * value into the existing state while preserving all other properties.
   *
   * @param aduana - The new aduana value to store.
   * @returns void
   */
  public setAduana(aduana: string): void {
    this.update((state) => ({
      ...state,
      aduana
    }));
  }
  /**
   * Establece la fecha de ingreso en el estado del store.
   *
   * Actualiza el estado de forma inmutable llamando a `this.update` con un nuevo objeto de estado que contiene
   * el valor proporcionado en `fechaIngreso`.
   *
   * @param fechaIngreso - Fecha de ingreso como cadena. Debe respetar el formato utilizado por la aplicación
   *                        (por ejemplo, ISO 8601) o estar normalizada antes de pasarse a este método.
   * @returns void
   */
  public setFechaIngreso(fechaIngreso: string): void {
    this.update((state) => ({
      ...state,
      fechaIngreso
    }));
  }
  /**
   * Update the store's `inicialesContenedor` value.
   *
   * Performs an immutable update of the store state setting the `inicialesContenedor`
   * property to the provided string and notifies any subscribers of the change.
   *
   * @param inicialesContenedor - The new initials for the container (expected as a short string).
   * @returns void
   */
  public setInicialesContenedor(inicialesContenedor: string): void {
    this.update((state) => ({
      ...state,
      inicialesContenedor
    }));
  }
  /**
   * Updates the store's `numeroContenedor` value.
   *
   * Performs an immutable state update, replacing the existing `numeroContenedor`
   * with the provided string and triggering any subscribers/listeners of the store.
   *
   * @param numeroContenedor - The container number to set. Pass an empty string to clear the value.
   * @returns void
   */
  public setNumeroContenedor(numeroContenedor: string): void {
    this.update((state) => ({
      ...state,
      numeroContenedor
    }));
  }
  /**
   * Set the digitoDeControl value in the store state.
   *
   * Performs an immutable update of the store by calling `this.update` and
   * merging the provided `digitoDeControl` value into the existing state,
   * preserving all other state properties.
   *
   * @param digitoDeControl - The new control digit string to store.
   *
   * @returns void
   *
   * @remarks
   * - This method does not perform validation on the provided value; callers
   *   should validate format/length if required.
   * - Calling this will notify any subscribers/listeners of the store update.
   */
  public setDigitoDeControl(digitoDeControl: string): void {
    this.update((state) => ({
      ...state,
      digitoDeControl
    }));
  }
  /**
   * Update the store's state to set the `contenedores` value.
   *
   * Performs an immutable state update by spreading the current state and
   * replacing the `contenedores` property with the provided string.
   *
   * @param contenedores - The new value for the `contenedores` property.
   * @returns void
   */
  public setContenedores(contenedores: string): void {
    this.update((state) => ({
      ...state,
      contenedores
    }));
  }
  /**
   * Establece el valor de `archivoSeleccionado` en el estado del store.
   *
   * Realiza una actualización del estado mediante `this.update`, reemplazando solo la propiedad
   * `archivoSeleccionado` y preservando el resto del estado.
   *
   * @param archivoSeleccionado - Nuevo nombre o identificador del archivo que debe marcarse como seleccionado.
   * @returns void
   */
  public setArchivoSeleccionado(archivoSeleccionado: string): void {
    this.update((state) => ({
      ...state,
      archivoSeleccionado
    }));
  }

  /**
   * Updates the store state by setting the `linea` property.
   *
   * Replaces the current `linea` value with the provided string and emits a new
   * immutable state object via the store's `update` mechanism so subscribers are
   * notified of the change.
   *
   * @param linea - The new value to assign to the state's `linea` property.
   *
   * @example
   * // Set the linea to "priority"
   * store.setLinea("priority");
   */
  public setLinea(linea: string): void {
    this.update((state) => ({
      ...state,
      linea,
    }));
  }


  /**
   * Update the store's `lineaCheckbox` property.
   *
   * Performs an immutable update by calling the internal `update` function with a
   * shallow copy of the current state and setting `lineaCheckbox` to the provided value.
   *
   * @param lineaCheckbox - The new string value to assign to `lineaCheckbox`.
   * @returns void
   *
   * @remarks
   * Use this method to trigger reactive updates for subscribers that depend on
   * the `lineaCheckbox` value.
   */
  public setLineaCheckbox(lineaCheckbox: string): void {
    this.update((state) => ({
      ...state,
      lineaCheckbox,
    }));
  }

  /**
   * Updates the store's `monto` property.
   *
   * Performs an immutable update to the store state, replacing the current `monto`
   * with the provided string. Subscribers to the store will be notified of the change.
   *
   * @param monto - The new monto value to set in the state.
   * @returns void
   */
  public setMonto(monto: string): void {
    this.update((state) => ({
      ...state,
      monto,
    }));
  }


  /**
   * Restablece el estado de la tienda de trámites a su configuración inicial.
   *
   * Este método limpia cualquier dato relacionado con la solicitud actualmente
   * almacenado en el store (campos temporales, flags de estado, errores,
   * indicadores de carga, etc.) invocando internamente `reset()`.
   *
   * @remarks
   * - Operación síncrona: no realiza llamadas asíncronas ni validaciones.
   * - Tras su ejecución, los suscriptores del store verán el estado inicial.
   *
   * @returns void
   */
  public limpiarSolicitud(): void {
    this.reset();
  }

  /**
   * Establece el identificador de la solicitud en el estado del store.
   *
   * Actualiza el estado de forma inmutable mediante this.update, preservando el resto
   * de propiedades del estado y reemplazando únicamente la propiedad `idSolicitud`.
   *
   * @param idSolicitud - Nuevo identificador de la solicitud.
   * @returns void
   *
   * @remarks 
   * Esta llamada puede provocar que los suscriptores del store reciban una nueva emisión
   * con el estado actualizado.
   *
   * @example
   * this.setIdSolicitud(123);
   */
  public setIdSolicitud(idSolicitud: number): void {
    this.update((state) => ({
      ...state,
      idSolicitud,
    }));
  }
  
  /**
 * Obtiene el identificador actual de la solicitud desde el estado del store.
 *
 * Recupera el valor de la propiedad `idSolicitud` almacenada en el estado.
 * En caso de que el identificador aún no haya sido establecido (null o undefined),
 * retorna el valor `0` como fallback seguro.
 *
 * @returns number
 * Identificador de la solicitud actual o `0` si no está definido.
 *
 * @remarks
 * Este método no modifica el estado ni genera nuevas emisiones para los
 * suscriptores del store.
 *
 * @example
 * const id = this.getIdSolicitud();
 */
  public getIdSolicitud(): number {
  return this.getValue().idSolicitud ?? 0;
}
}