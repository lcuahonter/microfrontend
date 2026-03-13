/**
 * @description Representa la respuesta de la validación de autorización LDA.
 *
 * @property codigo - Código de resultado de la validación.
 * @property mensaje - Mensaje descriptivo del resultado.
 * @property datos - Arreglo con los detalles de las validaciones de autorización LDA.
 */
export interface ValidacionLDAAutorizacionResponse {
  codigo: string;
  mensaje: string;
  datos: ValidacionLDAAutorizacion[];
}

/**
 * @description Representa la estructura de una validación de autorización LDA.
 *
 * @property aduana_despacho - Código de la aduana de despacho.
 * @property id_seccion_despacho - Identificador de la sección de despacho.
 * @property rfc_despacho_lda - RFC de despacho LDA.
 * @property tipo_despacho - Tipo de despacho (ej. LDA).
 * @property aduana_despacho_descripcion - Descripción de la aduana de despacho.
 * @property seccion_despacho_descripcion - Descripción de la sección de despacho.
 * @property tipo_despacho_descripcion - Descripción del tipo de despacho.
 * @property fecha_inicio_vigencia - Fecha de inicio de vigencia de la autorización.
 * @property fecha_fin_vigencia - Fecha de fin de vigencia de la autorización.
 */
export interface ValidacionLDAAutorizacion {
  aduana_despacho: string;
  id_seccion_despacho: number;
  rfc_despacho_lda: string;
  tipo_despacho: string;
  aduana_despacho_descripcion: string;
  seccion_despacho_descripcion: string;
  tipo_despacho_descripcion: string;
  fecha_inicio_vigencia: string;
  fecha_fin_vigencia: string;
}

/**
 * @description  de la solicitud para validar el RFC de autorización LDA.
 *
 * @property rfc_lda - RFC de la autorización LDA.
 * @property rfc_solicitante - RFC del solicitante.
 * @property fecha_inicio - Fecha de inicio del periodo de validación.
 * @property fecha_fin - Fecha de fin del periodo de validación.
 * @property tipo_patente - Tipo de patente del solicitante.
 */
export interface BodyValidarRFCAutorizacionLDA {
  rfc_lda: string;
  rfc_solicitante: string;
  fecha_inicio: string;
  fecha_fin: string;
  tipo_patente: string;
}

export interface BodyValidarRFCAutorizacionDDEX {
  folio_ddex: string;
  fecha_inicio: string;
  fecha_final: string;
  session: DatosRol;
}

export interface DatosRol {
  tipo_patente: string;
  rfc_solicitante: string;
}

export interface ValidacionDDEXAutorizacionResponse {
  codigo: string;
  mensaje: string;
  datos: boolean;
} 
