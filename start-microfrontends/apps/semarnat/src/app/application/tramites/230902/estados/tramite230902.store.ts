import { Injectable } from '@angular/core';

import { Store, StoreConfig } from '@datorama/akita';

import { ConfiguracionItem } from '../enum/mercancia.enum';
import { TereceorsConfiguracionItem as TercerosConfiguracionItem } from '../enum/tereceors.enum';


/**
 * Creación del estado inicial para la interfaz de trámite.
 * Define las propiedades necesarias para gestionar el estado del trámite 230902.
 */
export interface Solicitud230902State {
  /** Tipo de movimiento seleccionado en el trámite. */
  tipodeMovimiento: string;

  /** Tipo de régimen seleccionado en el trámite. */
  tipoRegimen: string;

  /** Entidad federativa seleccionada en el trámite. */
  entidadFederativa: string;

  /** Clave de referencia proporcionada para el trámite. */
  claveDeReferencia: string;

  /** Cadena de pago de dependencia asociada al trámite. */
  cadenaPagoDependencia: string;

  /** Banco para el pago del trámite. */
  banco: string;

  /** Llave de pago proporcionada para el trámite. */
  llaveDePago: string;

  /** Fecha de pago registrada en el trámite. */
  fecPago: string;

  /** Importe del pago realizado para el trámite. */
  impPago: Date | null;

  /** Indica si el popup está abierto. */
  popupAbierto: boolean;

  /** Indica si el popup está cerrado. */
  popupCerrado: boolean;

  /** Datos de la tabla de mercancías asociada al trámite. */
  mercanciaTablaDatos: ConfiguracionItem[];

  /** Datos de la tabla de terceros asociada al trámite. */
  tercerosTablaDatos: TercerosConfiguracionItem[];

  /** Lista original de aduanas. */
  listaOriginalAduanas:string[];

  /** Lista de aduanas seleccionadas. */
  listaSeleccionadaAduanas:string[];

  /** Lista original de movimientos. */
  listaOriginalMovimiento: string[];
  
  /** Lista de movimientos seleccionados. */
  listaSeleccionadaMovimiento: string[];

    /**
   * @property {string} codigoPostal
   * @description
   * Código postal capturado en el formulario de datos generales de terceros.
   * Campo opcional que almacena la información postal del destinatario.
   */
  codigoPostal?: string;
  
  /**
   * @property {string} pais
   * @description
   * Identificador del país seleccionado en el formulario de datos generales de terceros.
   * Campo opcional que almacena el ID del país del destinatario.
   */
  pais?: string;
  
  /**
   * @property {string} estado
   * @description
   * Identificador del estado o entidad federativa seleccionado en el formulario de datos generales de terceros.
   * Campo opcional que almacena el ID del estado del destinatario.
   */
  estado?: string;
  
  /**
   * @property {string} nombre
   * @description
   * Nombre del domicilio capturado en el formulario de datos generales de terceros.
   * Campo opcional que almacena la descripción del domicilio del destinatario.
   */
  nombre?: string;
  
  /**
   * @property {TercerosConfiguracionItem[]} listaseleccionadaDestinatario
   * @description
   * Array que contiene los elementos seleccionados en la tabla de destinatarios de terceros.
   * Se utiliza para identificar qué registros han sido marcados para operaciones como modificar o eliminar.
   */
  listaseleccionadaDestinatario: TercerosConfiguracionItem[];

  /** Identificador único para la mercancía. */
  id: number;
  /**
     * @description
     * Fracción arancelaria de la mercancía.
     */ 
    fraccionArancelaria: string;
    /**
     * @description
     * Descripción de la fracción arancelaria.
     */
    fraccionDescripcion : string;
    /**
     * @description
     * Indica si la mercancía pertenece a otra fracción.
     */
    otraFraccion: boolean;
  
    /**
     * @description
     * Descripción de la mercancía.
     */
    descripcion: string;
  
    /**
     * @description
     * Clasificación taxonómica de la mercancía.
     */
    clasificacionTaxonomica: string;
  
    /**
     * @description
     * Rendimiento del producto.
     */
    rendimientoProducto: string;
  
    /**
     * @description
     * Nombre científico de la mercancía.
     */
    nombreCientifico: string;
  
    /**
     * @description
     * Nombre común de la mercancía.
     */
    nombreComun: string;
  
    /**
     * @description
     * Marca o marcaje de la mercancía.
     */
    marca: string;
  
    /**
     * @description
     * cantidad de la mercancía.
     */
    cantidad: string;
  
    /**
     * @description
     * Unidad de medida de la mercancía.
     */
    unidadMedida: string;
  
    /**
     * @description
     * País de origen de la mercancía.
     */
    paisOrigen: string;
  
    /**
     * @description
     * País de procedencia de la mercancía.
     */
    paisProcedencia: string;

}

export function createInitialState(): Solicitud230902State {
  return {
    tipodeMovimiento: '',
    tipoRegimen: '',
    entidadFederativa: '',
    claveDeReferencia: '',
    cadenaPagoDependencia: '',
    banco: '',
    llaveDePago: '',
    fecPago: '',
    impPago: null,
    popupAbierto: false,
    popupCerrado: true,
    mercanciaTablaDatos: [],
    tercerosTablaDatos: [],
    listaOriginalAduanas: [],
    listaSeleccionadaAduanas: [],
    listaOriginalMovimiento: [],
    listaSeleccionadaMovimiento: [],
    codigoPostal: '',
    pais: '1',
    estado: '',
    nombre: '',
    listaseleccionadaDestinatario: [],
    id: 0,
    fraccionArancelaria: '',
    fraccionDescripcion: '',
    otraFraccion: false,
    descripcion: '',
    rendimientoProducto: '',
    clasificacionTaxonomica: '',
    nombreCientifico: '',
    nombreComun: '',
    marca: '',
    cantidad: '',
    unidadMedida: '',
    paisOrigen: '',
    paisProcedencia: '',
  };
}

@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite230902', resettable: true })
export class Tramite230902Store extends Store<Solicitud230902State> {

  constructor() {
    super(createInitialState());
  }

  /**
  * @método
  * @nombre establecerDatos
  * @descripción
  * Actualiza el estado con los valores proporcionados.
  * 
  * @param {Partial<Tramites30401State>} datos - Valores parciales para actualizar el estado.
  */
  public establecerDatos(datos: Partial<Solicitud230902State>): void {    
    this.update((state) => ({
     ...state,
     ...datos,
   }));
  }

  /**
   * Establece la fecha de pago en el estado.
   * 
   * {string} fecPago - Fecha de pago proporcionada.
   */
  public setfecPago(fecPago: string): void {
    this.update((state) => ({
      ...state,
      fecPago,
    }));
  }

  /**
   * Establece el estado del popup como abierto.
   * 
   * {boolean} popupAbierto - Indica si el popup está abierto.
   */
  public setIsPopupOpen(popupAbierto: boolean): void {
    this.update((state) => ({
      ...state,
      popupAbierto,
    }));
  }

  /**
   * Establece el estado del popup como cerrado.
   * 
   * {boolean} popupCerrado - Indica si el popup está cerrado.
   */
  public setIsPopupClose(popupCerrado: boolean): void {
    this.update((state) => ({
      ...state,
      popupCerrado,
    }));
  }

  /**
   * Establece los datos de la tabla de mercancías en el estado.
   * 
   * {ConfiguracionItem[]} mercanciaTablaDatos - Datos de la tabla de mercancías.
   */
  public setMercanciaTablaDatos(mercanciaTablaDatos: ConfiguracionItem[]): void {
    this.update((state) => ({
      ...state,
      mercanciaTablaDatos,
    }));
  }

  /**
   * Establece los datos de la tabla de terceros en el estado.
   * 
   * {TercerosConfiguracionItem[]} tercerosTablaDatos - Datos de la tabla de terceros.
   */
  public setTercerosTablaDatos(tercerosTablaDatos: TercerosConfiguracionItem[]): void {
    this.update((state) => ({
      ...state,
      tercerosTablaDatos,
    }));
  }

  public setListaOriginalAduanas(listaOriginalAduanas: string[]): void {
    this.update((state) => ({
      ...state,
      listaOriginalAduanas,
    }));
  }
  public setListaSeleccionadaAduanas(listaSeleccionadaAduanas: string[]): void {
    this.update((state) => ({
      ...state,
      listaSeleccionadaAduanas,
    }));
  }

  public setListaOriginalMovimiento(listaOriginalMovimiento: string[]): void {
    this.update((state) => ({
      ...state,
      listaOriginalMovimiento,
    }));
  }
  public setListaSeleccionadaMovimiento(listaSeleccionadaMovimiento: string[]): void {
    this.update((state) => ({
      ...state,
      listaSeleccionadaMovimiento,
    }));
  }

}
