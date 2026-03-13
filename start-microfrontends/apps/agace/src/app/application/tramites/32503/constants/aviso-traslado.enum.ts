import { AvisoTabla, MercanciaTabla } from "../models/aviso-traslado.model";

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
    indice: 3,
    titulo: 'Firmar solicitud',
    activo: false,
    completado: false,
  },
];

/**
 * Textos utilizados en el trámite.
 * 
 * Esta constante contiene textos como instrucciones o mensajes que se muestran
 * en la interfaz del usuario.
 */
export const TEXTOS = {
  TIPO_CARGO: ` El archivo no debe exceder los 10,000 registros, para descargar plantilla del archivo de excel de click<span class="">*</span><br />
     <label style="color: black;">Descargar plantilla</label>
        `,
  TERCEROS_TEXTO_DE_ALERTA: 'La solicitud ha quedado registrada con el número temporal 202767903 Éste no tiene validez legal y sirve solamente para efectos de identificar tu solicitud. Un folio oficial le será asignado a la solicitud al momento en que ésta sea firmada.',

  SOLICITANTE_TEXTO_DE_ALERTA : 'Se sugiere verificar todos los datos capturados y documentos adjuntos antes de culminar el trámite, ya que, en caso de existir algún error, no se podrá modificar o eliminar la información posterior a su firma.',
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
 * Opciones para el radio relacionado con la disminución parcial.
 */
export const RADIO_PARCIAL = [
  { label: 'Sí', value: 'si' },
  { label: 'No', value: 'no' },
];

/**
 * Tipos de aviso disponibles.
 * 
 * Define los valores y etiquetas para los tipos de aviso.
 */
export const TIPAVI = [
  {
    value: 'inicial',
    label: 'Inicial',
  },
  {
    value: 'prorroga',
    label: 'Prórroga',
  }
];
/**
 * Tipos de carga disponibles.
 * 
 * Define los valores y etiquetas para los tipos de carga.
 */
export const TIPACA = [
  {
    value: 'manual',
    label: 'Manual',
  },
  {
    value: 'carga_masiva',
    label: 'Carga Masiva',
  }
];
/**
 * @constant ENCABEZADAS_TABLA
 * @description Configuración de los encabezados para la tabla de avisos.
 * 
 * Define las columnas y su configuración para la tabla de avisos. Cada columna incluye:
 * - `encabezado`: El título de la columna.
 * - `clave`: Una función que devuelve el valor correspondiente en los datos.
 * - `orden`: La posición de la columna en la tabla.
 */
export const ENCABEZADAS_TABLA = [
  { encabezado: 'RFC', clave: (ele: AvisoTabla): string => ele.rfc, orden: 1 },
  {
    encabezado: 'Nombre comercial',
    clave: (ele: AvisoTabla): string => ele.nombreComercial,
    orden: 2,
  },
  {
    encabezado: 'Entidad federativa',
    clave: (ele: AvisoTabla): string => ele.descripcionEntidadFederativa || ele.claveEntidadFederativa,
    orden: 3,
  },
  {
    encabezado: 'Alcaldía o Municipio',
    clave: (ele: AvisoTabla): string => ele.descripcionDelegacionMunicipio || ele.claveDelegacionMunicipio,
    orden: 4,
  },
  {
    encabezado: 'Colonia',
    clave: (ele: AvisoTabla): string => ele.descripcionColonia || ele.claveColonia,
    orden: 5,
  },
];
/**
 * @constant TABLA_DE_MERCANCIA
 * @description Configuración de los encabezados para la tabla de mercancías.
 * 
 * Define las columnas y su configuración para la tabla de mercancías. Cada columna incluye:
 * - `encabezado`: El título de la columna.
 * - `clave`: Una función que devuelve el valor correspondiente en los datos.
 * - `orden`: La posición de la columna en la tabla.
 */
export const TABLA_DE_MERCANCIA = [
  { encabezado: 'Fracción arancelaria', clave: (ele: MercanciaTabla): string => ele.descripcionFraccionArancelaria || ele.claveFraccionArancelaria, orden: 1 },
  {
    encabezado: 'NICO',
    clave: (ele: MercanciaTabla): string => ele.nico,
    orden: 2,
  },
  {
    encabezado: 'Unidad de medida',
    clave: (ele: MercanciaTabla): string => ele.descripcionUnidadMedida || ele.claveUnidadMedida,
    orden: 3,
  },
  {
    encabezado: 'Cantidad',
    clave: (ele: MercanciaTabla): string => ele.cantidad,
    orden: 4,
  },
  {
    encabezado: 'Valor USD',
    clave: (ele: MercanciaTabla): string => ele.valorUSD,
    orden: 5,
  },
 {
    encabezado: 'Número de pedimento de exportación por parte de quien transfiere la mercancia',
    clave: (ele: MercanciaTabla): string => ele.numPedimentoExportacion,
    orden: 6,
  },
  {
    encabezado: 'Número de pedimento de importación temporal por parte de quien recibe la mercancía',
    clave: (ele: MercanciaTabla): string => ele.numPedimentoImportacion,
    orden: 7,
  }
];