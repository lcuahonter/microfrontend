import { Store, StoreConfig } from '@datorama/akita';
import { AccesosTabla } from '../models/tecnologicos.model';
import { Injectable } from '@angular/core';

/**
 * Estado inicial para la interfaz del trámite 324.
 */
export interface Solicitud324State {
  /**
   * Lista de accesos configurados en la solicitud.
   */
  AccesosDatos: AccesosTabla[];

  /**
   * Registro Federal de Contribuyentes (RFC) del solicitante.
   */
  rfc: string;

  /**
   * Aduana seleccionada en la solicitud.
   */
  aduana: string;

  /**
   * Sistema seleccionado en la solicitud.
   */
  sistema: string;

  /**
   * Rol o perfil seleccionado en la solicitud.
   */
  rol: string;

  /**
   * Tipo de movimiento seleccionado en la solicitud.
   */
  tipoMovimiento: string;
}

/**
 * Crea el estado inicial para la solicitud del trámite 324.
 * @returns Estado inicial de tipo `Solicitud324State`.
 */
export function createInitialState(): Solicitud324State {
  return {
    /**
     * Lista inicial de accesos configurados, vacía por defecto.
     */
    AccesosDatos: [],

    /**
     * Valor inicial del RFC, vacío por defecto.
     */
    rfc: '',

    /**
     * Valor inicial de la aduana, vacío por defecto.
     */
    aduana: '',

    /**
     * Valor inicial del sistema, vacío por defecto.
     */
    sistema: '',

    /**
     * Valor inicial del rol, vacío por defecto.
     */
    rol: '',

    /**
     * Valor inicial del tipo de movimiento, vacío por defecto.
     */
    tipoMovimiento: '',
  };
}

/**
 * Clase que representa el almacén de estado para el trámite 324.
 * Gestiona el estado global de la solicitud y proporciona métodos para actualizarlo.
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite324', resettable: true })
export class Tramite324Store extends Store<Solicitud324State> {
  /**
   * Constructor del almacén.
   * Inicializa el estado con los valores predeterminados.
   */
  constructor() {
    super(createInitialState());
  }

  /**
   * Agrega uno o varios accesos a la lista de accesos configurados.
   * @param newAccesos Objeto o arreglo que representa el/los nuevo(s) acceso(s) a agregar.
   */
  public addAccesosDatos(newAccesos: AccesosTabla | AccesosTabla[]): void {
    this.update((state) => ({
      ...state,
      AccesosDatos: Array.isArray(newAccesos)
        ? [...state.AccesosDatos, ...newAccesos] 
        : [...state.AccesosDatos, newAccesos],
    }));
  }

  /**
   * Restaura el estado al valor inicial.
   * Este método reinicia todos los valores del estado a sus valores predeterminados.
   */
  public limpiarSolicitud(): void {
    this.reset();
  }
}