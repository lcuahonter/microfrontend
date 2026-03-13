/** Constante que representa las tarimas y embalaje de madera como soporte de mercancía.*/
export const MADERA = [
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
    /** Índice del paso dentro del flujo. */
    indice: 2,
    /** Título descriptivo del paso. */
    titulo: 'Anexar requisitos',
    /** Indica si este paso está actualmente activo. */
    activo: false,
    /** Indica si este paso ya fue completado. */
    completado: false,
  },
  {
    /** Índice del paso dentro del flujo. */
    indice: 3,
    /** Título descriptivo del paso. */
    titulo: 'Firmar solicitud',
    /** Indica si este paso está actualmente activo. */
    activo: false,
    /** Indica si este paso ya fue completado. */
    completado: false,
  },
];

/** 
 * Lista de opciones para el botón de radio que representa el tipo de movimiento.
 * Cada objeto contiene una etiqueta descriptiva y un valor asociado.
 */
export const MOVIMIENTO_OPCIONES_DE_BOTON_DE_RADIO = [
  {
    /** Etiqueta mostrada para la opción 'Importación'. */
    label: 'Importación',
    /** Valor interno asociado a la opción 'Importación'. */
    value: '1',
  },
  {
    /** Etiqueta mostrada para la opción 'Exportación'. */
    label: 'Exportación',
    /** Valor interno asociado a la opción 'Exportación'. */
    value: '2',
  },
  {
    /** Etiqueta mostrada para la opción 'Reexportación'. */
    label: 'Reexportación',
    /** Valor interno asociado a la opción 'Reexportación'. */
    value: '3',
  },
];

/**
 * Lista de opciones para el botón de radio que representa el tipo de destinatario.
 * Cada objeto define una etiqueta visible y su valor correspondiente.
 */
export const DESTINATARIO_OPCIONES_DE_BOTON_DE_RADIO = [
  {
    /** Etiqueta mostrada para la opción 'Nacional'. */
    label: 'Nacional',
    /** Valor interno asociado a la opción 'Nacional'. */
    value: '1',
  },
  {
    /** Etiqueta mostrada para la opción 'Extranjero'. */
    label: 'Extranjero',
    /** Valor interno asociado a la opción 'Extranjero'. */
    value: '2',
  }
];

/**
 * Constante que representa la fecha de pago como un campo de entrada.
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

/** Mensaje de alerta para la tarima y embalaje de madera */
export const MADERA_ALERT = 'La solicitud ha quedado registrada con el número temporal 202772448. Éste no tiene validez legal y sirve solamente para efectos de identificar tu solicitud. Un folio oficial le será asignado a la solicitud al momento en que ésta sea firmada';

