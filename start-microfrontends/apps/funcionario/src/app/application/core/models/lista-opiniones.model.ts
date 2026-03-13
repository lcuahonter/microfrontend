/**
 * Modelo para registrar opiniones
 */
export interface ListaOpiniones {
    /**
     * Identificador de opinion
     */
    idDependencia: string;
    /**
     * dependencia de opinión
     */
    dependencia: string;
    /**
     * Justificación de opinión
     */
    Justificación: string;
    /**
     * estado de requerimiento de opinión
     */
    estadoRequerimento: string;
}