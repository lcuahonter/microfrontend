import { Store, StoreConfig } from '@datorama/akita';
import { DatosDelContenedor } from '../models/datos-tramite.model';
import { Injectable } from '@angular/core';


/**
 * Interfaz que representa el estado de la solicitud 11204.
 * Utilizamos esta interfaz para definir la estructura del estado de la solicitud.
 */
export interface Solicitud11204State {
  idSolicitud: number | null;

  /**
   * Datos del contenedor.
   */
  datosDelContenedor: DatosDelContenedor[];

  /**
   * Datos del contenedor.
   */
  datosDelCsvArchivo: [];

  /**
   * Tipo de busqueda.
   */
  tipoBusqueda: string;

  /**
   * Aduana.
   */
  aduana: string;

  /**
   * Fecha de ingreso.
   */
  fechaIngreso: string;

  /**
   * Vigencia.
   */
  vigencia: string;

  /**
   * Iniciales del contenedor.
   */
  inicialesContenedor: string;

  /**
   * Numero del contenedor.
   */
  numeroContenedor: string;

  /**
   * Digito de control.
   */
  digitoDeControl: string;

  /**
   * Contenedores.
   */
  contenedores: string;

  /**
   * Menu desplegable de aduana.
   */
  aduanaMenuDesplegable: string;

  /**
   * Archivo seleccionado.
   */
  archivoSeleccionado: string;
}

/**
 * Función que crea el estado inicial de la solicitud 11204.
 * @returns El estado inicial de la solicitud 11204.
 */
export function createInitialState(): Solicitud11204State {
  return {
    datosDelContenedor: [],
    datosDelCsvArchivo: [],
    tipoBusqueda: '',
    aduana: '',
    inicialesContenedor: '',
    numeroContenedor: '',
    digitoDeControl: '',
    contenedores: '',
    fechaIngreso: '',
    vigencia: '',
    aduanaMenuDesplegable: '',
    archivoSeleccionado: '',
    idSolicitud: null
  };
}

/**
 * Servicio Injectable que gestiona el estado de la solicitud 11204.
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite11204', resettable: true })
export class Tramite11204Store extends Store<Solicitud11204State> {
  constructor() {
    super(createInitialState());
  }

  /**
   * Establece el valor del menu desplegable de aduana.
   * @param aduanaMenuDesplegable Valor del menu desplegable de aduana.
   */
  public setAduanaMenuDesplegable(aduanaMenuDesplegable: string): void {
    this.update((state) => ({
      ...state,
      aduanaMenuDesplegable,
    }));
  }

  /**
   * Establece la vigencia.
   * @param vigencia vigencia.
   */
  public setVigencia(vigencia: string): void {
    this.update((state) => ({
      ...state,
      vigencia,
    }));
  }

  /**
   * Establece los datos del contenedor.
   * @param datosDelContenedor Datos del contenedor.
   */
  public setDelContenedor(datosDelContenedor: DatosDelContenedor[]): void {
    this.update((state) => ({
      ...state,
      datosDelContenedor,
    }));
  }

  /**
   * Establece los datos del contenedor.
   * @param datosDelCsvArchivo Datos del contenedor.
   */
  public setDelCsv(datosDelCsvArchivo: []): void {
    this.update((state) => ({
      ...state,
      datosDelCsvArchivo,
    }));
  }

  /**
   * Establece el tipo de busqueda.
   * @param tipoBusqueda Tipo de busqueda.
   */
  public setTipoBusqueda(tipoBusqueda: string): void {
    this.update((state) => ({
      ...state,
      tipoBusqueda,
    }));
  }

  /**
   * Establece la aduana.
   * @param aduana Aduana.
   */
  public setAduana(aduana: string): void {
    this.update((state) => ({
      ...state,
      aduana,
    }));
  }

  /**
   * Establece la fecha de ingreso.
   * @param fechaIngreso Fecha de ingreso.
   */
  public setFechaIngreso(fechaIngreso: string): void {
    this.update((state) => ({
      ...state,
      fechaIngreso,
    }));
  }

  /**
   * Establece las iniciales del contenedor.
   * @param inicialesContenedor Iniciales del contenedor.
   */
  public setInicialesContenedor(inicialesContenedor: string): void {
    this.update((state) => ({
      ...state,
      inicialesContenedor,
    }));
  }

  /**
   * Establece el numero del contenedor.
   * @param numeroContenedor Numero del contenedor.
   */
  public setNumeroContenedor(numeroContenedor: string): void {
    this.update((state) => ({
      ...state,
      numeroContenedor,
    }));
  }

  /**
   * Establece el digito de control.
   * @param digitoDeControl Digito de control.
   */
  public setDigitoDeControl(digitoDeControl: string): void {
    this.update((state) => ({
      ...state,
      digitoDeControl,
    }));
  }

  /**
   * Establece los contenedores.
   * @param contenedores Contenedores.
   */
  public setContenedores(contenedores: string): void {
    this.update((state) => ({
      ...state,
      contenedores,
    }));
  }

  /**
   * Establece el archivo seleccionado.
   * @param archivoSeleccionado Archivo seleccionado.
   */
  public setArchivoSeleccionado(archivoSeleccionado: string): void {
    this.update((state) => ({
      ...state,
      archivoSeleccionado,
    }));
  }

  /**
 * Actualiza el identificador de la solicitud en el estado del store.
 */
  public setIdSolicitud(idSolicitud: number): void {
    this.update((state) => ({
      ...state,
      idSolicitud,
    }));
  }

  /**
   * Limpia los datos de la solicitud.
   */
  public limpiarSolicitud(): void {
    this.reset();
  }

  /**
  * Obtiene el identificador de la solicitud desde el estado del store.
  * Retorna `0` si no está definido.
  */
  public getIdSolicitud(): number {
    return this.getValue().idSolicitud ?? 0;
  }
}