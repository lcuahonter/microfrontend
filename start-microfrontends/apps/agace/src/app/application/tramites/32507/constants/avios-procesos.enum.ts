import { AvisoTabla } from '../models/aviso-traslado.model';
import { AvisoTablaDatos } from '../models/aviso-traslado.model';

/**
 * Constante que define los pasos del wizard en el trámite.
 *
 * Esta constante contiene un array de objetos que representan los pasos del wizard,
 * incluyendo su índice, título, y estado (activo o completado).
 */
export const PASOS = [
  {
    indice: 1,
    titulo: 'Capturar solicitud',
    activo: true,
    completado: true,
  },
  {
    indice: 2,
    titulo: 'Anexar requisitos',
    activo: false,
    completado: false,
  },
  {
    indice: 4,
    titulo: 'Firmar solicitud',
    activo: false,
    completado: false,
  },
];
/**
 * @constant TEXTOS_REQUISITOS
 * @description Contiene las instrucciones y mensajes relacionados con los requisitos del trámite.
 */
export const TEXTOS_REQUISITOS = {
  INSTRUCCIONES: `<h6>Instrucciones</h6>
      <p>- La solicitud ha quedado registrada con el número temporal 67922457.</p>
      <p>- Éste no tiene validez legal y será solamente para efectos de identificar tu solicitud.</p>
      <p>- Un folio oficial le sera asignado a la solicitud al momento en que ésta sea firmada.</p>`,
};

/**
 * @constant TEXTOS
 * @description Contiene textos genéricos utilizados en el trámite, como instrucciones y mensajes de carga de archivos.
 */
export const TEXTOS = {
  INSTRUCCIONES: `
  <p>- El archivo no debe exceder los 1000 registros. Para descargar plantilla del archivo de excel de click</p>`,
  CARGA_DE_ARCHIVOS: `Seleccionar archivo`,
  CARGA_DE_ARCHIVO_DE_TEXTO: `Sin archivos seleccionados`,
  CARGA_DE_ARCHIVO_DE_TEXTO_EXITOSO: `El formato del archivo es correcto. Se enviará un correo de notificación con el resultado.`,
};



/**
 * Configuración para la fecha de ingreso.
 *
 * Define las propiedades de la fecha de ingreso, como el nombre de la etiqueta, si es requerida y si está habilitada.
 */
export const FECHA_INGRESO = {
  labelNombre: 'Fecha de programada del traslado',
  required: true,
  habilitado: true,
};

/**
 * @constant RADIO_OPCIONS
 * @description Opciones de radio para seleccionar "Sí" o "No".
 */
export const RADIO_OPCIONS = [
  { label: 'Sí', value: 'Si' },
  { label: 'No', value: 'No' },
];

/**
 * @constant ENCABEZADAS_CONSTANT
 * @description Configuración inicial para las columnas de una tabla.
 * Contiene un encabezado vacío, una clave vacía y un orden inicial de 0.
 */
export const ENCABEZADAS_CONSTANT = {
  encabezado: '',
  clave: (_ele: AvisoTablaDatos): string => '',
  orden: 0,
};

/**
 * @constant TABLA_DE_DATOS_AVISO
 * @description Configuración de la tabla de datos utilizada en el trámite.
 * Contiene las definiciones de las columnas (encabezados) y los datos que se mostrarán en la tabla.
 */
export const TABLA_DE_DATOS_AVISO = {
  encabezadas: [
    {
      encabezado: 'ID de transacción de VUCEM del aviso inicial',
      clave: (ele: AvisoTabla): string => ele.idTransaccionVUCEM,
      orden: 1,
    },
    {
      encabezado: 'Cantidad',
      clave: (ele: AvisoTabla): string => ele.cantidad,
      orden: 2,
    },
    {
      encabezado: 'Peso (Kg)',
      clave: (ele: AvisoTabla): string => ele.pesoKg,
      orden: 3,
    },
    {
      encabezado: 'Descripción Unidad de medida',
      clave: (ele: AvisoTabla): string => ele.descripcionUnidadMedida,
      orden: 4,
    },
    {
      encabezado: 'Descripción',
      clave: (ele: AvisoTabla): string => ele.descripcion,
      orden: 5,
    },
    {
      encabezado: '¿Cuenta con el ID de transacción de VUCEM del Aviso inicial de Importación?',
      clave: (ele: AvisoTabla): string => ele.siIdTransaccion,
      orden: 6,
    },
  ],
  datos: [],
};

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
 * Texto de alerta para el modal de mercancias
 * @constant
 * @type {string}
 */
export const TEXTO_MODAL_MERCANCIAS: string = `<div><strong>¡Precaución!</strong> El campo ID de transacción de VUCEM debe ser tomado de un previo registro de destrucción de desperdicios.</div>`;

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