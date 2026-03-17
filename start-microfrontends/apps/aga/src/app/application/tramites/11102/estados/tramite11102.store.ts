import { Store, StoreConfig } from '@datorama/akita';
import { DatosDelMercancia } from '../models/modificacion-donaciones-immex.model';
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
 * Interfaz que representa el estado inicial de la solicitud 11102.
 */
export interface Solicitud11102State {
  /**
   * Nombre del organismo público.
   */
  organismoPublico: boolean;
 
  /**
   * Lista de aduanas disponibles.
   */
  aduana: Catalogo[] | string;
 
  /**
   * Uso específico de la mercancía.
   */
  usoEspecifico: string;
 
  /**
   * Bandera para mostrar la tabla.
   */
  showTabla: boolean;
 
  /**
   * Tipo de mercancía.
   */
  tipoDeMercancia: string;
 
  /**
   * Unidad de medida de la mercancía.
   */
  unidadMedida: string;
 
  /**
   * Condición de la mercancía.
   */
  condicionMercancia: string;
 
  /**
   * Lista de años disponibles.
   */
  ano: string;
 
  /**
   * Cantidad de mercancía.
   */
  cantidad: string;
 
  /**
   * Marca de la mercancía.
   */
  marca: string;
 
  /**
   * Modelo de la mercancía.
   */
  modelo: string;
 
  /**
   * Serie de la mercancía.
   */
  serie: string;
 
  /**
   * Lista de países disponibles.
   */
  pais: Catalogo[] | string;
 
  /**
   * RFC del solicitante.
   */
  rfc: string;
 
  /**
   * Número del programa IMMEX.
   */
  numeroProgramaImmex: string;
 
  /**
   * Razón social del solicitante.
   */
  razonSocial: string;
 
  /**
   * Calle del domicilio fiscal.
   */
  calle: string;
 
  /**
   * Número exterior del domicilio fiscal.
   */
  numeroExterior: string;
 
  /**
   * Número interior del domicilio fiscal.
   */
  numeroInterior: string;
 
  /**
   * Correo electrónico del solicitante.
   */
  correoElectronico: string;
 
  /**
   * Teléfono del solicitante.
   */
  telefono: string;
 
  /**
   * Correo electrónico opcional del solicitante.
   */
  correoElectronicoOpcional: string;
 
  /**
   * Teléfono opcional del solicitante.
   */
  telefonoOpcional: string;
 
  /**
   * Código postal del domicilio fiscal.
   */
  codigoPostal: string;
 
  /**
   * Estado del domicilio fiscal.
   */
  estado: string;
 
  /**
   * Colonia del domicilio fiscal.
   */
  colonia: string;
 
  /**
   * Datos relacionados con la mercancía.
   */
  datosDelMercancia: DatosDelMercancia[];

  /**
   * Folio original de la solicitud.
   */
  folioOriginal: string;
}
 
/**
 * Interfaz que representa la estructura de respuesta del objeto
 * de estado para la solicitud 11102 (IMMEX).
 */
export interface Solicitud11102StaObjResp {
  /**
   * Objeto que contiene toda la información relacionada con la modificación 
   * de donaciones IMMEX, incluyendo datos del solicitante y de la mercancía.
   */
  modificacionDonacionesImmex: Solicitud11102State;
}

/**
 * Respuesta de la API para la modificación de donaciones IMMEX.
 * Contiene todos los datos relacionados con el trámite, incluyendo
 * la información del solicitante y los datos de la mercancía donada.
 */
export interface ModificacionDonacionesImmexResponse {
  modificacionDonacionesImmex: {
    /**
     * Nombre del organismo público receptor de la donación.
     */
    organismoPublico: string;

    /**
     * Lista de aduanas por las que ingresará la mercancía. Cada una incluye ID y descripción.
     */
    aduana: {
      /**
       * Identificador único de la aduana.
       */
      id: number;

      /**
       * Descripción o nombre de la aduana.
       */
      descripcion: string;
    }[];

    /**
     * Lista de países involucrados en la operación. Incluye ID y descripción.
     */
    pais: {
      /**
       * Identificador único del país.
       */
      id: number;

      /**
       * Nombre o descripción del país.
       */
      descripcion: string;
    }[];

    /**
     * RFC de la empresa que realiza la donación.
     */
    rfc: string;

    /**
     * Número del programa IMMEX con el que está registrada la empresa.
     */
    numeroProgramaImmex: string;

    /**
     * Razón social de la empresa donante.
     */
    razonSocial: string;

    /**
     * Correo electrónico alternativo del contacto (opcional).
     */
    correoElectronicoOpcional: string;

    /**
     * Teléfono alternativo de contacto (opcional).
     */
    telefonoOpcional: string;

    /**
     * Calle del domicilio fiscal o de operación de la empresa.
     */
    calle: string;

    /**
     * Número exterior del domicilio.
     */
    numeroExterior: string;

    /**
     * Número interior del domicilio (si aplica).
     */
    numeroInterior: string;

    /**
     * Teléfono principal de contacto.
     */
    telefono: string;

    /**
     * Correo electrónico principal de contacto.
     */
    correoElectronico: string;

    /**
     * Código postal correspondiente al domicilio.
     */
    codigoPostal: string;

    /**
     * Estado o entidad federativa donde se ubica el domicilio.
     */
    estado: string;

    /**
     * Colonia o fraccionamiento del domicilio.
     */
    colonia: string;

    /**
     * Detalles específicos de la mercancía que será donada.
     */
    datosMercancia: {
      /**
       * Tipo o categoría de la mercancía donada.
       */
      tipoDeMercancia: string;

      /**
       * Cantidad total de mercancía a donar.
       */
      cantidad: string;

      /**
       * Unidad de medida en la que se cuantifica la mercancía (kg, piezas, litros, etc.).
       */
      unidadMedida: string;

      /**
       * Año de fabricación o importación de la mercancía.
       */
      ano: string;

      /**
       * Modelo del producto o equipo donado.
       */
      modelo: string;

      /**
       * Marca del producto o equipo donado.
       */
      marca: string;

      /**
       * Número de serie único del producto (si aplica).
       */
      serie: string;

      /**
       * Condición física o de uso de la mercancía (nueva, usada, funcional, etc.).
       */
      condicionMercancia: string;
    };
  };
}



/**
 * Función que crea el estado inicial de la solicitud 11102.
 * @returns Estado inicial de la solicitud.
 */
export function createInitialState(): Solicitud11102State {
  return {
    organismoPublico: false,
    aduana: '',
    usoEspecifico: '',
    showTabla: true,
    tipoDeMercancia: '',
    unidadMedida: '',
    condicionMercancia: '1',
    ano: '',
    cantidad: '',
    marca: '',
    modelo: '',
    serie: '',
    pais: '1',
    calle: 'CAMINO VIEJO',
    numeroExterior: '1353',
    numeroInterior: '',
    telefono: '55-98764532',
    correoElectronico: 'brpomskyldi@etllpqhpyrpks.zgi',
    correoElectronicoOpcional: '',
    telefonoOpcional: '',
    rfc: '',
    numeroProgramaImmex: '',
    razonSocial: 'INTEGRADORA DE URBANIZACIONES SIGNUM S DE RL DE CV',
    codigoPostal: '81210',
    estado: 'SINALOA',
    colonia: 'MIGUEL HIDALGO',
    datosDelMercancia: [],
    folioOriginal: '0100001030220251005000005'
  };
}
 
/**
 * Clase que representa el store para manejar el estado de la solicitud 11102.
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite11102', resettable: true })
export class Tramite11102Store extends Store<Solicitud11102State> {
  /**
   * Constructor del store.
   * Inicializa el estado con los valores predeterminados.
   */
  constructor() {
    super(createInitialState());
  }
 
  /**
   * Establece el organismo público en el estado.
   * @param organismoPublico Nombre del organismo público.
   */
  public setOrganismoPublico(organismoPublico: boolean): void {
    this.update((state) => ({
      ...state,
      organismoPublico,
    }));
  }
 
  /**
   * Establece la lista de aduanas en el estado.
   * @param aduana Lista de aduanas.
   */
  public setAduana(aduana: Catalogo[] | string): void {
    this.update((state) => ({
      ...state,
      aduana,
    }));
  }
 
  /**
   * Establece el tipo de mercancía en el estado.
   * @param tipoDeMercancia Tipo de mercancía.
   */
  public setTipoDeMercancia(tipoDeMercancia: string): void {
    this.update((state) => ({
      ...state,
      tipoDeMercancia,
    }));
  }
 
  /**
   * Establece la unidad de medida en el estado.
   * @param unidadMedida Unidad de medida.
   */
  public setUnidadMedida(unidadMedida: string): void {
    this.update((state) => ({
      ...state,
      unidadMedida,
    }));
  }
 
  /**
   * Establece la condición de la mercancía en el estado.
   * @param condicionMercancia Condición de la mercancía.
   */
  public setCondicionMercancia(condicionMercancia: string): void {
    this.update((state) => ({
      ...state,
      condicionMercancia,
    }));
  }
 
  /**
   * Establece la lista de años en el estado.
   * @param ano Lista de años.
   */
  public setAno(ano: string): void {
    this.update((state) => ({
      ...state,
      ano,
    }));
  }
 
  /**
   * Establece la cantidad de mercancía en el estado.
   * @param cantidad Cantidad de mercancía.
   */
  public setCantidad(cantidad: string): void {
    this.update((state) => ({
      ...state,
      cantidad,
    }));
  }
 
  /**
   * Establece la marca de la mercancía en el estado.
   * @param marca Marca de la mercancía.
   */
  public setMarca(marca: string): void {
    this.update((state) => ({
      ...state,
      marca,
    }));
  }
 
  /**
   * Establece el modelo de la mercancía en el estado.
   * @param modelo Modelo de la mercancía.
   */
  public setModelo(modelo: string): void {
    this.update((state) => ({
      ...state,
      modelo,
    }));
  }
 
  /**
   * Establece la serie de la mercancía en el estado.
   * @param serie Serie de la mercancía.
   */
  public setSerie(serie: string): void {
    this.update((state) => ({
      ...state,
      serie,
    }));
  }
 
  /**
   * Establece la lista de países en el estado.
   * @param pais Lista de países.
   */
  public setPais(pais: Catalogo[] | string): void {
    this.update((state) => ({
      ...state,
      pais,
    }));
  }
 
  /**
   * Establece el uso específico de la mercancía en el estado.
   * @param usoEspecifico Uso específico de la mercancía.
   */
  public setUsoEspecifico(usoEspecifico: string): void {
    this.update((state) => ({
      ...state,
      usoEspecifico,
    }));
  }
 
  /**
   * Establece la calle del domicilio fiscal en el estado.
   * @param calle Calle del domicilio fiscal.
   */
  public setCalle(calle: string): void {
    this.update((state) => ({
      ...state,
      calle,
    }));
  }
 
  /**
   * Establece el número exterior del domicilio fiscal en el estado.
   * @param numeroExterior Número exterior del domicilio fiscal.
   */
  public setNumeroExterior(numeroExterior: string): void {
    this.update((state) => ({
      ...state,
      numeroExterior,
    }));
  }
 
  /**
   * Establece el número interior del domicilio fiscal en el estado.
   * @param numeroInterior Número interior del domicilio fiscal.
   */
  public setNumeroInterior(numeroInterior: string): void {
    this.update((state) => ({
      ...state,
      numeroInterior,
    }));
  }
 
  /**
   * Establece el teléfono del solicitante en el estado.
   * @param telefono Teléfono del solicitante.
   */
  public setTelefono(telefono: string): void {
    this.update((state) => ({
      ...state,
      telefono,
    }));
  }
 
  /**
   * Establece el correo electrónico del solicitante en el estado.
   * @param correoElectronico Correo electrónico del solicitante.
   */
  public setCorreoElectronico(correoElectronico: string): void {
    this.update((state) => ({
      ...state,
      correoElectronico,
    }));
  }
 
  /**
   * Establece el código postal del domicilio fiscal en el estado.
   * @param codigoPostal Código postal del domicilio fiscal.
   */
  public setCodigoPostal(codigoPostal: string): void {
    this.update((state) => ({
      ...state,
      codigoPostal,
    }));
  }
 
  /**
   * Establece el estado del domicilio fiscal en el estado.
   * @param estado Estado del domicilio fiscal.
   */
  public setEstado(estado: string): void {
    this.update((state) => ({
      ...state,
      estado,
    }));
  }
 
  /**
   * Establece la colonia del domicilio fiscal en el estado.
   * @param colonia Colonia del domicilio fiscal.
   */
  public setColonia(colonia: string): void {
    this.update((state) => ({
      ...state,
      colonia,
    }));
  }
 
  /**
   * Establece el RFC del solicitante en el estado.
   * @param rfc RFC del solicitante.
   */
  public setRfc(rfc: string): void {
    this.update((state) => ({
      ...state,
      rfc,
    }));
  }
 
  /**
   * Establece el número del programa IMMEX en el estado.
   * @param numeroProgramaImmex Número del programa IMMEX.
   */
  public setNumeroProgramaImmex(numeroProgramaImmex: string): void {
    this.update((state) => ({
      ...state,
      numeroProgramaImmex,
    }));
  }
 
  /**
   * Establece la razón social del solicitante en el estado.
   * @param razonSocial Razón social del solicitante.
   */
  public setRazonSocial(razonSocial: string): void {
    this.update((state) => ({
      ...state,
      razonSocial,
    }));
  }
 
  /**
   * Establece el correo electrónico opcional del solicitante en el estado.
   * @param correoElectronicoOpcional Correo electrónico opcional del solicitante.
   */
  public setCorreoElectronicoOpcional(correoElectronicoOpcional: string): void {
    this.update((state) => ({
      ...state,
      correoElectronicoOpcional,
    }));
  }
 
  /**
   * Establece el teléfono opcional del solicitante en el estado.
   * @param telefonoOpcional Teléfono opcional del solicitante.
   */
  public setTelefonoOpcional(telefonoOpcional: string): void {
    this.update((state) => ({
      ...state,
      telefonoOpcional,
    }));
  }
 
  /**
   * Establece los datos del contenedor.
   * @param datosDelMercancia Datos del contenedor.
   */
  public setDelMercancia(datosDelMercancia: DatosDelMercancia[]): void {
    this.update((state) => ({
      ...state,
      datosDelMercancia,
    }));
  }
 
  /**
   * Limpia los datos de la solicitud.
   */
  public limpiarSolicitud(): void {
    this.reset();
  }
}