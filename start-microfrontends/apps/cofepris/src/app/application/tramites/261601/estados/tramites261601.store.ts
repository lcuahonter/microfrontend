import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

/**
 * Interfaz que define el estado de la solicitud 261601.
 * Contiene todas las propiedades necesarias para gestionar los datos del trámite.
 */
export interface Solicitud261601State {

  /** Representa una descripción o información adicional sobre la solicitud.*/
  detalledelaSolicitud: string;

    /** Indica si se cumple con los requisitos establecidos para la solicitud. */
    cumplocon: boolean;

  /** Registro Federal de Contribuyentes (RFC) */
  rfc: string;

  /** Razón social legal */
  legalRazonSocial: string;

  /** Apellido paterno de la persona */
  apellidoPaterno: string;

  /** Apellido materno de la persona */
  apellidoMaterno: string;
}

/**
 * Función para crear el estado inicial de la solicitud 261601.
 * Retorna un objeto con valores predeterminados para todas las propiedades.
 */
/**
 * Función para crear el estado inicial de la solicitud 261601.
 * Retorna un objeto con valores predeterminados para todas las propiedades.
 */
export function createInitialSolicitudState(): Solicitud261601State {
  return {
    /** Representa una descripción o información adicional sobre la solicitud.*/
    detalledelaSolicitud: '',
    /** Valor inicial que indica si se cumple con los requisitos establecidos para la solicitud. */
    cumplocon: true,
    /** Registro Federal de Contribuyentes (RFC) */
    rfc: '',

    /** Razón social legal */
    legalRazonSocial: '',

    /** Apellido paterno de la persona */
    apellidoPaterno: '',

    /** Apellido materno de la persona */
    apellidoMaterno: '',
  };
}
/**
 * Servicio que gestiona el estado de la solicitud 261601.
 * Utiliza Akita para manejar el estado de manera reactiva.
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'Solicitud261601State', resettable: true })
export class Solicitud261601Store extends Store<Solicitud261601State> {
  constructor() {
    super(createInitialSolicitudState());
  }
  /**
   * Método para actualizar el RFC en el estado.
   * @param rfc RFC a establecer.
   */
  public setRfc(rfc: string): void {
    this.update((state) => ({
      ...state,
      rfc,
    }));
  }
   /**
   * Método para actualizar el estado de si se cumplen los requisitos establecidos para la solicitud.
   * @param cumplocon Valor booleano que indica si se cumplen los requisitos.
   */
   public setCumplocon(cumplocon: boolean): void {
    this.update((state) => ({
      ...state,
      cumplocon,
    }));
  }
  /**
   * Método para actualizar la razón social legal en el estado.
   * @param legalRazonSocial Razón social legal a establecer.
   */
  public setLegalRazonSocial(legalRazonSocial: string): void {
    this.update((state) => ({
      ...state,
      legalRazonSocial,
    }));
  }

  /**
   * Método para actualizar el apellido paterno en el estado.
   * @param apellidoPaterno Apellido paterno a establecer.
   */
  public setApellidoPaterno(apellidoPaterno: string): void {
    this.update((state) => ({
      ...state,
      apellidoPaterno,
    }));
  }

  /**
   * Método para actualizar el apellido materno en el estado.
   * @param apellidoMaterno Apellido materno a establecer.
   */
  public setApellidoMaterno(apellidoMaterno: string): void {
    this.update((state) => ({
      ...state,
      apellidoMaterno,
    }));
  }
  /**
   * Método para actualizar el detalle de la solicitud en el estado.
   * @param detalledelaSolicitud Detalle de la solicitud a establecer.
   */
  public setDetalledelaSolicitud(detalledelaSolicitud: string): void {
    this.update((state) => ({
      ...state,
      detalledelaSolicitud,
    }));
  }
}
