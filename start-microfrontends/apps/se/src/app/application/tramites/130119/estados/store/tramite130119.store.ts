import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

/**
 * Interfaz que define el estado del trámite 130119.
 */
export interface Tramite130119State {
  /** RFC de inicio de sesión */
  loginRfc: string;
  /** ID de la solicitud */
  idSolicitud: number;
  /** Régimen del trámite */
  regimen: string;
  /** Clasificación del régimen */
  clasificacionDeRegimen: string;
  /** Descripción del trámite */
  descripcion: string;
  /** Fracción arancelaria */
  fraccionArancelaria: string;
  /** Unidad de medida de trabajo (UMT) */
  umt: string;
  /** Cantidad de unidades */
  cantidad: string;
  /** Valor de la factura en USD */
  valorFacturaUSD: string;
  /** País de origen */
  paisOrigen: string;
  /** País exportador */
  paisExportador: string;
  /** Número de factura */
  numeroFactura: string;
  /** Fecha de expedición de la factura */
  fechaExpedicionFactura: string;
  /** Observaciones adicionales */
  observaciones: string;
  /** Estado del trámite */
  estado: string,
  /** Representación federal */
  representacionFederal: string
}

/**
 * Función que crea el estado inicial del trámite 130119.
 * @returns {Tramite130119State} - El estado inicial del trámite 130119.
 */
export function createInitialState(): Tramite130119State {
  return {
    loginRfc: '',
    idSolicitud: 0,
    regimen: '',
    clasificacionDeRegimen: '',
    descripcion: '',
    fraccionArancelaria: '',
    umt: '',
    cantidad: '',
    valorFacturaUSD: '',
    paisOrigen: '',
    paisExportador: '',
    numeroFactura: '',
    fechaExpedicionFactura: '',
    observaciones: '',
    estado: '',
    representacionFederal: ''
  };
}
/**
 * Clase que representa el store del trámite 130119.
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite130119', resettable: true })
export class Tramite130119Store extends Store<Tramite130119State> {
  /**
   * Constructor del store.
   */
  constructor() {
    super(createInitialState());
  }
  /**
   * Método establecerDatos
   * Actualiza el estado del trámite con los nuevos datos proporcionados.
   * {Partial<Tramite130119State>} datos - Datos parciales para actualizar el estado.
   */
  public establecerDatos(datos: Partial<Tramite130119State>): void {
    this.update((state) => ({
      ...state,
      ...datos,
    }));
  }

  /**
 * @description
 * Restablece el estado del store realizando una llamada al método `reset()`.
 * 
 * Este método encapsula la lógica de reinicio, permitiendo limpiar o
 * restaurar los valores manejados en el store según la implementación
 * interna del método `reset()`.
 */
  resetStore(): void {
    this.reset();
  }
}