export interface ServiciosImmexTablePayload {
  servicio: string;
  servicioSeleccionado?: {
    idServicio: number;
    claveServicio: number;
  }[];
  modalidad: string;
  idPrograma: string;
}

export interface ServicioItemResponse {
  descripcion: string | null;
  descripcionTipo: string | null;
  descripcionTestado: string | null;
  estatus: boolean;
  desEstatus: string | null;
  idServicio: number;
  idSolicitud: number | null;
  solicitud: string | null;
  tipoServicio: string | null;
  testado: boolean;
  claveServicio: number;
  fecIniVigencia: string | null;
  fecFinVigencia: string | null;
}

export interface PlantasDisponiblesPayload {
  rfcEmpresaSubManufacturera: string;
  entidadFederativa: string;
  idPrograma: string | null;
}

export interface PlantasDisponiblesResponse {
  recintoSolicitudPK: {
    idSolicitud: number | null;
    idRecinto: number | null;
  };
  razonSocial: string | null;
  clavePlanta: string | null;
  claveAduana: string | null;
  superficie: string | null;
  ubicacionColindancias: string | null;
  capacidadProduccion: string | null;
  capacidadProduccionUtilizada: string | null;
  tipoLocal: string | null;
  tipoEstablecimiento: string | null;
  ubicacionEstablecimiento: string | null;
  domicilio: string | null;
  empresaSolicitante: string | null;
  empresaDto: {
    idServicio: number | null;
    descripcionServicio: string | null;
    domicilioCompleto: string;
    numeroPrograma: string | null;
    tiempoPrograma: string | null;
    descripcionTestado: string | null;
    idCompuestoEmpresa: number | null;
    idServicioAutorizado: number | null;
    idEmpresa: number | null;
    tipoEmpresa: string | null;
    caracterEmpresa: string | null;
    montoExportacionesUSD: number | null;
    numeroProgramaDGCESE: string | null;
    porcentajeParticipacionAccionaria: number | null;
    porcentajeParticionAccionariaExt: number | null;
    nombre: string | null;
    apellidoPaterno: string | null;
    apellidoMaterno: string | null;
    razonSocial: string | null;
    rfc: string | null;
    certificada: boolean | null;
    correoElectronico: string | null;
    idDireccionSol: number | null;
    idSolicitud: number | null;
    testado: boolean | null;
    fechaInicioVigencia: string | null;
    fechaFinVigencia: string | null;
    blnActivo: boolean | null;
    domicilioSolicitud: {
      idDomicilio: number | null;
      calle: string | null;
      numExterior: string | null;
      numInterior: string | null;
      codigoPostal: string | null;
      informacionExtra: string | null;
      clave: string | null;
      coloniaEntity: string | null;
      cveLocalidad: string | null;
      cveDelegMun: string | null;
      delegacionMunicipio: string | null;
      cveEntidad: string | null;
      entidadFederativa: {
        cveEntidad: string | null;
        nombre: string;
        codEntidadIdc: string | null;
        cvePais: string | null;
        pais: string | null;
        fechaCaptura: string | null;
        fechaInicioVigencia: string | null;
        fechaFinVigencia: string | null;
        activo: boolean;
      };
      cvePais: string | null;
      pais: {
        cvePais: string | null;
        nombre: string;
        fechaCaptura: string | null;
        cveMoneda: string | null;
        cvePaisWco: string | null;
        nombreAlterno: string | null;
        fecFinVigencia: string | null;
        fecIniVigencia: string | null;
        blnActivo: boolean;
        restriccion: string | null;
      };
      ciudad: string | null;
      telefono: string | null;
      fax: string | null;
      municipio: string;
      colonia: string;
      descUbicacion: string | null;
      cveCatalogo: string | null;
      telefonos: string | null;
      tipoDomicilio: string | null;
      localidad: string | null;
    };
  };
  rfcRecinto: string | null;
  numeroLicencia: string | null;
  avisoFuncionamiento: string | null;
  rfcResponsableSanitario: string | null;
  correoElectronico: string | null;
  fecFinVigencia: string | null;
  testado: boolean;
  estadoEvaluacionEntidad: string | null;
  estadoEntidad: string | null;
  original: string | null;
  modificado: string | null;
  tipoBodega: string | null;
  tipoDeposito: string | null;
  marbetesPrecintos: string | null;
  idSolicitudRecursiva: number | null;
  idRecintoRecursiva: number | null;
  claveSidefi: string | null;
  nacional: boolean | null;
  numeroMovimientoVs: string | null;
  descripcionNumeroBodega: string | null;
  blnActivo: boolean | null;
  booleanAlquilado: boolean | null;
  blnCertificada: boolean | null;
  blnGenerico1: boolean | null;
  capacidadMaxAlmacenamiento: number | null;
  cveUnidadAdministrativa: string | null;
  cveUnidadMedidaCapacidad: string | null;
  cveUnidadMedidaVolumen: string | null;
  descripcionCertificador: string | null;
  fechaInicioVigencia: string | null;
  idAlmacenadoraMercancia: number | null;
  idPersonaSolicitud: number | null;
  tipoInmueble: string | null;
  idTipoRecinto: number | null;
  rfcCertificador: string | null;
  superficieEtr: string | null;
  superficieMarbetes: string | null;
  volumenManejoRecinto: string | null;
  idRecinto: number | null;
  domicilioDto: {
    idDomicilio: number | null;
    calle: string;
    numExterior: string;
    numInterior: string | null;
    codigoPostal: string;
    informacionExtra: string | null;
    clave: string | null;
    coloniaEntity: string | null;
    cveLocalidad: string;
    cveDelegMun: string;
    delegacionMunicipio: string | null;
    cveEntidad: string;
    entidadFederativa: {
      cveEntidad: string;
      nombre: string;
      codEntidadIdc: string | null;
      cvePais: string | null;
      pais: string | null;
      fechaCaptura: string | null;
      fechaInicioVigencia: string | null;
      fechaFinVigencia: string | null;
      activo: boolean;
    };
    cvePais: string | null;
    pais: {
      cvePais: string | null;
      nombre: string;
      fechaCaptura: string | null;
      cveMoneda: string | null;
      cvePaisWco: string | null;
      nombreAlterno: string | null;
      fecFinVigencia: string | null;
      fecIniVigencia: string | null;
      blnActivo: boolean;
      restriccion: string | null;
    };
    ciudad: string | null;
    telefono: string | null;
    fax: string | null;
    municipio: string;
    colonia: string;
    descUbicacion: string;
    cveCatalogo: string | null;
    telefonos: string | null;
    tipoDomicilio: string | null;
    localidad: string | null;
  };
  domicilioSolicitudDto: string | null;
  errorImmex: string | null;
  domiciliosMontoInversion: string | null;
  domiciliosEmpleados: string | null;
  domiciliosCapacidad: string | null;
  complementoPlanta: string | null;
  firmantes: string | null;
  estadoEvaluacionEntidadEnum: string | null;
  estadoEntidadEnum: string | null;
}
 

export interface ServicioDtosKey {
    servicioDtos: ServicioItemResponse[];
}

export interface ServiciosAutorizadosTablePayload {
    rfc: string;
    numeroPrograma: string;
    idPrograma: string;
    tipoPrograma: string;
}

export interface ServiciosEmpresasNacionalesPayload {
    rfcEmpresaNacional: string;
    idServicio: string;
    descripcionServicio: string;
    modalidad: string;
    numeroPrograma: string;
    tiempoPrograma: string;
    idServicioAutorizado: string;
}

/**
 * Interfaz para la respuesta de empresas nacionales.
 */
export interface EmpresasNacionalesResponse {
    resultado: string;
    empresasNacionales: EmpresaNacional[];
}

/**
 * Interfaz para una empresa nacional.
 */
export interface EmpresaNacional {
    idServicio: string;
    descripcionServicio: string;
    domicilioCompleto: string;
    numeroPrograma: string;
    tiempoPrograma: string;
    descripcionTestado: string | null;
    idCompuestoEmpresa: string;
    idServicioAutorizado: number;
    idEmpresa: string | null;
    tipoEmpresa: string | null;
    caracterEmpresa: string | null;
    montoExportacionesUSD: number | null;
    numeroProgramaDGCESE: string;
    porcentajeParticipacionAccionaria: number | null;
    porcentajeParticionAccionariaExt: number | null;
    nombre: string | null;
    apellidoPaterno: string | null;
    apellidoMaterno: string | null;
    razonSocial: string;
    rfc: string;
    certificada: boolean | null;
    correoElectronico: string | null;
    idDireccionSol: number | null;
    idSolicitud: number | null;
    testado: boolean | null;
    fechaInicioVigencia: string | null;
    fechaFinVigencia: string | null;
    blnActivo: boolean | null;
    domicilioSolicitud: DomicilioSolicitud;
}

/**
 * Interfaz para el domicilio de solicitud.
 */
export interface DomicilioSolicitud {
    idDomicilio: number | null;
    calle: string;
    numExterior: string;
    numInterior: string;
    codigoPostal: string;
    informacionExtra: string | null;
    clave: string;
    coloniaEntity: unknown | null;
    cveLocalidad: string;
    cveDelegMun: string;
    delegacionMunicipio: string | null;
    cveEntidad: string;
    entidadFederativa: EntidadFederativa;
    cvePais: string;
    pais: Pais;
    ciudad: string | null;
    telefono: string | null;
    fax: string | null;
    municipio: string;
    colonia: string;
    descUbicacion: string | null;
    cveCatalogo: string | null;
    telefonos: unknown | null;
    tipoDomicilio: string | null;
    localidad: string | null;
}

/**
 * Interfaz para la entidad federativa.
 */
export interface EntidadFederativa {
    cveEntidad: string;
    nombre: string;
    codEntidadIdc: string | null;
    cvePais: string | null;
    pais: unknown | null;
    fechaCaptura: string | null;
    fechaInicioVigencia: string | null;
    fechaFinVigencia: string | null;
    activo: boolean;
}

/**
 * Interfaz para el país.
 */
export interface Pais {
    cvePais: string;
    nombre: string;
    fechaCaptura: string | null;
    cveMoneda: string | null;
    cvePaisWco: string | null;
    nombreAlterno: string | null;
    fecFinVigencia: string | null;
    fecIniVigencia: string | null;
    blnActivo: boolean;
    restriccion: string | null;
}
