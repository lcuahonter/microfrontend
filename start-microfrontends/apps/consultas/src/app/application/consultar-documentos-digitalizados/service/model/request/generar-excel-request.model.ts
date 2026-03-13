import { DatosAutorizacionRequest } from "./documentos-digitalizacion-request.model";

/**
 * Modelo de request para generar excel
 */
export interface GenerarExcelRequest {
   /** Opción de consulta */
    opcion_de_consulta: string;
    
    /** Documento electrónico */
    e_document: string;
    
    /** RFC del consultante */
    rfc: string;
    
    /** Fecha de inicio del periodo */
    fecha_inicio: string;
    
    /** Fecha de fin del periodo */
    fecha_fin: string;
    
    /** Datos de autorización */
    datos_autorizacion?: DatosAutorizacionRequest;
}