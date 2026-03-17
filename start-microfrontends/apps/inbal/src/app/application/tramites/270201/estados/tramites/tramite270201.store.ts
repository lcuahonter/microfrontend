import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { TablaDatos } from '../../models/aviso-siglos.models';

import { CatalogoResponse } from '@libs/shared/data-access-user/src';

/**
 * Interfaz que define el estado del trámite 270201.
 * Este estado contiene información sobre varios catálogos y detalles de la obra de arte.
 * 
 * @interface Tramite270201State
 */
export interface Tramite270201State {
  /**
   * Representa la operación seleccionada del catálogo.
   * Puede ser nulo si no se ha seleccionado una operación.
   * 
   * @property {CatalogoResponse | null} operacion
   */
  tipoDeOperacion: CatalogoResponse | null;

  /**
   * Representa el movimiento seleccionado del catálogo.
   * Puede ser nulo si no se ha seleccionado un movimiento.
   * 
   * @property {CatalogoResponse | null} movimiento
   */
  tipoDeMovimiento: CatalogoResponse | null;

  /**
   * Representa el motivo seleccionado del catálogo.
   * Puede ser nulo si no se ha seleccionado un motivo.
   * 
   * @property {CatalogoResponse | null} motivo
   */
  motivo: CatalogoResponse | null;

  /**
   * Representa el país seleccionado del catálogo.
   * Puede ser nulo si no se ha seleccionado un país.
   * 
   * @property {CatalogoResponse | null} pais
   */
  pais: CatalogoResponse | null;

  /**
   * Representa la ciudad donde se realiza el trámite.
   * 
   * @property {string} ciudad
   */
  ciudad: string;

  /**
   * Representa el medio de transporte seleccionado del catálogo.
   * Puede ser nulo si no se ha seleccionado un medio de transporte.
   * 
   * @property {CatalogoResponse | null} transporte
   */
  medioTransporte: CatalogoResponse | null;

  /**
   * Representa la aduana seleccionada del catálogo.
   * Puede ser nulo si no se ha seleccionado una aduana.
   * 
   * @property {CatalogoResponse | null} aduana
   */
  aduanaEntrada: CatalogoResponse | null;

  /**
   * Representa el autor de la obra de arte.
   * 
   * @property {string} autor
   */
  autor: string;

  /**
   * Representa el título de la obra de arte.
   * 
   * @property {string} titulo
   */
  titulo: string;

  /**
   * Representa la técnica utilizada en la obra de arte.
   * 
   * @property {string} tecnica
   */
  tecnicaDeRealizacion: string;

  /**
   * Representa el alto de la obra de arte.
   * 
   * @property {string} alto
   */
  alto: string;

  /**
   * Representa el ancho de la obra de arte.
   * 
   * @property {string} ancho
   */
  ancho: string;

  /**
   * Representa la profundidad de la obra de arte.
   * 
   * @property {string} profundidad
   */
  profundidad: string;

  /**
   * Representa el diámetro de la obra de arte.
   * 
   * @property {string} diametro
   */
  diametro: string;

  /**
   * Representa variables adicionales de la obra de arte.
   * 
   * @property {string} variables
   */
  variables: string;

  /**
   * Representa el año de creación de la obra de arte.
   * 
   * @property {string} anoDeCreacion
   */
  anoDeCreacion: string;

  /**
   * Representa el avalúo de la obra de arte.
   * 
   * @property {string} avaluo
   */
  avaluo: string;

  /**
   * Representa la moneda seleccionada del catálogo para el avalúo.
   * Puede ser nulo si no se ha seleccionado una moneda.
   * 
   * @property {CatalogoResponse | null} moneda
   */
  moneda: CatalogoResponse | null;

  /**
   * Representa el propietario de la obra de arte.
   * 
   * @property {string} propietario
   */
  propietario: string;

  /**
   * Representa la fracción arancelaria seleccionada del catálogo.
   * Puede ser nulo si no se ha seleccionado una fracción arancelaria.
   * 
   * @property {CatalogoResponse | null} fraccionArancelaria
   */
  fraccionArancelaria: CatalogoResponse | null;

  /**
   * Representa la descripción de la fracción arancelaria.
   * 
   * @property {string} descripcionArancelaria
   */
  descripcionArancelaria: string;

  /**
   * Arreglo que contiene los datos de las obras de arte.
   * Cada obra de arte está representada por un objeto del tipo TablaDatos.
   * 
   * @property {TablaDatos[]} ObraDeArte
   */
  ObraDeArte: TablaDatos[];
}

/**
 * Función que crea el estado inicial para el trámite 270201.
 * Esta función devuelve un objeto que representa el estado inicial con todos sus campos configurados con valores predeterminados.
 * 
 * @returns {Tramite270201State}
 */
export function createInitialState(): Tramite270201State {
  return {
    /**
     * Operación seleccionada del catálogo. Inicialmente es nulo.
     */
    tipoDeOperacion: null,

    /**
     * Movimiento seleccionado del catálogo. Inicialmente es nulo.
     */
    tipoDeMovimiento: null,

    /**
     * Motivo seleccionado del catálogo. Inicialmente es nulo.
     */
    motivo: null,

    /**
     * País seleccionado del catálogo. Inicialmente es nulo.
     */
    pais: null,

    /**
     * Ciudad donde se realiza el trámite. Inicialmente está vacío.
     */
    ciudad: '',

    /**
     * Medio de transporte seleccionado del catálogo. Inicialmente es nulo.
     */
    medioTransporte: null,

    /**
     * Aduana seleccionada del catálogo. Inicialmente es nula.
     */
    aduanaEntrada: null,

    /**
     * Autor de la obra de arte. Inicialmente está vacío.
     */
    autor: '',

    /**
     * Título de la obra de arte. Inicialmente está vacío.
     */
    titulo: '',

    /**
     * Técnica utilizada en la obra de arte. Inicialmente está vacío.
     */
    tecnicaDeRealizacion: '',

    /**
     * Alto de la obra de arte. Inicialmente está vacío.
     */
    alto: '',

    /**
     * Ancho de la obra de arte. Inicialmente está vacío.
     */
    ancho: '',

    /**
     * Profundidad de la obra de arte. Inicialmente está vacío.
     */
    profundidad: '',

    /**
     * Diámetro de la obra de arte. Inicialmente está vacío.
     */
    diametro: '',

    /**
     * Variables adicionales de la obra de arte. Inicialmente está vacío.
     */
    variables: '',

    /**
     * Año de creación de la obra de arte. Inicialmente está vacío.
     */
    anoDeCreacion: '',

    /**
     * Avalúo de la obra de arte. Inicialmente está vacío.
     */
    avaluo: '',

    /**
     * Moneda seleccionada del catálogo para el avalúo. Inicialmente es nula.
     */
    moneda: null,

    /**
     * Propietario de la obra de arte. Inicialmente está vacío.
     */
    propietario: '',

    /**
     * Fracción arancelaria seleccionada del catálogo. Inicialmente es nula.
     */
    fraccionArancelaria: null,

    /**
     * Descripción de la fracción arancelaria. Inicialmente está vacío.
     */
    descripcionArancelaria: '',

    /**
     * Arreglo que contiene los datos de las obras de arte. Inicialmente está vacío.
     */
    ObraDeArte: [],
  };
}

/** Store para manejar el estado del trámite 270201.  
 * Administra el estado `avisoSiglosState` con capacidad de reinicio. */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'avisoSiglosState', resettable: true })
export class Tramite270201Store extends Store<Tramite270201State> {

  /**
 * Constructor que inicializa el estado base del store usando `createInitialState`.
 */
  constructor() {
    super(createInitialState());
  }

  /**
 * @method setOperacion
 * @description
 * Actualiza el estado con la operación seleccionada.
 * @param {CatalogoResponse} tipoDeOperacion - La operación seleccionada.
 */
public setOperacion(tipoDeOperacion: CatalogoResponse): void {
  this.update((state) => ({
    ...state,
    tipoDeOperacion,
  }));
}

/**
 * @method setMovimiento
 * @description
 * Actualiza el estado con el movimiento seleccionado.
 * @param {CatalogoResponse} tipoDeMovimiento - El movimiento seleccionado.
 */
public setMovimiento(tipoDeMovimiento: CatalogoResponse): void {
  this.update((state) => ({
    ...state,
    tipoDeMovimiento,
  }));
}

/**
 * @method setMotivo
 * @description
 * Actualiza el estado con el motivo seleccionado.
 * @param {CatalogoResponse} motivo - El motivo seleccionado.
 */
public setMotivo(motivo: CatalogoResponse): void {
  this.update((state) => ({
    ...state,
    motivo,
  }));
}

/**
 * @method setPais
 * @description
 * Actualiza el estado con el país seleccionado.
 * @param {CatalogoResponse} pais - El país seleccionado.
 */
public setPais(pais: CatalogoResponse): void {
  this.update((state) => ({
    ...state,
    pais,
  }));
}

/**
 * @method setCiudad
 * @description
 * Actualiza el estado con la ciudad seleccionada.
 * @param {string} ciudad - La ciudad seleccionada.
 */
public setCiudad(ciudad: string): void {
  this.update((state) => ({
    ...state,
    ciudad,
  }));
}

/**
 * @method setTransporte
 * @description
 * Actualiza el estado con el medio de transporte seleccionado.
 * @param {CatalogoResponse} medioTransporte - El transporte seleccionado.
 */
public setTransporte(medioTransporte: CatalogoResponse): void {
  this.update((state) => ({
    ...state,
    medioTransporte,
  }));
}

/**
 * @method setAduana
 * @description
 * Actualiza el estado con la aduana seleccionada.
 * @param {CatalogoResponse} aduanaEntrada - La aduana seleccionada.
 */
public setAduana(aduanaEntrada: CatalogoResponse): void {
  this.update((state) => ({
    ...state,
    aduanaEntrada,
  }));
}

/**
 * @method setAutor
 * @description
 * Actualiza el estado con el autor de la obra de arte seleccionado.
 * @param {string} autor - El nombre del autor seleccionado.
 */
public setAutor(autor: string): void {
  this.update((state) => ({
    ...state,
    autor,
  }));
}

/**
 * @method setTitulo
 * @description
 * Actualiza el estado con el título de la obra de arte seleccionado.
 * @param {string} titulo - El título seleccionado.
 */
public setTitulo(titulo: string): void {
  this.update((state) => ({
    ...state,
    titulo,
  }));
}

/**
 * @method setTecnica
 * @description
 * Actualiza el estado con la técnica utilizada en la obra de arte seleccionada.
 * @param {string} tecnicaDeRealizacion - La técnica seleccionada.
 */
public setTecnica(tecnicaDeRealizacion: string): void {
  this.update((state) => ({
    ...state,
    tecnicaDeRealizacion,
  }));
}

  /**
 * @method setAlto
 * @description
 * Actualiza el estado con el alto de la obra de arte seleccionada.
 * @param {string} alto - El alto en centímetros.
 */
public setAlto(alto: string): void {
  this.update((state) => ({
    ...state,
    alto,
  }));
}

/**
 * @method setAncho
 * @description
 * Actualiza el estado con el ancho de la obra de arte seleccionada.
 * @param {string} ancho - El ancho en centímetros.
 */
public setAncho(ancho: string): void {
  this.update((state) => ({
    ...state,
    ancho,
  }));
}

/**
 * @method setProfundidad
 * @description
 * Actualiza el estado con la profundidad de la obra de arte seleccionada.
 * @param {string} profundidad - La profundidad en centímetros.
 */
public setProfundidad(profundidad: string): void {
  this.update((state) => ({
    ...state,
    profundidad,
  }));
}

/**
 * @method setDiametro
 * @description
 * Actualiza el estado con el diámetro de la obra de arte seleccionada.
 * @param {string} diametro - El diámetro en centímetros.
 */
public setDiametro(diametro: string): void {
  this.update((state) => ({
    ...state,
    diametro,
  }));
}

/**
 * @method setVariables
 * @description
 * Actualiza el estado con las variables adicionales de la obra de arte seleccionada.
 * @param {string} variables - Las variables adicionales.
 */
public setVariables(variables: string): void {
  this.update((state) => ({
    ...state,
    variables,
  }));
}

  /**
 * @method setAnoDeCreacion
 * @description
 * Actualiza el estado con el año de creación de la obra de arte seleccionada.
 * @param {string} anoDeCreacion - El año de creación de la obra.
 */
public setAnoDeCreacion(anoDeCreacion: string): void {
  this.update((state) => ({
    ...state,
    anoDeCreacion,
  }));
}

/**
 * @method setAvaluo
 * @description
 * Actualiza el estado con el avalúo de la obra de arte seleccionada.
 * @param {string} avaluo - El valor estimado de la obra.
 */
public setAvaluo(avaluo: string): void {
  this.update((state) => ({
    ...state,
    avaluo,
  }));
}

/**
 * @method setMoneda
 * @description
 * Actualiza el estado con la moneda asociada al avalúo de la obra de arte seleccionada.
 * @param {CatalogoResponse} moneda - La moneda seleccionada.
 */
public setMoneda(moneda: CatalogoResponse): void {
  this.update((state) => ({
    ...state,
    moneda,
  }));
}

/**
 * @method setPropietario
 * @description
 * Actualiza el estado con el propietario de la obra de arte seleccionada.
 * @param {string} propietario - El nombre del propietario.
 */
public setPropietario(propietario: string): void {
  this.update((state) => ({
    ...state,
    propietario,
  }));
}

/**
 * @method setFraccionArancelaria
 * @description
 * Actualiza el estado con la fracción arancelaria asociada.
 * @param {CatalogoResponse} fraccionArancelaria - La fracción arancelaria seleccionada.
 */
public setFraccionArancelaria(
  fraccionArancelaria: CatalogoResponse
): void {
  this.update((state) => ({
    ...state,
    fraccionArancelaria,
  }));
}

/**
 * @method setDescripcionArancelaria
 * @description
 * Actualiza el estado con la descripción arancelaria de los bienes relacionados.
 * @param {string} descripcionArancelaria - La descripción arancelaria.
 */
public setDescripcionArancelaria(
  descripcionArancelaria: string
): void {
  this.update((state) => ({
    ...state,
    descripcionArancelaria,
  }));
}

/**
 * @method setObraDeArte
 * @description
 * Actualiza el estado con los datos de la obra de arte seleccionada.
 * @param {TableData[]} obraDeArte - Lista de obras de arte.
 */
public setObraDeArte(obraDeArte: TablaDatos[]): void {
  this.update((state) => ({
    ...state,
    ObraDeArte: obraDeArte,
  }));
}

}
