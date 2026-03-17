import { CatalogosSelect } from '@libs/shared/data-access-user/src';
import { MateriaResiduo } from './materia-residuo.model';

/**
 * Representa un aviso de catálogo con diversas opciones seleccionables.
 */
export interface AvisoCatalogo {
  /**
   * Clave de fracción arancelaria seleccionada.
   *
   * @type {CatalogosSelect}
   */
  cveFraccionArancelaria: CatalogosSelect;

  /**
   * Entidad federativa seleccionada.
   *
   * @type {CatalogosSelect}
   */
  entidadFederativa: CatalogosSelect;

  /**
   * Delegación o municipio seleccionado.
   *
   * @type {CatalogosSelect}
   */
  delegacionMunicipio: CatalogosSelect;

  /**
   * Colonia seleccionada.
   *
   * @type {CatalogosSelect}
   */
  colonia: CatalogosSelect;

  /**
   * Aduana de importación seleccionada.
   *
   * @type {CatalogosSelect}
   */
  aduanaDeImportacion: CatalogosSelect;

  /**
   * Opción de tipo de documento seleccionado.
   *
   * @type {CatalogosSelect}
   */
  opcionTipoDeDocumento: CatalogosSelect;
}

/**
 * Representa una operación de importación con datos esenciales.
 */
export interface OperacionDeImportacion {
  /**
   * Nombre del agente aduanal.
   *
   * @type {string}
   */
  agenteAduanal: string;

  /**
   * RFC del importador.
   *
   * @type {string}
   */
  rfc: string;

  /**
   * Número de pedimento asociado a la importación.
   *
   * @type {string}
   */
  numeroDePedimento: string;

  /**
   * Aduana donde se realiza la importación.
   *
   * @type {string}
   */
  aduanaDeImportacion: string;
}

/**
 * Representa los requisitos obligatorios de un proceso de importación.
 */
export interface RequisitosObligatorios {
  /**
   * Número de serie del producto.
   *
   * @type {number}
   */
  numeroDeSerie: number;

  /**
   * Valor asociado al requisito obligatorio.
   *
   * @type {string}
   */
  valor: string;
}

/**
 * Representa un aviso con opciones de radio y su estado de selección.
 */
export interface AvisoOpcionesDeRadio {
  /**
   * Lista de opciones de radio disponibles.
   *
   * @type {OpcionesDeRadio[]}
   */
  opcionesDeRadio: OpcionesDeRadio[];

  /**
   * Indica si la selección es obligatoria.
   *
   * @type {boolean}
   */
  required: boolean;
}

/**
 * Representa una opción de radio con su etiqueta y valor asociado.
 */
export interface OpcionesDeRadio {
  /**
   * Etiqueta de la opción de radio.
   *
   * @type {string}
   */
  label: string;

  /**
   * Valor asociado a la opción de radio.
   *
   * @type {string | number}
   */
  value: string | number;
}

/**
 * Interface para los datos recibidos al agregar un residuo peligroso.
 */
export interface ResiduoAgregadoData {
  /** Acotación o nota adicional sobre el residuo. */
  acotacion?: string;
  /** Cantidad numérica del residuo. */
  cantidad?: string;
  /** Cantidad expresada en letra. */
  cantidadLetra?: string;
  /** Nombre del residuo. */
  nombre?: string;
  /** Descripción detallada del residuo. */
  descripcion?: string;
  /** Número de manifiesto asociado. */
  manifiesto?: string;
  /** Capacidad del contenedor. */
  capacidad?: string;
}

/**
 * Interface para los datos de residuo peligroso en la tabla.
 * Combina datos generales y características del residuo.
 */
export interface ResiduoPeligroso
  extends DatosResiduos,
    CaracteristicasResiduos {
  /** Identificador único del residuo. */
  id?: number;
  /** Origen o lugar de generación del residuo. */
  origenResiduoGeneracion: string;
  /** Nombre del residuo peligroso. */
  nombreResiduo: string;
  /** Acotación o nota adicional sobre el residuo. */
  acotacion: string;
  /** Cantidad numérica del residuo. */
  cantidad: string;
  /** Cantidad expresada en letra. */
  cantidadLetra: string;
  /** Número de manifiesto de entrega, transporte y recepción. */
  numeroManifiesto: string;
  /** Capacidad del contenedor o envase. */
  capacidad: string;
  /** Lista de materias primas relacionadas con el residuo. */
  materiasPrimasRelacionadas: MateriaResiduo[];

  /** Descripción de la especie (Clave, Nombre, Descripción) */
  desc_especie?: string;
}


/**
 * Interface para los datos generales de residuos.
 * Contiene información de clasificación arancelaria y nomenclatura.
 */
export interface DatosResiduos {
  /** Clave de la fracción arancelaria. */
  fraccionCve: string;
  /** Descripción de la fracción arancelaria. */
  fraccionDesc: string;
  /** Clave NICO del residuo. */
  nicoCve: string;
  /** Descripción de la clave NICO. */
  nicoDesc: string;
  /** Clave de la unidad de medida. */
  unidadMedidaCve: string;
  /** Descripción de la unidad de medida. */
  unidadMedidaDesc: string;
  /** Clave del residuo. */
  residuoCve: string;
  /** Descripción del residuo. */
  residuoDesc: string;
  /** Nombre del residuo. */
  residuoNombre: string;
  /** Descripción del nombre del residuo. */
  residuoNombreDesc: string;
  /** Clave de la descripción del residuo. */
  residuoDescCve: string;
  /** Descripción completa del residuo. */
  residuoDescDesc: string;
  /** Otra descripción o clasificación del residuo. */
  residuoOtro: string;
}

/**
 * Interface para las características de los residuos.
 * Define propiedades físicas y de clasificación del residuo peligroso.
 */
export interface CaracteristicasResiduos {
  /** Clave CRETI (Corrosivo, Reactivo, Explosivo, Tóxico, Inflamable). */
  cretiCve: string;
  /** Descripción del código CRETI. */
  cretiDesc: string;
  /** Clave del estado físico del residuo. */
  estadoFisicoCve: string;
  /** Descripción del estado físico. */
  estadoFisicoDesc: string;
  /** Descripción de otro estado físico no catalogado. */
  estadoFisicoOtro: string;
  /** Clave del tipo de contenedor. */
  tipoContenedorCve: string;
  /** Descripción del tipo de contenedor. */
  tipoContenedorDesc: string;
  /** Descripción de otro tipo de contenedor no catalogado. */
  tipoContenedorOtro: string;
}


/**
 * Interface para el formulario de residuo peligroso.
 * Contiene todos los campos necesarios para capturar información de un residuo.
 */
export interface ResiduoPeligrosoFormulario {
  /** Origen o lugar de generación del residuo. */
  origenResiduoGeneracion: string;
  /** Clave de la fracción arancelaria. */
  fraccionArancelaria: string;
  /** Nombre del residuo. */
  nombreResiduo: string;
  /** Clave NICO del residuo. */
  nico: string;
  /** Acotación o nota adicional. */
  acotacion: string;
  /** Nombre específico del residuo peligroso según normativa. */
  nombreResiduoPeligroso: string;
  /** Cantidad numérica del residuo. */
  cantidad: string;
  /** Cantidad expresada en letra. */
  cantidadLetra: string;
  /** Clave de la unidad de medida. */
  unidadMedida: string;
  /** Clave de clasificación del residuo. */
  claveClasificacion: string;
  /** Nombre de la clasificación. */
  nombreClasificacion: string;
  /** Descripción de la clasificación. */
  descripcionClasificacion: string;
  /** Descripción de otra clasificación si aplica. */
  descripcionOtraClasificacion: string;
  /** Código CRETI del residuo. */
  creti: string;
  /** Clave del estado físico. */
  estadoFisico: string;
  /** Descripción de otro estado físico si aplica. */
  descripcionOtroEstadoFisico: string;
  /** Número de manifiesto. */
  numeroManifiesto: string;
  /** Clave del tipo de contenedor. */
  tipoContenedor: string;
  /** Descripción de otro tipo de contenedor si aplica. */
  descripcionOtroContenedor: string;
  /** Capacidad del contenedor. */
  capacidad: string;
  /** Nombre descriptivo de la fracción arancelaria. */
  fraccionName: string;
  /** Nombre descriptivo de NICO. */
  nicoName: string;
  /** Nombre descriptivo de la unidad de medida. */
  unidadMedidaName: string;
  /** Descripción de la clave de clasificación. */
  claveClasificacionDesc: string;
  /** Nombre alternativo de la clasificación. */
  nameClasificacion: string;
  /** Descripción alternativa de la clasificación. */
  descClasificacion: string;
  /** Descripción del código CRETI. */
  cretiDesc: string;
  /** Descripción del estado físico. */
  estadoFisicoDesc: string;
  /** Descripción del tipo de contenedor. */
  tipoContenedorDesc: string;
}
