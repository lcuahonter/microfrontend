import { Injectable } from '@angular/core';
import { Store } from '@datorama/akita';
import { StoreConfig } from '@datorama/akita';

/**
 * Estado centralizado para la solicitud 32512.
 * Contiene todos los campos necesarios para el llenado del formulario correspondiente.
 */
export interface Solicitud32512State {
  /**
   * Nombre comercial del establecimiento o entidad solicitante.
   */
  nombreComercial: string;

  /**
   * Identificador de la entidad federativa seleccionada.
   */
  entidadFederativa: number;

  /**
   * Identificador del municipio o alcaldía seleccionada.
   */
  municipio: number;

  /**
   * Identificador de la colonia seleccionada.
   */
  colonia: number;

  /**
   * Nombre de la calle donde se ubica el establecimiento.
   */
  calle: string;

  /**
   * Número exterior del domicilio.
   */
  numeroExterior: string;

  /**
   * Número interior del domicilio.
   */
  numeroInterior: string;

  /**
   * Código postal correspondiente al domicilio.
   */
  codigoPostal: string;

  /**
   * Identificador de la entidad federativa del lugar de destrucción de mercancía.
   */
  lugarEntidadFederativa: number;

  /**
   * Identificador del municipio o alcaldía del lugar de destrucción.
   */
  lugarMunicipioAlcaldia: number;

  /**
   * Identificador de la colonia del lugar de destrucción.
   */
  lugarColonia: number;

  /**
   * Nombre de la calle del lugar de destrucción.
   */
  lugarCalle: string;

  /**
   * Número exterior del lugar de destrucción.
   */
  lugarNumeroExterior: string;

  /**
   * Número interior del lugar de destrucción.
   */
  lugarNumeroInterior: string;

  /**
   * Código postal del lugar de destrucción.
   */
  lugarCodigoPostal: string;

  /**
   * Campo genérico adicional 1, utilizado según necesidades del formulario.
   */
  generico1: string;

  /**
   * Campo genérico adicional 2, utilizado según necesidades del formulario.
   */
  generico2: string;

  /**
   * Archivo cargado correspondiente a la destrucción de mercancía.
   */
  archivoDestruccion: File | null;
}

/**
 * Función que crea el estado inicial de la solicitud.
 * Esta función devuelve un objeto vacío que representa el estado inicial
 * de la solicitud, el cual puede ser modificado posteriormente.
 *
 * @returns {Solicitud32512State} Estado inicial de la solicitud.
 */
export function createInitialSolicitudState(): Solicitud32512State {
  return {
    nombreComercial: '',
    entidadFederativa: 0,
    municipio: 0,
    colonia: 0,
    calle: '',
    numeroExterior: '',
    numeroInterior: '',
    codigoPostal: '',
    lugarEntidadFederativa: 0,
    lugarMunicipioAlcaldia: 0,
    lugarColonia: 0,
    lugarCalle: '',
    lugarNumeroExterior: '',
    lugarNumeroInterior: '',
    lugarCodigoPostal: '',
    generico1: '',
    generico2: '',
    archivoDestruccion: null,
  };
}
@Injectable({
  providedIn: 'root', // Este servicio es proporcionado en el nivel raíz de la aplicación
})
@StoreConfig({
  name: 'solicitud32512', // Nombre de la configuración para el store
  resettable: true, // Habilita la opción de restablecer el estado del store
})
export class Solicitud32512Store extends Store<Solicitud32512State> {
  constructor() {
    // Llama al constructor de la clase padre Store con el estado inicial
    super(createInitialSolicitudState());
  }

  /**
   * Actualiza el campo `nombreComercial` en el estado de la solicitud.
   *
   * @param nombreComercial - Nombre comercial ingresado por el usuario.
   */
  actualizarNombreComercial(nombreComercial: string): void {
    this.update((state) => ({ ...state, nombreComercial }));
  }

  /**
   * Actualiza el identificador de la entidad federativa.
   *
   * @param entidadFederativa - ID seleccionado del catálogo.
   */
  actualizarEntidadFederativa(entidadFederativa: number): void {
    this.update((state) => ({ ...state, entidadFederativa }));
  }

  /**
   * Actualiza el identificador del municipio o alcaldía.
   *
   * @param municipio - ID seleccionado del catálogo.
   */
  actualizarMunicipio(municipio: number): void {
    this.update((state) => ({ ...state, municipio }));
  }

  /**
   * Actualiza el identificador de la colonia.
   *
   * @param colonia - ID seleccionado del catálogo.
   */
  actualizarColonia(colonia: number): void {
    this.update((state) => ({ ...state, colonia }));
  }

  /**
   * Actualiza el nombre de la calle.
   *
   * @param calle - Texto ingresado por el usuario.
   */
  actualizarCalle(calle: string): void {
    this.update((state) => ({ ...state, calle }));
  }

  /**
   * Actualiza el número exterior del domicilio.
   *
   * @param numeroExterior - Texto ingresado por el usuario.
   */
  actualizarNumeroExterior(numeroExterior: string): void {
    this.update((state) => ({ ...state, numeroExterior }));
  }

  /**
   * Actualiza el número interior del domicilio.
   *
   * @param numeroInterior - Texto ingresado por el usuario.
   */
  actualizarNumeroInterior(numeroInterior: string): void {
    this.update((state) => ({ ...state, numeroInterior }));
  }

  /**
   * Actualiza el código postal del domicilio.
   *
   * @param codigoPostal - Texto ingresado por el usuario.
   */
  actualizarCodigoPostal(codigoPostal: string): void {
    this.update((state) => ({ ...state, codigoPostal }));
  }

  /**
   * Actualiza la entidad federativa del lugar de destrucción.
   *
   * @param lugarEntidadFederativa - ID seleccionado del catálogo.
   */
  actualizarLugarEntidadFederativa(lugarEntidadFederativa: number): void {
    this.update((state) => ({ ...state, lugarEntidadFederativa }));
  }

  /**
   * Actualiza el municipio o alcaldía del lugar de destrucción.
   *
   * @param lugarMunicipioAlcaldia - ID seleccionado del catálogo.
   */
  actualizarLugarMunicipioAlcaldia(lugarMunicipioAlcaldia: number): void {
    this.update((state) => ({ ...state, lugarMunicipioAlcaldia }));
  }

  /**
   * Actualiza la colonia del lugar de destrucción.
   *
   * @param lugarColonia - ID seleccionado del catálogo.
   */
  actualizarLugarColonia(lugarColonia: number): void {
    this.update((state) => ({ ...state, lugarColonia }));
  }

  /**
   * Actualiza la calle del lugar de destrucción.
   *
   * @param lugarCalle - Texto ingresado por el usuario.
   */
  actualizarLugarCalle(lugarCalle: string): void {
    this.update((state) => ({ ...state, lugarCalle }));
  }

  /**
   * Actualiza el número exterior del lugar de destrucción.
   *
   * @param lugarNumeroExterior - Texto ingresado por el usuario.
   */
  actualizarLugarNumeroExterior(lugarNumeroExterior: string): void {
    this.update((state) => ({ ...state, lugarNumeroExterior }));
  }

  /**
   * Actualiza el número interior del lugar de destrucción.
   *
   * @param lugarNumeroInterior - Texto ingresado por el usuario.
   */
  actualizarLugarNumeroInterior(lugarNumeroInterior: string): void {
    this.update((state) => ({ ...state, lugarNumeroInterior }));
  }

  /**
   * Actualiza el código postal del lugar de destrucción.
   *
   * @param lugarCodigoPostal - Texto ingresado por el usuario.
   */
  actualizarLugarCodigoPostal(lugarCodigoPostal: string): void {
    this.update((state) => ({ ...state, lugarCodigoPostal }));
  }

  /**
   * Actualiza el campo genérico 1.
   *
   * @param generico1 - Valor personalizado definido por el formulario.
   */
  actualizarGenerico1(generico1: string): void {
    this.update((state) => ({ ...state, generico1 }));
  }

  /**
   * Actualiza el campo genérico 2.
   *
   * @param generico2 - Valor personalizado definido por el formulario.
   */
  actualizarGenerico2(generico2: string): void {
    this.update((state) => ({ ...state, generico2 }));
  }

  /**
   * Actualiza el archivo de destrucción subido por el usuario.
   *
   * @param archivoDestruccion - Archivo tipo `File` cargado en el formulario.
   */
  actualizarArchivoDestruccion(archivoDestruccion: File | null): void {
    this.update((state) => ({ ...state, archivoDestruccion }));
  }

  /**
   * Restaura el estado del store a su valor inicial.
   */
  resetStore(): void {
    this.reset();
  }
}
