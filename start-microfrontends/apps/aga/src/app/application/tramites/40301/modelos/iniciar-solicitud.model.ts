/**
 * Modelo de solicitud para iniciar un trámite.
 * Define la estructura de los datos necesarios para iniciar un trámite en el sistema.
 */
export interface IniciarSolicitudRequest {
    /**
     * RFC del solicitante que inicia el trámite.
     */
    rfc_solicitante: string;

}


/**
 * Modelo de respuesta para iniciar un tramite.
 * Define la estructura de los datos para iniciar un tramite en el sistema.
 *
 * @export
 * @interface IniciarSolicitudResponse
 */
export interface IniciarSolicitudResponse {
    /**
    Folio único del trámite CAAT
    */
    clave_folio_caat: string;    

    /**Fecha en la que finaliza la vigencia del CAAT*/
    fecha_fin_vigencia: string;    

    /**Tipo de agente asociado al trámite*/
    tipo_agente: string;    

    /**Descripción detallada del tipo de agente*/
    desc_tipo_agente: string;    
    
}