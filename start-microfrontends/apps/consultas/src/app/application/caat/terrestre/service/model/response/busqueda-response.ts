
export interface BusquedaTerrestreResponse {

    registros: DatosTerrestreResponse[];

    paginacion?: PaginacionResponse;
}

/**
 * Representa las propiedades para obtener la consulta de CAAT Terrestre.
 * @interface DatosTerrestreResponse
 * 
 * @property {string} denominacion - Nombre, denominacion o razón social de la empresa.
 * @property {string} rfc - Registro Federal de Contribuyentes de la empresa.
 * @property {string} caat - Clave de Autorización de Agente Aduanal Terrestre.
 * @property {string} perfil_caat - Perfil del CAAT.
 * @property {date} fecha_inicial - Fecha inicial de vigencia del CAAT.
 * @property {date} fecha_final - Fecha final de vigencia del CAAT.
 * @property {string} director_general - Nombre del Director General de la empresa.
 */
export interface DatosTerrestreResponse {
    nombre: string;
    rfc: string;
    cve_folio_caat: string;
    ide_tipo_caat: string;
    fec_ini_vigencia: string;
    fec_fin_vigencia: string;
    nombre_director: string;
}

export interface PaginacionResponse {
    num_pag?: number;
    tam_pag?: number;
    total_elementos?: number;
    total_paginas?: number;
    es_ultima_pag?: boolean
}