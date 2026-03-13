import {DatosDeLaSolicitudInt} from '../modelos/acuicola.model';
/**
 * Constante que representa los pasos del proceso.
 * @export
 * @constant {Array<Object>} PASOS
 */
export const PASOS = [
  {
    /**
     * Índice del paso.
     * @property {number} indice
     */
    indice: 1,

    /**
     * Título del paso.
     * @property {string} titulo
     */
    titulo: 'Capturar solicitud',

    /**
     * Indica si el paso está activo.
     * @property {boolean} activo
     */
    activo: true,

    /**
     * Indica si el paso está completado.
     * @property {boolean} completado
     */
    completado: true,
  },
  {
    indice: 2,
    titulo: 'Anexar requisitos',
    activo: false,
    completado: false,
  },
  {
    indice: 3,
    titulo: 'Firmar solicitud',
    activo: false,
    completado: false,
  },
];

/**
 * Configuración de la fecha de expedición de factura.
 * @export
 * @constant {Object} EXPEDICION_FACTURA_FECHA
 */
export const EXPEDICION_FACTURA_FECHA = {
  /**
   * Etiqueta del campo.
   * @property {string} labelNombre
   */
  labelNombre: 'Fecha de inspección',

  /**
   * Indica si el campo es obligatorio.
   * @property {boolean} required
   */
  required: true,

  /**
   * Indica si el campo está habilitado.
   * @property {boolean} habilitado
   */
  habilitado: true,
};

/**
 * Configuración de la fecha de pago.
 * @export
 * @constant {Object} FECHA_DE_PAGO
 */
export const FECHA_DE_PAGO = {
  /**
   * Etiqueta del campo.
   * @property {string} labelNombre
   */
  labelNombre: 'Fecha de pago:',

  /**
   * Indica si el campo es obligatorio.
   * @property {boolean} required
   */
  required: true,

  /**
   * Indica si el campo está habilitado.
   * @property {boolean} habilitado
   */
  habilitado: true,
};

/**
 * Título del mensaje para el registro de solicitud.
 * @export
 * @constant {string} TITULOMENSAJE
 */
export const TITULOMENSAJE =
  'Registro de solicitud de modificación programa IMMEX (Modificación Alta a domicilio de una planta, bodega o almacén)';

/**
 * Texto que describe los requisitos de la solicitud.
 * @export
 * @constant {string} TEXTOS_REQUISITOS
 */
export const TEXTOS_REQUISITOS =
  'La solicitud ha quedado registrada con el número temporal [202767640]. Este no tiene validez legal y sirve solamente para efectos de identificar tu Solicitud. Un folio oficial le será asignado a la solicitud al momento en que esta sea firmada.';

/**
 * Instrucción para realizar doble clic.
 * @export
 * @constant {string} INSTRUCCION_DOBLE_CLIC
 */
export const INSTRUCCION_DOBLE_CLIC =
  'Al dar clic en el botón "Cargar" se creará una nueva solicitud con los mismos datos de la solcitud 202766288 ';

/**
 * Instrucción obligatoria para las tablas.
 * @export
 * @constant {string} MANDATORY_INSTRUCTION
 */
export const MANDATORY_INSTRUCTION =
  'Las tablas con asterisco son obligatorias y debes agregar por lo menos un registro.';

/**
 * Textos específicos para el trámite 220702.
 * @export
 * @constant {Object} TEXTOS_220702
 */
export const TEXTOS_220702 = {
  /**
   * Texto para la solicitud.
   * @property {string} TEXTOS_SOLICITUD
   */
  TEXTOS_SOLICITUD:
    'Al dar doble clic en el registro seleccionado creará una Nueva solicitud con los mismos datos de la solicitud elegida.',

  /**
   * Leyenda para confirmar textos en la sección.
   * @property {string} SECCION_LEYENDA_CONFIRMAR_TEXTOS
   */
  SECCION_LEYENDA_CONFIRMAR_TEXTOS:
    'Debes declarar la cantidad que ingresa en parcialidad por cada fracción arancelaria. La columna "Saldo pendiente" mostrará el saldo disponible para las siguientes parcialidades.',
};

export const MERCANCIA_SERVICIO = [
  {
    encabezado: 'No. pardita',
    clave: (ele: MercanciaInfo): string => ele.tablaColumna1,
    orden: 1,
  },
  {
    encabezado: 'Tipo de requisito',
    clave: (ele: MercanciaInfo): string => ele.tablaColumna2,
    orden: 2,
  },
  {
    encabezado: 'Requisito',
    clave: (ele: MercanciaInfo): string => ele.tablaColumna3,
    orden: 3,
  },
  {
    encabezado: 'Número Certificado Internacional',
    clave: (ele: MercanciaInfo): string => ele.tablaColumna4,
    orden: 4,
  },
  {
    encabezado: 'Fracción arancelaria',
    clave: (ele: MercanciaInfo): string => ele.tablaColumna5,
    orden: 5,
  },
  {
    encabezado: 'Descripción de la fracción',
    clave: (ele: MercanciaInfo): string => ele.tablaColumna6,
    orden: 6,
  },
  {
    encabezado: 'Nico',
    clave: (ele: MercanciaInfo): string => ele.tablaColumna7,
    orden: 7,
  },
  {
    encabezado: 'Descripción Nico',
    clave: (ele: MercanciaInfo): string => ele.tablaColumna8,
    orden: 8,
  },
  {
    encabezado: 'Descripción',
    clave: (ele: MercanciaInfo): string => ele.tablaColumna8,
    orden: 8,
  },
  {
    encabezado: 'Unidad de medida tarifa (UMT)',
    clave: (ele: MercanciaInfo): string => ele.tablaColumna9,
    orden: 9,
  },
  {
    encabezado: 'Cantidad UMT',
    clave: (ele: MercanciaInfo): string => ele.tablaColumna10,
    orden: 10,
  },
  {
    encabezado: 'Unidad de medida de comercializacion (UMC)',
    clave: (ele: MercanciaInfo): string => ele.tablaColumna11,
    orden: 11,
  },
  {
    encabezado: 'Cantidad UMC',
    clave: (ele: MercanciaInfo): string => ele.tablaColumna12,
    orden: 12,
  },
  {
    encabezado: 'Uso',
    clave: (ele: MercanciaInfo): string => ele.tablaColumna13,
    orden: 13,
  },
  {
    encabezado: 'Tipo de Producto',
    clave: (ele: MercanciaInfo): string => ele.tablaColumna14,
    orden: 14,
  },
  {
    encabezado: 'Número de lote ',
    clave: (ele: MercanciaInfo): string => ele.tablaColumna15,
    orden: 15,
  },
  {
    encabezado: 'País de orígen ',
    clave: (ele: MercanciaInfo): string => ele.tablaColumna16,
    orden: 16,
  },

  {
    encabezado: 'País de procedencia ',
    clave: (ele: MercanciaInfo): string => ele.tablaColumna17,
    orden: 17,
  },

  {
    encabezado: 'Certificado Internacional Electrónico ',
    clave: (ele: MercanciaInfo): string => ele.tablaColumna18,
    orden: 18,
  }
];


/**
 * Interfaz que representa la información de la mercancía.
 * @export
 * @interface MercanciaInfo
 */
export interface MercanciaInfo {
  /**
   * Columna 1 de la tabla.
   * @property {string} tablaColumna1
   */
  tablaColumna1: string;

  /**
   * Columna 2 de la tabla.
   * @property {string} tablaColumna2
   */
  tablaColumna2: string;

  /**
   * Columna 3 de la tabla.
   * @property {string} tablaColumna3
   */
  tablaColumna3: string;

  /**
   * Columna 4 de la tabla.
   * @property {string} tablaColumna4
   */
  tablaColumna4: string;

  /**
   * Columna 5 de la tabla.
   * @property {string} tablaColumna5
   */
  tablaColumna5: string;

  /**
   * Columna 6 de la tabla.
   * @property {string} tablaColumna6
   */
  tablaColumna6: string;

  /**
   * Columna 7 de la tabla.
   * @property {string} tablaColumna7
   */
  tablaColumna7: string;

  /**
   * Columna 8 de la tabla.
   * @property {string} tablaColumna8
   */
  tablaColumna8: string;

  /**
   * Columna 9 de la tabla.
   * @property {string} tablaColumna9
   */
  tablaColumna9: string;

  /**
   * Columna 10 de la tabla.
   * @property {string} tablaColumna10
   */
  tablaColumna10: string;

  /**
   * Columna 11 de la tabla.
   * @property {string} tablaColumna11
   */
  tablaColumna11: string;

  /**
   * Columna 12 de la tabla.
   * @property {string} tablaColumna12
   */
  tablaColumna12: string;

  /**
   * Columna 13 de la tabla.
   * @property {string} tablaColumna13
   */
  tablaColumna13: string;

  /**
   * Columna 14 de la tabla.
   * @property {string} tablaColumna14
   */
  tablaColumna14: string;

  /**
   * Columna 15 de la tabla.
   * @property {string} tablaColumna15
   */
  tablaColumna15: string;

  /**
   * Columna 16 de la tabla.
   * @property {string} tablaColumna16
   */
  tablaColumna16: string;

  /**
   * Columna 17 de la tabla.
   * @property {string} tablaColumna17
   */
  tablaColumna17: string;

  /**
   * Columna 18 de la tabla.
   * @property {string} tablaColumna18
   */
  tablaColumna18: string;

  /**
   * Columna 19 de la tabla.
   * @property {string} tablaColumna19
   */
  tablaColumna19: string;
}

/**
 * Configuración de las columnas para el servicio del exportador.
 * @export
 * @constant {Array<Object>} EXPORTADOR_SERVICIO
 */
export const EXPORTADOR_SERVICIO = [
  {
    /**
     * Encabezado de la columna: Nombre/denominación o razón social.
     * @property {string} encabezado
     */
    encabezado: 'Nombre/ denominación o razón social',

    /**
     * Función que devuelve el nombre del exportador.
     * @property {(ele: ExportadorInfo) => string} clave
     */
    clave: (ele: ExportadorInfo): string => ele.nombre,

    /**
     * Orden de la columna.
     * @property {number} orden
     */
    orden: 1,
  },
  {
    encabezado: 'Teléfono',
    clave: (ele: ExportadorInfo): string => ele.teleFono,
    orden: 2,
  },
  {
    encabezado: 'Correo electrónico',
    clave: (ele: ExportadorInfo): string => ele.correo,
    orden: 3,
  },
  {
    encabezado: 'Domicilio',
    clave: (ele: ExportadorInfo): string => ele.domicilio,
    orden: 4,
  },
  {
    encabezado: 'País',
    clave: (ele: ExportadorInfo): string => ele.pais,
    orden: 5,
  },
];

/**
 * Interfaz que representa la información del exportador.
 * @export
 * @interface ExportadorInfo
 */
export interface ExportadorInfo {
  /**
   * Nombre del exportador.
   * @property {string} nombre
   */
  nombre: string;

  /**
   * Teléfono del exportador.
   * @property {string} teleFono
   */
  teleFono: string;

  /**
   * Correo electrónico del exportador.
   * @property {string} correo
   */
  correo: string;

  /**
   * Domicilio del exportador.
   * @property {string} domicilio
   */
  domicilio: string;

  /**
   * País del exportador.
   * @property {string} pais
   */
  pais: string;
}

/**
 * Configuración de las columnas para el servicio del destino.
 * @export
 * @constant {Array<Object>} DESTINO_SERVICIO
 */
export const DESTINO_SERVICIO = [
  {
    encabezado: 'Nombre/denominación o razón social',
    clave: (ele: DestinoInfo): string => ele.tablaColumna1,
    orden: 1,
  },
  {
    encabezado: 'Teléfono',
    clave: (ele: DestinoInfo): string => ele.tablaColumna2,
    orden: 2,
  },
  {
    encabezado: 'Correo electrónico',
    clave: (ele: DestinoInfo): string => ele.tablaColumna3,
    orden: 3,
  },
  {
    encabezado: 'Calle',
    clave: (ele: DestinoInfo): string => ele.tablaColumna4,
    orden: 4,
  },
  {
    encabezado: 'Número exterior',
    clave: (ele: DestinoInfo): string => ele.tablaColumna5,
    orden: 5,
  },
  {
    encabezado: 'Número interior',
    clave: (ele: DestinoInfo): string => ele.tablaColumna6,
    orden: 6,
  },
  {
    encabezado: 'País',
    clave: (ele: DestinoInfo): string => ele.tablaColumna7,
    orden: 7,
  },
  {
    encabezado: 'Colonia',
    clave: (ele: DestinoInfo): string => ele.tablaColumna8,
    orden: 8,
  },
  {
    encabezado: 'Municipio o alcaldía',
    clave: (ele: DestinoInfo): string => ele.tablaColumna9,
    orden: 9,
  },
  {
    encabezado: 'Entidad federativa',
    clave: (ele: DestinoInfo): string => ele.tablaColumna10,
    orden: 10,
  },
  {
    encabezado: 'Código postal',
    clave: (ele: DestinoInfo): string => ele.tablaColumna11,
    orden: 11,
  },
];

/**
 * Interfaz que representa la información del destino.
 * @export
 * @interface DestinoInfo
 */
export interface DestinoInfo {
  /**
   * Columna 1 de la tabla.
   * @property {string} tablaColumna1
   */
  tablaColumna1: string;

  /**
   * Columna 2 de la tabla.
   * @property {string} tablaColumna2
   */
  tablaColumna2: string;

  /**
   * Columna 3 de la tabla.
   * @property {string} tablaColumna3
   */
  tablaColumna3: string;

  /**
   * Columna 4 de la tabla.
   * @property {string} tablaColumna4
   */
  tablaColumna4: string;

  /**
   * Columna 5 de la tabla.
   * @property {string} tablaColumna5
   */
  tablaColumna5: string;

  /**
   * Columna 6 de la tabla.
   * @property {string} tablaColumna6
   */
  tablaColumna6: string;

  /**
   * Columna 7 de la tabla.
   * @property {string} tablaColumna7
   */
  tablaColumna7: string;

  /**
   * Columna 8 de la tabla.
   * @property {string} tablaColumna8
   */
  tablaColumna8: string;

  /**
   * Columna 9 de la tabla.
   * @property {string} tablaColumna9
   */
  tablaColumna9: string;

  /**
   * Columna 10 de la tabla.
   * @property {string} tablaColumna10
   */
  tablaColumna10: string;

  /**
   * Columna 11 de la tabla.
   * @property {string} tablaColumna11
   */
  tablaColumna11: string;
}

/**
 * Configuración de las columnas para el servicio de mercancías.
 * @export
 * @constant {Array<Object>} MEDIO_SERVICIO
 */
export const MEDIO_SERVICIO = [
  {
    /**
     * Encabezado de la columna: Fracción arancelaria.
     * @property {string} encabezado
     */
    encabezado: 'Fracción arancelaria',

    /**
     * Función que devuelve la fracción arancelaria de la mercancía.
     * @property {(ele: MercanciaDatosInfo) => string} clave
     */
    clave: (ele: MercanciaDatosInfo): string => ele.fraccionArancelaria,

    /**
     * Orden de la columna.
     * @property {number} orden
     */
    orden: 1,
  },
  {
    encabezado: 'Descripción de la fracción',
    clave: (ele: MercanciaDatosInfo): string => ele.descripcionDelaFraccion,
    orden: 2,
  },
  {
    encabezado: 'Nico',
    clave: (ele: MercanciaDatosInfo): string => ele.nico,
    orden: 3,
  },
  {
    encabezado: 'Descripción Nico',
    clave: (ele: MercanciaDatosInfo): string => ele.descripcionNico,
    orden: 4,
  },
  {
    encabezado: 'Unidad de medida de tarifa (UMT)',
    clave: (ele: MercanciaDatosInfo): string => ele.unidadDeMedidadeTarifaUMT,
    orden: 5,
  },
  {
    encabezado: 'Cantidad total UMT',
    clave: (ele: MercanciaDatosInfo): string => ele.cantidadTotalUMT,
    orden: 6,
  },
];

/**
 * Interfaz que representa la información de las mercancías.
 * @export
 * @interface MercanciaDatosInfo
 */
export interface MercanciaDatosInfo {
  /**
   * Fracción arancelaria de la mercancía.
   * @property {string} fraccionArancelaria
   */
  fraccionArancelaria: string;

  /**
   * Descripción de la fracción arancelaria.
   * @property {string} descripcionDelaFraccion
   */
  descripcionDelaFraccion: string;

  /**
   * Número de identificación comercial (Nico).
   * @property {string} nico
   */
  nico: string;

  /**
   * Descripción del Nico.
   * @property {string} descripcionNico
   */
  descripcionNico: string;

  /**
   * Unidad de medida tarifaria (UMT).
   * @property {string} unidadDeMedidadeTarifaUMT
   */
  unidadDeMedidadeTarifaUMT: string;

  /**
   * Cantidad total en la unidad de medida tarifaria.
   * @property {string} cantidadTotalUMT
   */
  cantidadTotalUMT: string;
}

/**
 * Configuración de las secciones del trámite 220702.
 * @export
 * @constant {Object} SECCIONES_TRAMITE_220702
 */
export const SECCIONES_TRAMITE_220702 = {
  PASO_1: {
    /**
     * Validación de la sección 1.
     * @property {boolean} VALIDACION_SECCION_1
     */
    VALIDACION_SECCION_1: false,

    /**
     * Validación de la sección 2.
     * @property {boolean} VALIDACION_SECCION_2
     */
    VALIDACION_SECCION_2: true,

    /**
     * Validación de la sección 3.
     * @property {boolean} VALIDACION_SECCION_3
     */
    VALIDACION_SECCION_3: false,
  },
  PASO_2: {
    /**
     * Validación de la sección.
     * @property {boolean} VALIDACION_SECCION
     */
    VALIDACION_SECCION: true,
  },
  PASO_3: {
    /**
     * Indica si se requiere validación.
     * @property {boolean} requiereValidacion
     */
    requiereValidacion: true,
  },
};
/**
 * Representa el estado de un trámite.
 * @export
 * @interface TramiteState
 */
export interface TramiteState {
  /**
   * Justificación del trámite.
   * @property {string} justificacion
   */
  justificacion: string;

  /**
   * Certificados autorizados relacionados con el trámite.
   * @property {string} certificadosAutorizados
   */
  certificadosAutorizados: string;

  /**
   * Hora de inspección del trámite.
   * @property {string} horaDeInspeccion
   */
  horaDeInspeccion: string;

  /**
   * Identificador de la aduana de ingreso.
   * @property {number} aduanaDeIngreso
   */
  aduanaDeIngreso: number;

  /**
   * Nombre de la oficina de inspección.
   * @property {string} oficinaDeInspeccion
   */
  oficinaDeInspeccion: string;

  /**
   * Punto de inspección asociado al trámite.
   * @property {string} puntoDeInspeccion
   */
  puntoDeInspeccion: string;

  /**
   * Nombre del inspector asignado.
   * @property {string} nombreInspector
   */
  nombreInspector: string;

  /**
   * Primer apellido del inspector.
   * @property {string} primerApellido
   */
  primerApellido: string;

  /**
   * Segundo apellido del inspector.
   * @property {string} segundoApellido
   */
  segundoApellido: string;

  /**
   * Cantidad de contenedores involucrados.
   * @property {number} cantidadContenedores
   */
  cantidadContenedores: number;

  /**
   * Tipo de contenedor utilizado.
   * @property {number} tipoContenedor
   */
  tipoContenedor: number;

  /**
   * Medio de transporte utilizado.
   * @property {string} medioDeTransporte
   */
  medioDeTransporte: string;

  /**
   * Identificación del transporte.
   * @property {string} identificacionTransporte
   */
  identificacionTransporte: string;

  /**
   * Indica si la solicitud está relacionada con transporte ferroviario.
   * @property {string} esSolicitudFerros
   */
  esSolicitudFerros: string;

  /**
   * Información de la mercancía involucrada.
   * @property {MercanciaDatosInfo[]} mercanciaDatos
   */
  mercanciaDatos: MercanciaDatosInfo[];

  /**
   * Folio del trámite.
   * @property {string} folioDelTramite
   */
  folioDelTramite: string;

  /**
   * Número de guía del trámite.
   * @property {string} numeroDeGuia
   */
  numeroDeGuia: string;

  /**
   * Número de ferrocarril asociado.
   * @property {string} numeroFerrocaril
   */
  numeroFerrocaril: string;

  /**
   * Régimen al que se destina la mercancía.
   * @property {string} regimenAlQueDestina
   */
  regimenAlQueDestina: string;

  /**
   * Datos para la movilización de la mercancía.
   * @property {string} datosParaMovilizacion
   */
  datosParaMovilizacion: string;

  /**
   * Punto de verificación asociado.
   * @property {string} puntoDeVerificacion
   */
  puntoDeVerificacion: string;

  /**
   * Identificación del transporte.
   * @property {string} identificacionDelTransporte
   */
  identificacionDelTransporte: string;

  /**
   * Nombre de la empresa transportista.
   * @property {string} nombreDeLaEmpresaTransportista
   */
  nombreDeLaEmpresaTransportista: string;

  /**
   * Clave de referencia del trámite.
   * @property {string} claveDeReferencia
   */
  claveDeReferencia: string;

  /**
   * Cadena de dependencia asociada.
   * @property {string} cadenaDependencia
   */
  cadenaDependencia: string;

  /**
   * Identificador del banco asociado.
   * @property {number} banco
   */
  banco: number;

  /**
   * Llave de pago del trámite.
   * @property {string} llaveDePago
   */
  llaveDePago: string;

  /**
   * Fecha de pago de derechos.
   * @property {string} fechaPagoDeDerechos
   */
  fechaPagoDeDerechos: string;

  /**
   * Importe del pago de derechos.
   * @property {string} importeDePago
   */
  importeDePago: string;

  /**
   * Clave de referencia para la revisión.
   * @property {string} claveDeReferenciaRevision
   */
  claveDeReferenciaRevision: string;

  /**
   * Cadena de dependencia para la revisión.
   * @property {string} cadenaDependenciaRevision
   */
  cadenaDependenciaRevision: string;

  /**
   * Banco asociado a la revisión.
   * @property {string} bancoRevision
   */
  bancoRevision: string;

  /**
   * Llave de pago para la revisión.
   * @property {string} llaveDePagoRevision
   */
  llaveDePagoRevision: string;

  /**
   * Fecha de pago de derechos para la revisión.
   * @property {string} fechaPagoDeDerechosRevision
   */
  fechaPagoDeDerechosRevision: string;

  /**
   * Importe del pago de derechos para la revisión.
   * @property {string} importeDePagoRevision
   */
  importeDePagoRevision: string;

  /**
   * Clave de referencia para los derechos.
   * @property {string} claveDeReferenciaDerechos
   */
  claveDeReferenciaDerechos: string;

  /**
   * Cadena de dependencia para los derechos.
   * @property {string} cadenaDependenciaDerechos
   */
  cadenaDependenciaDerechos: string;

  /**
   * Banco asociado a los derechos.
   * @property {string} bancoDerechos
   */
  bancoDerechos: string;

  /**
   * Llave de pago para los derechos.
   * @property {string} llaveDePagoDerechos
   */
  llaveDePagoDerechos: string;

  /**
   * Fecha de pago.
   * @property {string} fechaDePago
   */
  fechaDePago: string;

  /**
   * Importe del pago de derechos.
   * @property {number} importeDePagoDerechos
   */
  importeDePagoDerechos: number;

  /**
   * Indica si el trámite está exento de pago.
   * @property {string} exentoDePago
   */
  exentoDePago: string;

  /**
   * Información de los exportadores.
   * @property {ExportadorInfo[]} exportadorTableDatos
   */
  exportadorTableDatos: ExportadorInfo[];

  /**
   * Información de los destinos.
   * @property {DestinoInfo[]} destinoTableDatos
   */
  destinoTableDatos: DestinoInfo[];

  /**
   * Información general de la solicitud.
   * @property {DatosDeLaSolicitudInt} DatosDeLaSolicitudInt
   */
  DatosDeLaSolicitudInt: DatosDeLaSolicitudInt;
}
