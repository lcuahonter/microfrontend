import { CatalogosSelect } from "@libs/shared/data-access-user/src";

/**
 * @interface ColumnasTabla
 * Interfaz que define las columnas de la tabla de mercancías disponibles
 */
export interface ColumnasTabla {
  /** Identificador único de la mercancía */
  id?:string;
  /** Fracción arancelaria de la mercancía */
  fraccionArancelaria: string;
  /** Nombre técnico del producto */
  nombreTecnico: string;
  /** Nombre comercial del producto */
  nombreComercial: string;
  /** Fecha de expedición del certificado */
  fechaExpedicion: string;
  /** Fecha de vencimiento del certificado */
  fechaVencimiento: string;
  /** Criterio de origen del producto */
  criterioOrigen?: string;
  /** Número de registro de productos */
  numeroRegistroProducto?: string;
}

/**
 * @interface SeleccionadasTabla
 * Interfaz que define las columnas de la tabla de mercancías seleccionadas
 */
export interface SeleccionadasTabla {
  /** Identificador único de la mercancía seleccionada */
  id?: number;
  /** Fracción arancelaria de la mercancía seleccionada */
  fraccionArancelaria: string;
  /** Cantidad de la mercancía */
  cantidad: string;
  /** Unidad de medida de la mercancía */
  unidadMedida: string;
  /** Valor monetario de la mercancía */
  valorMercancia: string;
  /** Tipo de factura utilizada */
  tipoFactura: string;
  /** Número de la factura */
  numFactura: string;
  /** Descripción complementaria de la mercancía */
  complementoDescripcion: string;
  /** Fecha de emisión de la factura */
  fechaFactura: string;
}

/** Configuración para el campo de fecha inicial del periodo */
export const FECHAINICIAL = {
  labelNombre: 'Fecha inicio',
  required: false,
  habilitado: true,
};

/** Configuración para el campo de fecha final del periodo */
export const FECHAFINAL = {
  labelNombre: 'Fecha fin',
  required: false,
  habilitado: true,
};

/** Configuración para el campo de fecha de la factura */
export const FECHAFACTURA = {
  labelNombre: 'Fecha fin',
  required: true,
  habilitado: true,
};

/** Opciones del catálogo de tratados comerciales */
export const OPTIONS_TRATADO: CatalogosSelect = {
  labelNombre: 'Tratado/Acuerdo',
  required: true,
  primerOpcion: 'Selecciona un valor',
  catalogos: [],
}

/** Opciones del catálogo de países o bloques comerciales */
export const OPTIONS_PAIS: CatalogosSelect = {
  labelNombre: 'País / Bloque',
  required: true,
  primerOpcion: 'Selecciona un valor',
  catalogos: [],
}

/** Opciones del catálogo de unidades de medida comercial (UMC) */
export const OPTIONS_UMC: CatalogosSelect = {
  labelNombre: 'UMC',
  required: true,
  primerOpcion: 'Selecciona un valor',
  catalogos: [],
}

/** Opciones del catálogo de unidades de medida para masa bruta */
export const OPTIONS_UNIDAD_MEDIDA: CatalogosSelect = {
  labelNombre: 'Unidad de medida de la masa bruta',
  required: true,
  primerOpcion: 'Selecciona un valor',
  catalogos: [],
}

/** Opciones del catálogo de tipos de factura */
export const OPTIONS_TIPO_FACTURA: CatalogosSelect = {
  labelNombre: 'Tipo de factura',
  required: true,
  primerOpcion: 'Selecciona un valor',
  catalogos: [],
}

/** Opciones del catálogo de idiomas disponibles */
export const OPTIONS_IDIOMA: CatalogosSelect = {
  labelNombre: 'Idioma',
  required: true,
  primerOpcion: 'Selecciona un valor',
  catalogos: [],
}

/** Opciones del catálogo de entidades federativas */
export const OPTIONS_ENTIDAD_FEDERATIVA: CatalogosSelect = {
  labelNombre: 'Entidad federativa',
  required: true,
  primerOpcion: 'Selecciona un valor',
  catalogos: [],
}

/** Opciones del catálogo de representaciones federales */
export const OPTIONS_REPRESENTACION_FEDERAL: CatalogosSelect = {
  labelNombre: 'Representación federal',
  required: true,
  primerOpcion: 'Selecciona un valor',
  catalogos: [],
}

/** Opciones del catálogo de países de destino */
export const OPTIONS_NACION: CatalogosSelect = {
  labelNombre: 'País destino',
  required: true,
  primerOpcion: 'Selecciona un valor',
  catalogos: [],
}

/** Opciones del catálogo de medios de transporte */
export const OPTIONS_TRANSPORTE: CatalogosSelect = {
  labelNombre: 'Medio de transporte',
  required: false,
  primerOpcion: 'Selecciona un valor',
  catalogos: [],
};

/** Configuración para el campo de despacho LDA */
export const DESPACHO_LDA = {
  labelNombre: 'Sí',
  maxlength: 10,
  minlenght: 0,
  required: false,
  alfanumerico: true,
};
