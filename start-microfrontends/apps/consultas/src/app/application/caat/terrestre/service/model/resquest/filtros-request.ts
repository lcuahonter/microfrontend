/**
 * Modelo de los filtros para las consultas CAAT Terrestre
 */
export class FiltrosTerrestreRequest{
    constructor(
        public denominacion?: string,
        public rfc?: string,
        public caat?: string
    ){}
}