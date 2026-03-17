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
  { label: 'Física', value: 'fisica' },
  { label: 'Moral', value: 'moral' },
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
  { label: 'Prórroga', value: '0' },
  { label: 'Modificación', value: '1' },
  { label: 'Modificación y prórroga', value: '2' },
];

/**
 * Opciones para el botón de radio de la sección de hacerlos.
 */
export const HACERLOS_RADIO_OPTIONS = [
  { label: 'No', value: '0' },
  { label: 'Sí', value: '1' },
];

export const NOTA = {
  REQUISITO_OBLIGATORIO_PARA_ACCEDER_NOTA: 'Selecciona sólo un registro para modificar',
  DEBE_CAPTURAR: 'Selecciona un registro.',

};



/**
 * Mensaje de validación que solicita confirmación al usuario
 * sobre la ausencia de datos relacionados con el pago de derechos.
 */
export const MENSAJE_DE_VALIDACION = '<div><b>¡Error de registro!</b> Faltan campos por capturar.</div>';

/**
 * Mensaje de validación que solicita confirmación al usuario
 * sobre la ausencia de datos relacionados con el pago de derechos.
 */
export const MENSAJE_DE_VALIDACION_PAGO_DERECHOS = '<div>¿Está seguro que su solicitud no requiere los datos del Pago de derechos?</div>';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const MSG_REGISTRO_EXITOSO = (numeroSolicitud: string) =>
  `<p style="text-align: center;">
    La solicitud ha quedado registrada con el número temporal ${numeroSolicitud ?? ''}. 
    Este no tiene válidez legal y sirve solamente para efectos de identificar tu solicitud. 
    Un folio oficial le será asignado al momento en que ésta sea firmada.
  </p>`;