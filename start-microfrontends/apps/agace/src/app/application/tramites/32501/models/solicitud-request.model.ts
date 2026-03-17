import {OperacionDeImportacion} from "../models/aviso-catalogo.model";

/**
 * Representación del request de guardado.
 */
export interface GuardaSolicitud32501Request {

    /** Id solicitud */
    id_solicitud?: number;

    /** Datos de la mercancía */
    mercancia?: Mercancia;

    /** Datos del solicitante */
    solicitante: SolicitanteRequest;

    /** Dirección de la mercancía */
    direccion: DireccionMercancia;

    /** Fecha inicio  mercancia importada */
    fecha_inicio?: string;

    /** Transacción vucem */
    id_transaccion_vu?: string;

    /** Operacion de Importación */
    operacion_importacion?: OperacionDeImportacion[];

}

/**
 * Información de la mercancia a montar desmontar
 */
export interface Mercancia {

    /** Id clave fracción arancelaria */
    cve_fraccion_arancelaria?: string;

    /** nico */
    nico?: string;

    /** Descripción de la mercancía */
    descripcion_mercancia?: string;

    /** Peso en kg de la mercancía */
    peso?: Number;

    /** Valor en USD de la mercancía */
    valor_usd?: Number;

}

/**
 * Datos generales del solicitante
 */
export interface SolicitanteRequest {
    
    /** RFC del solicitante */
    rfc: string;

    /** Nombre del solicitante */
    nombre: string;

    /** Identificador de contribuyente */
    es_persona_moral: boolean;

    /** Certificado - vacio */
    certificado_serial_number: string;
}

/**
 * Información de la dirección de la mercancía.
 */
export interface DireccionMercancia {
    
    /** Nombre comercial */
    nombre_comercial: string;

    /** Clave entidad federativa */
    cve_entidad: string;

    /** Clave municipio */
    cve_deleg_mun: string;

    /** Clave colonia */
    cve_colonia: string;

    /** Calle */
    calle: string;

    /** Número Exterior */
    num_exterior: string;

    /** Numero Interior */
    num_interior: string;

    /** Codigo Postal */
    cp: string;

}

/**
 * Datos generales de la operación de importación.
 */
export interface OperacionImportacion {

    /** Numero de pedimento. */
    pedimento: string;

    /** Patente o autorizacion agente aduanal. */
    patente: string;

    /** RFC agente aduanal. */
    rfc_agente: string;

    /** Clave aduana */
    cve_aduana: string;

}