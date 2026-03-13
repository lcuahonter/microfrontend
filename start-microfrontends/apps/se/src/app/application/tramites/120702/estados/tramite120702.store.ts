import { Store, StoreConfig } from '@datorama/akita';
import { CatalogoResponse } from '@libs/shared/data-access-user/src';
import { Injectable } from '@angular/core';

/**
 * Interfaz que define la estructura del estado para el trámite 120702.
 */
export interface Solicitud120702State {
  [key: string]: unknown;

  /**
   * Catálogo correspondiente al año del oficio.
   */
  anoDelOficio: CatalogoResponse | null;

  /**
   * Número del oficio.
   */
  numeroOficio: number;

  /**
   * Estado relacionado con el trámite.
   */
  estado: string;

  /**
   * Representación federal correspondiente.
   */
  representacionFederal: string;

  /**
   * Monto asignado al trámite.
   */
  montoAsignado: number;

  /**
   * Monto que ya ha sido expedido.
   */
  montoExpedido: number;

  /**
   * Monto restante disponible para expedir.
   */
  montoDisponible: number;

  /**
   * Datos asociados al número del oficio.
   */
  datosNumeroOficio: number;

  /**
   * Fecha de inicio de la vigencia del trámite.
   */
  fechaInicioVigencia: string;

  /**
   * Fecha de finalización de la vigencia del trámite.
   */
  fechaFinVigencia: string;

  /**
   * Monto que se desea dejar disponible.
   */
  montoADisponible: number;

  /**
   * Monto que se desea expedir.
   */
  montoAExpedir: number;

  /**
   * Total que se debe expedir.
   */
  totalAExpedir: number;
  continuarTriggered?: boolean;
}

/**
 * Crea y retorna el estado inicial del trámite 120702.
 *
 * @returns Estado inicial con valores predeterminados.
 */
export function createInitialState(): Solicitud120702State {
  return {
    anoDelOficio: null,
    numeroOficio: 0,
    estado: '',
    representacionFederal: '',
    montoAsignado: 0,
    montoExpedido: 0,
    montoDisponible: 0,
    datosNumeroOficio: 0,
    fechaInicioVigencia: '05/05/2024',
    fechaFinVigencia: '05/01/2025',
    montoADisponible: 0,
    montoAExpedir: 0,
    totalAExpedir: 0,
    continuarTriggered: false
  };
}

/**
 * Store de Akita que maneja el estado del trámite 120702.
 *
 * @export
 * @class Tramite120702Store
 * @extends {Store<Solicitud120702State>}
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite120702', resettable: true })
export class Tramite120702Store extends Store<Solicitud120702State> {
  /**
   * Inicializa el store con el estado inicial.
   */
  constructor() {
    super(createInitialState());
  }

  /**
   * Actualiza dinámicamente el valor de un campo del estado.
   *
   * @param fieldName - Nombre del campo a actualizar.
   * @param value - Valor nuevo para el campo.
   */
  public setDynamicFieldValue(fieldName: string, value: unknown): void {
    this.update((state) => ({
      ...state,
      [fieldName]: value,
    }));
  }

  /**
   * Establece el año del oficio en el estado.
   *
   * @param anoDelOficio - Objeto tipo `CatalogoResponse` con el año del oficio.
   */
  public setAnoDelOficio(anoDelOficio: CatalogoResponse): void {
    this.update((state) => ({
      ...state,
      anoDelOficio,
    }));
  }

  /**
   * Establece el número de oficio.
   *
   * @param numeroOficio - Número del oficio a registrar.
   */
  public setNumeroOficio(numeroOficio: number): void {
    this.update((state) => ({
      ...state,
      numeroOficio,
    }));
  }

  /**
   * Establece el monto que se desea expedir.
   *
   * @param montoAExpedir - Valor monetario a expedir.
   */
  public setMontoAExpedir(montoAExpedir: number): void {
    this.update((state) => ({
      ...state,
      montoAExpedir,
    }));
  }

  /**
   * Establece la fecha de inicio de la vigencia del trámite.
   *
   * @param fechaInicioVigencia - Fecha en formato `YYYY-MM-DD` o similar.
   */
  public setFechaInicio(fechaInicioVigencia: string): void {
    this.update((state) => ({
      ...state,
      fechaInicioVigencia,
    }));
  }

  /**
   * Establece la fecha de finalización de la vigencia del trámite.
   *
   * @param fechaFinVigencia - Fecha en formato `YYYY-MM-DD` o similar.
   */
  public setFechaFin(fechaFinVigencia: string): void {
    this.update((state) => ({
      ...state,
      fechaFinVigencia,
    }));
  }


   /**
* Establece el estado del botón continuar para activar o desactivar las validaciones del formulario.
* @param continuarTriggered Indica si el botón continuar ha sido activado.
*/
  public setContinuarTriggered(continuarTriggered: boolean): void {
    this.update((state) => ({ ...state, continuarTriggered }));
  }

  /**
   * Restaura el store a su estado inicial definido por `createInitialState`.
   */
  resetStore(): void {
    this.reset();
  }
}
