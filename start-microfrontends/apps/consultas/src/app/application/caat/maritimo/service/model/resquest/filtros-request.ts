/**
 * Modelo de los filtros para la consulta de CAAT Marítimo
 */

export class FiltrosMaritimoRequest{
    constructor(
        public denominacion?: string,
        public rfc?: string,
        public caat?: string
    ){}
}