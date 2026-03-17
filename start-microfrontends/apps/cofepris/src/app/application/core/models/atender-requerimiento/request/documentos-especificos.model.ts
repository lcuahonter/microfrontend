/**
 * Representa la información requerida para generar o consultar documentos específicos
 * relacionados con un PEXIM.
 */
export interface DocumentosEspecificosRequest {
    /** Identificador único del PEXIM. */
    id_pexim: number;

    /** Lista de claves de fracciones arancelarias asociadas. */
    list_fraccion_arancelarias: string[];

    /** Lista de identificadores de mecanismos de asignación asociados. */
    list_mecanismo_asignaciones: number[];

    /** Lista de identificadores de tratamientos asociados. */
    list_tratamientos: number[];

    /** Clave que identifica el tipo de acción del mecanismo. */
    clave_tipo_accion_mecanismo: string;

    /** Descripción del tipo de acción del mecanismo. */
    descripcion_tipo_accion_mecanismo: string;

    /** Esquema de regla octava aplicado. */
    esquema_regla_octava: number;
}
