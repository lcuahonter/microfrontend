export interface SolicitanteDomicilioPayload {
  pais_clave: string;
  pais_nombre: string;
  entidad_federativa_clave: string;
  entidad_federativa_nombre: string;
  delegacion_municipio_clave: string;
  delegacion_municipio_nombre: string;
  colonia_clave: string;
  colonia_nombre: string;
  localidad_clave: string;
  localidad_nombre: string;
  calle: string;
  numero_exterior: string;
  numero_interior: string;
  codigo_postal: string;
}

export interface SolicitantePayload {
  rfc: string;
  razon_social: string;
  descripcion_giro: string;
  correo_electronico: string;
  telefono: string;
  domicilio: SolicitanteDomicilioPayload;
}

export interface PlantaPayload {
  recintoSolicitudPK?: string | number | undefined;
  razonSocial?: string;
  clavePlanta?: string;
  claveAduana?: string;
  superficie?: string | number | undefined;
  ubicacionColindancias?: string | undefined;
  capacidadProduccion?: string | number | undefined;
  capacidadProduccionUtilizada?: string | number | undefined;
  tipoLocal?: string | undefined;
  tipoEstablecimiento?: string | undefined;
  ubicacionEstablecimiento?: string | undefined;
  domicilio?: object | undefined;
  empresaSolicitante?: object | undefined;
  empresaDto?: object | undefined;
  rfcRecinto?: string | undefined;
  numeroLicencia?: string | undefined;
  avisoFuncionamiento?: string | undefined;
  rfcResponsableSanitario?: string | undefined;
  correoElectronico?: string | undefined;
  fecFinVigencia?: string | undefined;
  testado?: boolean;
  estadoEvaluacionEntidad?: string | undefined;
  estadoEntidad?: string | undefined;
  original?: string | undefined;
  modificado?: string | undefined;
  tipoBodega?: string | undefined;
  tipoDeposito?: string | undefined;
  marbetesPrecintos?: string | undefined;
  idSolicitudRecursiva?: string | number | undefined;
  idRecintoRecursiva?: string | number | undefined;
  claveSidefi?: string | undefined;
  nacional?: string | undefined;
  numeroMovimientoVs?: string | number | undefined;
  descripcionNumeroBodega?: string | undefined;
  blnActivo?: boolean | undefined;
  booleanAlquilado?: boolean | undefined;
  blnCertificada?: boolean | undefined;
  blnGenerico1?: boolean | undefined;
  capacidadMaxAlmacenamiento?: string | number | undefined;
  cveUnidadAdministrativa?: string | undefined;
  cveUnidadMedidaCapacidad?: string | undefined;
  cveUnidadMedidaVolumen?: string | undefined;
  descripcionCertificador?: string | undefined;
  fechaInicioVigencia?: string | undefined;
  idAlmacenadoraMercancia?: string | number | undefined;
  idPersonaSolicitud?: string | number | undefined;
  tipoInmueble?: string | undefined;
  idTipoRecinto?: string | number | undefined;
  rfcCertificador?: string | undefined;
  superficieEtr?: string | number | undefined;
  superficieMarbetes?: string | number | undefined;
  volumenManejoRecinto?: string | number | undefined;
  idRecinto?: string | number | undefined;
  domicilioDto?: object | undefined;
  errorImmex?: string | undefined;
  domiciliosMontoInversion?: string | number | undefined;
  domiciliosEmpleados?: string | number | undefined;
  domiciliosCapacidad?: string | number | undefined;
  complementoPlanta?: string | undefined;
  firmantes?: object | undefined;
}

export interface SectorPayload {
  sectorLista: string;
  sectorClave: string;
}
/**
 * Interface representing a step in the wizard.
 */
export interface LISTAPASOWIZARD {
  /** Index of the step */
  indice: number;
  /** Title of the step */
  titulo: string;
  /** Indicates if the step is active */
  activo: boolean;
  /** Indicates if the step is completed */
  completado: boolean;
}

/**
 * Interface representing an action button.
 */
export interface ACCIONBOTON {
  /** Action to be performed */
  accion: string;
  /** Value associated with the action */
  valor: number;
}

/**
 * Interface representing a plant.
 */
export interface Plantas {
  /** Modality of the plant */
  modalidad: string;
  /** State where the plant is located */
  Estado: string;
  /** Federal representation of the plant */
  RepresentacionFederal: string;
  /** Productive activity of the plant */
  ActividadProductiva: string;
}

export interface FilaPlantas {
  calle: string;
  numeroExterior: string;
  numeroInterior: string;
  codigoPostal: number;
  colonia: string;
  municipioOAlcaldia: string;
  pais: string;
  registro: string;
  registroFederalDeContribuyentes: string;
  razonSocial : string;
  domicilioFiscalDelSolicitante: string;
  }

export interface FilaProductos {
  contribuyentes: string;
  razonSocial: string;
  Correo: string;
}

export interface FilaSectors {
  sector: string;
  cvSectorCatalogo: string;
  idConfProgramaSE:string;
}
export interface FilaProducir{
  cveFraccion: string;
  cveSector: string;
  idConfProgramaSE:string;
}
/**
 * Interface representing sectors and goods.
 */
export interface SectoresYMercancias {
  /** Sector of the goods */
  sector: string;
  /** Tariff fraction of the goods */
  Fraccion_arancelaria: string;
}

/**
 * Interface representing the final data list.
 */
export interface ListaDeDatosFinal {
  /** List of plants */
  plantas: Plantas[];
  /** List of sectors and goods */
  sectoresYMercancias: SectoresYMercancias[];
}

/**
 * Function to create the state of the data.
 * @param params Partial parameters to initialize the state
 * @returns The initialized state
 */
export function createDatosState(params: Partial<ListaDeDatosFinal> = {}): ListaDeDatosFinal {
  return {
    plantas: params.plantas || [],
    sectoresYMercancias: params.sectoresYMercancias || [],
  };
}