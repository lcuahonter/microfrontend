/**
 * @interfaz
 * @nombre TablaEnlaceOperativo
 * @descripción
 * Representa un enlace operativo. Contiene los datos personales y de contacto de un enlace operativo, incluyendo su ciudad, cargo y si es suplente.
 */
export interface TablaEnlaceOperativo {
  registro: string; // Registro único del enlace operativo.
  id: number; // Identificador único del enlace.
  rfc: string; // Registro Federal de Contribuyentes.
  nombre: string; // Nombre del enlace operativo.
  apellidoPaterno: string; // Apellido paterno del enlace.
  apellidoMaterno: string; // Apellido materno del enlace.
  cuidad: string; // Ciudad en la que reside el enlace.
  cargo: string; // Cargo que desempeña el enlace operativo.
  telefono: string; // Número de teléfono de contacto.
  correoElectronico: string; // Correo electrónico del enlace operativo.
  suplente: boolean; // Indica si el enlace operativo es suplente.
  seleccionado?: boolean; // Indica si el enlace ha sido seleccionado (opcional).
}

/**
 * @interfaz
 * @nombre EnlaceOperativoRespuestaTabla
 * @descripción
 * Estructura de respuesta al obtener datos de enlaces operativos. Contiene código de estado, mensaje y la lista de enlaces.
 */
export interface EnlaceOperativoRespuestaTabla {
  code: number; // Código de estado de la respuesta HTTP.
  data: TablaEnlaceOperativo[]; // Arreglo de datos de personas notificaciones.
  message: string; // Mensaje descriptivo de la respuesta.
}
