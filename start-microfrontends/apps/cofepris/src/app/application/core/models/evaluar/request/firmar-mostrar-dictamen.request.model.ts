import { FundamentosDictamen } from "./guardar-dictamen-request.model";

/** MostrarFirmarRequest */
export interface MostrarFirmarRequest {
    /** ID de la acción a realizar */
    id_accion: string;
    /** Clave del usuario */
    cve_usuario: string;
    /** ID del sentido del dictamen */
    ide_sentido_dictamen: string;
    /** Justificación del dictamen */
    justificacion_dictamen: string | null;
    /** Fecha de inicio de vigencia autorizada */
    fecha_inicio_vigencia: string |null;
    /** Fecha de fin de vigencia autorizada */
    fecha_fin_vigencia: string | null;
    /** Texto del dictamen */
    texto_dictamen: string;
    /** Criterios de dictaminación */
    criterios_dictaminacion?: string;
    /** Id solicitud en algunos tramites */
    id_solicitud?: number;
    /** Indica si el dictaminador califica como exportador */
    calificacion_dictaminador_exportador?: boolean | null;
    /** Indica si el dictaminador califica como exportador JPN */
    calificacion_dictaminador_exportador_jpn?: boolean | null;
    /** Indica si la descripción ALADI es correcta */
    calificacion_descripcion_aladi?: boolean | null;
    /** Datos del solicitante */
    solicitante: Solicitante;
    /** Lista de criterios asociados a tratados */
    criterios_tratados?: CriterioTratado[];

    usoAutorizadoDictamen:string | null;
    descripcionUsoAutorizado:string | null;
    idRestriccionTipoTramite:string | null;
    opinion:string | null;
    justificacion?:string | null;
    plazoVigencia:number | null |string;
    fechaFinVigencia?:string | null;
    justificacionNegativa:string | null;
    observacion:string|string [] | null; 
    idMotivoTipoTramite:string | null;
    siglasDictaminador:string | null;
    numeroGenerico1:string | null;
    aceptada?: boolean | null;
    id_motivo_tipo_tramite?: string | null;
    descripcion_objetoimportacion?: string| null;
    descripcionDetalladaMercancia?: string| null;
    id_clasificacion_toxicologica_tipo_tramite?: string|number| null;
    // mercancia: MercanciaDictamen[];
    idTramite?: number | string | null;
    folioTramite?: string | null;
    paisesFacturador?: string[] | null;
    paisesFormula?: string[] | null;
    blnGenerico1?: boolean | null;
    restriccionesDictamen?: string | null;

    fundamentoDelDictamen?: string | null;
    descripcionFundamentoDelDictamen?: string | null;
    justificacionDelDictamen?: string | null;
    descripcionJustificacionDelDictamen?: string | null;
    requesitoCumplir?: string | null;
    tipoAnalisis: string | null;
    numeroMuestras: number | null;
    numMuestras?: string | null;
    negativoDelDictamen?: string | null;
    descripcionNegativoDelDictamen?: string | null;
    fundamentoOficioDelDictamen?: string | null;
    descripcionFundamentoOficioDelDictamen?: string | null;
     descripcionObjetoImportacion?: string | null;
      observaciones?:any|null;
      cantidadSal?:string|null;
      cantidadBase?:string|null;
      numeroPermisoImportacion?:string|null;
      fechaInicioVigencia?:string|null;
      organismoExpedicionPermiso?:string|null;
      justificacionDictamen?:string|null;
      fundamentosDictamen?:FundamentosDictamen[] | null;
      numeroFolioExterno?:string|null;
     descripcionDetalladaElaboracion?: string|null;

}

/** Solicitante */
export interface Solicitante {
    /** RFC del solicitante */
    rfc: string;
    /** Nombre del solicitante */
    nombre: string;
    /** Apellido paterno del solicitante */
    apellido_paterno: string;
    /** Apellido materno del solicitante */
    apellido_materno: string;
}

export interface CriterioTratado {
  /** ID del criterio del tratado */
  id_criterio_tratado?: number;
  /** Indica si la calificación fue aprobada por el dictaminador */
  calificacion_aprobada_dictaminador?: boolean;
  /** ID del tratado o acuerdo relacionado */
  id_tratado_acuerdo?: number;
}
