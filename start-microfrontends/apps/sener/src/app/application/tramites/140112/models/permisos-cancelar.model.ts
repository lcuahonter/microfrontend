/**
 * Representa la estructura de los datos de respuesta para permisos a cancelar.
 */
export interface PermisosCancelarData {
    /**
     * Código de estado de la respuesta.
     */
    code: number;

    /**
     * Lista de permisos a cancelar.
     */
    data: PermisosCancelar[];

    /**
     * Mensaje descriptivo de la respuesta.
     */
    message: string;
}

/**
 * Representa un permiso a cancelar.
 */
export interface PermisosCancelar {
    /**
     * Identificador único del permiso.
     */
    id: number;

    /**
     * Folio del trámite asociado al permiso.
     */
    folioTramite: number;

    /**
     * Tipo de solicitud del permiso.
     */
    tipoSolicitud: string;

    /**
     * Régimen asociado al permiso.
     */
    regimen: string;

    /**
     * Clasificación del régimen del permiso.
     */
    clasificacionRegimen: string;

    /**
     * Condición de la mercancía asociada al permiso.
     */
    condicionDeLaMercancia: string;

    /**
     * Fracción arancelaria asociada al permiso.
     */
    fraccionArancelaria: string;

   /**
    * Descripción genérica del permiso, almacenada como CLOB.
    */
    descripcionClobGenerica1?: string;

    /**
     * Indica si se ha marcado la declaración de veracidad.
     */
    declaracionBoolean?: boolean;
}