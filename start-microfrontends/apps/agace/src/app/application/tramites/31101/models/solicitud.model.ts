import { Catalogo, CatalogosSelect } from '@libs/shared/data-access-user/src';
/**
 * Representa los datos de una persona que desea recibir notificaciones.
 */
export interface RecibirNotificaciones {
  /** Registro Federal de Contribuyentes */
  rfc: string;

  /** Clave Única de Registro de Población */
  curp: string;

  /** Nombre del solicitante */
  nombre: string;

  /** Apellido paterno del solicitante */
  apellidoPaterno: string;

  /** Apellido materno del solicitante */
  apellidoMaterno: string;
}

/**
 * Representa los datos de modificación de la razón social o denominación.
 */
export interface ModificacionDenominacionRazonSocial {
  /** Razón social anterior de la empresa */
  razonSocialAnterior: string;

  /** Nueva razón social de la empresa */
  razonSocialActual: string;
}

/**
 * Representa la información relacionada con una garantía.
 */
export interface DatosPorGarantia {
  /** Póliza de fianza actual */
  polizaDeFianzaActual: number;

  /** Número de folio de la garantía */
  numeroFolio: string;

  /** RFC de la institución que otorga la garantía */
  rfcInstitucion: string;

  /** Fecha de expedición de la garantía */
  fechaExpedicion: string;

  /** Fecha de inicio de vigencia (sin formato) */
  fechaInicioVigenciaNo: string;

  /** Fecha de fin de vigencia (sin formato) */
  fechaFinVigenciaNo: string;

  /** Fecha de inicio de vigencia (con formato) */
  fechaInicioVigencia: string;

  /** Fecha de fin de vigencia (con formato) */
  fechaFinVigencia: string;

  /** Importe total cubierto por la garantía */
  importeTotal: string;
}

/** Radio Options  */
export interface RadioOptions {
  /** Etiqueta visible de la opción */
  label: string;

  /** Valor asociado a la opción */
  value: string | number;

  /** Texto auxiliar u orientativo */
  hint?: string;
}

/**
 * Representa un grupo de opciones de tipo radio.
 */

export interface InputRadio {
  /** Opciones disponibles para seleccionar */
  radioOptions: RadioOptions[];

  /** Indica si la selección es obligatoria */
  isRequired: boolean;
}

/**
 * Representa los distintos radios disponibles para los datos generales de la solicitud.
 */
export interface DatosGeneralesDeLaSolicitudRadioLista {
  /** Tipo de endoso a seleccionar */
  tipoDeEndoso: InputRadio;

  /** Tipo de garantía que se presenta */
  tipoDeGarantia: InputRadio;

  /** Modalidad bajo la cual se otorga la garantía */
  modalidadDeLaGarantia: InputRadio;

  /** Tipo de sector al que pertenece la solicitud */
  tipoSector: InputRadio;

  /** Requisitos que deben cumplirse */
  requisitos: InputRadio;
}

/**
 * Representa los catálogos disponibles para los datos generales de la solicitud.
 */
export interface DatosGeneralesDeLaSolicitudCatologo {
  /** Concepto relacionado con la solicitud */
  concepto: Catalogo[];

  /** Tipo de inversión a realizar */
  tipoDeInversion: Catalogo[];

  /**
   * Catálogo de opciones sobre el carácter del miembro.
   */
  enSuCaracterDe: Catalogo[];

  /**
   * Catálogo de nacionalidades disponibles.
   */
  nacionalidad: Catalogo[];

  /**
   * Catálogo del tipo de persona en la solicitud.
   */
  tipoDePersona: Catalogo[];

  /**
   * Catálogo de modalidades del programa IMMEX.
   */
  modalidadDelProgramaIMMEX: Catalogo[];

  /**
   * Catálogo de tipos de instalación.
   */
  tipoDeInstalacion: CatalogosSelect;

  /**
   * Catálogo de entidades federativas.
   */
  entidadFederativa: CatalogosSelect;
}

/**
 * Representa la información de un subcontratista.
 */
export interface SubContratistas {
  /** idRegistro del SubContratistas */
  idRegistro?: number;

  /** RFC del subcontratista */
  rfc: string;

  /** Razón social del subcontratista */
  razonSocial: string;
}

/**
 * Representa la información de un socio o miembro de la empresa.
 */
export interface SeccionSociosIC {
  /** Identificador del miembro en la empresa */
  idMiembroEmpresa?: string;

  /** Identificador de la solicitud relacionada */
  idSolicitud?: string;

  /** Tipo de persona (Física o Moral) */
  tipoPersona?: string;

  /** Tipo de persona mostrado al usuario */
  tipoPersonaMuestra: string;

  /** Nombre completo del miembro */
  nombreCompleto: string;

  /** RFC del miembro */
  rfc: string;

  /** Carácter o rol dentro de la empresa */
  caracterDe: string;

  /** Nombre del país de origen */
  paisNombre: string;

  /** Tipo de carácter (adicional) */
  tipoCaracter?: string;

  /** Clave del país */
  paisClave?: string;

  /** Indica si tributa en México */
  tributarMexico: string;

  /** Nombre de la empresa */
  nombreEmpresa: string;

  /** Nombre de la persona (si aplica) */
  nombre?: string;

  /** Apellido paterno (si aplica) */
  apellidoPaterno?: string;

  /** Apellido materno (si aplica) */
  apellidoMaterno?: string;

  /** Razón social (si aplica) */
  razonSocial?: string;
}

/**
 * Representa un tipo de inversión.
 */
export interface TipoDeInversion {
  /** Identificador del registro */
  idRegistro?: number;

  /** Tipo de inversión */
  tipoInversion: string;

  /** Descripción de la inversión */
  descripcion: string;

  /** Valor asignado a la inversión */
  valor: string;

  /** Clave del tipo de inversión */
  cveTipoInversion?: string;
}

/**
 * Representa los domicilios relacionados con la empresa o instalación.
 */
export interface Domicilios {
  /**
   * Identificador único del registro.
   * Es opcional: si no se proporciona, el sistema puede generarlo automáticamente.
   */
  id?: number;

  /** Indica si es instalación principal */
  instalacionPrincipal: string;

  /** Clave del tipo de instalación */
  cveTipoInstalacion?: string;

  /** Tipo de instalación */
  tipoInstalacion: string;

  /** Clave de la entidad federativa */
  cveEntidadFederativa?: string;

  /** Nombre de la entidad federativa */
  entidadFederativa: string;

  /** Clave de delegación o municipio */
  cveDelegacionMunicipio?: string;

  /** Nombre del municipio o delegación */
  municipioDelegacion: string;

  /** Dirección completa */
  direccion: string;

  /** Código postal del domicilio */
  codigoPostal: string;

  /** Registro en SESAT */
  registroSESAT: string;

  /** Proceso productivo en el domicilio */
  procesoProductivo: string;

  /** Fecha de última modificación */
  fechaModificacion?: string;

  /** Clave del estatus del domicilio */
  cveEstatus?: string;

  /** Descripción del estatus */
  estatus: string;

  /** Número exterior del domicilio */
  noExterior?: string;

  /** Número interior del domicilio */
  noInterior?: string;

  /** Clave de la colonia */
  cveColonia?: string;

  /** Nombre de la calle */
  calle?: string;

  /** Descripción de la colonia */
  descCol?: string;

  /** Identificador del recinto */
  idRecinto?: string;

  /** Número de folio del acuse */
  numFolioAcuse?: string;

  /** Observaciones adicionales del domicilio */
  observaciones?: string;
}
/**
 * Interfaz que representa una entidad federativa.
 */
export interface EntidadFederativa {
  /**
   * Indica si es la instalación principal.
   */
  instalacionPrincipal?: string;

  /**
   * Clave del tipo de instalación.
   */
  cveTipoInstalacion?: string;

  /**
   * Tipo de instalación.
   */
  tipoInstalacion?: string;

  /**
   * Clave de la entidad federativa.
   */
  cveEntidadFederativa?: string;

  /**
   * Nombre de la entidad federativa.
   */
  entidadFederativa: string;

  /**
   * Clave del municipio o delegación.
   */
  cveDelegacionMunicipio?: string;

  /**
   * Nombre del municipio o delegación.
   */
  municipioDelegacion: string;

  /**
   * Dirección de la entidad federativa.
   */
  direccion: string;

  /**
   * Código postal de la entidad federativa.
   */
  codigoPostal: string;

  /**
   * Registro ante la Secretaría de Economía y el SAT.
   */
  registroSESAT: string;

  /**
   * Número exterior de la dirección.
   */
  noExterior?: string;

  /**
   * Número interior de la dirección.
   */
  noInterior?: string;

  /**
   * Clave de la colonia.
   */
  cveColonia?: string;

  /**
   * Nombre de la calle.
   */
  calle?: string;
}

export interface Solicitud31101Model {
  /** Tipo de garantía, valor numérico */
  tipoDeGarantia: number | string;

  /** Modalidad de la garantía, valor numérico */
  modalidadDeLaGarantia: number | string;

  /** Tipo de sector, valor en cadena */
  tipoSector: string | number;

  /** Concepto, valor numérico */
  concepto: number;

  /** Número 3500, valor numérico */
  '3500': number | string;

  /** Número 3501, valor numérico */
  '3501': number | string;

  /** Número 3502, valor numérico */
  '3502': number | string;

  /** RFC de los datos generales */
  datosGeneralesRFC: string;

  /** Número 3503, valor numérico */
  '3503': number | string;

  /** Número 3504, valor numérico */
  '3504': number | string;

  /** Número 3505, valor numérico */
  '3505': number | string;

  /** Número 3506, valor numérico */
  '3506': number | string;

  /** Número 3507, valor numérico */
  '3507': number | string;

  /** Número 3508, valor numérico */
  '3508': number | string;

  /** Número 3509, valor numérico */
  '3509': number | string;

  /** Número 3511, valor numérico */
  '3511': number | string;

  /** Número 3512, valor numérico */
  '3512': number | string;

  /** Número 3513, valor numérico */
  '3513': number | string;

  /** Texto genérico 1, valor en cadena */
  textoGenerico1: string;

  /** Texto genérico 2, valor en cadena */
  textoGenerico2: string;

  /** Número 3514, valor numérico */
  '3514': number | string;

  /** Número 3515, valor numérico */
  '3515': number | string;

  /** Número 3516, valor numérico */
  '3516': number | string;

  /** Texto genérico 3, valor en cadena */
  textoGenerico3: string;

  /** Número 3517, valor numérico */
  '3517': number | string;

  /** Número 3518, valor numérico */
  '3518': number | string;

  /** Número 3519, valor numérico */
  '3519': number | string;

  /** Número 3520, valor numérico */
  '3520': number | string;

  /** Tipo de inversión, valor numérico */
  tipoInversion: number;

  /** Cantidad de inversión, valor en cadena */
  cantidadInversion: string;

  /** Descripción de la inversión, valor en cadena */
  descInversion: string;

  /** Número 3521, valor numérico */
  '3521': number | string;

  /** Número 3522, valor numérico */
  '3522': number | string;

  /** Clave de enumeración D0 */
  claveEnumeracionD0: boolean;

  /** Clave de enumeración D1 */
  claveEnumeracionD1: boolean;

  /** Clave de enumeración D2 */
  claveEnumeracionD2: boolean;

  /** Clave de enumeración D3 */
  claveEnumeracionD3: boolean;

  /** Clave de enumeración H */
  claveEnumeracionH: boolean;

  modalidadProgramaImmex: string | number;

  /** Texto genérico 4, valor en cadena */
  textoGenerico4: string;

  /** Texto genérico 5, valor en cadena */
  textoGenerico5: string;

  /** Número 3523, valor numérico */
  '3523': number | string;

  '3524': number | string;

  fechaFinVigencia1: string;

  numeroAutorizacion1: string;

  '3525': number | string;

  '3526': number | string;

  fechaFinVigencia2: string;

  numeroAutorizacion2: string;

  '3527': number | string;

  /** Número 3528, valor numérico */
  '3528': number | string;

  /** Número 3529, valor numérico */
  '3529': number | string;

  /** Texto genérico 6, valor en cadena */
  textoGenerico6: string;

  /** Texto genérico 7, valor en cadena */
  textoGenerico7: string;

  /** Número 3530, valor numérico */
  '3530': number | string;

  /** Número 3531, valor numérico */
  '3531': number | string;

  /** Texto genérico 9, valor en cadena */
  textoGenerico9: string;

  /** Texto genérico 10, valor numérico */
  textoGenerico10: number | string;

  /** Texto genérico 11, valor numérico */
  textoGenerico11: number | string;

  /** Texto genérico 12, valor numérico */
  textoGenerico12: number | string;

  /** Texto genérico 13, valor numérico */
  textoGenerico13: number | string;

  /** Texto genérico 14, valor numérico */
  textoGenerico14: number | string;

  /** Texto genérico 15, valor numérico */
  textoGenerico15: number | string;

  /** Texto genérico 16, valor numérico */
  textoGenerico16: number | string;

  /** Texto genérico 17, valor numérico */
  textoGenerico17: number | string;

  /** Texto genérico 18, valor numérico */
  textoGenerico18: number | string;

  /** Texto genérico 19, valor numérico */
  textoGenerico19: number | string;

  /** Texto genérico 20, valor numérico */
  textoGenerico20: number | string;

  /** Texto genérico 21, valor numérico */
  textoGenerico21: number | string;

  /** Texto genérico 22, valor numérico */
  textoGenerico22: number | string;

  /** Texto genérico 23, valor numérico */
  textoGenerico23: number | string;

  /** Texto genérico 24, valor numérico */
  textoGenerico24: number | string;

  /** Alerta 2, valor booleano */
  alerta2: boolean;

  /** Póliza de fianza actual, valor numérico */
  polizaDeFianzaActual: number;

  /** Número de folio, valor en cadena */
  numeroFolio: string;

  /** RFC de la institución, valor en cadena */
  rfcInstitucion: string;

  /** Fecha de expedición, valor en cadena */
  fechaExpedicion: string;

  /** Fecha de inicio de vigencia no, valor en cadena */
  fechaInicioVigenciaNo: string;

  /** Fecha de fin de vigencia no, valor en cadena */
  fechaFinVigenciaNo: string;

  /** Fecha de inicio de vigencia, valor en cadena */
  fechaInicioVigencia: string;

  /** Fecha de fin de vigencia, valor en cadena */
  fechaFinVigencia: string;

  /** Importe total, valor en cadena */
  importeTotal: string;

  /** Razón social anterior, valor en cadena */
  razonSocialAnterior: string;

  /** Razón social actual, valor en cadena */
  razonSocialActual: string;

  /** RFC, valor en cadena */
  rfc: string;

  /** CURP, valor en cadena */
  curp: string;

  /** Nombre, valor en cadena */
  nombre: string;

  /** Apellido paterno, valor en cadena */
  apellidoPaterno: string;

  /** Apellido materno, valor en cadena */
  apellidoMaterno: string;

  /**
   * @description Carácter del miembro en la solicitud.
   */
  miembroCaracterDe: string | number;

  /**
   * @description Indica si el miembro tiene obligación de tributar en México.
   */
  miembroTributarMexico: number | string;

  /**
   * @description Nacionalidad del miembro.
   */
  miembroNacionalidad: string | number;

  /**
   * @description Registro Federal de Contribuyentes (RFC) del miembro.
   */
  miembroRfc: string;

  /**
   * @description Registro federal del miembro ante autoridades pertinentes.
   */
  miembroRegistroFederal: string;

  /**
   * @description Nombre completo del miembro.
   */
  miembroNombreCompleto: string;

  /**
   * @description Tipo de persona muestra en la solicitud.
   */
  miembroTipoPersonaMuestra: string | number;

  /**
   * @description Nombre del miembro.
   */
  miembroNombre: string;

  /**
   * @description Apellido paterno del miembro.
   */
  miembroApellidoPaterno: string;

  /**
   * @description Apellido materno del miembro.
   */
  miembroApellidoMaterno: string;

  /**
   * @description Nombre de la empresa del miembro.
   */
  miembroNombreEmpresa: string;

  /**
   * @description Entidad federativa correspondiente al miembro.
   */
  entidadFederativa: string | number;

  /** Descripción de las principales instalaciones, puede ser un texto o un número */
  instalacionesPrincipales: string | number;

  /** Nombre del municipio donde se encuentra la instalación */
  municipio: string;

  /** Tipo de instalación representado por un número */
  tipoDeInstalacion: number;

  /** Nombre de la entidad federativa donde se ubica */
  federativa: string;

  /** Número de registro en la Secretaría correspondiente */
  registroSE: string;

  /** Descripción detallada de la instalación */
  desceripe: string;

  /** Código postal de la ubicación */
  codigoPostal: string;

  /** Identificador del proceso productivo, puede ser un número o una descripción */
  procesoProductivo: number | string;
}

/**
 * Interfaz que representa los catálogos de garantías disponibles.
 */
export interface GarantiaCatalogo {
  /**
   * Catálogo de opciones de fianza.
   */
  fianzaCatalogo: Catalogo[];

  /**
   * Catálogo de opciones de crédito.
   */
  creditoCatalogo: Catalogo[];
}
