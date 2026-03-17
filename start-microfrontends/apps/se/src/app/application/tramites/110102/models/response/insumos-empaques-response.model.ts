/**
 * Modelo de respuesta para la evaluación de mercancía,
 * que contiene los datos de insumos y empaques.
 */
export interface InsumosEmpaquesResponse {

  /** Lista de insumos asociados a la mercancía.*/
  insumos?: InsumoResponse[];

  /** Lista de empaques utilizados en la mercancía. */
  empaques?: EmpaqueResponse[];
}

/**
 * Representa la información de un insumo dentro del proceso de evaluación de mercancía.
 */
export interface InsumoResponse {

  /** Nombre técnico del insumo. */
  nombre?: string;

  /** Proveedor del insumo. */
  proveedor?: string;

  /** Fabricante o productor del insumo. */
  fabricante_productor?: string;

  /** RFC del fabricante o productor del insumo. */
  rfc_fabricante_productor?: string;

  /** Clave de la fracción arancelaria correspondiente al insumo. */
  clave_fraccion_arancelaria?: string;

  /** Descripción de la fracción arancelaria. */
  descripcion_fraccion?: string;

  /** Código del capítulo arancelario. */
  capitulo?: string;

  /** Nombre del capítulo arancelario. */
  nombre_capitulo?: string;

  /** Código de la partida arancelaria. */
  partida?: string;

  /** Nombre de la partida arancelaria. */
  nombre_partida?: string;

  /** Código de la subpartida arancelaria. */
  subpartida?: string;

  /** Nombre de la subpartida arancelaria. */
  nombre_subpartida?: string;

  /** Valor monetario del insumo. */
  valor?: number;

  /** Indica si el insumo es originario o no. */
  es_originario?: string;

  /** País de origen del insumo. */
  pais_origen?: string;

  /** Peso del insumo expresado en kilogramos. */
  peso?: number;

  /** Volumen del insumo expresado en litros o metros cúbicos. */
  volumen?: number;
}

/**
 * Representa la información de un empaque dentro del proceso de evaluación de mercancía.
 */
export interface EmpaqueResponse {

  /** Nombre técnico del empaque. */
  nombre?: string;

  /** Proveedor del empaque. */
  proveedor?: string;

  /** Fabricante o productor del empaque. */
  fabricante_productor?: string;

  /** Clave de la fracción arancelaria correspondiente al empaque. */
  clave_fraccion_arancelaria?: string;

  /** Valor monetario del empaque. */
  valor?: number;

  /** Indica si el empaque es originario o no. */
  es_originario?: string;
}
