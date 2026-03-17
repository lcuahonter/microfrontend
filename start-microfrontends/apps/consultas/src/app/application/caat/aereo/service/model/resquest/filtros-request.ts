/**
 * Modelo de los filtros para la consulta de CAAT Aéreo
 */
export class FiltrosAereoRequest{
    constructor(
        public denominacion?: string,
        public rfc?: string,
        public caat?: string
    ){}
}