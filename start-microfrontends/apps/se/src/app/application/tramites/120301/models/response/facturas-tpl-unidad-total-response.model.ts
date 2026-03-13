/**
 * Modelo para métricas de cantidad/total/unidad
 */
export interface FacturaTotalUnidadResponse {
    /** Cantidad numérica del ítem */
    cantidad_factura: number;
    
    /** Valor total acumulado */
    total_equivalente: number;
    
    /** Unidad de medida (kg, lt, etc) */
    unidad_label: string;
}