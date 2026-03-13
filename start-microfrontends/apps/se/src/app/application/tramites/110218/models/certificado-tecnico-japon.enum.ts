/**
 * @interface CompliMentaria
 * @description
 * Representa la información complementaria de un certificado técnico japonés.
 * Esta interfaz se utiliza para describir los detalles de un producto que forma parte del certificado,
 * incluyendo identificadores, nombres técnicos y comerciales, y datos opcionales como cantidad y fecha de factura.
 *
 * @property {number} id - Identificador único del registro.
 * @property {string} numerodeOrden - Número de orden asociado al producto.
 * @property {string} fraccionArancelaria - Fracción arancelaria correspondiente al producto.
 * @property {string} nombreTecnico - Nombre técnico del producto.
 * @property {string} nombreComercial - Nombre comercial con el que se conoce el producto.
 * @property {string} nombreIngles - Nombre del producto en inglés.
 * @property {string} númerodeRegistro - Número de registro oficial del producto.
 * @property {string} [cantidad] - Cantidad del producto (opcional).
 * @property {string} [fechadelaFactura] - Fecha de la factura correspondiente (opcional).
 */
export interface CompliMentaria {
  id: number;
  numerodeOrden: string;
  fraccionArancelaria: string;
  nombreTecnico: string;
  nombreComercial: string;
  nombreIngles: string;
  númerodeRegistro: string;
  cantidad?: string;
  fechadelaFactura?: string;
}

/**
 * @interface ColumnaCertificado
 * @description
 * Define la estructura de cada columna para visualizar datos en una tabla del certificado técnico japonés.
 *
 * @property {string} encabezado - Título que se muestra como encabezado de la columna.
 * @property {(ele: CompliMentaria) => string} clave - Función que extrae el valor a mostrar de un objeto `CompliMentaria`.
 * @property {number} orden - Orden en el que debe aparecer la columna dentro de la tabla.
 */
interface ColumnaCertificado {
  encabezado: string;
  clave: (ele: CompliMentaria) => string;
  orden: number;
}

/**
 * @constant
 * @name CERTIFICADO_TABLA
 * @type {ColumnaCertificado[]}
 * @description
 * Arreglo de objetos que define la estructura de las columnas para la tabla del certificado técnico japonés.
 * Cada columna se configura con su encabezado, una función que determina el valor a mostrar en dicha columna,
 * y el orden en el que aparece en la tabla.
 *
 * @example
 * // Usando CERTIFICADO_TABLA para generar columnas dinámicas en una tabla HTML:
 * CERTIFICADO_TABLA.forEach(col => {
 *   console.log(col.encabezado, col.clave(elemento));
 * });
 */
export const CERTIFICADO_TABLA: ColumnaCertificado[] = [
  {
    encabezado: 'Número de orden',
    clave: (ele: CompliMentaria): string => ele.numerodeOrden,
    orden: 1
  },
  {
    encabezado: 'Fracción arancelaria*',
    clave: (ele: CompliMentaria): string => ele.fraccionArancelaria,
    orden: 2
  },
  {
    encabezado: 'Nombre técnico',
    clave: (ele: CompliMentaria): string => ele.nombreTecnico,
    orden: 3
  },
  {
    encabezado: 'Nombre comercial',
    clave: (ele: CompliMentaria): string => ele.nombreComercial,
    orden: 4
  },
  {
    encabezado: 'Nombre inglés',
    clave: (ele: CompliMentaria): string => ele.nombreIngles,
    orden: 5
  },
  {
    encabezado: 'Número de registro',
    clave: (ele: CompliMentaria): string => ele.númerodeRegistro,
    orden: 6
  }
];
