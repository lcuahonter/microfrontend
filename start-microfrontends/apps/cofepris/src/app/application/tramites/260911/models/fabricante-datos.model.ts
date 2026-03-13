/**
 * Interfaz que define la estructura de columnas para capturar información de fabricantes.
 * Contiene todos los campos necesarios para registrar datos personales y de ubicación.
 * 
 * @interface CapturarColumns
 * @description Define el esquema de datos para el formulario de captura de fabricantes
 * @example
 * ```typescript
 * const fabricante: CapturarColumns = {
 *   nombreDenominacionORazonSocial: "Empresa XYZ S.A. de C.V.",
 *   rfc: "EXY123456789",
 *   curp: "ABCD123456HDFGHI01",
 *   telefono: 5551234567,
 *   correoElectronico: "contacto@empresa.com",
 *   calle: "Av. Principal",
 *   numeroExterior: 123,
 *   numeroInterior: 456,
 *   pais: "México",
 *   colonia: "Centro",
 *   municipioOAlcaldia: "Ciudad de México",
 *   localidad: "CDMX",
 *   entidadFederativa: "Distrito Federal",
 *   estadoLocalidad: "Activo",
 *   codigoPostal: "01000",
 *   coloniaOEquivalente: "Centro Histórico"
 * };
 * ```
 */
export interface CapturarColumns {
  /**
   * Nombre completo, denominación social o razón social del fabricante.
   * @type {string}
   * @description Campo obligatorio que identifica al fabricante o empresa
   * @example "Industrias Mexicanas S.A. de C.V."
   */
  nombreDenominacionORazonSocial: string;

  /**
   * Registro Federal de Contribuyentes del fabricante.
   * @type {string}
   * @description Identificador fiscal único asignado por el SAT
   * @example "IME123456789"
   * @pattern /^[A-Z&Ñ]{3,4}[0-9]{6}[A-Z0-9]{3}$/
   */
  rfc: string;

  /**
   * Clave Única de Registro de Población del fabricante.
   * @type {string}
   * @description Identificador único de personas físicas en México
   * @example "ABCD123456HDFGHI01"
   * @pattern /^[A-Z]{4}[0-9]{6}[HM][A-Z]{5}[0-9A-Z][0-9]$/
   */
  curp: string;

  /**
   * Número telefónico de contacto del fabricante.
   * @type {number}
   * @description Teléfono principal para comunicación
   * @example 5551234567
   * @minimum 1000000000
   * @maximum 9999999999
   */
  telefono: number;

  /**
   * Dirección de correo electrónico del fabricante.
   * @type {string}
   * @description Email principal para comunicación oficial
   * @example "contacto@fabricante.com"
   * @format email
   */
  correoElectronico: string;

  /**
   * Nombre de la calle donde se ubica el fabricante.
   * @type {string}
   * @description Vía pública principal de la dirección
   * @example "Av. Insurgentes Sur"
   */
  calle: string;

  /**
   * Número exterior del domicilio del fabricante.
   * @type {number}
   * @description Numeración oficial visible desde la vía pública
   * @example 1234
   * @minimum 1
   */
  numeroExterior: number;

  /**
   * Número interior del domicilio del fabricante.
   * @type {number}
   * @description Numeración interna del edificio o complejo
   * @example 567
   * @minimum 0
   * @optional
   */
  numeroInterior: number;

  /**
   * País donde se encuentra ubicado el fabricante.
   * @type {string}
   * @description Nación de residencia del fabricante
   * @example "México"
   * @default "México"
   */
  pais: string;

  /**
   * Colonia o barrio donde se ubica el fabricante.
   * @type {string}
   * @description Subdivisión territorial urbana
   * @example "Roma Norte"
   */
  colonia: string;

  /**
   * Municipio o alcaldía de ubicación del fabricante.
   * @type {string}
   * @description División político-administrativa local
   * @example "Cuauhtémoc"
   */
  municipioOAlcaldia: string;

  /**
   * Localidad específica donde se encuentra el fabricante.
   * @type {string}
   * @description Área geográfica más específica dentro del municipio
   * @example "Ciudad de México"
   */
  localidad: string;

  /**
   * Entidad federativa o estado donde se ubica el fabricante.
   * @type {string}
   * @description Estado o división político-administrativa mayor
   * @example "Ciudad de México"
   */
  entidadFederativa: string;

  /**
   * Estado o condición actual de la localidad del fabricante.
   * @type {string}
   * @description Status operativo o administrativo del lugar
   * @example "Activo"
   * @enum ["Activo", "Inactivo", "Suspendido"]
   */
  estadoLocalidad: string;

  /**
   * Código postal del domicilio del fabricante.
   * @type {string}
   * @description Código numérico para identificación postal
   * @example "06700"
   * @pattern /^[0-9]{5}$/
   */
  codigoPostal: string;

  /**
   * Colonia o denominación equivalente del área geográfica.
   * @type {string}
   * @description Denominación alternativa o complementaria de la colonia
   * @example "Roma Norte (Zona Rosa)"
   */
  coloniaOEquivalente: string;
}

/**
 * Configuración de columnas para la tabla de fabricantes.
 * Define la estructura, orden y métodos de acceso para mostrar información de fabricantes.
 * 
 * @constant FABRICANTE_TABLE_COLUMNS
 * @type {Array<ColumnConfig>}
 * @description Arreglo de configuración para renderizar tabla de fabricantes
 * @since 1.0.0
 * @author Sistema de Gestión de Fabricantes
 * 
 * @example
 * ```typescript
 * // Uso en componente de tabla
 * import { FABRICANTE_TABLE_COLUMNS } from './fabricante-config';
 * 
 * const TablaFabricantes = ({ datos }: { datos: CapturarColumns[] }) => {
 *   return (
 *     <table>
 *       <thead>
 *         <tr>
 *           {FABRICANTE_TABLE_COLUMNS.map(col => (
 *             <th key={col.orden}>{col.encabezado}</th>
 *           ))}
 *         </tr>
 *       </thead>
 *       <tbody>
 *         {datos.map((fila, index) => (
 *           <tr key={index}>
 *             {FABRICANTE_TABLE_COLUMNS.map(col => (
 *               <td key={col.orden}>{col.clave(fila)}</td>
 *             ))}
 *           </tr>
 *         ))}
 *       </tbody>
 *     </table>
 *   );
 * };
 * ```
 */
export const FABRICANTE_TABLE_COLUMNS = [
  /**
   * Configuración para la columna de nombre/denominación o razón social.
   * @description Primera columna que muestra la identificación principal del fabricante
   */
  {
    /**
     * Texto del encabezado de la columna.
     * @type {string}
     */
    encabezado: 'Nombre/denominación o razón social',
    
    /**
     * Función extractora para obtener el valor de la celda.
     * @param {CapturarColumns} fila - Objeto con datos del fabricante
     * @returns {string} Nombre o razón social del fabricante
     * @description Extrae el campo nombreDenominacionORazonSocial del objeto
     */
    clave: (fila: CapturarColumns): string => fila.nombreDenominacionORazonSocial,
    
    /**
     * Orden de visualización de la columna.
     * @type {number}
     * @description Posición relativa en la tabla (1 = primera columna)
     */
    orden: 1,
  },
  
  /**
   * Configuración para la columna de RFC.
   * @description Segunda columna que muestra el Registro Federal de Contribuyentes
   */
  {
    /**
     * Texto del encabezado de la columna.
     * @type {string}
     */
    encabezado: 'R.F.C.',
    
    /**
     * Función extractora para obtener el RFC.
     * @param {CapturarColumns} fila - Objeto con datos del fabricante
     * @returns {string} RFC del fabricante
     * @description Extrae el campo rfc del objeto
     */
    clave: (fila: CapturarColumns): string => fila.rfc,
    
    /**
     * Orden de visualización de la columna.
     * @type {number}
     */
    orden: 2,
  },
  
  /**
   * Configuración para la columna de CURP.
   * @description Tercera columna que muestra la Clave Única de Registro de Población
   */
  {
    /**
     * Texto del encabezado de la columna.
     * @type {string}
     */
    encabezado: 'CURP',
    
    /**
     * Función extractora para obtener el CURP.
     * @param {CapturarColumns} fila - Objeto con datos del fabricante
     * @returns {string} CURP del fabricante
     * @description Extrae el campo curp del objeto
     */
    clave: (fila: CapturarColumns): string => fila.curp,
    
    /**
     * Orden de visualización de la columna.
     * @type {number}
     */
    orden: 3,
  },
  
  /**
   * Configuración para la columna de teléfono.
   * @description Cuarta columna que muestra el número telefónico de contacto
   */
  {
    /**
     * Texto del encabezado de la columna.
     * @type {string}
     */
    encabezado: 'Teléfono',
    
    /**
     * Función extractora para obtener el teléfono.
     * @param {CapturarColumns} fila - Objeto con datos del fabricante
     * @returns {number} Número telefónico del fabricante
     * @description Extrae el campo telefono del objeto
     */
    clave: (fila: CapturarColumns): number => fila.telefono,
    
    /**
     * Orden de visualización de la columna.
     * @type {number}
     */
    orden: 4,
  },
  
  /**
   * Configuración para la columna de correo electrónico.
   * @description Quinta columna que muestra la dirección de email
   */
  {
    /**
     * Texto del encabezado de la columna.
     * @type {string}
     */
    encabezado: 'Correo electrónico',
    
    /**
     * Función extractora para obtener el correo electrónico.
     * @param {CapturarColumns} fila - Objeto con datos del fabricante
     * @returns {string} Email del fabricante
     * @description Extrae el campo correoElectronico del objeto
     */
    clave: (fila: CapturarColumns): string => fila.correoElectronico,
    
    /**
     * Orden de visualización de la columna.
     * @type {number}
     */
    orden: 5,
  },
  
  /**
   * Configuración para la columna de calle.
   * @description Sexta columna que muestra el nombre de la calle
   */
  {
    /**
     * Texto del encabezado de la columna.
     * @type {string}
     */
    encabezado: 'Calle',
    
    /**
     * Función extractora para obtener la calle.
     * @param {CapturarColumns} fila - Objeto con datos del fabricante
     * @returns {string} Nombre de la calle
     * @description Extrae el campo calle del objeto
     */
    clave: (fila: CapturarColumns): string => fila.calle,
    
    /**
     * Orden de visualización de la columna.
     * @type {number}
     */
    orden: 6,
  },
  
  /**
   * Configuración para la columna de número exterior.
   * @description Séptima columna que muestra el número exterior del domicilio
   */
  {
    /**
     * Texto del encabezado de la columna.
     * @type {string}
     */
    encabezado: 'Número exterior',
    
    /**
     * Función extractora para obtener el número exterior.
     * @param {CapturarColumns} fila - Objeto con datos del fabricante
     * @returns {number} Número exterior del domicilio
     * @description Extrae el campo numeroExterior del objeto
     */
    clave: (fila: CapturarColumns): number => fila.numeroExterior,
    
    /**
     * Orden de visualización de la columna.
     * @type {number}
     */
    orden: 7,
  },
  
  /**
   * Configuración para la columna de número interior.
   * @description Octava columna que muestra el número interior del domicilio
   */
  {
    /**
     * Texto del encabezado de la columna.
     * @type {string}
     */
    encabezado: 'Número interior',
    
    /**
     * Función extractora para obtener el número interior.
     * @param {CapturarColumns} fila - Objeto con datos del fabricante
     * @returns {number} Número interior del domicilio
     * @description Extrae el campo numeroInterior del objeto
     */
    clave: (fila: CapturarColumns): number => fila.numeroInterior,
    
    /**
     * Orden de visualización de la columna.
     * @type {number}
     */
    orden: 8,
  },
  
  /**
   * Configuración para la columna de país.
   * @description Novena columna que muestra el país de ubicación
   */
  {
    /**
     * Texto del encabezado de la columna.
     * @type {string}
     */
    encabezado: 'País',
    
    /**
     * Función extractora para obtener el país.
     * @param {CapturarColumns} fila - Objeto con datos del fabricante
     * @returns {string} País de ubicación
     * @description Extrae el campo pais del objeto
     */
    clave: (fila: CapturarColumns): string => fila.pais,
    
    /**
     * Orden de visualización de la columna.
     * @type {number}
     */
    orden: 9,
  },
  
  /**
   * Configuración para la columna de colonia.
   * @description Décima columna que muestra la colonia o barrio
   */
  {
    /**
     * Texto del encabezado de la columna.
     * @type {string}
     */
    encabezado: 'Colonia',
    
    /**
     * Función extractora para obtener la colonia.
     * @param {CapturarColumns} fila - Objeto con datos del fabricante
     * @returns {string} Colonia o barrio
     * @description Extrae el campo colonia del objeto
     */
    clave: (fila: CapturarColumns): string => fila.colonia,
    
    /**
     * Orden de visualización de la columna.
     * @type {number}
     */
    orden: 10,
  },
  
  /**
   * Configuración para la columna de municipio o alcaldía.
   * @description Undécima columna que muestra el municipio o alcaldía
   */
  {
    /**
     * Texto del encabezado de la columna.
     * @type {string}
     */
    encabezado: 'Municipio o alcaldía',
    
    /**
     * Función extractora para obtener el municipio o alcaldía.
     * @param {CapturarColumns} fila - Objeto con datos del fabricante
     * @returns {string} Municipio o alcaldía
     * @description Extrae el campo municipioOAlcaldia del objeto
     */
    clave: (fila: CapturarColumns): string => fila.municipioOAlcaldia,
    
    /**
     * Orden de visualización de la columna.
     * @type {number}
     */
    orden: 11,
  },
  
  /**
   * Configuración para la columna de localidad.
   * @description Duodécima columna que muestra la localidad específica
   */
  {
    /**
     * Texto del encabezado de la columna.
     * @type {string}
     */
    encabezado: 'Localidad',
    
    /**
     * Función extractora para obtener la localidad.
     * @param {CapturarColumns} fila - Objeto con datos del fabricante
     * @returns {string} Localidad específica
     * @description Extrae el campo localidad del objeto
     */
    clave: (fila: CapturarColumns): string => fila.localidad,
    
    /**
     * Orden de visualización de la columna.
     * @type {number}
     */
    orden: 12,
  },
  
  /**
   * Configuración para la columna de entidad federativa.
   * @description Decimotercera columna que muestra la entidad federativa o estado
   */
  {
    /**
     * Texto del encabezado de la columna.
     * @type {string}
     */
    encabezado: 'Entidad federativa',
    
    /**
     * Función extractora para obtener la entidad federativa.
     * @param {CapturarColumns} fila - Objeto con datos del fabricante
     * @returns {string} Entidad federativa o estado
     * @description Extrae el campo entidadFederativa del objeto
     */
    clave: (fila: CapturarColumns): string => fila.entidadFederativa,
    
    /**
     * Orden de visualización de la columna.
     * @type {number}
     */
    orden: 13,
  },
  
  /**
   * Configuración para la columna de estado/localidad.
   * @description Decimocuarta columna que muestra el estado o condición de la localidad
   */
  {
    /**
     * Texto del encabezado de la columna.
     * @type {string}
     */
    encabezado: 'Estado/localidad',
    
    /**
     * Función extractora para obtener el estado de la localidad.
     * @param {CapturarColumns} fila - Objeto con datos del fabricante
     * @returns {string} Estado o condición de la localidad
     * @description Extrae el campo estadoLocalidad del objeto
     */
    clave: (fila: CapturarColumns): string => fila.estadoLocalidad,
    
    /**
     * Orden de visualización de la columna.
     * @type {number}
     */
    orden: 14,
  },
  
  /**
   * Configuración para la columna de código postal.
   * @description Decimoquinta columna que muestra el código postal
   */
  {
    /**
     * Texto del encabezado de la columna.
     * @type {string}
     */
    encabezado: 'Código postal',
    
    /**
     * Función extractora para obtener el código postal.
     * @param {CapturarColumns} fila - Objeto con datos del fabricante
     * @returns {string} Código postal del domicilio
     * @description Extrae el campo codigoPostal del objeto
     */
    clave: (fila: CapturarColumns): string => fila.codigoPostal,
    
    /**
     * Orden de visualización de la columna.
     * @type {number}
     */
    orden: 15,
  },
  
  /**
   * Configuración para la columna de colonia o equivalente.
   * @description Decimosexta columna que muestra la colonia o denominación equivalente
   */
  {
    /**
     * Texto del encabezado de la columna.
     * @type {string}
     */
    encabezado: 'Colonia o equivalente',
    
    /**
     * Función extractora para obtener la colonia o equivalente.
     * @param {CapturarColumns} fila - Objeto con datos del fabricante
     * @returns {string} Colonia o denominación equivalente
     * @description Extrae el campo coloniaOEquivalente del objeto
     */
    clave: (fila: CapturarColumns): string => fila.coloniaOEquivalente,
    
    /**
     * Orden de visualización de la columna.
     * @type {number}
     */
    orden: 16,
  },
];