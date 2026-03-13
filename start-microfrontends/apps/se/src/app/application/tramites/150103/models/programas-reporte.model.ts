/**
 * @description Interfaz que representa los datos de los programas de reporte.
 * Contiene información sobre el folio del programa, modalidad, tipo de programa y estatus.
 */
export interface ProgramasReporte {
  /** Folio del programa */
  folioPrograma: string;
  /** Modalidad del programa */
  modalidad: string;
  /** Tipo de programa */
  tipoPrograma: string;
  /** Estatus actual del programa */
  estatus: string;
}
/**
 * @description Interfaz que define la estructura de un objeto utilizado para representar
 * las fechas asociadas a un reporte. Incluye tanto la fecha de inicio como la fecha de fin.
 *
 * @interface ReporteFechas
 * @property {string} inicio - Fecha de inicio del reporte. Este campo es obligatorio y debe
 * contener la fecha en el formato adecuado (por ejemplo, 'YYYY-MM-DD').
 * @property {string} fin - Fecha de finalización del reporte. Este campo es obligatorio y debe
 * contener la fecha en el formato adecuado (por ejemplo, 'YYYY-MM-DD').
 */
export interface ReporteFechas {
  /** Define la fecha inicial del periodo del reporte. */
  inicio: string;

  /** Define la fecha final del periodo del reporte. */
  fin: string;
}
