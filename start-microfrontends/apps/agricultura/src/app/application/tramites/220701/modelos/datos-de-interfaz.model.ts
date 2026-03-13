/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/naming-convention */

/**
 * Modelos de datos e interfaces utilizadas en el trámite 220701 de agricultura para la gestión de solicitudes, 
 * pagos, mercancías y configuración de servicios.
 *
 * Este archivo contiene todas las interfaces TypeScript y constantes necesarias para manejar los datos
 * del formulario de solicitud, datos generales, pagos de derechos, información de mercancías, exportadores,
 * destinatarios, medios de transporte y consultas de solicitantes del trámite agricultural 220701.
 *
 * @fileoverview Definiciones de tipos e interfaces para el trámite 220701
 * @author Sistema VUCEM 3.0
 * @version 1.0.0
 */

/**
 * Interfaz para el formulario de Datos de la solicitud del trámite 220701.
 *
 * Define la estructura de datos necesaria para capturar la información inicial
 * de la solicitud, incluyendo justificación, certificados, fechas de inspección,
 * datos del inspector, contenedores y transporte.
 *
 * @interface DatosDeLaSolicitudInt
 */
export interface DatosDeLaSolicitudInt {
  /**
   * Justificación de la solicitud del trámite.
   *
   * @property {string} justificacion
   * Campo requerido que contiene la explicación o motivo de la solicitud.
   */
  justificacion: string;

  /**
   * Certificados autorizados para el proceso.
   *
   * @property {string} certificadosAutorizados
   * Lista o identificación de los certificados válidos para el trámite.
   */
  certificadosAutorizados: string;

  /**
   * Fecha de inicio del trámite.
   *
   * @property {string} fechaInicio
   * Fecha en formato string cuando inicia el proceso del trámite.
   */
  fechaInicio: string;

  /**
   * Hora programada para la inspección.
   *
   * @property {string} horaDeInspeccion
   * Hora específica asignada para realizar la inspección.
   */
  horaDeInspeccion: string;

  /**
   * Aduana de ingreso seleccionada.
   *
   * @property {string} aduanaDeIngreso
   * Identificación de la aduana por donde ingresará la mercancía.
   */
  aduanaDeIngreso: string;

  /**
   * Oficina de sanidad agropecuaria correspondiente.
   *
   * @property {string} sanidadAgropecuaria
   * Oficina responsable de la sanidad de productos agropecuarios.
   */
  sanidadAgropecuaria: string;

  /**
   * Punto específico de inspección.
   *
   * @property {string} puntoDeInspeccion
   * Ubicación exacta donde se realizará la inspección.
   */
  puntoDeInspeccion: string;

  /**
   * Nombre del inspector asignado.
   *
   * @property {string} nombreInspector
   * Nombre de pila del funcionario que realizará la inspección.
   */
  nombreInspector: string;

  /**
   * Primer apellido del inspector.
   *
   * @property {string} primerApellido
   * Apellido paterno del inspector asignado.
   */
  primerApellido: string;

  /**
   * Segundo apellido del inspector.
   *
   * @property {string} segundoApellido
   * Apellido materno del inspector asignado.
   */
  segundoApellido: string;

  /**
   * Cantidad de contenedores a inspeccionar.
   *
   * @property {string} cantidadContenedores
   * Número total de contenedores que serán objeto de inspección.
   */
  cantidadContenedores: string;

  /**
   * Tipo de contenedor utilizado.
   *
   * @property {string} tipoContenedor
   * Especificación del tipo de contenedor (refrigerado, seco, etc.).
   */
  tipoContenedor: string;

  /**
   * Medio de transporte empleado.
   *
   * @property {string} medioDeTransporte
   * Tipo de vehículo o medio utilizado para el transporte.
   */
  medioDeTransporte: string;

  /**
   * Identificación del medio de transporte.
   *
   * @property {string} identificacionTransporte
   * Número de placas, matrícula o identificador único del transporte.
   */
  identificacionTransporte: string;

  /**
   * Indica si es una solicitud de ferrocarriles.
   *
   * @property {string} esSolicitudFerros
   * Bandera que determina si el transporte es por vía férrea.
   */
  esSolicitudFerros: string;
}

/**
 * Interfaz para el formulario de Datos Generales internos del trámite.
 *
 * Contiene información detallada sobre el control del trámite, incluyendo folios,
 * oficinas de inspección, datos del veterinario, régimen aduanero, y detalles
 * específicos sobre animales vivos y movilización nacional.
 *
 * @interface InternaDatosGeneralesInt
 */
export interface InternaDatosGeneralesInt {
  /**
   * Folio del control único del trámite.
   *
   * @property {number} folioControlUnico
   * Número identificador único asignado al control del trámite.
   */
  folioControlUnico: number;

  /**
   * Aduana de ingreso seleccionada.
   *
   * @property {string} aduanaIngreso
   * Identificación de la aduana por donde ingresa la mercancía.
   */
  aduanaIngreso: string;

  /**
   * Oficina de inspección asignada.
   *
   * @property {string} oficinaInspeccion
   * Oficina responsable de realizar las inspecciones correspondientes.
   */
  oficinaInspeccion: string;

  /**
   * Punto específico de inspección.
   *
   * @property {string} puntoInspeccion
   * Ubicación exacta donde se llevará a cabo la inspección.
   */
  puntoInspeccion: string;

  /**
   * Clave del control único asignado.
   *
   * @property {string} claveControlUnico
   * Código alfanumérico único para identificar el control.
   */
  claveControlUnico: string;

  /**
   * Establecimiento TIF (Tipo Inspección Federal) asociado.
   *
   * @property {string} establecimientoTIFs
   * Identificación del establecimiento con certificación TIF.
   */
  establecimientoTIFs: string;

  /**
   * Nombre del veterinario responsable.
   *
   * @property {string} nombreVeterinario
   * Nombre completo del médico veterinario a cargo de la inspección.
   */
  nombreVeterinario: string;

  /**
   * Número de guía del transporte.
   *
   * @property {string} numeroGuia
   * Número de la guía o documento de transporte de la mercancía.
   */
  numeroGuia: string;

  /**
   * Régimen aduanero aplicable.
   *
   * @property {string} regimen
   * Tipo de régimen aduanero bajo el cual se clasifica la operación.
   */
  regimen: string;

  /**
   * Información de captura de mercancía.
   *
   * @property {string} capturaMercancia
   * Datos relacionados con el registro de la mercancía en el sistema.
   */
  capturaMercancia: string;

  /**
   * Indicador de si se trata de animales vivos.
   *
   * @property {string} animalesVivos
   * Bandera que indica si la mercancía incluye animales vivos.
   */
  animalesVivos: string;

  /**
   * Coordenadas geográficas del punto de inspección.
   *
   * @property {string} coordenadas
   * Ubicación geográfica exacta del punto de inspección.
   */
  coordenadas: string;

  /**
   * Información sobre movilización nacional.
   *
   * @property {string} movilizacionNacional
   * Datos relacionados con el movimiento de mercancía a nivel nacional.
   */
  movilizacionNacional: string;

  /**
   * Identificación del medio de transporte.
   *
   * @property {string} identTransporte
   * Identificador único del vehículo o medio de transporte.
   */
  identTransporte: string;

  /**
   * Punto de verificación establecido.
   *
   * @property {string} puntoVerificacion
   * Ubicación designada para realizar verificaciones adicionales.
   */
  puntoVerificacion: string;

  /**
   * Nombre de la empresa transportista.
   *
   * @property {string} empresaTransportista
   * Razón social de la empresa encargada del transporte.
   */
  empresaTransportista: string;
  /**
   * Tipo de mercancía involucrada en el trámite.
   *
   * @property {string} tipoMercancia
   * Clasificación o categoría de la mercancía que se está movilizando.
   */

  tipoMercancia: string;
}

/**
 * Interfaz para el formulario de Pago de derechos (Revisión Documental).
 *
 * Define la estructura de datos necesaria para gestionar los pagos de derechos
 * del trámite, incluyendo exenciones, referencias de pago, información bancaria
 * y detalles de facturación.
 *
 * @interface FormularioPagoInt
 */
export interface FormularioPagoInt {
  /**
   * Indica si el trámite está exento de pago.
   *
   * @property {string} exentoPago
   * Bandera que determina si aplica exención de pago de derechos.
   */
  exentoPago: string;

  /**
   * Justificación para la exención de pago.
   *
   * @property {string} justificacion
   * Motivo o explicación legal para la exención de pago.
   */
  justificacion: string;

  /**
   * Clave de referencia del pago.
   *
   * @property {string} claveReferencia
   * Código único de identificación de la transacción de pago.
   */
  claveReferencia: string;

  /**
   * Cadena de dependencia del pago.
   *
   * @property {string} cadenaDependencia
   * Secuencia de dependencias relacionadas con el pago.
   */
  cadenaDependencia: string;

  /**
   * Banco donde se realizó el pago.
   *
   * @property {string} banco
   * Institución bancaria utilizada para realizar el pago.
   */
  banco: string;

  /**
   * Llave o número de confirmación del pago.
   *
   * @property {string} llavePago
   * Código de confirmación proporcionado por el banco.
   */
  llavePago: string;

  /**
   * Fecha de emisión de la factura.
   *
   * @property {string} fechaFactura
   * Fecha en que se emitió la factura correspondiente al pago.
   */
  fechaFactura: string;

  /**
   * Importe total del pago realizado.
   *
   * @property {string} importePago
   * Monto económico pagado por los derechos del trámite.
   */
  importePago: string;
}

/**
 * Interfaz para el formulario de Pago de derechos completo.
 *
 * Gestiona tanto el pago principal como el pago de revisión del trámite,
 * incluyendo todas las referencias bancarias, importes y fechas asociadas
 * a ambos tipos de pago, así como la gestión de exenciones.
 *
 * @interface PagosDeDerechosFormInt
 */
export interface PagosDeDerechosFormInt {
  /**
   * Clave de referencia del pago principal.
   *
   * @property {string} claveDeReferencia
   * Código único de identificación del pago principal del trámite.
   */
  claveDeReferencia: string;

  /**
   * Cadena de dependencia del pago principal.
   *
   * @property {string} cadenaDependencia
   * Secuencia de dependencias del pago principal.
   */
  cadenaDependencia: string;

  /**
   * Banco del pago principal.
   *
   * @property {string} banco
   * Institución bancaria donde se realizó el pago principal.
   */
  banco: string;

  /**
   * Llave de pago principal.
   *
   * @property {string} llaveDePago
   * Código de confirmación del pago principal.
   */
  llaveDePago: string;

  /**
   * Fecha de inicio del pago principal.
   *
   * @property {string} fechaInicio
   * Fecha en que se inició el proceso de pago principal.
   */
  fechaInicio: string;

  /**
   * Importe del pago principal.
   *
   * @property {string} importeDePago
   * Monto económico del pago principal del trámite.
   */
  importeDePago: string;

  /**
   * Clave de referencia para la revisión.
   *
   * @property {string} claveDeReferenciaRevision
   * Código único para el pago de la revisión documental.
   */
  claveDeReferenciaRevision: string;

  /**
   * Banco para el pago de revisión.
   *
   * @property {string} bancoRevision
   * Institución bancaria para el pago de revisión.
   */
  bancoRevision: string;

  /**
   * Llave de pago para la revisión.
   *
   * @property {string} llaveDePagoRevision
   * Código de confirmación del pago de revisión.
   */
  llaveDePagoRevision: string;

  /**
   * Fecha de inicio del pago de revisión.
   *
   * @property {string} fechaInicioRevision
   * Fecha de inicio del proceso de pago de revisión.
   */
  fechaInicioRevision: string;

  /**
   * Importe del pago de revisión.
   *
   * @property {string} importeDePagoRevision
   * Monto económico del pago de revisión documental.
   */
  importeDePagoRevision: string;
  /**
   * Indica si está exento del pago de revisión.
   *
   * @property {string} exentoPagoRevision
   * Bandera que determina si el trámite está exento del pago de revisión.
   */

  exentoPagoRevision: string;

  /**
   * Indica si está exento de pago.
   *
   * @property {string} exentoPago
   * Bandera que determina si el trámite está exento de pagos.
   */
  exentoPago: string;
}

/**
 * Interfaz para los datos de la mercancía del trámite.
 *
 * Define la estructura de información específica de cada mercancía,
 * incluyendo partidas, requisitos, certificados, fracciones arancelarias
 * y códigos de nomenclatura comercial internacional.
 *
 * @interface Mercancia
 */
export interface Mercancia {
  /**
   * Número de partida de la mercancía.
   *
   * @property {string} Partida
   * Identificador numérico de la partida comercial.
   */
  Partida: string;

  /**
   * Tipo de requisito aplicable.
   *
   * @property {string} Tiporequisito
   * Clasificación del tipo de requisito que debe cumplir la mercancía.
   */
  Tiporequisito: string;

  /**
   * Requisito específico que debe cumplir.
   *
   * @property {string} Requisito
   * Descripción detallada del requisito aplicable a la mercancía.
   */
  Requisito: string;

  /**
   * Número del certificado asociado.
   *
   * @property {number} Certificado
   * Identificador numérico del certificado requerido.
   */
  Certificado: number;

  /**
   * Fracción arancelaria de la mercancía.
   *
   * @property {string} Fraccion
   * Código de clasificación arancelaria oficial.
   */
  Fraccion: string;

  /**
   * Descripción detallada de la mercancía.
   *
   * @property {string} Descripcion
   * Descripción completa y específica del producto.
   */
  Descripcion: string;

  /**
   * Código NICO (Nomenclatura de Identificación Comercial).
   *
   * @property {string} Nico
   * Código de nomenclatura comercial internacional.
   */
  Nico: string;
}

/**
 * Configuración de las columnas de la tabla para el servicio MERCANCIA.
 *
 * Define la estructura de columnas que se mostrarán en la tabla de mercancías,
 * incluyendo encabezados, funciones de acceso a datos y orden de presentación.
 * Cada objeto del array representa una columna con sus propiedades específicas.
 *
 * @constant {Array<Object>} MERCANCIA_SERVICIO
 */
export const MERCANCIA_SERVICIO = [
  {
    /**
     * Encabezado de la columna para número de partida.
     *
     * @property {string} encabezado
     * Texto que se muestra en el encabezado de la columna.
     */
    encabezado: 'No. pardita',

    /**
     * Función para obtener el valor de la primera columna.
     *
     * @property {Function} clave
     * Función que extrae el valor de TABLA_Columna_1 del elemento.
     */
    clave: (ele: mercanciaInfo) => ele.TABLA_Columna_1,

    /**
     * Orden de la columna en la tabla.
     *
     * @property {number} orden
     * Posición numérica de la columna en la tabla.
     */
    orden: 1
  },
  {
    /**
     * Encabezado de la columna para tipo de requisito.
     *
     * @property {string} encabezado
     */
    encabezado: 'Tipo de requisito',

    /**
     * Función para obtener el valor de la segunda columna.
     *
     * @property {Function} clave
     */
    clave: (ele: mercanciaInfo) => ele.TABLA_Columna_2,

    /**
     * Orden de la columna en la tabla.
     *
     * @property {number} orden
     */
    orden: 2
  },
  {
    /**
     * Encabezado de la columna para requisito.
     *
     * @property {string} encabezado
     */
    encabezado: 'Requisito',

    /**
     * Función para obtener el valor de la tercera columna.
     *
     * @property {Function} clave
     */
    clave: (ele: mercanciaInfo) => ele.TABLA_Columna_3,

    /**
     * Orden de la columna en la tabla.
     *
     * @property {number} orden
     */
    orden: 3
  },
  {
    /**
     * Encabezado de la columna para número de certificado internacional.
     *
     * @property {string} encabezado
     */
    encabezado: 'Número Certificado Internacional',

    /**
     * Función para obtener el valor de la cuarta columna.
     *
     * @property {Function} clave
     */
    clave: (ele: mercanciaInfo) => ele.TABLA_Columna_4,

    /**
     * Orden de la columna en la tabla.
     *
     * @property {number} orden
     */
    orden: 4
  },
  {
    /**
     * Encabezado de la columna para fracción arancelaria.
     *
     * @property {string} encabezado
     */
    encabezado: 'Fracción arancelaria',

    /**
     * Función para obtener el valor de la quinta columna.
     *
     * @property {Function} clave
     */
    clave: (ele: mercanciaInfo) => ele.TABLA_Columna_5,

    /**
     * Orden de la columna en la tabla.
     *
     * @property {number} orden
     */
    orden: 5
  },
  {
    /**
     * Encabezado de la columna para descripción de la fracción.
     *
     * @property {string} encabezado
     */
    encabezado: 'Descripción de la fracción',

    /**
     * Función para obtener el valor de la sexta columna.
     *
     * @property {Function} clave
     */
    clave: (ele: mercanciaInfo) => ele.TABLA_Columna_6,

    /**
     * Orden de la columna en la tabla.
     *
     * @property {number} orden
     */
    orden: 6
  },
  {
    /**
     * Encabezado de la columna para código NICO.
     *
     * @property {string} encabezado
     */
    encabezado: 'Nico',

    /**
     * Función para obtener el valor de la séptima columna.
     *
     * @property {Function} clave
     */
    clave: (ele: mercanciaInfo) => ele.TABLA_Columna_7,

    /**
     * Orden de la columna en la tabla.
     *
     * @property {number} orden
     */
    orden: 7
  },
]

/**
 * Interfaz para la información de MERCANCIA en formato de tabla.
 *
 * Define la estructura de datos para representar información de mercancías
 * en formato tabular, donde cada columna contiene datos específicos sobre
 * partidas, requisitos, certificados y clasificaciones arancelarias.
 *
 * @interface mercanciaInfo
 */
export interface mercanciaInfo {
  /**
   * Primera columna de la tabla - Número de partida.
   *
   * @property {string} TABLA_Columna_1
   * Número identificador de la partida de mercancía.
   */
  TABLA_Columna_1: string;

  /**
   * Segunda columna de la tabla - Tipo de requisito.
   *
   * @property {string} TABLA_Columna_2
   * Clasificación del tipo de requisito aplicable.
   */
  TABLA_Columna_2: string;

  /**
   * Tercera columna de la tabla - Requisito.
   *
   * @property {string} TABLA_Columna_3
   * Descripción específica del requisito a cumplir.
   */
  TABLA_Columna_3: string;

  /**
   * Cuarta columna de la tabla - Número de certificado internacional.
   *
   * @property {string} TABLA_Columna_4
   * Identificador del certificado internacional requerido.
   */
  TABLA_Columna_4: string;

  /**
   * Quinta columna de la tabla - Fracción arancelaria.
   *
   * @property {string} TABLA_Columna_5
   * Código de clasificación arancelaria oficial.
   */
  TABLA_Columna_5: string;

  /**
   * Sexta columna de la tabla - Descripción de la fracción.
   *
   * @property {string} TABLA_Columna_6
   * Descripción detallada de la fracción arancelaria.
   */
  TABLA_Columna_6: string;

  /**
   * Séptima columna de la tabla - Código NICO.
   *
   * @property {string} TABLA_Columna_7
   * Código de nomenclatura de identificación comercial.
   */
  TABLA_Columna_7: string;

  /**
   * Estado activo/inactivo del registro.
   *
   * @property {boolean} estatus
   * Bandera que indica si el registro está activo o inactivo.
   */
  estatus: boolean;
}

/**
 * Configuración de las columnas de la tabla para el servicio EXPORTADOR.
 *
 * Define la estructura de columnas para mostrar información de exportadores,
 * incluyendo datos de contacto, identificación y ubicación geográfica.
 * Cada elemento del array representa una configuración de columna específica.
 *
 * @constant {Array<Object>} EXPORTADOR_SERVICIO
 */
export const EXPORTADOR_SERVICIO = [
  {
    /**
     * Encabezado para el nombre o razón social del exportador.
     *
     * @property {string} encabezado
     * Texto mostrado en el encabezado de la columna.
     */
    encabezado: 'Nombre/denominacaió o razón social',

    /**
     * Función para obtener el nombre del exportador.
     *
     * @property {Function} clave
     * Función que extrae el valor de TABLA_Columna_1.
     */
    clave: (ele: exportadorInfo) => ele.TABLA_Columna_1,

    /**
     * Orden de la columna en la tabla.
     *
     * @property {number} orden
     * Posición numérica de la columna.
     */
    orden: 1
  },
  {
    /**
     * Encabezado para el teléfono del exportador.
     *
     * @property {string} encabezado
     */
    encabezado: 'Teléfono',

    /**
     * Función para obtener el teléfono del exportador.
     *
     * @property {Function} clave
     */
    clave: (ele: exportadorInfo) => ele.TABLA_Columna_2,

    /**
     * Orden de la columna en la tabla.
     *
     * @property {number} orden
     */
    orden: 2
  },
  {
    /**
     * Encabezado para el correo electrónico del exportador.
     *
     * @property {string} encabezado
     */
    encabezado: 'Correo electrónico',

    /**
     * Función para obtener el correo del exportador.
     *
     * @property {Function} clave
     */
    clave: (ele: exportadorInfo) => ele.TABLA_Columna_3,

    /**
     * Orden de la columna en la tabla.
     *
     * @property {number} orden
     */
    orden: 3
  },
  {
    /**
     * Encabezado para el domicilio del exportador.
     *
     * @property {string} encabezado
     */
    encabezado: 'Domicilio',

    /**
     * Función para obtener el domicilio del exportador.
     *
     * @property {Function} clave
     */
    clave: (ele: exportadorInfo) => ele.TABLA_Columna_4,

    /**
     * Orden de la columna en la tabla.
     *
     * @property {number} orden
     */
    orden: 4
  },
  {
    /**
     * Encabezado para el país del exportador.
     *
     * @property {string} encabezado
     */
    encabezado: 'País',

    /**
     * Función para obtener el país del exportador.
     *
     * @property {Function} clave
     */
    clave: (ele: exportadorInfo) => ele.TABLA_Columna_5,

    /**
     * Orden de la columna en la tabla.
     *
     * @property {number} orden
     */
    orden: 5
  }
]

/**
 * Interfaz para la información del EXPORTADOR en formato de tabla.
 *
 * Define la estructura de datos para representar información de exportadores
 * incluyendo identificación, datos de contacto y ubicación geográfica
 * en un formato tabular estructurado.
 *
 * @interface exportadorInfo
 */
export interface exportadorInfo {
  /**
   * Nombre, denominación o razón social del exportador.
   *
   * @property {string} TABLA_Columna_1
   * Identificación oficial del exportador o empresa exportadora.
   */
  TABLA_Columna_1: string;

  /**
   * Número de teléfono del exportador.
   *
   * @property {string} TABLA_Columna_2
   * Número telefónico de contacto del exportador.
   */
  TABLA_Columna_2: string;

  /**
   * Correo electrónico del exportador.
   *
   * @property {string} TABLA_Columna_3
   * Dirección de email para comunicación con el exportador.
   */
  TABLA_Columna_3: string;

  /**
   * Domicilio completo del exportador.
   *
   * @property {string} TABLA_Columna_4
   * Dirección física completa del exportador.
   */
  TABLA_Columna_4: string;

  /**
   * País del exportador.
   *
   * @property {string} TABLA_Columna_5
   * País de origen o residencia del exportador.
   */
  TABLA_Columna_5: string;

  /**
   * Estado activo/inactivo del registro.
   *
   * @property {boolean} estatus
   * Bandera que indica si el registro está activo.
   */
  estatus: boolean;
}

/**
 * Configuración de las columnas de la tabla para el servicio DESTINO.
 *
 * Define la estructura completa de columnas para mostrar información detallada
 * de destinatarios, incluyendo datos personales, información de contacto
 * y dirección completa con todos sus componentes geográficos.
 *
 * @constant {Array<Object>} DESTINO_SERVICIO
 */
export const DESTINO_SERVICIO = [
  {
    /**
     * Encabezado para el nombre o razón social del destinatario.
     *
     * @property {string} encabezado
     */
    encabezado: 'Nombre/denominacaió o razón social',

    /**
     * Función para obtener el nombre del destinatario.
     *
     * @property {Function} clave
     */
    clave: (ele: destinoInfo) => ele.TABLA_Columna_1,

    /**
     * Orden de la columna en la tabla.
     *
     * @property {number} orden
     */
    orden: 1
  },
  {
    /**
     * Encabezado para el teléfono del destinatario.
     *
     * @property {string} encabezado
     */
    encabezado: 'Teléfono',

    /**
     * Función para obtener el teléfono del destinatario.
     *
     * @property {Function} clave
     */
    clave: (ele: destinoInfo) => ele.TABLA_Columna_2,

    /**
     * Orden de la columna en la tabla.
     *
     * @property {number} orden
     */
    orden: 2
  },
  {
    /**
     * Encabezado para el correo electrónico del destinatario.
     *
     * @property {string} encabezado
     */
    encabezado: 'Correo electrónico',

    /**
     * Función para obtener el correo del destinatario.
     *
     * @property {Function} clave
     */
    clave: (ele: destinoInfo) => ele.TABLA_Columna_3,

    /**
     * Orden de la columna en la tabla.
     *
     * @property {number} orden
     */
    orden: 3
  },
  {
    /**
     * Encabezado para la calle del destinatario.
     *
     * @property {string} encabezado
     */
    encabezado: 'Calle',

    /**
     * Función para obtener la calle del destinatario.
     *
     * @property {Function} clave
     */
    clave: (ele: destinoInfo) => ele.TABLA_Columna_4,

    /**
     * Orden de la columna en la tabla.
     *
     * @property {number} orden
     */
    orden: 4
  },
  {
    /**
     * Encabezado para el número exterior del destinatario.
     *
     * @property {string} encabezado
     */
    encabezado: 'Número extrior',

    /**
     * Función para obtener el número exterior del destinatario.
     *
     * @property {Function} clave
     */
    clave: (ele: destinoInfo) => ele.TABLA_Columna_5,

    /**
     * Orden de la columna en la tabla.
     *
     * @property {number} orden
     */
    orden: 5
  },
  {
    /**
     * Encabezado para el número interior del destinatario.
     *
     * @property {string} encabezado
     */
    encabezado: 'Número interior',

    /**
     * Función para obtener el número interior del destinatario.
     *
     * @property {Function} clave
     */
    clave: (ele: destinoInfo) => ele.TABLA_Columna_6,

    /**
     * Orden de la columna en la tabla.
     *
     * @property {number} orden
     */
    orden: 6
  },
  {
    /**
     * Encabezado para el país del destinatario.
     *
     * @property {string} encabezado
     */
    encabezado: 'País',

    /**
     * Función para obtener el país del destinatario.
     *
     * @property {Function} clave
     */
    clave: (ele: destinoInfo) => ele.TABLA_Columna_7,

    /**
     * Orden de la columna en la tabla.
     *
     * @property {number} orden
     */
    orden: 7
  }
  ,
  {
    /**
     * Encabezado para la colonia del destinatario.
     *
     * @property {string} encabezado
     */
    encabezado: 'Colonia',

    /**
     * Función para obtener la colonia del destinatario.
     *
     * @property {Function} clave
     */
    clave: (ele: destinoInfo) => ele.TABLA_Columna_8,

    /**
     * Orden de la columna en la tabla.
     *
     * @property {number} orden
     */
    orden: 8
  }
  ,
  {
    /**
     * Encabezado para el municipio o alcaldía del destinatario.
     *
     * @property {string} encabezado
     */
    encabezado: 'Mucinipio o alcaldía',

    /**
     * Función para obtener el municipio del destinatario.
     *
     * @property {Function} clave
     */
    clave: (ele: destinoInfo) => ele.TABLA_Columna_9,

    /**
     * Orden de la columna en la tabla.
     *
     * @property {number} orden
     */
    orden: 9
  }
  ,
  {
    /**
     * Encabezado para la entidad federativa del destinatario.
     *
     * @property {string} encabezado
     */
    encabezado: 'Entidad federativa',

    /**
     * Función para obtener la entidad federativa del destinatario.
     *
     * @property {Function} clave
     */
    clave: (ele: destinoInfo) => ele.TABLA_Columna_10,

    /**
     * Orden de la columna en la tabla.
     *
     * @property {number} orden
     */
    orden: 10
  }
  ,
  {
    /**
     * Encabezado para el código postal del destinatario.
     *
     * @property {string} encabezado
     */
    encabezado: 'Código postal',

    /**
     * Función para obtener el código postal del destinatario.
     *
     * @property {Function} clave
     */
    clave: (ele: destinoInfo) => ele.TABLA_Columna_11,

    /**
     * Orden de la columna en la tabla.
     *
     * @property {number} orden
     */
    orden: 11
  }
]

/**
 * Interfaz para la información de Destino en formato de tabla.
 *
 * Define la estructura completa de datos para representar información detallada
 * de destinatarios, incluyendo identificación, contacto y dirección completa
 * con todos los componentes geográficos mexicanos.
 *
 * @interface destinoInfo
 */
export interface destinoInfo {
  /**
   * Nombre, denominación o razón social del destinatario.
   *
   * @property {string} TABLA_Columna_1
   * Identificación oficial del destinatario o empresa destinataria.
   */
  TABLA_Columna_1: string;

  /**
   * Número de teléfono del destinatario.
   *
   * @property {string} TABLA_Columna_2
   * Número telefónico de contacto del destinatario.
   */
  TABLA_Columna_2: string;

  /**
   * Correo electrónico del destinatario.
   *
   * @property {string} TABLA_Columna_3
   * Dirección de email para comunicación con el destinatario.
   */
  TABLA_Columna_3: string;

  /**
   * Calle del domicilio del destinatario.
   *
   * @property {string} TABLA_Columna_4
   * Nombre de la calle donde se ubica el destinatario.
   */
  TABLA_Columna_4: string;

  /**
   * Número exterior del domicilio.
   *
   * @property {string} TABLA_Columna_5
   * Numeración externa del inmueble del destinatario.
   */
  TABLA_Columna_5: string;

  /**
   * Número interior del domicilio.
   *
   * @property {string} TABLA_Columna_6
   * Numeración interna del inmueble (apartamento, oficina, etc.).
   */
  TABLA_Columna_6: string;

  /**
   * País del destinatario.
   *
   * @property {string} TABLA_Columna_7
   * País donde se ubica el destinatario.
   */
  TABLA_Columna_7: string;

  /**
   * Colonia del domicilio.
   *
   * @property {string} TABLA_Columna_8
   * Barrio o colonia donde se encuentra el domicilio.
   */
  TABLA_Columna_8: string;

  /**
   * Municipio o alcaldía del domicilio.
   *
   * @property {string} TABLA_Columna_9
   * División administrativa municipal del domicilio.
   */
  TABLA_Columna_9: string;

  /**
   * Entidad federativa del domicilio.
   *
   * @property {string} TABLA_Columna_10
   * Estado o entidad federativa donde se ubica el domicilio.
   */
  TABLA_Columna_10: string;

  /**
   * Código postal del domicilio.
   *
   * @property {string} TABLA_Columna_11
   * Código postal correspondiente al domicilio del destinatario.
   */
  TABLA_Columna_11: string;

  /**
   * Estado activo/inactivo del registro.
   *
   * @property {boolean} estatus
   * Bandera que indica si el registro está activo.
   */
  estatus: boolean;
}

/**
 * Configuración de las columnas de la tabla para el servicio MEDIO.
 *
 * Define la estructura de columnas para mostrar información de medios de transporte,
 * incluyendo clasificación arancelaria, datos de contacto y ubicación geográfica
 * del medio de transporte utilizado en el trámite.
 *
 * @constant {Array<Object>} MEDIO_SERVICIO
 */
export const MEDIO_SERVICIO = [
  {
    /**
     * Encabezado para la fracción arancelaria.
     *
     * @property {string} encabezado
     * Texto mostrado en el encabezado de la columna.
     */
    encabezado: 'Fracción arancelaria',

    /**
     * Función para obtener la fracción arancelaria.
     *
     * @property {Function} clave
     * Función que extrae el valor de TABLA_Columna_1.
     */
    clave: (ele: medioInfo) => ele.TABLA_Columna_1,

    /**
     * Orden de la columna en la tabla.
     *
     * @property {number} orden
     * Posición numérica de la columna.
     */
    orden: 1
  },
  {
    /**
     * Encabezado para el teléfono.
     *
     * @property {string} encabezado
     */
    encabezado: 'Teléfono',

    /**
     * Función para obtener el teléfono.
     *
     * @property {Function} clave
     */
    clave: (ele: medioInfo) => ele.TABLA_Columna_2,

    /**
     * Orden de la columna en la tabla.
     *
     * @property {number} orden
     */
    orden: 2
  },
  {
    /**
     * Encabezado para el correo electrónico.
     *
     * @property {string} encabezado
     */
    encabezado: 'Correo electrónico',

    /**
     * Función para obtener el correo electrónico.
     *
     * @property {Function} clave
     */
    clave: (ele: medioInfo) => ele.TABLA_Columna_3,

    /**
     * Orden de la columna en la tabla.
     *
     * @property {number} orden
     */
    orden: 3
  },
  {
    /**
     * Encabezado para el domicilio.
     *
     * @property {string} encabezado
     */
    encabezado: 'Domicilio',

    /**
     * Función para obtener el domicilio.
     *
     * @property {Function} clave
     */
    clave: (ele: medioInfo) => ele.TABLA_Columna_4,

    /**
     * Orden de la columna en la tabla.
     *
     * @property {number} orden
     */
    orden: 4
  },
  {
    /**
     * Encabezado para el país.
     *
     * @property {string} encabezado
     */
    encabezado: 'País',

    /**
     * Función para obtener el país.
     *
     * @property {Function} clave
     */
    clave: (ele: medioInfo) => ele.TABLA_Columna_5,

    /**
     * Orden de la columna en la tabla.
     *
     * @property {number} orden
     */
    orden: 5
  },
  {
    /**
     * Encabezado para información adicional del país.
     *
     * @property {string} encabezado
     */
    encabezado: 'País',

    /**
     * Función para obtener información adicional del país.
     *
     * @property {Function} clave
     */
    clave: (ele: medioInfo) => ele.TABLA_Columna_6,

    /**
     * Orden de la columna en la tabla.
     *
     * @property {number} orden
     */
    orden: 6
  }
]

/**
 * Interfaz para la información de MEDIO de transporte en formato de tabla.
 *
 * Define la estructura de datos para representar información de medios de transporte,
 * incluyendo clasificación arancelaria, datos de contacto y ubicación geográfica
 * en un formato tabular estructurado.
 *
 * @interface medioInfo
 */
export interface medioInfo {
  /**
   * Fracción arancelaria del medio.
   *
   * @property {string} TABLA_Columna_1
   * Código de clasificación arancelaria del medio de transporte.
   */
  TABLA_Columna_1: string;

  /**
   * Número de teléfono del medio.
   *
   * @property {string} TABLA_Columna_2
   * Número telefónico de contacto del responsable del medio.
   */
  TABLA_Columna_2: string;

  /**
   * Correo electrónico del medio.
   *
   * @property {string} TABLA_Columna_3
   * Dirección de email del responsable del medio de transporte.
   */
  TABLA_Columna_3: string;

  /**
   * Domicilio del medio.
   *
   * @property {string} TABLA_Columna_4
   * Dirección física donde se ubica o registra el medio.
   */
  TABLA_Columna_4: string;

  /**
   * País del medio.
   *
   * @property {string} TABLA_Columna_5
   * País de registro o procedencia del medio de transporte.
   */
  TABLA_Columna_5: string;

  /**
   * Información adicional del país del medio.
   *
   * @property {string} TABLA_Columna_6
   * Datos complementarios sobre el país del medio de transporte.
   */
  TABLA_Columna_6: string;

  /**
   * Estado activo/inactivo del registro.
   *
   * @property {boolean} estatus
   * Bandera que indica si el registro está activo.
   */
  estatus: boolean;
}

/**
 * Interfaz para consultas de trámites realizadas por el solicitante.
 *
 * Representa los datos principales que se muestran al solicitante cuando
 * consulta el estado y información básica de sus trámites en el sistema,
 * incluyendo identificación, fechas y estado actual del proceso.
 *
 * @interface ConsultaioSolicitante
 */
export interface ConsultaioSolicitante {
  /**
   * Folio identificador del trámite.
   *
   * @property {string} folioDelTramite
   * Número único de identificación asignado al trámite.
   */
  folioDelTramite: string;

  /**
   * Fecha en la que inició el trámite.
   *
   * @property {string} fechaDeInicio
   * Fecha de inicio del proceso del trámite en formato string.
   */
  fechaDeInicio: string;

  /**
   * Estado actual del trámite.
   *
   * @property {string} estadoDelTramite
   * Descripción del estado en que se encuentra el trámite.
   */
  estadoDelTramite: string;
}

