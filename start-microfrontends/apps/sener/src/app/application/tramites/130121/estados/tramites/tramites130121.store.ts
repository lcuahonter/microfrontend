import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { PartidasDeLaMercanciaModelo } from '../../../../shared/models/partidas-de-la-mercancia.model';

/**
 * Interfaz que representa el estado para el trámite 130121.
 *
 * @interface Tramite130121State
 */
export interface Tramite130121State {
  /**
   * Plazo del trámite.
   */
  plazo: string;
  /**
   * Descripción del trámite.
   */
  descripcion: string;
  /**
   * Fracción arancelaria.
   */
  fraccion: string;
  /**
   * Unidad de medida (UMT).
   */
  umt: string;
  /**
   * Código NICo.
   */
  nico: string;
  /**
   * Cantidad del trámite.
   */
  cantidad: string;
  /**
   * Valor de la partida en dólares estadounidenses.
   */
  valorPartidaUSD: number;
  /**
   * Solicitud del trámite.
   */
  solicitud: string;
  /**
   * Régimen del trámite.
   */
  regimen: string;
  /**
   * Clasificación del trámite.
   */
  clasificacion: string;
  /**
   * Fila seleccionada en la tabla (puede ser nula).
   */
  filaSeleccionada: PartidasDeLaMercanciaModelo[];
  /**
   * Cantidad de partidas de la mercancía.
   */
  cantidadModificar: string;
  /**
   * Valor de la partida en USD para partidas de la mercancía.
   */
  valorPartidaUSDPartidasDeLaMercancia: number;
  /**
   * Descripción de las partidas de la mercancía.
   */
  descripcionModificar: string;
  /**
   * Valor de la factura en USD.
   */
  valorFacturaUSD: string;
  /**
   * Bloque del trámite.
   */
  bloque: string;
  /**
   * Uso específico del trámite.
   */
  usoEspecifico: string;
  /**
   * Justificación para importación o exportación.
   */
  justificacionImportacionExportacion: string;
  /**
   * Observaciones adicionales.
   */
  observaciones: string;
  /**
   * Entidad relacionada.
   */
  entidad: string;
  /**
   * Representación asociada.
   */
  representacion: string;
  /**
   * Indica si se muestra la tabla.
   */
  mostrarTabla: boolean;

  /** Datos del cuerpo de la tabla dinámica */
  tablaDatos: PartidasDeLaMercanciaModelo[];
  
  /** Descripción   acotacion */
  acotacion: string;
  /** Descripción del NICO */
  descripcionNico: string;
  /**
   * @description Indica si el usuario ha aceptado el manifiesto de aceptación.
   * Valor booleano que representa el estado del checkbox del manifiesto.
   * Se utiliza para almacenar y gestionar la aceptación en el store.
   * @type {boolean}
   */
  manifesto: boolean;
  /**
   * Rango de días seleccionables.
   */
  rangoDias: string[];
  /**
   * Lista de fechas seleccionadas por el usuario.
   */
  seleccionada: string[];
}

/**
 * Crea el estado inicial para el trámite 130121.
 *
 * @returns {Tramite130121State} Estado inicial del trámite.
 */
export function createInitialState(): Tramite130121State {
  return {
    filaSeleccionada: [],
    mostrarTabla: false,
    tablaDatos: [],
    solicitud: 'Inicial',
    fraccion: '',
    umt: '',
    nico: '',
    plazo: 'Largo plazo (5 años)',
    descripcion: '',
    cantidad: '',
    valorPartidaUSD: 0,
    regimen: '',
    clasificacion: '',
    cantidadModificar: '',
    valorPartidaUSDPartidasDeLaMercancia: 0,
    descripcionModificar: '',
    valorFacturaUSD: '',
    bloque: '',
    usoEspecifico: '',
    justificacionImportacionExportacion: '',
    observaciones: '',
    entidad: '1',
    representacion: '1',
    acotacion: '',
    descripcionNico: '',
    manifesto: false,
    rangoDias: [],
    seleccionada: []
  };
}
/**
 * Servicio de Store para gestionar el estado del trámite 130121.
 *
 * @export
 * @class Tramite130121Store
 * @extends {Store<Tramite130121State>}
 */
@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'tramite130121' })
export class Tramite130121Store extends Store<Tramite130121State> {
  /**
   * Crea una instancia del Tramite130121Store.
   * Inicializa el estado utilizando createInitialState.
   *
   * @memberof Tramite130121Store
   */
  constructor() {
    super(createInitialState());
  }


  /**
 * @description
 * Método para establecer múltiples propiedades en el estado del store.
 * Este método permite actualizar el estado del store con los valores proporcionados
 * en el objeto `values`. Combina el estado actual con los nuevos valores utilizando
 * el operador de propagación (`...`).
 *
 * @param {Partial<Tramite130121State>} values - Objeto que contiene las propiedades a actualizar en el estado.
 *
 * @example
 * // Ejemplo de uso:
 * this.establecerDatos({ descripcion: 'Nueva descripción', cantidad: '10' });
 *
 * @returns {void}
 */
  public establecerDatos(values: Partial<Tramite130121State>): void {

    this.update((state) => ({
      ...state,
      ...values,
    }));
  }
}
