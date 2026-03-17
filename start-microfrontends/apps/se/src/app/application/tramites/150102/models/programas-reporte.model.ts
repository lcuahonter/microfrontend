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
  idProgramaCompuesto: string;
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

/**
 * @description Interfaz que representa los datos de los bienes producidos.
 * Contiene información detallada como el bien producido, sector, fracción, unidad de medida,
 * volumen total de producción, mercado nacional y exportaciones.
 */
export interface BienesProducidos {
  /** Nombre del bien producido */
  bienProducido: string;
  /** Sector al que pertenece el bien */
  claveSector: string;
  /** Sector al que pertenece el bien */
  sector: string;
  /** Fracción arancelaria asociada al bien */
  fraccion: string;
  /** Unidad de medida del bien producido */
  unidadMedida: string;
  /** Volumen total de los bienes producidos */
  totalBienesProducidos: string;
  /** Volumen destinado al mercado nacional */
  mercadoNacional: string;
  /** Volumen destinado a exportaciones */
  exportaciones: string;
}

/**
 * Interfaz que representa los datos guardados del formulario 150102.
 */
export interface GuardarDatosFormulario {
  /**
   * Fecha de inicio del programa.
   */
  inicio: string;

  /**
   * Fecha de fin del programa.
   */
  fin: string;

  /**
   * Folio asignado al programa.
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
   * Monto total de ventas registradas.
   */
  ventasTotales: string;

  /**
   * Monto total de exportaciones.
   */
  totalExportaciones: string;

  /**
   * Monto total de importaciones.
   */
  totalImportaciones: string;

  /**
   * Saldo actual del programa.
   */
  saldo: string;

  /**
   * Porcentaje correspondiente a las exportaciones.
   */
  porcentajeExportacion: string;
}

/**
 * Interfaz que representa la respuesta mapeada de los datos del reporte anual.
 */
export interface MapResponseDatos {
      inicio: string,
      fin: string,
      folioPrograma: string,
      modalidad: string,
      tipoPrograma: string,
      estatus: string,
      ventasTotales: number,
      totalExportaciones: number,
      totalImportaciones: number,
      saldo: number,
      porcentajeExportacion: number,
      idProgramaCompuesto: number
}


