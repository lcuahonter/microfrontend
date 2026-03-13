import { PersonaFisicaExtranjeraForm, PersonaMoralExtranjeraForm } from '../models/transportacion-maritima.model';
import { Store, StoreConfig, } from '@datorama/akita';
import { Injectable } from '@angular/core';

/**
 * Modelo de estado para el trámite 40402
 */
export interface Tramitenacionales40402State {
  /**
   * Estados de activación de secciones del formulario
   */
  seccion: boolean[];

  /**
   * Estados de validación de secciones del formulario
   */
  formaValida: boolean[];

  /**
   * Número de seguro social de persona física extranjera
   */
  seguroNumero?: string;

  /**
   * Nombre de persona física extranjera
   */
  nombrePFE?: string;

  /**
   * Apellido paterno de persona física extranjera
   */
  apellidoPaternoPFE?: string;

  /**
   * Apellido materno de persona física extranjera
   */
  apellidoMaternoPFE?: string;

  /**
   * Correo electrónico de persona física extranjera
   */
  correoPFE?: string;

  /**
   * País de persona física extranjera
   */
  paisPFE?: string;

  /**
   * Código postal de persona física extranjera
   */
  codigoPostalPFE?: string;

  /**
   * Ciudad de persona física extranjera
   */
  ciudadPFE?: string;

  /**
   * Estado de persona física extranjera
   */
  estadoPFE?: string;

  /**
   * Calle de persona física extranjera
   */
  callePFE?: string;

  /**
   * Número exterior de persona física extranjera
   */
  numeroExteriorPFE?: string;

  /**
   * Número interior de persona física extranjera
   */
  numeroInteriorPFE?: string;

  /**
   * Tabla de personas físicas extranjeras
   */
  personaFisicaExtranjeraTabla?: PersonaFisicaExtranjeraForm[];

  /**
   * Tabla de personas morales extranjeras
   */
  personaMoralExtranjeraTabla?: PersonaMoralExtranjeraForm[];

  /**
   * Denominación de persona moral extranjera
   */
  denominacionPME?: string;

  /**
   * Correo electrónico de persona moral extranjera
   */
  correoPME?: string;

  /**
   * País de persona moral extranjera
   */
  paisPME?: number | string;

  /**
   * Código postal de persona moral extranjera
   */
  codigoPostalPME?: string;

  /**
   * Ciudad de persona moral extranjera
   */
  ciudadPME?: string;

  /**
   * Estado de persona moral extranjera
   */
  estadoPME?: string;

  /**
   * Calle de persona moral extranjera
   */
  callePME?: string;

  /**
   * Número exterior de persona moral extranjera
   */
  numeroExteriorPME?: string;

  /**
   * Número interior de persona moral extranjera
   */
  numeroInteriorPME?: string;

  /**
   * Nombre del director general de persona moral extranjera
   */
  nombreDG?: string;

  /**
   * Apellido paterno del director general de persona moral extranjera
   */
  apellidoPaternoDG?: string;

  /**
   * Apellido materno del director general de persona moral extranjera
   */
  apellidoMaternoDG?: string;

  /**
   * Tipo de CAAT aéreo
   */
  tipoDeCaatAerea?: string;

  /**
   * Código de transportación aérea
   */
  ideCodTransportacionAerea?: string;

  /**
   * Código IATA/ICAO
   */
  codIataIcao?: string;
}

/**
 * Crea el estado inicial para el trámite 40402
 * 
 * @returns Estado inicial del trámite
 */
export function createTramiteState(): Tramitenacionales40402State {
  return {
    seccion: [],
    formaValida: [],
    seguroNumero: '',
    nombrePFE: '',
    apellidoPaternoPFE: '',
    apellidoMaternoPFE: '',
    correoPFE: '',
    paisPFE: '',
    codigoPostalPFE: '',
    ciudadPFE: '',
    estadoPFE: '',
    callePFE: '',
    numeroExteriorPFE: '',
    numeroInteriorPFE: '',
    personaFisicaExtranjeraTabla: [],
    personaMoralExtranjeraTabla: [],
    denominacionPME: '',
    correoPME: '',
    paisPME: '',
    codigoPostalPME: '',
    ciudadPME: '',
    estadoPME: '',
    callePME: '',
    numeroExteriorPME: '',
    numeroInteriorPME: '',
    nombreDG: '',
    apellidoPaternoDG: '',
    apellidoMaternoDG: '',
    tipoDeCaatAerea: '',
    ideCodTransportacionAerea: '',
    codIataIcao: ''
  };
}

/**
 * Store para manejar el estado del trámite 40402
 */
@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'tramite40402', resettable: true })
export class Tramite40402Store extends Store<Tramitenacionales40402State> {
  
  /**
   * Constructor del store
   */
  constructor() {
    super(createTramiteState());
  }

  /**
   * Actualiza el estado de las secciones del formulario
   * 
   * @param seccion - Lista de estados de secciones
   */
  public establecerSeccion(seccion: boolean[]): void {
    this.update((state) => ({
      ...state,
      seccion
    }));
  }

  /**
   * Actualiza el estado de validación de las secciones
   * 
   * @param formaValida - Lista de estados de validación
   */
  public establecerFormaValida(formaValida: boolean[]): void {
    this.update((state) => ({
      ...state,
      formaValida
    }));
  }

  /**
   * Establece número de seguro social
   * 
   * @param seguroNumero - Número de seguro social
   */
  public setSeguroNumero(seguroNumero: string): void {
    this.update((state) => ({
      ...state,
      seguroNumero
    }));
  }

  /**
   * Establece nombre de persona física extranjera
   * 
   * @param nombrePFE - Nombre de persona física
   */
  public setNombrePFE(nombrePFE: string): void {
    this.update((state) => ({
      ...state,
      nombrePFE
    }));
  }

  /**
   * Establece apellido paterno de persona física extranjera
   * 
   * @param apellidoPaternoPFE - Apellido paterno
   */
  public setApellidoPaternoPFE(apellidoPaternoPFE: string): void {
    this.update((state) => ({
      ...state,
      apellidoPaternoPFE
    }));
  }

  /**
   * Establece apellido materno de persona física extranjera
   * 
   * @param apellidoMaternoPFE - Apellido materno
   */
  public setApellidoMaternoPFE(apellidoMaternoPFE: string): void {
    this.update((state) => ({
      ...state,
      apellidoMaternoPFE
    }));
  }

  /**
   * Establece correo electrónico de persona física extranjera
   * 
   * @param correoPFE - Correo electrónico
   */
  public setCorreoPFE(correoPFE: string): void {
    this.update((state) => ({
      ...state,
      correoPFE
    }));
  }

  /**
   * Establece país de persona física extranjera
   * 
   * @param paisPFE - País
   */
  public setPaisPFE(paisPFE: string): void {
    this.update((state) => ({
      ...state,
      paisPFE
    }));
  }

  /**
   * Establece código postal de persona física extranjera
   * 
   * @param codigoPostalPFE - Código postal
   */
  public setCodigoPostalPFE(codigoPostalPFE: string): void {
    this.update((state) => ({
      ...state,
      codigoPostalPFE
    }));
  }

  /**
   * Establece ciudad de persona física extranjera
   * 
   * @param ciudadPFE - Ciudad
   */
  public setCiudadPFE(ciudadPFE: string): void {
    this.update((state) => ({
      ...state,
      ciudadPFE
    }));
  }

  /**
   * Establece estado de persona física extranjera
   * 
   * @param estadoPFE - Estado
   */
  public setEstadoPFE(estadoPFE: string): void {
    this.update((state) => ({
      ...state,
      estadoPFE
    }));
  }

  /**
   * Establece calle de persona física extranjera
   * 
   * @param callePFE - Calle
   */
  public setCallePFE(callePFE: string): void {
    this.update((state) => ({
      ...state,
      callePFE
    }));
  }

  /**
   * Establece número exterior de persona física extranjera
   * 
   * @param numeroExteriorPFE - Número exterior
   */
  public setNumeroExteriorPFE(numeroExteriorPFE: string): void {
    this.update((state) => ({
      ...state,
      numeroExteriorPFE
    }));
  }

  /**
   * Establece número interior de persona física extranjera
   * 
   * @param numeroInteriorPFE - Número interior
   */
  public setNumeroInteriorPFE(numeroInteriorPFE: string): void {
    this.update((state) => ({
      ...state,
      numeroInteriorPFE
    }));
  }

  /**
   * Establece tabla de personas físicas extranjeras
   * 
   * @param personaFisicaExtranjeraTabla - Tabla de personas
   */
  public setPersonaFisicaExtranjeraTabla(personaFisicaExtranjeraTabla: PersonaFisicaExtranjeraForm[]): void {
    this.update((state) => ({
      ...state,
      personaFisicaExtranjeraTabla
    }));
  }

  /**
   * Establece tabla de personas morales extranjeras
   * 
   * @param personaMoralExtranjeraTabla - Tabla de personas
   */
  public setPersonaMoralExtranjeraTabla(personaMoralExtranjeraTabla: PersonaMoralExtranjeraForm[]): void {
    this.update((state) => ({
      ...state,
      personaMoralExtranjeraTabla
    }));
  }

  /**
   * Establece denominación de persona moral extranjera
   * 
   * @param denominacionPME - Denominación
   */
  public setDenominacionPME(denominacionPME: string): void {
    this.update((state) => ({
      ...state,
      denominacionPME
    }));
  }

  /**
   * Establece correo electrónico de persona moral extranjera
   * 
   * @param correoPME - Correo electrónico
   */
  public setCorreoPME(correoPME: string): void {
    this.update((state) => ({
      ...state,
      correoPME
    }));
  }

  /**
   * Establece país de persona moral extranjera
   * 
   * @param paisPME - País
   */
  public setPaisPME(paisPME: number | string): void {
    this.update((state) => ({
      ...state,
      paisPME
    }));
  }

  /**
   * Establece código postal de persona moral extranjera
   * 
   * @param codigoPostalPME - Código postal
   */
  public setCodigoPostalPME(codigoPostalPME: string): void {
    this.update((state) => ({
      ...state,
      codigoPostalPME
    }));
  }

  /**
   * Establece ciudad de persona moral extranjera
   * 
   * @param ciudadPME - Ciudad
   */
  public setCiudadPME(ciudadPME: string): void {
    this.update((state) => ({
      ...state,
      ciudadPME
    }));
  }

  /**
   * Establece estado de persona moral extranjera
   * 
   * @param estadoPME - Estado
   */
  public setEstadoPME(estadoPME: string): void {
    this.update((state) => ({
      ...state,
      estadoPME
    }));
  }

  /**
   * Establece calle de persona moral extranjera
   * 
   * @param callePME - Calle
   */
  public setCallePME(callePME: string): void {
    this.update((state) => ({
      ...state,
      callePME
    }));
  }

  /**
   * Establece número exterior de persona moral extranjera
   * 
   * @param numeroExteriorPME - Número exterior
   */
  public setNumeroExteriorPME(numeroExteriorPME: string): void {
    this.update((state) => ({
      ...state,
      numeroExteriorPME
    }));
  }

  /**
   * Establece número interior de persona moral extranjera
   * 
   * @param numeroInteriorPME - Número interior
   */
  public setNumeroInteriorPME(numeroInteriorPME: string): void {
    this.update((state) => ({
      ...state,
      numeroInteriorPME
    }));
  }

  /**
   * Establece nombre del director general
   * 
   * @param nombreDG - Nombre del director
   */
  public setNombreDG(nombreDG: string): void {
    this.update((state) => ({
      ...state,
      nombreDG
    }));
  }

  /**
   * Establece apellido paterno del director general
   * 
   * @param apellidoPaternoDG - Apellido paterno
   */
  public setApellidoPaternoDG(apellidoPaternoDG: string): void {
    this.update((state) => ({
      ...state,
      apellidoPaternoDG
    }));
  }

  /**
   * Establece apellido materno del director general
   * 
   * @param apellidoMaternoDG - Apellido materno
   */
  public setApellidoMaternoDG(apellidoMaternoDG: string): void {
    this.update((state) => ({
      ...state,
      apellidoMaternoDG
    }));
  }

  /**
   * Establece tipo de CAAT aéreo
   * 
   * @param tipoDeCaatAerea - Tipo de CAAT
   */
  public setTipoDeCaatAerea(tipoDeCaatAerea: string): void {
    this.update((state) => ({
      ...state,
      tipoDeCaatAerea
    }));
  }

  /**
   * Establece código de transportación aérea
   * 
   * @param ideCodTransportacionAerea - Código de transportación
   */
  public setIdeCodTransportacionAerea(ideCodTransportacionAerea: string): void {
    this.update((state) => ({
      ...state,
      ideCodTransportacionAerea
    }));
  }

  /**
   * Establece código IATA/ICAO
   * 
   * @param codIataIcao - Código IATA/ICAO
   */
  public setCodIataIcao(codIataIcao: string): void {
    this.update((state) => ({
      ...state,
      codIataIcao
    }));
  }
}