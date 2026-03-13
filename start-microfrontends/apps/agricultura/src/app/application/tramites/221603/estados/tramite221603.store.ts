import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

/**
 * Interface que representa el estado de la solicitud para el trámite 221603.
 * Este estado contiene la información relacionada con los datos de la solicitud.
 */

export interface Solicitud221603State {
  /**
   * Justificación para la solicitud.
   */
  justificacionDescription: string;

  /**
   * Aduana de ingreso para el trámite.
   */
  aduana: string;

  /**
   * Oficina de inspección asociada al trámite.
   */
  oficina: string;

  /**
   * Punto de inspección donde se realiza el trámite.
   */
  punto: string;

  /**
   * Número de guía relacionado con el trámite.
   */
  guia: string;

  /**
   * Régimen aduanero bajo el cual se realiza el trámite.
   */
  regimen: string;

  /**
   * Número del carro de ferrocarril para el transporte.
   */
  carro: string;

  /**
   * Medio de transporte utilizado en el trámite.
   */
  medio: string;

  /**
   * Tipo de transporte utilizado en el trámite.
   */
  transporte: string;

  /**
   * Verificación que se realiza durante el trámite.
   */
  verificacion: string;

  /**
   * Empresa relacionada con el trámite.
   */
  empresa: string;

  /**
   * Indica si el trámite está exento de pago.
   */
  exento: string;

  /**
   * Clave única asociada al trámite.
   */
  clave: string;

  /**
   * Dependencia responsable del trámite.
   */
  dependencia: string;

  /**
   * Banco asociado al trámite.
   */
  banco: string;

  /**
   * Llave única para la validación del trámite.
   */
  llave: string;

  /**
   * Fecha de la solicitud del trámite.
   */
  fecha: string;

  /**
   * Importe relacionado con el trámite.
   */
  importe: string;

  /**
 * Justificación adicional para la solicitud.
 */
  justificacion: string;
}

/**
 * Función para crear el estado inicial de la solicitud.
 * Retorna un objeto con valores vacíos para cada propiedad del estado.
 */
export function createInitialState(): Solicitud221603State {
  return {
    justificacionDescription: '',
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
    exento: '',
    clave: '',
    dependencia: '',
    banco: '',
    llave: '',
    fecha: '',
    importe: '',
    justificacion: '',
  };
}

/**
 * Store para la gestión del estado de la solicitud del trámite 221603.
 * Utiliza Akita para la gestión de estado y permite actualizar los valores relacionados con el trámite.
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite221603', resettable: true })
export class Tramite221603Store extends Store<Solicitud221603State> {
  /**
   * Constructor del store que inicializa el estado con el estado inicial creado.
   */
  constructor() {
    super(createInitialState());
  }

  /**
   * Actualiza dinámicamente el estado de la solicitud para el campo y valor proporcionados.
   * Nombre del campo del estado a actualizar.
   * Valor a establecer en el campo especificado.
   */
  public setValoresStore(campo: string, valor: string): void {
    this.update((state) => ({
      ...state,
      [campo]: valor,
    }));
  }

  /**
   * Actualiza el estado con el régimen aduanero proporcionado.
   * regimen El régimen aduanero a establecer.
   */
  public setRegimen(regimen: string): void {
    this.update((state) => ({
      ...state,
      regimen,
    }));
  }

  /**
   * Actualiza el estado con la justificación proporcionada.
   * justificacion La justificación a establecer.
   */
  public setJustificacion(justificacion: string): void {
    this.update((state) => ({
      ...state,
      justificacion,
    }));
  }

   /**
   * Actualiza el estado con la justificación proporcionada.
   * justificacion La justificación a establecer.
   */
  public setJustificacionDescription(justificacionDescription: string): void {
    this.update((state) => ({
      ...state,
      justificacionDescription,
    }));
  }

  /**
   * Actualiza el estado con la aduana proporcionada.
   * aduana La aduana a establecer.
   */
  public setAduana(aduana: string): void {
    this.update((state) => ({
      ...state,
      aduana,
    }));
  }

  /**
   * Actualiza el estado con la oficina proporcionada.
   * oficina La oficina de inspección a establecer.
   */
  public setOficina(oficina: string): void {
    this.update((state) => ({
      ...state,
      oficina,
    }));
  }

  /**
   * Actualiza el estado con el punto de inspección proporcionado.
   * punto El punto de inspección a establecer.
   */
  public setPunto(punto: string): void {
    this.update((state) => ({
      ...state,
      punto,
    }));
  }

  /**
   * Actualiza el estado con el número de guía proporcionado.
   * guia El número de guía a establecer.
   */
  public setGuia(guia: string): void {
    this.update((state) => ({
      ...state,
      guia,
    }));
  }

  /**
   * Actualiza el estado con el número de carro proporcionado.
   * carro El número de carro a establecer.
   */
  public setCarro(carro: string): void {
    this.update((state) => ({
      ...state,
      carro,
    }));
  }

  /**
   * Actualiza el estado con el medio de transporte proporcionado.
   * medio El medio de transporte a establecer.
   */
  public setMedio(medio: string): void {
    this.update((state) => ({
      ...state,
      medio,
    }));
  }

  /**
   * Actualiza el estado con la verificación proporcionada.
   * verificacion La verificación a establecer.
   */
  public setVerificacion(verificacion: string): void {
    this.update((state) => ({
      ...state,
      verificacion,
    }));
  }

  /**
   * Actualiza el estado con el tipo de transporte proporcionado.
   * transporte El tipo de transporte a establecer.
   */
  public setTransporte(transporte: string): void {
    this.update((state) => ({
      ...state,
      transporte,
    }));
  }

  /**
   * Actualiza el estado con la empresa proporcionada.
   * empresa La empresa a establecer.
   */
  public setEmpresa(empresa: string): void {
    this.update((state) => ({
      ...state,
      empresa,
    }));
  }

  /**
   * Actualiza el estado con el valor de exención de pago proporcionado.
   * exento Indica si el trámite está exento de pago.
   */
  public setExentoDePago(exento: string): void {
    this.update((state) => ({
      ...state,
      exento,
    }));
  }

  /**
   * Actualiza el estado con la clave proporcionada.
   * clave La clave a establecer.
   */
  public setClave(clave: string): void {
    this.update((state) => ({
      ...state,
      clave,
    }));
  }

  /**
   * Actualiza el estado con la dependencia proporcionada.
   * dependencia La dependencia a establecer.
   */
  public setDependencia(dependencia: string): void {
    this.update((state) => ({
      ...state,
      dependencia,
    }));
  }

  /**
   * Actualiza el estado con el banco proporcionado.
   * banco El banco a establecer.
   */
  public setBanco(banco: string): void {
    this.update((state) => ({
      ...state,
      banco,
    }));
  }

  /**
   * Actualiza el estado con la llave proporcionada.
   * llave La llave a establecer.
   */
  public setLlave(llave: string): void {
    this.update((state) => ({
      ...state,
      llave,
    }));
  }

  /**
   * Actualiza el estado con la fecha proporcionada.
   * fecha La fecha a establecer.
   */
  public setFecha(fecha: string): void {
    this.update((state) => ({
      ...state,
      fecha,
    }));
  }

  /**
   * Actualiza el estado con el importe proporcionado.
   * importe El importe a establecer.
   */
  public setImporte(importe: string): void {
    this.update((state) => ({
      ...state,
      importe,
    }));
  }
}
