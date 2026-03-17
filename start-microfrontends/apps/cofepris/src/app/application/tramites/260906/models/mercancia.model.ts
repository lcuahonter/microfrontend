import { CatalogosSelect } from '@libs/shared/data-access-user/src';

/**
 * Interfaz que representa la información de una mercancía.
 */
export interface Mercancia {
  /** Clasificación del producto al que pertenece la mercancía. */
  clasificaionProductos: string;

  /** Identificador numérico para especificar el producto. */
  especificarProducto: number;

  /** Nombre específico del producto. */
  nombreProductoEspecifico: string;

  /** Marca asociada al producto. */
  marca: string;

  /** Tipo de producto representado por un identificador numérico. */
  tipoProducto: number;

  /** Fracción arancelaria de la mercancía. */
  fraccionArancelaria: string;

  /** Descripción detallada de la fracción arancelaria. */
  descripcionFraccionArancelaria: string;

  /** Cantidad de mercancía medida en la Unidad de Medida de Tarifa (UMT). */
  cantidadUMT: string;

  /** Unidad de Medida de Tarifa (UMT) utilizada para medir la cantidad. */
  umt: string;

  /** Cantidad de mercancía medida en la Unidad de Medida de Comercialización (UMC). */
  cantidadUMC: string;

  /** Unidad de Medida de Comercialización (UMC) utilizada para medir la cantidad. */
  umc: number;

  /** País de origen de la mercancía. */
  paisDeOrigen: string;

  /** País de procedencia de la mercancía. */
  paisDeProcedencia: string;

  /** Uso específico de la mercancía. */
  usoEspecifico: string;
}

/**
 * Interfaz que agrupa los catálogos relacionados con una mercancía.
 */
export interface MercanciaCatalogos {
  /** Catálogo de productos disponibles. */
  productosCatalogo: CatalogosSelect;

  /** Catálogo para especificar un producto específico. */
  especificarCatalogo: CatalogosSelect;

  /** Catálogo de tipos de productos disponibles. */
  tipoProductoCatalogo: CatalogosSelect;

  /** Catálogo de Unidades de Medida de Comercialización (UMC). */
  umcCatalogo: CatalogosSelect;
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
 * Interfaz que representa los datos de un destinatario.
 */
export interface DestinatarioImitar {
  /** Tipo de persona (física o moral). */
  tipoPersona: string;

  /** Indicación para modificar el RFC del destinatario. */
  modificarRFC: string;

  /** Denominación social del destinatario. */
  denominacion: string;

  /** Identificador del país asociado al domicilio. */
  domicilioPais: number;

  /** Estado asociado al domicilio del destinatario. */
  domicilioEstado: string;

  /** Municipio asociado al domicilio del destinatario. */
  domicilioMunicipio: string;

  /** Localidad asociada al domicilio del destinatario. */
  domicilioLocalidad: string;

  /** Código postal del domicilio del destinatario. */
  domicilioCodigo: string;

  /** Colonia asociada al domicilio del destinatario. */
  domicilioColonia: string;

  /** Calle del domicilio del destinatario. */
  domiciliCalle: string;

  /** Número exterior del domicilio. */
  domiciliNumeroExterior: string;

  /** Número interior del domicilio. */
  domiciliNumeroInterior: string;

  /** Código LADA asociado al teléfono del destinatario. */
  domiciliLada: string;

  /** Número telefónico del destinatario. */
  domiciliTelefono: string;

  /** Correo electrónico del destinatario. */
  domiciliCorreoElectronioco: string;
}
