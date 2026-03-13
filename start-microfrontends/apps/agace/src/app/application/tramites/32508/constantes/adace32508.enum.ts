import { CatalogosSelect } from "@libs/shared/data-access-user/src";

/**
 * Textos relacionados con el aprovechamiento.
 */
export enum AprovechamientoTextos {
  /** Texto para el aprovechamiento parcial. */
  PARCIAL = 'Pago de aprovechamiento con compensación y/o disminución parcial',
  /** Texto para el aprovechamiento total. */
  TOTAL = 'Aprovechamiento totalmente compensado y/o disminuido',
  /** Título del dictamen de aprovechamiento. */
  TITULO = 'Dictamen de compensación o disminución contra el aprovechamiento a cargo de Recintos Fiscalizados (Regla 2.3.5.)'
}

/**
 * Opciones para los radios relacionados con el aprovechamiento.
 */
export const RADIO_OPCIONS = [
  { label: 'Disminución', value: 'disminucion' },
  { label: 'Compensación', value: 'compensacion' },
  { label: 'Disminución y Compensación', value: 'disminucionYCompensacion' },
];

/**
 * Opciones para el radio relacionado con la disminución parcial.
 */
export const RADIO_PARCIAL = [
  { label: 'Sí', value: 'si' },
  { label: 'No', value: 'no' },
];

/**
 * Opciones para el radio relacionado con la disminución total.
 */
export const RADIO_TOTAL = [
  { label: 'Sí', value: 'si' },
  { label: 'No', value: 'no' },
];

/**
 * Configuración para la fecha inicial del dictamen.
 */
export const FECHA_INICIAL = {
  /** Etiqueta para la fecha inicial. */
  labelNombre: 'Fecha de elaboración del dictamen',
  /** Indica si el campo es obligatorio. */
  required: true,
  /** Indica si el campo está habilitado. */
  habilitado: true,
};

/**
 * Configuración para la fecha de pago.
 */
export const FECHA_PAGO = {
  /** Etiqueta para la fecha de pago. */
  labelNombre: 'Fecha de pago',
  /** Indica si el campo es obligatorio. */
  required: true,
  /** Indica si el campo está habilitado. */
  habilitado: true,
};

/**
 * Configuración para el catálogo de años.
 */
export const ANO_CATALOGO: CatalogosSelect = {
  /** Etiqueta para el catálogo de años. */
  labelNombre: 'Año del periodo reportado',
  /** Indica si el campo es obligatorio. */
  required: true,
  /** Texto de la primera opción del catálogo. */
  primerOpcion: 'Selecciona un valor',
  /** Lista de elementos del catálogo. */
  catalogos: [],
};

/**
 * Configuración para el catálogo de meses.
 */
export const MES_CATALOGO: CatalogosSelect = {
  /** Etiqueta para el catálogo de meses. */
  labelNombre: 'Mes del periodo reportado',
  /** Indica si el campo es obligatorio. */
  required: true,
  /** Texto de la primera opción del catálogo. */
  primerOpcion: 'Selecciona un valor',
  /** Lista de elementos del catálogo. */
  catalogos: [],
};

/**
 * Constante de tipo persona moral
 */
export const TIPO_MORAL: string = "M";

/**
 * Constante de tipo persona fisica
 */
export const TIPO_FISICA: string = "F";

/**
 * Contiene el texto HTML para mostrar un aviso de privacidad simplificado.
 * Este aviso informa al usuario sobre el tratamiento de datos personales por parte del
 Servicio de  Administración Tributaria (SAT)
 * @constant
 * @type {string}
 */
export const ALERT_TEXTO = `<div>  
  <div style="text-align: center; margin-bottom: 10px;">
    <strong style="color: #007baf;">Aviso de privacidad simplificado</strong>
  </div>
  <p style="margin-top: 10px; text-align: justify;">
    El Servicio de Administración Tributaria (SAT), es el sujeto obligado y responsable del tratamiento de los datos personales que se recaban a través de la Ventanilla Digital Mexicana de Comercio Exterior (VUCEM), los datos personales podrán ser utilizados y transferidos a las autoridades competentes, con la finalidad de llevar a cabo cualquier trámite relacionado con importaciones, exportaciones y tránsito de mercancías de comercio exterior, incluyendo las regulaciones y restricciones no arancelarias que, conforme a la legislación aplicable, sea exigido por las autoridades competentes en materia de comercio exterior y/o consultar información sobre los procedimientos para la importación, exportación y tránsito de mercancías de comercio exterior, incluyendo las regulaciones y restricciones no arancelarias, así como las notificaciones que se deriven de dichos trámites y serán protegidos, incorporados y tratados en el sistema de datos personales de la VUCEM, asimismo podrán ser transmitidos a las autoridades competentes establecidas en el Decreto por el que se establece la Ventanilla Digital Mexicana de Comercio Exterior, publicado en el Diario Oficial de la Federación el 14 de enero de 2011, así como al propio titular de la información. El titular, en su caso, podrá manifestar su negativa para el tratamiento de sus datos personales para finalidades y transferencias de los mismos que requieran el consentimiento del titular. Si desea conocer nuestro aviso de privacidad integral, lo podrá consultar en el portal.
  </p>
  <p style="margin-top: 10px;text-align: center;">
    <a href="#" style="text-decoration: underline;">Aviso de privacidad integral</a>
  </p>
</div>
`;

/**
 * Aviso de alerta para el paso uno
 * @constant
 * @type {string}
 */
export const ALERTA_PASO_UNO: string =
  'Se sugiere verificar todos los datos capturados y documentos adjuntos antes de culminar el trámite, ya que, en caso de existir algún error, no se podrá modificar o eliminar la información posterior a su firma.';

/**
 * @description Mensaje del registro exitoso de la solicitud
 *@param {string} numeroSolicitud - El número de la solicitud registrada.
 */
export const MSG_REGISTRO_EXITOSO = (numeroSolicitud: string) =>
  `<p>La solicitud ha quedado regitrada con el número temporal ${numeroSolicitud ?? ''}. Éste no tiene validez legal y sirve solamente para efectos de identificar tu solicitud. Un folio oficial le será asignado a la solicitud al momento en que ésta sea firmada.</p>
  <br>
  <p>Se sugiere verificar todos los datos capturados y documentos adjuntos antes de culminar el trámite, ya que, en caso de existir algún error, no se podrá modificar o eliminar la información posterior a su firma.</p>`;

export const INSTRUCCIONES_CARGA_ADJUNTAR: string = `<h5 style="text-align: center;">Instrucciones: </h5>
  <ul style="text-align: center; list-style-position: inside; padding: 0;">
    <li>De acuerdo al caso particular, algunos documentos podrían ser obligatorios</li>
    <li>En caso de que no requieras algún documento, selecciónalo y elimínalo</li>
    <li>Si necesitas anexar más de un documento del mismo tipo, da clic en el botón <i class="bi bi-plus-circle-fill"></i> para agregar cuantos necesites.</li>
    <li>Si deseas adjuntar un nuevo documento, selecciona la opción --Adjuntar nuevo documento-- y presiona el botón "Adjuntar dcumentos"</li>
  </ul>`;

export const WARN_CARGA_DOCUMENTOS: string = `La carga del documento puede tardar varios segundos, este tiempo dependerá del tamaño de tu archivo y de tu velocidad de conexión.`;

export const ALERTA_FIRMA: string = 'Se sugiere verificar todos los datos capturados y documentos adjuntos antes de culminar el trámite, ya que, en caso de existir algún error, no se podrá modificar o eliminar la información posterior a su firma.'