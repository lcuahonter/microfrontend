/**
 * ## MontoExpedirTablaDatos
 * Interfaz que representa los datos de la tabla de montos a expedir.
 */
export interface MontoExpedirTablaDatos {
    /**
     * ## columns
     * Arreglo de cadenas que representa los encabezados de las columnas de la tabla.
     */
    columns: string[];
  }
  
  /**
   * ## TablaDatos
   * Interfaz que representa las filas de datos de una tabla.
   */
  export interface TablaDatos {
    /**
     * ## tbodyData
     * Arreglo de cadenas que representa los datos de las filas del cuerpo de la tabla.
     */
    tbodyData: string[];
  }
  /**
 * Representa el modelo de datos para los montos a expedir.
 */
export interface Monto {
  /**
   * Monto que se va a expedir.
   */
  Montoaexpedir: string;
}


/**
 * Representa la respuesta de una asignación de certificados en frontera.
 *
 * @property {number} idAsignacion - Identificador único de la asignación.
 * @property {number} idSolicitud - Identificador de la solicitud asociada.
 * @property {number | null} idMecanismoAsignacion - Identificador del mecanismo de asignación, si aplica.
 * @property {number | null} cantidadSolicitada - Cantidad solicitada en la asignación.
 * @property {number | null} cantidadAprobada - Cantidad aprobada en la asignación.
 * @property {number | null} impTotalAprobado - Importe total aprobado.
 * @property {number | null} impTotalExpedido - Importe total expedido.
 * @property {number} cantidadCancelada - Cantidad cancelada en la asignación.
 * @property {boolean} asignacionActiva - Indica si la asignación está activa.
 * @property {boolean} aprobada - Indica si la asignación fue aprobada.
 * @property {string} fechaInicioVigencia - Fecha de inicio de vigencia de la asignación.
 * @property {string | null} fechaFinVigenciaSolicitada - Fecha de fin de vigencia solicitada.
 * @property {string | null} fechaFinVigenciaAprobada - Fecha de fin de vigencia aprobada.
 * @property {number | null} ideTipoAsignacionDirecta - Identificador del tipo de asignación directa, si aplica.
 * @property {number | null} idAsignacionR - Identificador de la asignación relacionada, si aplica.
 * @property {number} numFolioAsignacion - Número de folio de la asignación.
 * @property {number | null} numFolioAsignacionTPL - Número de folio de asignación TPL, si aplica.
 * @property {string | null} fechaAutorizacion - Fecha de autorización de la asignación.
 * @property {number | null} impAntecedenteAsignacion - Importe antecedente de la asignación.
 * @property {number | null} idLicitacionPublica - Identificador de la licitación pública, si aplica.
 * @property {string | null} rfcParticipante - RFC del participante, si aplica.
 * @property {number | null} impCalculadoProrrata - Importe calculado por prorrata.
 * @property {string | null} areaVenta - Área de venta asociada.
 * @property {string | null} areaRefrigeracion - Área de refrigeración asociada.
 * @property {number | null} impAntecedenteEmpresa - Importe antecedente de la empresa.
 * @property {number | null} montoDisponible - Monto disponible para la asignación.
 * @property {number | null} montoExpedido - Monto expedido en la asignación.
 * @property {number} añoAutorizacion - Año de autorización de la asignación.
 * @property {Solicitud} solicitud - Información de la solicitud asociada.
 * @property {object | null} mecanismoAsignacion - Detalles del mecanismo de asignación, si aplica.
 * @property {object | null} asignacionOrigen - Detalles de la asignación de origen, si aplica.
 * @property {Participante} participante - Información del participante asociado.
 * @property {number | null} saldoMecanismo - Saldo del mecanismo de asignación.
 * @property {number | null} saldoMecanismoAsignado - Saldo asignado del mecanismo.
 * @property {number | null} saldoMecanismoExpedido - Saldo expedido del mecanismo.
 * @property {number | null} porcentajeParticipacion - Porcentaje de participación en la asignación.
 * @property {number | null} resultadoParcial - Resultado parcial de la asignación.
 * @property {string | null} fechaInicioVigenciaLicitacion - Fecha de inicio de vigencia de la licitación, si aplica.
 */
export interface AsignacionResponse {
  idAsignacion: number;
  idSolicitud: number;
  idMecanismoAsignacion: number | null;
  cantidadSolicitada: number | null;
  cantidadAprobada: number | null;
  impTotalAprobado: number | null;
  impTotalExpedido: number | null;
  cantidadCancelada: number | null;
  asignacionActiva: boolean;
  aprobada: boolean;
  fechaInicioVigencia: string;
  fechaFinVigenciaSolicitada: string | null;
  fechaFinVigenciaAprobada: string | null;
  ideTipoAsignacionDirecta: string | null;
  idAsignacionR: number | null;
  numFolioAsignacion: number | null;
  numFolioAsignacionTPL: number | null;
  fechaAutorizacion: string | null;
  impAntecedenteAsignacion: number | null;
  idLicitacionPublica: number | null;
  rfcParticipante: string | null;
  impCalculadoProrrata: number | null;
  areaVenta: number | null;
  areaRefrigeracion: number | null;
  impAntecedenteEmpresa: number | null;
  montoDisponible: number | null;
  montoExpedido: number | null;
  añoAutorizacion: number | null;
  saldoMecanismo: number | null;
  saldoMecanismoAsignado: number | null;
  saldoMecanismoExpedido: number | null;
  porcentajeParticipacion: string | null;
  resultadoParcial: number | null;
  fechaInicioVigenciaLicitacion: string | null;
  solicitud: Solicitud | null;
  mecanismoAsignacion: MecanismoAsignacion | null;
  asignacionOrigen: string | null;
  participante: Participante | null;
}

export interface Solicitud {
  modalidad: string | null;
  booleanGenerico: boolean;
  descripcionSistemasMedicion: string | null;
  descripcionLugarEmbarque: string | null;
  numeroPermiso: string | null;
  fechaOperacion: string | null;
  nomOficialAutorizado: string | null;
  notario: Notario | null;
  unidadAdministrativaRepresentacionFederal: UnidadAdministrativaRepresentacionFederal | null;
}

export interface Notario {
  nombreNotario: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  rfc: string;
  numeroActa: string;
  numeroNotaria: string;
  numeroNotario: string;
  delegacionMunicipio: string;
  entidadFederativa: string;
  fechaActa: string;
  numeroRegistro: string;
}

export interface MecanismoAsignacion {
  idMecanismoAsignacion: number;
  nombreMecanismoAsignacion: string;
  documentosMecanismo: string;
  observaciones: string;
  numeroPeriodoVigencia: string;
  ideTipoMecAsignacion: string;
  idePeriodoVigencia: string;
  ideOpinionMecanismo: string;
  descentralizar: boolean;
  fechaInicioVigencia: string;
  fechaFinVigencia: string;
  requiereBeneficiarios: boolean;
  descripcionFundamento: string;
  porcentaje: number;
  fechaEspecifica: string;
  requiereOpinion: boolean;
  numCantidadConstanteAcuerdo: number;
  numCertificadosPermitidos: number;
  fechaInicioRecepSolicitudes: string;
  fechaFinRecepSolicitudes: string;
  fechaProrrata: string;
  ideTipoComprobacionCert: string;
  activo: boolean;
  cveUnidadAdministrativa: string;
  fraccionesPorExpedir: boolean;
  fechaInicioVigenciaCertificados: string;
  fechaFinVigenciaCertificados: string;
  blnRequiereImportador: boolean;
  blnRequiereProductor: boolean;
  emitePEXIM: boolean;
  emiteCEROR: boolean;
  observacionesEmision: string;
  inactivoAutomatico: boolean;
  solicitarMercancia: boolean;
  criterioMecanismo: CriterioMecanismo[];
  repFedMecanismosAsignacion: RepFedMecanismosAsignacion[];
  licitacionPublica: LicitacionPublica[];
  cupo: Cupo;
}

export interface CriterioMecanismo {
  criterioMecanismoAsignacionPK: {
    idMecanismoAsignacion: number;
    idCriterioDictaminacion: number;
  };
}

export interface RepFedMecanismosAsignacion {
  representacionFederalMecanismosAsignacionPK: {
    idMecanismoAsignacion: number;
    cveUnidadAdministrativa: string;
  };
  importeTotal: number;
  importeDisponible: number;
  importeAsignado: number;
  porcentaje: number;
}

export interface LicitacionPublica {
  idLicitacion: number;
  anio: number;
  cantidadMaxima: number;
  fechaLimiteCalificacion: string;
  fechaConcurso: string;
  fechaInicioVigencia: string;
  fechaFinVigencia: string;
  fundamento: string;
  ideTipoConstancia: string;
  ideTipoLicitacion: string;
  numeroLicitacion: string;
  idMecanismoAsignacion: number;
  estado:string;
}

export interface Cupo {
  idCupo: number;
  fechaInicioVigencia: string;
  fechaFinVigencia: string;
  fundamentos: string;
  regimen: string;
  unidadMedidaComercializacion: boolean;
  ideClasifSubproducto: string;
  descSubProductoOtro: string;
  ideTipoCupo: string;
  cveUsuario: string;
  cveProducto: string;
  idTratadoAcuerdo: number;
  cveUnidadMedidaOficialCupo: string;
  idCupoR: number;
  instrumento: string;
  descClasificacionProducto: string;
  montoTotal: number;
  saldoDisponible: number;
  montoAsignado: number;
}

export interface Participante {
  idLicitacionPublica: number | null;
  rfcParticipante: string | null;
  rfc: string | null;
  montoAdjudicado: number | null;
  ganador: boolean;
  tipoParticipante: string;
  montoDisponible: number | null;
  licitacionPublica: LicitacionPublica;
}

/**
 * Representa el detalle de un certificado de expedición en frontera.
 *
 * @property numerio - Número identificador del certificado.
 * @property montoAExpidor - Monto asignado al expedidor del certificado.
 * @property numberoDeCertificado - Número del certificado emitido.
 * @property estado - Estado actual del certificado.
 */
export interface DetalleCertificado {
    numerio: string;
    montoAExpidor: string;
    numberoDeCertificado: string;
    estado: string;
}


/**
 * Representa el detalle de un certificado de frontera.
 *
 * @property follioDeloficioCertificato - Folio del oficio del certificado.
 * @property rfc - Registro Federal de Contribuyentes asociado al certificado.
 * @property numberoDenaminacion - Número de denominación del certificado.
 * @property representationFedral - Representación federal correspondiente.
 */
export interface DetalleCertificadoCertificado {
    follioDeloficioCertificato: string;
    rfc: string;
    numberoDenaminacion: string;
    representationFedral: string;
}

export interface UnidadAdministrativaRepresentacionFederal {
  clave: string;
  idDependencia: string | null;
  claveEntidad: string | null;
  claveUnidadAdminR: string | null;
  ideTipoUnidadAdministrativa: string;
  nivel: string | null;
  acronimo: string;
  nombre: string;
  descripcion: string;
  fechaInicioVigencia: string | null;
  fechaFinVigencia: string | null;
  activo: boolean;
  idDireccion: string | null;
  fronteriza: boolean | null;
  entidadFederativa: EntidadFederativa;
}

export interface EntidadFederativa {
  cveEntidad: string;
  nombre: string;
  codEntidadIdc: string;
  cvePais: string;
  pais: Pais;
  fechaCaptura: string | null;
  fechaInicioVigencia: string | null;
  fechaFinVigencia: string | null;
  activo: boolean;
}

export interface Pais {
  cvePais: string;
  nombre: string;
  fechaCaptura: string | null;
  cveMoneda: string | null;
  cvePaisWco: string;
  nombreAlterno: string;
  fecFinVigencia: string | null;
  fecIniVigencia: string | null;
  blnActivo: boolean;
  restriccion: string | null;
}