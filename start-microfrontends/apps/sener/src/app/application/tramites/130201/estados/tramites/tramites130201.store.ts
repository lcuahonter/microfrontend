import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { PartidasDeLaMercanciaModelo } from '../../../../shared/models/partidas-de-la-mercancia.model'; // Replace with the correct path

/**
 * Interfaz que define el estado del trámite 130201.
 * @interface
 */
export interface Tramite130201State {
  catalogo:string;
  fraccionArancelariaTIGIE: string;
  /** Plazo del trámite */
  plazo: string;
  /** Descripción del trámite */
  descripcion: string;
  /** Fracción del trámite */
  fraccion: string;
  /** NICO del trámite */
  nico: string;
  /** Cantidad asociada al trámite */
  cantidad: string;
  /** Valor de la partida en USD */
  valorPartidaUSD: number;
  /** Unidad de medida */
  umt: string;
  /** Solicitud del trámite */
  solicitud: string;
  /** Régimen del trámite */
  regimen: string;
  /** Clasificación del trámite */
  clasificacion: string;
  /** Fila seleccionada para mostrar */
  filaSeleccionada: PartidasDeLaMercanciaModelo[];
  /** Cantidad de partidas de la mercancía */
  cantidadModificar: string;
  /** Valor de la partida en USD para las partidas de la mercancía */
  valorPartidaUSDPartidasDeLaMercancia: number;
  /** Descripción de las partidas de la mercancía */
  descripcionModificar: string;
  /** Valor de la factura en USD */
  valorFacturaUSD: string;
  /** Bloque relacionado con el trámite */
  bloque: string;
  /** Uso específico del trámite */
  usoEspecifico: string;
  /** Justificación de importación o exportación */
  justificacionImportacionExportacion: string;
  /** Observaciones relacionadas al trámite */
  observaciones: string;
  /** Entidad responsable del trámite */
  entidad: string;
  /** Representación del trámite */
  representacion: string;
  /** Bandera para mostrar u ocultar la tabla */
  mostrarTabla: boolean;
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
}

/**
 * Función que devuelve el estado inicial para el trámite 130201.
 * @returns {Tramite130201State} Estado inicial con valores predeterminados.
 */
export function createInitialState(): Tramite130201State {
  return {
    fraccionArancelariaTIGIE:'',
    catalogo:'',
    filaSeleccionada: [],
    mostrarTabla: false,
    solicitud: 'Inicial',
    fraccion: '',
    nico: '',
    plazo: 'Largo plazo (5 años)',
    descripcion: '',
    cantidad: '',
    valorPartidaUSD: 0,
    umt: '',
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
    manifesto: false

  };
}

/**
 * Store para gestionar el estado del trámite 130201.
 * @class
 */
@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'tramite130201' })
export class Tramite130201Store extends Store<Tramite130201State> {
  /**
   * Constructor de la clase Tramite130201Store que inicializa el estado.
   */
  constructor() {
    super(createInitialState());
  }

  /**
   * Actualiza la bandera para mostrar u ocultar la tabla.
   * @param {boolean} mostrar - Valor que indica si la tabla debe mostrarse o no.
   */
  public setMostrarTabla(mostrar: boolean): void {
    this.update({ mostrarTabla: mostrar });
  }

  /**
   * Actualiza la fila seleccionada en el estado.
   * @param {null} fila - Fila seleccionada, puede ser null.
   */
  
  public storeTableValues(fila: PartidasDeLaMercanciaModelo[]): void {
    this.update({
      filaSeleccionada: fila,
    });
  }

/**
 * @description
 * Método para establecer múltiples propiedades en el estado del store.
 * Este método permite actualizar el estado del store con los valores proporcionados
 * en el objeto `values`. Combina el estado actual con los nuevos valores utilizando
 * el operador de propagación (`...`).
 *
 * @param {Partial<Tramite130201State>} values - Objeto que contiene las propiedades a actualizar en el estado.
 *
 * @example
 * // Ejemplo de uso:
 * this.establecerDatos({ descripcion: 'Nueva descripción', cantidad: '10' });
 *
 * @returns {void}
 */
public establecerDatos(values: Partial<Tramite130201State>): void {  
  this.update((state) => ({
    ...state,
    ...values,
  }));
}
}
