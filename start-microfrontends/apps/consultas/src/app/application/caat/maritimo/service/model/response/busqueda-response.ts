
export interface BusquedaMaritimoResponse {

    registros: DatosMaritimoResponse[];

    paginacion?: PaginacionResponse;
}

/**
 * Interfaz que representa los datos de respuesta de un registro marítimo.
 * @property nombre - Nombre del registro.
 * @property rfc - RFC asociado al registro.
 * @property cve_folio_caat - Clave del folio CAAT (opcional).
 * @property ide_tipo_caat - Identificador del tipo de CAAT (opcional).
 * @property fec_ini_vigencia - Fecha de inicio de vigencia (opcional).
 * @property fec_fin_vigencia - Fecha de fin de vigencia (opcional).
 * @property nombre_director - Nombre del director asociado al registro (opcional).
 */

export interface DatosMaritimoResponse {
  nombre: string;
  rfc: string;
  cve_folio_caat?: string;
  ide_tipo_caat?: string;
  fec_ini_vigencia?: string;
  fec_fin_vigencia?: string;
  nombre_director?: string;
}


export interface PaginacionResponse {
    num_pag?: number;
    tam_pag?: number;
    total_elementos?: number;
    total_paginas?: number;
    es_ultima_pag?: boolean
}