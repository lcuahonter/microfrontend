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
  ano: unknown[];

  /**
   * Uso específico de la mercancía.
   * @type {string}
   */
  usoEspecifico: string;

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
  datosDelMercancia: unknown[];
}

/**
 * Interfaz que representa la respuesta de una consulta.
 */
export interface RespuestaConsulta {
  /**
   * Indica si la consulta fue exitosa.
   * @type {boolean}
   */
  success: boolean;

  /**
   * Datos resultantes de la consulta.
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
 * Interfaz que agrupa los diferentes tipos de datos de consulta.
 */
export interface ConsultaDatos {
  /**
   * Información sobre exención de impuestos.
   * @type {ExencionImpuestos}
   */
  exencionImpuestos: ExencionImpuestos;

  /**
   * Información sobre importador/exportador.
   * @type {ImportadorExportador}
   */
  importadorExportador: ImportadorExportador;

  /**
   * Datos relacionados con la mercancía.
   * @type {DatosMercancia}
   */
  datosMercancia: DatosMercancia;
}

/**
 * Interfaz que representa la exención de impuestos.
 */
export interface ExencionImpuestos {
  /**
   * Número de manifiesto.
   * @type {string}
   */
  manifesto: string;

  /**
   * Aduana relacionada.
   * @type {string}
   */
  aduana: string;

  /**
   * Organismo público involucrado.
   * @type {string}
   */
  organismoPublico: string;

  /**
   * Destino de la mercancía.
   * @type {string}
   */
  destinoMercancia: string;
}

/**
 * Interfaz que representa información de importador/exportador.
 */
export interface ImportadorExportador {
  /**
   * Nombre del importador/exportador.
   * @type {string}
   */
  nombre: string;

  /**
   * Calle del domicilio.
   * @type {string}
   */
  calle: string;

  /**
   * Número exterior del domicilio.
   * @type {number}
   */
  numeroExterior: number;

  /**
   * Número interior del domicilio.
   * @type {number}
   */
  numeroInterior: number;

  /**
   * Teléfono de contacto.
   * @type {number}
   */
  telefono: number;

  /**
   * Correo electrónico de contacto.
   * @type {string}
   */
  correoElectronico: string;

  /**
   * País del domicilio.
   * @type {string}
   */
  pais: string;

  /**
   * Código postal del domicilio.
   * @type {number}
   */
  codigoPostal: number;

  /**
   * Estado del domicilio.
   * @type {number}
   */
  estado: number;

  /**
   * Colonia del domicilio.
   * @type {number}
   */
  colonia: number;

  /**
   * Opción adicional.
   * @type {string}
   */
  opcion: string;

  /**
   * Persona moral relacionada.
   * @type {string}
   */
  personaMoral: string;
}

/**
 * Interfaz que representa los datos de una mercancía en el contexto de consulta.
 */
export interface DatosMercancia {
  /**
   * Tipo de mercancía.
   * @type {string}
   */
  tipoDeMercancia: string;

  /**
   * Uso específico de la mercancía.
   * @type {string}
   */
  usoEspecifico: string;

  /**
   * Condición de la mercancía.
   * @type {string}
   */
  condicionMercancia: string;

  /**
   * Unidad de medida de la mercancía.
   * @type {string}
   */
  unidadMedida: string;

  /**
   * Información del vehículo (si aplica).
   * @type {string}
   */
  vehiculo: string;

  /**
   * Año relacionado con la mercancía.
   * @type {string}
   */
  ano: string;

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
}