import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';


/**  Interfaz que define la estructura del estado para el store de Mercancias110202.
 */
export interface Mercancias110202State {
  fraccionArancelaria: string;
  nombreComercialMercancia: string;
  nombreTecnico: string;
  nombreIngles: string;
  criterioClasificacion: string;
  marca: string;
  cantidad: string;
  umc: string;
  valorMercancia: number;
  complementoClasificacion: string;
  masaBruta: number;
  unidadMedidaMasaBruta: string;
  numeroFactura: string;
  tipoFactura: string;
  fechaFinal: string;
  masaBrutas: string;    
  facturas: string;
   
}

/**
 * Crea el estado inicial para el store de Mercancias110202.
 * @returns {Mercancias110202State} El estado inicial con valores predeterminados.
 */
export function createInitialState(): Mercancias110202State {
  return {
    fraccionArancelaria: '',
    nombreComercialMercancia: '',
    nombreTecnico: '',
    nombreIngles: '',
    criterioClasificacion: '',
    marca: '',
    cantidad: '',
    umc: '',
    valorMercancia: 0,
    complementoClasificacion: '',
    masaBruta: 0,
    masaBrutas: '',
    unidadMedidaMasaBruta: '',
    numeroFactura: '',
    tipoFactura: '',
    fechaFinal: '',
     facturas: ''
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'mercanciaDatos' })
export class Mercancias110202Store extends Store<Mercancias110202State> {
  constructor() {
    super(createInitialState());
  }

  
/** 
 * Actualiza el nombre comercial de la mercancía en el estado. 
 * Se usa para sincronizar el valor con el formulario reactivo.
 * Afecta la propiedad 'nombreComercialMercancia'.
 */
setNombreComercialMercancia(value: string): void {
  this.update({ nombreComercialMercancia: value });
}

/** 
 * Actualiza la fracción arancelaria de la mercancía en el estado. 
 * Permite mantener sincronizado el valor desde el formulario.
 * Afecta la propiedad 'fraccionArancelaria'.
 */
setFraccionArancelaria(value: string): void {
  this.update({ fraccionArancelaria: value });
}

/** 
 * Actualiza el nombre técnico de la mercancía en el estado. 
 * Valor proveniente del formulario o catálogo técnico.
 * Afecta la propiedad 'nombreTecnico'.
 */
setNombreTecnico(value: string): void {
  this.update({ nombreTecnico: value });
}

/** 
 * Actualiza el nombre en inglés de la mercancía en el estado.
 * Se utiliza cuando el nombre técnico tiene traducción.
 * Afecta la propiedad 'nombreIngles'.
 */
setNombreIngles(value: string): void {
  this.update({ nombreIngles: value });
}

/** 
 * Actualiza el criterio de clasificación en el estado.
 * Refleja el método por el cual se clasificó la mercancía.
 * Afecta la propiedad 'criterioClasificacion'.
 */
setCriterioClasificacion(value: string): void {
  this.update({ criterioClasificacion: value });
}

/** 
 * Actualiza la marca de la mercancía en el estado.
 * Útil para productos con identificación comercial.
 * Afecta la propiedad 'marca'.
 */
setMarca(value: string): void {
  this.update({ marca: value });
}

/** 
 * Actualiza la cantidad de la mercancía en el estado.
 * Valor numérico proveniente del formulario.
 * Afecta la propiedad 'cantidad'.
 */
setCantidad(value: string): void {
  this.update({ cantidad: value });
}

/** 
 * Actualiza la unidad de medida comercial (UMC) en el estado.
 * Relacionado con el campo de unidad de cantidad del producto.
 * Afecta la propiedad 'umc'.
 */
setUmc(value: string): void {
  this.update({ umc: value });
}

/** 
 * Actualiza el valor de la mercancía en el estado.
 * Campo requerido para declaración del producto.
 * Afecta la propiedad 'valorMercancia'.
 */
setValorMercancia(value: number): void {
  this.update({ valorMercancia: value });
}

/** 
 * Actualiza el complemento de clasificación en el estado.
 * Puede contener información adicional de fracción o código.
 * Afecta la propiedad 'complementoClasificacion'.
 */
setComplementoClasificacion(value: string): void {
  this.update({ complementoClasificacion: value });
}

/** 
 * Actualiza la masa bruta de la mercancía en el estado.
 * Se utiliza para control de peso total declarado.
 * Afecta la propiedad 'masaBruta'.
 */
setMasaBruta(value: number): void {
  this.update({ masaBruta: value });
}

/** 
 * Actualiza la unidad de medida de la masa bruta en el estado.
 * Campo obligatorio para definir el tipo de unidad usada.
 * Afecta la propiedad 'unidadMedidaMasaBruta'.
 */
setUnidadMedidaMasaBruta(value: string): void {
  this.update({ unidadMedidaMasaBruta: value });
}

/** 
 * Actualiza el número de factura de la mercancía en el estado.
 * Relacionado con la factura comercial o proforma.
 * Afecta la propiedad 'numeroFactura'.
 */
setNumeroFactura(value: string): void {
  this.update({ numeroFactura: value });
}

/** 
 * Actualiza el tipo de factura en el estado.
 * Puede ser comercial, proforma, entre otras.
 * Afecta la propiedad 'tipoFactura'.
 */
setTipoFactura(value: string): void {
  this.update({ tipoFactura: value });
}

/** 
 * Actualiza la fecha final en el estado.
 * Valor relacionado con la vigencia o validez del registro.
 * Afecta la propiedad 'fechaFinal'.
 */
setFechaFinal(value: string): void {
  this.update({ fechaFinal: value });
}

/** 
 * Actualiza el campo masaBrutas en el estado.
 * Puede usarse para representar una lista de valores de peso.
 * Afecta la propiedad 'masaBrutas'.
 */
setMasaBrutas(value: string): void {
  this.update({ masaBrutas: value });
}

/** 
 * Actualiza el campo facturas en el estado.
 * Puede representar el tipo o catálogo de facturación.
 * Afecta la propiedad 'facturas'.
 */
setFacturas(value: string): void {
  this.update({ facturas: value });
}

  
}
