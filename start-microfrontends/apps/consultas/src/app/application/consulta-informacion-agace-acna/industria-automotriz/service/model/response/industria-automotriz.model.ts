/**
 * Interface que representa un proveedor de la industria automotriz.
 */
export interface ProveedorIndustriaAutomotriz {
    rfcIndustriaAutomotriz: string;
    rfcProveedor: string;
    nombreProveedor: string;
    domicilioFiscalProveedor: string;
    norma: string;
    numeroProgramaIMMEX: string;
    numeroProgramaPROSEC: string;
    aduanasOpera: string;
    fechaInicioRelacion: string;
    fechaFinRelacion: string;
}

/**
 * Interface que representa la respuesta de la consulta de industria automotriz.
 */
export interface ConsultaIndustriaAutomotrizResponse {
    data: ProveedorIndustriaAutomotriz[];
    total: number;
}
