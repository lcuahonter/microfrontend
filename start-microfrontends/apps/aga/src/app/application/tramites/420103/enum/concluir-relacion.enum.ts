import { DetallesDelMercancia } from "@libs/shared/data-access-user/src/core/models/420103/concluir-relacion.model";
import { InputFecha } from "@libs/shared/data-access-user/src";

/**
 * Constante que contiene los datos relacionados con la tabla de concluir relación.
 * Define los encabezados de las columnas que se mostrarán en la tabla dinámica.
 */
export const DATOS_CONCLUIR_RELACION = {
  /**
   * Encabezado para la columna del Registro Federal del Contribuyente.
   */
  REGISTRO_FEDERAL: 'Registro Federal del Contribuyente',

  /**
   * Encabezado para la columna de la Denominación o Razón Social.
   */
  DENOMINACION_RAZON_SOCIAL: 'Denominación o Razón Social',

  /**
   * Encabezado para la columna de la Norma.
   */
  NORMA: 'Norma',

  /**
   * Encabezado para la columna de la Fecha de Inicio de la Relación.
   */
  FECHA_INICIO_RELACION: 'Fecha Inicio Relación',
};

/**
 * Constante que contiene los campos relacionados con el desistimiento.
 * Define los nombres de los campos que se utilizarán en el formulario de desistimiento.
 */
export const DESISTIMIENTO = {
  /**
   * Campo para el folio original del desistimiento.
   */
  FOLIO_ORIGINAL: 'folioOriginal',

  /**
   * Campo para la justificación del desistimiento.
   */
  JUSTIFICACION_DEL_DESISTIMIENTO: 'justificacionDelDesistimiento',
};

/**
 * Configuración para el campo de fecha inicial.
 * Define las propiedades del campo, como el nombre de la etiqueta, si es requerido y si está habilitado.
 */
export const CONFIGURACION_FECHA_INICIAL: InputFecha = {
  /**
   * Nombre de la etiqueta del campo.
   */
  labelNombre: 'Fecha inicial',

  /**
   * Indica si el campo es requerido.
   */
  required: false,

  /**
   * Indica si el campo está habilitado.
   */
  habilitado: false,
};

/**
 * Configuración para el campo de fecha final.
 * Define las propiedades del campo, como el nombre de la etiqueta, si es requerido y si está habilitado.
 */
export const CONFIGURACION_FECHA_FINAL = {
  /**
   * Nombre de la etiqueta del campo.
   */
  labelNombre: 'Fecha inicial',

  /**
   * Indica si el campo es requerido.
   */
  required: false,

  /**
   * Indica si el campo está habilitado.
   */
  habilitado: false,
};

/**
 * Configuración de las columnas de la tabla dinámica.
 * Define los encabezados, claves y el orden de las columnas que se mostrarán en la tabla.
 */
export const CONFIGURACION_TABLA = [
  {
    /**
     * Encabezado para la columna del Registro Federal del Contribuyente.
     */
    encabezado: DATOS_CONCLUIR_RELACION.REGISTRO_FEDERAL,

    /**
     * Clave que obtiene el valor del Registro Federal del objeto `DetallesDelMercancia`.
     */
    clave: (item: DetallesDelMercancia): string => item.registroFederal,

    /**
     * Orden de la columna en la tabla.
     */
    orden: 1,
  },
  {
    /**
     * Encabezado para la columna de la Denominación o Razón Social.
     */
    encabezado: DATOS_CONCLUIR_RELACION.DENOMINACION_RAZON_SOCIAL,

    /**
     * Clave que obtiene el valor de la Denominación o Razón Social del objeto `DetallesDelMercancia`.
     */
    clave: (item: DetallesDelMercancia): string => item.denominacionRazonSocial,

    /**
     * Orden de la columna en la tabla.
     */
    orden: 2,
  },
  {
    /**
     * Encabezado para la columna de la Norma.
     */
    encabezado: DATOS_CONCLUIR_RELACION.NORMA,

    /**
     * Clave que obtiene el valor de la Norma del objeto `DetallesDelMercancia`.
     */
    clave: (item: DetallesDelMercancia): string => item.norma,

    /**
     * Orden de la columna en la tabla.
     */
    orden: 3,
  },
  {
    /**
     * Encabezado para la columna de la Fecha de Inicio de la Relación.
     */
    encabezado: DATOS_CONCLUIR_RELACION.FECHA_INICIO_RELACION,

    /**
     * Clave que obtiene el valor de la Fecha de Inicio de la Relación del objeto `DetallesDelMercancia`.
     */
    clave: (item: DetallesDelMercancia): string => item.fechaInicioRelacion,

    /**
     * Orden de la columna en la tabla.
     */
    orden: 4,
  },
];