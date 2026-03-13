/**
 * Interfaz que representa la estructura de los datos de un domicilio.
 */
export interface DomicilioData {
    /**
     * Código de respuesta.
     */
    code: number;

    /**
     * Lista de domicilios.
     */
    data: Domicilio[];

    /**
     * Mensaje asociado a la respuesta.
     */
    message: string;
}

/**
 * Interfaz que representa un domicilio individual.
 */
export interface Domicilio {
    /**
     * Identificador único del domicilio.
     */
    id: number;

    /**
     * Descripción del domicilio.
     */
    descripcion: string;
}