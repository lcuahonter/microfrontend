/**
 * Modelo para la consulta de socios accionistas.
 * Este modelo define la estructura de los datos que se obtienen al consultar
 */
export interface ConsultaSocioNacional {
    /** Identificador único del socio nacional. */
    rfc: string;
    /** Nombre del socio nacional. */
    nombre: string;
    /** Apellido paterno del socio nacional. */
    apellidoPaterno: string;
    /** Apellido materno del socio nacional. */
    apellidoMaterno: string;
    /** Nacionalidad del socio nacional. */
    nacionalidad: string;
    /** Tipo de persona (física o moral) del socio nacional. */
    tipoPersona: string;
}