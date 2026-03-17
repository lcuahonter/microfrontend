/**
 * Modelo de datos para la respuesta de licitaciones.
 * Contiene información detallada sobre licitaciones, participantes y tipos de trámite.
 * @interface LicitacionesResponse - Representa la estructura de la respuesta de licitaciones.
 */
export interface LicitacionesResponse {
  /** Identificador único de la solicitud */
    idSolicitud: number;
    /** Identificador del mecanismo */
    fechaCreacion: string;
    /** Identificador del mecanismo */
    fechaInicioTramite: string;
  /** Identificador del mecanismo */
    fechaEstatus: string;
    /** Identificador del mecanismo */
    fechaActualizacion: string;
    /** Identificador del mecanismo */
    costo: number;
    /** Lista de licitaciones */
    estadoSolicitud: string;
    /** Lista de licitaciones */
    cveRolCapturista: string;
    /** Lista de licitaciones */
    cveUsuarioCapturista: string;
    /** Lista de licitaciones */
    idPersonaSolicitante: number;
    /** Lista de licitaciones */
    idPeticionWs: number;
    /** Lista de licitaciones */
    blnDepuracionDocProcesada: boolean;
    /** Datos de licitaciones */
    certificadoSerialNumber: string;
    /** Identificador del tipo de trámite */
    idTipoTramite: number;
    /** Datos de licitaciones */
    cveUnidadAdministrativa: string;
    /** Monto máximo */
    numeroFolioTramiteOriginal: string;
    /** Datos de licitaciones */
    esNuevo: boolean;
    /** Datos de licitaciones */
    certSerialNumber: string;
    /** Datos de licitaciones */
    certificado: string;
    /** Datos de licitaciones */
    idPersonaSolicitud: number;
    /** Datos de licitaciones */
    solicitante: string;
    /** Datos de licitaciones */
    clave: string;
    /** Datos de licitaciones */
    unidadAdministrativaRepresentacionFederal: string;
    /** Número de folio del trámite. */
    numFolioTramite: string;

    /** Identificador del trámite. */
    tramite: string;

    /** Representante legal o capturista gubernamental. */
    representanteLegalCapturistaGubernamental: string;

    /** Valor discriminador del trámite. */
    discriminatorValue: string;

    /** Documentos requeridos para el trámite. */
    documentosRequeridos: string;

    /** Lista de documentos asociados. */
    listaDocumentos: string;

    /** Programa de economía aplicado. */
    programaEconomia: string;

    /** Fracciones del Anexo Dos. */
    fraccionesAnexoDos: string;

    /** Fracciones del Anexo Tres. */
    fraccionesAnexoTres: string;

    /** Tipo de empresa RECIF. */
    tipoEmpresaRECIF: string;

    /** Actividad económica declarada. */
    actividadEconomica: string;

    /** Actividad productiva principal. */
    actividadProductiva: string;

    /** Actividad productiva relacionada con PROSEC. */
    actividadProductivaProsec: string;

    /** Ámbito o área correspondiente. */
    ambito: string;

    /** Número de permiso asociado. */
    numeroPermiso: string;

    /** Nombre del oficial autorizado. */
    nomOficialAutorizado: string;

    /** Actividad económica preponderante. */
    actividadEconomicaPreponderante: string;

    /** Indica si hay empresa controladora. */
    empresaControladora: string;

    /** Mercancía perteneciente al patrimonio. */
    mercanciaPatrimonio: string;

    /** Clave del régimen. */
    cveRegimen: string;

    /** Nombre del régimen. */
    regimen: string;

    /** Indica si es empresa del mismo grupo. */
    empresaMismoGrupo: string;

    /** Tipo de régimen aplicado. */
    tipoRegimen: string;

    /** Tipo de solicitud PEXIM. */
    tipoSolicitudPexim: string;

    /** Tipo de CAAT. */
    tipoCaat: string;

    /** Programa autorizado por economía. */
    programaAutorizadoEconomia: string;

    /** Descripción para otro tipo de propietario de aeronave. */
    descripcionOtroTipoDePropietarioAeronave: string;

    /** Tratado comercial aplicable. */
    tratado: string;

    /** Importe del valor comercial. */
    importeValorComercial: number;

    /** Fecha de embarque. */
    fechaEmbarque: string;

    /** Fecha de arribo. */
    fechaArribo: string;

    /** Fecha de operación. */
    fechaOperacion: string;

    /** Identificador de la norma oficial. */
    idNormaOficial: number;

    /** Norma aplicable al trámite. */
    normaAplicable: string;

    /** Clave del tipo de certificado. */
    claveTipoCertificado: string;

    /** Valor booleano genérico. */
    booleanGenerico: boolean;

    /** Clave de la aduana. */
    claveAduana: string;

    /** Identificador genérico 1. */
    ideGenerica1: string;

    /** Indica si el registro es automatizado. */
    registroAutomatizado: boolean;

    /** Identificador genérico 2. */
    ideGenerica2: string;

    /** Identificador genérico 3. */
    ideGenerica3: string;

    /** Descripción general. */
    descripcion: string;

    /** Descripción extendida genérica 1. */
    descripcionClobGenerica1: string;

    /** Descripción extendida genérica 2. */
    descripcionClobGenerica2: string;

    /** Descripción de sistemas de medición. */
    descripcionSistemasMedicion: string;

    /** Indica si aplica IMMEX. */
    booleanIMMEX: boolean;

    /** Periodo de dictaminación. */
    periodoDictaminacion: string;

    /** Motivo del trámite. */
    motivo: string;

    /** Número de autorización. */
    numAutorizacion: string;

    /** Domicilio relacionado. */
    domicilio: string;

    /** Denominación de la exposición. */
    denominacionExposicion: string;

    /** Descripción genérica 2. */
    descripcionGenerica2: string;

    /** Fecha de inicio de la exposición. */
    fechaIniExposicion: string;

    /** Fecha de fin de la exposición. */
    fechaFinExposicion: string;

    /** Detalles sobre consolidación de cargas. */
    consolidacionCargas: string;

    /** Tipo de tránsito. */
    tipoTransito: string;

    /** Tipo de programa de fomento a la exportación. */
    tipoProgFomExp: string;

    /** Identificador de la asignación. */
    idAsignacion: number;

    /** Observaciones generales. */
    observaciones: string;

    /** Fecha propuesta para la visita. */
    fechaPropuestaVisita: string;

    /** Clave del país. */
    clavePais: string;

    /** Indica si el trámite tiene prioridad. */
    tienePrioridad: boolean;

    /** Número del programa IMMEX. */
    numeroProgramaImmex: string;

    /** Información confidencial. */
    informacionConfidencial: string;

    /** Clave del permiso SEDENA. */
    clavePermisoSedena: string;

    /** Número del permiso CNSNS. */
    numeroPermisoCNSNS: string;

    /** Actividad a realizar en destino. */
    actividadEnDestino: string;

    /** Locación indicada. */
    locacion: string;

    /** Identificador de fracción gubernamental. */
    idFraccionGob: number;

    /** Folio externo original. */
    idFolioExternoOriginal: string;

    /** Descripción de especificaciones. */
    descripcionEspecificaciones: string;

    /** Coordenadas geográficas. */
    coordenadasGeograficas: string;

    /** Justificación técnica. */
    justificacionTecnica: string;

    /** Número de registro. */
    numeroRegistro: string;

    /** Plazo estimado. */
    plazo: string;

    /** Descripción del lugar de embarque. */
    descripcionLugarEmbarque: string;

    /** Establecimiento TIF. */
    establecimientoTIF: string;

    /** Capacidad de almacenamiento. */
    capacidadAlmacenamiento: string;

    /** Datos de licitación pública. */
    licitacionPublica: LicitacionPublica;

    /** Asignación del trámite. */
    asignacion: string;

    /** Información del participante. */
    participante: Participante;

    /** Montos del certificado. */
    montosCertificado: string;

    /** Identificador de licitación. */
    idLicitacion: number;

    /** Monto a transferir. */
    montoTransferir: number;

    /** Monto máximo a transferir. */
    maximoTransferir: number;

    /** Fecha del encabezado. */
    fechaEncabezado: string;

    /** Participantes de la licitación. */
    participantesLicitacion: ParticipanteLicitacion[];

    /** Lista de fracciones arancelarias. */
    fraccionArancelaria: string[];

    /** Tipo de trámite. */
    tipoTramite: TipoTramite;

    /** Entidad federativa. */
    entidadFederativa: string;
}
/**
 * Modelo de datos para licitación pública.
 * Contiene información detallada sobre una licitación específica.
 * @interface LicitacionPublica - Representa la estructura de una licitación pública.
 */
export interface LicitacionPublica {
  /** Identificador único de la licitación */
    idLicitacion: number;
    /** Año de la licitación */
    anio: number;
    /** Cantidad máxima asignada en la licitación */
    cantidadMaxima: number;
    /** Fecha límite para la calificación de la licitación */
    fechaLimiteCalificacion: string;
    /** Fecha del concurso de la licitación */
    fechaConcurso: string;
    /** Fecha de inicio de vigencia de la licitación */
    fechaInicioVigencia: string;
    /** Fecha de fin de vigencia de la licitación */
    fechaFinVigencia: string;
    /** Fundamento legal de la licitación */
    fundamento: string;
    /** Identificador del tipo de constancia */
    ideTipoConstancia: string;
    /** Identificador del tipo de licitación */
    ideTipoLicitacion: string;
    /** Número de la licitación */
    numeroLicitacion: string;
    /** Identificador del mecanismo de asignación */
    idMecanismoAsignacion: number;
    /** Nombre del producto asociado a la licitación */
    producto: string;
    /** Unidad de medida tarifaria del producto */
    unidadMedidaTarifaria: string;
    /** Bloque comercial asociado a la licitación */
    bloqueComercial: string;
    /** Países involucrados en la licitación */
    paises: string;
}

/**
 * Modelo de datos para participante en una licitación.
 * Contiene información detallada sobre un participante específico.
 * @interface Participante - Representa la estructura de un participante en una licitación.
 */
export interface Participante {
  /** Identificador único del participante en la licitación */
    idLicitacionPublica: number;
    /** RFC del participante */
    rfcParticipante: string;
    /** Monto adjudicado al participante */
    rfc: string;
    /** Monto adjudicado al participante */
    montoAdjudicado: number;
    /** Indica si el participante es el ganador de la licitación */
    ganador: boolean;
    /** Tipo de participante en la licitación */
    tipoParticipante: string;
    /** Nombre del participante */
    licitacionPublica: string;
    /** Monto disponible para el participante */
    montoDisponible: number;
}

/**
 * Modelo de datos para participante en una licitación.
 * Contiene información detallada sobre un participante específico.
 * @interface ParticipanteLicitacion - Representa la estructura de un participante en una licitación.
 */
export interface ParticipanteLicitacion {
  /** RFC del participante */
    rfc: string;
    /** Monto adjudicado al participante */
    montoDisponible: number;
}

/**
 * Modelo de datos para el payload de guardar solicitud.
 * Contiene información detallada necesaria para guardar una solicitud.
 * @interface GuardarPayload - Representa la estructura del payload para guardar una solicitud.
 */
export interface TipoTramite {
  /** Identificador del tipo de trámite */
    vigencia: string;
    /** Identificador del tipo de trámite */
    idTipoTramite: number;
    /** Descripción del tipo de trámite */
    servicio: string;
    /** Descripción del servicio */
    descripcionServicio: string;
    /** Subservicio asociado al trámite */
    subservicio: string;
    /** Descripción del subservicio */
    descripcionSubservicio: string;
    /** Modalidad del trámite */
    modalidad: string;
    /** Descripción de la modalidad */
    descripcionModalidad: string;
    /** Flujo del trámite */
    flujo: string;
    /** Descripción del flujo */
    descripcionFlujo: string;
    /** Nivel del servicio */
    nivelServicio: string;
    /** Nombre del servicio en Axway */
    nombreServicioAxway: string;
    /** Nombre del mensaje en Axway */
    nombreMensajeAxway: string;
    /** URL de Axway */
    urlAxway: string;
    /** Clave de la unidad administrativa responsable */
    cveUnidadAdmResponsable: string;
    /** Fecha de captura */
    fechaCaptura: string;
    /** Dependencia asociada al trámite */
    dependencia: string;
    /** Declaraciones asociadas al trámite */
    declaraciones: string;
    /** Documentos asociados al trámite */
    documentos: string;
    /** Nombre del trámite */
    nombre: string;
    /** Indica si se replica la información */
    blnReplicaInfo: boolean;
    /** Indica si el trámite es automático */
    blnAutomatico: boolean;
    /** Clave del módulo */
    claveModulo: number;
    /** Indica si requiere verificación */
    requiereVerificacion: string;
    /** Indica si está asignado */
    asignado: string;
    /** Indica la suplencia */
    suplencia: string;
    /** Nivel del rol */
    nivelRol: string;
    /** Lista de tipos de trámite */
    listTipoTramite: [];
    /** Descripción corta del trámite */
    descripcionCorta: string;
    /** Contexto del trámite */
    context: string;
    /** Acción SSO asociada al trámite */
    actionSSO: string;
}

/**
 * Modelo de datos para el payload de guardar solicitud.
 * Contiene información detallada necesaria para guardar una solicitud.
 * @interface GuardarPayload - Representa la estructura del payload para guardar una solicitud.
 */
export interface LicitacionResponse {
  /** Identificador único de la asignación */
    idAsignacion: number;
    /** Número de la licitación */
    numeroLicitacion: string;
    /** Monto adjudicado en la licitación */
    montoAdjudicado: number;
    /** Fecha de inicio de vigencia */
    fechaInicioVigencia: string;
    /** Fecha de fin de vigencia aprobada */
    fechaFinVigenciaAprobada: string;
    /** Nombre del producto asociado a la licitación */
    nombreProducto: string;
    /** Fecha del concurso de la licitación */
    fechaConcurso: string;
}

/**
 * Modelo de datos para participante en una licitación.
 * Contiene información detallada sobre un participante específico.
 * @interface ParticipantesData - Representa la estructura de un participante en una licitación.
 */
export interface ParticipantesData {
  /** RFC del participante */
    rfc: string;
    /** Monto adjudicado al participante */
    montoAdjudicado: number;
}

/**
 * Modelo de datos para la respuesta JSON de licitaciones.
 * Contiene código, mensaje y datos relacionados con licitaciones.
 * @interface JSONResponse - Representa la estructura de la respuesta JSON de licitaciones.
 */
export interface JSONResponse {
  /** Código de la respuesta */
  codigo: string;
  /** Mensaje de la respuesta */
  mensaje: string;
  /** Datos relacionados con licitaciones */
  datos: {
    licitaciones: Licitacion[];
  };
}

/** Modelo de datos para la solicitud de trámite.
 * Contiene información detallada necesaria para una solicitud de trámite.
 * @interface Solicitud120501Payload - Representa la estructura de la solicitud de trámite.
 */
export interface Licitacion {
  /** Identificador único de la asignación */
  idAsignacion: number;
  /** Número de la licitación */
  numeroLicitacion: string;
  /** Monto adjudicado en la licitación */
  montoAdjudicado: number;
  /** Fecha de inicio de vigencia */
  fechaInicioVigencia: string;
  /** Fecha de fin de vigencia aprobada */
  fechaFinVigenciaAprobada: string;
  /** Nombre del producto asociado a la licitación */
  nombreProducto: string;
  /** Fecha del concurso de la licitación */
  fechaConcurso: string;
}

/**
 * Modelo de datos para la solicitud de trámite.
 * Contiene información detallada necesaria para una solicitud de trámite.
 * @interface Solicitud120501Payload - Representa la estructura de la solicitud de trámite.
 */
export interface JSONLicitacionesResponse {
  /** Código de la respuesta */
  codigo: string;
  /** Mensaje de la respuesta */
  mensaje: string;
  /** Datos relacionados con licitaciones */
  datos: LicitacionesResponse;
}
