import { Injectable } from '@angular/core';
import { Store } from '@datorama/akita';
import { StoreConfig } from '@datorama/akita';

/**
 * Modelo de estado para el trámite 40403.
 */
export interface AtencionRenovacion40403State {
  /**
   * Lista que indica el estado de cada sección del formulario (true si está activa, false si no).
   */
  seccion: boolean[];

  /**
   * Lista que indica si cada sección del formulario es válida (true si es válida, false si no).
   */
  formaValida: boolean[];

  /**
   * Clave de folio CAAT.
   */
  claveFolioCAAT?: string;

  /**
   * Clave de folio CAAT.
   */
  cveFolioCaat?: string;

  /**
   * Descripción del tipo de CAAT.
   */
  descripcionTipoCaat?: string;

  /**
   * Tipo de CAAT aéreo.
   */
  tipoDeCaatAerea?: string;

  /**
   * Código de transportación aérea.
   */
  ideCodTransportacionAerea?: string;

  /**
   * Código IATA/ICAO.
   */
  codIataIcao?: string;
  /**
   * @property {boolean} mostrarError
   * @description
   * Indica si se debe mostrar un mensaje de error en la interfaz del usuario.
   * Se utiliza para controlar la visualización de alertas o notificaciones de error 
   * cuando hay validaciones fallidas en los formularios del trámite.
   */
  mostrarError: boolean
}

/**
 * Función para crear el estado inicial del trámite 40403.
 * @returns El estado inicial del trámite.
 */
export function createTramiteState(): AtencionRenovacion40403State {
  return {
    seccion: [],
    formaValida: [],

    claveFolioCAAT: '',
    cveFolioCaat: '',
    descripcionTipoCaat: '',
    tipoDeCaatAerea: '',
    ideCodTransportacionAerea: '',
    codIataIcao: '',
    mostrarError: false
  };
}

/**
 * Almacén de estado para gestionar los datos relacionados con el trámite 40403.
 */
@Injectable({ providedIn: 'root' })
/**
 * Clase que representa el almacén de estado para el trámite 40403.
 * Hereda de la clase Store de Akita.
 */
@StoreConfig({ name: 'tramite40403', resettable: true })

/**
 * Clase que representa el almacén de estado para el trámite 40403.
 */
export class Tramite40403Store extends Store<AtencionRenovacion40403State> {
  /**
   * Constructor del almacén.
   * Inicializa el estado con los valores predeterminados.
   */
  constructor() {
    super(createTramiteState());
  }

  /**
   * Actualiza el estado de las secciones del formulario.
   * @param seccion - Lista que indica el estado de cada sección (true si está activa, false si no).
   */
  public establecerSeccion(seccion: boolean[]): void {
    this.update((state) => ({
      ...state,
      seccion,
    }));
  }

  /**
   * Actualiza el estado de validación de las secciones del formulario.
   * @param formaValida - Lista que indica si cada sección del formulario es válida (true si es válida, false si no).
   */
  public establecerFormaValida(formaValida: boolean[]): void {
    this.update((state) => ({
      ...state,
      formaValida,
    }));
  }

  /**
   * Actualiza el estado del número de folio CAAT.
   * @param claveFolioCAAT - Clave de folio CAAT.
   */
  public establecerClaveFolioCAAT(claveFolioCAAT: string): void {
    this.update((state) => ({
      ...state,
      claveFolioCAAT,
    }));
  }

  /**
   * Actualiza el estado del folio CAAT.
   * @param cveFolioCaat - Clave de folio CAAT.
   */
  public establecerCveFolioCaat(cveFolioCaat: string): void {
    this.update((state) => ({
      ...state,
      cveFolioCaat,
    }));
  }

  /**
   * Actualiza el estado de la descripción del tipo de CAAT.
   * @param descripcionTipoCaat - Descripción del tipo de CAAT.
   */
  public establecerDescripcionTipoCaat(descripcionTipoCaat: string): void {
    this.update((state) => ({
      ...state,
      descripcionTipoCaat,
    }));
  }

  /**
   * Actualiza el estado del tipo de CAAT aéreo.
   * @param tipoDeCaatAerea - Tipo de CAAT aéreo.
   */
  public establecerTipoDeCaatAerea(tipoDeCaatAerea: string): void {
    this.update((state) => ({
      ...state,
      tipoDeCaatAerea,
    }));
  }

  /**
   * Actualiza el estado del código de transportación aérea.
   * @param ideCodTransportacionAerea - Código de transportación aérea.
   */
  public establecerIdeCodTransportacionAerea(ideCodTransportacionAerea: string): void {
    this.update((state) => ({
      ...state,
      ideCodTransportacionAerea,
    }));
  }

  /**
   * Actualiza el estado del código IATA/ICAO.
   * @param codIataIcao - Código IATA/ICAO.
   */
  public establecerCodIataIcao(codIataIcao: string): void {
    this.update((state) => ({
      ...state,
      codIataIcao,
    }));
  }
  /**
   * @method setMostrarError
   * @description
   * Actualiza el estado de visualización de errores en la interfaz del usuario.
   * Modifica la propiedad `mostrarError` del estado para controlar cuándo se muestran
   * las alertas o notificaciones de error en los formularios del trámite.
   *
   * @param {boolean} mostrarError - Valor booleano que indica si se deben mostrar los errores (true) o no (false).
   * @returns {void}
   */
  public setMostrarError(mostrarError: boolean): void {
    this.update((state) => ({
      ...state,
      mostrarError,
    }));
  }
}