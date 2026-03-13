import { CatalogosSelect } from '@libs/shared/data-access-user/src';

/**  
 * Representa un aviso de catálogo con diversas opciones seleccionables.  
 */
export interface AvisoCatalogo {
  /** Clave de fracción arancelaria seleccionada. */
  cveFraccionArancelaria: CatalogosSelect;
  
  /** Entidad federativa seleccionada. */
  entidadFederativa: CatalogosSelect;
  
  /** Delegación o municipio seleccionado. */
  delegacionMunicipio: CatalogosSelect;
  
  /** Colonia seleccionada. */
  colonia: CatalogosSelect;
  
  /** Aduana de importación seleccionada. */
  aduanaDeImportacion: CatalogosSelect;
  
  /** Opción de tipo de documento seleccionado. */
  opcionTipoDeDocumento: CatalogosSelect;
}

/**  
 * Representa una operación de importación con datos esenciales.  
 */
export interface OperacionDeImportacion {
  /** Nombre del agente aduanal. */
  patente_autorizacion: string;
  
  /** RFC del importador. */
  rfc: string;
  
  /** Número de pedimento asociado a la importación. */
  pedimento: string;
  
  /** Aduana donde se realiza la importación. */
  cve_aduana: string;

  aduana_desc: string;
}

/**  
 * Representa los requisitos obligatorios de un proceso de importación.  
 */
export interface RequisitosObligatorios {
  /** Número de serie del producto. */
  numeroDeSerie: number;
  
  /** Valor asociado al requisito obligatorio. */
  valor: string;
}

/**  
 * Representa un aviso con opciones de radio y su estado de selección.  
 */
export interface AvisoOpcionesDeRadio {
  /** Título del aviso. */
  opcionesDeRadio: OpcionesDeRadio[];
  /** Opción seleccionada por el usuario. */
  required: boolean;
}

/**
 * Representa una opción de radio con su etiqueta y valor asociado.
 */
export interface OpcionesDeRadio {
  /** Etiqueta de la opción de radio. */
  label: string;
  /** Valor asociado a la opción de radio. */
  value: string | number;
}

/**
 * Representa la estructura de una respuesta JSON que contiene datos de catálogo.
 *
 * @property codigo - El código de respuesta que indica el estado de la solicitud.
 * @property datos - Mensaje de la consulta en string.
 * @property mensaje - Un mensaje que proporciona información adicional sobre la respuesta.
 */
export interface JsonResponseString {
  codigo: string
  datos: string
  mensaje: string
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