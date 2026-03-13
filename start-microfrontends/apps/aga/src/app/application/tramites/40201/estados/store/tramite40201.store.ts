import {
  CAATRegistradoEmpresaForm,
  PersonaFisicaExtranjeraForm,
  PersonaFisicaNacionalForm,
  PersonaMoralExtranjeraForm,
  PersonaMoralNacionalForm,
} from '../../models/transportacion-maritima.model';
import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

export interface TransportacionMaritima40201State {
  /**
   * Identificador de la solicitud asociada al trámite.
   * @type {number | null}
   */
  idSolicitud: number | null;

  /**
   * Tabla de empresas CAAT registradas.
   * @type {CAATRegistradoEmpresaForm[]}
   */
  caatRegistradoEmpresaTabla: CAATRegistradoEmpresaForm[];

  /**
   * Tabla de personas físicas nacionales.
   * @type {PersonaFisicaNacionalForm[]}
   */
  personaFisicaNacionalTabla: PersonaFisicaNacionalForm[];

  /**
   * Tabla de personas morales nacionales.
   * @type {PersonaMoralNacionalForm[]}
   */
  personaMoralNacionalTabla: PersonaMoralNacionalForm[];

  /**
   * Tabla de personas físicas extranjeras.
   * @type {PersonaFisicaExtranjeraForm[]}
   */
  personaFisicaExtranjeraTabla: PersonaFisicaExtranjeraForm[];

  /**
   * Tabla de personas morales extranjeras.
   * @type {PersonaMoralExtranjeraForm[]}
   */
  personaMoralExtranjeraTabla: PersonaMoralExtranjeraForm[];
}

/**
 * Crea el estado inicial del trámite 40201.
 * @returns Estado inicial de tipo `TransportacionMaritima40201State`.
 */
export function createInitialState(): TransportacionMaritima40201State {
  return {
    idSolicitud: null,
    caatRegistradoEmpresaTabla: [],
    personaFisicaNacionalTabla: [],
    personaMoralNacionalTabla: [],
    personaFisicaExtranjeraTabla: [],
    personaMoralExtranjeraTabla: [],
  };
}

/**
 * Servicio de estado global para gestionar el trámite 40201 con Akita.
 */
@Injectable({
  providedIn: 'root',
})
/**
 * Configuración de la tienda Akita para el trámite 40201 con opción de reinicio.
 */
@StoreConfig({ name: 'tramite40201', resettable: true })
export class Tramite40201Store extends Store<TransportacionMaritima40201State> {
  /**
   * Constructor que inicializa el estado con los valores predeterminados.
   */
  constructor() {
    super(createInitialState());
  }
  /**
   * Actualiza el estado del trámite 40201 con los valores proporcionados.
   *
   * @param valores Objeto parcial con las propiedades del estado que se desean actualizar.
   */

  setTramite40201State(
    valores: Partial<TransportacionMaritima40201State>
  ): void {
    this.update((state) => ({
      ...state,
      ...valores,
    }));
  }
}
