/**
 * Denominación de la entidad o empresa.
 * Representa el nombre o razón social de la entidad que tiene los empleados.
 */
export interface NumeroDeEmpleados {
  denominacion: string;
  RFC: string;
  numeroDeEmpleados: string;
  bimestre: string;
}


/** Indica si es instalación principal */
export interface Domicilios {
  instalacionPrincipal?: string;
  cveTipoInstalacion?: string;
  tipoInstalacion?: string;
  cveEntidadFederativa?: string;
  entidadFederativa?: string;
  cveDelegacionMunicipio?: string;
  municipioDelegacion?: string;
  direccion?: string;
  codigoPostal?: string;
  registroSESAT?: string;
  procesoProductivo?: string;
  acreditaInmueble?: string;
  operacionesCExt?: string;
  instalacionCtpat?: string;
  instalacionPerfil?: string;
  instalacionPerfilRFE?: string;
  instalacionPerfilAuto?: string;
  instalacionPerfilFerro?: string;
  instalacionPerfilRf?: string;
  instalacionPerfilMensajeria?: string;
  noExterior?: string;
  noInterior?: string;
  cveColonia?: string;
  calle?: string;
  descCol?: string;
  idRecinto?: string;
}

/**
 * Nombre del inventario.
 * Representa el nombre del inventario o producto registrado.
 */
export interface Inventarios {
  nombre: string;
  lugarRadicacion: string;
  anexo24: string;
}

/** Identificador del miembro en la empresa */
export interface SeccionSociosIC {
  idMiembroEmpresa?: string;
  idSolicitud?: string;
  tipoPersona?: string;
  tipoPersonaMuestra: string;
  nombreCompleto: string;
  rfc: string;
  caracterDe: string;
  nacionalidad: string;
  tipoCaracter?: string;
  paisClave?: string;
  tributarMexico: string;
  nombreEmpresa: string;
  nombre?: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  razonSocial?: string;
}

export interface PrincipalesInstalaciones {
  entidadFederativa?: string;
  municipioDelegacion?: string;
  colonio?: string;
  codigoPostal?: string;
  registro?: string; 
}