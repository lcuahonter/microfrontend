import {
    HistoricoColumnas,
    MercanciaTabla,
  } from '../models/certificado-origen.model';
import { Mercancia } from '../models/modificacion.enum';
  
/**
* Configuración para los campos de mercancía.
* Define los encabezados, claves y el orden para mostrar los datos relacionados con las mercancías.
*/
export const CONFIGURACION_PRODUCTOR_EXPORTADOR = [
   {
       encabezado: 'Nombre del productor',
        clave: (ele: HistoricoColumnas): string | undefined => ele.nombreProductor,
       orden: 1
     },
     {
       encabezado: 'Número de registro fiscal',
       clave:(ele:HistoricoColumnas): string | undefined => ele.numeroRegistroFiscal,
       orden: 2,
     },
     {
       encabezado: 'Dirección',
       clave: (ele:HistoricoColumnas): string | undefined => ele.direccion,
       orden: 3,
     },
     {
       encabezado: 'Correo electrónico',
       clave: (ele:HistoricoColumnas): string | undefined => ele.correoElectronico,
       orden: 4,
     },
     {
       encabezado: 'Teléfono',
       clave: (ele:HistoricoColumnas): string | undefined => ele.telefono,
       orden: 5,
     },
     {
       encabezado: 'Fax',
       clave: (ele:HistoricoColumnas): string | undefined => ele.fax,
       orden: 6,
     },
];

/**
 * @constant CONFIGURACION_MERCANCIA
 * 
 * Configuración de la tabla de mercancías utilizada en la aplicación.
 * Cada objeto dentro del arreglo representa una columna de la tabla,
 * definiendo su encabezado, la clave para obtener el valor correspondiente
 * de un objeto `MercanciaTabla`, y el orden en el que se muestra en la tabla.
 * 
 * @property {string} encabezado - El título de la columna que se muestra en la tabla.
 * @property {function} clave - Función que toma un objeto `MercanciaTabla` y devuelve el valor correspondiente para la columna.
 * @property {number} orden - Posición de la columna en la tabla.
 * 
 * @example
 * // Ejemplo de uso:
 * CONFIGURACION_MERCANCIA.forEach(columna => {
 *   console.log(columna.encabezado);
 * });
 */
export const CONFIGURACION_MERCANCIA = (prioritizeRfcProductor1: boolean): Array<{ encabezado: string; clave: (ele: Mercancia) => string | undefined; orden: number }> => {
  const BASE_CONFIG = [
    {
      encabezado: 'Fracción arancelaria',
      clave: (ele: Mercancia): string | undefined => ele.fraccionArancelaria,
      orden: 0,
    },
    {
      encabezado: 'Cantidad',
      clave: (ele: Mercancia): string | undefined => ele.cantidad,
      orden: 1,
    },
    {
      encabezado: 'Unidad de medida',
      clave: (ele: Mercancia): string | undefined => ele.unidadMedidaMasaBruta || ele.umc || ele.umcMarcaBruta,
      orden: 2,
    },
    {
      encabezado: 'Valor mercancía',
      clave: (ele: Mercancia): string | undefined => ele.valorMercancia,
      orden: 3,
    },
    {
      encabezado: 'Tipo de factura',
      clave: (ele: Mercancia): string | undefined => ele.tipoFactura,
      orden: 4,
    },
    {
      encabezado: 'Número factura',
      clave: (ele: Mercancia): string | undefined => ele.numeroFactura,
      orden: 6,
    },
    {
      encabezado: 'Complemento descripción',
      clave: (ele: Mercancia): string | undefined => ele.complementoDescripcion,
      orden: 7,
    },
    {
      encabezado: 'Fecha factura',
      clave: (ele: Mercancia): string | undefined => ele.fechaFactura,
      orden: 8,
    },
    {
      encabezado: 'RFC productor',
      clave: (ele: Mercancia): string | undefined => ele.rfcProductor1,
      orden: 9,
    },
  ];

  if (prioritizeRfcProductor1) {
    const RFC_PRODUCTOR_COLUMN = BASE_CONFIG.find(c => c.encabezado === 'RFC productor');
    const OTHER_COLUMNS = BASE_CONFIG.filter(c => c.encabezado !== 'RFC productor');
    const RE_ORDERED = RFC_PRODUCTOR_COLUMN ? [RFC_PRODUCTOR_COLUMN, ...OTHER_COLUMNS] : OTHER_COLUMNS;
    return RE_ORDERED.map((c, index) => ({ ...c, orden: index + 1 }));
  }
  return BASE_CONFIG;
};

