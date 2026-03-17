/**
 * Datos de la solicitud y criterios asociados
 */
export interface DatosCriterioResumenResponse {
  /** Identificador único de la solicitud asociada. */
  id_solicitud: number;

  /** Identificador del criterio tratado correspondiente. */
  id_criterio_tratado: number;

  /** Importe total de insumos originarios. */
  imp_insumos_originarios: number;

  /** Importe total de insumos no originarios. */
  imp_insumos_no_originarios: number;

  /** Importe total de envases originarios. */
  imp_envases_originarios: number;

  /** Importe total de envases no originarios. */
  imp_envases_no_originarios: number;

  /** Importe combinado de insumos y envases originarios. */
  imp_insu_env_originarios: number;

  /** Importe combinado de insumos y envases no originarios. */
  imp_insu_env_no_originarios: number;

  /** Porcentaje de valor correspondiente a los insumos no originarios. */
  pct_valor_no_originarios: number;

  /** Porcentaje de peso total de fibras (puede ser nulo). */
  pct_peso_total_fibras: number | null;

  /** Porcentaje de peso total de la mercancía (puede ser nulo). */
  pct_peso_total_mercancia: number | null;

  /** Indica si la calibración fue aprobada por el dictaminador. */
  cal_aprobada_dictaminador: boolean;

  /** Precio franco fábrica declarado. */
  precio_franco_fabrica: number;

  /** Valor de transacción registrado. */
  valor_transaccion: number;

  /** Valor de transacción FOB (puede ser nulo). */
  valor_transaccion_fob: number | null;

  /** Costo neto total (puede ser nulo). */
  costo_neto: number | null;

  /** Costo neto aproximado o alternativo (puede ser nulo). */
  costo_neto_ap: number | null;

  /** Peso acumulado de la mercancía (puede ser nulo). */
  peso_acumulado: number | null;

  /** Volumen acumulado de la mercancía (puede ser nulo). */
  volumen_acumulado: number | null;

  /** Descripción de la unidad de medida de trabajo (puede ser nulo). */
  descripcion_umt: string | null;

  /** Descripción de la unidad de medida comercial (puede ser nulo). */
  descripcion_umc: string | null;
}
