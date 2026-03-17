
/**
 * Modelo de datos para la solicitud de captura de facturas TPL.
 */
export interface FacturaTplCapturaRequest {
    // ID único de la factura en el sistema
    id_factura_expedicion: number | null;
    // Número de factura asignado por el emisor
    num_factura: string;
    // Fecha de expedición de la factura
    fecha_expedicion: string;
    // Razón social del consignatario/emisor
    razon_social_consig_emisor: string;
    // ID del régimen fiscal
    ide_regimen: string;
    // Dirección del consignatario/emisor
    cantidad: number;
    // Importe en dólares de la factura
    importe_dolares: number;
    // Descripción de la unidad de medida
    domicilio: string;
    // Clave de la unidad de medida
    cve_unidad_medida: string;
    // Tax ID del consignatario/emisor
    tax_id: string;
    // Dirección del consignatario/emisor
    ciudad: string;
    // Estado o provincia del consignatario/emisor
    cp: string;
    // País del consignatario/emisor
    pais: string;
}