/**
 * @descripcion
 * Constante que define los pasos del proceso de solicitud en el módulo CAM.
 */
export const PASOS = [
  {
    /**
     * @descripcion
     * Índice del paso en el proceso.
     */
    indice: 1,

    /**
     * @descripcion
     * Título descriptivo del paso.
     */
    titulo: 'Capturar solicitud',

    /**
     * @descripcion
     * Indica si el paso está activo.
     */
    activo: true,

    /**
     * @descripcion
     * Indica si el paso ha sido completado.
     */
    completado: true,
  },
  {
    /**
     * @descripcion
     * Índice del paso en el proceso.
     */
    indice: 2,
    /**
     * @descripcion
     * Título descriptivo del paso.
     */
    titulo: 'Firmar solicitud',
    /**
     * @descripcion
     * Indica si el paso está activo.
     */
    activo: false,
    /**
     * @descripcion
     * Indica si el paso ha sido completado.
     */
    completado: false,
  },
];

/**
 * @descripcion
 * Constante que define las propiedades de la fecha de pago en el formulario.
 */
export const FECHA = {
  /**
   * @descripcion
   * Etiqueta asociada al campo de fecha.
   */
  labelNombre: 'Fecha de pago',

  /**
   * @descripcion
   * Indica si el campo de fecha es obligatorio.
   */
  required: true,

  /**
   * @descripcion
   * Indica si el campo de fecha está habilitado.
   */
  habilitado: false,
};


/**
 * Fecha de pago por defecto (formato DD/MM/YYYY).
 * @const
 * @type {string}
 */
export const ERROR_FORMA_ALERT =
  `
<div class="d-flex justify-content-center text-center">
  <div>
    <div class="col-md-12">
      Faltan campos por capturar.
    </div>
  </div>
</div>
`

/** Genera el mensaje HTML para registro exitoso
 * @param numeroSolicitud Número de solicitud a incluir en el mensaje
 * @returns Mensaje HTML formateado para registro exitoso
 */
export const MSG_REGISTRO_EXITOSO = (numeroSolicitud: string): string =>
  `<p>La solicitud ha quedado registrada con el número temporal ${numeroSolicitud ?? ''}. Este no tiene válidez legal y sirve solamente para efectos de identificar tu solicitud. Un folio oficial le será asignado al momento en que ésta sea firmada.</p>`;

/**
 * Constante que define los textos utilizados en el trámite.
 * 
 * Esta constante contiene textos como instrucciones o mensajes que se muestran
 * en la interfaz del usuario.
 */
export const TEXTOS = {
  INSTRUCCIONES: `<h5 class="text-center">Aviso de privacidad simplificado</h5>
      <p class="text-start">El Servicio de Administración Tributaria (SAT), es el sujeto obligado y responsable del tratamiento de los datos personales que se recaban a través de la Ventanilla Digital Mexicana de Comercio Exterior (VUCEM), los datos personales podrán ser utilizados y
transferidos a la autoridades competentes, con la finalidad de llevar a cabo cualquier trámite relacionado con importaciones, exportaciones y tránsito de mercancías de comercio exterior, incluyendo las regulaciones y restricciones no arancelarias que, conforme
a la legislación aplicable, sea exigido por las autoridades competentes en materia de comercio exterior y/o consultar información sobre los procedimientos para la importación, exportación y tránsito de mercancías de comercio exterior, incluyendo las regulaciones y
restricciones no arancelarias, así como las notificaciones que se deriven de dichos trámites y serán protegidos, incorporados y tratados en el sistema de datos personales de la VUCEM, asimismo podrán ser transmitidos a las autoridades competentes establecidas en el
Decreto por el que se establece la Ventanilla Digital Mexicana de Comercio Exterior, publicado en el Diario Oficial de la Federación el 14 de enero de 2011, así como al propio titular de la información. El titular, en su caso, podrá manifestar su negativa para el tratamiento de
sus datos personales para finalidades y transferencias de los mismos que requieran el consentimiento del titular. Si desea conocer nuestro aviso de privacidad integral, lo podrá consultar en el portal.</p>
  <p class="mt-5 mb-3 text-muted text-center">
    <a href="https://www.ventanillaunica.gob.mx/vucem/estadisticas/Aviso_Privacidad_Integral.pdf" target="_blank" class="text-primary">Aviso de privacidad integral</a>
  </p>
      `,
};