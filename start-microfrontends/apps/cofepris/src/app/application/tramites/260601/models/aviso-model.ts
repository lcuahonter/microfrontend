/** 
 * Interfaz que representa una solicitud u orden.
 */
export interface Solicitud {
  /** Fecha de creación */
  fechaCreacion: string;

  /** Nombre o identificador de la mercancía */
  mercancia: string;

  /** Cantidad solicitada */
  cantidad: string;

  /** Proveedor de la mercancia */
  proovedor: string;
}
/**
 * Interfaz que define la estructura de los datos de respuesta de un catálogo.
 */
export interface ProductoTable {
  clasificacionDelProducto: string;
  tipoDeProducto: string;
  fraccionArancelaria: string;
  descripcionDeLaFraccion: string;
  modelo: string;
  descripcionDelProducto: string;
  paisDeOrigen: string;
  paisDeProcedencia: string;
  paisDeDestino: string;
  usoEspecifico: string;
}

/**
 * @interface ProductoInput
 * @description
 * Interfaz que define la estructura de datos para un producto que se está ingresando o editando en el formulario.
 */
export interface ProductoInput {
  /**
   * Clave que representa la clasificación específica del producto.
   */
  cveEspecificoProductoClasifi: string;
  
  /**
   * Clave que identifica el tipo de producto.
   */
  cveTipoProducto: string;
  
  /**
   * Código de la fracción arancelaria asociada al producto.
   */
  fraccionArancelaria: string;
  
  /**
   * Descripción textual de la fracción arancelaria.
   * Campo opcional.
   */
  fraccionArancelariaDescripcion?: string;
  
  /**
   * Modelo o versión específica del producto.
   * Campo opcional.
   */
  modelo?: string;
  
  /**
   * Descripción detallada del producto.
   * Campo opcional.
   */
  productoDescripcion?: string;
  
  /**
   * País de origen del producto.
   * Campo opcional.
   */
  paisDeOrigen?: string;

    /**
   * País de procedencia del producto.
   * Campo opcional que indica el país desde donde se envía o transporta el producto.
   */
  paisDeProcedencia?: string;
  
  /**
   * País de destino del producto.
   * Campo opcional que indica el país al que será enviado o donde será comercializado el producto.
   */
  paisDeDestino?: string;
  
  /**
   * Uso específico que tendrá el producto.
   * Campo opcional que describe la finalidad o aplicación particular del producto.
   */
  usoEspecifico?: string;
}

/**
 * @interface ScianTable
 * @description
 * Representa la estructura de los datos de la tabla S.C.I.A.N.
 */
export interface ScianTable {
  claveScian: string;
  descripcionScian: string;
}

/**
 * @interface SolicitudTable
 * @description
 * Interfaz que define la estructura de datos para las solicitudes mostradas en la tabla dinámica.
 * Contiene información básica sobre una solicitud de aviso sanitario.
 */
export interface SolicitudTable {
  /**
   * Fecha en que se creó la solicitud, en formato de texto.
   */
  fechaCreacion: string;

  /**
   * Nombre o descripción de la mercancía incluida en la solicitud.
   */
  mercancia: string;

  /**
   * Cantidad de la mercancía solicitada.
   */
  cantidad: string;

  /**
   * Nombre o identificador del proveedor de la mercancía.
   */
  proveedor: string;
}

/**
 * Interfaz que representa una declaración de manifiesto.
 */
export interface Manifiestos {
  /**
   * Los detalles de la declaración.
   * 
   * @property {string} clave - El identificador único de la declaración.
   * @property {string} descripcion - La descripción de la declaración.
   */
  declaracion: {
    clave: string;
    descripcion: string;
  }
  /**
   * Indicador de si la declaración forma parte del manifiesto.
   * 
   * @type {boolean}
   */
  manifiestoDeclaracion: boolean;
}

/**
* Respuesta de la API al obtener múltiples manifiestos.
*/
export interface ManifiestosRespuesta {
  /**
   * Lista de manifiestos.
   * 
   * @type {Manifiestos[]}
   */
  data: Manifiestos[];
}

/**
 * Interfaz que define las etiquetas para una lista cruzada.
 */
export interface CrossListLable {
  /** Texto que aparece en la parte izquierda de la etiqueta. */
  tituluDeLaIzquierda: string;

  /** Texto que aparece en la parte derecha de la etiqueta. */
  derecha: string;
}

/**
 * Interfaz que representa una lista cruzada, incluyendo etiquetas y fechas asociadas.
 */
export interface CrossList {
  /** Etiquetas asociadas a la lista cruzada. */
  label: CrossListLable;

  /** Fechas asociadas con los datos de la lista cruzada. */
  fechas: string[];
}

/**
 * Interfaz que agrupa varias listas cruzadas relacionadas con una mercancía.
 */
export interface MercanciaCrossList {
  /** Lista cruzada para los países de origen de la mercancía. */
  paisOrigenCrossList: CrossList;

  /** Lista cruzada para los países de procedencia de la mercancía. */
  paisProcedencisCrossList: CrossList;

  /** Lista cruzada para los usos específicos de la mercancía. */
  usoEspecificoCrossList: CrossList;
}

/**
 * Respuesta de la API al buscar datos del representante legal.
 */
export interface RepresentanteLegalRespuesta {
  /**
   * Datos del representante legal obtenidos de la API.
   */
  data: RepresentanteLegal[];
}

/**
 * Interfaz que representa los datos de un representante legal.
 */
export interface RepresentanteLegal {
  /** 
   * RFC del representante legal. 
   */
  rfc: string;

  /**
   * Nombre o razón social del representante legal.
   */
  nombreOrazonsocial: string;

  /**
   * Apellido paterno del representante legal.
   */
  apellidoPaterno: string;

  /**
   * Apellido materno del representante legal.
   */
  apellidoMaterno: string;
}