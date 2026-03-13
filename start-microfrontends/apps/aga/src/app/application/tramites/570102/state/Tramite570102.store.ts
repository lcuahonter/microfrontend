import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

/**
 * Estado inicial para la interfaz del trámite 570102.
 */
export interface Solicitud570102State {
  /**
   * Folio de la solicitud.
   * Representa el identificador único de la solicitud dentro del sistema.
   */
  folio: string;
  /**
   * Motivo del desistimiento.
   * Representa la razón por la cual se realiza el desistimiento de la solicitud.
   */
  motivoDelDes: string;
}

/**
 * Crea el estado inicial para la solicitud del trámite 570102.
 * @returns Estado inicial de tipo `Solicitud570102State`.
 */
export function createInitialState(): Solicitud570102State {
  return {
    folio: '', 
    motivoDelDes: '',
  };
}

/**
 * Clase que representa el almacén de estado para el trámite 570102.
 * Gestiona el estado global de la solicitud y proporciona métodos para actualizarlo.
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite570102', resettable: true })
export class Tramite570102Store extends Store<Solicitud570102State> {
  /**
   * Constructor del almacén.
   * Inicializa el estado con los valores predeterminados.
   */
  constructor() {
    super(createInitialState());
  }
  /**
   * Actualiza el estado global con los nuevos valores proporcionados.
   * @param state Objeto que contiene los nuevos valores para el estado.
   */
  public setFolio(folio: string): void {
    this.update((state) => ({ ...state, folio }));
  }
  /**
   * Actualiza el motivo del desistimiento en el estado global.
   * @param motivoDelDes Nuevo motivo del desistimiento.
   */
  public setMotivoDelDes(motivoDelDes: string): void {
    this.update((state) => ({ ...state, motivoDelDes }));
  }

  /**
   * Restaura el estado al valor inicial.
   * Este método reinicia todos los valores del estado a sus valores predeterminados.
   */
  public limpiarSolicitud(): void {
    this.reset();
  }
}