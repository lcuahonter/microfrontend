/**
 * @interfaz
 * @nombre TablaPersonasNotificaciones
 * @descripción
 * Representa la información básica de una persona que puede recibir notificaciones en el sistema VUCEM, incluyendo datos de identificación personal y fiscal.
 */
export interface TablaPersonasNotificaciones {
  rfc: string; // Registro Federal de Contribuyentes de la persona.
  curp: string; // Clave Única de Registro de Población.
  nombre: string; // Nombre(s) de la persona.
  apellidoPaterno: string; // Apellido paterno de la persona.
  apellidoMaterno: string; // Apellido materno de la persona.
}

/**
 * @interfaz
 * @nombre PersonaRespuestaTabla
 * @descripción
 * Estructura de respuesta del servidor para la tabla de personas. Contiene código, datos y mensaje descriptivo.
 * @since 1.0.0
 * @author Equipo de Desarrollo VUCEM
 */
export interface PersonaRespuestaTabla {
  code: number; // Código de estado de la respuesta HTTP.
  data: TablaPersonasNotificaciones[]; // Arreglo de datos de personas notificaciones.
  message: string; // Mensaje descriptivo de la respuesta.
}
