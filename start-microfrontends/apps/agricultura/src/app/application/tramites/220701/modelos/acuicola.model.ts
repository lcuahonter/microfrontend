/**
 * Interfaz que representa los datos del trámite.
 * Contiene información sobre los certificados autorizados.
 */
export interface DatosDelTramite {
    /**
     * Número de certificados autorizados.
     * @type {number}
     */
    certificadosAutorizados: number;
}

/**
 * Interfaz que representa los datos del responsable de la inspección.
 * Contiene información sobre el inspector y los contenedores.
 */
export interface ResponsableInspección {
    /**
     * Nombre del inspector.
     * @type {string}
     */
    nombreInsp: string;

    /**
     * Primer apellido del inspector.
     * @type {string}
     */
    primerApellido: string;

    /**
     * Segundo apellido del inspector.
     * @type {string}
     */
    segundoApellido: string;

    /**
     * Cantidad total de contenedores.
     * @type {number}
     */
    cantidadContenedores: number;
}

/**
 * Interfaz que representa los datos de la mercancía.
 * Contiene información detallada sobre la fracción arancelaria, NICO y unidad de medida.
 */
export interface MercanciaDatos {
    /**
     * Fracción arancelaria de la mercancía.
     * @type {string}
     */
    fraccionArancelaria: string;

    /**
     * Descripción de la fracción arancelaria.
     * @type {string}
     */
    descripcionFraccion: string;

    /**
     * Número de Identificación Comercial (NICO).
     * @type {string}
     */
    nico: string;

    /**
     * Descripción del NICO.
     * @type {string}
     */
    descripcionNico: string;

    /**
     * Unidad de medida tarifaria.
     * @type {string}
     */
    unidadMedidaTarifa: string;

    /**
     * Cantidad total en la unidad de medida tarifaria.
     * @type {number}
     */
    cantidadTotalUMT: number;
}

/**
 * Interfaz que representa los datos del pago de derechos.
 * Contiene información sobre el banco, la clave de referencia y el importe del pago.
 */
export interface PagoDeDerechos {
    /**
     * Clave de referencia del pago.
     * @type {string}
     */
    claveDeReferencia: string;

    /**
     * Cadena de dependencia asociada al pago.
     * @type {string}
     */
    cadenaDependencia: string;

    /**
     * Banco donde se realiza el pago.
     * @type {string}
     */
    banco: string;

    /**
     * Llave de pago única.
     * @type {string}
     */
    llaveDePago: string;

    /**
     * Fecha de inicio del pago.
     * @type {string}
     */
    fechaInicio: string;

    /**
     * Importe total del pago.
     * @type {string}
     */
    importeDePago: string;
}

/**
 * Interfaz que representa los datos de revisión del pago de derechos.
 * Contiene información sobre el banco, la clave de referencia y el importe del pago revisado.
 */
export interface PagoDeDerechosRevision {
    /**
     * Clave de referencia revisada del pago.
     * @type {string}
     */
    claveDeReferenciaRevision: string;

    /**
     * Cadena de dependencia revisada asociada al pago.
     * @type {string}
     */
    cadenaDependenciaRevision: string;

    /**
     * Banco revisado donde se realiza el pago.
     * @type {string}
     */
    bancoRevision: string;

    /**
     * Llave de pago revisada.
     * @type {string}
     */
    llaveDePagoRevision: string;

    /**
     * Fecha de inicio revisada del pago.
     * @type {string}
     */
    fechaInicioRevision: string;

    /**
     * Importe total revisado del pago.
     * @type {string}
     */
    importeDePagoRevision: string;
}
