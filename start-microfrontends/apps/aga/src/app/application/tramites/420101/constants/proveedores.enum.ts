import {
  DatosDelRegistrar,
  DatosDelRegistrarManual,
} from '../models/proveedores.model';


/**
 * Arreglo que representa los pasos del proceso de solicitud.
 * Cada objeto contiene:
 * - indice: número de paso.
 * - titulo: descripción del paso.
 * - activo: indica si el paso está activo.
 * - completado: indica si el paso ha sido completado.
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
 * Título del mensaje mostrado al registrar proveedores.
 */
export const TITULO_MENSAJE = 'Registrar proveedores.';

/**
 * Texto informativo mostrado tras el registro de la solicitud de proveedores.
 * 
 * @description
 * Indica que la solicitud ha sido registrada con un número temporal, el cual no tiene validez legal y solo sirve para identificar la solicitud. El folio oficial se asignará cuando la solicitud sea firmada.
 */
export const TEXTOS_REQUISITOS =
  'La solicitud ha quedado registrada con el número temporal [202767640]. Este no tiene validez legal y sirve solamente para efectos de identificar tu Solicitud. Un folio oficial le será asignado a la solicitud al momento en que esta sea firmada.';

  /**
   * Configuración de las columnas para la tabla de registro de proveedores.
   * Cada objeto representa una columna con su encabezado, clave de acceso a los datos y orden de aparición.
   *
   * @type {ConfiguracionColumna<DatosDelRegistrar>[]}
   *
   * Columnas:
   * - RFC: Registro Federal de Contribuyentes del proveedor.
   * - Denominación o razón social: Nombre legal de la empresa o proveedor.
   * - Nombre completo: Nombre completo del representante o contacto.
   * - Domicilio fiscal: Dirección fiscal del proveedor.
   * - Norma: Norma aplicable al proveedor.
   * - Número de programa IMMEX: Número de registro en el programa IMMEX.
   * - Número de programa PROSEC: Número de registro en el programa PROSEC.
   * - Aduana en las que opera: Aduanas donde el proveedor realiza operaciones.
   */
  export const REGISTRAR_PROVEEDORES_DE_TABLA: ConfiguracionColumna<DatosDelRegistrar>[] =
    [
      {
        encabezado: 'RFC',
        clave: (fila) => fila.rfc,
        orden: 1,
      },
      {
        encabezado: 'Denominación o razón social',
        clave: (fila) => fila.razonSocial,
        orden: 2,
      },
      {
        encabezado: 'Nombre completo',
        clave: (fila) => fila.nombreCompleto,
        orden: 3,
      },
      {
        encabezado: 'Domicilio fiscal',
        clave: (fila) => fila.domicilioFiscal,
        orden: 4,
      },
      {
        encabezado: 'Norma',
        clave: (fila) => fila.norma,
        orden: 5,
      },
      {
        encabezado: 'Número de programa IMMEX',
        clave: (fila) => fila.numeroProgramaImmex,
        orden: 6,
      },
      {
        encabezado: 'Número de programa PROSEC',
        clave: (fila) => fila.numeroProgramaProsec,
        orden: 7,
      },
      {
        encabezado: 'Aduana en las que opera',
        clave: (fila) => fila.aduanasOpera,
        orden: 8,
      },
    ];

/**
 * Configuración de las columnas para la tabla de registro manual de proveedores.
 * Cada objeto representa una columna con su encabezado, clave de acceso a los datos y orden de aparición.
 * 
 * @type {ConfiguracionColumna<DatosDelRegistrarManual>[]}
 * 
 * Columnas:
 * - RFC: Registro Federal de Contribuyentes del proveedor.
 * - Denominación o razón social: Nombre legal de la empresa o proveedor.
 * - Nombre completo: Nombre completo del representante o contacto.
 * - Domicilio fiscal: Dirección fiscal del proveedor.
 * - Norma: Norma aplicable al proveedor.
 * - Número de programa IMMEX: Número de registro en el programa IMMEX.
 * - Número de programa PROSEC: Número de registro en el programa PROSEC.
 * - Aduana en las que opera: Aduanas donde el proveedor realiza operaciones.
 */
export const REGISTRAR_PROVEEDORES_MANUAL_DE_TABLA: ConfiguracionColumna<DatosDelRegistrarManual>[] =
  [
    {
      encabezado: 'RFC',
      clave: (fila) => fila.rfc,
      orden: 1,
    },
    {
      encabezado: 'Denominación o razón social',
      clave: (fila) => fila.razonSocial,
      orden: 2,
    },
    {
      encabezado: 'Nombre completo',
      clave: (fila) => fila.nombreCompleto,
      orden: 3,
    },
    {
      encabezado: 'Domicilio fiscal',
      clave: (fila) => fila.domicilioFiscal,
      orden: 4,
    },
    {
      encabezado: 'Norma',
      clave: (fila) => fila.norma,
      orden: 5,
    },
    {
      encabezado: 'Número de programa IMMEX',
      clave: (fila) => fila.numeroProgramaImmex,
      orden: 6,
    },
    {
      encabezado: 'Número de programa PROSEC',
      clave: (fila) => fila.numeroProgramaProsec,
      orden: 7,
    },
    {
      encabezado: 'Aduana en las que opera',
      clave: (fila) => fila.aduanasOpera,
      orden: 8,
    },
  ];


/**
 * Representa la configuración de una columna en una tabla.
 *
 * @template T Tipo de los elementos de la columna.
 * @property {string} encabezado - Texto que se muestra como encabezado de la columna.
 * @property {(ele: T) => string | number | undefined | boolean} clave - Función que retorna el valor de un elemento para mostrar en la columna.
 * @property {number} orden - Orden de aparición de la columna en la tabla.
 * @property {boolean} [hiperenlace] - Indica si el contenido de la columna debe mostrarse como hipervínculo.
 */
export interface ConfiguracionColumna<T> {
  encabezado: string;
  clave: (ele: T) => string | number | undefined | boolean;
  orden: number;
  hiperenlace?: boolean;
}


/**
 * Lista de datos utilizada en el sistema para representar países y autorizaciones específicas.
 * 
 * @remarks
 * Los elementos de la lista incluyen nombres de países con su denominación oficial y una autorización de programa.
 * 
 * @example
 * ```typescript
 * CROSLISTA_DE_DATOS[0]; // 'AFGANISTÁN (EMIRATO ISLÁMICO)'
 * ```
 */
export const CROSLISTA_DE_DATOS: string[] = [
  'AFGANISTÁN (EMIRATO ISLÁMICO)',
  'ALBANIA (REPÚBLICA DE)',
  'ALEMANIA (REPÚBLICA FEDERAL DE)',
  'ANDORRA (PRINCIPADO DE)',
  '8-2024-AUTORIZACIÓN PROGRAMA NUEVO',
];
