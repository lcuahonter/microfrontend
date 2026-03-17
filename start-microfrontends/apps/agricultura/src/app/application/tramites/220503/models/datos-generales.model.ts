/**
 * Interfaz que representa los datos de la solicitud.
 */
export interface DatosDelaSolicitud {
  /** Aduana de ingreso seleccionada para la solicitud. */
  aduanaIngreso: string;

  /** Oficina de inspección asignada para la solicitud. */
  oficinaInspeccion: string;

  /** Punto de inspección donde se llevará a cabo la revisión. */
  puntoInspeccion: string;

  /** Clave UCON asociada a la solicitud. */
  claveUCON: string;

  /** Establecimiento TIF relacionado con la solicitud. */
  establecimientoTIF: string;

  /** Régimen bajo el cual se encuentra la solicitud. */
  regimen: string;

  /** Número de folio de la solicitud. */
  foliodel: string;
}

/**
 * Interfaz que representa los datos de la movilización.
 */
export interface Movilizacion {
  /** Coordenadas geográficas del punto de movilización. */
  coordenadas: string;

  /** Nombre del lugar o entidad relacionado con la movilización. */
  nombre: string;

  /** Medio utilizado para la movilización (ejemplo: terrestre, aéreo, marítimo). */
  medio: string;

  /** Tipo de transporte utilizado para la movilización. */
  transporte: string;

  /** Punto específico donde se realiza la movilización. */
  punto: string;
}
/**
 * Interfaz que representa una fila de la tabla de requisitos.
 */

export interface FilaSolicitudTabla {
  Partida?: number;
  Tiporequisito: string;
  Requisito: string;
  Certificado: string;
  Fraccion: string;
  Descripcion: string;
  Nico: string;
}
