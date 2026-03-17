/**
 * Modelos de datos para el certificado de registro del trámite 40401 del sistema AGA.
 *
 * Este archivo contiene las interfaces TypeScript que definen la estructura de datos
 * para el proceso de certificación y registro del trámite 40401. Define los contratos
 * de datos utilizados para representar información de productos, catálogos, y datos
 * específicos de CAAT Aéreo en el sistema de gestión de trámites de comercio exterior.
 *
 * Las interfaces incluyen:
 * - Detalles de productos con información comercial y técnica
 * - Estructuras de catálogos para listados y selecciones
 * - Datos específicos de CAAT Aéreo para transportación aérea
 * - Información de importación temporal y características de mercancías
 *
 * @fileoverview Modelos de datos para certificado de registro del trámite 40401
 * @author Sistema de Gestión de Trámites - Frontend Team
 * @version 1.0.0
 * @since 1.0.0
 * @module CertiRegistroModels
 */

/**
 * Interfaz que define la estructura completa de detalles de un producto para el trámite 40401.
 *
 * Esta interfaz especifica la información detallada necesaria para registrar productos
 * en el proceso de certificación del trámite 40401. Contiene datos comerciales,
 * técnicos y de importación requeridos para la gestión de mercancías en el sistema
 * de comercio exterior, incluyendo características físicas, condiciones comerciales
 * y datos de trazabilidad del producto.
 *
 * @interface DetallesDelProducto
 *
 * @example
 * ```typescript
 * // Ejemplo de detalle de producto completo:
 * const detalleProducto: DetallesDelProducto = {
 *   tipoDeMercancia: 'Equipos electrónicos',
 *   condicionDeLaMercancia: 'Nueva',
 *   cantidad: 100,
 *   enSucaso: 'Para uso en producción industrial',
 *   unidadDeMedida: 'Unidades',
 *   anoDeImportacionTemporal: 2024,
 *   modelo: 'XYZ-2024',
 *   marca: 'TechCorp',
 *   numeroDeSerie: 12345678
 * };
 * ```
 *
 * @since 1.0.0
 */
export interface DetallesDelProducto {
    /**
     * @property {string} tipoDeMercancia
     * Clasificación del tipo de mercancía según categorías comerciales estándar.
     * 
     * Define la categoría principal a la que pertenece la mercancía, utilizada
     * para clasificación arancelaria y aplicación de regulaciones específicas
     * según el tipo de producto en comercio exterior.
     */
    tipoDeMercancia: string;

    /**
     * @property {string} condicionDeLaMercancia
     * Estado o condición física y comercial de la mercancía al momento del registro.
     * 
     * Especifica si la mercancía es nueva, usada, remanufacturada o tiene
     * alguna condición especial que afecte su valoración o tratamiento
     * en el proceso de importación temporal.
     */
    condicionDeLaMercancia: string;

    /**
     * @property {number} cantidad
     * Cantidad numérica de unidades de la mercancía que se registra en el trámite.
     * 
     * Representa el número total de unidades, piezas o elementos de la
     * mercancía que forman parte de la importación temporal, utilizado
     * para cálculos de valor y verificación de inventarios.
     */
    cantidad: number;

    /**
     * @property {string} enSucaso
     * Información adicional o aclaraciones especiales sobre la mercancía.
     * 
     * Campo para incluir detalles adicionales, restricciones especiales,
     * o información complementaria que sea relevante para el procesamiento
     * del trámite y que no esté cubierta por otros campos específicos.
     */
    enSucaso: string;

    /**
     * @property {string} unidadDeMedida
     * Unidad de medida estándar utilizada para cuantificar la mercancía.
     * 
     * Especifica la unidad de medida oficial (kilogramos, litros, unidades,
     * metros, etc.) utilizada para expresar la cantidad de la mercancía
     * según estándares internacionales de comercio exterior.
     */
    unidadDeMedida: string;

    /**
     * @property {number} anoDeImportacionTemporal
     * Año fiscal en el que se realizó o planea realizar la importación temporal.
     * 
     * Fecha de referencia para el control temporal de la importación,
     * utilizada para determinar vigencias, plazos de retorno y aplicación
     * de regulaciones específicas según el período fiscal correspondiente.
     */
    anoDeImportacionTemporal: number;

    /**
     * @property {string} modelo
     * Modelo específico del producto según designación del fabricante.
     * 
     * Identificación del modelo comercial del producto asignado por el
     * fabricante, utilizado para identificación técnica, valuación y
     * verificación de especificaciones del producto importado.
     */
    modelo: string;

    /**
     * @property {string} marca
     * Marca comercial o nombre del fabricante del producto.
     * 
     * Identificación de la marca o fabricante del producto, utilizada
     * para verificación de autenticidad, aplicación de regulaciones
     * específicas por marca y control de calidad del producto.
     */
    marca: string;

    /**
     * @property {number} numeroDeSerie
     * Número de serie único asignado al producto por el fabricante.
     * 
     * Identificador único del producto utilizado para trazabilidad
     * individual, control de inventarios y verificación de autenticidad
     * durante el proceso de importación temporal.
     */
    numeroDeSerie: number;
}

/**
 * Interfaz que define la estructura de una lista de catálogo para el sistema de trámites.
 *
 * Esta interfaz especifica el contenedor de datos para listas de catálogos utilizadas
 * en formularios y selecciones del sistema. Proporciona una estructura estándar para
 * manejar colecciones de elementos de catálogo que se utilizan en campos de selección,
 * combo boxes y listados dentro de los formularios del trámite 40401.
 *
 * @interface CatalogoLista
 *
 * @example
 * ```typescript
 * // Ejemplo de lista de catálogo para tipos de mercancía:
 * const listaTiposMercancia: CatalogoLista = {
 *   datos: [
 *     { id: 1, descripcion: 'Equipos electrónicos' },
 *     { id: 2, descripcion: 'Maquinaria industrial' },
 *     { id: 3, descripcion: 'Materias primas' }
 *   ]
 * };
 * 
 * // Uso en componente para llenar combo box:
 * this.tiposMercanciaService.obtenerCatalogo().subscribe(
 *   (lista: CatalogoLista) => {
 *     this.opcionesTipos = lista.datos;
 *   }
 * );
 * ```
 *
 * @since 1.0.0
 */
export interface CatalogoLista {
    /**
     * @property {Catalogo[]} datos
     * Array de elementos de catálogo que contiene los datos disponibles para selección.
     * 
     * Colección de objetos Catalogo que representan las opciones disponibles
     * en un catálogo específico, utilizada para poblar campos de selección
     * y proporcionar opciones válidas al usuario en formularios del sistema.
     */
    datos: Catalogo[];
  }

  /**
   * Interfaz que define la estructura básica de un elemento de catálogo del sistema.
   *
   * Esta interfaz especifica la estructura estándar para elementos individuales
   * de catálogo utilizados a través del sistema de trámites. Proporciona la
   * información mínima necesaria para identificar y mostrar opciones en
   * interfaces de usuario, incluyendo identificador único y descripción legible.
   *
   * @interface Catalogo
   *
   * @example
   * ```typescript
   * // Ejemplo de elemento de catálogo:
   * const elementoCatalogo: Catalogo = {
   *   id: 101,
   *   descripcion: 'Equipos de telecomunicaciones'
   * };
   *
   * // Uso en búsqueda por ID:
   * const elemento = catalogoCompleto.find(item => item.id === 101);
   * console.log(elemento.descripcion); // 'Equipos de telecomunicaciones'
   *
   * // Uso en mapeo para opciones de UI:
   * const opciones = catalogo.map(item => ({
   *   value: item.id,
   *   label: item.descripcion
   * }));
   * ```
   *
   * @since 1.0.0
   */
export interface Catalogo {
    /**
     * @property {number} id
     * Identificador único numérico del elemento de catálogo.
     * 
     * Clave primaria que identifica de manera única cada elemento
     * dentro del catálogo, utilizada para referenciar el elemento
     * en operaciones de búsqueda, selección y almacenamiento.
     */
    id: number;

    /**
     * @property {string} descripcion
     * Descripción textual legible del elemento de catálogo.
     * 
     * Texto descriptivo que se muestra al usuario en interfaces
     * de selección, proporcionando información clara sobre
     * el elemento para facilitar la selección correcta.
     */
    descripcion: string;
  }

/**
 * Interfaz que define la estructura de datos específicos para CAAT Aéreo del trámite 40401.
 *
 * Esta interfaz especifica la información requerida para el Certificado de Autorización
 * de Agente de Transporte (CAAT) específico para modalidad aérea. Contiene datos
 * esenciales sobre el tipo de certificación, códigos de identificación de transportación
 * y información de la empresa operadora en el ámbito del transporte aéreo comercial.
 *
 * Los datos incluidos son fundamentales para:
 * - Identificación del tipo específico de CAAT Aéreo
 * - Códigos de transportación para trazabilidad
 * - Información de la empresa transportista autorizada
 * - Cumplimiento de regulaciones de aviación comercial
 *
 * @interface CaatAereoData
 *
 * @example
 * ```typescript
 * // Ejemplo de datos de CAAT Aéreo:
 * const caatAereo: CaatAereoData = {
 *   TipoDeCaatAereo: 'Carga Aérea Internacional',
 *   DodigoDeTransportacion: 'IATA-MX-001234',
 *   EmpresaDeTransportacion: 'AeroTransporte Mexicano S.A. de C.V.'
 * };
 *
 * // Uso en validación de formulario:
 * if (caatAereo.TipoDeCaatAereo && caatAereo.DodigoDeTransportacion) {
 *   this.procesarSolicitudCAAT(caatAereo);
 * }
 *
 * // Uso en reporte de certificación:
 * const reporte = `CAAT ${caatAereo.TipoDeCaatAereo} - ${caatAereo.EmpresaDeTransportacion}`;
 * ```
 *
 * @since 1.0.0
 */
  export interface CaatAereoData {
    /**
     * @property {string} TipoDeCaatAereo
     * Clasificación específica del tipo de CAAT Aéreo según modalidad operativa.
     * 
     * Define la categoría específica de autorización aérea (carga, pasajeros,
     * mixto, etc.) que determina las operaciones autorizadas y las regulaciones
     * aplicables según la normativa de aviación comercial mexicana.
     */
    TipoDeCaatAereo: string;

    /**
     * @property {string} DodigoDeTransportacion
     * Código único de identificación de transportación aérea asignado oficialmente.
     * 
     * Identificador alfanumérico único que registra y rastrlea las operaciones
     * de transporte aéreo, utilizado para trazabilidad, control regulatorio
     * y verificación de cumplimiento de normativas de aviación.
     */
    DodigoDeTransportacion: string;

    /**
     * @property {string} EmpresaDeTransportacion
     * Razón social completa de la empresa de transportación aérea autorizada.
     * 
     * Nombre oficial y completo de la empresa transportista que posee
     * la autorización CAAT, incluyendo forma jurídica, utilizado para
     * identificación legal y verificación de autorizaciones vigentes.
     */
    EmpresaDeTransportacion: string;
  }