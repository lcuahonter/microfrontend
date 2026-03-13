import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

/**
 * Creacion del estado inicial para la interfaz de tramite SectoresYMercancias
 * @returns SolicitudSectoresYMercancias
 */
export interface SolicitudSectoresYMercanciasState {
  /**
   * Fracción de la solicitud
   */
  fraccion: string;
  
  /**
   * Sector de la solicitud
   */
  sector: string;

  /**
   * RFC de la solicitud
   */
  rfc: string;
}

/**
 * Creacion del estado inicial para la interfaz de tramite SectoresYMercancias
 * @returns SolicitudSectoresYMercancias
 */
export function createInitialState(): SolicitudSectoresYMercanciasState {
  return {
    /**
     * Fracción de la solicitud
     */
    fraccion: '',

    /**
     * Sector de la solicitud
     */
    sector: '',

    /**
     * RFC de la solicitud
     */
    rfc: '',
  };
}

@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramiteSectoresYMercancias', resettable: true })
export class TramiteSectoresYMercanciasStore extends Store<SolicitudSectoresYMercanciasState> {
  constructor() {
    super(createInitialState());
  }

  /**
   * Actualiza la fracción de la solicitud
   * @param fraccion
   */
  public setFraccion(fraccion: string): void {
    this.update((state) => ({
      ...state,
      fraccion,
    }));
  }

  /**
   * Actualiza el sector de la solicitud
   * @param sector
   */
  public setSector(sector: string): void {
    this.update((state) => ({
      ...state,
      sector,
    }));
  }

  /**
   * Actualiza el RFC de la solicitud
   * @param rfc
   */
  public setRfc(rfc: string): void {
    this.update((state) => ({
      ...state,
      rfc,
    }));
  }

  /**
   * Limpia los datos de la solicitud
   */
  public limpiarSolicitud(): void {
    this.reset();
  }
}
