/**
 * @interface DomicilioInfo
 * Información del domicilio de la planta
 */
export interface DomicilioInfo {
    /** Identificador único del domicilio */
    id?: number | null;
    /** Calle de la dirección */
    calle?: string;
    /** Número exterior de la dirección */
    numeroExterior?: string;
    /** Número interior de la dirección */
    numeroInterior?: string;
    /** Código postal */
    codigoPostal?: string;
    /** Localidad */
    localidad?: string;
    /** Colonia */
    colonia?: string;
    /** Delegación o municipio */
    delegacionMunicipio?: string;
    /** Entidad federativa */
    entidadFederativa?: string;
    /** País */
    pais?: string;
    /** Teléfono */
    telefono?: string;
    /** ID de la planta (como cadena de texto) */
    idPlanta?: string;
    /** ID de la solicitud (opcional, ya que puede estar indefinido) */
    idSolicitud?: string;
    /** Razón social */
    razonSocial?: string;
    /** Estado que puede ser 'Baja' o 'Activada' */
    desEstatus?: 'Baja' | 'Activada';
    /** Valor booleano para el estado */
    estatus?: boolean;
    /** Registro Federal de Contribuyentes */
    rfc?: string;
}

/**
 * @interface Complimentaria
 * Información complementaria del representante
 */
export interface Complimentaria {
    /** Registro Federal de Contribuyentes */
    rfc?: string;
    /** Nombre del representante */
    nombre?: string;
    /** Primer apellido */
    apellidoPrimer?: string;
    /** Segundo apellido */
    apellidoSegundo?: string;
}

/**
 * @interface Federetarios
 * Información de los federatarios
 */
export interface Federetarios {
    /** Nombre del federatario */
    nombre?: string;
    /** Primer apellido */
    apellidoPrimer?: string;
    /** Segundo apellido */
    apellidoSegundo?: string;
    /** Número del acta constitutiva */
    numeroActa?: string;
    /** Fecha del acta */
    fetchActa?: string;
    /** Número de la notaría */
    numeroNotaria?: string;
    /** Municipio o delegación */
    municipioDelegacion?: string;
    /** Estado */
    estado?: string;
}

/**
 * @interface Operacions
 * Operaciones que extiende múltiples interfaces
 * @extends Complimentaria
 * @extends Federetarios
 * @extends DomicilioInfo
 */
export interface Operacions extends Complimentaria, Federetarios, DomicilioInfo {
    /** Razón social de la empresa */
    razonSocial?: string;
    /** RFC del solicitante fiscal */
    fiscalSolicitante?: string;
    // Propiedades heredadas se documentan automáticamente
}

/**
 * @interface Bitacora
 * Información de la bitácora de cambios
 */
export interface Bitacora {
    /** Tipo de modificación realizada */
    tipoModificion: string;
    /** Fecha de la modificación */
    fetchModificion: string;
    /** Valores anteriores antes del cambio */
    valoresAnteriores: string;
    /** Valores nuevos después del cambio */
    valoresNuevos: string;
}

/**
 * @interface Anexo
 * Información de anexos
 */
export interface Anexo {
    /** Tipo de fracción arancelaria */
    tipoFraccion?: string;
    /** Fracción arancelaria para exportación */
    fraccionArancelariaExportacion?: string;
    /** Fracción arancelaria para importación */
    fraccionArancelariaImportacion?: string;
    /** Descripción del anexo */
    descripcion?: string;
    /** Valores anteriores */
    valoresAnteriores?: string;
}

/**
 * @interface DatosModificacion
 * Datos de modificación del trámite
 */
export interface DatosModificacion {
    /** Registro Federal de Contribuyentes */
    rfc: string;
    /** Representación federal */
    representacionFederal: string;
    /** Tipo de modalidad */
    tipoModalidad: string;
    /** Descripción de la modalidad */
    descripcionModalidad: string;
}

/**
 * @interface FracciónArancelaria
 * Fracción arancelaria
 */
export interface FracciónArancelaria {
    /** Identificador único */
    id?: number;
    /** Fracción arancelaria */
    fraccionArancelariaFraccion?: string;
    /** Cantidad */
    cantidad?: string;
    /** Valor */
    valor?: string;
    /** Unidad de medida tarifaria */
    unidadMedidaTarifaria?: string;
}

/**
 * @interface DatosImmex
 * Datos de la operación IMMEX
 */
export interface DatosImmex {
    /** Registro Federal de Contribuyentes */
    rfc?: string;
    /** Domicilio fiscal */
    domicilioFiscal?: string;
    /** Calle */
    calle?: string;
    /** Número interior */
    numeroInterior?: string;
    /** Número exterior */
    numeroExterior?: string;
    /** Código postal */
    codigoPostal?: string;
    /** Colonia */
    colonia?: string;
    /** Localidad */
    localidad?: string;
    /** Entidad federativa */
    entidadFederativa?: string;
    /** País */
    pais?: string;
    /** Teléfono */
    telefono?: string;
    /** Descripción del estatus */
    desEstatus?: string;
}

/**
 * @interface DatosDelModificacion
 * Datos de modificación de la planta
 */
export interface DatosDelModificacion {
    /** Identificador único */
    id?: number;
    /** Calle */
    calle?: string;
    /** Número exterior */
    numeroExterior?: number;
    /** Número interior */
    numeroInterior?: number;
    /** Código postal */
    codigoPosta?: number;
    /** Colonia */
    colonia?: string;
    /** Municipio o alcaldía */
    municipioOAlcaldia?: string;
    /** Entidad federativa */
    entidadFederativa?: string;
    /** País */
    pais?: string;
    /** Teléfono */
    telefono?: string;
    /** Descripción del estatus */
    desEstatus?: string;
}

/**
 * @interface DatosDelServicios
 * Datos de los servicios
 */
export interface DatosDelServicios {
    /** Identificador único */
    id?: number;
    /** Descripción del estatus */
    desEstatus?: string;
    /** Descripción del servicio */
    descripcion?: string;
    /** Tipo de servicio */
    tipoDeServicio?: string;
    /** Estado del servicio */
    testado?: string;
}

/**
 * @interface DatosDelModificaciondos
 * Datos de modificación secundarios
 */
export interface DatosDelModificaciondos {
    /** Identificador único */
    id?: number;
    /** Descripción del estatus */
    desEstatus?: string;
    /** Descripción */
    descripcion?: string;
    /** Tipo de servicio */
    tipoDeServicio?: string;
}

/**
 * @interface SolicitudData
 * Datos de la solicitud
 */
export interface SolicitudData {
  rfcSolicitante?: string;
  entidadFederativa?: string;
  idPrograma?: number;
  tipoPrograma?: string;
  plantaIdc?: string;
}

/**
 * @interface SolicitudBody
 * Datos del cuerpo de la solicitud
 */
export interface SolicitudBody {
    idSolicitud?: number[];
}

/**
 * @interface SolicitudPayload
 * Interfaz para payload de solicitud
 */
export interface SolicitudIdPayload{
  /** ID del programa (puede ser indefinido) */
  idPrograma?: string;
  /** Tipo de programa (puede ser indefinido) */
  tipoPrograma?: string;
}

/**
 * @interface Notario
 * Información del notario
 */
export interface Notario {
  idNotario?: number | null;
  idSolicitud?: number | null;
  nombreNotario?: string | null;
  apellidoMaterno?: string | null;
  apellidoPaterno?: string | null;
  rfc?: string | null;
  numeroActa?: string | null;
  fechaActa?: string | null; // or Date if you will convert it
  numeroNotaria?: string | null;
  numeroNotario?: string | null;
  delegacionMunicipio?: string | null;
  entidadFederativa?: string | null;
}

/**
 * @interface Params
 * Parámetros para la obtención de submanufacturera
 */
export interface Params{
  /**
   * Identificador único de la solicitud
   * @type {string}
   */
  idSolicitud?: string;
  /**
   * Identificador del programa IMMEX
   * @type {string}
   */
  idPrograma?: string;
  /**
   * RFC del contribuyente
   * @type {string}
   */
  rfc?: string;
}

/**
 * @interface GuardarPayload
 * Payload para guardar la solicitud
 */
export interface GuardarPayload {
  tipoDeSolicitud?: string;
  idSolicitud?: number;
  idTipoTramite?: number;
  rfc?: string;
  cveUnidadAdministrativa?: string;
  costoTotal?: number;
  discriminatorValue?: string;
  certificadoSerialNumber?: string;
  certificado?: string;

  solicitud?: {
    modalidad?: string;
    booleanGenerico?: boolean;
    descripcionSistemasMedicion?: string;
    descripcionLugarEmbarque?: string;
    numeroPermiso?: string;
    fechaOperacion?: string;
    nomOficialAutorizado?: string;
  };

  sociosAccionistas?: Socios[];

  notarios?: Notarios[];

  plantasIDC?: PlantaIDC[];
  empresaSubmanufacturera?: PlantaIDC[];
  plantasSubmanufacturera?: PlantaIDC[];

  empresaSolicitante?: {
    idServicio?: string;
    descripcionServicio?: string;
    domicilioCompleto?: string;
    numeroPrograma?: string;
    tiempoPrograma?: string;
    descripcionTestado?: string;
    idCompuestoEmpresa?: string;
    idServicioAutorizado?: number;
    idEmpresa?: number;
    tipoEmpresa?: string;
    caracterEmpresa?: string;
    montoExportacionesUSD?: number;
    numeroProgramaDGCESE?: string;
    porcentajeParticipacionAccionaria?: number;
    porcentajeParticionAccionariaExt?: number;
    nombre?: string;
    apellidoPaterno?: string;
    apellidoMaterno?: string;
    razonSocial?: string;
    rfc?: string;
    certificada?: boolean;
    correoElectronico?: string;
    idDireccionSol?: number;
    idSolicitud?: number;
    testado?: boolean;
    fechaInicioVigencia?: string;
    fechaFinVigencia?: string;
    blnActivo?: boolean;
  }[];

  fraccionesExportacion?: FraccionTrade[];
  fraccionesImportacion?: FraccionTrade[];

  fraccionesSensibles?: {
    claveSencible?: number;
    complemento?: string;
    unidadMedidaTarifaria?: string;
    cantidad?: string;
    valor?: string;
    fraccionPadre?: string;
    descUnidadMedida?: string | null;
    fechaInicioVigencia?: string;
    fechaFinVigencia?: string;
    cveFraccion?: string;
  }[];

  mercanciaImportacion?: {
    claveMercanciaImportacion?: number;
    testado?: number;
    tipoFraccion?: string;
    visible?: boolean;
    fraccionPadre?: string;
    blnFraccionSeleccionada?: number;
    claveFraccionPadre?: string;
    fraccionCompuesta?: string;
    descripcionTestado?: string;
    unidadMedida?: string;
    tipoOperacion?: string;
    valorMonedaMensual?: string;
    valorMonedaAnual?: string;
    valorProduccionMensual?: string;
    valorProduccionAnual?: string;
    valorProduccionAnualSolicitada?: string;
    categoria?: string;
    mensaje?: string;
    umt?: string;
    claveCategoria?: string;
    descripcionUsuario?: string;
    descripcionFraccionPadre?: string;
    idProductoPadre?: string;
    idProducto?: string;
    permisoPadre?: string;
    fraccionArancelaria?: {
      clave?: string;
      descripcion?: string;
    };
    proyectosClientes?: {
      idProyecto?: string;
      nombreCliente?: string;
    }[];
    complemento?: {
      idComplemento?: string;
      descripcion?: string;
    };
  }[];

  servicios?: ServicioImmex[];

  unidadAdministrativaRepresentacionFederal?: {
    clave?: string;
  };

  domicilio?: Domicilio;

  solicitante?: {
    rfc?: string;
  };

  datosCertificacion?: string;
  montoImportaciones?: number;
  factorAmpliacion?: number;
  certificacion_sat?: string;
  cveEntidad?: string;
  idProgramaAutorizado?: number;
  tipoPrograma?: string;
  tipoModalidad?: string;
  descripcionModalidad?: string;
}

/**
 * @interface ServicioImmex
 * Información del servicio IMMEX
 */
export interface ServicioImmex {
    idServicio?: number;
    tipoServicio?: string;
    testado?: boolean;
    descripcion?: string | null;
    descripcionTipo?: string | null;
    estatus?: boolean;
  }

  /**
   * @interface Notarios
   * Información de notarios
   */
export interface Notarios{
    nombreNotario?: string;
    apellidoMaterno?: string;
    apellidoPaterno?: string | null;
    numeroActa?: string;
    numeroNotaria?: string | null;
    numeroNotario?: string | null;
    delegacionMunicipio?: string;
    entidadFederativa?: string;
    fechaActa?: string;
  }

    /**
     * @interface Socios
     * Información de socios
     */
export interface Socios{
    rfc?: string;
    nombre?: string;
    apellidoMaterno?: string;
    apellidoPaterno?: string;
    correoElectronico?: string | null;
    curp?: string | null;
    descripcionGiro?: string | null;
    idSolicitud?: number | null;
  }
  
/**
 * @interface PlantaIDC
 * Información de planta IDC
 */
export interface PlantaIDC {
  idPlanta?: string;
  calle?: string;
  numeroInterior?: string;
  numeroExterior?: string;
  codigoPostal?: string;
  colonia?: string | null;
  delegacionMunicipio?: string;
  entidadFederativa?: string;
  pais?: string;
  rfc?: string | null;
  domicilioFiscal?: string | null;
  razonSocial?: string | null;
  claveEntidadFederativa?: string | null;
  clavePlantaEmpresa?: string | null;
  clavePais?: string | null;
  claveDelegacionMunicipio?: string | null;
  estatus?: boolean;
  desEstatus?: string;
  localidad?: string;
  telefono?: string | null;
  idSolicitud?: number | null;
  fax?: string | null;
  idDireccion?: number | null;
  testadoP?: number;
  empresaCalle?: string | null;
  empresaNumeroInterior?: string | null;
  empresaNumeroExterior?: string | null;
  empresaCodigoPostal?: string | null;
  empresaColonia?: string | null;
  empresaDelegacionMunicipio?: string | null;
  empresaEntidadFederativa?: string | null;
  empresaPais?: string | null;
  empresaClaveEntidadFederativa?: string | null;
  empresaClavePlantaEmpresa?: string | null;
  empresaClavePais?: string | null;
  empresaClaveDelegacionMunicipio?: string | null;
  empresaCorreoElectronico?: string | null;
  empresaTipo?: string | null;
  permaneceMercancia?: string | null;
  rfcActivo?: string | null;
  domiciliosInscritos?: string | null;
  personaMoralISR?: string | null;
  opinionSAT?: string | null;
  fecha32D?: string;
}

/**
 * @interface FraccionTrade
 * Información de fracción comercial
 */
export interface FraccionTrade {
  tipoFraccion?: string;
  fraccionPadre?: string | null;
  idProductoExp?: string | null;
  fraccionCompuesta?: string | null;
  idSectorProsecSol?: number;
  descripcionTestado?: string | null;
  fraccionArancelaria?: {
    fraccionPadre?: string;
    descripcionFraccionPadre?: string;
    tipoFraccion?: string;
    fraccionCompuesta?: string;
    claveFraccionPadre?: string;
    idFraccion?: string;
    idProducto?: string;
  };
}

/** * @interface Domicilio
 * Información del domicilio
 */
export interface Domicilio{
    calle?: string;
    numeroExterior?: string;
    numeroInterior?: string;
    codigoPostal?: string;
    informacionExtra?: string;
    clave?: string;
    cveLocalidad?: string;
    cveDelegMun?: string;
    cveEntidad?: string;
    cvePais?: string;
    ciudad?: string;
    telefono?: string;
    fax?: string;
    municipio?: string;
    colonia?: string;
    descUbicacion?: string;
    cveCatalogo?: string;
    telefonos?: string;
    tipoDomicilio?: number;
  }

/** * @interface RecintoSolicitud
 * Información del recinto de la solicitud
 */
  export interface RecintoSolicitud {
  recintoSolicitudPK?: {
    idSolicitud?: string |number | null;
    idRecinto?: number | null;
  };
  razonSocial?: string | null;
  clavePlanta?: string | null;
  claveAduana?: string | null;
  superficie?: number | null;
  ubicacionColindancias?: string | null;
  capacidadProduccion?: number | null;
  capacidadProduccionUtilizada?: number | null;
  tipoLocal?: string | null;
  tipoEstablecimiento?: string | null;
  ubicacionEstablecimiento?: string | null;
  domicilio?: number | null;
  empresaSolicitante?: string | null;

  empresaDto?: {
    idServicio?: number | null;
    descripcionServicio?: string | null;
    domicilioCompleto?: string | null;
    numeroPrograma?: number | null;
    tiempoPrograma?: number | null;
    descripcionTestado?: string | null;
    idCompuestoEmpresa?: number | null;
    idServicioAutorizado?: number | null;
    idEmpresa?: number | null;
    tipoEmpresa?: string | null;
    caracterEmpresa?: string | null;
    montoExportacionesUSD?: number | null;
    numeroProgramaDGCESE?: number | null;
    porcentajeParticipacionAccionaria?: number | null;
    porcentajeParticionAccionariaExt?: number | null;
    nombre?: string | null;
    apellidoPaterno?: string | null;
    apellidoMaterno?: string | null;
    razonSocial?: string | null;
    rfc?: string | null;
    certificada?: boolean | null;
    correoElectronico?: string | null;
    idDireccionSol?: number | null;
    idSolicitud?: number | null;
    testado?: boolean | null;
    fechaInicioVigencia?: string | null;
    fechaFinVigencia?: string | null;
    blnActivo?: boolean | null;

    domicilioSolicitud?: {
      idDomicilio?: number | null;
      calle?: string | null;
      numExterior?: string | null;
      numInterior?: string | null;
      codigoPostal?: string | null;
      informacionExtra?: string | null;
      clave?: string | null;
      coloniaEntity?: string | null;
      cveLocalidad?: string | null;
      cveDelegMun?: string | null;
      delegacionMunicipio?: string | null;
      cveEntidad?: string | null;

      entidadFederativa?: {
        cveEntidad?: string | null;
        nombre?: string | null;
        codEntidadIdc?: string | null;
        cvePais?: string | null;
        pais?: string | null;
        fechaCaptura?: string | null;
        fechaInicioVigencia?: string | null;
        fechaFinVigencia?: string | null;
        activo?: boolean | null;
      };

      cvePais?: string | null;

      pais?: {
        cvePais?: string | null;
        nombre?: string | null;
        fechaCaptura?: string | null;
        cveMoneda?: string | null;
        cvePaisWco?: string | null;
        nombreAlterno?: string | null;
        fecFinVigencia?: string | null;
        fecIniVigencia?: string | null;
        blnActivo?: boolean | null;
        restriccion?: string | null;
      };

      ciudad?: string | null;
      telefono?: string | null;
      fax?: string | null;
      municipio?: string | null;
      colonia?: string | null;
      descUbicacion?: string | null;
      cveCatalogo?: string | null;
      telefonos?: string | null;
      tipoDomicilio?: string | null;
      localidad?: string | null;
    };
  };

  rfcRecinto?: string | null;
  numeroLicencia?: string | null;
  avisoFuncionamiento?: string | null;
  rfcResponsableSanitario?: string | null;
  correoElectronico?: string | null;
  fecFinVigencia?: string | null;
  testado?: boolean | null;
  estadoEvaluacionEntidad?: string | null;
  estadoEntidad?: string | null;
  original?: boolean | null;
  modificado?: boolean | null;
  tipoBodega?: string | null;
  tipoDeposito?: string | null;
  marbetesPrecintos?: string | null;
  idSolicitudRecursiva?: number | null;
  idRecintoRecursiva?: number | null;
  claveSidefi?: string | null;
  nacional?: boolean | null;
  numeroMovimientoVs?: string | null;
  descripcionNumeroBodega?: string | null;
  blnActivo?: boolean | null;
  booleanAlquilado?: boolean | null;
  blnCertificada?: boolean | null;
  blnGenerico1?: boolean | null;
  capacidadMaxAlmacenamiento?: number | null;
  cveUnidadAdministrativa?: string | null;
  cveUnidadMedidaCapacidad?: string | null;
  cveUnidadMedidaVolumen?: string | null;
  descripcionCertificador?: string | null;
  fechaInicioVigencia?: string | null;
  idAlmacenadoraMercancia?: number | null;
  idPersonaSolicitud?: number | null;
  tipoInmueble?: string | null;
  idTipoRecinto?: number | null;
  rfcCertificador?: string | null;
  superficieEtr?: number | null;
  superficieMarbetes?: number | null;
  volumenManejoRecinto?: number | null;
  idRecinto?: number | null;

  domicilioDto?: {
    idDomicilio?: number | null;
    calle?: string | null;
    numExterior?: string | null;
    numInterior?: string | null;
    codigoPostal?: string | null;
    informacionExtra?: string | null;
    clave?: string | null;
    coloniaEntity?: string | null;
    cveLocalidad?: string | null;
    cveDelegMun?: string | null;
    delegacionMunicipio?: string | null;
    cveEntidad?: string | null;

    entidadFederativa?: {
      cveEntidad?: string | null;
      nombre?: string | null;
      codEntidadIdc?: string | null;
      cvePais?: string | null;
      pais?: string | null;
      fechaCaptura?: string | null;
      fechaInicioVigencia?: string | null;
      fechaFinVigencia?: string | null;
      activo?: boolean | null;
    };

    cvePais?: string | null;

    pais?: {
      cvePais?: string | null;
      nombre?: string | null;
      fechaCaptura?: string | null;
      cveMoneda?: string | null;
      cvePaisWco?: string | null;
      nombreAlterno?: string | null;
      fecFinVigencia?: string | null;
      fecIniVigencia?: string | null;
      blnActivo?: boolean | null;
      restriccion?: string | null;
    };

    ciudad?: string | null;
    telefono?: string | null;
    fax?: string | null;
    municipio?: string | null;
    colonia?: string | null;
    descUbicacion?: string | null;
    cveCatalogo?: string | null;
    telefonos?: string | null;
    tipoDomicilio?: string | null;
    localidad?: string | null;
  };

  domicilioSolicitudDto?: unknown;
  errorImmex?: unknown;
  domiciliosMontoInversion?: unknown;
  domiciliosEmpleados?: unknown;
  domiciliosCapacidad?: unknown;
  complementoPlanta?: unknown;
  firmantes?: unknown;
  estadoEvaluacionEntidadEnum?: unknown;
  estadoEntidadEnum?: unknown;
}

