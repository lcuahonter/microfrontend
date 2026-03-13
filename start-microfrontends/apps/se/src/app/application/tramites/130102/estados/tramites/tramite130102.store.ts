import { FraccionArancelariaProsec } from '../../models/octava-temporal.model';
import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { FraccionesProsecRequest, PartidaMercancia } from '../../models/request/regla-octava-request.model';

/**
 * Interfaz que define el estado de la solicitud 130102.
 * Contiene todas las propiedades necesarias para gestionar la información de la solicitud.
 */
export interface Solicitud130102State {
  idSolicitud: number; // ID de la solicitud.
  regimen?: string; // Régimen al que se destinará la mercancía.
  clasificacionRegimen?: string; // Clasificación del régimen.
  valorTotalUSD : string; // Valor total de la solicitud en dólares estadounidenses (USD).
  cantidadTotal: number; // Cantidad total de productos en la solicitud, se calcula a partir de las partidas.
  criterioDictamen : string; // Criterio de dictamen para la solicitud, puede ser un código o descripción.
  /** Código que identifica la fracción arancelaria específica del producto. */
  fraccion: string;

  /** Descripción detallada de la fracción arancelaria para mayor claridad. */
  descripcion: string;

  /** Código de la fracción arancelaria asignado según normativas vigentes. */
  fraccionArancelaria: string;

  /** Unidad de medida utilizada para cuantificar la mercancía (ej. kg, litros, piezas). */
  unidadMedida: string;

  /** Cantidad total de productos declarados en la solicitud. */
  cantidad: number;

  /** Valor total de la factura en dólares estadounidenses (USD). */
  valorFacturaUSD: string;

  /** Número total de partidas arancelarias incluidas en la solicitud. */
  cantidadPartidas: number;

  /** Código de la fracción arancelaria de acuerdo con la Tarifa de la Ley de los Impuestos Generales de Importación y Exportación (TIGIE). */
  fraccionArancelariaTIGIE: string;

  /** Versión específica del código TIGIE con formato especial o complementario. */
  fraccionArancelariaTIGIE_TIGIE: string;

  /** Descripción detallada de las partidas incluidas en la solicitud. */
  descripcionPartidas: string;

  /** Valor monetario en USD asignado a cada partida dentro de la solicitud. */
  valorPartidaUSD: number;

  /** Alternativa de código para la fracción arancelaria (puede ser de otra normativa o formato). */
  fraccionArancelariaProsec: string;

  /** Tipo de trámite solicitado relacionado con la mercancía (importación, exportación, etc.). */
  solicitudMercancia: string;

  /** Nombre de la entidad gubernamental o empresa responsable de la solicitud. */
  entidad: string;

  /** Identificación de la representación legal o administrativa involucrada en la solicitud. */
  representacion: string;

  /** Código o descripción del bloque de autorización dentro del proceso administrativo. */
  bloque: string;

  /** Justificación proporcionada para respaldar la solicitud de mercancía. */
  descripcionJustificacion: string;

  /** Comentarios o notas adicionales relevantes para la solicitud. */
  observaciones: string;

  /** Lista detallada de los productos incluidos en la solicitud, separados por un delimitador si es necesario. */
  productos: string;

  solicitud :string; // Indica si la solicitud está activa o pendiente de revisión.

  /** Lista de partidas temporales (octava regla) asociadas a la solicitud. */
  partidas_tabla?: PartidaMercancia[];

  /** Lista de usos específicos relacionados con fracciones arancelarias PROSEC. */
  lista_fracciones_prosec?: FraccionesProsecRequest[];

  paises?: string[]; // Lista de países involucrados en la solicitud.

  cadenaOriginal: string;
}
/**
 * Crea y devuelve el estado inicial de la solicitud.
 * @returns Solicitud130102State - Objeto con valores por defecto.
 */
export function createInitialState(): Solicitud130102State {
  return {
    idSolicitud: 0, // ID de la solicitud, inicializado en 0.
    regimen: '', // Régimen al que se destinará la mercancía, vacío por defecto.
    clasificacionRegimen: '', // Clasificación del régimen, vacío por defecto.
    valorTotalUSD:'', // Valor total de la solicitud en USD, vacío por defecto.
    cantidadTotal: 0, // Cantidad total de productos en cero por defecto.
    criterioDictamen: '', // Criterio de dictamen vacío por defecto.
    fraccion: '', // Valor inicial vacío.
    descripcion: '', // Descripción vacía por defecto.
    fraccionArancelaria: '', // Sin fracción arancelaria inicial.
    unidadMedida: '', // Unidad de medida no especificada.
    cantidad: 0, // Cantidad inicial en cero.
    valorFacturaUSD: '', // Valor de factura no definido.
    cantidadPartidas: 0, // Cantidad de partidas en cero.
    fraccionArancelariaTIGIE: '', // Sin fracción TIGIE asignada.
    fraccionArancelariaTIGIE_TIGIE: '', // Valor inicial vacío.
    descripcionPartidas: '', // Sin descripción inicial.
    valorPartidaUSD: 0, // Valor de partida inicial en cero.
    fraccionArancelariaProsec: '', // Sin fracción arancelaria inicial.
    solicitudMercancia: '', // Sin solicitud asignada.
    entidad: '', // Entidad no definida.
    representacion: '', // Representación vacía.
    bloque: '', // Sin bloque definido.
    descripcionJustificacion: '', // Justificación vacía.
    observaciones: '', // Sin observaciones iniciales.
    productos: '', // Sin productos asignados.
    solicitud : '', // Indica que la solicitud no está activa por defecto.
    partidas_tabla: [], // Lista de partidas vacía por defecto.
    lista_fracciones_prosec: [], // Lista de usos específicos vacía por defecto.;
    paises: [], // Lista de países vacía por defecto.
    cadenaOriginal: '',
  };
}

/**
 * Servicio encargado de manejar el estado del trámite 130102 usando Akita Store.
 * Permite actualizar y resetear los valores de la solicitud.
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite130102', resettable: true })
export class Tramite130102Store extends Store<Solicitud130102State> {
  constructor() {
    super(createInitialState()); // Inicializa el estado con los valores por defecto.
  }

  /**
   * Actualiza el ID de la solicitud en el estado.
   * @param idSolicitud - Nuevo ID de la solicitud.
   */
  public setIdSolicitud(idSolicitud: number):void {
    this.update((state) => ({
      ...state,
      idSolicitud,
    }));
  } 

  /**
   * Actualiza el valor total en dólares de la solicitud.
   * @param {string} valorTotalUSD - Nuevo valor total en dólares.
   */
  public setvalorTotalUSD(valorTotalUSD: string):void {
    this.update((state) => ({
      ...state,
      valorTotalUSD,
    }));
  }

  /**
   * Actualiza el régimen al que se destinará la mercancía.
   * @param {string} regimen - Nuevo régimen.
   */ 

  public setRegimen(regimen: string):void {
    this.update((state) => ({
      ...state,
      regimen,
    }));
  }

  /**
   * Actualiza  los paises.
   * @param paises - Lista de países involucrados en la solicitud.
   */
  public setPaises(paises: string[]):void {
    this.update((state) => ({
      ...state,
      paises,
    }));
  }

  /**
   * 
   * Actualiza la clasificación del régimen.
   * @param clasificacionRegimen - Nueva clasificación del régimen.
   */
  public setClasificacionRegimen(clasificacionRegimen: string):void {
    this.update((state) => ({
      ...state,
      clasificacionRegimen,
    }));
  } 

 /**
 * Actualiza la cantidad total de productos en la solicitud.
 * 
 * @param cantidadTotal - Nueva cantidad total de productos a establecer en el estado.
 * 
 * Este método actualiza el campo `cantidadTotal` dentro del estado de la solicitud 130102.
 * Se utiliza para reflejar el total de productos calculado a partir de las partidas ingresadas
 * por el usuario en el formulario. Es útil para mostrar el resumen de cantidades en la interfaz
 * y para validaciones posteriores en el flujo del trámite.
 */
  public setcantidadTotal(cantidadTotal : number):void{
    this.update((state) => ({
      ...state,
      cantidadTotal,
    }));
  }
 /**
 * Actualiza el criterio de dictamen de la solicitud.
 * 
 * @param criterioDictamen - Nuevo criterio de dictamen a establecer en el estado.
 * 
 * Este método actualiza el campo `criterioDictamen` dentro del estado de la solicitud 130102.
 * El criterio de dictamen puede ser un código o una descripción que determina el resultado
 * o la evaluación de la solicitud según las reglas del trámite. Es importante para el seguimiento
 * y la toma de decisiones administrativas.
 */
public setCriterioDictamen(criterioDictamen: string):void {
    this.update((state) => ({
      ...state,
      criterioDictamen,
    }));
  }
  /**
   * Actualiza el valor de la fracción arancelaria.
   * @param {string} fraccion - Nueva fracción arancelaria.
   */
  public setFraccion(fraccion: string):void {
    this.update((state) => ({
      ...state,
      fraccion,
    }));
  }

  /**
   * Actualiza la descripción del trámite.
   * @param {string} descripcion - Nueva descripción del trámite.
   */
  public setDescripcion(descripcion: string):void {
    this.update((state) => ({
      ...state,
      descripcion,
    }));
  }

  /**
   * Actualiza la fracción arancelaria.
   * @param {string} fraccionArancelaria - Nuevo valor de fracción arancelaria.
   */
  public setFraccionArancelaria(fraccionArancelaria: string):void {
    this.update((state) => ({
      ...state,
      fraccionArancelaria,
    }));
  }

  /**
   * Actualiza la unidad de medida.
   * @param {string} unidadMedida - Nueva unidad de medida.
   */
  public setUnidadMedida(unidadMedida: string):void {
    this.update((state) => ({
      ...state,
      unidadMedida,
    }));
  }

  /**
   * Actualiza la cantidad de productos.
   * @param {number} cantidad - Nueva cantidad.
   */
  public setcantidad(cantidad: number):void {
    this.update((state) => ({
      ...state,
      cantidad,
    }));
  }

  /**
   * Actualiza el valor de la factura en dólares USD.
   * @param {string} valorFacturaUSD - Nuevo valor de factura.
   */
  public setValorFacturaUSD(valorFacturaUSD: string):void {
    this.update((state) => ({
      ...state,
      valorFacturaUSD,
    }));
  }

  /**
   * Actualiza la cantidad de partidas.
   * @param {number} cantidadPartidas - Nueva cantidad de partidas.
   */
  public setCantidad_partidas(cantidadPartidas: number):void {
    this.update((state) => ({
      ...state,
      cantidadPartidas,
    }));
  }

  /**
   * Actualiza la fracción arancelaria TIGIE.
   * @param {string} fraccionArancelariaTIGIE - Nuevo valor.
   */
  public setFraccionArancelariaTIGIE(fraccionArancelariaTIGIE: string):void {
    this.update((state) => ({
      ...state,
      fraccionArancelariaTIGIE,
    }));
  }

  /**
   * Actualiza el código extendido de la fracción TIGIE.
   * @param {string} fraccionArancelariaTIGIE_TIGIE - Nuevo código.
   */
  public setFraccionArancelariaTIGIE_TIGIE(fraccionArancelariaTIGIE_TIGIE: string):void {
    this.update((state) => ({
      ...state,
      fraccionArancelariaTIGIE_TIGIE,
    }));
  }

  /**
   * Actualiza la descripción de las partidas.
   * @param {string} descripcionPartidas - Nueva descripción.
   */
  public setdescripcion_partidas(descripcionPartidas: string):void {
    this.update((state) => ({
      ...state,
      descripcionPartidas,
    }));
  }

  /**
   * Actualiza el valor en dólares de la partida.
   * @param {number} valorPartidaUSD - Nuevo valor.
   */
  public setvalorPartidaUSD(valorPartidaUSD: number):void {
    this.update((state) => ({
      ...state,
      valorPartidaUSD,
    }));
  }

  /**
   * Actualiza la fracción arancelaria.
   * @param {string} fraccionArancelariaProsec - Nueva fracción.
   */
  public setFraccionArancelariaProsec(fraccionArancelariaProsec: string):void {
    this.update((state) => ({
      ...state,
      fraccionArancelariaProsec,
    }));
  }

  /**
   * Actualiza la solicitud de mercancía.
   * @param {string} solicitudMercancia - Nueva solicitud.
   */
  public setsolicitudMercancia(solicitudMercancia: string):void {
    this.update((state) => ({
      ...state,
      solicitudMercancia,
    }));
  }

  /**
   * Actualiza la entidad.
   * @param {string} entidad - Nueva entidad.
   */
  public setEntidad(entidad: string):void {
    this.update((state) => ({
      ...state,
      entidad,
    }));
  }

  /**
   * Actualiza la representación.
   * @param {string} representacion - Nueva representación.
   */
  public setRepresentacion(representacion: string):void {
    this.update((state) => ({
      ...state,
      representacion,
    }));
  }

  /**
   * Actualiza el bloque del trámite.
   * @param {string} bloque - Nuevo bloque.
   */
  public setBloque(bloque: string):void {
    this.update((state) => ({
      ...state,
      bloque,
    }));
  }

  /**
   * Actualiza la justificación del trámite.
   * @param {string} descripcionJustificacion - Nueva justificación.
   */
  public setDescripcionJustificacion(descripcionJustificacion: string):void {
    this.update((state) => ({
      ...state,
      descripcionJustificacion,
    }));
  }

  /**
   * Actualiza las observaciones.
   * @param {string} observaciones - Nuevas observaciones.
   */
  public setObservaciones(observaciones: string):void {
    this.update((state) => ({
      ...state,
      observaciones,
    }));
  }

  /**
   * Actualiza los productos involucrados.
   * @param {string} productos - Nueva lista de productos.
   */
  public setProducto(productos: string):void {
    this.update((state) => ({
      ...state,
      productos,
    }));
  }
  /*
    * Actualiza el estado de la solicitud.
    * @param {string} solicitud - Nueva solicitud.
    */
  public setSolicitude(solicitud: string):void {
 this.update((state) => ({
      ...state,
      solicitud,
    }));
  }

  /**
   *  Actualiza el estado con el valor de la cadena original 
   * @param cadenaOriginal  texto de la cadena original
   */
  public setCadenaOriginal(cadenaOriginal: string):void { 
    this.update((state) => ({
      ...state,
      cadenaOriginal,
    }));
  }


  /**
   * Limpia todos los datos de la solicitud, restaurándolos a su estado inicial.
   */
  public limpiarSolicitud():void {
    this.reset();
  }

  /*
    * Actualiza el estado de la solicitud.
    * @param {string} solicitud - Nueva solicitud.
    */
  public setPartidasTabla(fieldName: string, value: PartidaMercancia[]):void {
    this.update((state) => ({
      ...state,
      [fieldName]: value,
    }));
  }

  /**
   * Set a value dynamically in the store by field name.
   * @param fieldName The name of the field to update.
   * @param value The value to set.
   */
  public setDynamicFieldValue(fieldName: string, value: unknown): void {
    this.update((state) => ({
      ...state,
      [fieldName]: value,
    }));
  }
  /**
 * Actualiza el estado con las fracciones arancelarias PROSEC proporcionadas.
 * @param uso Lista de fracciones arancelarias a asignar en el estado.
 */
  public setUsoEspecificoTablas(uso: FraccionesProsecRequest[]): void {
  this.update(state => ({
    ...state,
    lista_fracciones_prosec: uso
  }));
}
}
