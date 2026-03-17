import { DatosDetalle, DatosSolicitud } from '../models/datos-tramite.model';
import { Store, StoreConfig } from '@datorama/akita';
import { DestinatarioConfiguracionItem } from '../enum/destinatario-tabla.enum';
import { Injectable } from '@angular/core';

/**
 * Interfaz que representa un catálogo genérico.
 * Un catálogo contiene un identificador único y una descripción asociada.
 */
export interface Catalogo {
  /**
   * Identificador único del catálogo.
   * @type {number}
   */
  id: number;

  /**
   * Descripción del catálogo.
   * @type {string}
   */
  descripcion: string;
}

/**
 * Interfaz que representa el estado inicial de la solicitud 230201.
 */
export interface Solicitud230201State {
  /**
   * Lista de países de origen.
   */
  paisDeProcedencia: Catalogo[] | null;

  /**
   * Lista de oficinas de aduanas.
   */
  aduana: Catalogo[] | null;

  /**
   * Fechas seleccionadas para la solicitud.
   */
  fechasSeleccionadas: string[];

  /**
   * Lista de países.
   */
  pais: Catalogo[] | null;

  /**
   * Lista de estados o entidades.
   */
  entidades: Catalogo[] | null;

  /**
   * Descripción del producto.
   */
  descripcionProducto: Catalogo[] | null;

  /**
   * Detalles de la solicitud.
   */
  datosSolicitud: DatosSolicitud[];

  /**
   * Información detallada de la solicitud.
   */
  datosDetalle: DatosDetalle[];

  /**
   * Fracción arancelaria asociada al producto.
   */
  fraccionArancelaria: string;

  /**
   * Descripción de la fracción arancelaria.
   */
  descripcionFraccionArancelaria: string;

  /**
   * Cantidad del producto.
   */
  cantidad: string;

  /**
   * Cantidad del producto en palabras.
   */
  cantidadLetra: string;

  /**
   * Lista de géneros asociados al producto.
   */
  genero: Catalogo[] | null;

  /**
   * Lista de especies asociadas al producto.
   */
  especie: Catalogo[] | null;

  /**
   * Lista de nombres comunes del producto.
   */
  nombreComun: Catalogo[] | null;

  /**
   * Lista de unidades de medida.
   */
  unidadDeMedida: Catalogo[] | null;

  /**
   * Lugar de entrada.
   */
  lungarDeEntrada: string;

  /**
   * Destino del importador.
   */
  destinoDeImportador: string;

  /**
   * Lista de medios de transporte.
   */
  medioDeTransporte: Catalogo[] | null;

  /**
   * Número y descripción del producto.
   */
  numeroYDescripcion: string;

  /**
   * Código postal de la dirección.
   */
  codigoPostal: string;

  /**
   * Lista de estados.
   */
  estado: Catalogo[] | null;

  /**
   * Dirección de la calle.
   */
  calle: string;

  /**
   * Número exterior de la dirección.
   */
  numeroExterior: string;

  /**
   * Número interior de la dirección.
   */
  numeroInterior: string;

  /**
   * Colonia o barrio de la dirección.
   */
  colonia: string;

  /**
   * Estado del popup para terceros.
   */
  tercerosPopupState: boolean;

  /**
   * Lista de destinatarios configurados para la solicitud.
   */
  destinatarios: DestinatarioConfiguracionItem[];

  /**
   * Clave de referencia para la solicitud.
   */
  claveDeReferencia: string;

  /**
   * Cadena de dependencia asociada a la solicitud.
   */
  cadenaPagoDependencia: string;

  /**
   * Banco relacionado con la solicitud.
   */
  banco: Catalogo[] | null;

  /**
   * Llave de pago para la solicitud.
   */
  llaveDePago: string;

  /**
   * Fecha de pago para la solicitud.
   */
  fecPago: string;

  /**
   * Importe del pago realizado.
   */
  impPago: string;
}

/**
 * Función que crea el estado inicial de la solicitud 230201.
 * @returns Estado inicial de la solicitud.
 */
export function createInitialState(): Solicitud230201State {
  return {
    paisDeProcedencia: null,
    aduana: null,
    fechasSeleccionadas: [],
    pais: null,
    entidades: null,
    descripcionProducto: null,
    datosSolicitud: [],
    datosDetalle: [],
    fraccionArancelaria: '',
    descripcionFraccionArancelaria: '',
    cantidad: '',
    cantidadLetra: '',
    genero: null,
    especie: null,
    nombreComun: null,
    unidadDeMedida: null,
    lungarDeEntrada: '',
    destinoDeImportador: '',
    medioDeTransporte: null,
    numeroYDescripcion: '',
    codigoPostal: '',
    estado: null,
    calle: '',
    numeroExterior: '',
    numeroInterior: '',
    colonia: '',
    tercerosPopupState: false,
    claveDeReferencia: '',
    cadenaPagoDependencia: '',
    banco: null,
    llaveDePago: '',
    fecPago: '',
    impPago: '',
    destinatarios: [],
  };
}

/**
 * Clase que representa el store para manejar el estado de la solicitud 230201.
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite230201', resettable: true })
export class Tramite230201Store extends Store<Solicitud230201State> {

  /**
   * Constructor del store.
   * Inicializa el estado con los valores predeterminados.
   */
  constructor() {
    super(createInitialState());
  }

  /**
   * Establece la lista de paisDeProcedencia en el estado.
   * @param paisDeProcedencia Lista de paisDeProcedencia.
   */
  public setpaisDeProcedencia(paisDeProcedencia: Catalogo[]): void {
    this.update((state) => ({
      ...state,
      paisDeProcedencia,
    }));
  }

  /**
   * Establece la lista de aduanas en el estado.
   * @param aduana Lista de aduanas.
   */
  public setAduana(aduana: Catalogo[]): void {
    this.update((state) => ({
      ...state,
      aduana,
    }));
  }

  /**
   * Establece las fechas seleccionadas en el estado de la tienda.
   *
   * @param fechasSeleccionadas - Un arreglo de cadenas que representa las fechas seleccionadas.
   * 
   * Este método actualiza el estado de la tienda con las fechas proporcionadas.
   */
  public setFechasSeleccionadas(fechasSeleccionadas: string[]): void {
    this.update((state) => ({
      ...state,
      fechasSeleccionadas,
    }));
  }

  /**
   * Establece el catálogo de países en el estado de la tienda.
   *
   * @param pais - Una lista de objetos del tipo `Catalogo` que representa los países a establecer.
   */
  public setPais(pais: Catalogo[]): void {
    this.update((state) => ({
      ...state,
      pais,
    }));
  }

  /**
   * Actualiza el estado con una nueva lista de entidades.
   *
   * @param entidades - Un arreglo de objetos `Catalogo` que se establecerá como el nuevo valor para entidades en el estado.
   */
  public setEntidades(entidades: Catalogo[]): void {
    this.update((state) => ({
      ...state,
      entidades,
    }));
  }

  /**
   * Actualiza el estado con una nueva lista de descripciones de productos.
   *
   * @param descripcionProducto - Un arreglo de objetos `Catalogo` que representa las descripciones de productos a establecer.
   */
  public setDescripcionProducto(descripcionProducto: Catalogo[]): void {
    this.update((state) => ({
      ...state,
      descripcionProducto,
    }));
  }

  /**
   * Actualiza el estado con el arreglo proporcionado de `DatosSolicitud`.
   *
   * @param datosSolicitud - Un arreglo de objetos `DatosSolicitud` que se establecerá en el estado.
   */
  public setDatosSolicitud(datosSolicitud: DatosSolicitud[]): void {
    this.update((state) => ({
      ...state,
      datosSolicitud,
    }));
  }
  
  /**
   * Actualiza el estado con una nueva lista de detalles de la solicitud.
   *
   * @param datosDetalle - Un arreglo de objetos `DatosDetalle` que representa los detalles de la solicitud a establecer.
   */
  public setDatosDetalle(datosDetalle: DatosDetalle[]): void {
    this.update((state) => ({
      ...state,
      datosDetalle,
    }));
  }

  /**
   * Actualiza el estado con una nueva fracción arancelaria.
   *
   * @param fraccionArancelaria - Una cadena que representa la fracción arancelaria a establecer.
   */
  public setFraccionArancelaria(fraccionArancelaria: string): void {
    this.update((state) => ({
      ...state,
      fraccionArancelaria,
    }));
  }

  /**
   * Actualiza el estado con una nueva descripción de la fracción arancelaria.
   *
   * @param descripcionFraccionArancelaria - Una cadena que representa la descripción de la fracción arancelaria a establecer.
   */
  public setDescripcionFraccionArancelaria(
    descripcionFraccionArancelaria: string
  ): void {
    this.update((state) => ({
      ...state,
      descripcionFraccionArancelaria,
    }));
  }

  /**
   * Actualiza el estado con una nueva cantidad del producto.
   *
   * @param cantidad - Una cadena que representa la cantidad del producto a establecer.
   */
  public setCantidad(cantidad: string): void {
    this.update((state) => ({
      ...state,
      cantidad,
    }));
  }

  /**
   * Actualiza el estado con la cantidad del producto en palabras.
   *
   * @param cantidadLetra - Una cadena que representa la cantidad del producto en palabras a establecer.
   */
  public setCantidadLetra(cantidadLetra: string): void {
    this.update((state) => ({
      ...state,
      cantidadLetra,
    }));
  }

  /**
   * Actualiza el estado con una nueva lista de géneros asociados al producto.
   *
   * @param genero - Un arreglo de objetos `Catalogo` que representa los géneros a establecer.
   */
  public setGenero(genero: Catalogo[]): void {
    this.update((state) => ({
      ...state,
      genero,
    }));
  }

  /**
   * Actualiza el estado con una nueva lista de especies asociadas al producto.
   *
   * @param especie - Un arreglo de objetos `Catalogo` que representa las especies a establecer.
   */
  public setEspecie(especie: Catalogo[]): void {
    this.update((state) => ({
      ...state,
      especie,
    }));
  }

  /**
   * Actualiza el estado con una nueva lista de nombres comunes del producto.
   *
   * @param nombreComun - Un arreglo de objetos `Catalogo` que representa los nombres comunes a establecer.
   */
  public setNombreComun(nombreComun: Catalogo[]): void {
    this.update((state) => ({
      ...state,
      nombreComun,
    }));
  }

  /**
   * Actualiza el estado con una nueva lista de unidades de medida.
   *
   * @param unidadDeMedida - Un arreglo de objetos `Catalogo` que representa las unidades de medida a establecer.
   */
  public setUnidadDeMedida(unidadDeMedida: Catalogo[]): void {
    this.update((state) => ({
      ...state,
      unidadDeMedida,
    }));
  }

  /**
   * Actualiza el estado con un nuevo lugar de entrada.
   *
   * @param lungarDeEntrada - Una cadena que representa el lugar de entrada a establecer.
   */
  public setLungarDeEntrada(lungarDeEntrada: string): void {
    this.update((state) => ({
      ...state,
      lungarDeEntrada,
    }));
  }

  /**
   * Actualiza el estado con un nuevo destino del importador.
   *
   * @param destinoDeImportador - Una cadena que representa el destino del importador a establecer.
   */
  public setDestinoDeImportador(destinoDeImportador: string): void {
    this.update((state) => ({
      ...state,
      destinoDeImportador,
    }));
  }

  /**
   * Actualiza el estado con una nueva lista de medios de transporte.
   *
   * @param medioDeTransporte - Un arreglo de objetos `Catalogo` que representa los medios de transporte a establecer.
   */
  public setMedioDeTransporte(medioDeTransporte: Catalogo[]): void {
    this.update((state) => ({
      ...state,
      medioDeTransporte,
    }));
  }

  /**
   * Actualiza el estado con un nuevo número y descripción del producto.
   *
   * @param numeroYDescripcion - Una cadena que representa el número y descripción del producto a establecer.
   */
  public setNumeroYDescripcion(numeroYDescripcion: string): void {
    this.update((state) => ({
      ...state,
      numeroYDescripcion,
    }));
  }

  /**
   * Actualiza el estado con un nuevo código postal.
   *
   * @param codigoPostal - Una cadena que representa el código postal a establecer.
   */
  public setCodigoPostal(codigoPostal: string): void {
    this.update((state) => ({
      ...state,
      codigoPostal,
    }));
  }

  /**
   * Actualiza el estado con una nueva lista de estados.
   *
   * @param estado - Un arreglo de objetos `Catalogo` que representa los estados a establecer.
   */
  public setEstado(estado: Catalogo[]): void {
    this.update((state) => ({
      ...state,
      estado,
    }));
  }

  /**
   * Actualiza el estado con una nueva dirección de calle.
   *
   * @param calle - Una cadena que representa la dirección de la calle a establecer.
   */
  public setCalle(calle: string): void {
    this.update((state) => ({
      ...state,
      calle,
    }));
  }

  /**
   * Actualiza el estado con un nuevo número exterior.
   *
   * @param numeroExterior - Una cadena que representa el número exterior a establecer.
   */
  public setNumeroExterior(numeroExterior: string): void {
    this.update((state) => ({
      ...state,
      numeroExterior,
    }));
  }

  /**
   * Actualiza el estado con un nuevo número interior.
   *
   * @param numeroInterior - Una cadena que representa el número interior a establecer.
   */
  public setNumeroInterior(numeroInterior: string): void {
    this.update((state) => ({
      ...state,
      numeroInterior,
    }));
  }

  /**
   * Actualiza el estado con una nueva colonia o barrio.
   *
   * @param colonia - Una cadena que representa la colonia o barrio a establecer.
   */
  public setColonia(colonia: string): void {
    this.update((state) => ({
      ...state,
      colonia,
    }));
  }

  /**
   * Limpia los datos de la solicitud.
   */
  public limpiarSolicitud(): void {
    this.reset();
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
  public setBanco(banco: Catalogo[]): void {
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
   * 
   * Actualiza el estado con la entidad federativa seleccionada.
   *
   * {string} entidadFederativa - La entidad federativa seleccionada.
   */
  public setEntidadFederativa(entidadFederativa: string): void {
    this.update((state) => ({
      ...state,
      entidadFederativa,
    }));
  }

  /**
   * 
   * Actualiza el estado con el estado del popup de terceros.
   *
   * {boolean} tercerosPopupState - El estado del popup de terceros.
   */

  public setTercerosPopupState(tercerosPopupState: boolean): void {
    this.update((state) => ({
      ...state,
      tercerosPopupState,
    }));
  }

  
  /**
   * 
   * Actualiza el estado con la lista de destinatarios.
   *
   * {DestinatarioConfiguracionItem[]} datosTabla - La lista de destinatarios.
   */
  setDatosDestinatario(destinatarios: DestinatarioConfiguracionItem[]): void {
    this.update((state) => ({
      ...state,
      destinatarios: destinatarios,
    }));
  }
  
}
