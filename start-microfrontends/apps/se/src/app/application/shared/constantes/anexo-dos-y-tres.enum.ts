import {
  AnexoDosEncabezado,
  AnexoEncabezado,
  AnexoUnoEncabezado,
  ProveedorClienteTabla,
  ProyectoImmexEncabezado,
} from '../models/nuevo-programa-industrial.model';

/**
 * Constante que define la estructura de los encabezados para el anexo de servicio.
 * 
 * Esta constante es un arreglo de objetos que especifica los encabezados y sus claves
 * asociadas para el manejo de datos en el anexo de servicio. Cada objeto contiene:
 * 
 * - `encabezado`: El nombre del encabezado que se mostrará en la interfaz de usuario.
 * - `clave`: Una función que toma un objeto de tipo `AnexoEncabezado` y devuelve el valor
 *   correspondiente al encabezado.
 * - `orden`: Un número que indica el orden en el que se deben mostrar los encabezados.
 * 
 * @constant
 * @type {Array<{ encabezado: string; clave: (ele: AnexoEncabezado) => string; orden: number }>}
 * 
 * @example
 * ```typescript
 * const encabezados = ANEXO_SERVICIO.map(item => item.encabezado);
 * console.log(encabezados); // ['Fracción arancelaria', 'Descripción']
 * ```
 */
export const ANEXO_SERVICIO = [
  {
    encabezado: 'Fracción arancelaria',
    clave: (ele: AnexoEncabezado): string => ele.encabezadoFraccion,
    orden: 1,
  },
  {
    encabezado: 'Descripción',
    clave: (ele: AnexoEncabezado): string => ele.encabezadoDescripcion,
    orden: 2,
  },
];

/**
 * Constante que contiene un mensaje en formato HTML relacionado con los bienes y equipos
 * necesarios para el proceso productivo y administrativo de una planta productiva.
 * 
 * Este mensaje incluye una descripción detallada de los elementos que pueden ser importados
 * bajo un programa específico, tales como:
 * - Herramientas, equipos y accesorios de investigación.
 * - Equipos de seguridad industrial.
 * - Productos necesarios para la higiene, asepsia y prevención de contaminación ambiental.
 * - Maquinaria, aparatos, instrumentos y refacciones para el proceso productivo.
 * - Equipos de laboratorio, medición y prueba de productos.
 * - Equipos para control de calidad y capacitación del personal.
 * - Equipos para manejo de materiales relacionados con bienes de exportación.
 * - Equipos vinculados al desarrollo administrativo de la empresa.
 * 
 * Este mensaje está diseñado para ser utilizado en contextos donde se requiera informar
 * sobre los bienes permitidos para importación bajo el programa mencionado.
 */
export const ANEXO_TRES_ALERTA = `<p>

Herramientas, equipos y accesorios de investigación, de seguridad industrial y de productos necesarios para la higiene, asepsia, y para la prevención y control de la contaminación ambiental de la planta productiva, manuales de trabajo y planos industriales, así como equipo de telecomunicación y cómputo. Maquinaria, aparatos, instrumentos y refacciones para el proceso productivo, equipo de laboratorio, de medición y de prueba de sus productos y los requeridos para el control de calidad,para capacitación de su personal, equipo para el manejo de materiales relacionados directamente con los bienes de exportación y otros vinculado con el proceso productivo, así como equipo para el desarrollo administrativo de la empresa, a importar al amparo del programa.</p>`;

/**
 * Constante que define un mensaje de alerta en formato HTML relacionado con 
 * los materiales y recursos utilizados en el proceso de producción o servicios 
 * de mercancías destinadas a la exportación.
 *
 * Este mensaje incluye una descripción detallada de los elementos que pueden 
 * ser considerados como parte del proceso, tales como:
 * - Materias primas.
 * - Partes y componentes.
 * - Materiales auxiliares.
 * - Envases y materiales de empaque.
 * - Etiquetas y folletos.
 * - Combustibles y lubricantes.
 *
 * El propósito de esta constante es proporcionar una referencia clara y 
 * estructurada sobre los elementos que forman parte del proceso de exportación.
 */
export const ANEXO_UNO_ALERTA = `<p>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Materias primas, partes, componentes, materiales auxiliares, envases, material de empaque, etiquetas, folletos, combustibles y lubricantes que se utilicen en el proceso de producción o de servicios de las mercancías de exportación.
</p>`;

/**
 * Constante que define la estructura de los encabezados para el servicio del Anexo I.
 * 
 * Cada objeto dentro del arreglo representa un encabezado con las siguientes propiedades:
 * 
 * - `encabezado`: El nombre del encabezado que se mostrará en la interfaz de usuario.
 * - `clave`: Una función que toma un objeto de tipo `AnexoUnoEncabezado` y devuelve el valor correspondiente al encabezado.
 * - `orden`: Un número que indica el orden en el que se deben mostrar los encabezados.
 * 
 * Propiedades de los encabezados:
 * 
 * 1. **Fracción**: Representa la fracción del encabezado, obtenida mediante `encabezadoFraccion`.
 * 2. **Fracción arancelaria**: Representa la fracción arancelaria, obtenida mediante `encabezadoFraccionArancelaria`.
 * 3. **Descripción comercial**: Representa la descripción comercial, obtenida mediante `encabezadoDescripcionComercial`.
 * 4. **Anexo II**: Representa el valor del Anexo II, obtenido mediante `encabezadoAnexoII`.
 * 5. **Tipo**: Representa el tipo del encabezado, obtenido mediante `encabezadoTipo`.
 * 6. **UMT**: Representa la unidad de medida y tipo (UMT), obtenida mediante `encabezadoUmt`.
 * 7. **Categoría**: Representa la categoría del encabezado, obtenida mediante `encabezadoCategoria`.
 * 8. **Valor en mercado**: Representa el valor en el mercado, obtenido mediante `encabezadoValorEnMercado`.
 * 
 * Esta constante es útil para definir y estructurar los datos que se mostrarán en tablas o reportes relacionados con el Anexo I.
 */
export const ANEXO_I_SERVICIO = [
  {
    encabezado: '#Fracción',
    clave: (ele: AnexoUnoEncabezado): string => ele.encabezadoFraccion,
    orden: 1,
  },
  {
    encabezado: 'Fracción arancelaria del producto de exportación',
    clave: (ele: AnexoUnoEncabezado): string =>
      ele.encabezadoFraccionArancelaria,
    orden: 2,
  },
  {
    encabezado: 'Descripción comercial',
    clave: (ele: AnexoUnoEncabezado): string =>
      ele.encabezadoDescripcionComercial,
    orden: 3,
  },
   {
    encabezado: 'Servicio',
    clave: (ele: AnexoUnoEncabezado): string =>
      ele.encabezadoDescripcionComercial,
    orden: 4,
  },
  {
    encabezado: 'Anexo II',
    clave: (ele: AnexoUnoEncabezado): string => ele.encabezadoAnexoII,
    orden: 5,
  },
  {
    encabezado: 'Tipo',
    clave: (ele: AnexoUnoEncabezado): string => ele.encabezadoTipo,
    orden: 6,
  },
  {
    encabezado: 'UMT',
    clave: (ele: AnexoUnoEncabezado): string => ele.encabezadoUmt,
    orden: 7,
  },
  {
    encabezado: 'Categoría',
    clave: (ele: AnexoUnoEncabezado): string => ele.encabezadoCategoria,
    orden: 8,
  },
  {
    encabezado: 'Valor en moneda mensual',
    clave: (ele: AnexoUnoEncabezado): number => ele.encabezadoValorEnMonedaMensual ?? 0,
    orden: 9,
  },
  {
    encabezado: 'Valor en moneda anual',
    clave: (ele: AnexoUnoEncabezado): number => ele.encabezadoValorEnMonedaAnual ?? 0,
    orden: 10,
  },
  {
    encabezado: 'Volumen mensual',
    clave: (ele: AnexoUnoEncabezado): number => ele.encabezadoVolumenMensual ?? 0,
    orden: 11,
  },
  {
    encabezado: 'Volumen anual',
    clave: (ele: AnexoUnoEncabezado): number => ele.encabezadoVolumenAnual ?? 0,
    orden: 12,
  },
];

/**
 * Constante que define la estructura de los encabezados utilizados en el anexo de importación de servicios.
 * 
 * Cada objeto dentro del arreglo representa un encabezado con las siguientes propiedades:
 * 
 * - `encabezado`: El título o nombre del encabezado que será mostrado en la interfaz de usuario.
 * - `clave`: Una función que toma un objeto de tipo `AnexoDosEncabezado` y retorna el valor correspondiente 
 *   al encabezado específico. Esto permite mapear dinámicamente los datos del objeto a los encabezados.
 * - `orden`: Un número que indica el orden en el que los encabezados deben aparecer.
 * 
 * ### Detalles de los encabezados:
 * 
 * 1. **Fracción**: Representa la fracción arancelaria básica.
 * 2. **Fracción arancelaria del producto de exportación**: Indica la fracción arancelaria asociada al producto exportado.
 * 3. **Descripción comercial**: Proporciona una descripción comercial del producto o mercancía.
 * 4. **Fracción arancelaria de la mercancía de importación**: Especifica la fracción arancelaria de la mercancía importada.
 * 
 * @constant
 * @type {Array<{encabezado: string, clave: (ele: AnexoDosEncabezado) => string, orden: number}>}
 */
export const ANEXO_IMPORTACION_SERVICIO = [
  {
    encabezado: '#Fracción',
    clave: (ele: AnexoDosEncabezado): string => ele.encabezadoFraccion,
    orden: 1,
  },
  {
    encabezado: 'Fracción arancelaria del producto de exportación',
    clave: (ele: AnexoDosEncabezado): string =>
      ele.encabezadoFraccionExportacion,
    orden: 2,
  },
  {
    encabezado: 'Descripción comercial',
    clave: (ele: AnexoDosEncabezado): string =>
      ele.encabezadoDescripcionComercial,
    orden: 3,
  },
  {
    encabezado: 'Fracción arancelaria de la mercancía de importación',
    clave: (ele: AnexoDosEncabezado): string =>
      ele.encabezadoFraccionImportacion,
    orden: 4,
  },
  {
    encabezado: 'Descripción comercial',
    clave: (ele: AnexoDosEncabezado): string =>
      ele.encabezadoDescripcionComercialImportacion,
    orden: 5,
  },
  {
    encabezado: 'Anexo II',
    clave: (ele: AnexoDosEncabezado): string =>
      ele.encabezadoAnexoII ?? '',
    orden: 6,
  },
  {
    encabezado: 'Tipo',
    clave: (ele: AnexoDosEncabezado): string =>
      ele.encabezadoTipo ?? '',
    orden: 7,
  },
  {
    encabezado: 'UMT',
    clave: (ele: AnexoDosEncabezado): string =>
      ele.encabezadoUmt ?? '',
    orden: 8,
  },
  {
    encabezado: 'Categoría',
    clave: (ele: AnexoDosEncabezado): string =>
      ele.encabezadoCategoria ?? '',
    orden: 9,
  },
  {
    encabezado: 'Valor en moneda mensual',
    clave: (ele: AnexoDosEncabezado): number =>
      ele.encabezadoValorEnMonedaMensual ?? 0,
    orden: 10,
  },
  {
    encabezado: 'Valor en moneda anual',
    clave: (ele: AnexoDosEncabezado): number =>
      ele.encabezadoValorEnMonedaAnual ?? 0,
    orden: 11,
  },
  {
    encabezado: 'Volumen mensual',
    clave: (ele: AnexoDosEncabezado): number =>
      ele.encabezadoVolumenMensual ?? 0,
    orden: 12,
  },
  {
    encabezado: 'Volumen anual',
    clave: (ele: AnexoDosEncabezado): number =>
      ele.encabezadoVolumenAnual ?? 0,
    orden: 13,
  }
];


/**
 * Configuración de la tabla para proveedores y clientes.
 * 
 * Este arreglo define la configuración de las columnas de una tabla que muestra información
 * relacionada con proveedores y clientes. Cada objeto en el arreglo representa una columna
 * con las siguientes propiedades:
 * 
 * - `encabezado`: El nombre o título de la columna que se mostrará en la tabla.
 * - `clave`: Una función que toma un objeto de tipo `ProveedorClienteTabla` y devuelve el valor
 *   correspondiente para esa columna. El tipo de retorno puede variar dependiendo de la columna.
 * - `orden`: Un número que indica el orden en el que se deben mostrar las columnas en la tabla.
 * 
 * Ejemplo de uso:
 * 
 * ```typescript
 * const encabezados = PROVEEDOR_CLIENTE_TABLA_CONFIG.map(config => config.encabezado);
 * console.log(encabezados); // ['Fracción', 'Pais de origen', 'Razón Social Proveedor', ...]
 * ```
 * 
 * @constant
 * @type {Array<{ encabezado: string; clave: (ele: ProveedorClienteTabla) => string | number | undefined; orden: number }>}
 */
export const PROVEEDOR_CLIENTE_TABLA_CONFIG = [
  {
    encabezado: '#Fracción',
    clave: (ele: ProveedorClienteTabla): string | undefined => ele.fraccion,
    orden: 1,
  },
  {
    encabezado: 'País de origen',
    clave: (ele: ProveedorClienteTabla): number | undefined => ele.paisDeOrigin,
    orden: 2,
  },
  {
    encabezado: 'Rfc/Tax Id Proveedor',
    clave: (ele: ProveedorClienteTabla): string => ele.rfcProveedor ?? '',
    orden: 3,
  },
  {
    encabezado: 'Razón Social Proveedor',
    clave: (ele: ProveedorClienteTabla): string | undefined =>
      ele.razonSocialProveedor,
    orden: 4,
  },
  {
    encabezado: 'País destino',
    clave: (ele: ProveedorClienteTabla): string => ele.paisDestino,
    orden: 5,
  },
  {
    encabezado: 'Rfc/Tax Id Cliente',
    clave: (ele: ProveedorClienteTabla): string => ele.rfcClinte,
    orden: 6,
  },
  {
    encabezado: 'Razón Social Cliente',
    clave: (ele: ProveedorClienteTabla): string => ele.razonSocial,
    orden: 7,
  },
];


/**
 * Configuración para el proyecto IMMEX que define los encabezados, claves y el orden
 * de las columnas utilizadas en la representación de datos del encabezado del proyecto.
 * 
 * Cada objeto en la configuración representa una columna con las siguientes propiedades:
 * 
 * - `encabezado`: El nombre del encabezado que se mostrará en la tabla.
 * - `clave`: Una función que toma un objeto de tipo `ProyectoImmexEncabezado` y devuelve
 *   el valor correspondiente para esa columna.
 * - `orden`: Un número que indica el orden en el que se deben mostrar las columnas.
 * 
 * @constant
 * @type {Array<{ encabezado: string, clave: (ele: ProyectoImmexEncabezado) => string, orden: number }>}
 * 
 * @example
 * // Ejemplo de uso:
 * const encabezados = PROYECTO_IMMEX_CONFIG.map(config => config.encabezado);
 * console.log(encabezados);
 * // Salida: ['Fracción', 'Tipo document', 'Descripción otro', 'Fecha firma', 'Fecha fin vigencia', 'RFC de la parte firmante', 'Nómbre/Razón social de la parte firmante']
 */
export const PROYECTO_IMMEX_CONFIG = [
  {
    encabezado: 'Fracción',
    clave: (ele: ProyectoImmexEncabezado): string => ele.encabezadoFraccion,
    orden: 1,
  },
  {
    encabezado: 'Tipo document',
    clave: (ele: ProyectoImmexEncabezado): string => ele.encabezadoTipoDocument,
    orden: 2,
  },
  {
    encabezado: 'Descripción otro',
    clave: (ele: ProyectoImmexEncabezado): string =>
      ele.encabezadoDescripcionOtro,
    orden: 3,
  },
  {
    encabezado: 'Fecha firma',
    clave: (ele: ProyectoImmexEncabezado): string => ele.encabezadoFechaFirma,
    orden: 4,
  },
  {
    encabezado: 'Fecha fin vigencia',
    clave: (ele: ProyectoImmexEncabezado): string =>
      ele.encabezadoFechaVigencia,
    orden: 5,
  },
  {
    encabezado: 'RFC de la parte firmante',
    clave: (ele: ProyectoImmexEncabezado): string => ele.encabezadoRfc,
    orden: 6,
  },
  {
    encabezado: 'Nómbre/Razón social de la parte firmante',
    clave: (ele: ProyectoImmexEncabezado): string =>
      ele.encabezadoRazonFirmante,
    orden: 7,
  },
];


/**
 * Constante `ANEXO_II_SERVICIO` que define una lista de configuraciones para los encabezados
 * utilizados en el Anexo II de un servicio. Cada objeto dentro de la lista representa
 * un encabezado con su respectiva clave y orden.
 *
 * Propiedades de cada objeto:
 * - `encabezado`: Nombre del encabezado que se mostrará en la interfaz de usuario.
 * - `clave`: Función que toma un objeto de tipo `AnexoDosEncabezado` y devuelve un valor
 *   específico asociado al encabezado.
 * - `orden`: Número que indica la posición del encabezado en la lista.
 *
 * Detalles de los encabezados:
 * 1. **Fracción**: Obtiene el valor de `encabezadoFraccion` del objeto `AnexoDosEncabezado`.
 * 2. **Fracción arancelaria del producto de exportación**: Obtiene el valor de 
 *    `encabezadoFraccionExportacion` del objeto `AnexoDosEncabezado`.
 * 3. **Descripción comercial**: Obtiene el valor de `encabezadoDescripcionComercial` 
 *    del objeto `AnexoDosEncabezado`.
 * 4. **Fracción arancelaria de la mercancía de importación**: Obtiene el valor de 
 *    `encabezadoFraccionImportacion` del objeto `AnexoDosEncabezado`.
 * 5. **Estatus**: Devuelve `'Activo'` si la propiedad `estatus` del objeto 
 *    `AnexoDosEncabezado` es verdadera, de lo contrario devuelve `'Inactivo'`.
 *
 * Uso:
 * Esta constante puede ser utilizada para generar dinámicamente tablas o estructuras
 * de datos que representen la información del Anexo II en una aplicación frontend.
 */
export const ANEXO_II_SERVICIO = [
  {
    encabezado: 'Fracción',
    clave: (ele: AnexoDosEncabezado): string => ele.encabezadoFraccion,
    orden: 1,
  },
  {
    encabezado: 'Fracción arancelaria del producto de exportación',
    clave: (ele: AnexoDosEncabezado): string =>
      ele.encabezadoFraccionExportacion,
    orden: 2,
  },
  {
    encabezado: 'Descripción comercial',
    clave: (ele: AnexoDosEncabezado): string =>
      ele.encabezadoDescripcionComercial,
    orden: 3,
  },
  {
    encabezado: 'Fracción arancelaria de la mercancía de importación',
    clave: (ele: AnexoDosEncabezado): string =>
      ele.encabezadoFraccionImportacion,
    orden: 4,
  },
  {
    encabezado: 'Estatus',
    clave: (ele: AnexoDosEncabezado): string => (ele.estatus ? 'Activo' : 'Inactivo'),
    orden: 5,
  },
];