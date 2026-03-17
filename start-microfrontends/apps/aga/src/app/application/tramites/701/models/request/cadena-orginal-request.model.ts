/**
 * Modelo de la cadena original para el trámite 701.
 */
export interface CadenaOriginal701 {
    /**
     * Lista de documentos requeridos.
     */
    documentos_requeridos: DocumentosRequerido[];
}

/**
 * Modelo de los documentos requeridos en la cadena original.
 */
export interface DocumentosRequerido {
    /**
     * Clave de la persona asociada al documento.
     */
    cve_persona: number;

    /**
     * ID del documento seleccionado.
     */
    id_documento_seleccionado: number;
}
