import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';


/**
 * Interfaz que define el estado del trámite 230101.
 */
export interface Solicitud230101State {

  /**
   * Valor clave del trámite.
   */
  regimen: string;

  /**
   * Tipo de producto relacionado con el trámite.
   */
  tipoProducto: string;

  /**
   * País de procedencia del producto.
   */
  paisProcedencia: string;

  /**
   * Opciones seleccionadas en el trámite.
   */
  selectedOptions: boolean[];

  /**
   * Clasificación de las mercancías.
   */
  clasificacionMercancia: string;

  /**
   * Fracción arancelaria del producto.
   */
  fraccionArancelaria: string;

  /**
   * Descripción de la fracción arancelaria.
   */
  descFraccionArancelaria: string;

  /**
   * Cantidad del producto.
   */
  cantidad: string;

  /**
   * Cantidad del producto en letras.
   */
  cantidadLetra: string;

  /**
   * Género del producto.
   */
  genero: string;

  /**
   * Especie del producto.
   */
  especie: string;

  /**
   * Nombre común del producto.
   */
  nombreComun: string;

  /**
   * Descripción del producto.
   */
  descripcionProducto: string;

  /**
   * Unidad de medida del producto.
   */
  cantidadUMC: string;

  /**
   * Indica si hay manifiestos y descripción.
   */
  manifiestosYdesc: boolean;


  /**
   * Clave de referencia del trámite.
   */
  claveDeReferencia: string;

  /**
   * Cadena de dependencia asociada al trámite.
   */
  cadenaPagoDependencia: string;

  /**
   * Banco relacionado con el trámite.
   */
  banco: string;

  /**
   * Llave de pago del trámite.
   */
  llaveDePago: string;

  /**
   * Fecha de pago del trámite.
   */
  fecPago: string;

  /**
   * Importe del pago realizado.
   */
  impPago: string;
/**
 * Rango de días seleccionado.
 */
seleccionarsRangoDias: string,

/**
 * País de origen seleccionado.
 */
seleccionePaisOrigen: string,

/**
 * Destino seleccionado.
 */
seleccionarsDestino: string,

/**
 * Rango de días seleccionado para las aduanas.
 */
seleccionarsRangoDiasAduanas: string,

/**
 * Rango de días seleccionado para el país de origen.
 */
seleccionarsRangoDiasPaisOrigen: string,

/**
 * Rango de días seleccionado para el destino.
 */
seleccionarsRangoDiasDestino: string,
}

/**
 * Crea el estado inicial para la interfaz de trámite 230101.
 * @returns {Solicitud230101State} Estado inicial del trámite.
 */
export function createInitialSolicitudState(): Solicitud230101State {
  return {
   /**
 * Régimen del trámite.
 */
regimen: '',

/**
 * Tipo de producto relacionado con el trámite.
 */
tipoProducto: '',

/**
 * País de procedencia del producto.
 */
paisProcedencia: '',

/**
 * Opciones seleccionadas en el trámite.
 */
selectedOptions: [false, false, false],

/**
 * Clasificación de las mercancías.
 */
clasificacionMercancia: '',

/**
 * Fracción arancelaria del producto.
 */
fraccionArancelaria: '',

/**
 * Descripción de la fracción arancelaria.
 */
descFraccionArancelaria: '',

/**
 * Cantidad del producto.
 */
cantidad: '',

/**
 * Cantidad del producto en letras.
 */
cantidadLetra: '',

/**
 * Género del producto.
 */
genero: '',

/**
 * Especie del producto.
 */
especie: '',

/**
 * Nombre común del producto.
 */
nombreComun: '',

/**
 * Descripción del producto.
 */
descripcionProducto: '',

/**
 * Unidad de medida del producto.
 */
cantidadUMC: '',

/**
 * Indica si hay manifiestos y descripción.
 */
manifiestosYdesc: false,

/**
 * Clave de referencia del trámite.
 */
claveDeReferencia: '',

/**
 * Cadena de dependencia asociada al trámite.
 */
cadenaPagoDependencia: '',

/**
 * Banco relacionado con el trámite.
 */
banco: '',

/**
 * Llave de pago del trámite.
 */
llaveDePago: '',

/**
 * Fecha de pago del trámite.
 */
fecPago: '',

/**
 * Importe del pago realizado.
 */
impPago: '',
/**
 * Rango de días seleccionado.
 */
seleccionarsRangoDias: '',

/**
 * País de origen seleccionado.
 */
seleccionePaisOrigen: '',

/**
 * Destino seleccionado.
 */
seleccionarsDestino: '',

/**
 * Rango de días seleccionado para las aduanas.
 */
seleccionarsRangoDiasAduanas: '',

/**
 * Rango de días seleccionado para el país de origen.
 */
seleccionarsRangoDiasPaisOrigen: '',

/**
 * Rango de días seleccionado para el destino.
 */
seleccionarsRangoDiasDestino: ''

  };
}

/**
 * Store para gestionar el estado del trámite 230101.
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'solicitud230101', resettable: true })
export class Solicitud230101Store extends Store<Solicitud230101State> {
  constructor() {
    super(createInitialSolicitudState());
  }

  /**
   * Actualiza el valor de la propiedad clave.
   * @param {string} clave - Nuevo valor para clave.
   */
  public setRegimen(regimen: string): void {
    this.update((state) => ({
      ...state,
      regimen
    }));
  }

  /**
   * Actualiza el valor del tipo de producto.
   * @param {string} tipoProducto - Nuevo valor para tipo de producto.
   */
  public setTipoProducto(tipoProducto: string): void {
    this.update((state) => ({
      ...state,
      tipoProducto
    }));
  }

  /**
   * Actualiza el país de procedencia.
   * @param {string} paisProcedencia - Nuevo valor para país de procedencia.
   */
  public setPaisProcedencia(paisProcedencia: string): void {
    this.update((state) => ({
      ...state,
      paisProcedencia
    }));
  }

  /**
   * Actualiza las opciones seleccionadas.
   * @param {boolean[]} selectedOptions - Nuevas opciones seleccionadas.
   */
  public setSelectedOptions(selectedOptions: boolean[]): void {
    this.update((state) => ({
      ...state,
      selectedOptions
    }));
  }

  /**
   * Actualiza la clasificación de mercancías.
   * @param {string} clasificacionMercancia - Nueva clasificación de mercancías.
   */
  public setClasificacionMercancia(clasificacionMercancia: string): void {
    this.update((state) => ({
      ...state,
      clasificacionMercancia
    }));
  }

  /**
   * Actualiza la fracción arancelaria.
   * @param {string} fraccionArancelaria - Nueva fracción arancelaria.
   */
  public setFraccionArancelaria(fraccionArancelaria: string): void {
    this.update((state) => ({
      ...state,
      fraccionArancelaria
    }));
  }

  /**
   * Actualiza la descripción de la fracción arancelaria.
   * @param {string} descFraccionArancelaria - Nueva descripción de la fracción arancelaria.
   */
  public setDescFraccionArancelaria(descFraccionArancelaria: string): void {
    this.update((state) => ({
      ...state,
      descFraccionArancelaria
    }));
  }

  /**
   * Actualiza la cantidad.
   * @param {string} cantidad - Nueva cantidad.
   */
  public setCantidad(cantidad: string): void {
    this.update((state) => ({
      ...state,
      cantidad
    }));
  }

  /**
   * Actualiza la cantidad en letra.
   * @param {string} cantidadLetra - Nueva cantidad en letra.
   */
  public setCantidadLetra(cantidadLetra: string): void {
    this.update((state) => ({
      ...state,
      cantidadLetra
    }));
  }

  /**
   * Actualiza el género.
   * @param {string} genero - Nuevo género.
   */
  public setGenero(genero: string): void {
    this.update((state) => ({
      ...state,
      genero
    }));
  }

  /**
   * Actualiza la especie.
   * @param {string} especie - Nueva especie.
   */
  public setEspecie(especie: string): void {
    this.update((state) => ({
      ...state,
      especie
    }));
  }

  /**
   * Actualiza el nombre común.
   * @param {string} nombreComun - Nuevo nombre común.
   */
  public setNombreComun(nombreComun: string): void {
    this.update((state) => ({
      ...state,
      nombreComun
    }));
  }

  /**
   * Actualiza la descripción del producto.
   * @param {string} descripcionProducto - Nueva descripción del producto.
   */
  public setDescripcionProducto(descripcionProducto: string): void {
    this.update((state) => ({
      ...state,
      descripcionProducto
    }));
  }

  /**
   * Actualiza la unidad de medida.
   * @param {string} unidadDeMedida - Nueva unidad de medida.
   */
  public setCantidadUMC(cantidadUMC: string): void {
    this.update((state) => ({
      ...state,
      cantidadUMC
    }));
  }

  /**
   * Actualiza el estado de manifiestos y descripción.
   * @param {boolean} manifiestosYdesc - Nuevo estado de manifiestos y descripción.
   */
  public setManifiestosYdesc(manifiestosYdesc: boolean): void {
    this.update((state) => ({
      ...state,
      manifiestosYdesc
    }));
  }

  /**
   * Actualiza la clave de referencia.
   * @param {string} claveDeReferencia - Nueva clave de referencia.
   */
  public setClaveDeReferencia(claveDeReferencia: string): void {
    this.update((state) => ({
      ...state,
      claveDeReferencia
    }));
  }

  /**
   * Actualiza la cadena de dependencia.
   * @param {string} cadenaPagoDependencia - Nueva cadena de dependencia.
   */
  public setCadenaPagoDependencia(cadenaPagoDependencia: string): void {
    this.update((state) => ({
      ...state,
      cadenaPagoDependencia
    }));
  }

  /**
   * Actualiza el banco.
   * @param {string} banco - Nuevo banco.
   */
  public setBanco(banco: string): void {
    this.update((state) => ({
      ...state,
      banco
    }));
  }

  /**
   * Actualiza la llave de pago.
   * @param {string} llaveDePago - Nueva llave de pago.
   */
  public setllaveDePago(llaveDePago: string): void {
    this.update((state) => ({
      ...state,
      llaveDePago
    }));
  }

  /**
   * Actualiza la fecha de pago.
   * @param {string} fecPago - Nueva fecha de pago.
   */
  public setFecPago(fecPago: string): void {
    this.update((state) => ({
      ...state,
      fecPago
    }));
  }

  /**
   * Actualiza el importe de pago.
   * @param {string} impPago - Nuevo importe de pago.
   */
  public setImpPago(impPago: string): void {
    this.update((state) => ({
      ...state,
      impPago
    }));
  }
 /**
 * Actualiza el rango de días seleccionado.
 * @param {string} seleccionarsRangoDias - Nuevo rango de días seleccionado.
 */
public setseleccionarsRangoDias(seleccionarsRangoDias: string): void {
  this.update((state) => ({
    ...state,
    seleccionarsRangoDias
  }));
}

/**
 * Actualiza el país de origen seleccionado.
 * @param {string} seleccionePaisOrigen - Nuevo país de origen seleccionado.
 */
public setseleccionePaisOrigen(seleccionePaisOrigen: string): void {
  this.update((state) => ({
    ...state,
    seleccionePaisOrigen
  }));
}

/**
 * Actualiza el destino seleccionado.
 * @param {string} seleccionarsDestino - Nuevo destino seleccionado.
 */
public setseleccionarsDestino(seleccionarsDestino: string): void {
  this.update((state) => ({
    ...state,
    seleccionarsDestino
  }));
}

/**
 * Actualiza el rango de días seleccionado para las aduanas.
 * @param {string} seleccionarsRangoDiasAduanas - Nuevo rango de días seleccionado para las aduanas.
 */
public setseleccionarsRangoDiasAduanas(seleccionarsRangoDiasAduanas: string): void {
  this.update((state) => ({
    ...state,
    seleccionarsRangoDiasAduanas
  }));
}

/**
 * Actualiza el rango de días seleccionado para el país de origen.
 * @param {string} seleccionarsRangoDiasPaisOrigen - Nuevo rango de días seleccionado para el país de origen.
 */
public setseleccionarsRangoDiasPaisOrigen(seleccionarsRangoDiasPaisOrigen: string): void {
  this.update((state) => ({
    ...state,
    seleccionarsRangoDiasPaisOrigen
  }));
}

/**
 * Actualiza el rango de días seleccionado para el destino.
 * @param {string} seleccionarsRangoDiasDestino - Nuevo rango de días seleccionado para el destino.
 */
public setseleccionarsRangoDiasDestino(seleccionarsRangoDiasDestino: string): void {
  this.update((state) => ({
    ...state,
    seleccionarsRangoDiasDestino
  }));
}

}