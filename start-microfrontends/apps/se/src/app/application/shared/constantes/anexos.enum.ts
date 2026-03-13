import { Anexo } from "../models/anexos.model";

/**
 * Configuración de la tabla de anexos utilizada en la aplicación.
 *
 * Cada objeto en la configuración representa una columna de la tabla con las siguientes propiedades:
 * - `encabezado`: El título de la columna que se mostrará en la tabla.
 * - `clave`: Una función que toma un objeto de tipo `Anexo` y devuelve el valor correspondiente para esa columna.
 * - `orden`: El orden en el que se mostrará la columna en la tabla.
 *
 * @constant
 * @type {Array<{ encabezado: string; clave: (ele: Anexo) => string | undefined; orden: number }>}
 */
export const CONFIGURACION_TABLA_EXPORTACION = [
  {
    encabezado: 'Fracción arancelaria del producto de exportación',
    clave: (ele: Anexo): number | undefined =>
      ele.claveProductoExportacion,
    orden: 1,
  },
  {
    encabezado: 'Descripción',
    clave: (ele: Anexo): string | undefined => ele.descripcion,
    orden: 2,
  },
  {
    encabezado: 'Tipo Fracción',
    clave: (ele: Anexo): string | undefined => ele.tipoFraccion,
    orden: 3,
  },
];

/**
 * Configuración de los anexos para importación.
 *
 * Este arreglo contiene objetos que definen la configuración de los anexos
 * utilizados en el proceso de importación. Cada objeto incluye información
 * sobre el encabezado, la clave asociada y el orden de los campos.
 *
 * Propiedades de cada objeto:
 * - `encabezado`: Título del campo que se mostrará en la interfaz de usuario.
 * - `clave`: Función que toma un objeto de tipo `Anexo` y devuelve el valor
 *   correspondiente al campo especificado.
 * - `orden`: Número que indica el orden en el que se deben mostrar los campos.
 */
export const CONFIGURACION_ANEXOS_IMPORTACION = [
  {
    encabezado: 'Fracción arancelaria del producto de exportación',
    clave: (ele: Anexo): number | undefined =>
      ele.fraccionPadre,
    orden: 1,
  },
  {
    encabezado: 'Fracción arancelaria de la mercancía de importación',
    clave: (ele: Anexo): string | undefined =>
      ele.cveFraccion,
    orden: 1,
  },
  {
    encabezado: 'Descripción',
    clave: (ele: Anexo): string | undefined => ele.descripcion,
    orden: 2,
  },
  {
    encabezado: 'Tipo Fracción',
    clave: (ele: Anexo): string | undefined => ele.tipoFraccion,
    orden: 3,
  },
];

/**
 * CONFIGURACION_ANEXOS_SENSIBLES - Configuración para anexos de mercancías sensibles
 * Maneja información específica de importación incluyendo cantidades,
 * valores y unidades de medida tarifaria
 */
export const CONFIGURACION_ANEXOS_SENSIBLES = [
  {
    encabezado: 'Fracción arancelaria de la mercancía de importación',
    clave: (ele: Anexo): number | undefined => ele.fraccionPadre,
    orden: 1,
  },
  {
    encabezado: 'Cantidad',
    clave: (ele: Anexo): number | undefined => ele.cantidad,
    orden: 1,
  },
  {
    encabezado: 'Valor',
    clave: (ele: Anexo): number | undefined => ele.valor,
    orden: 2,
  },
  {
    encabezado: 'Unidad de medida tarifaria',
    clave: (ele: Anexo) : string | undefined => ele.unidadMedidaTarifaria,
    orden: 3,
  },
];