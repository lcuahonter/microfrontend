/**
 * ============================
 * Interfaz para el encabezado de la Tabla de Resolución
 * Se utiliza para mostrar la Tabla de Resolución en el componente Resolución de la Consulta Generica.
 * ============================
 */
export interface HeaderTablaResolucion {
  key: keyof BodyTablaResolucion;
  valor: string;
}
/**
 * ============================
 * Interfaz para el cuerpo de la Tabla de Resolución
 * Se utiliza para mostrar la Tabla de Resolución en el componente Resolución de la Consulta Generica.
 * ============================
 */
export interface BodyTablaResolucion {
  id: number;
  idDocumento: string;
  documento: string;
  urlPdf: string;
  fullBase64?: string;
}

/**
 * ============================
 * Interfaz para el encabezado de la Tabla de Acuses
 * Se utiliza para mostrar la Tabla de Acuses en el componente Acuses de la Consulta Generica.
 * ============================
 */
export interface HeaderTablaAcuses {
  key: keyof BodyTablaAcuses;
  valor: string;
}
/**
* ============================
* Interfaz para el cuerpo de la Tabla de Acuses
* Se utiliza para mostrar la Tabla de Acuses en el componente Acuses de la Consulta Generica.
* ============================
*/
export interface BodyTablaAcuses {
  id: number;
  idDocumento: string;
  documento: string;
  urlPdf: string;
}

/**
 * ============================
 * Interfaz para el encabezado de la Tabla de Requerimientos
 * Se utiliza para mostrar la Tabla de Requerimientos en el componente Requerimientos de la Consulta Generica.
 * ============================
 */
export interface HeaderTablaRequerimientos {
  key: keyof BodyTablaRequerimiento;
  valor: string;
}
/**
* ============================
* Interfaz para el cuerpo de la Tabla de Requerimientos
* Se utiliza para mostrar la Tabla de Requerimientos en el componente Requerimientos de la Consulta Generica.
* ============================
*/
export interface BodyTablaRequerimiento {
  id: number;
  fechaCreacion: string;
  fechaGeneracion: string;
  fechaAtencion: string;
  estatus: string;
  urlPdf: string;
}

/**
 * ============================
 * Interfaz para el encabezado de la Tabla de Tareas de Trámite
 * Se utiliza para mostrar la Tabla de Tareas de Trámite en el componente Tareas de Trámite de la Consulta Generica.
 * ============================
 */
export interface HeaderTablaTareasTramite {
  key: keyof BodyTablaTareasTramite;
  valor: string;
}
/**
 * ============================
 * Interfaz para el cuerpo de la Tabla de Tareas de Trámite
 * Se utiliza para mostrar la Tabla de Tareas de Trámite en el componente Tareas de Trámite de la Consulta Generica.
 * ============================
 */
export interface BodyTablaTareasTramite {
  id: number;
  nombreTarea: string;
  nombreUsuarioAsignado: string;
  claveUsuarioAsignado: string;
  fechaAsignacion: string;
  fechaAtencion: string | null;
}
/**
 * ============================
 * Interfaz para el encabezado de la Tabla de Tareas de Trámite al atender requerimiento
 * Se utiliza para mostrar la Tabla de Tareas de Trámite en el componente Tareas de Trámite de la Consulta Generica cuando se atiende un requerimiento.
 * ============================
 */
export interface HeaderTablaTareasTramiteByAtenderReq {
  key: keyof BodyTablaTareasTramiteByAtenderReq;
  valor: string;
}

/**
 * ============================
 * Interfaz para el cuerpo de la Tabla de Tareas de Trámite al atender requerimiento
 * Se utiliza para mostrar la Tabla de Tareas de Trámite en el componente Tareas de Trámite de la Consulta Generica cuando se atiende un requerimiento.
 * ============================
 */
export interface BodyTablaTareasTramiteByAtenderReq {
  id: number;
  nombreTarea: string;
  fechaAsignacion: string;
  fechaAtencion: string | null;
}

/**
 * ============================
 * Interfaz para el encabezado de la Tabla de Dictámenes
 * Se utiliza para mostrar la Tabla de Dictámenes en el componente Dictámenes de la Consulta Generica.
 * ============================
 */
export interface HeaderTablaDictamenes {
  key: keyof BodyTablaDictamenes;
  valor: string;
}
/**
 * ============================
 * Interfaz para el cuerpo de la Tabla de Dictámenes
 * Se utiliza para mostrar la Tabla de Dictámenes en el componente Dictámenes de la Consulta Generica.
 * ============================
 */
export interface BodyTablaDictamenes {
  id: number;
  fechaCreacion: string;
  fechaGeneracion: string;
  fechaAutorizacion: string;
  tipo: string;
  estatus: string;
  sentido: string;
  urlPdf: string;
}

/**
 * ============================
 * Interfaz para el encabezado de la Tabla de Documentos
 * Se utiliza para mostrar la Tabla de Documentos en el componente Documentos de la Consulta Generica.
 * ============================
 */
export interface HeaderTablaDocumentos {
  key: keyof BodyTablaDocumentos;
  valor: string;
}
/**
 * ============================
 * Interfaz para el cuerpo de la Tabla de Documentos
 * Se utiliza para mostrar la Tabla de Documentos en el componente Documentos de la Consulta Generica.
 * ============================
 */
export interface BodyTablaDocumentos {
  tipoDocumento: string;
  estatus: string;
  fechaAdjunto: string;
  nombreArchivo: string;
  urlPdf: string | null;
}

/**
 * ============================
 * Interfaz para el encabezado de la Tabla de Envio Digital
 * Se utiliza para mostrar la Tabla de Envio Digital en el componente Envio Digital.
 * ============================
 */
export interface HeaderTablaEnvioDigital {
  key: keyof BodyTablaEnvioDigital;
  valor: string;
}
/**
 * ============================
 * Interfaz para el cuerpo de la Tabla de Envio Digital
 * Se utiliza para mostrar la Tabla de Envio Digital en el componente Envio Digital.
 * ============================
 */
export interface BodyTablaEnvioDigital {
  id: number;
  fecha: string;
  transaccion: string;
  estado: string;
  observaciones: string;
}

/*
* Interfaz para el encabezado de la Tabla de opiniones (primera pestaña de la bandeja de opiniones)
* Se utiliza para mostrar la tabla de opiniones del componente opinion.  
*/
export interface HeaderTablaOpiniones {
  key: keyof BodyTablaOpiniones;
  valor: string;
}
/*
* Interfaz para el cuerpo de la Tabla de opiniones (primera pestaña de la bandeja de opiniones)
* Se utiliza para mostrar la tabla de opiniones del componente opinion.  
*/
export interface BodyTablaOpiniones {
  id: number;
  fechaSolicitud: string;
  areaSolicitante: string;
  areaResponsable: string;
  estatus: string;
  urlPdf?: string;
}

/*
* Interfaz para el cuerpo de la Tabla de observaciones dictamen
* Se utiliza para mostrar tabla observaciones del componente dictamen.  
*/
export interface BodyTablaDictamenObservaciones {
  id: number;
  fechaObservacion: string;
  fechaAtencion: string;
  generadaPor: string;
  estatusObservacion: string;
  urlPdf?: string;
}

/**
 * ============================
 * Interfaz para el encabezado de la tabla de las secciones de dictamen (pestaña de detalles de la bandeja de opiniones)
 * Se utiliza una tabla en la segunda seccion de la pestaña detalles de dictamen.
 * ============================
 */
export interface HeaderTablaDictamenObservacion {
  key: keyof BodyTablaDictamenObservaciones;
  valor: string;
}

/**
 * ============================
 * Interfaz para el encabezado de la tabla de las secciones de opiniones (pestaña de detalles de la bandeja de opiniones)
 * Se utiliza una tabla en la tercera seccion de la pestaña detalles de Opiniones.
 * ============================
 */
export interface HeaderTablaOpinion {
  key: keyof BodyTablaOpinion;
  valor: string;
}
/**
 * ============================
 * Interfaz para el cuerpo de la tabla de las secciones de opiniones (pestaña de detalles de la bandeja de opiniones)
 * Se utiliza una tabla en la tercera seccion de la pestaña detalles de Opiniones.
 * ============================
 */
export interface BodyTablaOpinion {
  id: number;
  documento: string;
  descripcion_solicitante?: string;
  nombre_archivo?: string;
  urlPdf: string;
}
/**
 * ============================
 * Interfaces para las secciones de opiniones (pestaña de detalles de la bandeja de opiniones)
 * Se utiliza un formulario en la primera seccion de la pestaña detalles de Opiniones.
 * ============================
 */

export interface SolicitudDetalleOpinion {
  id: number;
  areaSolicitante: string;
  estatus: string;
  fechaCreacion: string;
  fechaSolicitud: string;
  justificacionOpinion: string;
}
/**
 * ============================
 * Interfaces para las secciones de opiniones (pestaña de detalles de la bandeja de opiniones)
 * Se utiliza un formulario en la segunda seccion de la pestaña detalles de Opiniones.
 * ============================
 */
export interface OpinionDetalleOpinion {
  id: number;
  dependencia?: string;
  idDependencia?: number;
  areaResponsable: string;
  sentido: string;
  generadoPor: string;
  fechaGeneracion: string;
  opinion: string;
}