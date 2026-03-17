/**
 * Interfaz para la configuración de los requerimientos.
 * Permite activar o desactivar ciertos campos en el formulario de requerimientos.
 */
export interface RequerimientoConfig {
    /**
     * Indica si se debe mostrar el campo de tipo de requerimiento.
     */
    isTipoRequerimiento: boolean;

    /**
     * Indica si se debe mostrar el campo de área solicitante.
     */
    isAreaSolicitante: boolean;

    /**
     * Indica si se debe mostrar el campo de justificación del requerimiento.
     */
    isJustificacionRequerimiento: boolean;

    /**
     * Indica si se debe mostrar una segunda tabla en la interfaz.
     */
    isSegundaTabla?: boolean;

    /**
     * Indica si el cuerpo de los documentos puede ser nulo.
     */
    isBodyNullDocumentos?: boolean;

    /**
     * Indica si el cuerpo de los documentos puede ser nulo.
     */
    isFundamento?: boolean;
}