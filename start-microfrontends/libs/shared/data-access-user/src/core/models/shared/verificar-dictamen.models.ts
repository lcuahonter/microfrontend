import { Catalogo } from "./catalogos.model";

/**
 * `VerificarDictamen` define una interfaz en TypeScript que representa
 * la estructura de un reporte de verificación para un dictamen.
 * Incluye propiedades como `numeroDeTramite`, `sentidoDelDictamen`,
 * `fundamento`, `justificacion`, `plazo` y `requisitos`.
 * Esta interfaz se puede usar para asegurar consistencia y verificación
 * de tipos al trabajar con objetos que representan la verificación de dictámenes.
 */
export interface VerificarDictamenModel {
    /**
     * Número de trámite
     */
    numeroDeTramite: string;

    /**
     * Sentido del dictamen: Aceptado, Rechazado, Parcial
     */
    sentidoDelDictamen: string;

    /**
     * Fundamento del dictamen
     */
    fundamento: string;

    /**
     * Justificación del dictamen
     */
    justificacion: string;

    /**
     * Plazo para presentar el dictamen
     */
    plazo: string;

    /**
     * Requisitos para el dictam
     */

    requisitos: Catalogo[];

    /**
     * Tipo de analisis
     */
    tipoAnalisis: string;
    
    /**
     * Numero de muestras
     */
    numeroDeMuestras:string;

    /**
     * Siglas del dictaminador
     */

    siglasDictaminador:string;

    /**
     * Asignar autorizador
     */
    asignarAutorizador: Catalogo[];
}
