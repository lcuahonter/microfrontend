/**
 * Configuración de banderas relacionadas con la interfaz de usuario para un trámite.
 */
export interface TramiteConfig {
  /** Bandera para habilitar o deshabilitar las fechas en el dictamen */
  habilitarFechas: boolean;

  /** Indica si los antecedentes son editables (true) o solo lectura (false) */
  isAntecedentes: boolean;

  /** Bandera que activa o desactiva la sección Anexo 222 SE */
  anexo222se: boolean;

  /** Boton de descargar solicitud */
  descargaSolicitud?: boolean;
}