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
 * Interfaz que representa el estado inicial de la solicitud 230202.
 */
export interface Solicitud230202State {
  numeroDeCertificado: Catalogo[] | null;
  /**
   * Lista de oficinas de aduanas.
   */
  aduana: Catalogo[] | null;

  /**
   * Lista de fechas seleccionadas.
   * Se utiliza para almacenar las fechas que el usuario ha seleccionado.
   */
  fechasSeleccionadas: string[];

  /**
   * Lista de entidades seleccionadas.
   * Se utiliza para almacenar las entidades que el usuario ha seleccionado.
   */
  entidadesSeleccionadas: string[];

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
   * Otro nombre común del producto, si aplica.
   */
  otroNombreComun: string;

  /**
   * Lista de unidades de medida.
   */
  unidadDeMedida: Catalogo[] | null;

  /**
   * Lugar de entrada.
   */
  lungarDeEntrada: string;

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
   * Lista de destinatarios configurados para el trámite.
   */
  destinatarios: DestinatarioConfiguracionItem[];

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

}

/**
 * Función que crea el estado inicial de la solicitud 230202.
 * @returns Estado inicial de la solicitud.
 */
export function createInitialState(): Solicitud230202State {
  return {
    numeroDeCertificado: null,
    aduana: null,
    fechasSeleccionadas: [],
    entidadesSeleccionadas: [],
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
    otroNombreComun: '',
    unidadDeMedida: null,
    lungarDeEntrada: '',
    medioDeTransporte: null,
    numeroYDescripcion: '',
    codigoPostal: '',
    estado: null,
    calle: '',
    numeroExterior: '',
    numeroInterior: '',
    colonia: '',
    claveDeReferencia: '',
    cadenaPagoDependencia: '',
    banco: '',
    llaveDePago: '',
    fecPago: '',
    impPago: '',
    destinatarios: [],
  };
}

/**
 * Clase que representa el store para manejar el estado de la solicitud 230202.
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite230202', resettable: true })
export class Tramite230202Store extends Store<Solicitud230202State> {

  /**
   * Constructor del store.
   * Inicializa el estado con los valores predeterminados.
   */
  constructor() {
    super(createInitialState());
  }

  /**
   * Establece la lista de numeroDeCertificado en el estado.
   * @param numeroDeCertificado Lista de numeroDeCertificado.
   */
  public setNumeroDeCertificado(numeroDeCertificado: Catalogo[]): void {
    this.update((state) => ({
      ...state,
      numeroDeCertificado,
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
   * Actualiza las fechas seleccionadas en el estado.
   * @param {string[]} fechasSeleccionadas - Lista de fechas seleccionadas.
   */
  public setFechasSeleccionadas(fechasSeleccionadas: string[]): void {
    this.update((state) => ({
      ...state,
      fechasSeleccionadas,
    }));
  }

  /**
   * Actualiza las entidades seleccionadas en el estado.
   * @param {string[]} entidadesSeleccionadas - Lista de entidades seleccionadas.
   */
  public setEntidadesSeleccionadas(entidadesSeleccionadas: string[]): void {
    this.update((state) => ({
      ...state,
      entidadesSeleccionadas,
    }));
  }

  /**
   * Actualiza la lista de países en el estado.
   * @param {Catalogo[]} pais - Lista de países.
   */
  public setPais(pais: Catalogo[]): void {
    this.update((state) => ({
      ...state,
      pais,
    }));
  }

  /**
   * Actualiza la lista de entidades en el estado.
   * @param {Catalogo[]} entidades - Lista de entidades.
   */
  public setEntidades(entidades: Catalogo[]): void {
    this.update((state) => ({
      ...state,
      entidades,
    }));
  }

  /**
   * Actualiza la descripción del producto en el estado.
   * @param {Catalogo[]} descripcionProducto - Lista de descripciones del producto.
   */
  public setDescripcionProducto(descripcionProducto: Catalogo[]): void {
    this.update((state) => ({
      ...state,
      descripcionProducto,
    }));
  }

  /**
   * Actualiza los datos de la solicitud en el estado.
   * @param {DatosSolicitud[]} datosSolicitud - Lista de datos de la solicitud.
   */
  public setDatosSolicitud(datosSolicitud: DatosSolicitud[]): void {
    this.update((state) => ({
      ...state,
      datosSolicitud,
    }));
  }

  /**
   * Actualiza los datos de detalle en el estado.
   * @param {DatosDetalle[]} datosDetalle - Lista de datos de detalle.
   */
  public setDatosDetalle(datosDetalle: DatosDetalle[]): void {
    this.update((state) => ({
      ...state,
      datosDetalle,
    }));
  }

  /**
   * Actualiza la fracción arancelaria en el estado.
   * @param {string} fraccionArancelaria - Fracción arancelaria.
   */
  public setFraccionArancelaria(fraccionArancelaria: string): void {
    this.update((state) => ({
      ...state,
      fraccionArancelaria,
    }));
  }

  /**
   * Actualiza la descripción de la fracción arancelaria en el estado.
   * @param {string} descripcionFraccionArancelaria - Descripción de la fracción arancelaria.
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
   * Actualiza la cantidad en el estado.
   * @param {string} cantidad - Cantidad.
   */
  public setCantidad(cantidad: string): void {
    this.update((state) => ({
      ...state,
      cantidad,
    }));
  }

  /**
   * Actualiza la cantidad en letras en el estado.
   * @param {string} cantidadLetra - Cantidad en letras.
   */
  public setCantidadLetra(cantidadLetra: string): void {
    this.update((state) => ({
      ...state,
      cantidadLetra,
    }));
  }

  /**
   * Actualiza la lista de géneros en el estado.
   * @param {Catalogo[]} genero - Lista de géneros.
   */
  public setGenero(genero: Catalogo[]): void {
    this.update((state) => ({
      ...state,
      genero,
    }));
  }

  /**
   * Actualiza la lista de especies en el estado.
   * @param {Catalogo[]} especie - Lista de especies.
   */
  public setEspecie(especie: Catalogo[]): void {
    this.update((state) => ({
      ...state,
      especie,
    }));
  }

  /**
   * Actualiza la lista de nombres comunes en el estado.
   * @param {Catalogo[]} nombreComun - Lista de nombres comunes.
   */
  public setNombreComun(nombreComun: Catalogo[]): void {
    this.update((state) => ({
      ...state,
      nombreComun,
    }));
  }

  /**
   * Actualiza el otro nombre común en el estado.
   * @param {string} otroNombreComun - Otro nombre común.
   */
  public setOtroNombreComun(otroNombreComun: string): void {
    this.update((state) => ({
      ...state,
      otroNombreComun,
    }));
  }

  /**
   * Actualiza la unidad de medida en el estado.
   * @param {Catalogo[]} unidadDeMedida - Lista de unidades de medida.
   */
  public setUnidadDeMedida(unidadDeMedida: Catalogo[]): void {
    this.update(() => ({
      ...this.getValue(),
      unidadDeMedida,
    }));
  }

  /**
   * Actualiza el lugar de entrada en el estado.
   * @param {string} lungarDeEntrada - Lugar de entrada.
   */
  public setLungarDeEntrada(lungarDeEntrada: string): void {
    this.update((state) => ({
      ...state,
      lungarDeEntrada: lungarDeEntrada,
    }));
  }

  /**
   * Actualiza el medio de transporte en el estado.
   * @param {Catalogo[]} medioDeTransporte - Lista de medios de transporte.
   */
  public setMedioDeTransporte(medioDeTransporte: Catalogo[]): void {
    this.update((state) => ({
      ...state,
      medioDeTransporte: medioDeTransporte,
    }));
  }

  /**
   * Actualiza el número y descripción en el estado.
   * @param {string} numeroYDescripcion - Número y descripción.
   */
  public setNumeroYDescripcion(numeroYDescripcion: string): void {
    this.update((state) => ({
      ...state,
      numeroYDescripcion: numeroYDescripcion,
    }));
  }

  /**
   * Actualiza el código postal en el estado.
   * @param {string} codigoPostal - Código postal.
   */
  public setCodigoPostal(codigoPostal: string): void {
    this.update((state) => ({
      ...state,
      codigoPostal: codigoPostal,
    }));
  }

  /**
   * Actualiza la lista de estados en el estado.
   * @param {Catalogo[]} estado - Lista de estados.
   */
  public setEstado(estado: Catalogo[]): void {
    this.update((state) => ({
      ...state,
      estado: estado,
    }));
  }

  /**
   * Actualiza la calle en el estado.
   * @param {string} calle - Calle.
   */
  public setCalle(calle: string): void {
    this.update((state) => ({
      ...state,
      calle: calle,
    }));
  }

  /**
   * Actualiza el número exterior en el estado.
   * @param {string} numeroExterior - Número exterior.
   */
  public setNumeroExterior(numeroExterior: string): void {
    this.update((state) => ({
      ...state,
      numeroExterior: numeroExterior,
    }));
  }

  /**
   * Actualiza el número interior en el estado.
   * @param {string} numeroInterior - Número interior.
   */
  public setNumeroInterior(numeroInterior: string): void {
    this.update((state) => ({
      ...state,
      numeroInterior: numeroInterior,
    }));
  }

  /**
   * Actualiza la colonia en el estado.
   * @param {string} colonia - Colonia.
   */
  public setColonia(colonia: string): void {
    this.update((state) => ({
      ...state,
      colonia: colonia,
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
   * 
   * Actualiza el estado con la entidad federativa seleccionada.
   *
   * @param {string} entidadFederativa - La entidad federativa seleccionada.
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
   * @param {boolean} tercerosPopupState - El estado del popup de terceros.
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
   * @param {DestinatarioConfiguracionItem[]} destinatarios - La lista de destinatarios.
   */
  setDatosDestinatario(destinatarios: DestinatarioConfiguracionItem[]): void {
    this.update((state) => ({
      ...state,
      destinatarios: destinatarios,
    }));
  }
  
}
