/**
 * Interfaces utilizadas en el trámite 290101 para la configuración de formularios y datos relacionados con el procedimiento de café.
 *
 * Este archivo contiene las definiciones de tipos que estructuran los datos de los formularios utilizados
 * en el proceso de solicitud, datos generales, beneficios, bodegas y exportación de café.
 */

/**
 * Interfaz para el formulario de Datos de la solicitud del trámite 290101.
 *
 * Esta interfaz define la estructura de datos necesaria para capturar la información
 * básica de la solicitud relacionada con el padrón de café.
 *
 * @interface DatosSolicitudFormaInt
 */
export interface DatosSolicitudFormaInt {
  /**
   * Clave única del padrón asociado a la solicitud.
   * 
   * @property {string} claveDelPadron
   */
  claveDelPadron: string;

  /**
   * Observaciones adicionales o comentarios sobre la solicitud.
   * 
   * @property {string} observaciones
   */
  observaciones: string;

  /**
   * Indicador de si se requiere inspección inmediata.
   * Puede contener valores como 'Si', 'No' o códigos específicos.
   * 
   * @property {string} requiereInspeccionInmediata
   */
  requiereInspeccionInmediata: string;

  /**
   * Nivel de confidencialidad de la información (codificado como número).
   * 
   * @property {number} informacionConfidencial
   */
  informacionConfidencial: number;
}

/**
 * Interfaz para el formulario de Datos Generales relacionados con la región y tipo de café.
 *
 * Esta interfaz estructura la información geográfica y de producto necesaria
 * para identificar el origen y características del café procesado.
 *
 * @interface RegionFormaInt
 */
export interface RegionFormaInt {
  /**
   * Estado o entidad federativa donde se produce o procesa el café.
   * 
   * @property {string} estado
   */
  estado: string;

  /**
   * Tipo o variedad específica del producto de café.
   * 
   * @property {string} productoCafe
   */
  productoCafe: string;

  /**
   * Descripción detallada de la región de compra del café.
   * 
   * @property {string} descRegionCompra
   */
  descRegionCompra: string;

  /**
   * Descripción del tipo de café (por ejemplo: arábica, robusta, etc.).
   * 
   * @property {string} descripTipoCafe
   */
  descripTipoCafe: string;

  /**
   * Volumen de café en la unidad de medida correspondiente.
   * 
   * @property {number} volumen
   */
  volumen: number;
}

/**
 * Interfaz para el formulario de Beneficios relacionado con el pago de derechos (Revisión Documental).
 *
 * Esta interfaz define la estructura de datos para las instalaciones de beneficio de café,
 * incluyendo información de ubicación, capacidad y características operativas.
 *
 * @interface BeneficiosFormaInt
 */
export interface BeneficiosFormaInt {
  /**
   * Razón social o nombre de la empresa propietaria del beneficio.
   * 
   * @property {string} razonSocial
   */
  razonSocial: string;

  /**
   * Tipo de tenencia del inmueble (propio o alquilado).
   * 
   * @property {string} propAlquil
   */
  propAlquil: string;

  /**
   * Nombre de la calle donde se ubica el beneficio.
   * 
   * @property {string} calle
   */
  calle: string;

  /**
   * Número exterior del domicilio del beneficio.
   * 
   * @property {number} numeroExterior
   */
  numeroExterior: number;

  /**
   * Número interior del domicilio del beneficio.
   * 
   * @property {number} numeroInterior
   */
  numeroInterior: number;

  /**
   * Colonia o fraccionamiento donde se ubica el beneficio.
   * 
   * @property {string} colonia
   */
  colonia: string;

  /**
   * Código del estado donde se ubica el beneficio.
   * 
   * @property {number} estado
   */
  estado: number;

  /**
   * Código postal del domicilio del beneficio.
   * 
   * @property {number} codigoPostal
   */
  codigoPostal: number;

  /**
   * Capacidad total de almacenaje del beneficio en la unidad correspondiente.
   * 
   * @property {number} capacidadAlmacenaje
   */
  capacidadAlmacenaje: number;

  /**
   * Volumen actual de almacenaje utilizado en el beneficio.
   * 
   * @property {number} volumenAlmacenaje
   */
  volumenAlmacenaje: number;
}
/**
 * Interfaz para el formulario de Bodegas relacionado con el pago de derechos.
 *
 * Esta interfaz define la estructura de datos para las bodegas de almacenamiento de café,
 * incluyendo información de ubicación y capacidad de almacenaje.
 *
 * @interface BodegasFormaInt
 */
export interface BodegasFormaInt {
  /**
   * Razón social o nombre de la empresa propietaria de la bodega.
   * 
   * @property {string} razonSocial
   */
  razonSocial: string;

  /**
   * Tipo de tenencia del inmueble (propio o alquilado).
   * 
   * @property {string} propAlquil
   */
  propAlquil: string;

  /**
   * Nombre de la calle donde se ubica la bodega.
   * 
   * @property {string} calle
   */
  calle: string;

  /**
   * Número exterior del domicilio de la bodega.
   * 
   * @property {number} numeroExterior
   */
  numeroExterior: number;

  /**
   * Número interior del domicilio de la bodega.
   * 
   * @property {number} numeroInterior
   */
  numeroInterior: number;

  /**
   * Colonia o fraccionamiento donde se ubica la bodega.
   * 
   * @property {string} colonia
   */
  colonia: string;

  /**
   * Código del estado donde se ubica la bodega.
   * 
   * @property {number} estado
   */
  estado: number;

  /**
   * Código postal del domicilio de la bodega.
   * 
   * @property {number} codigoPostal
   */
  codigoPostal: number;

  /**
   * Capacidad total de almacenaje de la bodega en la unidad correspondiente.
   * 
   * @property {number} capacidadAlmacenaje
   */
  capacidadAlmacenaje: number;
}

/**
 * Interfaz para el formulario de Exportación de Café.
 *
 * Esta interfaz define la estructura de datos para los productos de café destinados
 * a exportación, incluyendo clasificación y concentración del producto.
 *
 * @interface CafExportFormaInt
 */
export interface CafExportFormaInt {
  /**
   * Descripción detallada de la mercancía de café a exportar.
   * 
   * @property {string} descripcionMercancia
   */
  descripcionMercancia: string;

  /**
   * Clasificación arancelaria o tipo de clasificación del café.
   * 
   * @property {string} clasificacion
   */
  clasificacion: string;

  /**
   * Porcentaje de concentración del café en la mercancía (0-100).
   * 
   * @property {number} porcentajeConcentracion
   */
  porcentajeConcentracion: number;
}

