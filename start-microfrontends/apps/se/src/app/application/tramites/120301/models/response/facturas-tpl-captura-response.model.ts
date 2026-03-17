/**
 * Modelo de respuesta para facturas TPL.
 */
export interface FacturasTplCapturaResponse {
    // ID único de la factura en el sistema
    id_factura_expedicion: number;
    // Número de factura asignado por el emisor
    num_factura: string;
    // Razón social del consignatario/emisor
    razon_social_consig_emisor: string;
    // Dirección del consignatario/emisor
    direccion_consig_emisor: string;
    // Ciudad del consignatario/emisor
    ciudad_consig_emisor: string;
    // Estado del consignatario/emisor
    pais_consig_emisor: string;
    // Código postal del consignatario/emisor
    cp_consig_emisor: string;
    // tax_id del consignatario/emisor 
    tax_id_consig_emisor: string;
    // Fecha de expedición de la factura
    fecha_expedicion: string;
    /// Número total de elementos disponibles
    cantidad: number;
    // Descripción de la unidad de medida
    descripcion: string;
    // Importe total en dólares estadounidenses
    imp_dls: number;
    // cantidad total de unidades facturadas
    cantidad_total: number;
    // cantidad de unidades devueltas
    cantidad_devolucion: string;
    // Suma acumulada de cantidades devueltas
    suma_cantidad_devolucion: number;
    // cantidad de unidades disponibles
    cantidad_disponible: number;
}

