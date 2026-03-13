
import { Store, StoreConfig } from '@datorama/akita';

import { Injectable } from '@angular/core';

/**
 * Creacion del estado inicial para la interfaz de tramite 6001
 * @returns AgregarCuenta6001
 */
export interface AgregarCuenta6001State {
  /**
   * Titular de la cuenta bancaria.
   * @type {string}
   */
    titularDeLaCuenta: string;
  /**
   * Persona asociada a la cuenta bancaria.
   * @type {string}
   */
    persona: string;
  /**
   * RFC (Registro Federal de Contribuyentes) del titular de la cuenta.
   * @type {string}
   */
    rfc: string;
  /**
   * Número de cuenta bancaria.
   * @type {string}
   */
    numeroDeCuenta: string;
  /**
   * País donde radica la cuenta bancaria.
   * @type {string}
   */
    pais: string;
  /**
   * Institución financiera donde se mantiene la cuenta bancaria.
   * @type {string}
   */
    institucion: string;
  /**
   * Estado de la cuenta bancaria.
   * @type {string}
   */
    estado: string;
  /**
   * Sucursal de la institución financiera donde se mantiene la cuenta bancaria.
   * @type {string}
   */
    sucursal: string;
  /**
   * Número de plaza asociado a la cuenta bancaria.
   * @type {string}
   */
    numeroDePlaza: string;
}

export function createInitialState(): AgregarCuenta6001State {
  return {
    titularDeLaCuenta: '',
    persona: '',
    rfc: '',
    numeroDeCuenta: '',
    pais: '',
    institucion: '',
    estado: '',
    sucursal: '',
    numeroDePlaza: ''
  };
}

@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite6001', resettable: true })

/**
 * Clase Store para gestionar el estado del "Trámite 6001".
 * Esta store extiende la clase genérica `Store` y es responsable de manejar
 * el estado relacionado con el proceso "Agregar Cuenta 6001".
 */
export class Tramite6001Store extends Store<AgregarCuenta6001State> {
  constructor() {
    super(createInitialState());
  }

  /**
   * Actualiza el titular de la cuenta en el estado del store.
   * @param titularDeLaCuenta - El nombre del titular de la cuenta.
   */
  public setTitularDeLaCuenta(titularDeLaCuenta: string): void {
    this.update((state) => ({
      ...state,
      titularDeLaCuenta,
    }));
  }

  /**
   * Actualiza la persona asociada a la cuenta en el estado del store.
   * @param persona - El nombre de la persona asociada a la cuenta.
   */
  public setPersona(persona: string): void {
    this.update((state) => ({
      ...state,
      persona,
    }));
  }

  /**
   * Actualiza el RFC en el estado del store.
   * @param rfc - El RFC del titular de la cuenta.
   */
  public setRfc(rfc: string): void {
    this.update((state) => ({
      ...state,
      rfc,
    }));
  }

  /**
   * Actualiza el número de cuenta en el estado del store.
   * @param numeroDeCuenta - El número de cuenta bancaria.
   */
  public setNumeroDeCuenta(numeroDeCuenta: string): void {
    this.update((state) => ({
      ...state,
      numeroDeCuenta,
    }));
  }

  /**
   * Actualiza el país donde radica la cuenta en el estado del store.
   * @param pais - El país donde radica la cuenta bancaria.
   */
  public setPais(pais: string): void {
    this.update((state) => ({
      ...state,
      pais,
    }));
  }

  /**
   * Actualiza la institución financiera en el estado del store.
   * @param institucion - El nombre de la institución financiera.
   */
  public setInstitucion(institucion: string): void {
    this.update((state) => ({
      ...state,
      institucion,
    }));
  }

  /**
   * Actualiza el estado de la cuenta en el estado del store.
   * @param estado - El estado de la cuenta bancaria.
   */
  public setEstado(estado: string): void {
    this.update((state) => ({
      ...state,
      estado,
    }));
  }

  /**
   * Actualiza la sucursal de la institución financiera en el estado del store.
   * @param sucursal - La sucursal de la institución financiera.
   */
  public setSucursal(sucursal: string): void {
    this.update((state) => ({
      ...state,
      sucursal,
    }));
  }
  /**
   * Actualiza el número de plaza asociado a la cuenta en el estado del store.
   * @param numeroDePlaza - El número de plaza asociado a la cuenta bancaria.
   */
  public setNumeroDePlaza(numeroDePlaza: string): void {
    this.update((state) => ({
      ...state,
      numeroDePlaza,
    }));
  }
}
