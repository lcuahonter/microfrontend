
export interface BusquedaInformacionAutomotrizResponse {

    registros: DatosAutomotrizResponse[];

    paginacion?: PaginacionResponse;
}

/**
 * Representa las propiedades para obtener la consulta de la industria automotriz.
 * @interface DatosAutomotrizResponse
 * 

 * @property {string} rfc_industria - Registro Federal de Contribuyentes de la empresa.
 * @property {string} rfc_proveedor - Nombre o razón social de la empresa.
 * @property {string} denominacion - Denominación o nombre comercial de la empresa.
 * @property {string} domicilio_fiscal - Domicilio fiscal de la empresa.
 * @property {string} norma- País de origen o ubicación de la empresa.
 * @property {string} numero_immex - Número IMMEX asignado a la empresa.
 * @property {string} numero_prosec - Numero de numero_prosec asignado a la empresa.
 * @property {string} aduanas_opera - Lista de aduanas donde la empresa tiene operaciones.
 * @property {Date} fecha_inicio_relacion - Fecha de inicio de operaciones de la empresa.
 * @property {Date} fecha_fin_relacion - Fecha de fin de operaciones de la empresa.
 */
export interface DatosAutomotrizResponse {
    rfc_industria: string;
    rfc_proveedor: string;
    denominacion: string;
    domicilio_fiscal: string;
    norma: string;
    numero_immex: string;
    numero_prosec: string;
    aduanas_opera: string;
    fecha_inicio_relacion: string;
    fecha_fin_relacion: string;
}
  
export interface PaginacionResponse {
    num_pag?: number;
    tam_pag?: number;
    total_elementos?: number;
    total_paginas?: number;
    es_ultima_pag?: boolean
}