import { Catalogo } from "../estados/tramite10302.store";

/**
 * Interfaz que representa la respuesta de una operación relacionada con mercancías.
 */
export interface RespuestaMercancia {
  /**
   * Indica si la operación fue exitosa.
   * @type {boolean}
   */
  success: boolean;

  /**
   * Datos del contenedor relacionados con la mercancía.
   * @type {DatosDelMercancia}
   */
  datos: DatosDelMercancia;

  /**
   * Mensaje de la respuesta.
   * @type {string}
   */
  message: string;
}

/**
 * Interfaz que representa los datos de una mercancía.
 */
export interface DatosDelMercancia {
  /**
   * Identificador único de la mercancía.
   * @type {number}
   */
  id: number;

  /**
   * Tipo de mercancía.
   * @type {string}
   */
  tipoDeMercancia: string;

  /**
   * Unidad de medida de la mercancía.
   * @type {string}
   */
  unidadMedida: string;

  /**
   * Condición de la mercancía.
   * @type {string}
   */
  condicionMercancia: string;

  /**
   * Año relacionado con la mercancía.
   * @type {Array<any>}
   */
  ano: [];

  /**
   * Cantidad de mercancía.
   * @type {string}
   */
  cantidad: string;

  /**
   * Marca de la mercancía.
   * @type {string}
   */
  marca: string;

  /**
   * Modelo de la mercancía.
   * @type {string}
   */
  modelo: string;

  /**
   * Serie de la mercancía.
   * @type {string}
   */
  serie: string;

  /**
   * Datos adicionales relacionados con la mercancía.
   * @type {Array<any>}
   */
  datosDelMercancia: [];
}

/**
 * Interfaz que representa la respuesta de una consulta general.
 */
export interface RespuestaConsulta {
  /**
   * Indica si la operación fue exitosa.
   * @type {boolean}
   */
  success: boolean;

  /**
   * Datos obtenidos de la consulta.
   * @type {ConsultaDatos}
   */
  datos: ConsultaDatos;

  /**
   * Mensaje de la respuesta.
   * @type {string}
   */
  message: string;
}

/**
 * Interfaz que representa los datos generales obtenidos de una consulta.
 */
export interface ConsultaDatos {
  /**
   * Nombre del organismo público relacionado.
   * @type {string}
   */
  organismoPublico: string;

  /**
   * Uso específico de la mercancía o trámite.
   * @type {string}
   */
  usoEspecifico: string;

  /**
   * Lista de aduanas asociadas.
   * @type {Catalogo[]}
   */
  aduana: Catalogo[];

  /**
   * Lista de países asociados.
   * @type {Catalogo[]}
   */
  pais: Catalogo[];

  /**
   * RFC del solicitante.
   * @type {string}
   */
  rfc: string;

  /**
   * Número de programa IMMEX.
   * @type {string}
   */
  numeroProgramaImmex: string;

  /**
   * Razón social del solicitante.
   * @type {string}
   */  
  razonSocial: string;

  /**
   * Calle del domicilio.
   * @type {string}
   */
  calle: string;

  /**
   * Número exterior del domicilio.
   * @type {string}
   */
  numeroExterior: string;

  /**
   * Número interior del domicilio.
   * @type {string}
   */
  numeroInterior: string;

  /**
   * Correo electrónico principal.
   * @type {string}
   */
  correoElectronico: string;

  /**
   * Teléfono principal.
   * @type {string}
   */
  telefono: string;

  /**
   * Correo electrónico opcional.
   * @type {string}
   */
  correoElectronicoOpcional: string;

  /**
   * Teléfono opcional.
   * @type {string}
   */
  telefonoOpcional: string;

  /**
   * Código postal del domicilio.
   * @type {string}
   */
  codigoPostal: string;

  /**
   * Estado del domicilio.
   * @type {string}
   */
  estado: string;

  /**
   * Colonia del domicilio.
   * @type {string}
   */
  colonia: string;

  /**
   * Lista de datos relacionados con la mercancía.
   * @type {Array<any>}
   */
  datosDelMercancia: [];
}

/**
 * Fila de la tabla de mercancías.
 * Contiene los datos de una mercancía para mostrar en la tabla.
 */
export interface MercanciaTableRow {

  /**
   * Datos de la fila (cada columna como string).
   */
  tbodyData: string[];
  
}