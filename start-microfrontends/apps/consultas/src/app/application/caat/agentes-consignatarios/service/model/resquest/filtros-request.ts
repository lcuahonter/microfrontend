/**
 * Modelo de los filtros para la consulta de CAAT Agentes Consignatarios
 */
export class FiltrosAgentesRequest{
    constructor(
        public denominacion?: string,
        public rfc?: string,
        public caat?: string
    ){}
}