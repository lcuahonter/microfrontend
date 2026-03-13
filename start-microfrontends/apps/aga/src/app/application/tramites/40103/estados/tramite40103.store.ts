import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

import {
  DatosUnidad,
  DatosVehiculo,
} from '../models/registro-muestras-mercancias.model';
/**
 * Estado de la store para el trámite 40103.
 * @property datosVehiculo - Datos del vehículo principal.
 * @property datosUnidad - Datos de la unidad de arrastre.
 */
export interface Tramite40103State {
  parque_vehicular_alta: DatosVehiculo[];
  parque_vehicular_modification: DatosVehiculo[];
  parque_vehicular_retirada: DatosVehiculo[];
  unidades_arrastre_alta: DatosUnidad[];
  unidades_arrastre_modification: DatosUnidad[];
  unidades_arrastre_retirada: DatosUnidad[];
}
/**
 * Crea el estado inicial para el trámite 40103.
 * @returns Estado inicial con valores vacíos para vehículo y unidad.
 */
export function createInitialState(): Tramite40103State {
  return {
    parque_vehicular_alta: [],
    parque_vehicular_modification: [],
    parque_vehicular_retirada: [],
    unidades_arrastre_alta: [],
    unidades_arrastre_modification: [],
    unidades_arrastre_retirada: [],
  };
}
/**
 * Store de Akita para el trámite 40103.
 * Permite actualizar campos individuales de los datos de vehículo y unidad de arrastre.
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite40103', resettable: true })
export class Tramite40103Store extends Store<Tramite40103State> {
/**
 * Indica si el trámite está en modo solo lectura (readonly), útil para flujos de consulta.
 *
 * @property {boolean} [readonly] - Si es `true`, el trámite y sus formularios asociados estarán en modo solo lectura, impidiendo la edición de datos.
 */
  readonly?: boolean;
  
  /**
   * Inicializa la store con el estado inicial.
   */
  constructor() {
    super(createInitialState());
  }

  // Métodos para manejar parque vehicular - Alta
  public addParqueVehicularAlta(vehiculo: DatosVehiculo): void {
    this.update((state) => ({
      ...state,
      parque_vehicular_alta: [...state.parque_vehicular_alta, vehiculo],
    }));
  }

  public setParqueVehicularAlta(vehiculos: DatosVehiculo[]): void {
    this.update((state) => ({
      ...state,
      parque_vehicular_alta: vehiculos,
    }));
  }

  public removeParqueVehicularAlta(index: number): void {
    this.update((state) => ({
      ...state,
      parque_vehicular_alta: state.parque_vehicular_alta.filter((_, i) => i !== index),
    }));
  }

  // Métodos para manejar parque vehicular - Modification
  public addParqueVehicularModification(vehiculo: DatosVehiculo): void {
    this.update((state) => ({
      ...state,
      parque_vehicular_modification: [...state.parque_vehicular_modification, vehiculo],
    }));
  }

  public setParqueVehicularModification(vehiculos: DatosVehiculo[]): void {
    this.update((state) => ({
      ...state,
      parque_vehicular_modification: vehiculos,
    }));
  }

  public removeParqueVehicularModification(index: number): void {
    this.update((state) => ({
      ...state,
      parque_vehicular_modification: state.parque_vehicular_modification.filter((_, i) => i !== index),
    }));
  }

  // Métodos para manejar parque vehicular - Retirada
  public addParqueVehicularRetirada(vehiculo: DatosVehiculo): void {
    this.update((state) => ({
      ...state,
      parque_vehicular_retirada: [...state.parque_vehicular_retirada, vehiculo],
    }));
  }

  public setParqueVehicularRetirada(vehiculos: DatosVehiculo[]): void {
    this.update((state) => ({
      ...state,
      parque_vehicular_retirada: vehiculos,
    }));
  }

  public removeParqueVehicularRetirada(index: number): void {
    this.update((state) => ({
      ...state,
      parque_vehicular_retirada: state.parque_vehicular_retirada.filter((_, i) => i !== index),
    }));
  }

  // Métodos para manejar unidades de arrastre - Alta
  public addUnidadesArrastreAlta(unidad: DatosUnidad): void {
    this.update((state) => ({
      ...state,
      unidades_arrastre_alta: [...state.unidades_arrastre_alta, unidad],
    }));
  }

  public setUnidadesArrastreAlta(unidades: DatosUnidad[]): void {
    this.update((state) => ({
      ...state,
      unidades_arrastre_alta: unidades,
    }));
  }

  public removeUnidadesArrastreAlta(index: number): void {
    this.update((state) => ({
      ...state,
      unidades_arrastre_alta: state.unidades_arrastre_alta.filter((_, i) => i !== index),
    }));
  }

  // Métodos para manejar unidades de arrastre - Modification
  public addUnidadesArrastreModification(unidad: DatosUnidad): void {
    this.update((state) => ({
      ...state,
      unidades_arrastre_modification: [...state.unidades_arrastre_modification, unidad],
    }));
  }

  public setUnidadesArrastreModification(unidades: DatosUnidad[]): void {
  
    this.update((state) => ({
      ...state,
      unidades_arrastre_modification: unidades,
    }));
  }

  public removeUnidadesArrastreModification(index: number): void {
    this.update((state) => ({
      ...state,
      unidades_arrastre_modification: state.unidades_arrastre_modification.filter((_, i) => i !== index),
    }));
  }

  // Métodos para manejar unidades de arrastre - Retirada
  public addUnidadesArrastreRetirada(unidad: DatosUnidad): void {
    this.update((state) => ({
      ...state,
      unidades_arrastre_retirada: [...state.unidades_arrastre_retirada, unidad],
    }));
  }

  public setUnidadesArrastreRetirada(unidades: DatosUnidad[]): void {
    this.update((state) => ({
      ...state,
      unidades_arrastre_retirada: unidades,
    }));
  }

  public removeUnidadesArrastreRetirada(index: number): void {
    this.update((state) => ({
      ...state,
      unidades_arrastre_retirada: state.unidades_arrastre_retirada.filter((_, i) => i !== index),
    }));
  }

}
