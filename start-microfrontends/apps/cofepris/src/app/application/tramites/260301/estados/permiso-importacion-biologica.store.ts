import { Injectable } from '@angular/core';

import { Store, StoreConfig } from '@datorama/akita';

import { CatalogoResponse } from '@libs/shared/data-access-user/src';

export interface PermisoImportacionBiologicaState {
  selectedEstado: CatalogoResponse | null;
  /**
   * Clave seleccionada del catálogo de respuestas.
   */
  setClave: CatalogoResponse | null,
  /**
   * Banco seleccionado del catálogo de respuestas.
   */
  setBanco: CatalogoResponse | null,
  /**
   * Clave de referencia seleccionada del catálogo de respuestas.
   */
  setClaveDeReferncia:string,
  setCadenaDeLaDependencia:string, // Cadena de la dependencia seleccionada del catálogo de respuestas.
  setLlaveDePago:string, // Llave de pago seleccionada del catálogo de respuestas.
  setFechaDePago:string, // Fecha de pago seleccionada del catálogo de respuestas.
  /**
   * Importe de pago seleccionado del catálogo de respuestas.
   */
  setImporteDePago:string
}

/**
 * Crea el estado inicial para el `PermisoImportacionBiologicaState`.
 *
 * @returns {PermisoImportacionBiologicaState} El objeto de estado inicial con valores predeterminados:
 * - `selectedEstado`: Inicialmente establecido en `null`.
 * - `setClave`: Inicialmente establecido en `null`.
 * - `setBanco`: Inicialmente establecido en `null`.
 * - `setClaveDeReferencia`: Inicialmente establecido en una cadena vacía `''`.
 * - `setCadenaDeLaDependencia`: Inicialmente establecido en una cadena vacía `''`.
 * - `setLlaveDePago`: Inicialmente establecido en una cadena vacía `''`.
 * - `setFechaDePago`: Inicialmente establecido en una cadena vacía `''`.
 * - `setImporteDePago`: Inicialmente establecido en una cadena vacía `''`.
 */

export function createInitialState(): PermisoImportacionBiologicaState {
  return {
    selectedEstado: null,
    setClave: null,
    setBanco:null,
    setClaveDeReferncia:'',
    setCadenaDeLaDependencia:'',
    setLlaveDePago:'',
    setFechaDePago:'',
    setImporteDePago:''
  };
}
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'entradaHumanaState', resettable: true })
export class PermisoImportacionBiologicaStore extends Store<PermisoImportacionBiologicaState> {
  constructor() {
    super(createInitialState());
  }

  /**
   * Establece el estado seleccionado en el estado de la tienda.
   *
   * @param {CatalogoResponse} selectedEstado - El estado seleccionado del catálogo de respuestas.
   */
  public setSelectedEstado(selectedEstado: CatalogoResponse): void {
    this.update((state) => ({
      ...state,
      selectedEstado,
    }));
  }

  /**
   * Establece la clave seleccionada en el estado de la tienda.
   *
   * @param selectedClave - El objeto de respuesta del catálogo que representa la clave seleccionada.
   */
  public setClave(selectedClave: CatalogoResponse): void {
    this.update((state) => ({
      ...state,
      selectedClave,
    }));
  }


  /**
   * Establece el valor de `setBanco` en el estado de la tienda.
   *
   * @param setBanco - Un objeto de tipo `CatalogoResponse` que representa el banco a establecer.
   * 
   * Actualiza el estado de la tienda con el nuevo valor de `setBanco`.
   */
  public setBanco(setBanco: CatalogoResponse | null): void {
    this.update((state) => ({
      ...state,
      setBanco,
    }));
  }

  /**
   * Establece la clave de referencia en el estado de la tienda.
   *
   * @param setClaveDeReferncia - La clave de referencia que se debe establecer.
   */
  public setClaveDeReferncia(setClaveDeReferncia: string):void {
    this.update((state) => ({
      ...state,
      setClaveDeReferncia,
    }));
  }
  /**
   * Establece la cadena de la dependencia en el estado de la tienda.
   *
   * @param setCadenaDeLaDependencia - La cadena que representa la dependencia a establecer.
   */
  public setCadenaDeLaDependencia(setCadenaDeLaDependencia: string):void {
    this.update((state) => ({
      ...state,
      setCadenaDeLaDependencia,
    }));
  }

  /**
   * Establece la llave de pago en el estado de la tienda.
   *
   * @param setLlaveDePago - La llave de pago que se debe establecer.
   */
  public setLlaveDePago(setLlaveDePago: string): void {
    this.update((state) => ({
      ...state,
      setLlaveDePago,
    }));
  }
  /**
   * Establece la fecha de pago en el estado de la tienda.
   *
   * @param setFechaDePago - La fecha de pago que se debe establecer.
   */
  public setFechaDePago(setFechaDePago: string):void {
    this.update((state) => ({
      ...state,
      setFechaDePago,
    }));
  }
  /**
   * Establece el importe de pago en el estado de la tienda.
   *
   * @param setImporteDePago - El importe de pago que se debe establecer.
   */
  public setImporteDePago(setImporteDePago: string): void {
    this.update((state) => ({
      ...state,
      setImporteDePago,
    }));
  }
}
