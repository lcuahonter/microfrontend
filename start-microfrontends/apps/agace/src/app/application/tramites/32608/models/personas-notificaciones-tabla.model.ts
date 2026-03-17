/**
 * Interfaz que define la estructura de datos para una persona en la tabla de notificaciones.
 * 
 * Representa la información básica de una persona que puede recibir notificaciones
 * en el sistema VUCEM, incluyendo datos de identificación personal y fiscal.
 * 
 * @description Esta interfaz se utiliza para:
 * - Mostrar datos en la tabla dinámica de personas
 * - Validar la estructura de datos recibidos del servidor
 * - Tipificar objetos de persona en el frontend
 * 
 */
export interface TablaPersonasNotificaciones {
    /** 
     * Registro Federal de Contribuyentes de la persona.
     * @description Clave alfanumérica de 12 o 13 caracteres que identifica fiscalmente a la persona
     */
    rfc: string;
    
    /** 
     * Clave Única de Registro de Población.
     * @description Identificador único de 18 caracteres asignado por el gobierno mexicano
     */
    curp: string;
    
    /** 
     * Nombre(s) de la persona.
     * @description Primer nombre o nombres de la persona física
     */
    nombre: string;
    
    /** 
     * Apellido paterno de la persona.
     * @description Apellido heredado del padre
     */
    apellidoPaterno: string;
    
    /** 
     * Apellido materno de la persona.
     * @description Apellido heredado de la madre
     */
    apellidoMaterno: string;
}


/**
 * Interfaz que define la estructura de respuesta del servidor para la tabla de personas.
 * 
 * Encapsula la respuesta estándar del API que contiene información sobre personas
 * notificaciones, incluyendo código de estado, datos y mensaje descriptivo.
 * 
 * @description Esta interfaz estandariza las respuestas del servidor para:
 * - Manejo consistente de respuestas HTTP
 * - Validación de datos recibidos
 * - Control de errores y estados de la aplicación
 * 
 * @interface PersonaRespuestaTabla
 * @since 1.0.0
 * @author Equipo de Desarrollo VUCEM
 */
export interface PersonaRespuestaTabla {
    /**
     * Código de estado de la respuesta HTTP.
     * @description Indica el resultado de la operación (200: éxito, 4xx: error cliente, 5xx: error servidor)
     * @example 200, 400, 404, 500
     */
    code: number;
    
    /**
     * Arreglo de datos de personas notificaciones.
     * @description Contiene la lista de personas obtenidas del servidor
     */
    data: TablaPersonasNotificaciones[];
    
    /**
     * Mensaje descriptivo de la respuesta.
     * @description Proporciona información adicional sobre el resultado de la operación
     * @example "Operación exitosa", "Error al obtener datos"
     */
    message: string;
}