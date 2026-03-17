
export interface BusquedaAereoResponse {

    registros: DatosAereoResponse[];

    paginacion?: PaginacionResponse;
}

/**
 * Representa las propiedades para obtener la consulta de CAAT Aéreo.
 * @interface DatosAereoResponse
 * 
 * @property {string} denominacion - Nombre, denominacion o razón social de la empresa.
 * @property {string} rfc - Registro Federal de Contribuyentes de la empresa.
 * @property {string} caat - Clave de Autorización de Agente Aduanal Terrestre.
 * @property {string} perfil_caat - Perfil del CAAT.
 * @property {date} fecha_inicial - Fecha inicial de vigencia del CAAT.
 * @property {date} fecha_final - Fecha final de vigencia del CAAT.
 * @property {string} director_general - Nombre del Director General de la empresa.
 */
export interface DatosAereoResponse {
    denominacion: string;
    rfc: string;
    caat: string;
    perfil_caat?: string;
    fecha_inicial?: Date;
    fecha_final?: Date;
    director_general?: string;
}

export interface PaginacionResponse {
    num_pag?: number;
    tam_pag?: number;
    total_elementos?: number;
    total_paginas?: number;
    es_ultima_pag?: boolean
}