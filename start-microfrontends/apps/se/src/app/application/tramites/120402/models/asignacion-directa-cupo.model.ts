/**
 * @fileoverview
 * Este archivo define las interfaces utilizadas en el módulo de asignación directa de cupos.
 * Proporciona estructuras de datos para la selección de cupos en tablas y la descripción detallada de los cupos.
 * 
 * @module AsignacionDirectaCupoModel
 * Este archivo contiene las definiciones de las interfaces necesarias para manejar los datos relacionados con
 * la asignación directa de cupos, incluyendo la selección de cupos en tablas y la descripción detallada de los cupos.
 */

import { Catalogo } from "@libs/shared/data-access-user/src";

/**
 * @interface SeleccionDelCupoTabla
 * Estructura de datos para la selección de un cupo en una tabla.
 */
export interface SeleccionDelCupoTabla {
  /**
   * Identificador único del cupo.
   * @type {string}
   */
  idCupo?: string;
  /**
   * Identificador único del mecanismo de asignación.
   * @type {string}
   */
  idMecanismoAsignacion?: string;
  /**
   * Nombre del producto asociado al cupo.
   * @type {string}
   */
  nombreProducto?: string;

  /**
   * Nombre del subproducto relacionado con el producto principal.
   * @type {string}
   */
  nombreSubproducto?: string;

  /**
   * Mecanismo utilizado para la asignación del cupo.
   * @type {string}
   */
  mecanismoAsignacion?: string;

  /**
   * Fracciones arancelarias asociadas al cupo.
   * @type {string}
   */
  fracciones?: string;

  /**
   * Tipo de cupo asignado.
   * @type {string}
   */
  tipoCupo?: string;
  /** Clave del tipo de cupo asociado al cupo. */
  ideTipoCupo?: string;
  /** Identificador del régimen asociado al cupo. */
  claveRegimen?: string;
  /** Identificador del tratado o acuerdo asociado al cupo. */
  idTratadoAcuerdo?: string;
  /** Clave de la entidad federativa asociada al cupo. */
  claveRepresentacionFederal?: string;
  /** Cantidad disponible del cupo. */
  umCupo?: string;
}

/**
 * @interface DescripcionDelCupo
 * Descripción de un cupo en el sistema.
 */
export interface DescripcionDelCupo {
  /**
   * Identificador único del cupo.
   * @type {string}
   */
  claveDelCupo: string;

  /**
   * Método utilizado para asignar el cupo.
   * @type {string}
   */
  mecanismoDeAsignacion: string;

  /**
   * Descripción del producto asociado al cupo.
   * @type {string}
   */
  descripcionDelProducto: string;

  /**
   * Unidad de medida del producto.
   * @type {string}
   */
  unidadDeMedida: string;

  /**
   * Régimen aduanero aplicable al cupo.
   * @type {string}
   */
  regimenAduanero: string;

  /**
   * Fecha de inicio de la vigencia del cupo (formato ISO 8601).
   * @type {string}
   */
  fechaDeInicioDeVigenciaDelCupo: string;

  /**
   * Fecha de fin de la vigencia del cupo (formato ISO 8601).
   * @type {string}
   */
  fechaDeFinDeVigenciaDelCupo: string;

  /**
   * Fracciones arancelarias asociadas al cupo.
   * @type {string}
   */
  fraccionesArancelarias: string;

  /**
   * Tratado o acuerdo relacionado con el cupo.
   * @type {string}
   */
  tratadoAcuerdo: string;

  /**
   * Países involucrados en el cupo.
   * @type {string}
   */
  paises: string;
}

/**
 * @interface BuscarCuposRequest
 * Estructura de datos para la solicitud de búsqueda de cupos disponibles.
 */
export interface BuscarCuposRequest {
  /**
   * Identificador del tratado o acuerdo.
   * @type {string | null}
   */
  idTratadoAcuerdo: string | null;  
  /**
   * Identificador del régimen.
   * @type {string | null}
   */
  claveRegimen:string | null;
  
  /**
   * Identificador del producto.
   * @type {string | null}
   */
  producto:string | null;
  /**
   * Identificador del subproducto.
   * @type {string | null}
   */
  subproducto:string | null;
  /**
   * Identificador del RFC del beneficiario.
   * @type {string | null}
   */
  rfcBeneficiario:string | null;
  /**
   * Identificador de la unidad administrativa.
   * @type {string | null}
   */
  claveUnidadAdministrativa:string | null;
}

/**
 * @interface SolicitudCupoRequest
 * Solicitud para asignación de cupo.
 */
export interface SolicitudCupoRequest {
  solicitante?: {
    nombre?: string | null;
    rfc?: string | null;
    personaMoral?: boolean | null;
    domicilio?: {
      calle?: string | null;
      numeroExterior?: string | null;
      colonia?: string | null;
      codigoPostal?: string | null;
      entidadFederativa?: {
        cveEntidad?: string | null;
        nombre?: string | null;
      };
      telefono?: string | null;
      correoElectronico?: string | null;
    };
  };

  representacion_federal?: {
    cve_unidad_administrativa?: string | null;
    cve_entidad_federativa?: string | null;
  };

  solicitud?: {
    solicitante?: {
      nombre?: string | null;
      rfc?: string | null;
      personaMoral?: boolean | null;
      domicilio?: {
        calle?: string | null;
        numeroExterior?: string | null;
        colonia?: string | null;
        codigoPostal?: string | null;
        entidadFederativa?: {
          cveEntidad?: string | null;
          nombre?: string | null;
        };
        telefono?: string | null;
        correoElectronico?: string | null;
      };
    };
    seleccionDelCupo?: {
      cveRegimen?: Catalogo | null;
      idTratadoAcuerdo?: Catalogo | null;
      producto?: Catalogo | null;
      subproducto?: Catalogo | null;
      cuposDisponible?: SeleccionDelCupoTabla[] | null;
    };

    mecanismoAsignacion?: {
      idMecanismoAsignacion?: number | null;
      nombreMecanismoAsignacion?: string | null;
      ideTipoMecAsignacion?: string | null;
      fechaInicioVigencia?: string | null;
      fechaFinVigencia?: string | null;
      fechaInicioRecepSolicitudes?: string | null;
      fechaFinRecepSolicitudes?: string | null;
      activo?: boolean | null;

      cupo?: {
        idCupo?: number | null;
        ideTipoCupo?: string | null;
        producto?: {
          nombre?: string | null;
        };
        unidadMedidaOficialCupo?: {
          descripcion?: string | null;
        };
        regimen?: string | null;
        tratadoAcuerdo?: {
          nombre?: string | null;
        };
      };
      solicitarMercancia?: boolean | null;
      fraccionesPorExpedir?: boolean | null;
      blnRequiereProductor?: boolean | null;
      blnRequiereImportador?: boolean | null;
      emitePEXIM?: boolean | null;
      emiteCEROR?: boolean | null;
    };

    domicilio?: {
      calle?: string | null;
      numeroExterior?: string | null;
      colonia?: string | null;
      codigoPostal?: string | null;
      entidadFederativa?: {
        cveEntidad?: string | null;
        nombre?: string | null;
      };
      telefono?: string | null;
      correoElectronico?: string | null;
    };
    recif?: string | null;
    cupos?: SeleccionDelCupoTabla[] | null;
    operacion?: string | null;
    entidadFederativa?:{
      cveEntidad?: string | null;
    }
    asignacion?: {
      cantidadSolicitada?: string | null;
    };
  };
}

/**
 * @interface CupoDisponible
 * Cupo disponible para asignación.
 */
export interface CupoDisponible {
  idCupo?: number | null;
  idMecanismoAsignacion?: number | null;
  nombreProducto?: string | null;
  nombreSubproducto?: string | null;
  mecanismoAsignacion?: string | null;
  fracciones?: string | null;
  tipoCupo?: string | null;
  ideTipoCupo?: string | null;
  claveRegimen?: string | null;
  idTratadoAcuerdo?: number | null;
  claveRepresentacionFederal?: string | null;
  umCupo?: string | null;
}

export interface TablaRowRequest {
  /**
   * Identificador del tratado o acuerdo.
   * @type {number}
   */
  idTratadoAcuerdo: string| number | null;

  /**
   * RFC del solicitante.
   * @type {string}
   */
  rfc: string | null;

  /**
   * Identificador del mecanismo de asignación.
   * @type {number}
   */
  idMecanismoAsignacion: string | number | null;

  /**
   * Identificador del régimen.
   * @type {string}
   */
  claveRegimen: string | null;

  /**
   * Identificador del producto.
   * @type {string | null}
   */
  producto: string | null;

  /**
   * Identificador del subproducto.
   * @type {string | null}
   */
  subproducto: string | null;

  /**
   * RFC del beneficiario.
   * @type {string | null}
   */
  rfcBeneficiario: string | null;

  /**
   * Identificador de la unidad administrativa.
   * @type {string}
   */
  claveUnidadAdministrativa: string | number | null;
}

/**
 * @interface SolicitudResponse
 * Estructura de datos para la respuesta de una solicitud.
 */
export interface SolicitudResponse {
  idSolicitud: number | null;
  fechaCreacion: string | null;
  fechaInicioTramite: string | null;
  fechaEstatus: string | null;
  fechaActualizacion: string | null;
  costo: number | null;
  estadoSolicitud: string | null;
  cveRolCapturista: string | null;
  cveUsuarioCapturista: string | null;
  idPersonaSolicitante: number | null;
  idPeticionWs: number | null;
  blnDepuracionDocProcesada: boolean | null;
  certificadoSerialNumber: string | null;
  idTipoTramite: number | null;
  cveUnidadAdministrativa: string | null;
  numeroFolioTramiteOriginal: string | null;
  esNuevo: boolean | null;
  certSerialNumber: string | null;
  certificado: string | null;
  idPersonaSolicitud: number | null;
  solicitante: unknown | null;
  clave: string | null;
  unidadAdministrativaRepresentacionFederal: unknown | null;
  numFolioTramite: string | null;
  tramite: unknown | null;
  representanteLegalCapturistaGubernamental: unknown | null;
  discriminatorValue: string | null;
  documentosRequeridos: unknown | null;
  listaDocumentos: unknown | null;
  programaEconomia: unknown | null;
  fraccionesAnexoDos: unknown | null;
  fraccionesAnexoTres: unknown | null;
  tipoEmpresaRECIF: unknown | null;
  actividadEconomica: unknown | null;
  actividadProductiva: unknown | null;
  actividadProductivaProsec: unknown | null;
  ambito: unknown | null;
  numeroPermiso: string | null;
  nomOficialAutorizado: string | null;
  actividadEconomicaPreponderante: unknown | null;
  empresaControladora: unknown | null;
  mercanciaPatrimonio: unknown | null;
  cveRegimen: string | null;
  regimen: unknown | null;
  empresaMismoGrupo: unknown | null;
  tipoRegimen: unknown | null;
  tipoSolicitudPexim: unknown | null;
  tipoCaat: unknown | null;
  programaAutorizadoEconomia: unknown | null;
  descripcionOtroTipoDePropietarioAeronave: string | null;
  tratado: unknown | null;
  importeValorComercial: number | null;
  fechaEmbarque: string | null;
  fechaArribo: string | null;
  fechaOperacion: string | null;
  idNormaOficial: number;
  normaAplicable: unknown | null;
  claveTipoCertificado: string | null;
  booleanGenerico: boolean | null;
  claveAduana: string | null;
  ideGenerica1: number | null;
  registroAutomatizado: boolean | null;
  ideGenerica2: number | null;
  ideGenerica3: number | null;
  descripcion: string | null;
  descripcionClobGenerica1: string | null;
  descripcionClobGenerica2: string | null;
  descripcionSistemasMedicion: string | null;
  booleanIMMEX: boolean | null;
  periodoDictaminacion: string | null;
  motivo: string | null;
  numAutorizacion: string | null;
  domicilio: unknown | null;
  denominacionExposicion: string | null;
  descripcionGenerica2: string | null;
  fechaIniExposicion: string | null;
  fechaFinExposicion: string | null;
  consolidacionCargas: unknown | null;
  tipoTransito: unknown | null;
  tipoProgFomExp: unknown | null;
  idAsignacion: number | null;
  observaciones: string | null;
  fechaPropuestaVisita: string | null;
  clavePais: string | null;
  tienePrioridad: boolean | null;
  numeroProgramaImmex: string | null;
  informacionConfidencial: unknown | null;
  clavePermisoSedena: string | null;
  numeroPermisoCNSNS: string | null;
  actividadEnDestino: unknown | null;
  locacion: unknown | null;
  idFraccionGob: number | null;
  idFolioExternoOriginal: string | null;
  descripcionEspecificaciones: string | null;
  coordenadasGeograficas: string | null;
  justificacionTecnica: string | null;
  numeroRegistro: string | null;
  plazo: string | null;
  descripcionLugarEmbarque: string | null;
  establecimientoTIF: unknown | null;
  capacidadAlmacenamiento: string | null;
  mecanismoAsignacion: MecanismoAsignacionResponse | null;
  recif: unknown | null;
  cupos: unknown | null;
  beneficiario: unknown | null;
  numeroOficioDeAsignacion: string | null;
  operacion: unknown | null;
  asignacion: unknown | null;
  asignacionBusqueda: unknown | null;
  descripcionMercancia: string | null;
  entidadFederativa: unknown | null;
  seleccionDelCupo: unknown | null;
}

export interface MecanismoAsignacionResponse {
  /** Criterio del mecanismo. */
  criterioMecanismo: string | null;

  /** Representación federal de mecanismos de asignación. */
  repFedMecanismosAsignacion: unknown | null;

  /** Nombre del mecanismo de asignación. */
  nombreMecanismoAsignacion: string | null;

  /** Documentos asociados al mecanismo. */
  documentosMecanismo: unknown | null;

  /** Identificador del mecanismo de asignación. */
  idMecanismoAsignacion: number | null;

  /** Observaciones del mecanismo. */
  observaciones: string | null;

  /** Número del periodo de vigencia. */
  numeroPeriodoVigencia: string | null;

  /** Tipo de mecanismo de asignación. */
  ideTipoMecAsignacion: string | null;

  /** Identificador del periodo de vigencia. */
  idePeriodoVigencia: string | null;

  /** Opinión del mecanismo. */
  ideOpinionMecanismo: unknown | null;

  /** Indica si se descentraliza. */
  descentralizar: boolean;

  /** Fecha de inicio de vigencia. */
  fechaInicioVigencia: string | null;

  /** Fecha de fin de vigencia. */
  fechaFinVigencia: string | null;

  /** Indica si requiere beneficiarios. */
  requiereBeneficiarios: boolean;

  /** Descripción del fundamento. */
  descripcionFundamento: string | null;

  /** Porcentaje aplicable. */
  porcentaje: number | null;

  /** Fecha específica, si aplica. */
  fechaEspecifica: string | null;

  /** Indica si requiere opinión. */
  requiereOpinion: boolean;

  /** Cantidad constante según acuerdo. */
  numCantidadConstanteAcuerdo: number | null;

  /** Número de certificados permitidos. */
  numCertificadosPermitidos: number | null;

  /** Fecha de inicio de recepción de solicitudes. */
  fechaInicioRecepSolicitudes: string | null;

  /** Fecha de fin de recepción de solicitudes. */
  fechaFinRecepSolicitudes: string | null;

  /** Fecha de prorrata. */
  fechaProrrata: string | null;

  /** Tipo de comprobación del certificado. */
  ideTipoComprobacionCert: string | null;

  /** Indica si está activo. */
  activo: boolean;

  /** Clave de la unidad administrativa. */
  cveUnidadAdministrativa: string | null;

  /** Indica si hay fracciones por expedir. */
  fraccionesPorExpedir: boolean;

  /** Inicio de vigencia de certificados. */
  fechaInicioVigenciaCertificados: string | null;

  /** Fin de vigencia de certificados. */
  fechaFinVigenciaCertificados: string | null;

  /** Indica si requiere importador. */
  blnRequiereImportador: boolean;

  /** Indica si requiere productor. */
  blnRequiereProductor: boolean;

  /** Indica si emite PEXIM. */
  emitePEXIM: boolean;

  /** Indica si emite CEROR. */
  emiteCEROR: boolean;

  /** Observaciones para la emisión. */
  observacionesEmision: string | null;

  /** Inactivación automática. */
  inactivoAutomatico: string | null;

  /** Información del cupo asociado. */
  cupo: Cupo | null;

  /** Indica si se solicita mercancía. */
  solicitarMercancia: boolean;

  /** Tipo de licitación pública. */
  licitacionPublica: unknown | null;
}

/** Subinterfaz: Cupo */
export interface Cupo {
  idCupo: number | null;
  descClasificacionProducto: string | null;
  cveProducto: string | null;
  descSubproductoOtro: string | null;
  ideClasifSubproducto: string | null;
  cveUmOficialCupo: string | null;
  idTratadoAcuerdo: string | null;
  ideRegimen: string | null;
  fechaInicioVigencia: string | null;
  fechaFinVigencia: string | null;
  unidadMedidaComercializacion: string | null;
  paisesCupo: unknown | null;
  fraccionesCupo: unknown | null;
  fundamentos: string | null;
  instrumento: string | null;
  regimen: string | null;
  clasificacionProducto: string | null;
  ideTipoCupo: string | null;
  cveUsuario: string | null;
  producto: Producto | null;
  tratadoAcuerdo: unknown | null;
  cveUnidadMedidaOficialCupo: string | null;
  cupoPrincipal: unknown | null;
  subcupos: unknown | null;
  categoriaTextilCupo: unknown | null;
  mecanismosAsignacion: unknown | null;
  categoriaTextilHelpers: unknown | null;
  montoTotal: number | null;
  saldoDisponible: number | null;
  montoAsignado: number | null;
}

/** Subinterfaz: Producto */
export interface Producto {
  clave: string | null;
  sigla: string | null;
  nombre: string | null;
  descripcion: string | null;
  fechaCaptura: string | null;
  fechaInicioVigencia: string | null;
  fechaFinVigencia: string | null;
  blnActivo: boolean;
}



