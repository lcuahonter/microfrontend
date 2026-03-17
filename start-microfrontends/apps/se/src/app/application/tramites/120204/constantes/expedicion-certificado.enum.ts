import { ConfiguracionColumna } from "@libs/shared/data-access-user/src";
import { ExpedirMonto } from "../models/expedicion-certificados-asignacion.model";

/**
 * Contiene el mensaje HTML que informa al usuario sobre el registro temporal
 * de una solicitud. Este mensaje incluye un número temporal que no tiene 
 * validez legal y sirve únicamente para identificar la solicitud hasta que 
 * sea firmada y se le asigne un folio oficial.
 */
export const REQUISITOS = `<p>La solicitud ha quedado registrada con el número temporal 202740588. Este no tiene validez legal y sirve solamente para efectos de identificar tu Solicitud. Un folio oficial le será asignado a la solicitud al momento en que esta sea firmada.<p>`

/**
 * Texto que describe los requisitos y proporciona información sobre el número temporal de solicitud.
 * @type {string}
 * @constant
 */
export const TEXTOS_REQUISITOS =
  'Para continuar con el trámite, debes agregar por lo menos una mercancía.';

  /**
 * Mensaje de alerta que indica que se debe agregar al menos una mercancía para continuar con el trámite.
 */
export const ALERTA_COM = {
  inst: `<h6 class="text-center">Aviso de privacidad simplificado</h6><p>El Servicio de Administración Tributaria (SAT), es el sujeto obligado y responsable del tratamiento de los datos personales que se recaban a través de la Ventanilla Digital Mexicana de Comercio Exterior (VUCEM), los datos personales podrán ser utilizados y transferidos a la autoridades competentes, con la finalidad de llevar a cabo cualquier trámite relacionado con importaciones, exportaciones y tránsito de mercancías de comercio exterior, incluyendo las regulaciones y restricciones no arancelarias que, conforme a la legislación aplicable, sea exigido por las autoridades competentes en materia de comercio exterior y/o consultar información sobre los procedimientos para la importación, exportación y tránsito de mercancías de comercio exterior, incluyendo las regulaciones y restricciones no arancelarias, así como las notificaciones que se deriven de dichos trámites y serán protegidos, incorporados y tratados en el sistema de datos personales de la VUCEM, asimismo podrán ser transmitidos a las autoridades competentes establecidas en el Decreto por el que se establece la Ventanilla Digital Mexicana de Comercio Exterior, publicado en el Diario Oficial de la Federación el 14 de enero de 2011, así como al propio titular de la información. El titular, en su caso, podrá manifestar su negativa para el tratamiento de sus datos personales para finalidades y transferencias de los mismos que requieran el consentimiento del titular. Si desea conocer nuestro aviso de privacidad integral, lo podrá consultar en el portal.</p><div class="row"><div class="col-md-12 text-center"><a href="#" target="_blank">Aviso de privacidad integral</a></div></div>`,
};

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
      <strong>Corrija los siguientes errores:</strong>
    </div>
    <div class="col-md-12">
    <span class="">1.</span>
    <span>
      El certificado no ha sido capturado
    </span>
    </div>
  </div>
</div>
`;

/**
 * Mensaje de error que se muestra cuando el usuario intenta continuar sin seleccionar una licitación.
 */
export const ERROR_LICITACION_NO_SELECCIONADA = 
`
<div class="d-flex justify-content-center text-center">
  <div>
    <div class="col-md-12">
      <strong>Corrija los siguientes errores:</strong>
    </div>
    <div class="col-md-12">
    <span style="left: 205px; position: inherit;">
      Debe seleccionar una licitación.
    </span>
    </div>
  </div>
</div>
`;

/**
 * Constantes para la configuración de la tabla de expedición de certificados
 */
export const CONFIGURACION_PARA_ENCABEZADO_DE_EXPEDIR_MONTO_TABLA: ConfiguracionColumna<ExpedirMonto>[] = [
  { encabezado: 'Monto a expedir', clave: (fila) => fila.montoExpedir, orden: 1 },
];