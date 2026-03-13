/**
 * Interfaz que representa la respuesta de datos de una API.
 * @export
 * @interface DatosResponse
 */
export interface DatosResponse {
  /**
   * Código de respuesta.
   * @property {number} code
   */
  code: number;

  /**
   * Datos de la respuesta.
   * @property {Object} data
   */
  data: {
    /**
     * Identificador del subfabricante.
     * @property {string} idsubmanufacturer
     */
    idsubmanufacturer: string;

    /**
     * Información de los servicios.
     * @property {InfoServicios} infoServicios
     */
    infoServicios: {
      seleccionaLaModalidad: string;
      folio: string;
      ano: string;
    };
  };
}

/**
 * Interfaz que representa la información de los servicios.
 *
 * @interface InfoServicios
 */

export interface InfoServicios {
  /**
   * @property {string} rfc - El Registro Federal de Contribuyentes asociado al servicio.
   */
  rfc: string;
  /**
   * @property {string} representacionFederal - La representación federal correspondiente.
   */
  representacionFederal: string;
  /**
   * @property {string} tipoModificacion - El tipo de modificación realizada.
   */
  tipoModificacion: string;

  /**
   * @property {string} modificacionPrograma - La descripción de la modificación del programa.
   */
  modificacionPrograma: string;
}

/**
 * Interfaz que representa los datos de respuesta de una API.
 * @export
 * @interface ResponseData
 */
export interface ResponseData {
  /**
   * Identificador del subfabricante.
   * @property {string} idsubmanufacturer
   */
  idsubmanufacturer: string;

  /**
   * Información de los servicios.
   * @property {InfoServicios} infoServicios
   */
  infoServicios: InfoServicios;
}

/**
 * Interfaz que representa la respuesta de una API.
 * @export
 * @interface ApiResponse
 */
export interface ApiResponse {
  /**
   * Código de respuesta.
   * @property {number} code
   */
  code: number;

  /**
   * Datos de la respuesta.
   * @property {ResponseData} data
   */
  data: ResponseData;

  /**
   * Información de los servicios.
   * @property {InfoServicios} infoServicios
   */
  infoServicios: InfoServicios;
}

/**
 * Interfaz que representa una acción de un botón.
 * @export
 * @interface AccionBoton
 */
export interface AccionBoton {
  /**
   * Acción del botón.
   * @property {string} accion
   */
  accion: string;

  /**
   * Valor asociado a la acción.
   * @property {number} valor
   */
  valor: number;
}

/**
 * Interfaz que representa la estructura de datos para las plantas.
 * @export
 * @interface Plantas
 */
export interface Plantas {
  /**
   * La calle donde se encuentra la planta.
   * @property {string} calle
   */
  calle: string;

  /**
   * El número exterior del domicilio de la planta.
   * @property {string} numeroExterior
   */
  numeroExterior: string;

  /**
   * El número interior del domicilio de la planta.
   * @property {string} numeroInterior
   */
  numeroInterior: string;

  /**
   * El código postal del domicilio de la planta.
   * @property {string} codingPostal
   */
  codingPostal: string;

  /**
   * La colonia donde se encuentra la planta.
   * @property {string} colonia
   */
  colonia: string;

  /**
   * El municipio donde se encuentra la planta.
   * @property {string} municipio
   */
  municipio: string;

  /**
   * El estado donde se encuentra la planta.
   * @property {string} estado
   */
  estado: string;

  /**
   * El país donde se encuentra la planta.
   * @property {string} pais
   */
  pais: string;

  /**
   * El Registro Federal de Contribuyentes (RFC) de la planta.
   * @property {string} rfc
   */
  rfc: string;

  /**
   * La razón social de la planta.
   * @property {string} razonSocial
   */
  razonSocial: string;

  /**
   * El domicilio fiscal de la planta.
   * @property {string} domicilioFisical
   */
  domicilioFisical: string;

  /**
   * El estatus actual de la planta.
   * @property {string} estatus
   */
  estatus: string;
}


/**
 * Interfaz que representa la información de las mercancías a producir.
 * @export
 * @interface MercanciasAProducir
 */
export interface MercanciasAProducir {
  /**
   * La fracción arancelaria asociada a la mercancía.
   * @property {string} fraccionArancelaria
   */
  fraccionArancelaria: string;

  /**
   * La clave del sector al que pertenece la mercancía.
   * @property {string} claveSector
   */
  claveSector: string;

  /**
   * El estado actual de la mercancía.
   * @property {string} estatus
   */
  estatus: string;
}

/**
 * Interfaz que representa un sector con información relevante.
 * @export
 * @interface Sector
 */
export interface Sector {
  /**
   * Lista de sectores asociados.
   * @property {string} listaSectores
   */
  listaSectores: string;

  /**
   * Clave única que identifica al sector.
   * @property {string} claveSector
   */
  claveSector: string;

  /**
   * Estado actual del sector.
   * @property {string} estatus
   */
  estatus: string;
}

/**
 * Interfaz que representa un productor indirecto con su información relevante.
 * @export
 * @interface ProductorIndirecto
 */
export interface ProductorIndirecto {
  /**
   * El Registro Federal de Contribuyentes (RFC) del productor indirecto.
   * @property {string} rfc
   */
  rfc: string;

  /**
   * La denominación o nombre del productor indirecto.
   * @property {string} denominacion
   */
  denominacion: string;

  /**
   * La dirección de correo electrónico del productor indirecto.
   * @property {string} correo
   */
  correo: string;

  /**
   * El estado o estatus actual del productor indirecto.
   * @property {string} estatus
   */
  estatus: string;
}

/**
 * Interfaz que representa un registro de bitácora que contiene información sobre modificaciones realizadas.
 * @export
 * @interface Bitacora
 */
export interface Bitacora {
  /**
   * Tipo de modificación realizada.
   * @property {string} tipoModificacion
   */
  tipoModificacion: string;

  /**
   * Fecha en la que se realizó la modificación.
   * @property {string} fechaModificacion
   */
  fechaModificacion: string;

  /**
   * Valores anteriores antes de la modificación.
   * @property {string} valoresAnteriores
   */
  valoresAnteriores: string;

  /**
   * Nuevos valores después de la modificación.
   * @property {string} valoresNuevos
   */
  valoresNuevos: string;
}

/**
 * Interfaz que representa la respuesta de la bitácora.
 * @export
 * @interface BitacoraRespuesta
 */
export interface BitacoraRespuesta {
  /**
   * Código de estado de la respuesta.
   * @property {number} code
   */
  code: number;

  /**
   * Lista de objetos de tipo Bitacora que contiene los datos de la respuesta.
   * @property {Bitacora[]} data
   */
  data: Bitacora[];

  /**
   * Mensaje descriptivo de la respuesta.
   * @property {string} message
   */
  message: string;
}

/**
 * Interfaz que representa la estructura de la respuesta para las plantas.
 * @export
 * @interface PlantasRespuesta
 */
export interface PlantasRespuesta {
  /**
   * Código de estado de la respuesta.
   * @property {number} code
   */
  code: number;

  /**
   * Lista de plantas devueltas en la respuesta.
   * @property {Plantas[]} data
   */
  data: Plantas[];

  /**
   * Mensaje descriptivo de la respuesta.
   * @property {string} message
   */
  message: string;
}
/**
 * Interfaz que representa la respuesta que contiene información sobre las mercancías a producir.
 * @export
 * @interface MercanciasRespuesta
 */
export interface MercanciasRespuesta {
  /**
   * Código de estado de la respuesta.
   * @property {number} code
   */
  code: number;

  /**
   * Lista de mercancías a producir.
   * @property {MercanciasAProducir[]} data
   */
  data: MercanciasAProducir[];

  /**
   * Mensaje descriptivo de la respuesta.
   * @property {string} message
   */
  message: string;
}
/**
 * Representa la respuesta del sector con información relevante.
 * @export
 * @interface SectorRespuesta
 */
export interface SectorRespuesta {
  /**
   * Código de estado de la respuesta.
   * @property {number} code
   */
  code: number;

  /**
   * Lista de datos del sector.
   * @property {Sector[]} data
   */
  data: Sector[];

  /**
   * Mensaje descriptivo de la respuesta.
   * @property {string} message
   */
  message: string;
}

/**
 * Representa la respuesta de un productor indirecto.
 * @export
 * @interface ProductorIndirectoRespuesta
 */
export interface ProductorIndirectoRespuesta {
  /**
   * Código de estado de la respuesta.
   * @property {number} code
   */
  code: number;

  /**
   * Lista de productores indirectos incluidos en la respuesta.
   * @property {ProductorIndirecto[]} data
   */
  data: ProductorIndirecto[];

  /**
   * Mensaje descriptivo de la respuesta.
   * @property {string} message
   */
  message: string;
}

/**
 * Interfaz que representa los datos de modificación.
 * @export
 * @interface DatosDelModificacion
 */
export interface DatosDelModificacion {
  /**
   * Identificador único del registro.
   * @property {number} id
   */
  id: number;

  /**
   * Nombre de la calle.
   * @property {string} calle
   */
  calle: string;

  /**
   * Número exterior del domicilio.
   * @property {number} numeroExterior
   */
  numeroExterior: number;

  /**
   * Número interior del domicilio.
   * @property {number} numeroInterior
   */
  numeroInterior: number;

  /**
   * Código postal del domicilio.
   * @property {number} codigoPostal
   */
  codigoPostal: number;

  /**
   * Nombre de la colonia.
   * @property {string} colonia
   */
  colonia: string;

  /**
   * Nombre del municipio o alcaldía.
   * @property {string} municipioOAlcaldia
   */
  municipioOAlcaldia: string;

  /**
   * Nombre de la entidad federativa.
   * @property {string} entidadFederativa
   */
  entidadFederativa: string;

  /**
   * Nombre del país.
   * @property {string} pais
   */
  pais: string;

  /**
   * Número de teléfono de contacto.
   * @property {string} telefono
   */
  telefono: string;

  /**
   * Descripción del estatus.
   * @property {string} desEstatus
   */
  desEstatus: string;
}