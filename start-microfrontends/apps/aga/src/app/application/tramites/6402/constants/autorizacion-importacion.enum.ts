import { SolicitudTabla } from "../models/autorizacion-importacion.model";

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
 * Textos utilizados en el trámite.
 * 
 * Esta constante contiene textos como instrucciones o mensajes que se muestran
 * en la interfaz del usuario.
 */
export const TEXTOS = {
  TIPO_CARGO: ` El archivo no debe exceder los 1000 registros. Para descargar plantilla del archivo de excel de click <span class="">*</span><br />
     <label><a href="javascript:void(0);"> Descargar plantilla</a></label>
        `,
  TERCEROS_TEXTO_DE_ALERTA: 'La solicitud ha quedado registrada con el número temporal 202767903 Éste no tiene validez legal y sirve solamente para efectos de identificar tu solicitud. Un folio oficial le será asignado a la solicitud al momento en que ésta sea firmada.',
  SELECTOR_DESPERDICIO: `
  <input type="checkbox" formControlName="selectorDesperdicio" /><span class="require">*</span>No es posible declarar el porcentaje que representa la mercancia a destruir, de la mercancia importada temporalmente de la que procede
  `
};

/**
 * Fecha de importación temporal.
 * 
 * @property {string} labelNombre - Etiqueta que describe el campo.
 * @property {boolean} required - Indica si el campo es obligatorio.
 * @property {boolean} habilitado - Indica si el campo está habilitado.
 */
export const FECHA_IMPORTACION = {
  labelNombre: 'Fecha de importación temporal',
  required: true,
  habilitado: true,
};

/**
 * Fecha de vencimiento.
 * 
 * @property {string} labelNombre - Etiqueta que describe el campo.
 * @property {boolean} required - Indica si el campo es obligatorio.
 * @property {boolean} habilitado - Indica si el campo está habilitado.
 */
export const FECHA_VENCIMIENTO = {
  labelNombre: 'Fecha de vencimiento',
  required: true,
  habilitado: true,
};

/**
 * Fecha de carta de porte.
 * 
 * @property {string} labelNombre - Etiqueta que describe el campo.
 * @property {boolean} required - Indica si el campo es obligatorio.
 * @property {boolean} habilitado - Indica si el campo está habilitado.
 */
export const FECHA_CARTAPORTE = {
  labelNombre: 'Fecha de carta de porte',
  required: false,
  habilitado: true,
};

/**
 * Constante que define las propiedades de configuración para la fecha de destino.
 * 
 * @property {string} labelNombre - Etiqueta que describe el nombre del campo.
 * @property {boolean} required - Indica si el campo es obligatorio.
 * @property {boolean} habilitado - Indica si el campo está habilitado.
 */
export const FECHA_DESTINO = {
  labelNombre: 'Fecha',
  required: true,
  habilitado: true,
};


/**
   * @property {object} tablaDeDatos
   * @description Configuración de la tabla de datos utilizada en el componente.
   * Contiene las definiciones de las columnas (encabezados) y los datos que se mostrarán en la tabla.
  */
export const TABLA_DE_DATOS: {
  encabezadas: {
    encabezado: string,
    clave: (ele: SolicitudTabla) => string,
    orden: number
  }[],
  datos: SolicitudTabla[],
} = {
  encabezadas: [
    {
      encabezado: 'Marca',
      clave: (ele: SolicitudTabla) => ele.marca,
      orden: 1,
    },
    {
      encabezado: 'Modelo',
      clave: (ele: SolicitudTabla) => ele.modelo,
      orden: 2
    },
    {
      encabezado: 'Número de serie',
      clave: (ele: SolicitudTabla) => ele.numeroDeSerie,
      orden: 3
    },
    {
      encabezado: 'Tipo',
      clave: (ele: SolicitudTabla) => ele.tipo,
      orden: 4
    },
    {
      encabezado: 'Descripción de la mercancía',
      clave: (ele: SolicitudTabla) => ele.modalDescMercancia,
      orden: 5
    }
  ],
  datos: []
};



