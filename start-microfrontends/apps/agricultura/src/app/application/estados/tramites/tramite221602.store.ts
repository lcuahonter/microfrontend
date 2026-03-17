import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

/**
 * Interface que representa el estado de la solicitud para el trámite 90201.
 * Este estado contiene la información relacionada con los datos de la solicitud.
 * @interface Solicitud221602State
 */
export interface Solicitud221602State {
  /**
   * Justificación para la solicitud.
   * @type {string}
   */
  justificacion: string;

  /**
   * Aduana de ingreso para el trámite.
   * @type {string}
   */
  aduana: string;

  /**
   * Oficina de inspección asociada al trámite.
   * @type {string}
   */
  oficina: string;

  /**
   * Punto de inspección donde se realiza el trámite.
   * @type {string}
   */
  punto: string;

  /**
   * Número de guía relacionado con el trámite.
   * @type {string}
   */
  guia: string;

  /**
   * Régimen aduanero bajo el cual se realiza el trámite.
   * @type {string}
   */
  regimen: string;

  /**
   * Número del carro de ferrocarril para el transporte.
   * @type {string}
   */
  carro: string;

  /**
   * Medio de transporte utilizado en el trámite.
   * @type {string}
   */
  medio: string;

  /**
   * Tipo de transporte utilizado en el trámite.
   * @type {string}
   */
  transporte: string;

  /**
   * Verificación que se realiza durante el trámite.
   * @type {string}
   */
  verificacion: string;

  /**
   * Empresa relacionada con el trámite.
   * @type {string}
   */
  empresa: string;

  /**
   * Clave única asociada al trámite.
   * @type {string}
   */
  clave: string;

  /**
   * Dependencia responsable del trámite.
   * @type {string}
   */
  dependencia: string;

  /**
   * Banco asociado al trámite.
   * @type {string}
   */
  banco: string;

  /**
   * Llave única para la validación del trámite.
   * @type {string}
   */
  llave: string;

  /**
   * Fecha de la solicitud del trámite.
   * @type {string}
   */
  fecha: string;

  /**
   * Importe relacionado con el trámite.
   * @type {string}
   */
  importe: string;
}

/**
 * Función para crear el estado inicial de la solicitud.
 * @returns {Solicitud221602State} El estado inicial con valores vacíos para cada propiedad.
 */
export function createInitialState(): Solicitud221602State {
  return {
    justificacion: '',
    aduana: '',
    oficina: '',
    punto: '',
    guia: '',
    regimen: '',
    carro: '',
    medio: '',
    transporte: '',
    verificacion: '',
    empresa: '',
    clave: '',
    dependencia: '',
    banco: '',
    llave: '',
    fecha: '',
    importe: '',
  };
}

/**
 * Store para la gestión del estado de la solicitud del trámite 221602.
 * Utiliza Akita para la gestión de estado y permite actualizar los valores relacionados con el trámite.
 * @class Tramite221602Store
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite221602', resettable: true })
export class Tramite221602Store extends Store<Solicitud221602State> {
  /**
   * Constructor del store que inicializa el estado con el estado inicial creado.
   */
  constructor() {
    super(createInitialState());
  }

  /**
   * Actualiza el estado con el régimen aduanero proporcionado.
   * @param {string} regimen El régimen aduanero a establecer.
   */
  public setRegimen(regimen: string): void {
    this.update((state) => ({
      ...state,
      regimen,
    }));
  }

  /**
   * Actualiza el estado con la justificación proporcionada.
   * @param {string} justificacion La justificación a establecer.
   */
  public setJustificacion(justificacion: string): void {
    this.update((state) => ({
      ...state,
      justificacion,
    }));
  }

  /**
   * Actualiza el estado con la aduana proporcionada.
   * @param {string} aduana La aduana a establecer.
   */
  public setAduana(aduana: string): void {
    this.update((state) => ({
      ...state,
      aduana,
    }));
  }

  /**
   * Actualiza el estado con la oficina proporcionada.
   * @param {string} oficina La oficina de inspección a establecer.
   */
  public setOficina(oficina: string): void {
    this.update((state) => ({
      ...state,
      oficina,
    }));
  }

  /**
   * Actualiza el estado con el punto de inspección proporcionado.
   * @param {string} punto El punto de inspección a establecer.
   */
  public setPunto(punto: string): void {
    this.update((state) => ({
      ...state,
      punto,
    }));
  }

  /**
   * Actualiza el estado con el número de guía proporcionado.
   * @param {string} guia El número de guía a establecer.
   */
  public setGuia(guia: string): void {
    this.update((state) => ({
      ...state,
      guia,
    }));
  }

  /**
   * Actualiza el estado con el número de carro proporcionado.
   * @param {string} carro El número de carro a establecer.
   */
  public setCarro(carro: string): void {
    this.update((state) => ({
      ...state,
      carro,
    }));
  }

  /**
   * Actualiza el estado con el medio de transporte proporcionado.
   * @param {string} medio El medio de transporte a establecer.
   */
  public setMedio(medio: string): void {
    this.update((state) => ({
      ...state,
      medio,
    }));
  }

  /**
   * Actualiza el estado con la verificación proporcionada.
   * @param {string} verificacion La verificación a establecer.
   */
  public setVerificacion(verificacion: string): void {
    this.update((state) => ({
      ...state,
      verificacion,
    }));
  }

  /**
   * Actualiza el estado con el tipo de transporte proporcionado.
   * @param {string} transporte El tipo de transporte a establecer.
   */
  public setTransporte(transporte: string): void {
    this.update((state) => ({
      ...state,
      transporte,
    }));
  }

  /**
   * Actualiza el estado con la empresa proporcionada.
   * @param {string} empresa La empresa a establecer.
   */
  public setEmpresa(empresa: string): void {
    this.update((state) => ({
      ...state,
      empresa,
    }));
  }

  /**
   * Actualiza el estado con la clave proporcionada.
   * @param {string} clave La clave a establecer.
   */
  public setClave(clave: string): void {
    this.update((state) => ({
      ...state,
      clave,
    }));
  }

  /**
   * Actualiza el estado con la dependencia proporcionada.
   * @param {string} dependencia La dependencia a establecer.
   */
  public setDependencia(dependencia: string): void {
    this.update((state) => ({
      ...state,
      dependencia,
    }));
  }

  /**
   * Actualiza el estado con el banco proporcionado.
   * @param {string} banco El banco a establecer.
   */
  public setBanco(banco: string): void {
    this.update((state) => ({
      ...state,
      banco,
    }));
  }

  /**
   * Actualiza el estado con la llave proporcionada.
   * @param {string} llave La llave a establecer.
   */
  public setLlave(llave: string): void {
    this.update((state) => ({
      ...state,
      llave,
    }));
  }

  /**
   * Actualiza el estado con la fecha proporcionada.
   * @param {string} fecha La fecha a establecer.
   */
  public setFecha(fecha: string): void {
    this.update((state) => ({
      ...state,
      fecha,
    }));
  }

  /**
   * Actualiza el estado con el importe proporcionado.
   * @param {string} importe El importe a establecer.
   */
  public setImporte(importe: string): void {
    this.update((state) => ({
      ...state,
      importe,
    }));
  }
}
