/**
 * @interface ListaPasoWizard
 * @description
 * Interfaz que representa un paso en el asistente (wizard) del trámite PROSEC.
 * Cada objeto de esta interfaz define la información necesaria para mostrar y controlar el estado de un paso dentro del flujo del wizard.
 */
export interface ListaPasoWizard {
  /**
   * @property {number} indice
   * @description
   * Índice del paso dentro del wizard. Determina el orden de aparición del paso.
   */
  indice: number;

  /**
   * @property {string} titulo
   * @description
   * Título del paso que se muestra al usuario en la interfaz del wizard.
   */
  titulo: string;

  /**
   * @property {boolean} activo
   * @description
   * Indica si el paso está activo actualmente en el flujo del wizard.
   */
  activo: boolean;

  /**
   * @property {boolean} completado
   * @description
   * Indica si el paso ha sido completado por el usuario.
   */
  completado: boolean;
}
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

/**
 * Modelo para los valores a almacenar en el store
 * @interface StoreValues
 */
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