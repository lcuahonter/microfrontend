import { Cancelacion } from '../../tramites/140104/models/cancelacion-de-solicitus.model';

/**
 * Payload para el detalle del permiso.
 * Contiene la información estructurada necesaria para procesar el detalle de un permiso,
 * incluyendo datos de la solicitud, solicitante y cancelaciones asociadas.
 */
export interface DetalleDelPermisoGuardarPayload {
  /** Información de la solicitud */
  solicitud: {
    /** Identificador de la solicitud */
    idSolicitud: string;
    /** Valor discriminador para la solicitud */
    discriminatorValue: string;
    /** Clave del rol del capturista */
    cveRolCapturista: string;
    /** Clave del usuario capturista */
    cveUsuarioCapturista: string;
    /** Información del solicitante */
    solicitante: {
      /** Clave del usuario solicitante */
      cveUsuario: string;
      /** RFC del solicitante */
      rfc: string;
      /** Razón social del solicitante */
      razonSocial: string;
      /** Descripción del giro del solicitante */
      descripcionGiro: string;
      /** Correo electrónico del solicitante */
      correoElectronico: string;
      /** Teléfono del solicitante */
      telefono: string;
      /** Domicilio del solicitante */
      domicilio: {
        /** País del domicilio */
        pais: { clave: string; nombre: string };
        /** Entidad federativa del domicilio */
        entidadFederativa: { clave: string; nombre: string };
        /** Delegación o municipio del domicilio */
        delegacionMunicipio: { clave: string; nombre: string };
        /** Colonia del domicilio */
        colonia: { clave: string; nombre: string };
        /** Localidad del domicilio */
        localidad: { clave: string; nombre: string };
        /** Código postal del domicilio */
        codigoPostal: string;
        /** Calle del domicilio */
        calle: string;
        /** Número exterior del domicilio */
        numeroExterior: string;
        /** Número interior del domicilio */
        numeroInterior: string;
      };
    };
  };
  /** Indica si puede capturar representante legal CG */
  puedeCapturarRepresentanteLegalCG: boolean;
  /** Clave de la entidad federativa */
  claveEntidadFederativa: string;
  /** Identificador del trámite */
  idTramite: string;
  /** Motivo de la cancelación */
  motivoCancelacion: string;
  /** Lista de folios de trámites cancelados */
  numeroFolioTramiteCancelados: Cancelacion[];
}

/**
 * Payload para buscar el detalle del permiso.
 * Contiene los parámetros necesarios para realizar la búsqueda de un permiso específico.
 */
export interface DetalleDelBuscarPayload {
  /** Identificador de la solicitud */
  id_solicitud: number;
  /** RFC del solicitante */
  rfc_solicitante: string;
  /** Clave de la entidad federativa */
  clave_entidad_federativa: string;
  /** Identificador del tipo de trámite */
  id_tipo_tramite: number;
  /** Folio a cancelar */
  folio_cancelar: string;
}

/**
 * Respuesta al buscar el detalle del permiso.
 * Contiene la información obtenida tras la búsqueda de un permiso.
 */
export interface DetalleDelBuscarResponse {
  /** Aviso relacionado con el permiso */
  aviso: string | null;
  /** Cantidad autorizada en el permiso */
  cantidadAutorizada: number | null;
  /** Cantidad solicitada en el permiso */
  cantidadSolicitada: number | null;
  /** Clasificación del régimen */
  clasificacionRegimen: string | null;
  /** Clave de la entidad federativa del solicitante */
  claveEntidadFederativaSolicitante: string | null;
  /** Condición de la mercancía */
  condicionMercancia: string | null;
  /** Descripción de la mercancía */
  descripcionMercancia: string | null;
  /** Esquema de regla octava */
  esquemaReglaOctava: string | null;
  /** Fecha de fin de vigencia del permiso */
  fechaFinVigencia: string | null;
  /** Fecha de inicio de vigencia del permiso */
  fechaInicioVigencia: string | null;
  /** Fracción arancelaria */
  fraccion: string | null;
  /** Indica si es general */
  general: string | null;
  /** Identificador de la resolución */
  idResolucion: number | null;
  /** Identificador de la solicitud */
  idSolicitud: number | null;
  /** Identificador temporal de la solicitud */
  idSolicitudTemporal: number | null;
  /** Identificador del tipo de trámite */
  idTipoTramite: number | null;
  /** Identificador del estado de la resolución */
  ideEstadoResolucion: string | null;
  /** Identificador del estado de la solicitud */
  ideEstadoSolicitud: string | null;
  /** Justificación de la solicitud */
  justificacion: string | null;
  /** Número de folio del trámite */
  numFolioTramite: string | null;
  /** Número de resolución */
  numeroResolucion: string | null;
  /** Observaciones relacionadas con el permiso */
  observacion: string | null;
  /** Países involucrados */
  paises: string | null;
  /** Régimen de la mercancía */
  regimen: string | null;
  /** RFC del solicitante */
  rfcSolicitante: string | null;
  /** Saldo disponible en el permiso */
  saldoDisponible: number | null;
  /** Texto del dictamen */
  textoDictamen: string | null;
  /** Tipo de solicitud */
  tipoSolicitud: string | null;
  /** Tipo de solicitud PEXIM */
  tipoSolicitudPexim: string | null;
  /** Unidad de medición */
  unidadMedicion: string | null;
  /** Unidad de medida UMC */
  unidadMedidaUMC: string | null;
  /** Unidad de medida UMT */
  unidadMedidaUMT: string | null;
  /** Uso específico de la mercancía */
  usoEspecifico: string | null;
  /** Valor de la factura en USD */
  valorFacturaUSD: number | null;
  /** Valor solicitado en el permiso */
  valorSolicitado: number | null;
}