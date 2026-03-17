/**
 * Representa la estructura de datos para la validación de un horario.
 * 
 * @interface ValidaHorario
 * 
 * @property {string} codigo - Código que identifica el resultado de la validación.
 * @property {string} mensaje - Mensaje descriptivo del resultado de la validación.
 * @property {boolean} datos - Indica si los datos proporcionados son válidos (true) o no (false).
 */
export interface ValidaHorario {
    codigo: string;
    mensaje: string;
    datos: boolean;
}


/**
 * Representa el cuerpo de la solicitud para validar un horario.
 * 
 * @interface BodyValidaHorario
 * 
 * @property {string} fecha - Fecha en formato de cadena (por ejemplo, "DD/MM/AAAA").
 * @property {string} horario - Horario en formato de cadena (por ejemplo, "HH:mm").
 * @property {string} cve_aduana - Clave de la aduana asociada.
 * @property {number} id_seccion - Identificador numérico de la sección.
 * @property {string} tipo_operacion - Tipo de operación a realizar (por ejemplo, "importación" o "exportación").
 */
export interface BodyValidaHorario {
    fecha: string;
    horario: string;
    cve_aduana: string;
    id_seccion: number;
    tipo_operacion: string;
}