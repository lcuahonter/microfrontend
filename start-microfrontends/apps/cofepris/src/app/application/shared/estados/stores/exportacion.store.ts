/* eslint-disable @typescript-eslint/naming-convention */
import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

/**
 * interface ExportacionState
 * description Interfaz que define el estado de la solicitud para el trámite.
 */
export interface ExportacionState {
  /**
   * property nombre
   * description Nombre del solicitante.
   */
  nombre: string;

  /**
   * property apellidoPrimer
   * description Primer apellido del solicitante.
   */
  apellidoPrimer: string;

  /**
   * property apellidoSegundo
   * description Segundo apellido del solicitante.
   */
  apellidoSegundo: string;

  /**
   * property denominacionRazonSocial
   * description Denominación o razón social del solicitante.
   */
  denominacionRazonSocial: string;

  /**
   * property estadoLocalidad
   * description Estado o localidad del solicitante.
   */
  estadoLocalidad: string;

  /**
   * property codPostal1
   * description Código postal del solicitante.
   */
  codPostal1: string;

  /**
   * property coloniaEquiv
   * description Colonia del solicitante.
   */
  coloniaEquiv: string;

  /**
   * property calle
   * description Calle del domicilio del solicitante.
   */
  calle: string;

  /**
   * property numExterior
   * description Número exterior del domicilio del solicitante.
   */
  numExterior: string;

  /**
   * property numInterior
   * description Número interior del domicilio del solicitante.
   */
  numInterior: string;

  /**
   * property lada
   * description Lada del teléfono del solicitante.
   */
  lada: string;

  /**
   * property telefono
   * description Teléfono del solicitante.
   */
  telefono: string;

  /**
   * property correoElectronico
   * description Correo electrónico del solicitante.
   */
  correoElectronico: string;

  /**
   * property selectPais
   * description País seleccionado por el solicitante.
   */
  selectPais: string;

  /**
   * property tipoPersona
   * description Tipo de persona (física o moral).
   */
  tipoPersona: string;
}

/**
 * function createInitialState
 * description Función para crear el estado inicial del trámite.
 * returns Estado inicial de tipo ExportacionState.
 */
export function createInitialState(): ExportacionState {
  return {
    nombre: '',
    apellidoPrimer: '',
    apellidoSegundo: '',
    denominacionRazonSocial: '',
    estadoLocalidad: '',
    codPostal1: '',
    coloniaEquiv: '',
    calle: '',
    numExterior: '',
    numInterior: '',
    lada: '',
    telefono: '',
    correoElectronico: '',
    selectPais: '',
    tipoPersona: '',
  };
}

/**
 * class ExportacionStore
 * description Clase que gestiona el estado del trámite utilizando Akita Store.
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'ExportacionState', resettable: true })
export class ExportacionStore extends Store<ExportacionState> {
  /**
   * @constructor
   * @description Constructor que inicializa el estado con valores predeterminados.
   */
  constructor() {
    super(createInitialState());
  }

  /**
   * @method setnombre
   * @description Establece el nombre del solicitante en el estado.
   * @param nombre Nombre del solicitante.
   */
  public setnombre(nombre: string): void {
    this.update((state) => ({
      ...state,
      nombre,
    }));
  }

  /**
   * @method setapellidoPrimer
   * @description Establece el primer apellido del solicitante en el estado.
   * @param apellidoPrimer Primer apellido del solicitante.
   */
  public setapellidoPrimer(apellidoPrimer: string): void {
    this.update((state) => ({
      ...state,
      apellidoPrimer,
    }));
  }

  /**
   * @method setapellidoSegundo
   * @description Establece el segundo apellido del solicitante en el estado.
   * @param apellidoSegundo Segundo apellido del solicitante.
   */
  public setapellidoSegundo(apellidoSegundo: string): void {
    this.update((state) => ({
      ...state,
      apellidoSegundo,
    }));
  }

  /**
   * @method setdenominacionRazonSocial
   * @description Establece la denominación o razón social en el estado.
   * @param denominacionRazonSocial Denominación o razón social.
   */
  public setdenominacionRazonSocial(denominacionRazonSocial: string): void {
    this.update((state) => ({
      ...state,
      denominacionRazonSocial,
    }));
  }

  /**
   * @method setestadoLocalidad
   * @description Establece el estado o localidad en el estado.
   * @param estadoLocalidad Estado o localidad.
   */
  public setestadoLocalidad(estadoLocalidad: string): void {
    this.update((state) => ({
      ...state,
      estadoLocalidad,
    }));
  }

  /**
   * @method setcodPostal1
   * @description Establece el código postal en el estado.
   * @param codPostal1 Código postal.
   */
  public setcodPostal1(codPostal1: string): void {
    this.update((state) => ({
      ...state,
      codPostal1,
    }));
  }

  /**
   * @method setcoloniaEquiv
   * @description Establece la colonia en el estado.
   * @param coloniaEquiv Colonia.
   */
  public setcoloniaEquiv(coloniaEquiv: string): void {
    this.update((state) => ({
      ...state,
      coloniaEquiv,
    }));
  }

  /**
   * @method setcalle
   * @description Establece la calle en el estado.
   * @param calle Calle.
   */
  public setcalle(calle: string): void {
    this.update((state) => ({
      ...state,
      calle,
    }));
  }

  /**
   * @method setnumExterior
   * @description Establece el número exterior en el estado.
   * @param numExterior Número exterior.
   */
  public setnumExterior(numExterior: string): void {
    this.update((state) => ({
      ...state,
      numExterior,
    }));
  }

  /**
   * @method setnumInterior
   * @description Establece el número interior en el estado.
   * @param numInterior Número interior.
   */
  public setnumInterior(numInterior: string): void {
    this.update((state) => ({
      ...state,
      numInterior,
    }));
  }

  /**
   * @method setlada
   * @description Establece la lada en el estado.
   * @param lada Lada.
   */
  public setlada(lada: string): void {
    this.update((state) => ({
      ...state,
      lada,
    }));
  }

  /**
   * @method settelefono
   * @description Establece el teléfono en el estado.
   * @param telefono Teléfono.
   */
  public settelefono(telefono: string): void {
    this.update((state) => ({
      ...state,
      telefono,
    }));
  }

  /**
   * @method setcorreoElectronico
   * @description Establece el correo electrónico en el estado.
   * @param correoElectronico Correo electrónico.
   */
  public setcorreoElectronico(correoElectronico: string): void {
    this.update((state) => ({
      ...state,
      correoElectronico,
    }));
  }

  /**
   * @method setselectPais
   * @description Establece el país seleccionado en el estado.
   * @param selectPais País seleccionado.
   */
  public setselectPais(selectPais: string): void {
    this.update((state) => ({
      ...state,
      selectPais,
    }));
  }

  /**
   * @method settipoPersona
   * @description Establece el tipo de persona (física o moral) en el estado.
   * @param tipoPersona Tipo de persona.
   */
  public settipoPersona(tipoPersona: string): void {
    this.update((state) => ({
      ...state,
      tipoPersona,
    }));
  }
}