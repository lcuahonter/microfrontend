
export interface BusquedaAgentesResponse {

    registros: PersonaSolicitudCaat[];

    paginacion?: PaginacionResponse;
}

/**
 * Representa las propiedades para obtener la consulta de CAAT Agentes Consignatarios.
 * @interface DatosAgentesResponse
 * 
 * @property {string} nombre - Nombre, denominacion o razón social de la empresa.
 * @property {string} rfc - Registro Federal de Contribuyentes de la empresa.
 * @property {string} cve_folio_caat - Clave de Autorización de Agente Aduanal Agente Consignatario.
 * @property {string} ide_tipo_caat - Perfil del CAAT.
 * @property {date} fec_ini_vigencia - Fecha inicial de vigencia del CAAT.
 * @property {date} fec_fin_vigencia - Fecha final de vigencia del CAAT.
 * @property {string} nombre_director - Nombre del Director General de la empresa.
 */
export interface DatosAgentesResponse {
    nombre: string;
    rfc: string;
    cve_folio_caat: string;
    ide_tipo_caat?: string;
    fec_ini_vigencia?: Date;
    fec_fin_vigencia?: Date;
    nombre_director?: string;
}

export interface PaginacionResponse {
    num_pag?: number;
    tam_pag?: number;
    total_elementos?: number;
    total_paginas?: number;
    es_ultima_pag?: boolean
}

export interface PersonaSolicitudCaat {
  rfc: string;
  nombre: string;
  apellido_materno: string;
  apellido_paterno: string;
  curp: string;
  razon_social: string;
  nss: string;
  cve_folio_caat: string;
  ide_tipo_caat: string;
  fec_ini_vigencia: string; 
  fec_fin_vigencia: string; 
  id_persona_solicitud: string;
  nombre_director: string;
  apellido_paterno_Director: string;
  apellido_materno_Director: string;
}