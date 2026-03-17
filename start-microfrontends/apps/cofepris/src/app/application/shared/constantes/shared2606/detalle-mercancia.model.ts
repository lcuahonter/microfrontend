/**
 * Interfaz que define la estructura de los detalles de mercancías.
 */
export interface DetalleMercancia {
    formaFormaceutica: string;
    numeroDeRegistro: string;
    marcasDistintivas: string;
    tipoDeEnvase: string;
    id?: string
}

/**
 * Interfaz que define la estructura de los detalles de mercancías para estupefacientes.
 */
export interface DetalleMercanciaEstupefacientes {
    presentacion: string;
    numeroDePiezasAFabricar: string;
    descripcionNumeroDePiezas: string;
    numeroRegistroSanitario: string;
}