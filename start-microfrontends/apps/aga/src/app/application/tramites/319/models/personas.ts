/**
 * @interface Personas
 * @description
 * Representa el modelo de datos para una persona en el trámite 319.
 * Cada objeto de esta interfaz define la información básica de una persona.
 * @property {string} rfc - Registro Federal de Contribuyentes de la persona.
 * @property {string} curp - Clave Única de Registro de Población de la persona.
 * @property {string} nombre - Nombre de la persona.
 * @property {string} apellido_paterno - Primer apellido de la persona.
 * @property {string} apellido_materno - Segundo apellido de la persona.
 * @property {string} correo_electronico - Dirección de correo electrónico de la persona.
 */
export interface Personas {
  /**
   * Registro Federal de Contribuyentes de la persona.
   * @property {string} rfc
   * @description Registro Federal de Contribuyentes de la persona.
   */
  rfc: string;
  /**
   * Clave Única de Registro de Población de la persona.
   * @property {string} curp
   * @description Clave Única de Registro de Población de la persona.
   */
  curp: string;
  /**
   * Nombre de la persona.
   * @property {string} nombre
   * @description Nombre de la persona.
   */
  nombre: string;
  /**
   *  Primer apellido de la persona.
   * @property {string} apellido_paterno
   * @description Primer apellido de la persona.
   */
  apellido_paterno: string;
  /**
   * Segundo apellido de la persona.
   * @property {string} apellido_materno
   * @description Segundo apellido de la persona.
   */
  apellido_materno: string;
  /**
   * Dirección de correo electrónico de la persona.
   * @property {string} correo_electronico
   * @description Dirección de correo electrónico de la persona.
   */
  correo_electronico: string;
}

/**
 * @interface Solicitar
 * @description
 * Representa la estructura de datos para solicitar información en el trámite 319.
 * Cada objeto de esta interfaz define la información de una solicitud.
 * @property {number} [id] - Identificador único opcional de la solicitud.
 * @property {string} periodo - Periodo de tiempo asociado a la solicitud.
 * @property {string} fechas_periodo - Fechas relacionadas con el periodo de la solicitud.
 */
export interface Solicitar {
  /**
   * Identificador único de la solicitud.
   * @property {number} [id]
   * @description Identificador único de la solicitud.
   */
  id_solicitud: number | null;

  /**
   * Identificador del periodo.
   * @property {number} id_periodo
   * @description Identificador del periodo.
   */
  id_periodo_solicitud: number | null;
  /**
   * Periodo de tiempo para la solicitud.
   * @property {string} periodo
   * @description Periodo de tiempo para la solicitud.
   */
  periodo: string;
  /**
   *  Fechas relacionadas con el periodo de la solicitud.
   * @property {string} fechas_periodo
   * @description Fechas relacionadas con el periodo de la solicitud.
   */
  fechas_periodo: string;

  /**
   * Fecha de inicio del periodo.
   * @property {string} periodo_inicio
   * @description Fecha de inicio del periodo.
   */
  periodo_inicio: string;
  /**
   * Fecha de fin del periodo.
   * @property {string} periodo_fin
   * @description Fecha de fin del periodo.
   */
  periodo_fin: string;

  /**
   * Descripción del periodo.
   * @property {string} periodo_desc
   * @description Descripción del periodo.
   */
  periodo_desc: string;
}
