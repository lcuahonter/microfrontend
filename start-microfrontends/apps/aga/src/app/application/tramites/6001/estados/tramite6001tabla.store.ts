
import { Store, StoreConfig } from '@datorama/akita';

import { Injectable } from '@angular/core';

/**
 * Creacion del estado inicial para la interfaz de tramite 6001
 * @returns Tramite6001TablaState
 */
export interface Tramite6001TablaState {
  /**
   * Movimiento asociado a la cuenta bancaria.
   * @type {string}
   */
    movimiento: string;
  /**
   * Cuenta bancaria asociada al movimiento.
   * @type {string}
   * */
    cuenta: string;
  /**
   * RFC (Registro Federal de Contribuyentes) del titular de la cuenta.
   * @type {string}
   */
    rfc: string;
  /**
   * Persona asociada a la cuenta bancaria.
   * @type {string}
   */
    persona: string;
  /**
   * Número de cuenta bancaria.
   * @type {string}
   */
    numeroDeCuenta: string;
  /**
   * Sucursal de la institución financiera donde se mantiene la cuenta bancaria.
   * @type {string}
   */
    sucursal: string;
  /**
   * Institución financiera donde se mantiene la cuenta bancaria.
   * @type {string}
   */
    institucionDeCredito: string;
  /**
   * Número de la cuenta bancaria.
   */
    numero: string;
  /**
   * País donde radica la cuenta bancaria.
   * @type {string}
   */
    radicaCuenta: string;
  /**
   * Estado de la cuenta bancaria.
   * @type {string}
   */
    estado: string;
  /**
   * Domicilio asociado a la cuenta bancaria.
   * @type {string}
   */
    domicilio: string;
}

/**
 * Crea y retorna el estado inicial para la funcionalidad Tramite6001Tabla.
 *
 * @returns {Tramite6001TablaState} El objeto de estado inicial con un arreglo vacío para `registroCuentasBancarias`.
 */
export function createInitialState(): Tramite6001TablaState {
  return {
        movimiento: '',
        cuenta: '',
        rfc: '',
        persona: '',
        numeroDeCuenta: '',
        sucursal: '',
        institucionDeCredito: '',
        numero: '',
        radicaCuenta: '',
        estado: '',
        domicilio: ''
  };
}

@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite6001', resettable: true })

/**
 * Clase Store para gestionar el estado de la tabla del "Trámite 6001".
 * Esta store extiende la clase genérica `Store` y es responsable de manejar
 * el estado relacionado con la lista de registros de cuentas bancarias (`registroCuentasBancarias`)
 * dentro del contexto del proceso "Trámite 6001".
 */
export class Tramite6001TablaStore extends Store<Tramite6001TablaState> {
  constructor() {
    super(createInitialState());
  }

  /**
   * Actualiza el movimiento asociado a la cuenta en el estado del store.
   * @param movimiento - El movimiento asociado a la cuenta bancaria.
   */
  public setMovimiento(movimiento: string): void {
    this.update((state) => ({
      ...state,
      movimiento,
    }));
  }

  /**
   * Actualiza la cuenta bancaria en el estado del store.
   * @param cuenta - La cuenta bancaria asociada al movimiento.
   */
    public setCuenta(cuenta: string): void {
        this.update((state) => ({
        ...state,
        cuenta,
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
     * Actualiza la institución de crédito en el estado del store.
     * @param institucionDeCredito - El nombre de la institución de crédito.
     */
    public setSucursal(sucursal: string): void {
        this.update((state) => ({
        ...state,
        sucursal,
        }));
    }

    /**
     * Actualiza la institución de crédito en el estado del store.
     * @param institucionDeCredito - El nombre de la institución de crédito.
     */
    public setInstitucionDeCredito(institucionDeCredito: string): void {
        this.update((state) => ({
        ...state,
        institucionDeCredito,
        }));
    }

    /**
     * Actualiza el número de cuenta en el estado del store.
     * @param numero - El número de cuenta bancaria.
     */
    public setNumero(numero: string): void {
        this.update((state) => ({
        ...state,
        numero,
        }));
    }

    /**
     * Actualiza el número de cuenta en el estado del store.
     * @param radicaCuenta - El número de cuenta radicada.
     */
    public setRadicaCuenta(radicaCuenta: string): void {
        this.update((state) => ({
        ...state,
        radicaCuenta,
        }));
    }

    /**
     * Actualiza el estado en el estado del store.
     * @param estado - El estado del trámite.
     */
    public setEstado(estado: string): void {
        this.update((state) => ({
        ...state,
        estado,
        }));
    }

    /**
     * Actualiza el domicilio en el estado del store.
     * @param domicilio - El domicilio asociado a la cuenta bancaria.
     */
    public setDomicilio(domicilio: string): void {
        this.update((state) => ({
        ...state,
        domicilio,
        }));
    }
}
