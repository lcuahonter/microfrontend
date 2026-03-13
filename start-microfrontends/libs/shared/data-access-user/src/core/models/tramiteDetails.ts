
/**
 * Representa los detalles de un trámite (procedimiento o proceso).
 *
 * @interface TramiteDetails
 * 
 * @property {number} id - El identificador único para los detalles del trámite.
 * @property {number} tramite - El identificador del trámite asociado.
 * @property {string} linkDashboard - El enlace URL al panel relacionado con el trámite.
 * @property {string} linkDepartment - El enlace URL al departamento encargado del trámite.
 * @property {string} department - El nombre del departamento responsable del trámite.
 */
export interface TramiteDetails {
    id: number;
    tramite: number;
    linkDashboard: string;
    linkDepartment: string;
    department: string;
}