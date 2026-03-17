/**
 * Interfaz que representa el detalle de una mercancía.
 * Incluye información sobre la forma farmacéutica, registro, marcas, envase e identificador.
 */
export interface DetalleMercancia {
    /** Forma farmacéutica de la mercancía. */
    formaFormaceutica: string;
    /** Número de registro sanitario de la mercancía. */
    numeroDeRegistro: string;
    /** Marcas distintivas asociadas a la mercancía. */
    marcasDistintivas: string;
    /** Tipo de envase de la mercancía. */
    tipoDeEnvase: string;
    /** Identificador único de la mercancía (opcional). */
    id?: string
}

/**
 * Interfaz para detalles específicos de mercancías estupefacientes.
 * Incluye presentación, piezas a fabricar, descripción y registro sanitario.
 */
export interface DetalleMercanciaEstupefacientes {
    /** Presentación del estupefaciente. */
    presentacion: string;
    /** Número de piezas a fabricar. */
    numeroDePiezasAFabricar: string;
    /** Descripción del número de piezas a fabricar. */
    descripcionNumeroDePiezas: string;
    /** Número de registro sanitario del estupefaciente. */
    numeroRegistroSanitario: string;
}