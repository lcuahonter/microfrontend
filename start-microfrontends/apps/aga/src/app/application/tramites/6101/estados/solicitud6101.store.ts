import { Store, StoreConfig } from '@datorama/akita';

import { Injectable } from '@angular/core';
/**
 * Interfaz que define la estructura del estado para la solicitud 6101.
 */
export interface Solicitud6101State {
  /** @description Aduana auxiliar para la solicitud. */
  aduanaAux: string | number;
  /** @description Junta técnica derivada para la solicitud. */
  juntaTecnicaDerivada: string | number;
  /** @description Número de pedimento para la solicitud. */
  numeroPedimento: string;
  /** @description Nombre comercial de la mercancía. */
  nombreComercialMercancia: string;
  /** @description Descripción detallada de la mercancía. */
  descDetalladaMercancia: string;
  /** @description Fracción arancelaria I. */
  fraccionI: string;
  /** @description Capítulo de la fracción arancelaria. */
  capitulo: string;
  /** @description Partida de la fracción arancelaria. */
  partida: string;
  /** @description Subpartida de la fracción arancelaria. */
  subpartida: string;
  /** @description Subdivisión de la fracción arancelaria. */
  subdivision: string;
  /** @description Fracción arancelaria II. */
  fraccionII: string;
  /** @description Capítulo II de la fracción arancelaria. */
  capituloII: string;
  /** @description Partida II de la fracción arancelaria. */
  partidaII: string;
  /** @description Subpartida II de la fracción arancelaria. */
  subpartidaII: string;
  /** @description Subdivisión II de la fracción arancelaria. */
  subdivisionII: string;
  /** @description Fracción arancelaria III. */
  fraccionIII: string;
  /** @description Capítulo III de la fracción arancelaria. */
  capituloIII: string;
  /** @description Partida III de la fracción arancelaria. */
  partidaIII: string;
  /** @description Subpartida III de la fracción arancelaria. */
  subpartidaIII: string;
  /** @description Subdivisión III de la fracción arancelaria. */
  subdivisionIII: string;
  /** @description Indica si se han seleccionado manifiestos. */
  manifiestosSeleccionados: boolean;
}

/**
 * Crea el estado inicial para la solicitud 6101.
 * @returns El estado inicial con valores por defecto.
 */
export function createInitialState(): Solicitud6101State {
  return {
    aduanaAux: '',
    juntaTecnicaDerivada: '',
    numeroPedimento: '',
    nombreComercialMercancia: '',
    descDetalladaMercancia: '',
    fraccionI: '',
    capitulo: '',
    partida: '',
    subpartida: '',
    subdivision: '',
    fraccionII: '',
    capituloII: '',
    partidaII: '',
    subpartidaII: '',
    subdivisionII: '',
    fraccionIII: '',
    capituloIII: '',
    partidaIII: '',
    subpartidaIII: '',
    subdivisionIII: '',
    manifiestosSeleccionados: false,
  };
}

/**
 * Store que gestiona el estado de la solicitud 6101.
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'solicitud6101', resettable: true })
/**
 * Store que gestiona el estado de la solicitud 6101.
 */
export class Solicitud6101Store extends Store<Solicitud6101State> {
   /**
   * Constructor del store que inicializa el estado con los valores por defecto.
   */
  constructor() {
    super(createInitialState());
  }

  /** Actualiza el valor de la aduana auxiliar */
  public actualizarAduanaAux(aduanaAux: string | number): void {
    this.update((state) => ({
      ...state,
      aduanaAux,
    }));
  }

  /** Actualiza el valor de la junta técnica derivada */
  public actualizarJuntaTecnicaDerivada(
    juntaTecnicaDerivada: string | number
  ): void {
    this.update((state) => ({
      ...state,
      juntaTecnicaDerivada,
    }));
  }

  /** Actualiza el número de pedimento */
  public actualizarNumeroPedimento(numeroPedimento: string): void {
    this.update((state) => ({
      ...state,
      numeroPedimento,
    }));
  }

  /** Actualiza el nombre comercial de la mercancía */
  public actualizarNombreComercialMercancia(
    nombreComercialMercancia: string
  ): void {
    this.update((state) => ({
      ...state,
      nombreComercialMercancia,
    }));
  }

  /** Actualiza la descripción detallada de la mercancía */
  public actualizarDescDetalladaMercancia(
    descDetalladaMercancia: string
  ): void {
    this.update((state) => ({
      ...state,
      descDetalladaMercancia,
    }));
  }

  /** Actualiza el valor de fracción I */
  public actualizarFraccionI(fraccionI: string): void {
    this.update((state) => ({
      ...state,
      fraccionI,
    }));
  }

  /** Actualiza el valor de capítulo */
  public actualizarCapitulo(capitulo: string): void {
    this.update((state) => ({
      ...state,
      capitulo,
    }));
  }

  /** Actualiza el valor de partida */
  public actualizarPartida(partida: string): void {
    this.update((state) => ({
      ...state,
      partida,
    }));
  }

  /** Actualiza el valor de subpartida */
  public actualizarSubpartida(subpartida: string): void {
    this.update((state) => ({
      ...state,
      subpartida,
    }));
  }

  /** Actualiza el valor de subdivisión */
  public actualizarSubdivision(subdivision: string): void {
    this.update((state) => ({
      ...state,
      subdivision,
    }));
  }

  /** Actualiza el valor de fracción II */
  public actualizarFraccionII(fraccionII: string): void {
    this.update((state) => ({
      ...state,
      fraccionII,
    }));
  }

  /** Actualiza el valor de capítulo II */
  public actualizarCapituloII(capituloII: string): void {
    this.update((state) => ({
      ...state,
      capituloII,
    }));
  }

  /** Actualiza el valor de partida II */
  public actualizarPartidaII(partidaII: string): void {
    this.update((state) => ({
      ...state,
      partidaII,
    }));
  }

  /** Actualiza el valor de subpartida II */
  public actualizarSubpartidaII(subpartidaII: string): void {
    this.update((state) => ({
      ...state,
      subpartidaII,
    }));
  }

  /** Actualiza el valor de subdivisión II */
  public actualizarSubdivisionII(subdivisionII: string): void {
    this.update((state) => ({
      ...state,
      subdivisionII,
    }));
  }

  /** Actualiza el valor de fracción III */
  public actualizarFraccionIII(fraccionIII: string): void {
    this.update((state) => ({
      ...state,
      fraccionIII,
    }));
  }

  /** Actualiza el valor de capítulo III */
  public actualizarCapituloIII(capituloIII: string): void {
    this.update((state) => ({
      ...state,
      capituloIII,
    }));
  }

  /** Actualiza el valor de partida III */
  public actualizarPartidaIII(partidaIII: string): void {
    this.update((state) => ({
      ...state,
      partidaIII,
    }));
  }

  /** Actualiza el valor de subpartida III */
  public actualizarSubpartidaIII(subpartidaIII: string): void {
    this.update((state) => ({
      ...state,
      subpartidaIII,
    }));
  }

  /** Actualiza el valor de subdivisión III */
  public actualizarSubdivisionIII(subdivisionIII: string): void {
    this.update((state) => ({
      ...state,
      subdivisionIII,
    }));
  }

  /** Actualiza el valor de manifiestos seleccionados */
  public actualizarManifiestosSeleccionados(
    manifiestosSeleccionados: boolean
  ): void {
    this.update((state) => ({
      ...state,
      manifiestosSeleccionados,
    }));
  }

  /** Restaura el estado de la solicitud a su valor inicial */
  public limpiarSolicitud(): void {
    this.reset();
  }
}
