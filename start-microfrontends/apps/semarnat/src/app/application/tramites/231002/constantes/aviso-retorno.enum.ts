/**
 * Identificador del tramite
 */
export const TRAMITE_ID = '231002';

/**
 * Valor que indica que es la primera vez que se realiza el aviso de retorno.
 */
export const ES_PRIMERA_VEZ = 'primera_vez';

/**
 * Valor que indica que se requiere la información de la empresa de reciclaje.
 */
export const REQUIERE_EMPRESA_RECICLAJE = 'si';

/**
 * Lista de pasos del proceso de solicitud.
 * Cada paso contiene su índice, título, y el estado actual (activo y completado).
 */
export const PASOS = [
  {
    indice: 1,
    titulo: 'Capturar solicitud',
    /** Indica si el paso está activo actualmente */
    activo: true,
    /** Indica si el paso ya fue completado */
    completado: true,
  },
  {
    indice: 2,
    titulo: 'Firmar solicitud',
    /** Indica que el paso aún no está activo */
    activo: false,
    /** Indica que el paso no ha sido completado */
    completado: false,
  },
];

/**
 * Contenido HTML para el aviso de privacidad simplificado.
 */
export const PAGO_DE_DERECHOS = {
  ADJUNTAR: `<h5 class="text-center">Aviso de privacidad simplificado</h5>
  <p>El Servicio de Administración Tributaria (SAT), es el sujeto obligado y responsable del tratamiento de los datos personales que se recaban a través de la Ventanilla Digital Mexicana de Comercio Exterior (VUCEM), los datos personales podrán ser utilizados y transferidos a la autoridades competentes, con la finalidad de llevar a cabo cualquier trámite relacionado con importaciones, exportaciones y tránsito de mercancías de comercio exterior, incluyendo las regulaciones y restricciones no arancelarias que, conforme a la legislación aplicable, sea exigido por las autoridades competentes en materia de comercio exterior y/o consultar información sobre los procedimientos para la importación, exportación y tránsito de mercancías de comercio exterior, incluyendo las regulaciones y restricciones no arancelarias, así como las notificaciones que se deriven de dichos trámites y serán protegidos, incorporados y tratados en el sistema de datos personales de la VUCEM, asimismo podrán ser transmitidos a las autoridades competentes establecidas en el Decreto por el que se establece la Ventanilla Digital Mexicana de Comercio Exterior, publicado en el Diario Oficial de la Federación el 14 de enero de 2011, así como al propio titular de la información. El titular, en su caso, podrá manifestar su negativa para el tratamiento de sus datos personales para finalidades y transferencias de los mismos que requieran el consentimiento del titular. Si desea conocer nuestro aviso de privacidad integral, lo podrá consultar en el portal.</p><div class="row"><div class="col-md-12 text-center mt-5 mb-3"><a href="#" target="_blank">Aviso de privacidad integral</a></div></div>`,
};

/**
 * Texto legal sobre validación de documentos INMEX y comprobantes.
 */
export const TEXTOS = {
  NOTA: `Los requisitos consistentes en presentar originales para cotejo de comprobante de domicilio y comprobante del Programa IMMEX, establecido en el Art. 124 del Reglamento de la Ley General para la Prevención y Gestión Integral de los Residuos, se cumple a través de la validación automática de los trámites del programa IMMEX de la Secretaría de Economía, que se encuentran en la Ventanilla única.`,
};
