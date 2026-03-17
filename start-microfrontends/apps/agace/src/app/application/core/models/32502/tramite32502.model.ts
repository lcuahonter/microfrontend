export interface DatosTipoEmpresa {
    certificacionA: boolean;
    certificacionAA: boolean;
    certificacionAAA: boolean;
    socioComercial: boolean;
    opEconomicoAut: boolean;
    revisionOrigen: boolean;
}
export interface Solicitud32502 {
    idSolicitud: string;
    tipoSolicitud: string;
    datosImportadorExportador: DatosImportadorExportador;
    datosServicio: DatosServicio;
    datosDespacho: DatosDespacho;
    datosPedimento: DatosPedimento;
    mercancia: DatosMercancia;
    responsablesDespacho: ResponsablesDespacho[];
    pagos: DatosPago;

    tercerosRelacionados: Personas[];
}

export interface DatosImportadorExportador {
    rfcImportExport: string;
    nombreImportExport: string;
    nroRegistro: string;
    programaFomento: string;
    immex: string;
    immexValue: string;
    industriaAutomotriz: string;
    tipoEmpresaCertificada: string;
    idSocioComercial: string;
    opEconomicoAut: boolean;
    revisionOrigen: boolean;
}
export interface DatosServicio {
    fechaInicio: string;
    horaInicio: string;
    fechaFinal: string;
    horaFinal: string;
    fechasSeleccionadas: string[];
}

export interface DatosDespacho {
    despacho: string;
    rfcAutorizacion: string;
    ddexAutorizacion: string;

    idAduana: string;
    descripcionAduana: string;

    idSeccionAduanera: string;
    seccionAduanera: string;

    nombreRecinto: string;
    tipoDespacho: string;
    tipoOperacion: string;
    patente: string;
    relacionSociedad: boolean;
    encargoConferido: boolean;
    domicilio: string;
}

export interface DatosPedimento {
    idPedimento: number;
    patentePedimento: number;
    pedimento: string;
    aduana: number;
    tipoPedimento: string;
    numero: number;
    comprobanteValor: string;
    pedimentoValidado: boolean;
}

export interface DatosMercancia {
    paisOrigen: number;
    paisProcedencia: number;
    descripcion: string;
    justificacion: string;
}

export interface ResponsablesDespacho {
    gafete: string;
    nombre: string;
    primerApellido: string;
    segundoApellido: string;
}


export interface DatosPago {
    montoPagar: string;
    lineaCaptura: string;
    monto: number;
}

export interface Personas {
    razonSocial: string;
    correo: string;
}


// Pedimento
export interface DatosComponentePedimento {
    patente: number;
    idAduana: number;
}

export interface Persona {
    gafete?: number ;
    nombre: string;
    primerApellido: string;
    segundoApellido: string;
}

export interface Pedimento {
    patente: number;
    pedimento: number;
    aduana: number;
    idTipoPedimento: number;
    descTipoPedimento: string;
    numero: string;
    comprobanteValor: string;
    pedimentoValidado: boolean;
  }


  /**
 * Representa los datos generales del solicitante.
 */
export interface Solicitante {

  /** rfc */
  rfc: string;

  /** denominacion */
  denominacion: string;

  /** actividadEconomica */
  actividadEconomica: string;

  /** correoElectronico */
  correoElectronico: string;

  /** pais */
  pais: string;

  /** codigoPostal */
  codigoPostal: string;

  /** entidadFederativa */
  entidadFederativa: string;

  /** cveEntidadFederativa */
  cveEntidadFederativa: string;

  /** municipio */
  municipio: string;

  /** localidad */
  localidad: string;

  /** colonia */
  colonia: string;

  /** calle */
  calle: string;

  /** nExt */
  nExt: string;

  /** nInt */
  nInt: string;

  /** lada */
  lada: string;

  /** telefono */
  telefono: string;

  /** adace */
  adace: string;

  /** tipoPersona */
  tipoPersona: string;
}

export interface PersonaSolicitud {

    /** RFC extranjero solicitante */
    rfc: string;

    /** Representa la razon social */
    razon_social: string;

    /** TAX Id extranjero solicitante */
    tax_id: string;
}


/**
 * Información de la mercancia a montar desmontar
 */
export interface Mercancia {

    /** Id clave fracción arancelaria */
    cve_fraccion_arancelaria?: string;

    /** nico */
    nico?: string;

    /** Descripción de la mercancía */
    descripcion_mercancia?: string;

    /** Peso en kg de la mercancía */
    peso?: Number;

    /** Valor en USD de la mercancía */
    valor_usd?: Number;

    /** Regla fracción */
    ide_regla_fraccion: string;

    /** Marca del producto */
    marca: string;

    /** Número de serie */
    numero_serie?: string;

    /** Fecha Aproximada Importación  */
    fec_aproximada: string;
}

/**
 * Información de la dirección de la mercancía.
 */
export interface DireccionMercancia {
    
    /** Nombre comercial */
    nombre_comercial: string;

    /** Clave entidad federativa */
    cve_entidad: string;

    /** Clave municipio */
    cve_deleg_mun: string;

    /** Clave colonia */
    cve_colonia: string;

    /** Calle */
    calle: string;

    /** Número Exterior */
    num_exterior: string;

    /** Numero Interior */
    num_interior: string;

    /** Codigo Postal */
    cp: string;

}

/**
 * Datos generales de la operación de importación.
 */
export interface OperacionImportacion {

    /** Numero de pedimento. */
    pedimento: string;

    /** Patente o autorizacion agente aduanal. */
    patente: string;

    /** RFC agente aduanal. */
    rfc_agente: string;

    /** Clave aduana */
    cve_aduana: string;

}

/**
 * Representa los datos generales del solicitante.
 */
export interface Solicitante {

  /** rfc */
  rfc: string;

  /** denominacion */
  denominacion: string;

  /** actividadEconomica */
  actividadEconomica: string;

  /** correoElectronico */
  correoElectronico: string;

  /** pais */
  pais: string;

  /** codigoPostal */
  codigoPostal: string;

  /** entidadFederativa */
  entidadFederativa: string;

  /** cveEntidadFederativa */
  cveEntidadFederativa: string;

  /** municipio */
  municipio: string;

  /** localidad */
  localidad: string;

  /** colonia */
  colonia: string;

  /** calle */
  calle: string;

  /** nExt */
  nExt: string;

  /** nInt */
  nInt: string;

  /** lada */
  lada: string;

  /** telefono */
  telefono: string;

  /** adace */
  adace: string;

  /** tipoPersona */
  tipoPersona: string;
}