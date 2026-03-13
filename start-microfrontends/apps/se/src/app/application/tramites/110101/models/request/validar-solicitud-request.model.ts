/**
 * Modelo de request para el registro de cuestionario de tratados
 */
export interface RegistroCuestionarioRequest {
  /** RFC del solicitante */
  rfc: string | null;

  /** Clave de la entidad */
  clave_entidad: string | null;

  /** Clave de la entidad solicitante */
  clave_entidad_solicitante: string | null;

  /** Clave de la unidad administrativa */
  clave_unidad_admin: string | null;

  /** Lista de tratados agregados */
  tratados_agregados: TratadoAgregado[];

  /** Registro del cuestionario */
  registro_cuestionario: RegistroCuestionario;
}

/**
 * Modelo para tratado agregado
 */
export interface TratadoAgregado {
  /** Tratado o acuerdo */
  tratado_acuerdo: TratadoAcuerdo;

  /** Clave del grupo de criterio */
  cve_grupo_criterio: string;

  /** Clave del país */
  cve_pais: string | null;

  /** ID del bloque */
  id_bloque: number | null;

  /** Clave del bloque */
  cve_bloque: string | null;

  /** Nombre del país o bloque */
  nombre_pais_o_bloque: string | null;
  
  /** Tipo de proceso de mercancía */
  ide_tipo_proceso_mercancia: string | null;

  /** Tipo cumple juego */
  cumple_juego: boolean | null;

  /** Tipo cumple acumulación */
  cumple_acumulacion: boolean | null;
}

/**
 * Modelo para tratado o acuerdo
 */
export interface TratadoAcuerdo {
  /** Clave del tratado o acuerdo */
  cve_tratado_acuerdo: string | null;

  /** ID del tratado o acuerdo */
  id_tratado_acuerdo: number | null;
}

/**
 * Modelo para registro del cuestionario
 */
export interface RegistroCuestionario {
  /** Indica si existe separación contable */
  separacion_contable: boolean;

  /** Indica si solicita exportador autorizado */
  solicita_exportador_autorizado: boolean;

  /** Condición del exportador autorizado */
  ide_condicion_exportador_autorizado: string | null;

  /** Indica si solicita exportador autorizado Japón */
  solicita_exportador_autorizado_jpn: boolean;

  /** Condición del exportador autorizado Japón */
  ide_condicion_exportador_autorizado_jpn: string | null;

  /** Datos de la mercancía */
  mercancia: Mercancia;
}

/**
 * Modelo para datos de la mercancía
 */
export interface Mercancia {
  /** Indica si requiere juegos o surtidos */
  requiere_juegos_o_surtidos: boolean;

  /** Indica si hay acumulación AP */
  acumulacion_ap: boolean;

  /** Tipo de método */
  ide_tipo_metodo: string | null;

  /** Tipo de método para mercancía Uruguay */
  ide_tipo_metodo_mercancia_uruguay: string | null;

  /** Tipo de método para mercancía Panamá */
  ide_tipo_metodo_mercancia_panama: string | null;

  /** Tipo de método para mercancía */
  ide_tipo_metodo_mercancia: string | null;

  /** Tipo de método para mercancía Alianza Pacífico */
  ide_tipo_metodo_mercancia_alianza_p: string | null;

  /** Tipo de proceso de mercancía */
  ide_tipo_proceso_mercancia: string | null;

  /** Nombre comercial */
  nombre_comercial: string | null;

  /** Lista de insumos */
  insumos: Insumo[];

  /** Lista de empaques */
  empaques: Empaque[];

  /** Procesos solicitados */
  procesos_solicitados: ProcesoSolicitado[];

  /** Clave de fracción */
  cve_fraccion: string | null;

  /** ID descripción alterna UE */
  id_descripcion_alterna_ue: number | null;
  /** ID descripción alterna AELC */
  id_descripcion_alterna_aelc: number | null;

  /** ID descripción alterna SGP */
  id_descripcion_alterna_sgp: number | null;

  /** ID descripción alterna ACE */
  id_descripcion_alterna_ace: number | null;

  /** Indica si el peso es requerido */
  peso_es_requerido: boolean | null;

  /** Indica si el volumen es requerido */
  volumen_es_requerido: boolean | null;

  /** Tipo de proceso de mercancía */
  tipo_proceso_mercancia: string | null;

  /** Valor transaccional FOB */
  valor_transaccional_fob: number | null;

  /** Valor de la transacción */
  valor_transaccion: number | null;

  /** Costo neto AP */
  costo_neto_ap: number | null;

  /** Costo neto */
  costo_neto: number | null;

  /** Costo unitario */
  costo_unitario: number | null;

  /** Precio franco fábrica */
  precio_franco_fabrica: number | null;

  /** Nombre en inglés */
  nombre_ingles: string | null;

  /** Descripción del juego */
  descripcion_juego: string | null;

  /** Cumple con reglas de juegos o surtidos */
  cumple_juegos_surtidos: boolean | null;

  /** Cumple juegos surtidos Perú */
  cumple_juegos_surtidos_peru: boolean | null;

  /** Cumple juegos surtidos Alianza Pacífico */
  cumple_juegos_surtidos_alianza_p: boolean | null;

  /** Cumple acumulación */
  cumple_acumulacion: boolean | null;

  /** Materiales intermedios */
  materiales_intermedios: boolean;

  /** Materiales fungibles */
  materiales_fungibles: boolean;

  /** Acumulación */
  acumulacion: boolean;

  /** Materiales intermedios Uruguay */
  materiales_intermedios_uruguay: boolean;

  /** Materiales fungibles Uruguay */
  materiales_fungibles_uruguay: boolean;

  /** Acumulación Uruguay */
  acumulacion_uruguay: boolean;

  /** Materiales intermedios Perú */
  materiales_intermedios_peru: boolean;

  /** Materiales fungibles Perú */
  materiales_fungibles_peru: boolean;

  /** Acumulación Perú */
  acumulacion_peru: boolean;

  /** Clave fracción NALADI */
  cve_fraccion_naladi: string | null;

  /** Clave fracción NALADISA 93 */
  cve_fraccion_naladisa93: string | null;

  /** Clave fracción NALADISA 96 */
  cve_fraccion_naladisa96: string | null;

  /** Clave fracción NALADISA 02 */
  cve_fraccion_naladisa02: string | null;

  /** Peso */
  peso: number | null;

  /** Volumen */
  volumen: number | null;

  /** Decripcion modificada */
  descripcion_alterna_modificada: boolean | null;
}

/**
 * Modelo para insumo
 */
export interface Insumo {
  /** Tipo de insumo */
  ide_tipo_insumo: string | null;

  /** Importe valor */
  importe_valor: number | null;

  /** Peso */
  peso: number | null;

  /** Volumen */
  volumen: number | null;

  /** Nombre del insumo */
  nombre: string | null;

  /** Descripción del proveedor */
  desc_proveedor: string | null;

  /** Descripción del fabricante o productor */
  desc_fabricante_productor: string | null;

  /** Clave fracción */
  cve_fraccion: string | null;

  /** Fracción arancelaria prevalidada */
  fraccion_arancelaria_prevalidada: boolean;

  /** Clave país */
  cve_pais: string | null;

  /** RFC fabricante/productor */
  rfc_fabricante_productor: string | null;

  /** Lista de tratados originarios */
  tratados_originarios: TratadoOriginario[];
}

/**
 * Modelo para empaque
 */
export interface Empaque {
  /** Tipo de insumo */
  ide_tipo_insumo: string | null;

  /** Importe valor */
  importe_valor: number | null;

  /** Peso */
  peso: number | null;

  /** Volumen */
  volumen: number | null;

  /** Nombre del empaque */
  nombre: string | null;

  /** Descripción del proveedor */
  desc_proveedor: string | null;

  /** Descripción del fabricante o productor */
  desc_fabricante_productor: string | null;

  /** Clave fracción */
  cve_fraccion: string | null;

  /** Fracción arancelaria prevalidada */
  fraccion_arancelaria_prevalidada: boolean;

  /** Clave país */
  cve_pais: string | null;

  /** RFC fabricante/productor */
  rfc_fabricante_productor: string | null;

  /** Lista de tratados originarios */
  tratados_originarios: TratadoOriginario[];
}

/**
 * Modelo para tratado originario
 */
export interface TratadoOriginario {
  /** Clave país */
  cve_pais: string | null;

  /** ID bloque */
  id_bloque: number | null;

  /** Clave bloque */
  cve_bloque: string | null;

  /** Clave tratado acuerdo */
  cve_tratado_acuerdo: string | null;
}

/**
 * Modelo para proceso solicitado
 */
export interface ProcesoSolicitado {
  /** ID del proceso CEROR */
  id_proceso_ceror: number | null;

  /** Cumple proceso */
  cumple_proceso: boolean | null;
}
