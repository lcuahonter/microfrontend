/**
 * Representa un documento que se cargará en el sistema.
 * 
 * @interface DocumentosParaCargar
 * 
 * @property {string} name - Nombre del documento.
 * @property {number} id - Identificador único del documento.
 * @property {File} [archivo] - Archivo asociado al documento (opcional).
 * @property {string} ruta - Ruta donde se almacenará el documento.
 * @property {boolean} cargado - Indica si el documento ha sido cargado exitosamente.
 * @property {string} tipo - Tipo o categoría del documento.
 * @property {string} mensaje - Mensaje relacionado con el estado del documento.
 * @property {string} estatus - Estado actual del documento (por ejemplo, "pendiente", "completado").
 */
export interface DocumentosParaCargar {
  name: string;
  id: number;
  archivo?: File;
  ruta: string;
  cargado: boolean;
  tipo: string;
  mensaje: string;
  estatus: string;
  tamanioMaximo?: number;
}

export interface CatalogoDocumentosResponse {
  codigo: string;
  mensaje: string;
  datos: DocumentosLista;
}

export interface DocumentosLista {
  documento_tramite: Documento[];
  documento_fraccion: Documento[];
  documento_fraccion_esquema: Documento[];
  documento_mecanismo: Documento[];
  documento_programa: Documento[];
  documento_certificacion: string;
}
export interface Documento {
  tipo_documento: TipoDocumentos;
  especifico: boolean;
  id_documento_solicitud?: number;
  tipo_tramite?: TipoTramite;
  ide_clasificacion_documento?: string;
  ide_tipo_solicitante_rfe?: string;
  fecha_ini_vigencia?: string;
  fecha_fin_vigencia?: string;
  activo?: boolean;
  solo_anexar?: boolean;
  ide_regla_anexado?: string;
}

export interface TipoDocumentos {
  id_tipo_documento: number;
  tipo_documento: string;
  fecha_captura?: string;
  fecha_fin_vigencia?: string;
  fecha_ini_vigencia?: string;
  activo?: boolean;
  ide_rango_resolucion_imagen: string;
  tamanio_maximo: number;
  adicionales?: TipoDocumentos[];
  cargado?: boolean;
  file?: DocumentosParaCargar;
  error?: string[];
}

export interface TipoTramite {
  id_tipo_tramite: number;
  cve_servicio: string;
  desc_servicio: string;
  cve_subservicio: string;
  desc_subservicio: string;
  cve_modalidad: string;
  desc_modalidad: string;
  cve_flujo: string;
  desc_flujo: string;
  nivel_servicio: number;
  dependencia: Dependencia;
  nom_serv_axway: string;
  nom_mensaje_axway: string;
  url_axway: string;
  fecha_captura: string;
  fecha_fin_vigencia: string;
  nombre: string;
  replica_info: boolean;
  unidad_administrativa: UnidadAdministrativa;
  automatico: boolean;
  fecha_ini_vigencia: string;
  activo: boolean;
  asignacion: boolean;
  cve_modulo: string;
}

export interface Dependencia {
  id_dependencia: number;
  nombre: string;
  acronimo: string;
  fecha_captura: string;
  fecha_fin_vigencia: string;
  tramites_vu: boolean;
  fecha_ini_vigencia: string;
  activo: boolean;
}

export interface UnidadAdministrativa {
  cve_unidad_administrativa: string;
  ide_tipo_unidad_administrativa: string;
  cve_unidad_administrativa_r: string;
  nivel: number;
  acronimo: string;
  nombre: string;
  descripcion: string;
  entidad: Entidad;
  dependencia: Dependencia;
  fronteriza: boolean;
  fec_inicio_vigencia: string;
  fec_fin_vigencia: string;
  activo: boolean;
}

export interface Entidad {
  codEntidadIdc: string;
  nombre: string;
  cve_entidad: string;
  fecha_captura: string;
  fecha_ini_vigencia: string;
  fecha_fin_vigencia: string;
  activo: boolean;
}

export interface ParametrosGetDocumentos {
  especifico: boolean;
}

/**
 * Payload para consultar documentos asociados a una solicitud de prellenado.
 * 
 * @interface PayloadConsultaDocumentosSolicitud
 * 
 * @property {number} id_solicitud_prellenado - Identificador único de la solicitud de prellenado
 * @property {number} id_tipo_tramite - Identificador del tipo de trámite asociado
 * @property {number} esquema - Número de esquema aplicable a la consulta
 * @property {string} rfc_solicitante - RFC (Registro Federal de Contribuyentes) del solicitante
 * @property {string} rol_actual - Rol actual del usuario en el sistema
 * @property {Object} documento_certificacion - Información sobre el documento de certificación
 * @property {boolean} documento_certificacion.nacional - Indica si la certificación es de tipo nacional
 * @property {boolean} documento_certificacion.persona_moral - Indica si el solicitante es persona moral
 * @property {number} documento_certificacion.id_norma_aplicable - Identificador de la norma aplicable
 * @property {boolean} documento_certificacion.organismo_certificador - Indica si es organismo certificador
 * @property {string} documento_certificacion.tipo_certificacion - Tipo de certificación solicitada
 */
export interface PayloadConsultaDocumentosSolicitud {

  id_solicitud_prellenado: number,
  id_tipo_tramite: number,
  esquema: number,
  rfc_solicitante: string,
  rol_actual: string,
  documento_certificacion: {
    nacional: true,
    persona_moral: true,
    id_norma_aplicable: number,
    organismo_certificador: true,
    tipo_certificacion: string
  }

}

/**
 * Representa la respuesta al recuperar documentos asociados a una solicitud.
 * 
 * @interface RespuestaRecuperaDocumentos
 * 
 * @property {number} id_documento_solicitud - Identificador único del documento en la solicitud
 * @property {Object} documento - Información detallada del documento
 * @property {string} documento.fecha_fin_vigencia - Fecha de finalización de vigencia del documento
 * @property {string} documento.fecha_ini_vigencia - Fecha de inicio de vigencia del documento
 * @property {string} documento.nombre - Nombre del documento
 * @property {string} documento.tipo_documento - Tipo o categoría del documento
 * @property {string} ide_est_documento_sol - Identificador del estado del documento en la solicitud
 * @property {string} estado_documento_solicitud - Descripción del estado actual del documento en la solicitud
 * @property {string} fecha_asociacion - Fecha en que el documento fue asociado a la solicitud
 * @property {string} documento_uuid - Identificador único universal del documento
 */
export interface RespuestaRecuperaDocumentos {
  id_documento_solicitud: number;
  documento: {
    fecha_fin_vigencia: string;
    fecha_ini_vigencia: string;
    nombre: string;
    tipo_documento: string;
  };
  ide_est_documento_sol: string;
  estado_documento_solicitud: string;
  fecha_asociacion: string;
  documento_uuid: string;
}