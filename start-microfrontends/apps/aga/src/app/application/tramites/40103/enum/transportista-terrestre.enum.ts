/**
 * Constantes y configuraciones utilizadas en el trámite 40103 para la gestión de transportistas terrestres.
 *
 * Este archivo contiene las configuraciones y enumeraciones para la gestión de choferes y vehículos
 * en el sistema de transportistas terrestres. Define textos de interfaz, configuraciones de páginas,
 * configuraciones de tablas para vehículos y unidades de arrastre, y todas las constantes necesarias
 * para el funcionamiento del módulo de transportistas.
 *
 * Las configuraciones incluyen:
 * - Textos y etiquetas para la interfaz de choferes
 * - Configuraciones de páginas para vehículos
 * - Configuraciones de tablas para visualización de datos
 * - Constantes para formularios y validaciones
 *
 * @author Sistema de Gestión de Trámites - Frontend Team
 * @version 1.0.0
 * @since 1.0.0
 * @module TransportistaTerrestreEnum
 */


import {DatosUnidad, DatosVehiculo, UnidadTablaConfig, VehiculoTablaConfig } from "../../40103/models/registro-muestras-mercancias.model";

/**
 * Configuración de textos y constantes para la página de gestión de choferes.
 *
 * Contiene todas las etiquetas, títulos, mensajes y configuraciones necesarias
 * para la interfaz de usuario del módulo de choferes. Incluye textos para
 * formularios, botones, tooltips y configuraciones de pestañas para choferes
 * nacionales y extranjeros.
 *
 * Las propiedades incluyen:
 * - Configuraciones de modal y pestañas activas
 * - Títulos y etiquetas para formularios de choferes
 * - Etiquetas para datos personales y domicilio fiscal
 * - Textos para botones y acciones del usuario
 * - Mensajes informativos y de validación
 *
 * @constant {Object}
 */
export const CHOFERES_PAGE = {
  /**
   * @property {string} MODAL
   * Identificador para el modo modal de la interfaz.
   */
  MODAL: 'modal',

  /**
   * @property {string} ACTIVETAB
   * Pestaña activa por defecto en la interfaz de choferes.
   */
  ACTIVETAB: 'nacional',

  /**
   * @property {string} CHOFERES_EXTRANJEROS
   * Título para la sección de choferes extranjeros.
   */
  CHOFERES_EXTRANJEROS: 'Choferes extranjeros',

  /**
   * @property {string} CHOFERES_NACIONALES
   * Título para la sección de choferes nacionales.
   */
  CHOFERES_NACIONALES: 'Choferes nacionales',

  /**
   * @property {string} SOLICITUD_TITULO_CHOFER_EXTRANJERO
   * Título del formulario para datos del chofer extranjero.
   */
  SOLICITUD_TITULO_CHOFER_EXTRANJERO: 'Datos del chofer extranjero',

  /**
   * @property {string} LABEL_SOLICITUD_PERSONA_NOMBRE
   * Etiqueta para el campo nombre en formularios de persona.
   */
  LABEL_SOLICITUD_PERSONA_NOMBRE: 'Nombre',

  /**
   * @property {string} LABEL_SOLICITUD_PERSONA_PRIMER_APELLIDO
   * Etiqueta para el campo primer apellido en formularios de persona.
   */
  LABEL_SOLICITUD_PERSONA_PRIMER_APELLIDO: 'Primer Apellido ',

  /**
   * @property {string} LABEL_SOLICITUD_PERSONA_SEGUNDO_APELLIDO
   * Etiqueta para el campo segundo apellido en formularios de persona.
   */
  LABEL_SOLICITUD_PERSONA_SEGUNDO_APELLIDO: 'Segundo Apellido',

  /**
   * @property {string} LABEL_NACIONALIDAD
   * Etiqueta para el campo nacionalidad del chofer.
   */
  LABEL_NACIONALIDAD: 'Nacionalidad',

  /**
   * @property {string} LABEL_SOLICITUD_CHOFER_EXT_GAFETE
   * Etiqueta para el número de gafete del chofer extranjero.
   */
  LABEL_SOLICITUD_CHOFER_EXT_GAFETE: 'Numero de gafete del chofer',

  /**
   * @property {string} LABEL_SOLICITUD_CHOFER_EXT_VIGENCIA_GAFETE
   * Etiqueta para la vigencia del gafete del chofer extranjero.
   */
  LABEL_SOLICITUD_CHOFER_EXT_VIGENCIA_GAFETE: 'Vigencia del Gafete',

  /**
   * @property {string} LABEL_SOLICITUD_CHOFER_EXT_NSS
   * Etiqueta para el número de seguro social del chofer extranjero.
   */
  LABEL_SOLICITUD_CHOFER_EXT_NSS: 'Número de Seguro Social (NSS)',

  /**
   * @property {string} LABEL_SOLICITUD_CHOFER_EXT_IDE_FISCAL
   * Etiqueta para el número de identificación fiscal del chofer extranjero.
   */
  LABEL_SOLICITUD_CHOFER_EXT_IDE_FISCAL: 'Número de Identificación Fiscal',

  /**
   * @property {string} TOOL_TIP_IDENTIFICACION_FISCAL
   * Texto de ayuda para el campo de identificación fiscal.
   */
  TOOL_TIP_IDENTIFICACION_FISCAL: 'Número de identificación fiscal en el país de residencia',

  /**
   * @property {string} SOLICITUD_TITULO_DOMICILIO_FISCAL
   * Título para la sección de domicilio fiscal en formularios.
   */
  SOLICITUD_TITULO_DOMICILIO_FISCAL: 'Domicilio Fiscal',

  /**
   * @property {string} LABEL_PAIS
   * Etiqueta para el campo país en formularios de domicilio.
   */
  LABEL_PAIS: 'País',

  /**
   * @property {string} LABEL_SOLICITUD_DOMICILIO_CODIGO_POSTAL
   * Etiqueta para el código postal en formularios de domicilio.
   */
  LABEL_SOLICITUD_DOMICILIO_CODIGO_POSTAL: 'Código Postal',

  /**
   * @property {string} LABEL_ENTIDAD_FEDERATIVA
   * Etiqueta para el campo estado o entidad federativa.
   */
  LABEL_ENTIDAD_FEDERATIVA: 'Estado',

  /**
   * @property {string} LABEL_SOLICITUD_DOMICILIO_CALLE
   * Etiqueta para el campo calle en formularios de domicilio.
   */
  LABEL_SOLICITUD_DOMICILIO_CALLE: 'Calle',

  /**
   * @property {string} LABEL_SOLICITUD_DOMICILIO_NUMERO_EXTERIOR
   * Etiqueta para el número exterior en formularios de domicilio.
   */
  LABEL_SOLICITUD_DOMICILIO_NUMERO_EXTERIOR: 'Número exterior',

  /**
   * @property {string} LABEL_SOLICITUD_DOMICILIO_NUMERO_INTERIOR
   * Etiqueta para el número interior en formularios de domicilio.
   */
  LABEL_SOLICITUD_DOMICILIO_NUMERO_INTERIOR: 'Número interior',

  /**
   * @property {string} LABEL_PAIS_ORIGEN
   * Etiqueta para el país de residencia u origen del chofer.
   */
  LABEL_PAIS_ORIGEN: 'País de residencia',

  /**
   * @property {string} LABEL_SOLICITUD_DOMICILIO_CIUDAD
   * Etiqueta para el campo ciudad en formularios de domicilio.
   */
  LABEL_SOLICITUD_DOMICILIO_CIUDAD: 'Ciudad',

  /**
   * @property {string} LABEL_SOLICITUD_CORREO
   * Etiqueta para el campo correo electrónico en formularios.
   */
  LABEL_SOLICITUD_CORREO: 'Correo electrónico',

  /**
   * @property {string} LABEL_SOLICITUD_TELEFONO
   * Etiqueta para el campo teléfono en formularios.
   */
  LABEL_SOLICITUD_TELEFONO: 'Teléfono',

  /**
   * @property {string} CAMPOS_OBLIGATORIOS
   * Mensaje indicativo para campos obligatorios en formularios.
   */
  CAMPOS_OBLIGATORIOS: '* Campos obligatorios',

  /**
   * @property {string} BOTON_BUSCAR
   * Texto para el botón de búsqueda.
   */
  BOTON_BUSCAR: 'Buscar',

  /**
   * @property {string} BOTON_LIMPIAR
   * Texto para el botón de limpiar formulario.
   */
  BOTON_LIMPIAR: 'Limpiar',

  /**
   * @property {string} BOTON_CANCELAR
   * Texto para el botón de cancelar acción.
   */
  BOTON_CANCELAR: 'Cancelar',

  /**
   * @property {string} BOTON_GUARDAR
   * Texto para el botón de guardar información.
   */
  BOTON_GUARDAR: 'Guardar',

  /**
   * @property {string} SELECCIONA_UNVALOR
   * Texto por defecto para campos de selección sin valor.
   */
  SELECCIONA_UNVALOR: 'Selecciona un valor'
};

/**
 * Configuración de textos y constantes para la página de gestión de vehículos.
 *
 * Contiene todas las etiquetas, títulos y configuraciones necesarias para la
 * interfaz de usuario del módulo de parque vehicular. Incluye textos para
 * formularios de vehículos, etiquetas de campos, textos de selección por defecto
 * y configuraciones de botones.
 *
 * Las propiedades incluyen:
 * - Configuraciones de pestañas para parque vehicular
 * - Etiquetas para campos de datos del vehículo
 * - Textos de selección por defecto para campos dropdown
 * - Etiquetas para información técnica del vehículo
 * - Textos para botones de acción
 *
 * @constant {Object}
 */
export const VEHICULO_PAGE = {
  /**
   * @property {string} SELECTED_TAB
   * Título de la pestaña seleccionada para parque vehicular.
   */
  SELECTED_TAB: 'Parque vehicular',

  /**
   * @property {string} ACTIVE_TAB
   * Identificador de la pestaña activa para parque vehicular.
   */
  ACTIVE_TAB: 'parquevehicular',

  /**
   * @property {string} LABEL_SOLICITUD_VEHICULO_TIPO_VEHICULO
   * Etiqueta para el campo tipo de vehículo en formularios.
   */
  LABEL_SOLICITUD_VEHICULO_TIPO_VEHICULO: 'Tipo de Vehículo',

  /**
   * @property {string} SOLICITUD_TITULO_DATOS_VEHICULO
   * Título para la sección de datos del vehículo.
   */
  SOLICITUD_TITULO_DATOS_VEHICULO: 'Datos del Vehículo',

  /**
   * @property {string} LABEL_SOLICITUD_VEHICULO_VIN
   * Etiqueta para el número de identificación vehicular (VIN).
   */
  LABEL_SOLICITUD_VEHICULO_VIN: 'Número de identificación vehicular',

  /**
   * @property {string} LABEL_PUNTOS
   * Etiqueta para campos de puntos o separadores.
   */
  LABEL_PUNTOS: 'Puntos',

  /**
   * @property {string} NON_SELECTION_TEXT_TIPO_VEHICULO
   * Texto por defecto para selección de tipo de vehículo.
   */
  NON_SELECTION_TEXT_TIPO_VEHICULO: 'Selecciona un valor',

  /**
   * @property {string} NON_SELECTION_TEXT_PAIS_EMISOR
   * Texto por defecto para selección de país emisor.
   */
  NON_SELECTION_TEXT_PAIS_EMISOR: 'Selecciona un valor',

  /**
   * @property {string} NON_SELECTION_TEXT_COLOR_AGA
   * Texto por defecto para selección de color AGA.
   */
  NON_SELECTION_TEXT_COLOR_AGA: 'Selecciona un valor',

  /**
   * @property {string} NON_SELECTION_TEXT_ANIOS
   * Texto por defecto para selección de años.
   */
  NON_SELECTION_TEXT_ANIOS: 'Selecciona un valor',

  /**
   * @property {string} LABEL_SOLICITUD_VEHICULO_ID_DEVEHICULO
   * Etiqueta para el ID de vehículo en formularios.
   */
  LABEL_SOLICITUD_VEHICULO_ID_DEVEHICULO: 'ID de Vehículo',

  /**
   * @property {string} LABEL_SOLICITUD_VEHICULO_NUMEROPLACAS
   * Etiqueta para el número de placas del vehículo.
   */
  LABEL_SOLICITUD_VEHICULO_NUMEROPLACAS: 'Número de Placas',

  /**
   * @property {string} LABEL_SOLICITUD_VEHICULO_PAIS_EMISOR
   * Etiqueta para el país emisor de las placas del vehículo.
   */
  LABEL_SOLICITUD_VEHICULO_PAIS_EMISOR: 'País Emisor',

  /**
   * @property {string} LABEL_SOLICITUD_DOMICILIO_ESTADO
   * Etiqueta para el estado o provincia en datos del vehículo.
   */
  LABEL_SOLICITUD_DOMICILIO_ESTADO: 'Estado o provincia',

  /**
   * @property {string} LABEL_SOLICITUD_VEHICULO_MARCA
   * Etiqueta para la marca del vehículo.
   */
  LABEL_SOLICITUD_VEHICULO_MARCA: 'Marca',

  /**
   * @property {string} LABEL_SOLICITUD_VEHICULO_MODELO
   * Etiqueta para el modelo del vehículo.
   */
  LABEL_SOLICITUD_VEHICULO_MODELO: 'Modelo',

  /**
   * @property {string} LABEL_ANIO_VEH
   * Etiqueta para el año del vehículo.
   */
  LABEL_ANIO_VEH: 'Año',

  /**
   * @property {string} LABEL_SOLICITUD_VEHICULO_TRANSPONDER
   * Etiqueta para el transponder del vehículo.
   */
  LABEL_SOLICITUD_VEHICULO_TRANSPONDER: 'Transponder',

  /**
   * @property {string} LABEL_SOLICITUD_VEHICULO_COLOR
   * Etiqueta para el color del vehículo.
   */
  LABEL_SOLICITUD_VEHICULO_COLOR: 'Color de Vehículo',

  /**
   * @property {string} LABEL_SOLICITUD_VEHICULO_NUMERO_ECONOMICO
   * Etiqueta para el número económico del vehículo.
   */
  LABEL_SOLICITUD_VEHICULO_NUMERO_ECONOMICO: 'Número económico',

  /**
   * @property {string} LABEL_SOLICITUD_VEHICULO_NUMERO_2DAPLACA
   * Etiqueta para el número de segunda placa del vehículo.
   */
  LABEL_SOLICITUD_VEHICULO_NUMERO_2DAPLACA: 'Número 2da Placa',

  /**
   * @property {string} LABEL_SOLICITUD_VEHICULO_EMISOR_2DAPLACA
   * Etiqueta para el estado emisor de la segunda placa.
   */
  LABEL_SOLICITUD_VEHICULO_EMISOR_2DAPLACA: 'Estado emisor de 2da Placa',

  /**
   * @property {string} LABEL_SOLICITUD_VEHICULO_PAIS_EMISOR_2DAPLACA
   * Etiqueta para el país emisor de la segunda placa.
   */
  LABEL_SOLICITUD_VEHICULO_PAIS_EMISOR_2DAPLACA: 'País Emisor 2da Placa',

  /**
   * @property {string} LABEL_DESCRIPCION_VEHICULO
   * Etiqueta para la descripción del vehículo.
   */
  LABEL_DESCRIPCION_VEHICULO: 'Descripción del vehículo',

  /**
   * @property {string} BOTON_LIMPIAR
   * Texto para el botón de limpiar formulario.
   */
  BOTON_LIMPIAR: 'Limpiar',

  /**
   * @property {string} BOTON_CANCELAR
   * Texto para el botón de cancelar acción.
   */
  BOTON_CANCELAR: 'Cancelar',

  /**
   * @property {string} BOTON_GUARDAR
   * Texto para el botón de guardar información.
   */
  BOTON_GUARDAR: 'Guardar'
};


/**
 * Configuración de la tabla para visualización de vehículos.
 *
 * Define la estructura y configuración de encabezados para la tabla que muestra
 * la información de vehículos en el sistema. Cada encabezado especifica el texto
 * a mostrar, la función para obtener el valor correspondiente del objeto vehículo,
 * y el orden de visualización en la tabla.
 *
 * La configuración incluye:
 * - Encabezados para todos los campos de información del vehículo
 * - Funciones de mapeo para extraer valores de objetos VehiculoTabla
 * - Orden de columnas para la visualización
 * - Array de datos inicialmente vacío para ser poblado dinámicamente
 *
 * @constant {VehiculoTablaConfig}
 */
export const VEHICULOS_TABLA_CONFIG: VehiculoTablaConfig = {
  /**
   * @property {Array} encabezadas
   * Array de configuraciones de encabezados para la tabla de vehículos.
   * Cada elemento define el texto del encabezado, la función para obtener el valor,
   * y el orden de la columna en la tabla.
   */
  encabezadas: [
    /**
     * Configuración para la columna de número de identificación vehicular.
     * @property {Object} - Configuración del encabezado VIN
     * @property {string} encabezado - Texto del encabezado de la columna
     * @property {Function} clave - Función que extrae el número del item
     * @property {number} orden - Posición de la columna en la tabla
     */
    {
      encabezado: 'Número de identificación vehicular',
      clave: (item: DatosVehiculo) => item.numero,
      orden: 1,
    },
    /**
     * Configuración para la columna de tipo de vehículo.
     */
    {
      encabezado: 'Tipo de vehículo',
      clave: (item: DatosVehiculo) => item.tipoDeVehiculo,
      orden: 2,
    },
    /**
     * Configuración para la columna de Número económico.
     */
    {
      encabezado: 'Número económico',
      clave: (item: DatosVehiculo) => item.numeroEconomico,
      orden: 3,
    },
    /**
     * Configuración para la columna de Transpondedor.
     */
    {
      encabezado: 'Transpondedor',
      clave: (item: DatosVehiculo) => item.transponder,
      orden: 4,
    },
    /**
     * Configuración para la columna de Número de placas.
     */
    {
      encabezado: 'Número de Placas',
      clave: (item: DatosVehiculo) => item.numeroPlaca,
      orden: 5,
    },
    /**
     * Configuración para la columna de País emisor.
     */
    {
      encabezado: 'Emisora País ',
      clave: (item: DatosVehiculo) => item.paisEmisor,
      orden: 6,
    },
    /**
     * Configuración para la columna de Estado o provincia.
     */
    {
      encabezado: 'Estado o provincia',
      clave: (item: DatosVehiculo) => item.estado,
      orden: 7,
    },
    /**
     * Configuración para la columna de Marca.
     */
    {
      encabezado: 'Marca',
      clave: (item: DatosVehiculo) => item.marca,
      orden: 8,
    },
    /**
     * Configuración para la columna de Modelo.
     */
    {
      encabezado: 'Modelo',
      clave: (item: DatosVehiculo) => item.modelo,
      orden: 9,
    },
    /**
     * Configuración para la columna de Año.
     */
    {
      encabezado: 'Año',
      clave: (item: DatosVehiculo) => item.ano,
      orden: 10,
    },
  ],
  /**
   * @property {Array} datos
   * Array de datos de vehículos para ser mostrados en la tabla.
   * Inicializado vacío y poblado dinámicamente según las necesidades del sistema.
   */
  datos: [],
};

/**
 * Configuración de la tabla para visualización de unidades de arrastre.
 *
 * Define la estructura y configuración de encabezados para la tabla que muestra
 * la información de unidades de arrastre en el sistema. Cada encabezado especifica
 * el texto a mostrar, la función para obtener el valor correspondiente del objeto
 * unidad, y el orden de visualización en la tabla.
 *
 * La configuración incluye:
 * - Encabezados para los campos principales de la unidad de arrastre
 * - Funciones de mapeo para extraer valores de objetos UnidadTabla
 * - Orden de columnas optimizado para la visualización
 * - Array de datos inicialmente vacío para ser poblado dinámicamente
 *
 * @constant {UnidadTablaConfig}
 */
export const UNIDAD_TABLA_CONFIG: UnidadTablaConfig = {
  /**
   * @property {Array} encabezadas
   * Array de configuraciones de encabezados para la tabla de unidades de arrastre.
   * Cada elemento define el texto del encabezado, la función para obtener el valor,
   * y el orden de la columna en la tabla.
   */
  encabezadas: [
    /**
     * Configuración para la columna de VIN del vehículo.
     * @property {Object} - Configuración del encabezado VIN de unidad
     * @property {string} encabezado - Texto del encabezado de la columna
     * @property {Function} clave - Función que extrae el VIN del item
     * @property {number} orden - Posición de la columna en la tabla
     */

    {
      encabezado: 'VIN del vehículo',
      clave: (item: DatosUnidad) => item.vinVehiculo,
      orden: 2,
    },
    /**
     * Configuración para la columna de tipo de unidad de arrastre.
     */
    {
      encabezado: 'Tipo de unidad de arrastre',
      clave: (item: DatosUnidad) => item.tipoDeUnidadArrastre,
      orden: 3,
    },
    /**
     * Configuración para la columna de número económico.
     */
    {
      encabezado: 'Número económico',
      clave: (item: DatosUnidad) => item.numeroEconomico,
      orden: 4,
    },
    /**
     * Configuración para la columna de número de placas.
     */
    {
      encabezado: 'Número de placas',
      clave: (item: DatosUnidad) => item.numeroPlaca,
      orden: 5,
    },
    /**
     * Configuración para la columna de país emisor.
     */
    {
      encabezado: 'Emisora País',
      clave: (item: DatosUnidad) => item.paisEmisor,
      orden: 5,
    },
    /**
     * Configuración para la columna de estado o provincia.
     */
    {
      encabezado: 'Estado o provincia',
      clave: (item: DatosUnidad) => item.estado,
      orden: 6,
    },
  ],
  /**
   * @property {Array} datos
   * Array de datos de unidades de arrastre para ser mostrados en la tabla.
   * Inicializado vacío y poblado dinámicamente según las necesidades del sistema.
   */
  datos: [],
};