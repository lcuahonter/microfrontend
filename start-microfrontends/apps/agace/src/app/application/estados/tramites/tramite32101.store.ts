import { Store, StoreConfig } from '@datorama/akita';
import { DatosDeLaTabla } from '../../tramites/32101/models/datos-tramite.model';
import { Injectable } from '@angular/core';

/**
 * Representa un catálogo con un identificador único y una descripción.
 */
export interface Catalogo {
  id: number;
  descripcion: string;
}

/**
 * Creacion del estado inicial para la interfaz de tramite 32101
 * @returns Solicitud32502
 */
/**
 * Representa el estado de la solicitud 32101.
 */
export interface Solicitud32101State {
  /**
   * Lista de tipos de inversión disponibles.
   * Puede ser un arreglo de objetos de tipo `Catalogo` o `null`.
   */
  tipoDeInversion: Catalogo[] | null;

  /**
   * Valor en pesos asociado a la solicitud.
   */
  valorEnPesos: string;

  /**
   * Descripción general de la solicitud.
   */
  descripcionGeneral: string;

  /**
   * Lista de documentos relacionados con la solicitud.
   */
  listaDeDocumentos: string;

  /**
   * Comprobante asociado a la solicitud.
   */
  comprobante: string;

  /**
   * Datos del contenedor representados como un arreglo de objetos de tipo `datosDeLaTabla`.
   */
  datosDelContenedor: DatosDeLaTabla[];

  /**
   * Información específica de un elemento de la tabla.
   * Puede ser un objeto de tipo `datosDeLaTabla` o `null`.
   */
  abc: DatosDeLaTabla | null;

  /**
   * Manifiesto número 1 relacionado con la solicitud.
   */
  manifiesto1: string;

  /**
   * Manifiesto número 2 relacionado con la solicitud.
   */
  manifiesto2: string;

  /**
   * Manifiesto número 3 relacionado con la solicitud.
   */
  manifiesto3: string;

  /**
   * Clave de referencia única para la solicitud.
   */
  claveDeReferencia: string;

  /**
   * Importe de pago asociado a la solicitud.
   */
  importeDePago: string;

  /**
   * Cadena proporcionada por la dependencia correspondiente.
   */
  cadenaDeLaDependencia: string;

  /**
   * Número de operación relacionado con la solicitud.
   */
  numeroDeOperacion: string;

  /**
   * Lista de bancos disponibles.
   * Puede ser un arreglo de objetos de tipo `Catalogo` o `null`.
   */
  banco: Catalogo[] | null;

  /**
   * Llave única de pago asociada a la solicitud.
   */
  llaveDePago: string;

  /**
   * Fecha inicial ingresada en formato de cadena.
   */
  fechaInicialInput: string;
}

/**
 * Crea el estado inicial para la solicitud 32101.
 * 
 * @returns {Solicitud32101State} El estado inicial con valores predeterminados.
 * 
 * Propiedades del estado inicial:
 * - `tipoDeInversion`: Tipo de inversión, inicialmente `null`.
 * - `valorEnPesos`: Valor en pesos, inicialmente `0`.
 * - `descripcionGeneral`: Descripción general, inicialmente una cadena vacía.
 * - `listaDeDocumentos`: Lista de documentos, inicialmente una cadena vacía.
 * - `datosDelContenedor`: Datos del contenedor, inicialmente un arreglo vacío.
 * - `abc`: Propiedad adicional, inicialmente `null`.
 * - `manifiesto1`: Manifiesto 1, inicialmente una cadena vacía.
 * - `manifiesto2`: Manifiesto 2, inicialmente una cadena vacía.
 * - `manifiesto3`: Manifiesto 3, inicialmente una cadena vacía.
 * - `claveDeReferencia`: Clave de referencia, inicialmente `0`.
 * - `importeDePago`: Importe de pago, inicialmente `0`.
 * - `cadenaDeLaDependencia`: Cadena de la dependencia, inicialmente una cadena vacía.
 * - `numeroDeOperacion`: Número de operación, inicialmente `0`.
 * - `banco`: Banco, inicialmente `null`.
 * - `llaveDePago`: Llave de pago, inicialmente `0`.
 * - `fechaInicialInput`: Fecha inicial de entrada, inicialmente una cadena vacía.
 */
export function createInitialState(): Solicitud32101State {
  return {
    tipoDeInversion: null,
    valorEnPesos: '',
    descripcionGeneral: '',
    listaDeDocumentos: '',
    comprobante: '',
    datosDelContenedor: [],
    abc: null,
    manifiesto1: '',
    manifiesto2: '',  
    manifiesto3: '',
    claveDeReferencia: '',
    importeDePago: '',
    cadenaDeLaDependencia: '',
    numeroDeOperacion: '',
    banco: null,
    llaveDePago: '',
    fechaInicialInput: '',
    
  };
}

@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite32101', resettable: true })
export class Tramite32101Store extends Store<Solicitud32101State> {
  constructor() {
    super(createInitialState());
  }
  /**
   * Establece el tipo de inversión en el estado de la tienda.
   *
   * @param tipoDeInversion - Un arreglo de objetos del tipo `Catalogo` que representa el tipo de inversión.
   */
  public setTipoDeInversion(tipoDeInversion: Catalogo[]): void {
    this.update((state) => ({
      ...state,
      tipoDeInversion,
    }));
  }

  /**
   * Establece el valor en pesos en el estado de la tienda.
   *
   * @param valorEnPesos - El nuevo valor en pesos que se debe asignar al estado.
   */
  public setValorEnPesos(valorEnPesos: string): void {
    this.update((state) => ({
      ...state,
      valorEnPesos,
    }));
  }

  /**
   * Establece la descripción general en el estado de la tienda.
   *
   * @param descripcionGeneral - La nueva descripción general que se asignará al estado.
   */
  public setDescripcionGeneral(descripcionGeneral: string): void {
    this.update((state) => ({
      ...state,
      descripcionGeneral,
    }));
  }

/**
   * Establece la comprobante en el estado de la tienda.
   *
   * @param comprobante - La nueva comprobante que se asignará al estado.
   */
  public setComprobante(comprobante: string): void {
    this.update((state) => ({
      ...state,
      comprobante,
    }));
  }  

  /**
   * Establece el valor de "abc" en el estado de la tienda.
   *
   * @param abc - Los datos de la tabla que se asignarán al estado.
   */
  public setAbc(abc: DatosDeLaTabla): void {
    this.update((state) => ({
      ...state,
      abc,
    }));
  }

  /**
   * Establece el valor de `manifiesto1` en el estado de la tienda.
   *
   * @param manifiesto1 - El nuevo valor para el campo `manifiesto1`.
   */
  public setManifiesto1(manifiesto1: string): void {
    this.update((state) => ({
      ...state,
      manifiesto1,
    }));
  }

  /**
   * Establece el valor de `manifiesto2` en el estado de la tienda.
   *
   * @param manifiesto2 - El nuevo valor para la propiedad `manifiesto2`.
   */
  public setManifiesto2(manifiesto2: string): void {
    this.update((state) => ({
      ...state,
      manifiesto2,
    }));
  }

  /**
   * Establece el valor de `manifiesto3` en el estado de la tienda.
   *
   * @param manifiesto3 - El nuevo valor para la propiedad `manifiesto3`.
   */
  public setManifiesto3(manifiesto3: string): void {
    this.update((state) => ({
      ...state,
      manifiesto3,
    }));
  }

  /**
   * Establece la clave de referencia en el estado de la tienda.
   *
   * @param claveDeReferencia - El número que representa la clave de referencia a establecer.
   */
  public setClaveDeReferencia(claveDeReferencia: string): void {
    this.update((state) => ({
      ...state,
      claveDeReferencia,
    }));
  }

  /**
   * Establece el importe de pago en el estado de la tienda.
   *
   * @param importeDePago - El nuevo importe de pago que se debe asignar.
   */
  public setImporteDePago(importeDePago: string): void {
    this.update((state) => ({
      ...state,
      importeDePago,
    }));
  }

  /**
   * Establece el valor de la cadena de la dependencia en el estado.
   *
   * @param cadenaDeLaDependencia - La nueva cadena de la dependencia que se establecerá en el estado.
   */
  public setCadenaDeLaDependencia(cadenaDeLaDependencia: string): void {
    this.update((state) => ({
      ...state,
      cadenaDeLaDependencia,
    }));
  }

  /**
   * Establece el número de operación en el estado de la tienda.
   *
   * @param numeroDeOperacion - El número de operación que se debe asignar al estado.
   */
  public setNumeroDeOperacion(numeroDeOperacion: string): void {
    this.update((state) => ({
      ...state,
      numeroDeOperacion,
    }));
  }

  /**
   * Establece el valor del banco en el estado de la tienda.
   *
   * @param banco - Un arreglo de objetos de tipo `Catalogo` que representa el banco a establecer.
   */
  public setBanco(banco: Catalogo[]): void {
    this.update((state) => ({
      ...state,
      banco,
    }));
  }

  /**
   * Establece el valor de la llave de pago en el estado.
   *
   * @param llaveDePago - El número que representa la llave de pago a establecer.
   */
  public setLlaveDePago(llaveDePago: string): void {
    this.update((state) => ({
      ...state,
      llaveDePago,
    }));
  }

  /**
   * Establece el valor de `fechaInicialInput` en el estado de la tienda.
   *
   * @param fechaInicialInput - La fecha inicial proporcionada como una cadena de texto.
   */
  public setFechaInicialInput(fechaInicialInput: string): void {
    this.update((state) => ({
      ...state,
      fechaInicialInput,
    }));
  }

  /**
   * Establece la lista de documentos en el estado.
   *
   * @param listaDeDocumentos - La nueva lista de documentos que se asignará al estado.
   */
  public setListaDeDocumentos(listaDeDocumentos: string): void {
    this.update((state) => ({
      ...state,
      listaDeDocumentos,
    }));
  }

  /**
   * Establece los datos del contenedor en el estado de la tienda.
   *
   * @param datosDelContenedor - Un arreglo de objetos de tipo `datosDeLaTabla` que representa los datos a actualizar en el contenedor.
   */
  public setDatosDelContenedor(datosDelContenedor: DatosDeLaTabla[]): void {
    this.update((state) => ({
      ...state,
      datosDelContenedor,
    }));
  }
}