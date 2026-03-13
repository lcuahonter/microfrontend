import { Catalogo, CatalogoResponse } from '@libs/shared/data-access-user/src';
import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

import { TablaDatos } from '@libs/shared/data-access-user/src/core/models/260211/detos.model';

export interface Sanitario260215State {
  selectedEstado: CatalogoResponse | null;
  setClave: CatalogoResponse | null;
  setDescripcion: CatalogoResponse | null;
  setDespecificarClasificacion: Catalogo | null;
  /**
   * Datos del fabricante.
   */
  Fabricante: TablaDatos[];
  /**
   * Datos del destinatario.
   */
  Destinatario: TablaDatos[];
  /**
   * Datos del proveedor.
   */
  Proveedor: TablaDatos[];
  /**
   * Datos del facturador.
   */
  Facturador: TablaDatos[];
}

export function createInitialState(): Sanitario260215State {
  return {
    selectedEstado: null,
    setClave: null,
    setDescripcion: null,
    setDespecificarClasificacion: null,
    Fabricante: [],
    Destinatario: [],
    Proveedor: [],
    Facturador: [],
  };
}
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'sanitarioState', resettable: true })
export class Sanitario260215Store extends Store<Sanitario260215State> {
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
  public setFabricante(fabricante: TablaDatos[]) {
    this.update((state) => ({
      ...state,
      Fabricante: fabricante,
    }));
  }

  /**
   * Establece los datos del destinatario en el estado del store.
   *
   * @param destinatario Arreglo de datos del destinatario.
   */
  public setDestinatario(destinatario: TablaDatos[]) {
    this.update((state) => ({
      ...state,
      Destinatario: destinatario,
    }));
  }

  /**
   * Establece los datos del proveedor en el estado del store.
   *
   * @param proveedor Arreglo de datos del proveedor.
   */
  public setProveedor(proveedor: TablaDatos[]) {
    this.update((state) => ({
      ...state,
      Proveedor: proveedor,
    }));
  }

  /**
   * Establece los datos del facturador en el estado del store.
   *
   * @param facturador Arreglo de datos del facturador.
   */
  public setFacturador(facturador: TablaDatos[]) {
    this.update((state) => ({
      ...state,
      Facturador: facturador,
    }));
  }
}
