
/**
 * Interfaz que representa un programa a cancelar.
 * 
 * @property {string} folioPrograma - Identificador único del programa.
 * @property {string} idProgramaSeleccionado - ID del programa seleccionado para cancelar.
 * @property {string} modalidad - Modalidad del programa (por ejemplo, presencial, en línea).
 * @property {string} representacionFederal - Representación federal asociada al programa.
 * @property {string} tipoPrograma - Tipo de programa (por ejemplo, educativo, social).
 * @property {string} estatus - Estatus actual del programa (por ejemplo, activo, cancelado).
 */


export interface ProgramaACancelar {
    folioPrograma: string; 
    idProgramaSeleccionado?: string; 
    modalidad: string; 
    representacionFederal: string; 
    tipoPrograma: string; 
    estatus: string;
    idProgramaAutorizado: string;
    movimientoProgramaSE: string | null;
    rfc: string | null;
    resolucion: string | null;
    unidadAdministrativa: string | null;
    fechaInicioVigencia: string | null;
    fechaFinVigencia: string | null;
    actividadProductiva: string | null;
    fechaSuspension: string | null;
    contadorGrid: number | null;
    idProgramaCompuesto: string | null;
    
}
/**
 * Constante que representa el identificador de la tabla de cancelaciones disponibles.
 */

export const TABLE_ID = "cancelacionesDisponibles";