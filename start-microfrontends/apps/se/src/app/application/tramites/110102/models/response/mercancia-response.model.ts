/**
 * Modelo de respuesta de evaluar mercancia
 */
export interface EvaluarMercanciaResponse {
  /** Identificador único de la solicitud */
  id_solicitud: number | null;

  /** Nombre comercial de la mercancía */
  nombre_comercial: string | null;

  /** Nombre en inglés de la mercancía */
  nombre_en_ingles: string | null;

  /** Clave de fracción arancelaria */
  cve_fraccion: string | null;

  /** Nombre técnico o descripción técnica de la mercancía */
  nombre_tecnico: string | null;

  /** Precio franco fábrica (valor neto sin transporte ni seguros) */
  precio_franco_fabrica: number | null;

  /** Valor de transacción declarado */
  valor_transaccion: number | null;

  /** Valor de transacción FOB (si aplica) */
  valor_transaccion_fob: number | null;

  /** Costo neto de la mercancía (si aplica) */
  costo_neto: number | null;

  /** Costo neto aplicado al acuerdo preferencial (si aplica) */
  costo_neto_ap: number | null;

  /** Descripción del juego o conjunto de mercancías (si aplica) */
  descripcion_juego: string | null;

  /** Tipo de exportador (por ejemplo, directo o indirecto) */
  tipo_exportador: string | null;

  /** Calificación de la fracción ALADI */
  calificacion_fraccion_aladi: boolean | null;

  /** Indica si la mercancía tiene fracción ALADI */
  tiene_fraccion_aladi: boolean | null;

  /** Indica si aplica separación contable */
  separacion_contable: boolean | null;

  /** Clave de fracción NALADI (si aplica) */
  cve_fraccion_naladi: string | null;

  /** Descripción de la clasificación NALADI */
  descripcion_naladi: string | null;

  /** Clave de fracción NALADISA 1993 (si aplica) */
  cve_fraccion_naladisa_93: string | null;

  /** Descripción de la clasificación NALADISA 1993 */
  descripcion_naladisa_93: string | null;

  /** Clave de fracción NALADISA 1996 (si aplica) */
  cve_fraccion_naladisa_96: string | null;

  /** Descripción de la clasificación NALADISA 1996 */
  descripcion_naladisa_96: string | null;

  /** Clave de fracción NALADISA 2002 (si aplica) */
  cve_fraccion_naladisa_02: string | null;

  /** Descripción de la clasificación NALADISA 2002 */
  descripcion_naladisa_02: string | null;
}

/**
 * Representa los campos del formulario de evaluación de mercancía
 */
export interface CampoEvaluar {
  label?: string;           
  controlName?: string;   
  placeholder?: string;     
  col?: number;           
  section?: string;     
  sectionKey?: string;    
  type?: 'text' | 'radio';
  options?: { label: string; value: boolean }[];
}

