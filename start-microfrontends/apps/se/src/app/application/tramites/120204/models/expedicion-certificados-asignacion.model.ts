import { LicitacionesDisponibles } from "../../../shared/models/expedicion-certificado.model";

/**
 * Modelo para la respuesta de la API de expedición de certificados de asignación
 * @interface NumeroOficioAsignacionDetalle
 */
export interface NumeroOficioAsignacionDetalle {
    /**
     * Estado de la solicitud
     * @type {string}
     */
    estado: string;

    /**
     * Representación federal
     * @type {string}
     */
    representacionFederal: string;

    /**
     * Monto total de la solicitud
     * @type {number}
     */
    sumaAprobada: number;

    /**
     * Monto total expedido
     * @type {number}
     */
    sumaExpedida: number;

    /**
     * Monto total disponible
     * @type {number}
     */
    montoDisponible: number;

    /**
     * Número de oficio
     * @type {string}
     */
    numOficio: string;

    /**
     * Fecha de inicio de vigencia aprobada
     * @type {string}
     */
    fechaInicio: string;

    /**
     * Fecha de fin de vigencia aprobada
     * @type {string}
     */
    fechaFinVigenciaAprobada: string;

    /**
     * Regimen aduanero
     * @type {string}
     */
    regimenAduanero: string;

    /**
     * Producto descripción
     * @type {string}
     */
    descripcionProducto: string;

    /**
     * Clasificación del subproducto
     * @type {string}
     */
    clasificaionSubproducto: string;

    /**
     * Unidad de medida oficial del cupo
     * @type {string}
     */
    unidadMedidaOficialCupo: string;

    /**
     * Fecha de inicio de vigencia
     * @type {string}
     */
    fechaInicioVigencia: string;

    /**
     * Fecha de fin de vigencia
     * @type {string}
     */
    fechaFinVigencia: string;

    /**
     * Mecanismo de asignación
     * @type {string}
     */
    mecanismoAsignacion: string;

    /**
     * Tratado de libre comercio
     * @type {string}
     */
    tratado: string;

    /**
     * Fracciones arancelarias
     * @type {string}
     */
    fraccionesArancelarias: string;

    /**
     * Países de cupo
     * @type {string}
     */
    paisesCupo: string;

    /**
     * Observaciones
     * @type {string}
     */
    observaciones: string;

    /**
     * Fundamento descripción
     * @type {string}
     */
    descripcionFundamento: string;

    /**
     * Monto disponible de la asignación
     * @type {number}
     */
    montoDisponibleAsignacion: number;
}

/**
 * Modelo para la respuesta de la API de expedición de certificados de asignación
 * @interface NumeroOficioAsignacionDetalleRespquesta
 */
export interface NumeroOficioAsignacionDetalleRespquesta {
    /**
     * Código de respuesta de la API
     * @type {number}
     */
    code: number;

    /**
     * Datos de la respuesta de la API
     * @type {NumeroOficioAsignacionDetalle[]}
     */
    data: NumeroOficioAsignacionDetalle[];

    /**
     * Mensaje de respuesta de la API
     * @type {string}
     */
    message: string;
}

/**
 * Modelo para la respuesta de la API de expedir monto
 * @interface ExpedirMonto
 */
export interface ExpedirMonto {
    /**
     * Monto a expedir
     * @type {number}
     */
    montoExpedir: number;
}

export interface ProductorExportador {
  datos: LicitacionesDisponibles;
}

/**
 * Interface para la respuesta de licitaciones de la API
 */
export interface ListaMontosCertificados {
  licitaciones: LicitacionesDisponibles[];
}

/**
 * Interface para la respuesta completa de la API de licitaciones
 */
export interface ApiLicitacionesResponse {
  codigo: string;
  mensaje: string;
  datos: ListaMontosCertificados;
}