import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

/**
 * Interfaz que define el estado de la tienda `Tramite40401`.
 */
export interface Tramite40401State {
  /**
   * Identificador único de la solicitud.
   * Si es null, es un trámite nuevo.
   */
  idSolicitud: number | null;

  /**
   * Paso activo en el flujo del trámite.
   */
  pasoActivo: number;

  /**
   * Pestaña activa en el flujo del trámite.
   */
  pestanaActiva: number;

  /**
   * Tipo de CAAT Aéreo seleccionado (TAGA).
   * Antes mapeado a 'pais'.
   */
  tipoCaat: string;

  /**
   * Tipo de Código seleccionado (CODTA: IATA / ICAO).
   * Antes mapeado a 'codigo' (erróneamente).
   */
  codigoIataIcao: string;

  /**
   * Código real capturado por el usuario (3 caracteres).
   * Antes llamado 'transportacion'.
   */
  codigo: string;
}

/**
 * Estado inicial del trámite.
 */
export function createInitialState(): Tramite40401State {
  return {
    idSolicitud: null, // Inicialmente no hay ID
    tipoCaat: '',
    codigoIataIcao: '',
    codigo: '',
    pasoActivo: 1,
    pestanaActiva: 1,
  };
}

@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite40401', resettable: true })
export class Tramite40401Store extends Store<Tramite40401State> {

  constructor() {
    super(createInitialState());
  }

  /* =====================================================
   * MÉTODOS DE ACTUALIZACIÓN DE ESTADO
   * ===================================================== */

  public setIdSolicitud(idSolicitud: number): void {
    this.update((state) => ({
      ...state,
      idSolicitud,
    }));
  }

  public setTipoCaat(tipoCaat: string): void {
    this.update((state) => ({
      ...state,
      tipoCaat,
    }));
  }

  public setCodigoIataIcao(codigoIataIcao: string): void {
    this.update((state) => ({
      ...state,
      codigoIataIcao,
    }));
  }

  public setCodigo(codigo: string): void {
    this.update((state) => ({
      ...state,
      codigo,
    }));
  }

  public setPasoActivo(pasoActivo: number): void {
    this.update((state) => ({
      ...state,
      pasoActivo,
    }));
  }

  public setPestanaActiva(pestanaActiva: number): void {
    this.update((state) => ({
      ...state,
      pestanaActiva,
    }));
  }

  /* =====================================================
   * ALIAS PARA COMPATIBILIDAD (SI ES NECESARIO)
   * ===================================================== */

  /**
   * Alias para setTipoCaat (soporte legacy si algún componente llama setPais).
   */
  public setPais(valor: string): void {
    this.setTipoCaat(valor);
  }

  /**
   * Alias para setCodigo (soporte legacy si algún componente llama setTransportacion).
   */
  public setTransportacion(valor: string): void {
    this.setCodigo(valor);
  }
}