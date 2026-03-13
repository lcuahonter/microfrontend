/**
 * Configuración de banderas relacionadas con servicios para un trámite.
 */
export interface ServiceConfig {
  /** Bandera para habilitar o deshabilitar la consulta de criterios */
  serviceCriterios: boolean;
}

export interface ModeloConfig {
  /** Bandera para actualizar modelos */
  actualizarModelo: boolean;

  /** Bandera para actualizar vistas */
  actualizarVista: boolean;
}