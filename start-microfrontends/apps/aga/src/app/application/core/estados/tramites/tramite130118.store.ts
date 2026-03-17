import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

/**
 * Creacion del estado inicial para la interfaz de tramite 130118
 * @returns Solicitud130118
 */
export interface Solicitud130118State {
  regimenMercancia: string;
  clasifiRegimen: string;
  valueTA: string;
  fraccionArancelaria: string;
  nico: string;
  unidadMedidaTarifaria: string;
  cantidadTarifaria: number;
  valorFacturaUSD: number;
  precioUnitarioUSD: string;
  paisOrigen: string;
  paisDestino: string;
  lote: string;
  fechaSalida: string;
  observaciones: string;
  observacionMerc: string;
  tipoPersona: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  razonSocial: string;
  molino: string;
  domicilio: string;
  estado: string;
  representacionFederal: string;
}

export function createInitialState(): Solicitud130118State {
  return {
    regimenMercancia: '',
    clasifiRegimen: '',
    valueTA: '',
    fraccionArancelaria: '',
    nico: '',
    unidadMedidaTarifaria: '',
    cantidadTarifaria: 0,
    valorFacturaUSD: 0,
    precioUnitarioUSD: '',
    paisOrigen: '',
    paisDestino: '',
    lote: '',
    fechaSalida: '',
    observaciones: '',
    observacionMerc: '',
    tipoPersona: '',
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    razonSocial: '',
    molino: '',
    domicilio: '',
    estado: '',
    representacionFederal: ''
  };
}

@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite130118', resettable: true })
export class Tramite130118Store extends Store<Solicitud130118State> {
  constructor() {
    super(createInitialState());
  }

  public setRegimenMercancia(regimenMercancia: string): void {
    this.update((state) => ({
      ...state,
      regimenMercancia,
    }));
  }

  public setClasifiRegimen(clasifiRegimen: string): void {
    this.update((state) => ({
      ...state,
      clasifiRegimen,
    }));
  }

  public setFraccionArancelaria(fraccionArancelaria: string): void {
    this.update((state) => ({
      ...state,
      fraccionArancelaria,
    }));
  }

  public setNico(nico: string): void {
    this.update((state) => ({
      ...state,
      nico,
    }));
  }

  public setUnidadMedidaTarifaria(unidadMedidaTarifaria: string): void {
    this.update((state) => ({
      ...state,
      unidadMedidaTarifaria,
    }));
  }

  public setPaisOrigen(paisOrigen: string): void {
    this.update((state) => ({
      ...state,
      paisOrigen,
    }));
  }

  public setPaisDestino(paisDestino: string): void {
    this.update((state) => ({
      ...state,
      paisDestino,
    }));
  }

  public setMolino(molino: string): void {
    this.update((state) => ({
      ...state,
      molino,
    }));
  }

  public setEstado(estado: string): void {
    this.update((state) => ({
      ...state,
      estado,
    }));
  }

  public setRepresentacionFederal(representacionFederal: string): void {
    this.update((state) => ({
      ...state,
      representacionFederal,
    }));
  }
}
