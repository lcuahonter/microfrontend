import { CatalogosSelect } from "@libs/shared/data-access-user/src";

/**
 * Textos relacionados con el aprovechamiento.
 */
export enum AprovechamientoTextos {
  /** Texto para el aprovechamiento parcial. */
  PARCIAL = 'Pago de aprovechamiento con compensación y/o disminución parcial',
  /** Texto para el aprovechamiento total. */
  TOTAL = 'Aprovechamiento totalmente compensado y/o disminuido',
  /** Título del dictamen de aprovechamiento. */
  TITULO = 'Dictamen de compensación o disminución contra el aprovechamiento a cargo de Recintos Fiscalizados (Regla 2.3.5.)',

  

}

/**
 * Opciones para seleccionar la residencia del solicitante.
 * @constant {Array<{label: string, value: string}>}
 */
export const RADIO_RESIDENTE = [
  { label: 'Residente en territorio nacional', value: 'nacional' },
  { label: 'Residente en el extranjero', value: 'extranjero' },
]

/**
 * Opciones para seleccionar el tipo de solicitud del permiso.
 * @constant {Array<{label: string, value: string}>}
 */
export const RADIO_TIPO_SOLICITUDE = [
  { label: 'Número de permiso de internación temporal del vehículo', value: 'numero'},
  { label: 'Permiso de Importación temporal a territorio nacional', value: 'permiso'},
]
/**
 * Opciones para los radios relacionados con el aprovechamiento.
 */
export const RADIO_OPCIONS = [
  { label: 'Disminución', value: 'disminucion' },
  { label: 'Compensación', value: 'compensacion' },
  { label: 'Disminución y Compensación', value: 'disminucionYCompensacion' },
];

/**
 * Opciones para el radio relacionado con la disminución parcial.
 */
export const RADIO_PARCIAL = [
  { label: 'Sí', value: 'si' },
  { label: 'No', value: 'no' },
];

/**
 * Opciones para el radio relacionado con la disminución total.
 */
export const RADIO_TOTAL = [
  { label: 'Sí', value: 'si' },
  { label: 'No', value: 'no' },
];

/**
 * Opciones para el radio relacionado con la Vehiculo.
 */
export const RADIO_VEHICULO = [
  {
    id: 1,
    descripcion: 'Otro',
  },
  {
    id: 2,
    descripcion: 'Platforma',
  }
];

/**
 * Configuración para la fecha inicial del dictamen.
 */
export const FECHA_INICIAL = {
  /** Etiqueta para la fecha inicial. */
  labelNombre: 'Fecha de emisión',
  /** Indica si el campo es obligatorio. */
  required: true,
  /** Indica si el campo está habilitado. */
  habilitado: true,
};

/**
 * Configuración para la fecha de pago.
 */
export const FECHA_PAGO = {
  /** Etiqueta para la fecha de pago. */
  labelNombre: 'Fecha de vencimiento',
  /** Indica si el campo es obligatorio. */
  required: false,
  /** Indica si el campo está habilitado. */
  habilitado: true,
};

/**
 * Configuración para el catálogo de años.
 */
export const ANO_CATALOGO: CatalogosSelect = {
  /** Etiqueta para el catálogo de años. */
  labelNombre: 'Indique la aduana por la que saldrá el vehículo',
  /** Indica si el campo es obligatorio. */
  required: true,
  /** Texto de la primera opción del catálogo. */
  primerOpcion: 'Selecciona un valor',
  /** Lista de elementos del catálogo. */
  catalogos: [],
};

/**
 * Configuración para el catálogo de meses.
 */
export const FECHA_FRANJO = {
   /** Etiqueta para la fecha inicial. */
   labelNombre: 'Fecha del pedimento de Importación definitiva a región o franja fronteriza:*',
   /** Indica si el campo es obligatorio. */
   required: true,
   /** Indica si el campo está habilitado. */
   habilitado: true,
};


/**
 * Configuración para el catálogo de meses.
 */
export const FECHA_ACUSE = {
   /** Etiqueta para la fecha inicial. */
   labelNombre: 'Fecha de acuse de recibo',
   /** Indica si el campo es obligatorio. */
   required: true,
   /** Indica si el campo está habilitado. */
   habilitado: true,
};

