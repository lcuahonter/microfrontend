/**
 * Modelo de datos generales del trámite
 */
export interface DatosGeneralesDelTramite {
    /**
     * Número de trámite.
     */
    numeroDeTramite: string;
    /**
     * Tipo de solicitud
     */
    tipoDeSolicitud: string;
    /**
    * Días habiles trasncurridos
    */
    diasHabilesTranscurridos: string;
    /**
     * Tareas activas
     */ 
    tareasActivas: TareasActivas[];
}

/**
 * Modelo de tareas activas
 */
export interface TareasActivas {
    /**
     * Nombre de la tarea
     */
    nombreTarea: string;
    /**
     * Fecha de inicio de la tarea      
     * */
    asignadoA: string;
    /**
     * Fecha de inicio de la tarea
     */
    fechaAsignacion: string;
}