import { Catalogo, CatalogoResponse } from '@libs/shared/data-access-user/src';
import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { TablaDatos } from '../../models/terceros-fabricante.model';

export interface TercerosFabricanteState {
  selectedEstado: CatalogoResponse | null;
  setClave: CatalogoResponse | null;
  setDescripcion: CatalogoResponse | null;
  setDespecificarClasificacion: Catalogo | null;
  /**
   * Datos del fabricante.
   */
  Fabricante: TablaDatos[];
  /**
   * Datos del formulador.
   */
  Formulador: TablaDatos[];
  /**
   * Datos del proveedor.
   */
  Proveedor: TablaDatos[];

  /**
   * Datos del proveedor.
   */
  fabricantePais: Catalogo | null;

  /**
   * Datos del proveedor.
   */
  proveedorPais: Catalogo | null;
  /**
   * Datos del formulador.
   */
  formuladorPais: Catalogo | null;
}

export function createInitialState(): TercerosFabricanteState {
  return {
    selectedEstado: null,
    setClave: null,
    setDescripcion: null,
    setDespecificarClasificacion: null,
    Fabricante: [],
    Formulador: [],
    Proveedor: [],
    fabricantePais: null,
    proveedorPais: null,
    formuladorPais: null,
  };
}
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'estadoState', resettable: true })
export class TercerosFabricanteStore extends Store<TercerosFabricanteState> {
  constructor() {
    super(createInitialState());
  }

  public setSelectedEstado(selectedEstado: CatalogoResponse): void {
    this.update((state) => ({
      ...state,
      selectedEstado,
    }));
  }

  public setClave(selectedClave: CatalogoResponse): void {
    this.update((state) => ({
      ...state,
      selectedClave,
    }));
  }

  public setDescripcion(selectedDescripcion: CatalogoResponse): void {
    this.update((state) => ({
      ...state,
      selectedDescripcion,
    }));
  }

  public setDespecificarClasificacion(
    selectedDespecificarClasificacion: CatalogoResponse
  ): void {
    this.update((state) => ({
      ...state,
      selectedDespecificarClasificacion,
    }));
  }
  /**
   * Establece los datos del fabricante en el estado del store.
   *
   * @param fabricante Arreglo de datos del fabricante.
   */
  public setFabricante(fabricante: TablaDatos[]): void {
    this.update((state) => ({
      ...state,
      Fabricante: fabricante,
    }));
  }

  /**
   * Establece los datos del formulador en el estado del store.
   *
   * @param formulador Arreglo de datos del formulador.
   */
  public setFormulador(formulador: TablaDatos[]): void {
    this.update((state) => ({
      ...state,
      Formulador: formulador,
    }));
  }

  /**
   * Establece los datos del proveedor en el estado del store.
   *
   * @param proveedor Arreglo de datos del proveedor.
   */
  public setProveedor(proveedor: TablaDatos[]): void {
    this.update((state) => ({
      ...state,
      Proveedor: proveedor,
    }));
  }

  /**
   * Establece los datos del proveedor en el estado del store.
   *
   * @param proveedor Arreglo de datos del proveedor.
   */
  public setFabricantePais(fabricantePais: Catalogo): void {
    this.update((state) => ({
      ...state,
      fabricantePais: fabricantePais,
    }));
  }

  /**
   * Establece los datos del proveedor en el estado del store.
   *
   */
  public setProveedorPais(proveedorPais: Catalogo): void {
    this.update((state) => ({
      ...state,
      proveedorPais: proveedorPais, 
    }));
  }

  /**
   * Establece los datos del formulador en el estado del store.
   *
   */
  public setFormuladorPais(formuladorPais: Catalogo): void {
    this.update((state) => ({
      ...state,
      formuladorPais: formuladorPais,
    }));
  }
}