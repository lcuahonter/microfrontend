/**
 * Constante que agrupa los textos utilizados en la aplicación para diferentes secciones y funcionalidades.
 */
export const TEXTOS = {
  /** Texto para la sección de solicitudes */
  TEXTOS_SOLICITUD: 'Al dar doble-clic en una Solicitud, se copiarán sus datos en esta Solicitud.',

  /** Texto para la sección de manifiestos */
  TEXTOS_MANIFIESTOS: 'Cumplo con los requisitos y normatividad aplicable, sin que me eximan de que la autoridad sanitaria verifique su cumplimiento, esto sin perjuicio de las sanciones en que puedo incurrir por falsedad de declaraciones dadas a una autoridad. Asimismo acepto que la notificacion de este tramite, sea a traves de la Ventanilla Unica de Comercio Exterior por los mecanismos de la misma.',

  /** Texto para la sección de terceros */
  TEXTOS_TERCEROS: 'Las tablas con asterisco son obligatorias y debes agregar por lo menos un registro.',
};

/**
 * Constante para alertas utilizadas en la aplicación.
 */
export const ALERT = {
  /** Alerta para la sección de solicitudes */
  ALERTA: `Al dar doble-clic en una Solicitud, se copiarán sus datos en esta Solicitud.`,
};

/**
 * Opciones para el botón de radio de la sección de solicitudes.
 */
export const OPCION_DE_BOTON_DE_RADIO = [
  { label: 'Prórroga', value: 'prorroga' },
  { label: 'Modificación', value: 'modificacion' },
  { label: 'Modificación y prórroga', value: 'modificacion_prorroga' },
];

/**
 * Opciones para el botón de radio de la sección de hacerlos.
 */
export const HACERLOS_RADIO_OPTIONS = [
  { label: 'No', value: 'no' },
  { label: 'Sí', value: 'si' },
];

/**
 * Mensaje de advertencia para la sección de localidad y colonia.
 */
export const LOCALIDAD_COLONIA = {
  mensaje: `<p>¡Precaución! Debes capturar localidad y colonia</p>`,
};

/**
 * Opciones para el botón de radio de tipo de persona.
 */
export const TIPO_PERSONA_RADIO_OPTIONS = [
  { label: 'Física', value: 'fisica' },
  { label: 'Moral', value: 'moral' },
];

/**
 * Opciones para el botón de radio de nacionalidad de terceros.
 */

export const TERCEROS_NACIONALIDAD_RADIO_OPTIONS = [
  { label: 'Nacional', value: 'nacional' },
  { label: 'Extranjero', value: 'extranjero' },
];