/**
 * Interfaz que representa los datos de un trámite.
 */
export interface Tramites {
    /**
     * Identificador único del trámite.
     */
    id: string;

    /**
     * Folio asignado al trámite.
     */
    folioTramite: string;

    /**
     * Fecha en la que inició el trámite (formato ISO 8601).
     */
    fechaInicioTramite: string;

    /**
     * Número de días transcurridos desde el inicio del trámite.
     */
    diasTrascurridos: string;

    /**
     * Modalidad del trámite (puede representar el tipo o categoría del trámite).
     */
    modalidad: string;

    /**
     * RFC del solicitante que inició el trámite.
     */
    rfcSolicitante: string;

    /**
     * Nombre del solicitante que inició el trámite.
     */
    solicitante: string;

    /**
     * Estado actual del trámite (por ejemplo: "En proceso", "Finalizado").
     */
    estadoTramite: string;
}