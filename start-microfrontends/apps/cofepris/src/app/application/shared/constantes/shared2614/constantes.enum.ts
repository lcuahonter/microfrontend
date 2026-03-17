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
 * Opciones para el botón de radio del tipo de persona.
 */
export const TIPO_PERSONA_RADIO_OPTIONS = [
  { label: 'Física', value: 'Fisica', hint: 'Una persona física es entendida como toda persona con una actividad específica' },
  { label: 'Moral', value: 'Moral', hint: 'Una persona moral es entendida como una empresa con una actividad específica' },
];

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