/** Modelo de relación expedición-factura */
export interface FacturasTplEliminarRequest {
    /** ID de la expedición */
    id_expedicion: number | undefined;
    /** ID de la factura asociada */
    id_factura_expedicion: number | undefined;
}