/**
 * Modelo para la respuesta de cupos
 * @interface InstrumentoCupoTPLForm
 */
export interface InstrumentoCupoTPLForm {
    /**
     * Identificador único del cupo
     * @type {number}
     */
    id?: number;

    /**
     * Clave del tratado
     * @type {string}
     */
    cveTratado: string;

    /**
     * Clave del régimen de clasificación
     * @type {string}
     */
    cveRegimenClasificacion: string;

    /**
     * Clave del país de destino
     * @type {string}
     */
    cvePaisDestino: string;

    /**
     * Clave de la fracción arancelaria
     * @type {string}
     */
    fraccionArancelaria: string;

    /**
     * Descripción de la categoría textil
     * @type {string}
     */
    categoriaTextilDescripcion: string;

    /**
     * Descripción del producto
     * @type {string}
     */
    productoDescripcion: string;

    /**
     * Clave del subproducto
     * @type {string}
     */
    subProductoClasificacion: string;

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
     * Monto disponible
     * @type {string}
     */
    montoDisponible: string;

    /**
     * Categoría textil
     * @type {string}
     */
    categoriaTextil: string;

    /**
     * Asignación del mecanismo
     * @type {string}
     */
    asignacionMecanismo?: string;

    /**
     * Unidad de medida
     * @type {string}
     */
    unidad?: string;

    /**
     * Factor de conversión
     * @type {number | null}
     */
    conversionFactor?: number | null;
}

/**
 * Modelo para la respuesta de cupos
 * @interface RespuestaCuposTabla
 * @description Respuesta de la tabla de cupos
 */
export interface RespuestaCuposTabla {
    /**
     * Código de respuesta
     * @type {number}
     * @description Código de respuesta
     */
    code: number;

    /**
     * Mensaje de respuesta
     * @type {InstrumentoCupoTPLForm[]}
     * @description Mensaje de respuesta
     */
    data: InstrumentoCupoTPLForm[];

    /**
     * Mensaje de éxito o error.
     * @type {string}
     * @description Mensaje de éxito o error.
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

 export interface StoreValues {
  totalExpedir?: number;
  montoExpedir?: number;
  montoDisponibleAsignacion?: number;
  cveAniosAutorizacion?: string;
  numFolioAsignacionAux?: string;
  cuerpoTabla?: unknown[];
  mostrarDetalle?: boolean;
  fechaFinVigencia?: Date;
}