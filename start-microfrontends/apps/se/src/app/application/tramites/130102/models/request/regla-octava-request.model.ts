/**
 * Modelo de la petición para guardar la Regla Octava.
 */
export interface SaveReglaOctavaRequest {
    cve_regimen: string;
    cve_clasificacion_regimen: string;
    numero_autorizado_programa_prosec_pex: string;
    cve_usuario_capturista: string;
    lista_paises: string[];
    mercancia: {
        cve_fraccion_arancelaria: string;
        cve_subdivision: string;
        descripcion: string;
        cve_unidad_medida_tarifaria: string;
        cantidad_tarifaria: number;
        valor_factura_usd: number;
        ide_condicion_mercancia: string;
    };
    solicitante: {
        rfc: string;
        nombre: string;
        es_persona_moral: boolean;
        certificado_serial_number: string;
    };
    representacion_federal: {
        cve_entidad_federativa: string;
        cve_unidad_administrativa: string;
    };
    partidas_mercancia: PartidaMercanciaContrato[];
    cantidad_total: number;
    cantidad_total_usd: number;
    lista_fracciones_prosec: FraccionesProsecRequest[];
}


/**
 * Modelo para almacenar la fracción y clave de una fracción de un programa PROSEC.
 */
export interface FraccionesProsecRequest {
    clave: string;
    fraccion: string;
}

/**
 * Modelo para almacenar la información de una partida de mercancía.
 */
export interface PartidaMercancia {
    cantidadPartidas: number;
    descripcion: string;
    valor_autorizado: number;
    cve_fraccion: string;
    importe_Unitario: number
    importe_partida_total_usd: number;
}

/**
 * Modelo para almacenar la información de una partida de mercancía.
 */
export interface PartidaMercanciaContrato {
    cantidad: number;
    descripcion: string;
    valor_autorizado: number;
    cve_fraccion: string;
    importe_Unitario: number
    importe_partida_total_usd: number;
}