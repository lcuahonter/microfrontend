/**
 * Interfaz que representa la asociación entre una expedición y una factura
 */
export interface FacturasTplAsociadasRequest {
    /**
     * ID único de la expedición
     */
    id_expedicion: number | undefined;
    
    /**
     * ID único de la factura de expedición
     */
    id_factura_expedicion: number | undefined;
    
    /**
     * Cantidad asociada entre la factura y la expedición
     */
    cantidad_asociada: number;
}