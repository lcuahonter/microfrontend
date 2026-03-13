import { FundamentosDictamen } from "../evaluar/request/guardar-dictamen-request.model";
import { HistorialObservacione } from "../evaluar/response/evaluar-estado-evaluacion-response.model";

/** IniciarAutorizacionResponse */
export interface IniciarAutorizacionResponse {
    /** ID del dictamen */
    id_dictamen: number;
    /** ID del tipo de dictamen */
    ide_tipo_dictamen: string;
    /** ID del estado del dictamen */
    ide_est_dictamen: string;
    /** Estado del dictamen */
    estado_dictamen: string;
    /** Fecha de creación del dictamen */
    fecha_creacion: string;
    /** Fecha de emisión del dictamen */
    fecha_emision: string;
    /** Fecha de observación del dictamen */
    fecha_observacion: string;
    /** Fecha de autorización del dictamen */
    fecha_autorizacion: string;
    /** Fecha de verificación del dictamen */
    fecha_verificacion: string;
    /** Fecha de cita del dictamen */
    fecha_cita: string;
    /** ID del sentido del dictamen */
    ide_sent_dictamen: string;
    /** Sentido del dictamen */
    sentido_dictamen: string;
    /** Texto del dictamen */
    texto_dictamen: string;
    /** Justificación del dictamen */
    justificacion: string;
    /** Opinión del dictamen */
    opinion: string;
    /** Número de folio del trámite */
    num_folio_tramite: string;
    /** Fecha de inicio de vigencia */
    fecha_inicio_vigencia: string;
    /** Fecha de fin de vigencia */
    fecha_fin_vigencia: string;
    /** Plazo en años */
    plazo_anios: string;
    /** Plazo en meses */
    plazo_meses: string;
    /** Número de folio externo */
    numero_folio_externo: string;
    /** Plazo total */
    plazo: string;
    /** ID del tipo de dictamen */
    id_tipo_dictamen: number;
    /** Número de folio alterno */
    numero_folio_alterno: string;
    /** Indica si aplica la ley aduanera 144a */
    aplica_ley_aduanera_144a: boolean;
    /** Indica si el dictaminador califica como exportador */
    calificacion_dictaminador_exportador?: boolean | null;
    /** Indica si el dictaminador califica como exportador JPN */
    calificacion_dictaminador_exportador_jpn?:boolean | null;
    /** Indica si la descripción ALADI es correcta */
    calificacion_descripcion_aladi?: boolean | null;
    /** Indica si tiene fracción ALADI */
    mostrar_calificacion_ue?:boolean | null;
    /** Indica si el dictaminador califica al exportador JPN */
    mostrar_calificacion_jpn?:boolean | null;
     historial_observaciones: HistorialObservacione[];
    usoAutorizadoDictamen:string | null;
    descripcionUsoAutorizado:string | null;
    idRestriccionTipoTramite:string | null;
    plazoVigencia:number | null;
    fechaFinVigencia:string | null;
    justificacionNegativa:string | null;
    observacion:string | null;
    idMotivoTipoTramites:string[] | [];
    numMuestras:string | null;
    siglasDictaminador:string | null;
    numeroGenerico1:string | null;
    aceptada?:boolean | null;
    ide_sentido_dictamen?:string | null;
    idRestriccionTipoTramites:string[] | [];
    descripcionObjetoimportacion: string | null;
    descripcionDetalladaMercancia?: string | null;
    idClasificacionToxicologicaTipoTramite: string | null;
    blnGenerico1: boolean | null;
    descripcion_objetoimportacion?: string | null;
    descripcion_detallada_mercancia?:string | null;
    id_clasificacion_toxicologica_tipo_tramite?: string | null;
    id_motivo_tipo_tramites?: string[] | [];
    paisesFacturador?: string[] | null;
    paisesFormula?: string[] | null;
    descripcionObjetoImportacion?: string | null;
    fundamentosDictamen?:FundamentosDictamen[];
    cantidadSal?:string | null;
    cantidadBase?:string | null;
    numeroPermisoImportacion?:string | null;
    organismoExpedicionPermiso?:string | null;
    justificacionDictamen?:string | null;
    fechaInicioVigencia?:string| null;
    numeroFolioExterno?:string | null;
    descripcionDetalladaElaboracion?:string | null;
    observaciones?:any[]|null;
    tipoAnalisis?:string | null;
    fundamentoDelDictamen?:string | null;
    descripcionFundamentoDelDictamen?:string | null;
    justificacionDelDictamen?:string | null;
    descripcionJustificacionDelDictamen?:string | null;
    requesitoCumplir?:string | null;
}