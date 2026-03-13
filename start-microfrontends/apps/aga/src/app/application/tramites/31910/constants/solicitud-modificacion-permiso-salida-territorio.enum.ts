/**
 * Constante que define los pasos del proceso de exportación.
 * Cada paso incluye un índice, un título, y los estados de activo y completado.
 */
export const PASOS_EXPORTACION = [
  {
    /**
     * Índice del paso.
     */
    indice: 1,

    /**
     * Título del paso.
     */
    titulo: 'Capturar solicitud',

    /**
     * Indica si el paso está activo.
     */
    activo: true,

    /**
     * Indica si el paso está completado.
     */
    completado: true,
  },

  {
    indice: 2,
    titulo: 'Firmar solicitud',
    activo: false,
    completado: false,
  },
];

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const MSG_REGISTRO_EXITOSO = (numeroSolicitud: string) =>
  `<p>La solicitud ha quedado regitrada con el número temporal ${
    numeroSolicitud ?? ''
  }. Éste no tiene validez legal y sirve solamente para efectos de identificar tu solicitud. Un folio oficial le será asignado a la solicitud al momento en que ésta sea firmada.</p>`;


  /**
   * Identificador del trámite.
   */
  export const TRAMITE_ID = 31910;

  /**
   * Tipo de consulta para trámites.
   */
  export const TIPO_CONSULTRA_TRAMITE = 'consulta-tramite';