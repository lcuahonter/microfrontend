/**
 * Interfaz que representa los datos del trámite.
 * @export
 * @interface DatosDelTramite
 */
export interface DatosDelTramite {
  /**
   * Número de certificados autorizados.
   * @property {number} certificadosAutorizados
   */
  certificadosAutorizados: number;
}

/**
 * Interfaz que representa la información del responsable de inspección.
 * @export
 * @interface ResponsableInspección
 */
export interface ResponsableInspección {
  /**
   * Nombre del inspector.
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
   * Cantidad de contenedores inspeccionados.
   * @property {number} cantidadContenedores
   */
  cantidadContenedores: number;
}

/**
 * Interfaz que representa los datos de la mercancía.
 * @export
 * @interface MercanciaDatos
 */
export interface MercanciaDatos {
  /**
   * Fracción arancelaria de la mercancía.
   * @property {string} fraccionArancelaria
   */
  fraccionArancelaria: string;

  /**
   * Descripción de la fracción arancelaria.
   * @property {string} descripcionFraccion
   */
  descripcionFraccion: string;

  /**
   * Número de identificación comercial (NICO).
   * @property {string} nico
   */
  nico: string;

  /**
   * Descripción del NICO.
   * @property {string} descripcionNico
   */
  descripcionNico: string;

  /**
   * Unidad de medida tarifaria.
   * @property {string} unidadMedidaTarifa
   */
  unidadMedidaTarifa: string;

  /**
   * Cantidad total en la unidad de medida tarifaria.
   * @property {number} cantidadTotalUMT
   */
  cantidadTotalUMT: number;
}

/**
 * Interfaz que representa los datos del pago de derechos.
 * @export
 * @interface PagoDeDerechos
 */
export interface PagoDeDerechos {
  /**
   * Clave de referencia del pago.
   * @property {string} claveDeReferencia
   */
  claveDeReferencia: string;

  /**
   * Cadena de dependencia asociada al pago.
   * @property {string} cadenaDependencia
   */
  cadenaDependencia: string;

  /**
   * Banco donde se realizó el pago.
   * @property {string} banco
   */
  banco: string;

  /**
   * Llave de pago.
   * @property {string} llaveDePago
   */
  llaveDePago: string;

  /**
   * Fecha de inicio del pago.
   * @property {string} fechaInicio
   */
  fechaInicio: string;

  /**
   * Importe del pago.
   * @property {string} importeDePago
   */
  importeDePago: string;
}

/**
 * Interfaz que representa los datos de revisión del pago de derechos.
 * @export
 * @interface PagoDeDerechosRevision
 */
export interface PagoDeDerechosRevision {
  /**
   * Clave de referencia de la revisión del pago.
   * @property {string} claveDeReferenciaRevision
   */
  claveDeReferenciaRevision: string;

  /**
   * Cadena de dependencia asociada a la revisión del pago.
   * @property {string} cadenaDependenciaRevision
   */
  cadenaDependenciaRevision: string;

  /**
   * Banco donde se realizó la revisión del pago.
   * @property {string} bancoRevision
   */
  bancoRevision: string;

  /**
   * Llave de pago de la revisión.
   * @property {string} llaveDePagoRevision
   */
  llaveDePagoRevision: string;

  /**
   * Fecha de inicio de la revisión del pago.
   * @property {string} fechaInicioRevision
   */
  fechaInicioRevision: string;

  /**
   * Importe de la revisión del pago.
   * @property {string} importeDePagoRevision
   */
  importeDePagoRevision: string;
}

/**
 * Interfaz que representa los datos generales del trámite.
 * @export
 * @interface DatosGenerales
 */
export interface DatosGenerales {
  /**
   * Folio del trámite.
   * @property {string} folioDelTramite
   */
  folioDelTramite: string;

  /**
   * Aduana de ingreso.
   * @property {string} aduanaDeIngreso
   */
  aduanaDeIngreso: string;

  /**
   * Oficina de inspección.
   * @property {string} oficinaDeInspeccion
   */
  oficinaDeInspeccion: string;

  /**
   * Punto de inspección.
   * @property {string} puntoDeInspeccion
   */
  puntoDeInspeccion: string;

  /**
   * Número de guía.
   * @property {string} numeroDeGuia
   */
  numeroDeGuia: string;

  /**
   * Régimen al que se destina.
   * @property {string} regimenAlQueDestina
   */
  regimenAlQueDestina: string;

  /**
   * Datos para movilización.
   * @property {string} datosParaMovilizacion
   */
  datosParaMovilizacion: string;

  /**
   * Punto de verificación.
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
}

/**
 * Interfaz que representa los datos de la solicitud interna.
 * @export
 * @interface DatosDeLaSolicitudInt
 */
export interface DatosDeLaSolicitudInt {
  /**
   * Número de guía.
   * @property {string} numeroDeGuia
   */
  numeroDeGuia: string;

  /**
   * Número de Carro de Ferrocarril.
   * @property {string} numeroFerrocaril
   */
  numeroFerrocaril: string;
  /**
   * Folio del trámite.
   * @property {string} folioDelTramite
   */
  folioDelTramite: string;
  /**
   * Justificación de la solicitud.
   * @property {string} justificacion
   */
  justificacion: string;

  /**
   * Certificados autorizados.
   * @property {string} certificadosAutorizados
   */
  certificadosAutorizados: string;

  /**
   * Fecha de inicio.
   * @property {string} fechaInicio
   */
  fechaInicio: string;

  /**
   * Hora de inspección.
   * @property {string} horaDeInspeccion
   */
  horaDeInspeccion: string;

  /**
   * Aduana de ingreso.
   * @property {string} aduanaDeIngreso
   */
  aduanaDeIngreso: string;

  /**
   * Sanidad agropecuaria.
   * @property {string} sanidadAgropecuaria
   */
  sanidadAgropecuaria: string;

  /**
   * Punto de inspección.
   * @property {string} puntoDeInspeccion
   */
  puntoDeInspeccion: string;

  /**
   * Nombre del inspector.
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
   * Cantidad de contenedores.
   * @property {string} cantidadContenedores
   */
  cantidadContenedores: string;

  /**
   * Tipo de contenedor.
   * @property {string} tipoContenedor
   */
  tipoContenedor: string;

  /**
   * Medio de transporte.
   * @property {string} medioDeTransporte
   */
  medioDeTransporte: string;

  /**
   * Identificación del transporte.
   * @property {string} identificacionTransporte
   */
  identificacionTransporte: string;

  /**
   * Indica si es una solicitud ferroviaria.
   * @property {string} esSolicitudFerros
   */
  esSolicitudFerros: string;

  /**
   * Banco asociado.
   * @property {string} banco
   */
  banco: string;

  /**
   * Régimen al que se destina.
   * @property {string} regimenAlQueDestina
   */
  regimenAlQueDestina: string;

  /**
   * Nombre de la empresa transportista.
   * @property {string} nombreDeLaEmpresaTransportista
   */
  nombreDeLaEmpresaTransportista: string;

  /**
   * Punto de verificación.
   * @property {string} puntoDeVerificacion
   */
  puntoDeVerificacion: string;

  /**
   * Identificación del transporte.
   * @property {string} identificacionDelTransporte
   */
  identificacionDelTransporte: string;

  /**
   * Datos para movilización.
   * @property {string} datosParaMovilizacion
   */
  datosParaMovilizacion: string;

  /**
   * Oficina de inspección.
   * @property {string} oficinaDeInspeccion
   */
  oficinaDeInspeccion: string;
}

/**
 * Interfaz que representa los datos generales internos.
 * @export
 * @interface InternaDatosGeneralesInt
 */
export interface InternaDatosGeneralesInt {
  /**
   * Folio del trámite.
   * @property {number} folioDelTramite
   */
  folioDelTramite: number;

  /**
   * Aduana de ingreso.
   * @property {string} aduanaIngreso
   */
  aduanaIngreso: string;

  /**
   * Oficina de inspección.
   * @property {string} oficinaInspeccion
   */
  oficinaInspeccion: string;

  /**
   * Punto de inspección.
   * @property {string} puntoInspeccion
   */
  puntoInspeccion: string;

  /**
   * Clave UCON.
   * @property {string} claveUCON
   */
  claveUCON: string;

  /**
   * Establecimientos TIF.
   * @property {string} establecimientoTIFs
   */
  establecimientoTIFs: string;

  /**
   * Nombre del veterinario.
   * @property {string} nombreVeterinario
   */
  nombreVeterinario: string;

  /**
   * Número de guía.
   * @property {string} numeroGuia
   */
  numeroGuia: string;

  /**
   * Régimen.
   * @property {string} regimen
   */
  regimen: string;

  /**
   * Captura de mercancía.
   * @property {string} capturaMercancia
   */
  capturaMercancia: string;

  /**
   * Animales vivos.
   * @property {string} animalesVivos
   */
  animalesVivos: string;

  /**
   * Coordenadas.
   * @property {string} coordenadas
   */
  coordenadas: string;

  /**
   * Movilización nacional.
   * @property {string} movilizacionNacional
   */
  movilizacionNacional: string;

  /**
   * Identificación del transporte.
   * @property {string} identTransporte
   */
  identTransporte: string;

  /**
   * Punto de verificación.
   * @property {string} puntoVerificacion
   */
  puntoVerificacion: string;

  /**
   * Empresa transportista.
   * @property {string} empresaTransportista
   */
  empresaTransportista: string;

  /**
   * Datos para movilización.
   * @property {string} datosParaMovilizacion
   */
  datosParaMovilizacion: string;

  /**
   * Punto de verificación.
   * @property {string} puntoDeVerificacion
   */
  puntoDeVerificacion: string;

  /**
   * Régimen al que se destina.
   * @property {string} regimenAlQueDestina
   */
  regimenAlQueDestina: string;
}

/**
 * Interfaz que representa los datos del servicio.
 * @export
 * @interface ServiceDatos
 */
export interface ServiceDatos {
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
 * Interfaz que representa los datos de la mercancía.
 * @export
 * @interface MercanciaDatosDos
 */
export interface MercanciaDatosDos {
  /**
   * Código de respuesta.
   * @property {number} code
   */
  code: number;

  /**
   * Lista de datos del servicio relacionados con la mercancía.
   * @property {ServiceDatos[]} data
   */
  data: ServiceDatos[];

  /**
   * Mensaje descriptivo de la respuesta.
   * @property {string} message
   */
  message: string;
}

/**
 * Interfaz que representa los datos del servicio de mercancía.
 * @export
 * @interface ServiceDatosDeMercancia
 */
export interface ServiceDatosDeMercancia {
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
   * Número de identificación comercial (NICO).
   * @property {string} nico
   */
  nico: string;

  /**
   * Descripción del NICO.
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

  /**
   * Estatus de la mercancía.
   * @property {boolean} estatus
   */
  estatus: boolean;
}

/**
 * Interfaz que representa la respuesta de la API para los datos de mercancía.
 * @export
 * @interface ApiResponseDos
 */
export interface ApiResponseDos {
  /**
   * Código de respuesta.
   * @property {number} code
   */
  code: number;

  /**
   * Lista de datos del servicio de mercancía.
   * @property {ServiceDatosDeMercancia[]} data
   */
  data: ServiceDatosDeMercancia[];

  /**
   * Mensaje descriptivo de la respuesta.
   * @property {string} message
   */
  message: string;
}

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
 * Interfaz que representa la respuesta de datos del exportador.
 * @export
 * @interface ExportadorInfoDatos
 */
export interface ExportadorInfoDatos {
  /**
   * Código de respuesta.
   * @property {number} code
   */
  code: number;

  /**
   * Lista de información del exportador.
   * @property {ExportadorInfo[]} data
   */
  data: ExportadorInfo[];

  /**
   * Mensaje descriptivo de la respuesta.
   * @property {string} message
   */
  message: string;
}

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
 * Interfaz que representa la respuesta de datos del destino.
 * @export
 * @interface DestinoInfoDatos
 */
export interface DestinoInfoDatos {
  /**
   * Código de respuesta.
   * @property {number} code
   */
  code: number;

  /**
   * Lista de información del destino.
   * @property {DestinoInfo[]} data
   */
  data: DestinoInfo[];

  /**
   * Mensaje descriptivo de la respuesta.
   * @property {string} message
   */
  message: string;
}

/**
 * Interfaz que representa los datos de inspección.
 * @export
 * @interface DatosInfo
 */
export interface DatosInfo {
  /**
   * Identificador único.
   * @property {number} id
   */
  id: number;

  /**
   * Nombre del inspector.
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
   * Cantidad de contenedores inspeccionados.
   * @property {number} cantidadContenedores
   */
  cantidadContenedores: number;
}

/**
 * Interfaz que representa la respuesta de la API para inspección.
 * @export
 * @interface InspeccionApiResponse
 */
export interface InspeccionApiResponse {
  /**
   * Datos de inspección.
   * @property {DatosInfo} data
   */
  data: DatosInfo;
}

/**
 * Interfaz que representa los datos de revisión del pago de derechos.
 * @export
 * @interface RevisionData
 */
export interface RevisionData {
  /**
   * Clave de referencia de la revisión.
   * @property {string} claveDeReferenciaRevision
   */
  claveDeReferenciaRevision: string;

  /**
   * Cadena de dependencia asociada a la revisión.
   * @property {string} cadenaDependenciaRevision
   */
  cadenaDependenciaRevision: string;

  /**
   * Banco donde se realizó la revisión.
   * @property {string} bancoRevision
   */
  bancoRevision: string;

  /**
   * Llave de pago de la revisión.
   * @property {string} llaveDePagoRevision
   */
  llaveDePagoRevision: string;

  /**
   * Fecha de inicio de la revisión.
   * @property {string} fechaInicioRevision
   */
  fechaInicioRevision: string;

  /**
   * Importe de la revisión del pago.
   * @property {string} importeDePagoRevision
   */
  importeDePagoRevision: string;
}

/**
 * Interfaz que representa la respuesta de la API para el pago de derechos.
 * @export
 * @interface PagoDeDerechosApiResponse
 */
export interface PagoDeDerechosApiResponse {
  /**
   * Datos de revisión del pago de derechos.
   * @property {RevisionData} data
   */
  data: RevisionData;
}

/**
 * Interfaz que representa los datos de pago de derechos.
 * @export
 * @interface RevisionDataPageDeDerechos
 */
export interface RevisionDataPageDeDerechos {
  /**
   * Clave de referencia del pago.
   * @property {string} claveDeReferencia
   */
  claveDeReferencia: string;

  /**
   * Cadena de dependencia asociada al pago.
   * @property {string} cadenaDependencia
   */
  cadenaDependencia: string;

  /**
   * Banco donde se realizó el pago.
   * @property {number} banco
   */
  banco: number;

  /**
   * Llave de pago.
   * @property {string} llaveDePago
   */
  llaveDePago: string;

  /**
   * Fecha de inicio del pago.
   * @property {string} fechaInicio
   */
  fechaInicio: string;

  /**
   * Importe del pago.
   * @property {string} importeDePago
   */
  importeDePago: string;
}

/**
 * Interfaz que representa la respuesta de la API para el pago de derechos.
 * @export
 * @interface PagoDeDerechosResponseDos
 */
export interface PagoDeDerechosResponseDos {
  /**
   * Datos del pago de derechos.
   * @property {RevisionDataPageDeDerechos} data
   */
  data: RevisionDataPageDeDerechos;
}

/**
 * Interfaz que representa los datos de certificados autorizados.
 * @export
 * @interface DataInfo
 */
export interface DataInfo {
  /**
   * Certificados autorizados.
   * @property {string} certificadosAutorizados
   */
  certificadosAutorizados: string;
}

/**
 * Interfaz que representa la respuesta de la API para certificados.
 * @export
 * @interface CertificadosResponse
 */
export interface CertificadosResponse {
  /**
   * Datos de certificados autorizados.
   * @property {DataInfo} data
   */
  data: DataInfo;
}

/**
 * Interfaz que representa los datos de revisión del pago de derechos.
 * @export
 * @interface PagoDeRevisionData
 */
export interface PagoDeRevisionData {
  /**
   * Clave de referencia de la revisión.
   * @property {string} claveDeReferenciaRevision
   */
  claveDeReferenciaRevision: string;

  /**
   * Cadena de dependencia asociada a la revisión.
   * @property {string} cadenaDependenciaRevision
   */
  cadenaDependenciaRevision: string;

  /**
   * Banco donde se realizó la revisión.
   * @property {string} bancoRevision
   */
  bancoRevision: string;

  /**
   * Llave de pago de la revisión.
   * @property {string} llaveDePagoRevision
   */
  llaveDePagoRevision: string;

  /**
   * Fecha de inicio de la revisión.
   * @property {string} fechaInicioRevision
   */
  fechaInicioRevision: string;

  /**
   * Importe de la revisión del pago.
   * @property {string} importeDePagoRevision
   */
  importeDePagoRevision: string;
}

/**
 * Interfaz que representa la respuesta de la API para la revisión del pago de derechos.
 * @export
 * @interface PagoDeDerechosRevisionResponse
 */
export interface PagoDeDerechosRevisionResponse {
  /**
   * Datos de la revisión del pago de derechos.
   * @property {PagoDeRevisionData} data
   */
  data: PagoDeRevisionData;
}