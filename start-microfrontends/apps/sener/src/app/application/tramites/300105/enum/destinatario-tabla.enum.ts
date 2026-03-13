import { ConfiguracionColumna } from '@libs/shared/data-access-user/src';

/**
 * @interface MercanciaConfiguracionItem
 * @description Interfaz que representa la configuración de un elemento de mercancía
 * asociado a destinatarios en el trámite 300105 de autorización de equipos de rayos X.
 * Define la estructura mínima requerida para elementos de mercancía que pueden
 * ser relacionados con destinatarios específicos.
 * 
 * Esta interfaz se utiliza para configurar tablas y formularios que muestran
 * información de mercancías en el contexto de destinatarios.
 * 
 * @example
 * ```typescript
 * const mercancia: MercanciaConfiguracionItem = {
 *   tipoMercancia: 'Equipos médicos de rayos X'
 * };
 * ```
 * 
 * @since 1.0.0
 * @author VUCEM Development Team
 */
export interface MercanciaConfiguracionItem {
  /**
   * @property {string} tipoMercancia - Tipo de mercancía asociada al elemento
   * @description Categoría o clasificación de la mercancía que será manejada
   * por el destinatario. Ejemplo: "Equipos médicos", "Equipos industriales",
   * "Equipos de investigación", etc.
   * 
   * @example
   * ```typescript
   * tipoMercancia: 'Equipos médicos de rayos X'
   * tipoMercancia: 'Equipos industriales de inspección'
   * ```
   */
  tipoMercancia: string;
}

/**
 * @interface DestinatarioConfiguracionItem
 * @description Interfaz que representa la estructura completa de datos asociados a un destinatario
 * en el trámite 300105 de autorización de equipos de rayos X. Define todos los campos necesarios
 * para identificar y contactar a los destinatarios de equipos autorizados, incluyendo información
 * de contacto, ubicación y tipo de mercancía que manejarán.
 * 
 * Esta interfaz se utiliza en formularios, tablas y operaciones CRUD relacionadas
 * con la gestión de destinatarios en el sistema VUCEM.
 * 
 * @example
 * ```typescript
 * const destinatario: DestinatarioConfiguracionItem = {
 *   id: 1,
 *   denominacionRazon: 'Hospital General S.A. de C.V.',
 *   domicilio: 'Av. Reforma 123, Col. Centro',
 *   pais: 'México',
 *   correo: 'contacto@hospital.com',
 *   paginaWeb: 'www.hospital.com',
 *   tipoMercancia: 'Equipos médicos de rayos X'
 * };
 * ```
 * 
 * @since 1.0.0
 * @author VUCEM Development Team
 */
export interface DestinatarioConfiguracionItem {
  /**
   * @property {number} [id] - Identificador único del destinatario
   * @description Identificador numérico único que se asigna automáticamente
   * al crear un nuevo destinatario. Es opcional en creación pero requerido
   * para operaciones de actualización y eliminación.
   * 
   * @optional
   * @example
   * ```typescript
   * id: 12345
   * ```
   */
  id?: number;

  /**
   * @property {string} [denominacionRazonRem] - Denominación o razón social del remitente
   * @description Campo opcional que almacena la denominación o razón social
   * del remitente cuando es diferente al destinatario. Se utiliza en casos
   * donde el remitente y destinatario son entidades distintas.
   * 
   * @optional
   * @example
   * ```typescript
   * denominacionRazonRem: 'Importadora Médica XYZ S.A.'
   * ```
   */
  denominacionRazonRem?: string;

  /**
   * @property {string} denominacionRazon - Denominación o razón social del destinatario
   * @description Nombre oficial o razón social completa del destinatario.
   * Es un campo requerido que identifica legalmente a la entidad que
   * recibirá los equipos de rayos X autorizados.
   * 
   * @required
   * @example
   * ```typescript
   * denominacionRazon: 'Hospital Nacional de Especialidades S.A. de C.V.'
   * denominacionRazon: 'Clínica San José'
   * ```
   */
  denominacionRazon: string;

  /**
   * @property {string} domicilio - Domicilio del destinatario
   * @description Dirección física completa donde se encuentra ubicado el destinatario.
   * Debe incluir calle, número, colonia y referencias necesarias para
   * la entrega y ubicación de los equipos.
   * 
   * @required
   * @example
   * ```typescript
   * domicilio: 'Av. Insurgentes Sur 3700, Col. Insurgentes Cuicuilco, C.P. 04530'
   * domicilio: 'Calle Revolución 45, Centro Histórico'
   * ```
   */
  domicilio: string;

  /**
   * @property {string} pais - País del destinatario
   * @description País donde se encuentra ubicado el destinatario.
   * Se obtiene de un catálogo predefinido de países para mantener
   * consistencia en la información geográfica.
   * 
   * @required
   * @example
   * ```typescript
   * pais: 'México'
   * pais: 'Estados Unidos'
   * ```
   */
  pais: string;

  /**
   * @property {string} correo - Correo electrónico del destinatario
   * @description Dirección de correo electrónico oficial del destinatario
   * para comunicaciones relacionadas con la autorización y entrega
   * de equipos. Debe ser una dirección válida y activa.
   * 
   * @required
   * @example
   * ```typescript
   * correo: 'administracion@hospital.gob.mx'
   * correo: 'contacto@clinica.com'
   * ```
   */
  correo: string;

  /**
   * @property {string} paginaWeb - Página web del destinatario
   * @description URL del sitio web oficial del destinatario.
   * Proporciona información adicional sobre la organización
   * y puede ser utilizada para verificación y contacto.
   * 
   * @required
   * @example
   * ```typescript
   * paginaWeb: 'www.hospitalnacional.gob.mx'
   * paginaWeb: 'https://clinicasanjose.com'
   * ```
   */
  paginaWeb: string;

  /**
   * @property {string} tipoMercancia - Tipo de mercancía asociada al destinatario
   * @description Categoría o tipo específico de mercancía (equipos de rayos X)
   * que el destinatario está autorizado a recibir y utilizar.
   * Se selecciona de un catálogo predefinido de tipos de mercancía.
   * 
   * @required
   * @example
   * ```typescript
   * tipoMercancia: 'Equipos médicos de rayos X'
   * tipoMercancia: 'Equipos industriales de inspección'
   * ```
   */
  tipoMercancia: string;
}

/**
 * @constant MERCANCIA_TABLA_CONFIGURACION
 * @description Configuración predefinida de la tabla para mostrar elementos de mercancía
 * asociados a destinatarios en el trámite 300105. Define la estructura de columnas
 * y el formato de visualización para tablas que muestran tipos de mercancía.
 * 
 * Esta configuración establece una sola columna que muestra el tipo de mercancía,
 * utilizada en interfaces donde se necesita listar o seleccionar tipos de mercancía
 * relacionados con destinatarios específicos.
 * 
 * @type {Array<{encabezado: string, clave: Function, orden: number}>}
 * 
 * @example
 * ```typescript
 * // Uso en un componente de tabla
 * export class MercanciaTablaComponent {
 *   configuracion = MERCANCIA_TABLA_CONFIGURACION;
 *   datos: MercanciaConfiguracionItem[] = [
 *     { tipoMercancia: 'Equipos médicos' },
 *     { tipoMercancia: 'Equipos industriales' }
 *   ];
 * }
 * ```
 * 
 * @since 1.0.0
 * @author VUCEM Development Team
 * @readonly
 */
export const MERCANCIA_TABLA_CONFIGURACION = [
  {
    /**
     * @property {string} encabezado - Título de la columna en la tabla
     * @description Texto que se muestra como encabezado de la columna
     * en la tabla de mercancías. Identifica claramente el contenido
     * que se mostrará en esta columna.
     */
    encabezado: 'Mercancia',

    /**
     * @property {Function} clave - Función que devuelve el valor de la clave para un elemento de mercancía
     * @description Función extractora que toma un objeto MercanciaConfiguracionItem
     * y retorna el valor que se debe mostrar en esta columna de la tabla.
     * 
     * @param {MercanciaConfiguracionItem} item - Elemento de mercancía del cual extraer el valor
     * @returns {string} El tipo de mercancía del elemento
     */
    clave: (item: MercanciaConfiguracionItem): string => item.tipoMercancia,

    /**
     * @property {number} orden - Orden de la columna en la tabla
     * @description Número que define la posición de esta columna en la tabla.
     * Las columnas se ordenan de menor a mayor según este valor.
     */
    orden: 1,
  },
];

/**
 * @constant DESTINATARIO_TABLA_CONFIGURACION
 * @description Configuración completa de las columnas para la tabla de destinatarios
 * en el trámite 300105 de autorización de equipos de rayos X. Define cómo se mostrarán
 * los datos de los destinatarios en la tabla, incluyendo encabezados, funciones extractoras
 * de datos y orden de visualización.
 * 
 * Esta configuración establece tres columnas principales:
 * 1. Nombre/Razón social del destinatario
 * 2. Domicilio del destinatario  
 * 3. País del destinatario
 * 
 * Cada columna tiene su función extractora que obtiene el valor específico
 * del objeto DestinatarioConfiguracionItem correspondiente.
 * 
 * @type {ConfiguracionColumna<DestinatarioConfiguracionItem>[]}
 * 
 * @example
 * ```typescript
 * // Uso en un componente de tabla
 * export class DestinatarioTablaComponent {
 *   configuracion = DESTINATARIO_TABLA_CONFIGURACION;
 *   destinatarios: DestinatarioConfiguracionItem[] = [
 *     {
 *       denominacionRazon: 'Hospital Central',
 *       domicilio: 'Av. Principal 123',
 *       pais: 'México'
 *     }
 *   ];
 * }
 * ```
 * 
 * @example
 * ```html
 * <!-- Uso en template de tabla -->
 * <table>
 *   <thead>
 *     <tr>
 *       <th *ngFor="let col of configuracion">{{ col.encabezado }}</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr *ngFor="let item of destinatarios">
 *       <td *ngFor="let col of configuracion">{{ col.clave(item) }}</td>
 *     </tr>
 *   </tbody>
 * </table>
 * ```
 * 
 * @since 1.0.0
 * @author VUCEM Development Team
 * @readonly
 */
export const DESTINATARIO_TABLA_CONFIGURACION: ConfiguracionColumna<DestinatarioConfiguracionItem>[] = [
  {
    /**
     * @description Configuración de la columna para mostrar el nombre o razón social del destinatario.
     * Esta es la primera columna de la tabla y muestra la denominación oficial del destinatario.
     */
    encabezado: 'Nombre / Razón social',
    /**
     * @description Función extractora que obtiene la denominación o razón social de un destinatario.
     * @param {DestinatarioConfiguracionItem} item - Objeto destinatario del cual extraer la denominación
     * @returns {string} La denominación o razón social del destinatario
     */
    clave: (item: DestinatarioConfiguracionItem) => item.denominacionRazon,
    /**
     * @description Orden de visualización de esta columna (primera columna)
     */
    orden: 1,
  },
  {
    /**
     * @description Configuración de la columna para mostrar el domicilio del destinatario.
     * Esta es la segunda columna de la tabla y muestra la dirección física del destinatario.
     */
    encabezado: 'Domicilio',
    /**
     * @description Función extractora que obtiene el domicilio de un destinatario.
     * @param {DestinatarioConfiguracionItem} item - Objeto destinatario del cual extraer el domicilio
     * @returns {string} El domicilio completo del destinatario
     */
    clave: (item: DestinatarioConfiguracionItem) => item.domicilio,
    /**
     * @description Orden de visualización de esta columna (segunda columna)
     */
    orden: 2,
  },
  {
    /**
     * @description Configuración de la columna para mostrar el país del destinatario.
     * Esta es la tercera columna de la tabla y muestra la ubicación geográfica del destinatario.
     */
    encabezado: 'País',
    /**
     * @description Función extractora que obtiene el país de un destinatario.
     * @param {DestinatarioConfiguracionItem} item - Objeto destinatario del cual extraer el país
     * @returns {string} El país donde se encuentra ubicado el destinatario
     */
    clave: (item: DestinatarioConfiguracionItem) => item.pais,
    /**
     * @description Orden de visualización de esta columna (tercera columna)
     */
    orden: 3,
  },
];