/** 
 * Modelo de respuesta para el tipo de documento.
 */
export interface TipoDocumentoResponse {

  /** Identificador del tipo de documento */
  id: number;

  /** Descripción del tipo de documento */
  descripcion: string;

  /** Clave del tipo de documento */
  clave: string | number;
}

export interface DocumentoTabla {

  /** Identificador único del documento */
  id: number;      

  /** Clave del documento */
  clave: string | number;

  /** Descripción del documento */
  seleccionado: boolean;          

  /** Tipo de documento */
  tipoDocumento: string;  
  
  /** RFC asociado al documento */
  rfc: string;

  /** Razón social asociada al documento */
  razonSocial: string;  
}
