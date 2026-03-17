/**
 * Representa la estructura de un reporte de programas.
 */
export interface ProgramasReporte {
  /**
   * Folio único del programa.
   */
  folioPrograma: string;

  /**
   * Modalidad del programa.
   */
  modalidad: string;

  /**
   * Tipo de programa.
   */
  tipoPrograma: string;

  /**
   * Estatus actual del programa.
   */
  estatus: string;

  
  /**
   * Rrograma compuesto id.
   */
  idProgramaCompuesto?: number;
}

/**
 * Interfaz que representa las fechas de un reporte anual.
 * 
 * @property {string} reporteAnualFechaInicio - Fecha de inicio del reporte anual.
 * @property {string} reporteAnualFechaFin - Fecha de finalización del reporte anual.
 */
export interface ReporteFechas {
  /**
   * Fecha de inicio del reporte anual.
   */
  reporteAnualFechaInicio: string;

  /**
   * Fecha de finalización del reporte anual.
   */
  reporteAnualFechaFin: string;
}

/**
 * Interfaz que define la estructura de los datos de un reporte anual.
 */
export interface RegistroSolicitudDatos {
  /**
     * Fecha de inicio del reporte anual.
     */
  reporteAnualFechaInicio: '',

  /**
   * Fecha de fin del reporte anual.
   */
  reporteAnualFechaFin: '',

  /**
   * Folio del programa.
   */
  folioPrograma: '',

  /**
   * Modalidad del programa.
   */
  modalidad: '',

  /**
   * Tipo de programa.
   */
  tipoPrograma: '',

  /**
   * Estatus actual.
   */
  estatus: '',

  /**
   * Ventas totales.
   */
  ventasTotales: '',

  /**
   * Total de exportaciones.
   */
  totalExportaciones: 0,

  /**
   * Total de importaciones.
   */
  totalImportaciones: 0,

  /**
   * Saldo actual.
   */
  saldo: 0,

  /**
   * Porcentaje de exportación.
   */
  porcentajeExportacion: 0
}

/**
 * Interfaz que representa los datos de un reporte anual.
 */
export interface MapResponseDatos {
    reporteAnualFechaInicio: string;
    reporteAnualFechaFin: string;
    folioPrograma: string;
    modalidad: string;
    tipoPrograma: string;
    estatus: string;
    ventasTotales: string;
    totalExportaciones: number;
    totalImportaciones: number;
    saldo: number;
    porcentajeExportacion: number;
    idProgramaCompuesto: number;
}
