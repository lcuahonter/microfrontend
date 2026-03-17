/**
  * @constant ERROR_FORMA_ALERT
  * @type {string}
  * @description
  * Este mensaje de alerta informa al usuario sobre el proceso para agregar datos del traslado y la sede, 
  * indicando que a cada traslado le corresponde una sede con un máximo de dos itinerarios.
  */
export const ERROR_FORMA_ALERT =
`
<div class="d-flex justify-content-center text-center">
  <div>
    <div class="col-md-12">
      <strong>¡Error de registro!</strong> Faltan campos por capturar.
    </div>
  </div>
</div>
`;

/**
 * Genera el mensaje HTML que se muestra cuando una solicitud ha sido registrada exitosamente.
 * Incluye el número temporal de la solicitud y una advertencia sobre su validez legal.
 * @param numeroSolicitud Número temporal asignado a la solicitud.
 * @returns {string} Mensaje HTML de registro exitoso.
 */
export const MSG_REGISTRO_EXITOSO = (numeroSolicitud: string): string =>
  `<div class="d-flex justify-content-center text-center">
    <p>La solicitud ha quedado regitrada con el número temporal ${numeroSolicitud ?? ''}. Éste no tiene validez legal y sirve solamente para efectos de identificar tu solicitud. Un folio oficial le será asignado a la solicitud al momento en que ésta sea firmada.</p>
  </div>`;

  /**
 * @constant TEXTOS
 */
export const TEXTOS = `<h4 class="d-flex justify-content-center text-center">Aviso de privacidad simplificado</h4><p>El Servicio de Administración Tributaria (SAT), es el sujeto obligado y responsable del tratamiento de los datos personales que se recaban a través de la Ventanilla Digital Mexicana de Comercio Exterior (VUCEM), los datos personales podrán ser utilizados y transferidos a la autoridades competentes, con la finalidad de llevar a cabo cualquier trámite relacionado con importaciones, exportaciones y tránsito de mercancías de comercio exterior, incluyendo las regulaciones y restricciones no arancelarias que, conforme a la legislación aplicable, sea exigido por las autoridades competentes en materia de comercio exterior y/o consultar información sobre los procedimientos para la importación, exportación y tránsito de mercancías de comercio exterior, incluyendo las regulaciones y restricciones no arancelarias, así como las notificaciones que se deriven de dichos trámites y serán protegidos, incorporados y tratados en el sistema de datos personales de la VUCEM, asimismo podrán ser transmitidos a las autoridades competentes establecidas en el Decreto por el que se establece la Ventanilla Digital Mexicana de Comercio Exterior, publicado en el Diario Oficial de la Federación el 14 de enero de 2011, así como al propio titular de la información. El titular, en su caso, podrá manifestar su negativa para el tratamiento de sus datos personales para finalidades y transferencias de los mismos que requieran el consentimiento del titular. Si desea conocer nuestro aviso de privacidad integral, lo podrá consultar en el portal.</p><div class="d-flex justify-content-center text-center"><a href="#">Aviso de privacidad integral</a></div>`;