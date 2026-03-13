import { ColumnasTabla, ColumnasTablaConsulta } from "../models/avios-model";

/**
 * @constant ENCABEZADAS_CONSTANT
 * @description Define la estructura de las encabezadas de la tabla, incluyendo el encabezado, clave y orden.
 * @type {Object}
 * @property {string} encabezado - El encabezado de la columna.
 * @property {function} clave - Función que toma un elemento de tipo ColumnasTabla y devuelve un valor.
 * @property {number} orden - El orden de la columna.
 * @default {Object} - Objeto con propiedades por defecto para la encabezada de la tabla.
 * @example
 * const encabezada = ENCABEZADAS_CONSTANT.encabezado; // ''
 * const clave = ENCABEZADAS_CONSTANT.clave; // (ele: ColumnasTabla) => ''
 * const orden = ENCABEZADAS_CONSTANT.orden; // 0
* **/
export const ENCABEZADAS_CONSTANT = {
  encabezado: '',
  clave: (_ele: ColumnasTabla): string => '',
  orden: 0,
};
/**
 * @constant ENCABEZADAS_CONSTANT_CONSULTA
 * @description Define la estructura de las encabezadas de la tabla de consulta, incluyendo el encabezado, clave y orden.
 * @type {Object}
 * @property {string} encabezado - El encabezado de la columna.
 * @property {function} clave - Función que toma un elemento de tipo ColumnasTablaConsulta y devuelve un valor.
 * @property {number} orden - El orden de la columna.
 * @default {Object} - Objeto con propiedades por defecto para la encabezada de la tabla.
 * @example
 * const encabezada = ENCABEZADAS_CONSTANT_CONSULTA.encabezado; // ''
 * const clave = ENCABEZADAS_CONSTANT_CONSULTA.clave; // (ele: ColumnasTablaConsulta) => ''
 * const orden = ENCABEZADAS_CONSTANT_CONSULTA.orden; // 0
 */
export const ENCABEZADAS_CONSTANT_CONSULTA = {
  encabezado: '',
  clave: (_ele: ColumnasTablaConsulta): string => '',
  orden: 0,
};


/**
 * @constant TABLA_DE_DATOS_AVISO
 * @description Contiene la estructura de la tabla de datos de aviso, incluyendo encabezadas y datos.
 * @type {Object}
 * @property {Array} encabezadas - Lista de encabezadas de la tabla.
 * @property {Array} datos - Lista de datos de la tabla.
 * @default {Object} - Objeto con propiedades por defecto para la tabla de datos de aviso.
 * @example
 * const encabezadas = TABLA_DE_DATOS_AVISO.encabezadas; // []
 * const datos = TABLA_DE_DATOS_AVISO.datos; // []
 * **/
export const TABLA_DE_DATOS_AVISO = {
  encabezadas: [
    {
      encabezado: 'Datos del tipo de registro',
      clave: (ele: ColumnasTabla): string => ele.headerTipoRegistro,
      orden: 1,
    },
    {
      encabezado: 'NIV o número de serie',
      clave: (ele: ColumnasTabla): string => ele.headerNIV,
      orden: 2,
    },
    {
      encabezado: 'Año modelo',
      clave: (ele: ColumnasTabla): string => ele.headerAnioModelo,
      orden: 3,
    },
    {
      encabezado: 'Marca',
      clave: (ele: ColumnasTabla): string => ele.headerMarca,
      orden: 4,
    },
    {
      encabezado: 'Modelo',
      clave: (ele: ColumnasTabla): string => ele.headerModelo,
      orden: 5,
    },
    {
      encabezado: 'Tipo/Variante/Versión',
      clave: (ele: ColumnasTabla): string => ele.headerTVV,
      orden: 6,
    },
    {
      encabezado: 'No. de cilindros',
      clave: (ele: ColumnasTabla): string => ele.headerNoCilindros,
      orden: 7,
    },
    {
      encabezado: 'No. de puertas',
      clave: (ele: ColumnasTabla): string => ele.headerNoPuertas,
      orden: 8,
    },
    {
      encabezado: 'Tipo de combustible',
      clave: (ele: ColumnasTabla): string => ele.headerTipoCombustible,
      orden: 9,
    },
    {
      encabezado:
        'Nombre en el título de propiedad extranjero o en su caso, nombre de la persona a la que se haya concedido la propiedad',
      clave: (ele: ColumnasTabla): string => ele.headerNombreTitulo,
      orden: 10,
    },
    {
      encabezado: 'No. del título de propiedad',
      clave: (ele: ColumnasTabla): string => ele.headerNoTitulo,
      orden: 11,
    },
    {
      encabezado: 'País que emitió el título de propiedad',
      clave: (ele: ColumnasTabla): string => ele.headerPais,
      orden: 12,
    },
    {
      encabezado: 'Estado o provincia de emisión del titulo de propiedad',
      clave: (ele: ColumnasTabla): string => ele.headerEstado,
      orden: 13,
    },
    {
      encabezado: 'No. de placas de circulación en el país de procedencia',
      clave: (ele: ColumnasTabla): string => ele.headerPlacas,
      orden: 14,
    },
    {
      encabezado: 'Forma de adquisición del vehículo importado',
      clave: (ele: ColumnasTabla): string => ele.headerAdquisicion,
      orden: 15,
    },
    {
      encabezado: 'No. de documento de exportación',
      clave: (ele: ColumnasTabla): string => ele.headerDocumentoExportacion,
      orden: 16,
    },
    {
      encabezado: 'Aduana de importación',
      clave: (ele: ColumnasTabla): string => ele.headerAduana,
      orden: 17,
    },
    {
      encabezado: 'Patente de importación',
      clave: (ele: ColumnasTabla): string => ele.headerPatente,
      orden: 18,
    },
    {
      encabezado: 'Pedimento de importación',
      clave: (ele: ColumnasTabla): string => ele.headerPedimento,
      orden: 19,
    },
    {
      encabezado: 'Kilometraje a la fecha de la importación',
      clave: (ele: ColumnasTabla): string => ele.headerKilometraje,
      orden: 20,
    },
    {
      encabezado: 'Valor en dólares',
      clave: (ele: ColumnasTabla): string => ele.headerValorDolares,
      orden: 21,
    },
    {
      encabezado: 'Valor en la aduana',
      clave: (ele: ColumnasTabla): string => ele.headerValorAduana,
      orden: 22,
    },
    {
      encabezado: 'Monto de IGI pagado',
      clave: (ele: ColumnasTabla): string => ele.headerMontoIGI,
      orden: 23,
    },
    {
      encabezado: 'Forma de pago del IGI',
      clave: (ele: ColumnasTabla): string => ele.headerFormaPago,
      orden: 24,
    },
    {
      encabezado: 'Monto de DTA pagado',
      clave: (ele: ColumnasTabla): string => ele.headerMontoDTA,
      orden: 25,
    },

    {
      encabezado: 'Monto de IVA pagado',
      clave: (ele: ColumnasTabla): string => ele.headerMontoIVA,
      orden: 26,
    },

    {
      encabezado: 'Folio del CFDI por el servicio de importación',
      clave: (ele: ColumnasTabla): string => ele.headerFolioCFDI,
      orden: 27,
    },
    {
      encabezado: 'Valor de venta en territorio nacional sin IVA',
      clave: (ele: ColumnasTabla): string => ele.headerValorVentaSinIVA,
      orden: 28,
    },
    {
      encabezado: 'Folio del CFDI por la venta en territorio nacional',
      clave: (ele: ColumnasTabla): string => ele.headerFolioCFDI,
      orden: 29,
    },
    {
      encabezado:
        'Identificador de transacción de VUCEM correspondiente al aviso de importación previa relacionado',
      clave: (ele: ColumnasTabla): string => ele.headerFolioCFDI,
      orden: 30,
    },
  ],
  datos: [],
};

/**
 * Representa la tabla de datos de aviso de consulta.
 */
export const TABLA_DE_DATOS_AVISO_CONSULTA = {
  encabezadas: [
    {
      encabezado: 'Datos del tipo de registro',
      clave: (ele: ColumnasTablaConsulta): string => ele.headerTipoRegistro,
      orden: 1,
    },
    {
      encabezado: 'NIV o número de serie',
      clave: (ele: ColumnasTablaConsulta): string => ele.headerNIV,
      orden: 2,
    },
    {
      encabezado: 'Año modelo',
      clave: (ele: ColumnasTablaConsulta): string => ele.headerAnioModelo,
      orden: 3,
    },
    {
      encabezado: 'Marca',
      clave: (ele: ColumnasTablaConsulta): string => ele.headerMarca,
      orden: 4,
    },
    {
      encabezado: 'Modelo',
      clave: (ele: ColumnasTablaConsulta): string => ele.headerModelo,
      orden: 5,
    },
    {
      encabezado: 'Tipo/Variante',
      clave: (ele: ColumnasTablaConsulta): string => ele.headerTVV,
      orden: 6,
    },
    {
      encabezado: 'No. de cilindros',
      clave: (ele: ColumnasTablaConsulta): string => ele.headerCilindros,
      orden: 7,
    },
    {
      encabezado: 'No. de puertas',
      clave: (ele: ColumnasTablaConsulta): string => ele.headerPuertas,
      orden: 8,
    },
    {
      encabezado: 'Tipo de combustible',
      clave: (ele: ColumnasTablaConsulta): string => ele.headerTipoCombustible,
      orden: 9,
    },
    {
      encabezado:
        'Nombre en el título de propiedad extranjero o en su caso, nombre de la persona a la que se haya concedido la propiedad',
      clave: (ele: ColumnasTablaConsulta): string => ele.headerNombreTitulo,
      orden: 10,
    },
    {
      encabezado: 'No. del título de propiedad',
      clave: (ele: ColumnasTablaConsulta): string => ele.headerNoTitulo,
      orden: 11,
    },
    {
      encabezado: 'País que emitió el título de propiedad',
      clave: (ele: ColumnasTablaConsulta): string => ele.headerPais,
      orden: 12,
    },
    {
      encabezado: 'Estado o provincia de emisión del titulo de propiedad',
      clave: (ele: ColumnasTablaConsulta): string => ele.headerEstado,
      orden: 13,
    },
    {
      encabezado: 'No. de placas de circulación en el país de procedencia',
      clave: (ele: ColumnasTablaConsulta): string => ele.headerPlacas,
      orden: 14,
    },
    {
      encabezado: 'Forma de adquisición del vehículo importado',
      clave: (ele: ColumnasTablaConsulta): string => ele.headerAdquisicion,
      orden: 15,
    },
    {
      encabezado: 'No. de documento de exportación',
      clave: (ele: ColumnasTablaConsulta): string => ele.headerDocumentoExportacion,
      orden: 16,
    },
    {
      encabezado: 'Aduana de importación',
      clave: (ele: ColumnasTablaConsulta): string => ele.headerAduana,
      orden: 17,
    },
    {
      encabezado: 'Patente de importación',
      clave: (ele: ColumnasTablaConsulta): string => ele.headerPatente,
      orden: 18,
    },
    {
      encabezado: 'Pedimento de importación',
      clave: (ele: ColumnasTablaConsulta): string => ele.headerPedimento,
      orden: 19,
    },
    {
      encabezado: 'Kilometraje a la fecha de la importación',
      clave: (ele: ColumnasTablaConsulta): string => ele.headerKilometraje,
      orden: 20,
    },
    {
      encabezado: 'Valor en dólares',
      clave: (ele: ColumnasTablaConsulta): string => ele.headerValorDolares,
      orden: 21,
    },
    {
      encabezado: 'Valor en la aduana',
      clave: (ele: ColumnasTablaConsulta): string => ele.headerValorAduana,
      orden: 22,
    },
    {
      encabezado: 'Monto de IGI pagado',
      clave: (ele: ColumnasTablaConsulta): string => ele.headerMontoIGI,
      orden: 23,
    },
    {
      encabezado: 'Forma de pago del IGI',
      clave: (ele: ColumnasTablaConsulta): string => ele.headerFormaPago,
      orden: 24,
    },
    {
      encabezado: 'Monto de DTA pagado',
      clave: (ele: ColumnasTablaConsulta): string => ele.headerMontoDTA,
      orden: 25,
    },
    {
      encabezado: 'Folio del CFDI por el servicio de importación',
      clave: (ele: ColumnasTablaConsulta): string => ele.headerFolioCFDI,
      orden: 26,
    },
    {
      encabezado: 'Valor de venta en territorio nacional sin IVA',
      clave: (ele: ColumnasTablaConsulta): string => ele.headerFolioCFDI,
      orden: 27,
    },
    {
      encabezado: 'Folio del CFDI por la venta en territorio nacional',
      clave: (ele: ColumnasTablaConsulta): string => ele.headerFolioCFDI,
      orden: 28,
    },
    {
      encabezado:
        'Identificador de transacción de VUCEM correspondiente al aviso de importación previa relacionado',
      clave: (ele: ColumnasTablaConsulta): string => ele.headerFolioCFDI,
      orden: 29,
    },
  ],
  datos: [],
};

/**
 * @constant PASOS
 * @description Define los pasos del proceso de trámite, incluyendo el índice, título, y estado de cada paso.
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
    titulo: 'Firmar solicitud',
    activo: false,
    completado: false,
  },
];

/**
 * @constant TEXTOS_REQUISITOS
 * @description Contiene los textos de instrucciones y requisitos para el trámite.
 */
export const TEXTOS_REQUISITOS = {
  INSTRUCCIONES: `<h6>Instrucciones</h6>
      <p>- La solicitud ha quedado registrada con el número temporal 67922457.</p>
      <p>- Éste no tiene validez legal y será solamente para efectos de identificar tu solicitud.</p>
      <p>- Un folio oficial le sera asignado a la solicitud al momento en que ésta sea firmada.</p>`,
};

/**
 * @constant TEXTOS
 * @description Contiene textos genéricos utilizados en la interfaz, como mensajes de carga de archivos.
 */
export const TEXTOS = {
  INSTRUCCIONES: `
  <p>- El archivo no debe exceder los 1000 registros. Para descargar plantilla del archivo de excel de click</p>`,
  CARGA_DE_ARCHIVOS: `Seleccionar archivo`,
  CARGA_DE_ARCHIVO_DE_TEXTO: `Sin archivos seleccionados`,
  CARGA_DE_ARCHIVO_DE_TEXTO_EXITOSO: `El formato del archivo es correcto. Se enviará un correo de notificación con el resultado.`,
};

/**
 * @constant ALPHANUMERIC_PATTERN
 * @description Expresión regular para validar cadenas alfanuméricas.
 */
export const ALPHANUMERIC_PATTERN = '^[a-zA-Z0-9]*$';

/**
 * @constant RADIO_OPCIONS
 * @description Opciones de radio para seleccionar "Sí" o "No".
 */
export const RADIO_OPCIONS = [
  { label: 'Sí', value: 'Si' },
  { label: 'No', value: 'No' },
];

/**
 * @constant RADIO_TIPO_AVISO
 * @description Opciones de radio para seleccionar el tipo de aviso (Manual o Carga masiva).
 */
export const RADIO_TIPO_AVISO = [
  { label: 'Manual', value: 'Manual' },
  { label: 'Carga masiva', value: 'Carga masiva' },
];
/**
 * @constant RADIO_OPCIONS_CONFIRMIDAD
 * @description Opciones de radio para seleccionar la confirmación (Sí o No).
 */
export const RADIO_OPCIONS_CONFIRMIDAD = [
  { label: 'Si', value: 'si' },
  { label: 'No', value: 'no' },
];

/**
 * @constant RADIO_OPCIONS_AVISO
 * @description Opciones de radio para seleccionar el tipo de aviso (Importación, Venta, o Importación y venta).
 */
export const RADIO_OPCIONS_AVISO = [
  { label: 'Importación', value: 'Importación' },
  { label: 'Venta', value: 'Venta' },
  { label: 'Importación y venta', value: 'Importación y venta' },
];

/**
 * @constant AVISO_CONTRNIDO
 * @description Contenido HTML del aviso de privacidad simplificado para el SAT y VUCEM.
 * Incluye información sobre el tratamiento de datos personales y un enlace al aviso de privacidad integral.
 * @type {string}
 */
export const AVISO_CONTRNIDO = 
   `<div>
    <div class="text-center"><b>Aviso de privacidad simplificado</b></div>
    <p>El Servicio de Administración Tributaria (SAT), es el sujeto obligado y responsable del tratamiento de los datos personales que se
      recaban a través de la Ventanilla Digital Mexicana de Comercio Exterior (VUCEM), los datos personales podrán ser utilizados y
      transferidos a la autoridades competentes, con la finalidad de llevar a cabo cualquier trámite relacionado con importaciones,
      exportaciones y tránsito de mercancías de comercio exterior, incluyendo las regulaciones y restricciones no arancelarias que, conforme
      a la legislación aplicable, sea exigido por las autoridades competentes en materia de comercio exterior y/o consultar información sobre
      los procedimientos para la importación, exportación y tránsito de mercancías de comercio exterior, incluyendo las regulaciones y
      restricciones no arancelarias, así como las notificaciones que se deriven de dichos trámites y serán protegidos, incorporados y tratados
      en el sistema de datos personales de la VUCEM, asimismo podrán ser transmitidos a las autoridades competentes establecidas en el
      Decreto por el que se establece la Ventanilla Digital Mexicana de Comercio Exterior, publicado en el Diario Oficial de la Federación el 14
      de enero de 2011, así como al propio titular de la información. El titular, en su caso, podrá manifestar su negativa para el tratamiento de
      sus datos personales para finalidades y transferencias de los mismos que requieran el consentimiento del titular. Si desea conocer
      nuestro aviso de privacidad integral, lo podrá consultar en el portal.</p>
      <div class="text-center">
       <a href="https://www.ventanillaunica.gob.mx/vucem/estadisticas/Aviso_Privacidad_Integral.pdf" target="_blank">
        Aviso de privacidad integral
      </a>
      </div>
  </div>`;