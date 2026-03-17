import { CatalogosSelect } from '@libs/shared/data-access-user/src';

/**
 * Interfaz que representa las columnas de la tabla SCIAN.
 */
export interface ColumnasTabla {
  /** Clave del SCIAN. */
  claveScian: string;
  /** Descripción del SCIAN. */
  descripcionScian: string;
}

/**
 * Interfaz que define la estructura de la lista clave.
 */
export interface ListaClave {
  /** Clave de los lotes. */
  claveDeLosLotes: string;
  /** Fecha de fabricación. */
  fechaDeFabricacion: string;
  /** Fecha de caducidad. */
  fechaDeCaducidad: string;
}

/**
 * Interfaz que define la estructura de una mercancía.
 */
export interface Mercancia {
  /** Clasificación de los productos. */
  clasificaionProductos: string;
  /** Valor numérico que especifica el producto. */
  especificarProducto: number;
  /** Nombre específico del producto. */
  nombreProductoEspecifico: string;
  /** Marca del producto. */
  marca: string;
  /** Tipo de producto representado como número. */
  tipoProducto: number;
  /** Fracción arancelaria del producto. */
  fraccionArancelaria: string;
  /** Descripción de la fracción arancelaria. */
  descripcionFraccionArancelaria: string;
  /** Cantidad para la unidad de medida de tarifa (UMT). */
  cantidadUMT: string;
  /** Unidad de medida de tarifa (UMT). */
  umt: string;
  /** Cantidad para la unidad de medida de comercialización (UMC). */
  cantidadUMC: string;
  /** Unidad de medida de comercialización (UMC) representada como número. */
  umc: number;
  /** País de origen del producto. */
  paisDeOrigen: string;
  /** País de procedencia del producto. */
  paisDeProcedencia: string;
  /** Uso específico del producto. */
  usoEspecifico: string;
}

/**
 * Interfaz que define la estructura de las claves de los lotes.
 */
export interface ClavesDeLotes {
  /** Lotes. */
  lotes: string;
  /** Fecha de fabricación de los lotes. */
  fabricacion: string;
  /** Fecha de caducidad de los lotes. */
  caducidad: string;
}

/**
 * Interfaz que define la etiqueta para un CrossList.
 */
export interface CrossListLable {
  /** Título o etiqueta de la parte izquierda. */
  tituluDeLaIzquierda: string;
  /** Etiqueta para la parte derecha. */
  derecha: string;
}

/**
 * Interfaz que representa un CrossList, que incluye una etiqueta y un arreglo de fechas.
 */
export interface CrossList {
  /** Objeto que contiene las etiquetas para el CrossList. */
  label: CrossListLable;
  /** Arreglo de fechas. */
  fechas: string[];
}

/**
 * Interfaz que define los catálogos asociados a la mercancía.
 */
export interface MercanciaCatalogos {
  /** Catálogo de productos. */
  productosCatalogo: CatalogosSelect;
  /** Catálogo para especificar el producto. */
  especificarCatalogo: CatalogosSelect;
  /** Catálogo para el tipo de producto. */
  tipoProductoCatalogo: CatalogosSelect;
  /** Catálogo para la unidad de medida de comercialización (UMC). */
  umcCatalogo: CatalogosSelect;
}

/**
 * Interfaz que define los CrossList asociados a la mercancía.
 */
export interface MercanciaCrossList {
  /** CrossList para el país de origen. */
  paisOrigenCrossList: CrossList;
  /** CrossList para el país de procedencia. */
  paisProcedencisCrossList: CrossList;
  /** CrossList para el uso específico. */
  usoEspecificoCrossList: CrossList;
}

/**
 * Constante que define la configuración de la fecha inicial.
 */
export const FECHA_INICIAL = {
  /** Nombre del label que se mostrará para la fecha inicial. */
  labelNombre: 'Fecha de fabricación',
  /** Indica si la fecha es requerida. */
  required: true,
  /** Indica si la fecha está habilitada. */
  habilitado: true,
};

/**
 * Constante que define la configuración de la fecha final.
 */
export const FECHA_FINAL = {
  /** Nombre del label que se mostrará para la fecha final. */
  labelNombre: 'Fecha de caducidad',
  /** Indica si la fecha es requerida. */
  required: true,
  /** Indica si la fecha está habilitada. */
  habilitado: true,
};

/**
 * Constante que define la configuración de la fecha de pago.
 */
export const FECHA_PAGO = {
  /** Nombre del label que se mostrará para la fecha de pago. */
  labelNombre: 'Fecha de pago',
  /** Indica si la fecha es requerida. */
  required: true,
  /** Indica si la fecha está habilitada. */
  habilitado: true,
};

/**
 * Interfaz que define la estructura de un trámite asociado.
 */
export interface Asociados {
  /** Folio del trámite. */
  folioTramite: string;
  /** Tipo de trámite. */
  tipoTramite: string;
  /** Estatus del trámite. */
  estatus: string;
  /** Fecha de alta de registro del trámite. */
  fechaRegistro: string;
}

/**
 * Interfaz que define la estructura de un fabricante.
 */
export interface Fabricante {
  /** Nombre o razón social del fabricante. */
  nombre: string;
  /** RFC del fabricante. */
  rfc: string;
  /** CURP del fabricante. */
  curp: string;
  /** Teléfono del fabricante. */
  telefono: string;
  /** Correo electrónico del fabricante. */
  correoElectronico: string;
  /** Calle del fabricante. */
  calle: string;
  /** Número exterior del fabricante. */
  numeroExterior: string;
  /** Número interior del fabricante. */
  numeroInterior: string;
  /** País del fabricante. */
  pais: string;
  /** Colonia del fabricante. */
  colonia: string;
  /** Municipio del fabricante. */
  municipio: string;
  /** Localidad del fabricante. */
  localidad: string;
  /** Estado del fabricante (primario). */
  estado: string;
  /** Estado del fabricante (secundario). */
  estado2: string;
  /** Código postal del fabricante. */
  codigo: string;
}

/**
 * Interfaz que define la estructura de un destinatario.
 */
export interface Destinatario {
  /** Nombre o razón social del destinatario. */
  nombre: string;
  /** RFC del destinatario. */
  rfc: string;
  /** CURP del destinatario. */
  curp: string;
  /** Teléfono del destinatario. */
  telefono: string;
  /** Correo electrónico del destinatario. */
  correoElectronico: string;
  /** Calle del destinatario. */
  calle: string;
  /** Número exterior del destinatario. */
  numeroExterior: string;
  /** Número interior del destinatario. */
  numeroInterior: string;
  /** País del destinatario. */
  pais: string;
  /** Colonia del destinatario. */
  colonia: string;
  /** Municipio del destinatario. */
  municipio: string;
  /** Localidad del destinatario. */
  localidad: string;
  /** Estado del destinatario (primario). */
  estado: string;
  /** Estado del destinatario (secundario). */
  estado2: string;
  /** Código postal del destinatario. */
  codigo: string;
}
