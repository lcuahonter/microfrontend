import { DatosDelContenedorTabla } from "../models/tramite420102.enum";

/**
 * @const PASOS
 * @description Arreglo que define los pasos de un proceso en la aplicación.
 * Cada paso incluye un índice, un título, y estados de actividad y completitud.
 *
 * @property {number} indice - Número que identifica el orden del paso.
 * @property {string} titulo - Título descriptivo del paso.
 * @property {boolean} activo - Indica si el paso está activo actualmente.
 * @property {boolean} completado - Indica si el paso ha sido completado.
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
 * @const DOMICILIO_TABLA_COLUMNAS
 * @description Configuración de las columnas de la tabla de domicilios.
 * Define los encabezados, claves y el orden de las columnas.
 *
 * @property {string} encabezado - Título de la columna.
 * @property {function} clave - Función que devuelve el valor de la columna basado en el objeto.
 * @property {number} orden - Orden de la columna en la tabla.
 */
export const DOMICILIO_TABLA_COLUMNAS = [
  {
    encabezado: 'Registro Federal de Contribuyentes',
    clave: (ele: DatosDelContenedorTabla):string => ele.rfc,
    orden: 1,
  },
  {
    encabezado: 'Denominación o razón social',
    clave: (ele: DatosDelContenedorTabla): string => ele.denominacionORazonSocial,
    orden: 2,
  },
  {
    encabezado: 'Norma',
    clave: (ele: DatosDelContenedorTabla):string => ele.norma,
    orden: 3,
  },
  {
    encabezado: 'Fecha inicio relación',
    clave: (ele: DatosDelContenedorTabla):string => ele.fechainciorelacion,
    orden: 4,
  },
];

/**
 * @const URL
 * @description Ruta base para acceder a los archivos JSON relacionados con el trámite 420102.
 */
export const URL = '../../../../../assets/json/420102/';

/**
 * @const FECHA_INGRESO
 * @description Configuración para el campo de fecha de ingreso en el formulario.
 *
 * @property {string} labelNombre - Etiqueta del campo.
 * @property {boolean} required - Indica si el campo es obligatorio.
 * @property {boolean} habilitado - Indica si el campo está habilitado.
 */
export const FECHA_INGRESO = {
  labelNombre: 'Fecha inicial:',
  required: false,
  habilitado: true,
};
/**
 * Constante que representa la configuración para el campo "Fecha final".
 * @const FECHA_FINAL
 * @property {string} labelNombre - Etiqueta que se muestra para el campo.
 * @property {boolean} required - Indica si el campo es obligatorio.
 * @property {boolean} habilitado - Indica si el campo está habilitado.
 */
export const FECHA_FINAL = {
  labelNombre: 'Fecha final:',
  required: false,
  habilitado: true,
};