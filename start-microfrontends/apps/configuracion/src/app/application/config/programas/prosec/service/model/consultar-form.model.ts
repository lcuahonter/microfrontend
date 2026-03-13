/**
 * Tipo de consulta para el formulario
 */
export type ConsultType = 'sector' | 'fraccion' | 'todos';

/**
 * Datos del formulario de consulta
 */
export interface ConsultaFormData {
  consultType: ConsultType;
  sector: string | null;
  fraccion: string | null;
}

/**
 * Resultado de la búsqueda de configuración
 */
export interface ConsultaResultado {
  id: number;
  sector: string;
  claveSector: string;
  fechaInicio: string;
  fechaFin: string;
  fechaUltimaModificacion?: string;
  activo: boolean;
  fraccion: string;
  detalles?: {
    descripcion?: string;
  };
}
