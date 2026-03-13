export interface DictamenForm {
  /**
   * Cumplimiento del dictamen (1 = cumple, 0 = no cumple, etc.).
   */
  cumplimiento: string;

  /**
   * Mensaje asociado al dictamen, obligatorio, máximo 2000 caracteres.
   */
  mensajeDictamen: string;

  /**
   * Texto editable de antecedentes del dictamen, obligatorio, máximo 2000 caracteres.
   */
  antecedentesEditables: string;

  /**
   * Texto solo lectura de antecedentes del dictamen.
   */
  antecedentesReadonly: string;

  /**
   * Fecha de inicio de vigencia autorizada (opcional).
   */
  fechaInicioVigenciaAutorizada: string;

  /**
   * Fecha de fin de vigencia autorizada (opcional).
   */
  fechaFinVigenciaAutorizada: string;

  /**
   * Cumplimiento de clasificacion UE(1 = cumple, 0 = no cumple, etc.).
   */
  clasificacionUE?: boolean | null;

  /**
   * Cumplimiento de clasificacion  Japon(1 = cumple, 0 = no cumple, etc.).
   */
  clasificacionJpn?: boolean | null;

  /**
   * Cumplimiento de clasificacion Aladi(1 = cumple, 0 = no cumple, etc.).
   */
  clasificacionAladi?: boolean | null;

  usoAutorizadoDictamen: string | null;
  descripcionUsoAutorizado: string | null;
  idRestriccionTipoTramite: string | null;
  opinion: string | null;
  justificacion: string | null;
  plazoVigencia: number | null |string;
  fechaFinVigencia: string | null;
  justificacionNegativa: string | null;
  observacion: string | string[] | null;
  idMotivoTipoTramite: string | null;
  siglasDictaminador: string | null;
  numeroGenerico1: string | null;
  aceptada: boolean | null;
  descripcionObjetoimportacion?: string | null;
  descripcionDetalladaMercancia?: string | null;
  idClasificacionToxicologicaTipoTramite: string | null;
  decripcionObjetoimportacion?: string | null;
  sentidoDictamen?: string;
  blnGenerico1?: boolean | null;
  paisElaboraDatos?: string[] | null;
  paisFabricaDatos?: string[] | null;
  paisElaboraIdDatos?: string[] | null;
  paisFabricaIdDatos?: string[] | null;
  fundamentoDelDictamen?: string | null;
  descripcionFundamentoDelDictamen?: string | null;
  justificacionDelDictamen?: string | null;
  descripcionJustificacionDelDictamen?: string | null;
  requesitoCumplir?: string | null;
  tipoAnalisis?: string | null;
  numeroMuestras?: number | null;
  numMuestras?: string | null;
  negativoDelDictamen?: string | null;
  descripcionNegativoDelDictamen?: string | null;
  fundamentoOficioDelDictamen?: string | null;
  descripcionFundamentoOficioDelDictamen?: string | null;
  observaciones?: any[] | null;
  plazo_anios?: string | null;
  plazo_meses?: string | null;
  numero_folio_externo?: string | null;
  fecha_inicio_vigencia?: string | null;
  siglas_participante_externo?: string | null;

  // ===== FIELDS TO ADD =====
  
  /**
   * Fundamento del dictamen (form control: fundamentoDictamen)
   */
  fundamentoDictamen?: string | null;

  /**
   * Número de permiso (form control: numeroPermiso)
   */
  numeroPermiso?: string | null;

  /**
   * Nombre de la mercancía (form control: nombreMercancia)
   */
  nombreMercancia?: string | null;

  /**
   * Fundamento negativo del dictamen (form control: fundamentoNegativeDictamen)
   */
  fundamentoNegativeDictamen?: string | null;

  /**
   * Descripción del fundamento negativo del dictamen (form control: descripcionfundamentoNegativeDictamen)
   */
  descripcionfundamentoNegativeDictamen?: string | null;

  /**
   * Fundamento del dictamen para parcial (form control: fundamento_del_dictamen)
   */
  fundamento_del_dictamen?: string | null;

  /**
   * Descripción del fundamento del dictamen para parcial (form control: descripcion_fundamento_del_dictamen)
   */
  descripcion_fundamento_del_dictamen?: string | null;

  /**
   * Justificación del dictamen para parcial (form control: justificacion_del_dictamen)
   */
  justificacion_del_dictamen?: string | null;

  /**
   * Fundamento del oficio del dictamen para parcial (form control: fundamento_oficio_del_dictamen)
   */
  fundamento_oficio_del_dictamen?: string | null;

  /**
   * Texto del dictamen (form control: textoDictamen)
   */
  textoDictamen?: string | null;

  /**
   * Fecha de fin de vigencia (form control: fecha_fin_vigencia)
   */
  fecha_fin_vigencia?: string | null;

  cantidadBase?: string | null;

  cantidadSal?:string | null;

  numeroFolioExterno?:string | null;

  numeroPermisoImportacion?:string | null;

  organismoExpedicionPermiso?:string | null;

  fechaInicioVigencia?:string | null;

  justificacionDictamen?:string | null;

  descripcionFundamentoDictamen?:string | null;

  fundamentoOficioDictamen?:string | null;

  descripcionFundamentoOficioDictamen?:string | null;

  fundamentoNegativoDictamen?:string | null;
  
  descripcionFundamentoNegativoDictamen?:string | null;

  descripcionDetalladaElaboracion?:string | null;

  idMotivoTipoTramiteOficio?:string|null;

}