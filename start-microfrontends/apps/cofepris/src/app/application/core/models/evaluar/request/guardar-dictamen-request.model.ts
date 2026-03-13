/**
 * Interfaz para el modelo de solicitud de guardar dictamen.
 * Contiene los campos necesarios para enviar la solicitud de dictamen.
 */
export interface GuardarDictamenRequest {
     /** ID de la acción a realizar */
    id_accion: string;
    /** Clave del usuario */
    cve_usuario: string;
    /** ID del sentido del dictamen */
    ide_sentido_dictamen: string |null;
    /** Justificación del dictamen */
    justificacion_dictamen: string | null;
    /** Fecha de inicio de vigencia autorizada */
    fecha_inicio_vigencia: string|null;
    /** Fecha de fin de vigencia autorizada */
    fecha_fin_vigencia: string | null;
    /** Texto del dictamen */
    texto_dictamen: string|number | null;
    /** Criterios de dictaminación */
    criterios_dictaminacion?: string;
    /** Id solicitud en algunos tramites */
    id_solicitud?: number;
    /** Lista de criterios asociados a tratados */
    criterios_tratados?: CriterioTratado[];
    /** Indica si el dictaminador califica como exportador */
    calificacion_dictaminador_exportador?: boolean | null;
    /** Indica si el dictaminador califica como exportador JPN */
    calificacion_dictaminador_exportador_jpn?: boolean | null;
    /** Indica si la descripción ALADI es correcta */
    calificacion_descripcion_aladi?: boolean | null;

    usoAutorizadoDictamen:string | null;
    descripcionUsoAutorizado:string | null;
    idRestriccionTipoTramite:string | null;
    opinion:string | null;
    justificacion?:string | null;
    plazoVigencia:number | null |string;
    fechaFinVigencia?:string | null;
    justificacionNegativa:string | null;
    observacion?:string |string[] | null;
    idMotivoTipoTramite:string | null;
    siglasDictaminador:string | null;
    numeroGenerico1?:string | null;
    // mercancia: MercanciaDictamen[];
    idTramite?: number | string | null;
    folioTramite?: string | null;
    aceptada?: boolean | null;
    descripcion_objetoimportacion?: string| null;
    descripcionDetalladaMercancia?: string| null;
    id_clasificacion_toxicologica_tipo_tramite?: string|number| null;
    id_motivo_tipo_tramite?: string | null;
    descripcionObjetoImportacion?: string| null;
    paisesFacturador?: string[] | null;
    paisesFormula?: string[] | null;
    blnGenerico1?: boolean | null;
    
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
     observaciones?:any[] | null;
    plazo_anios?:string | null;
    plazo_meses?:string | null;
    numero_folio_externo?:string | null;
    descripcion_detallada_mercancia?:string | null;
    fundamentosDictamen?:FundamentosDictamen[];
    cantidadSal?:string | null;
    cantidadBase?:string | null;
    numeroPermisoImportacion?:string | null;
    organismoExpedicionPermiso?:string | null;
    justificacionDictamen?:string | null;
    fechaInicioVigencia?:string| null;
    numeroFolioExterno?:string | null;
    descripcionDetalladaElaboracion?:string | null;
}
export interface MercanciaDictamen {
    idMercancia: number;
    aceptada: boolean | null;
    aceptadaLabel?: string;
}

export interface CriterioTratado {
  /** ID del criterio del tratado */
  id_criterio_tratado?: number;
  /** Indica si la calificación fue aprobada por el dictaminador */
  calificacion_aprobada_dictaminador?: boolean;
  /** ID del tratado o acuerdo relacionado */
  id_tratado_acuerdo?: number;
  /** Clave del tratado o acuerdo */
  cve_tratado_acuerdo?: string;
}
export interface FundamentosDictamen {
  idFundamentoTipoTramite:string | null;
  descripcion:string |null;
}