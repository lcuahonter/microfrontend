/**
 * Constante que representa las etapas del proceso de flora y fauna.
 * Cada objeto define el índice, título y estado de avance de cada paso.
 * @constant
 */
export const FLORA_FAUNA = [
  {
    /** Índice del paso dentro del flujo. */
    indice: 1,
    /** Título descriptivo del paso. */
    titulo: 'Capturar solicitud',
    /** Indica si este paso está actualmente activo. */
    activo: true,
    /** Indica si este paso ya fue completado. */
    completado: true,
  },
  {
    indice: 2,
    titulo: 'Anexar requisitos',
    activo: false,
    completado: false,
  },
  {
    indice: 3,
    titulo: 'Firmar solicitud',
    activo: false,
    completado: false,
  },
];

/**
 * Lista de opciones para el botón de radio que representa el tipo de movimiento.
 * Cada objeto contiene una etiqueta descriptiva y un valor asociado.
 * @constant
 */
export const MOVIMIENTO_OPCIONES_DE_BOTON_DE_RADIO = [
  {
    /** Etiqueta mostrada para la opción 'Importación'. */
    label: 'Importación',
    /** Valor interno asociado a la opción 'Importación'. */
    value: '1',
  },
  {
    label: 'Exportación',
    value: '2',
  },
  {
    label: 'Reexportación',
    value: '3',
  },
];

/**
 * Lista de opciones para el botón de radio que representa el tipo de destinatario.
 * Cada objeto define una etiqueta visible y su valor correspondiente.
 * @constant
 */
export const DESTINATARIO_OPCIONES_DE_BOTON_DE_RADIO = [
  {
    /** Etiqueta mostrada para la opción 'Nacional'. */
    label: 'Nacional',
    /** Valor interno asociado a la opción 'Nacional'. */
    value: '1',
  },
  {
    label: 'Extranjero',
    value: '2',
  }
];

/**
 * Configuración para el campo de fecha de pago.
 * Define la etiqueta, si es requerido y si está habilitado.
 * @constant
 */
export const INPUT_FECHA_PAGO = {
  /**
   * Propiedad labelNombre
   * Descripción: Etiqueta que se muestra como nombre del campo.
   */
  labelNombre: 'Fecha de pago',

  /**
   * Propiedad required
   * Descripción: Indica si el campo es obligatorio.
   */
  required: true,

  /**
   * Propiedad habilitado
   * Descripción: Indica si el campo está habilitado para su edición.
   */
  habilitado: true,
};

/**
 * Configuración para el campo de fecha.
 * Define la etiqueta, si es requerido y si está habilitado.
 * @constant
 */
export const INPUT_FECHA = {
  /**
   * Propiedad labelNombre
   * Descripción: Etiqueta que se muestra como nombre del campo.
   */
  labelNombre: 'Fecha',

  /**
   * Propiedad required
   * Descripción: Indica si el campo es obligatorio.
   */
  required: true,

  /**
   * Propiedad habilitado
   * Descripción: Indica si el campo está habilitado para su edición.
   */
  habilitado: true,
};

/**
 * Mensaje de alerta mostrado al registrar una solicitud de flora y fauna.
 * Informa que el número asignado es temporal y no tiene validez legal.
 * @constant
 */
export const FLORA_FAUNA_ALERT = 'La solicitud ha quedado registrada con el número temporal 202772451. Éste no tiene validez legal y sirve solamente para efectos de identificar tu solicitud. Un folio oficial le será asignado a la solicitud al momento en que ésta sea firmada';