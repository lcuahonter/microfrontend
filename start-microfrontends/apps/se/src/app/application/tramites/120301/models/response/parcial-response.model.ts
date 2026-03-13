/**
 * Modelo de salida para el tramite 120301. 
 * Interfaz que representa un guardado parcial de la solicitud
*/
export interface ParcialResponse{
    
    /** ID único de la solicitud */
    id_solicitud: number;
    
    /** ID de la expedición relacionada */
    id_expedicion: number;
}