/**
 * Interfaz que representa la forma de una solicitud de prórroga.
 */
export interface SolicitudForma {
  /**
   * Folio de la solicitud.
   */
  folio?: string;
  /**
   * Fecha de creación de la solicitud.
   */
  fechaInicio?: string;
  /**
   * Estatus de la solicitud.
   */
  estatusSolicitud?: string;
  /**
   * Folio de la resolución.
   */
  folioResolucion?: string;
}

/**
 * Interfaz que representa la respuesta de los datos.
 */
export interface RespuestaDatos {
  /**
   * Código de la respuesta.
   */
  code: number;
  /**
   * Datos de la respuesta.
   */
  data: SolicitudForma[];
  /**
   * Mensaje de la respuesta.
   */
  message: string;
}

/**
 * Interfaz que representa los datos del trámite.
 */
export interface DatosDelTramite {
  /**
   * Número de folio del trámite original.
   */
  numeroFolioTramiteOriginal: string;
  /**
   * Opción de la solicitud.
   */
  solicitudOpcion: string;
  /**
   * Régimen del trámite.
   */
  regimen: string;
  /**
   * Clasificación del régimen.
   */
  clasificacionDelRegimen: string;
  /**
   * Opción del producto.
   */
  productoOpcion: string;
  /**
   * Descripción de la mercancía.
   */
  descripcionMercancia: string;
  /**
   * Fracción arancelaria.
   */
  fraccionArancelaria: string;
  /**
   * Unidad de medida de la mercancía.
   */
  umt: string;
  /**
   * Cantidad de la mercancía.
   */
  cantidad: string;
  /**
   * Valor de la factura.
   */
  valorFactura: string;
}

/**
 * Interfaz que representa la solicitud de los datos del trámite.
 */
export interface RequestDatosDelTramite {
  /**
   * Código de la respuesta.
   */
  code: number;
  /**
   * Datos del trámite.
   */
  data: DatosDelTramite[];
  /**
   * Mensaje de la respuesta.
   */
  message: string;
}

/**
 * Interfaz que representa la información de las partidas.
 */
export interface PartidasInfo {
  /**
   * Serial de la partida.
   */
  serial: string;
  /**
   * Unidades autorizadas de la partida.
   */
  unidadesAutorizadas: string;
  /**
   * Descripción autorizada de la partida.
   */
  descripcionAutorizada: string;
  /**
   * Importe unitario autorizado en USD.
   */
  importeUnitarioUSDAutorizado: string;
  /**
   * Importe total autorizado en USD.
   */
  importeTotalUSDAutorizado: string;
}

/**
 * Constante que define la configuración de la tabla de partidas.
 */
export const PARTIDAS_TABLA = [
  {
    encabezado: '',
    clave: (ele: PartidasInfo): string => ele.serial,
    orden: 1,
  },
  {
    encabezado: 'Cantidad',
    clave: (ele: PartidasInfo): string => ele.unidadesAutorizadas,
    orden: 2,
  },
  {
    encabezado: 'Descripción',
    clave: (ele: PartidasInfo): string => ele.descripcionAutorizada,
    orden: 3,
  },
  {
    encabezado: 'Precio unitario USD',
    clave: (ele: PartidasInfo): string => ele.importeUnitarioUSDAutorizado,
    orden: 4,
  },
  {
    encabezado: 'Total USD',
    clave: (ele: PartidasInfo): string => ele.importeTotalUSDAutorizado,
    orden: 5,
  },
];

/**
 * Interfaz que representa la respuesta de la tabla de partidas.
 */
export interface RespuestaTabla {
  /**
   * Código de la respuesta.
   */
  code: number;
  /**
   * Datos de la tabla de partidas.
   */
  data: PartidasInfo[];
  /**
   * Mensaje de la respuesta.
   */
  message: string;
}

/**
 * Interfaz que representa las partidas de la forma.
 */
export interface PartidasForma {
  /**
   * Uso específico de la mercancía.
   */
  usoEspecificoMercancia: string;
  /**
   * Justificación del beneficio.
   */
  justificacionBeneficio: string;
  /**
   * Observaciones adicionales.
   */
  observaciones: string;
  /**
   * Representación federal.
   */
  representacionFederal: string;
}

/**
 * Interfaz que representa la solicitud de las partidas de la forma.
 */
export interface RequestPartidasForma {
  /**
   * Código de la respuesta.
   */
  code: number;
  /**
   * Datos de las partidas de la forma.
   */
  data: PartidasForma[];
  /**
   * Mensaje de la respuesta.
   */
  message: string;
}

/**
 * Interfaz que representa el certificado Kimberley de la forma.
 */
export interface CertificadoKimberleyForma {
  /**
   * Certificados emitidos.
   */
  certificadosEmitidos: string;
  /**
   * Número del certificado Kimberley.
   */
  numeroCertificadokimberley: string;
  /**
   * Nombre inglés del país de origen.
   */
  nombreIngles: string;
  /**
   * Nombre exportador.
   */
  nombreExportador: string;
  /**
   * Dirección del exportador.
   */
  direccionExportador: string;
  /**
   * Nombre importador.
   */
  nombreImportador: string;
  /**
   * Dirección del importador.
   */
  direccionImportador: string;
  /**
   * Número en letra.
   */
  numeroEnLetra: string;
  /**
   * Número en letra inglés.
   */
  numeroEnLetraIngles: string;
  /**
   * Número de factura.
   */
  numeroFactura: string;
  /**
   * Cantidad de quilates.
   */
  cantidadQuilates: string;
  /**
   * Valor de los diamantes.
   */
  valorDiamantes: string;
  /**
   * País emisor del certificado.
   */
  paisEmisorCertificado: string;
  /**
   * Indica si el origen es mixto.
   */
  mixed: boolean;
  /**
   * País de origen.
   */
  paisDeOrigen: string;
}

/**
 * Interfaz que representa la solicitud del certificado Kimberley de la forma.
 */
export interface RequestCertificadoKimberleyForma {
  /**
   * Código de la respuesta.
   */
  code: number;
  /**
   * Datos del certificado Kimberley de la forma.
   */
  data: CertificadoKimberleyForma[];
  /**
   * Mensaje de la respuesta.
   */
  message: string;
}

/**
 * Interfaz que representa la forma de las prórrogas.
 */
export interface ProrrogasForma {
  /**
   * Folio de resolución.
   */
  folioResolucion: string;
  /**
   * Cantidad de la prórroga.
   */
  cantidad: string;
  /**
   * Fecha de inicio de la prórroga.
   */
  prorrogaDel: string;
  /**
   * Fecha de fin de la prórroga.
   */
  prorrogaAl: string;
}

/**
 * Interfaz que representa la solicitud de las prórrogas de la forma.
 */
export interface RequestProrrogasForma {
  /**
   * Código de la respuesta.
   */
  code: number;
  /**
   * Datos de las prórrogas de la forma.
   */
  data: ProrrogasForma[];
  /**
   * Mensaje de la respuesta.
   */
  message: string;
}

/**
 * Interfaz que representa la información de las prórrogas.
 */
export interface ProrrogasInfo {
  /**
   * Fecha de creación de la prórroga.
   */
  fechaCreacion: string;
  /**
   * Fecha de inicio de la prórroga.
   */
  fechaInicio: string;
  /**
   * Fecha de fin de la prórroga.
   */
  fechaFin: string;
}

/**
 * Constante que define la configuración de la tabla de prórrogas.
 */
export const PRORROGAS_TABLA = [
  {
    encabezado: 'Fecha solicitud',
    clave: (ele: ProrrogasInfo): string => ele.fechaCreacion,
    orden: 1,
  },
  {
    encabezado: 'Fecha inicial',
    clave: (ele: ProrrogasInfo): string => ele.fechaInicio,
    orden: 2,
  },
  {
    encabezado: 'Fecha final',
    clave: (ele: ProrrogasInfo): string => ele.fechaFin,
    orden: 3,
  },
];

/**
 * Interfaz que representa la respuesta de la validación del folio de permiso.
 */
export interface ValidacionFolioPermisoResponse {
  /**
   * Código de la respuesta.
   */  
  codigo: string;
  /**
   * Mensaje de la respuesta.
   */
  mensaje: string;
  /**
   * Datos del folio de permiso. 
   */
  datos: DatosFolioPermiso;
}

/**
 * Interfaz que representa los datos del folio de permiso.
 */
export interface DatosFolioPermiso {
  /**
   * ID de la solicitud de las partidas.
   */
  idSolicitud: string;
  /**
   * Estado de la solicitud.
   */
  estatdoSolicitud: string;
  /**
   * Folio de resolución asociado al permiso.
   */
  folioResolucion: string;
  /**
   * Número de folio de la prórroga.
   */
  numeroFolio: string;
  /**
   * Información de la solicitud.
   */
  solicitud: SolicitudInfo;
  /**
   * Información del trámite.
   */
  tramite: TramiteInfo;
  /**
   * Países relacionados con la prórroga.
   */
  paises: string;
  /**
   * Uso específico de la prórroga.
   */
  usoEspecifico: string;
  /**
   * Justificación de la importación o exportación.
   */
  justificacionImportacionExportacion: string;
  /**
   * Observaciones de la prórroga.
   */
  observaciones: string;
  /**
   * Fecha de inicio de la prórroga.
   */
  fechaInicioProrroga: string;
  /**
   * Fecha de fin de la prórroga.
   */
  fechaFinProrroga: string;
}

/**
 * Interfaz que representa la información de la solicitud.
 */
export interface SolicitudInfo {
  /**
   * Tipo de solicitud PEIXM.
   */
  tipoSolicitudPexim: string;
  /**
   * Datos del trámite.
   */
  datoTramite: {
    /**
     * Regimen de la mercancía.
     */
    regimen: string;
    /**
     * Clasificación del régimen.
     */
    clasificacionRegimen: string;
  };
  /**
   * Fracción arancelaria de la mercancía.
   */
  fraccionArancelaria: string;
  /**
   * Representación federal.
   */
  representacionFederal: string;
}

/**
 * Interfaz que representa la información del trámite.
 */
export interface TramiteInfo {
  /**
   * Información de la mercancía.
   */
  solicitud: {
    /**
     * Información de la mercancía.
     */
    mercancia: {
      /**
       * Condición de la mercancía.
       */ 
      condicionMercancia: string;
      /**
       * Descripción de la mercancía.
       */
      descripcion: string;
      /**
       * Unidad de medida tarifaria, unidades autorizadas e importe de factura autorizado en USD.
       */
      unidadMedidaTarifaria: string;
      /**
       * Cantidad de unidades autorizadas.
       */
      unidadesAutorizadas: string;
      /**
       * Importe de factura autorizado en USD.
       */
      importeFacturaAutorizadoUSD: string;
    };
    /**
     * Información del certificado Kimberly.
     */
    certificadoKimberly: CertificadoKimberly;
    /**
     * Información de la prórroga.
     */
    prorroga: {
      /**
       * Cantidad libre de mercancía.
       */
      cantidadLibreMercancia: string;
    };
  };
}

/**
 * Interfaz que representa el certificado Kimberly.
 */
export interface CertificadoKimberly {
  /**
   * Código del certificado Kimberly.
   */
  certificadosEmitidos: string;
  /**
   * Número del certificado Kimberly de importación.
   */
  idCertificadoKimberlyImportacion: string;
  /**
   * Certificado Kimberly PK País.
   */
  certificadoKimberlyPKPais: string;
  /**
   * Nombre del país de origen en inglés.
   */
  nombrePaisOrigenIngles: string;
  /**
   * Indica si el origen es mixto.
   */
  origen: boolean;
  /**
   * Clave de origen.
   */
  claveOrigen: string;
  /**
   * Nombre del exportador.
   */
  nombreExportador: string;
  /**
   * Dirección del exportador.
   */
  direccionExportador: string;
  /**
   * Nombre del importador.
   */
  nombreImportador: string;
  /**
   * Dirección del importador.
   */
  direccionImportador: string;
  /**
   * Descripción del número de remesa.
   */
  descripcionNumeroRemesa: string;
  /**
   * Descripción del número de remesa en inglés.
   */
  descripcionNumeroRemesaIngles: string;
  /**
   * Número de factura de la remesa.
   */
  numeroFacturaRemesa: string;
  /**
   * Número de quilates.
   */
  numeroKilates: string;
  /**
   * Valor de los diamantes.
   */
  valorDiamantes: string;
}
