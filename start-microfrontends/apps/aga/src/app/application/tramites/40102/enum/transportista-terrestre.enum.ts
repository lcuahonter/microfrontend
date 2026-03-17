/**
 * @fileoverview Constantes y configuraciones para el trámite de transportista terrestre 40102
 * 
 * Este archivo contiene todas las constantes, etiquetas de interfaz de usuario y configuraciones
 * utilizadas en el trámite 40102 para la gestión de transportistas terrestres. Incluye
 * configuraciones para páginas de choferes, vehículos, y definiciones de tablas para
 * mostrar información de vehículos y unidades de arrastre.
 * 
 * Las constantes están organizadas en objetos temáticos para facilitar el mantenimiento
 * y la localización de textos en la interfaz de usuario. También incluye configuraciones
 * de tablas que definen la estructura y presentación de datos vehiculares.
 * 
 * @author Sistema de Gestión de Trámites - Frontend Team
 * @version 1.0.0
 * @since 1.0.0
 * @module TransportistaTerrestreEnum
 */

import { UnidadTabla, UnidadTablaConfig, VehiculoTabla } from "../models/registro-muestras-mercancias.model";
import { VehiculoTablaConfig } from "../../40101/models/registro-muestras-mercancias.model";

/**
 * Constantes para la configuración de la página de choferes en el trámite 40102.
 * 
 * Este objeto contiene todas las etiquetas, títulos y textos utilizados en la interfaz
 * de usuario para la gestión de choferes nacionales y extranjeros. Incluye configuraciones
 * para modales, pestañas activas, etiquetas de formularios y mensajes informativos.
 * 
 * Las constantes están organizadas por funcionalidad:
 * - Configuración de componentes (modales, pestañas)
 * - Títulos de secciones y formularios
 * - Etiquetas de campos de entrada
 * - Textos de botones y acciones
 * - Mensajes informativos y tooltips
 * 
 * @constant {Object} CHOFERES_PAGE
 * 
 * @example
 * ```typescript
 * // Usar etiquetas en componentes
 * const tituloChoferExtrangero = CHOFERES_PAGE.SOLICITUD_TITULO_CHOFER_EXTRANJERO;
 * const labelNombre = CHOFERES_PAGE.LABEL_SOLICITUD_PERSONA_NOMBRE;
 * 
 * // Configurar pestaña activa
 * const pestanaActiva = CHOFERES_PAGE.ACTIVETAB; // 'nacional'
 * ```
 * 
 * @since 1.0.0
 */
export const CHOFERES_PAGE = {
  /**
   * Identificador para componentes de modal.
   * 
   * @property {string} MODAL
   * Valor: 'modal'
   */
  MODAL: 'modal',
  
  /**
   * Pestaña activa por defecto en la sección de choferes.
   * 
   * @property {string} ACTIVETAB
   * Valor: 'nacional' - Indica que la pestaña de choferes nacionales está activa por defecto
   */
  ACTIVETAB: 'nacional',
  
  /**
   * Título para la sección de choferes extranjeros.
   * 
   * @property {string} CHOFERES_EXTRANJEROS
   * Valor: 'Choferes extranjeros'
   */
  CHOFERES_EXTRANJEROS: 'Choferes extranjeros',
  
  /**
   * Título para la sección de choferes nacionales.
   * 
   * @property {string} CHOFERES_NACIONALES
   * Valor: 'Choferes nacionales'
   */
  CHOFERES_NACIONALES: 'Choferes nacionales',
  
  /**
   * Título del formulario para datos del chofer extranjero.
   * 
   * @property {string} SOLICITUD_TITULO_CHOFER_EXTRANJERO
   * Valor: 'Datos del chofer extranjero'
   */
  SOLICITUD_TITULO_CHOFER_EXTRANJERO: 'Datos del chofer extranjero',
  
  /**
   * Etiqueta para el campo de nombre en formularios.
   * 
   * @property {string} LABEL_SOLICITUD_PERSONA_NOMBRE
   * Valor: 'Nombre'
   */
  LABEL_SOLICITUD_PERSONA_NOMBRE: 'Nombre',
  
  /**
   * Etiqueta para el campo de primer apellido.
   * 
   * @property {string} LABEL_SOLICITUD_PERSONA_PRIMER_APELLIDO
   * Valor: 'Primer Apellido '
   */
  LABEL_SOLICITUD_PERSONA_PRIMER_APELLIDO: 'Primer Apellido ',
  
  /**
   * Etiqueta para el campo de segundo apellido.
   * 
   * @property {string} LABEL_SOLICITUD_PERSONA_SEGUNDO_APELLIDO
   * Valor: 'Segundo Apellido'
   */
  LABEL_SOLICITUD_PERSONA_SEGUNDO_APELLIDO: 'Segundo Apellido',
  
  /**
   * Etiqueta para el campo de nacionalidad.
   * 
   * @property {string} LABEL_NACIONALIDAD
   * Valor: 'Nacionalidad'
   */
  LABEL_NACIONALIDAD: 'Nacionalidad',
  
  /**
   * Etiqueta para el número de gafete del chofer extranjero.
   * 
   * @property {string} LABEL_SOLICITUD_CHOFER_EXT_GAFETE
   * Valor: 'Numero de gafete del chofer'
   */
  LABEL_SOLICITUD_CHOFER_EXT_GAFETE: 'Numero de gafete del chofer',
  
  /**
   * Etiqueta para la vigencia del gafete.
   * 
   * @property {string} LABEL_SOLICITUD_CHOFER_EXT_VIGENCIA_GAFETE
   * Valor: 'Vigencia del Gafete'
   */
  LABEL_SOLICITUD_CHOFER_EXT_VIGENCIA_GAFETE: 'Vigencia del Gafete',
  
  /**
   * Etiqueta para el Número de Seguro Social.
   * 
   * @property {string} LABEL_SOLICITUD_CHOFER_EXT_NSS
   * Valor: 'Número de Seguro Social (NSS)'
   */
  LABEL_SOLICITUD_CHOFER_EXT_NSS: 'Número de Seguro Social (NSS)',
  
  /**
   * Etiqueta para el número de identificación fiscal.
   * 
   * @property {string} LABEL_SOLICITUD_CHOFER_EXT_IDE_FISCAL
   * Valor: 'Número de Identificación Fiscal'
   */
  LABEL_SOLICITUD_CHOFER_EXT_IDE_FISCAL: 'Número de Identificación Fiscal',
  
  /**
   * Texto de ayuda para el campo de identificación fiscal.
   * 
   * @property {string} TOOL_TIP_IDENTIFICACION_FISCAL
   * Valor: 'Número de identificación fiscal en el país de residencia'
   */
  TOOL_TIP_IDENTIFICACION_FISCAL: 'Número de identificación fiscal en el país de residencia',
  
  /**
   * Título para la sección de domicilio fiscal.
   * 
   * @property {string} SOLICITUD_TITULO_DOMICILIO_FISCAL
   * Valor: 'Domicilio Fiscal'
   */
  SOLICITUD_TITULO_DOMICILIO_FISCAL: 'Domicilio Fiscal',
  
  /**
   * Etiqueta para el campo de país.
   * 
   * @property {string} LABEL_PAIS
   * Valor: 'País'
   */
  LABEL_PAIS: 'País',
  /**
   * Etiqueta para el campo de código postal en domicilio.
   * 
   * @property {string} LABEL_SOLICITUD_DOMICILIO_CODIGO_POSTAL
   * Valor: 'Código Postal'
   */
  LABEL_SOLICITUD_DOMICILIO_CODIGO_POSTAL: 'Código Postal',
  
  /**
   * Etiqueta para el campo de entidad federativa o estado.
   * 
   * @property {string} LABEL_ENTIDAD_FEDERATIVA
   * Valor: 'Estado'
   */
  LABEL_ENTIDAD_FEDERATIVA: 'Estado',
  
  /**
   * Etiqueta para el campo de calle en domicilio.
   * 
   * @property {string} LABEL_SOLICITUD_DOMICILIO_CALLE
   * Valor: 'Calle'
   */
  LABEL_SOLICITUD_DOMICILIO_CALLE: 'Calle',
  
  /**
   * Etiqueta para el número exterior del domicilio.
   * 
   * @property {string} LABEL_SOLICITUD_DOMICILIO_NUMERO_EXTERIOR
   * Valor: 'Número exterior'
   */
  LABEL_SOLICITUD_DOMICILIO_NUMERO_EXTERIOR: 'Número exterior',
  
  /**
   * Etiqueta para el número interior del domicilio.
   * 
   * @property {string} LABEL_SOLICITUD_DOMICILIO_NUMERO_INTERIOR
   * Valor: 'Número interior'
   */
  LABEL_SOLICITUD_DOMICILIO_NUMERO_INTERIOR: 'Número interior',
  
  /**
   * Etiqueta para el país de origen o residencia.
   * 
   * @property {string} LABEL_PAIS_ORIGEN
   * Valor: 'País de residencia'
   */
  LABEL_PAIS_ORIGEN: 'País de residencia',
  
  /**
   * Etiqueta para el campo de ciudad en domicilio.
   * 
   * @property {string} LABEL_SOLICITUD_DOMICILIO_CIUDAD
   * Valor: 'Ciudad'
   */
  LABEL_SOLICITUD_DOMICILIO_CIUDAD: 'Ciudad',
  
  /**
   * Etiqueta para el campo de correo electrónico.
   * 
   * @property {string} LABEL_SOLICITUD_CORREO
   * Valor: 'Correo electrónico'
   */
  LABEL_SOLICITUD_CORREO: 'Correo electrónico',
  
  /**
   * Etiqueta para el campo de teléfono.
   * 
   * @property {string} LABEL_SOLICITUD_TELEFONO
   * Valor: 'Teléfono'
   */
  LABEL_SOLICITUD_TELEFONO: 'Teléfono',
  
  /**
   * Mensaje informativo sobre campos obligatorios.
   * 
   * @property {string} CAMPOS_OBLIGATORIOS
   * Valor: '* Campos obligatorios'
   */
  CAMPOS_OBLIGATORIOS: '* Campos obligatorios',
  
  /**
   * Texto para el botón de búsqueda.
   * 
   * @property {string} BOTON_BUSCAR
   * Valor: 'Buscar'
   */
  BOTON_BUSCAR: 'Buscar',
  
  /**
   * Texto para el botón de limpiar formulario.
   * 
   * @property {string} BOTON_LIMPIAR
   * Valor: 'Limpiar'
   */
  BOTON_LIMPIAR: 'Limpiar',
  
  /**
   * Texto para el botón de cancelar acción.
   * 
   * @property {string} BOTON_CANCELAR
   * Valor: 'Cancelar'
   */
  BOTON_CANCELAR: 'Cancelar',
  
  /**
   * Texto para el botón de guardar información.
   * 
   * @property {string} BOTON_GUARDAR
   * Valor: 'Guardar'
   */
  BOTON_GUARDAR: 'Guardar',
  
  /**
   * Texto por defecto para selectores sin selección.
   * 
   * @property {string} SELECCIONA_UNVALOR
   * Valor: 'Selecciona un valor'
   */
  SELECCIONA_UNVALOR: 'Selecciona un valor'
};

/**
 * Constantes para la configuración de la página de vehículos en el trámite 40102.
 * 
 * Este objeto contiene todas las etiquetas, títulos y textos utilizados en la interfaz
 * de usuario para la gestión del parque vehicular. Incluye configuraciones para
 * pestañas, formularios de datos vehiculares, campos de entrada y acciones disponibles.
 * 
 * Las constantes están organizadas por funcionalidad:
 * - Configuración de pestañas y navegación
 * - Títulos de secciones y formularios
 * - Etiquetas de campos de vehículos
 * - Textos por defecto para selectores
 * - Textos de botones y acciones
 * 
 * @constant {Object} VEHICULO_PAGE
 * 
 * @example
 * ```typescript
 * // Usar etiquetas en componentes de vehículos
 * const tituloSeccion = VEHICULO_PAGE.SELECTED_TAB;
 * const labelTipoVehiculo = VEHICULO_PAGE.LABEL_SOLICITUD_VEHICULO_TIPO_VEHICULO;
 * 
 * // Configurar texto por defecto en selectores
 * const textoNoSeleccion = VEHICULO_PAGE.NON_SELECTION_TEXT_TIPO_VEHICULO;
 * ```
 * 
 * @since 1.0.0
 */
export const VEHICULO_PAGE= {
  /**
   * Título de la pestaña seleccionada para parque vehicular.
   * 
   * @property {string} SELECTED_TAB
   * Valor: 'Parque vehicular'
   */
  SELECTED_TAB: 'Parque vehicular',
  
  /**
   * Identificador de la pestaña activa para vehículos.
   * 
   * @property {string} ACTIVE_TAB
   * Valor: 'parquevehicular'
   */
  ACTIVE_TAB: 'parquevehicular',
  
  /**
   * Etiqueta para el campo de tipo de vehículo.
   * 
   * @property {string} LABEL_SOLICITUD_VEHICULO_TIPO_VEHICULO
   * Valor: 'Tipo de Vehículo'
   */
  LABEL_SOLICITUD_VEHICULO_TIPO_VEHICULO: 'Tipo de Vehículo',
  
  /**
   * Título para la sección de datos del vehículo.
   * 
   * @property {string} SOLICITUD_TITULO_DATOS_VEHICULO
   * Valor: 'Datos del Vehículo'
   */
  SOLICITUD_TITULO_DATOS_VEHICULO: 'Datos del Vehículo',
  
  /**
   * Etiqueta para el número de identificación vehicular (VIN).
   * 
   * @property {string} LABEL_SOLICITUD_VEHICULO_VIN
   * Valor: 'Número de identificación vehicular'
   */
  LABEL_SOLICITUD_VEHICULO_VIN: 'Número de identificación vehicular',
  
  /**
   * Etiqueta para el campo de puntos.
   * 
   * @property {string} LABEL_PUNTOS
   * Valor: 'Puntos'
   */
  LABEL_PUNTOS: 'Puntos',
  
  /**
   * Texto por defecto para selector de tipo de vehículo sin selección.
   * 
   * @property {string} NON_SELECTION_TEXT_TIPO_VEHICULO
   * Valor: 'Selecciona un valor'
   */
  NON_SELECTION_TEXT_TIPO_VEHICULO: 'Selecciona un valor',
  
  /**
   * Texto por defecto para selector de país emisor sin selección.
   * 
   * @property {string} NON_SELECTION_TEXT_PAIS_EMISOR
   * Valor: 'Selecciona un valor'
   */
  NON_SELECTION_TEXT_PAIS_EMISOR: 'Selecciona un valor',
  
  /**
   * Texto por defecto para selector de color sin selección.
   * 
   * @property {string} NON_SELECTION_TEXT_COLOR_AGA
   * Valor: 'Selecciona un valor'
   */
  NON_SELECTION_TEXT_COLOR_AGA: 'Selecciona un valor',
  
  /**
   * Texto por defecto para selector de años sin selección.
   * 
   * @property {string} NON_SELECTION_TEXT_ANIOS
   * Valor: 'Selecciona un valor'
   */
  NON_SELECTION_TEXT_ANIOS: 'Selecciona un valor',
  
  /**
   * Etiqueta para el ID del vehículo.
   * 
   * @property {string} LABEL_SOLICITUD_VEHICULO_ID_DEVEHICULO
   * Valor: 'ID de Vehículo'
   */
  LABEL_SOLICITUD_VEHICULO_ID_DEVEHICULO: 'ID de Vehículo',
  
  /**
   * Etiqueta para el número de placas del vehículo.
   * 
   * @property {string} LABEL_SOLICITUD_VEHICULO_NUMEROPLACAS
   * Valor: 'Número de Placas'
   */
  LABEL_SOLICITUD_VEHICULO_NUMEROPLACAS: 'Número de Placas',
  
  /**
   * Etiqueta para el país emisor de las placas.
   * 
   * @property {string} LABEL_SOLICITUD_VEHICULO_PAIS_EMISOR
   * Valor: 'País Emisor'
   */
  LABEL_SOLICITUD_VEHICULO_PAIS_EMISOR: 'País Emisor',
  
  /**
   * Etiqueta para el estado o provincia emisor.
   * 
   * @property {string} LABEL_SOLICITUD_DOMICILIO_ESTADO
   * Valor: 'Estado o provincia'
   */
  LABEL_SOLICITUD_DOMICILIO_ESTADO: 'Estado o provincia',
  
  /**
   * Etiqueta para la marca del vehículo.
   * 
   * @property {string} LABEL_SOLICITUD_VEHICULO_MARCA
   * Valor: 'Marca'
   */
  LABEL_SOLICITUD_VEHICULO_MARCA: 'Marca',
  
  /**
   * Etiqueta para el modelo del vehículo.
   * 
   * @property {string} LABEL_SOLICITUD_VEHICULO_MODELO
   * Valor: 'Modelo'
   */
  LABEL_SOLICITUD_VEHICULO_MODELO: 'Modelo',
  
  /**
   * Etiqueta para el año del vehículo.
   * 
   * @property {string} LABEL_ANIO_VEH
   * Valor: 'Año'
   */
  LABEL_ANIO_VEH: 'Año',
  
  /**
   * Etiqueta para el transponder del vehículo.
   * 
   * @property {string} LABEL_SOLICITUD_VEHICULO_TRANSPONDER
   * Valor: 'Transponder'
   */
  LABEL_SOLICITUD_VEHICULO_TRANSPONDER: 'Transponder',
  
  /**
   * Etiqueta para el color del vehículo.
   * 
   * @property {string} LABEL_SOLICITUD_VEHICULO_COLOR
   * Valor: 'Color de Vehículo'
   */
  LABEL_SOLICITUD_VEHICULO_COLOR: 'Color de Vehículo',
  
  /**
   * Etiqueta para el número económico del vehículo.
   * 
   * @property {string} LABEL_SOLICITUD_VEHICULO_NUMERO_ECONOMICO
   * Valor: 'Número económico'
   */
  LABEL_SOLICITUD_VEHICULO_NUMERO_ECONOMICO: 'Número económico',
  
  /**
   * Etiqueta para el número de segunda placa.
   * 
   * @property {string} LABEL_SOLICITUD_VEHICULO_NUMERO_2DAPLACA
   * Valor: 'Número 2da Placa'
   */
  LABEL_SOLICITUD_VEHICULO_NUMERO_2DAPLACA: 'Número 2da Placa',
  
  /**
   * Etiqueta para el estado emisor de la segunda placa.
   * 
   * @property {string} LABEL_SOLICITUD_VEHICULO_EMISOR_2DAPLACA
   * Valor: 'Estado emisor de 2da Placa'
   */
  LABEL_SOLICITUD_VEHICULO_EMISOR_2DAPLACA: 'Estado emisor de 2da Placa',
  
  /**
   * Etiqueta para el país emisor de la segunda placa.
   * 
   * @property {string} LABEL_SOLICITUD_VEHICULO_PAIS_EMISOR_2DAPLACA
   * Valor: 'País Emisor 2da Placa'
   */
  LABEL_SOLICITUD_VEHICULO_PAIS_EMISOR_2DAPLACA: 'País Emisor 2da Placa',
  
  /**
   * Etiqueta para la descripción del vehículo.
   * 
   * @property {string} LABEL_DESCRIPCION_VEHICULO
   * Valor: 'Descripción del vehículo'
   */
  LABEL_DESCRIPCION_VEHICULO: 'Descripción del vehículo',
  
  /**
   * Texto para el botón de limpiar formulario.
   * 
   * @property {string} BOTON_LIMPIAR
   * Valor: 'Limpiar'
   */
  BOTON_LIMPIAR: 'Limpiar',
  
  /**
   * Texto para el botón de cancelar acción.
   * 
   * @property {string} BOTON_CANCELAR
   * Valor: 'Cancelar'
   */
  BOTON_CANCELAR: 'Cancelar',
  
  /**
   * Texto para el botón de guardar información.
   * 
   * @property {string} BOTON_GUARDAR
   * Valor: 'Guardar'
   */
  BOTON_GUARDAR: 'Guardar'
};


/**
 * Configuración de tabla para mostrar información de vehículos en el trámite 40102.
 * 
 * Esta configuración define la estructura de la tabla de vehículos, incluyendo
 * las columnas (encabezados), las funciones de acceso a datos y el orden de presentación.
 * Cada encabezado especifica cómo extraer y mostrar información de los objetos VehiculoTabla.
 * 
 * La configuración incluye:
 * - Encabezados de columnas con títulos descriptivos
 * - Funciones de acceso (clave) para extraer datos específicos
 * - Orden de presentación de columnas
 * - Array de datos inicialmente vacío
 * 
 * @constant {VehiculoTablaConfig} VEHICULOS_TABLA_CONFIG
 * 
 * @example
 * ```typescript
 * // Usar la configuración en un componente de tabla
 * const configTabla = VEHICULOS_TABLA_CONFIG;
 * 
 * // Acceder a los encabezados
 * const encabezados = configTabla.encabezadas;
 * 
 * // Agregar datos a la tabla
 * configTabla.datos = listaVehiculos;
 * ```
 * 
 * @since 1.0.0
 */
export const VEHICULOS_TABLA_CONFIG: VehiculoTablaConfig = {
  /**
   * Array de configuraciones de encabezados para la tabla de vehículos.
   * 
   * Cada elemento define una columna de la tabla con:
   * - encabezado: Título que se muestra en la cabecera
   * - clave: Función que extrae el valor del objeto VehiculoTabla
   * - orden: Posición de la columna en la tabla
   * 
   * @property {Array<Object>} encabezadas
   */
  encabezadas: [
    {
      /**
       * Columna para el número de identificación vehicular.
       * 
       * @property {string} encabezado - 'Número de identificación vehicular'
       * @property {Function} clave - Función que obtiene item.numero
       * @property {number} orden - Posición 1 en la tabla
       */
      encabezado: 'Número de identificación vehicular',
      clave: (item: VehiculoTabla) => item.numero,
      orden: 1,
    },
    {
      /**
       * Columna para el tipo de vehículo.
       * 
       * @property {string} encabezado - 'Tipo de vehículo'
       * @property {Function} clave - Función que obtiene item.tipoDeVehiculo
       * @property {number} orden - Posición 2 en la tabla
       */
      encabezado: 'Tipo de vehículo',
      clave: (item: VehiculoTabla) => item.tipoDeVehiculo,
      orden: 2,
    },
    {
      /**
       * Columna para el ID de vehículo.
       * 
       * @property {string} encabezado - 'ID de vehículo'
       * @property {Function} clave - Función que obtiene item.idDeVehiculo
       * @property {number} orden - Posición 3 en la tabla
       */
      encabezado: 'ID de vehículo',
      clave: (item: VehiculoTabla) => item.idDeVehiculo,
      orden: 3,
    },
    {
      /**
       * Columna para el número de placas.
       * 
       * @property {string} encabezado - 'Número de Placas'
       * @property {Function} clave - Función que obtiene item.numeroPlaca
       * @property {number} orden - Posición 4 en la tabla
       */
      encabezado: 'Número de Placas',
      clave: (item: VehiculoTabla) => item.numeroPlaca,
      orden: 4,
    },
    {
      /**
       * Columna para el país emisor.
       * 
       * @property {string} encabezado - 'País Emisor'
       * @property {Function} clave - Función que obtiene item.paisEmisor
       * @property {number} orden - Posición 5 en la tabla
       */
      encabezado: 'País Emisor',
      clave: (item: VehiculoTabla) => item.paisEmisor,
      orden: 5,
    },
    {
      /**
       * Columna para el estado o provincia.
       * 
       * @property {string} encabezado - 'Estado o provincia'
       * @property {Function} clave - Función que obtiene item.estado
       * @property {number} orden - Posición 6 en la tabla
       */
      encabezado: 'Estado o provincia',
      clave: (item: VehiculoTabla) => item.estado,
      orden: 6,
    },
    {
      /**
       * Columna para la marca del vehículo.
       * 
       * @property {string} encabezado - 'Marca'
       * @property {Function} clave - Función que obtiene item.marca
       * @property {number} orden - Posición 7 en la tabla
       */
      encabezado: 'Marca',
      clave: (item: VehiculoTabla) => item.marca,
      orden: 7,
    },
    {
      /**
       * Columna para el modelo del vehículo.
       * 
       * @property {string} encabezado - 'Modelo'
       * @property {Function} clave - Función que obtiene item.modelo
       * @property {number} orden - Posición 8 en la tabla
       */
      encabezado: 'Modelo',
      clave: (item: VehiculoTabla) => item.modelo,
      orden: 8,
    },
    {
      /**
       * Columna para el año del vehículo.
       * 
       * @property {string} encabezado - 'Año'
       * @property {Function} clave - Función que obtiene item.ano
       * @property {number} orden - Posición 9 en la tabla
       */
      encabezado: 'Año',
      clave: (item: VehiculoTabla) => item.ano,
      orden: 9,
    },
    {
      /**
       * Columna para el transponder del vehículo.
       * 
       * @property {string} encabezado - 'Transponder'
       * @property {Function} clave - Función que obtiene item.transponder
       * @property {number} orden - Posición 10 en la tabla
       */
      encabezado: 'Transponder',
      clave: (item: VehiculoTabla) => item.transponder,
      orden: 10,
    },
    {
      /**
       * Columna para el color del vehículo.
       * 
       * @property {string} encabezado - 'Color'
       * @property {Function} clave - Función que obtiene item.colorVehiculo
       * @property {number} orden - Posición 11 en la tabla
       */
      encabezado: 'Color',
      clave: (item: VehiculoTabla) => item.colorVehiculo,
      orden: 11,
    },
    {
      /**
       * Columna para el número económico.
       * 
       * @property {string} encabezado - 'Número económico'
       * @property {Function} clave - Función que obtiene item.numuroEconomico
       * @property {number} orden - Posición 12 en la tabla
       */
      encabezado: 'Número económico',
      clave: (item: VehiculoTabla) => item.numuroEconomico,
      orden: 12,
    },
    {
      /**
       * Columna para el número de segunda placa.
       * 
       * @property {string} encabezado - 'Número 2da Placa'
       * @property {Function} clave - Función que obtiene item.numero2daPlaca
       * @property {number} orden - Posición 13 en la tabla
       */
      encabezado: 'Número 2da Placa',
      clave: (item: VehiculoTabla) => item.numero2daPlaca,
      orden: 13,
    },
    {
      /**
       * Columna para el estado emisor de la segunda placa.
       * 
       * @property {string} encabezado - 'Estado Emisor 2da Placa'
       * @property {Function} clave - Función que obtiene item.estado2daPlaca
       * @property {number} orden - Posición 14 en la tabla
       */
      encabezado: 'Estado Emisor 2da Placa',
      clave: (item: VehiculoTabla) => item.estado2daPlaca,
      orden: 14,
    },
    {
      /**
       * Columna para el país emisor de la segunda placa.
       * 
       * @property {string} encabezado - 'País Emisor 2da Placa'
       * @property {Function} clave - Función que obtiene item.paisEmisor2daPlaca
       * @property {number} orden - Posición 15 en la tabla
       */
      encabezado: 'País Emisor 2da Placa',
      clave: (item: VehiculoTabla) => item.paisEmisor2daPlaca,
      orden: 15,
    },
    {
      /**
       * Columna para la descripción del vehículo.
       * 
       * @property {string} encabezado - 'Descripción'
       * @property {Function} clave - Función que obtiene item.descripcion
       * @property {number} orden - Posición 16 en la tabla
       */
      encabezado: 'Descripción',
      clave: (item: VehiculoTabla) => item.descripcion,
      orden: 16,
    },
  ],
  /**
   * Array de datos de vehículos para mostrar en la tabla.
   * 
   * Inicialmente vacío, se puebla dinámicamente con objetos VehiculoTabla.
   * 
   * @property {Array} datos
   */
   datos: [],
};

/**
 * Configuración de tabla para mostrar información de unidades de arrastre en el trámite 40102.
 * 
 * Esta configuración define la estructura de la tabla de unidades de arrastre, incluyendo
 * las columnas (encabezados), las funciones de acceso a datos y el orden de presentación.
 * Cada encabezado especifica cómo extraer y mostrar información de los objetos UnidadTabla.
 * 
 * La configuración incluye:
 * - Encabezados de columnas con títulos descriptivos
 * - Funciones de acceso (clave) para extraer datos específicos
 * - Orden de presentación de columnas (más simple que la tabla de vehículos)
 * - Array de datos inicialmente vacío
 * 
 * Las unidades de arrastre tienen menos campos que los vehículos principales,
 * enfocándose en identificación básica y ubicación geográfica.
 * 
 * @constant {UnidadTablaConfig} UNIDAD_TABLA_CONFIG
 * 
 * @example
 * ```typescript
 * // Usar la configuración en un componente de tabla
 * const configTablaUnidades = UNIDAD_TABLA_CONFIG;
 * 
 * // Acceder a los encabezados
 * const encabezados = configTablaUnidades.encabezadas;
 * 
 * // Agregar datos a la tabla
 * configTablaUnidades.datos = listaUnidades;
 * ```
 * 
 * @since 1.0.0
 */
export const UNIDAD_TABLA_CONFIG: UnidadTablaConfig = {
  /**
   * Array de configuraciones de encabezados para la tabla de unidades de arrastre.
   * 
   * Cada elemento define una columna de la tabla con:
   * - encabezado: Título que se muestra en la cabecera
   * - clave: Función que extrae el valor del objeto UnidadTabla
   * - orden: Posición de la columna en la tabla
   * 
   * @property {Array<Object>} encabezadas
   */
  encabezadas: [
    {
      /**
       * Columna para el VIN del vehículo de arrastre.
       * 
       * @property {string} encabezado - 'VIN del vehículo'
       * @property {Function} clave - Función que obtiene item.vinVehiculo
       * @property {number} orden - Posición 1 en la tabla
       */
      encabezado: 'VIN del vehículo',
      clave: (item: UnidadTabla) => item.vinVehiculo,
      orden: 1,
    },
    {
      /**
       * Columna para el tipo de unidad de arrastre.
       * 
       * @property {string} encabezado - 'Tipo de unidad de arrastre'
       * @property {Function} clave - Función que obtiene item.tipoDeUnidadArrastre
       * @property {number} orden - Posición 2 en la tabla
       */
      encabezado: 'Tipo de unidad de arrastre',
      clave: (item: UnidadTabla) => item.tipoDeUnidadArrastre,
      orden: 2,
    },
    {
      /**
       * Columna para el número económico de la unidad.
       * 
       * @property {string} encabezado - 'Número económico'
       * @property {Function} clave - Función que obtiene item.numeroEconomico
       * @property {number} orden - Posición 3 en la tabla
       */
      encabezado: 'Número económico',
      clave: (item: UnidadTabla) => item.numeroEconomico,
      orden: 3,
    },
    {
      /**
       * Columna para el número de placas de la unidad.
       * 
       * @property {string} encabezado - 'Número de Placas'
       * @property {Function} clave - Función que obtiene item.numeroPlaca
       * @property {number} orden - Posición 4 en la tabla
       */
      encabezado: 'Número de Placas',
      clave: (item: UnidadTabla) => item.numeroPlaca,
      orden: 4,
    },
    {
      /**
       * Columna para el país emisor de las placas.
       * 
       * @property {string} encabezado - 'País Emisor'
       * @property {Function} clave - Función que obtiene item.paisEmisor
       * @property {number} orden - Posición 5 en la tabla
       */
      encabezado: 'País Emisor',
      clave: (item: UnidadTabla) => item.paisEmisor,
      orden: 5,
    },
    {
      /**
       * Columna para el estado o provincia emisor.
       * 
       * @property {string} encabezado - 'Estado o provincia'
       * @property {Function} clave - Función que obtiene item.estado
       * @property {number} orden - Posición 6 en la tabla
       */
      encabezado: 'Estado o provincia',
      clave: (item: UnidadTabla) => item.estado,
      orden: 6,
    },
  ],
  /**
   * Array de datos de unidades de arrastre para mostrar en la tabla.
   * 
   * Inicialmente vacío, se puebla dinámicamente con objetos UnidadTabla.
   * 
   * @property {Array} datos
   */
  datos: [],
};