export interface BandejaDeTareasPendientes {
    folioTramite: string;
    tipoDeTramite: string;
    nombreDeLaTarea: string;
    fechaDeAsignacion: string;
    estadoDeTramite: string;
    departamento: string;
    numeroDeProcedimiento: string;
    origin: string;
    fechaInicioTramite: string;
    diasHabilesTranscurridos: string;
    action_id?: string;
    current_user?: string;
    id_solicitud?: string;
    nombre_pagina?: string;
    informacion_adicional?: string;
    requerimiento?: string;
    observacion?: string;
    opinion?: string;
    tareas_usuario?:string;
    id_tarea?: string;
    rol_actual?: string;
}

export interface SeleccionadoDepartamento {
    tieneDepartamento: boolean;
    nombreDelDepartamento: string;
    numeroDeProcedimiento: string;
}

export interface SeleccionadoTramite {
    id: number;
    tipoDeTramite: string;
    fecha: string;
    fechaActualizacion: string;
    diasTranscurridos: string;
    diasHabilesTranscurridos?: string;
    departamento: string;
    numeroDeProcedimiento: string;
    folioTramite: string;
    nombreDeLaTarea: string;
    fechaDeAsignacion: string;
    estadoDeTramite: string;
    origin: string;
    action_id: string;
    current_user: string;
    id_solicitud: string;
    nombre_pagina: string;
    estado_opinion?: string;
    tareas_usuario?:string;
    id_tarea?: string;
    rol_actual?: string;
}

/**
 * Modelo que representa el cuerpo de la solicitud para la bandeja de tareas pendientes.
 * 
 * @property rfc_usuario - RFC del usuario que realiza la consulta.
 * @property roles - Lista de roles asociados al usuario.
 */
export interface BandejaTareasPendientesBody {
    rfc_usuario: string;
    roles: string[];
}

/**
 * Representa la respuesta de una tabla de datos.
 *
 * @property codigo - Código de respuesta del servicio.
 * @property mensaje - Mensaje descriptivo de la respuesta.
 * @property datos - Arreglo de objetos de tipo RespuestaDatos que contienen la información solicitada.
 */
export interface ResponseTable {
    "codigo": string,
    "mensaje": string,
    "datos": RespuestaDatos []
}

/**
 * Modelo que representa la respuesta de datos para la bandeja de tareas pendientes.
 * Contiene información detallada sobre el trámite, tarea, usuario, grupo, documentos asociados,
 * estados y otros metadatos relevantes para la gestión de tareas en el sistema.
 *
 * @property id - Identificador único del registro.
 * @property nombre - Nombre asociado al registro.
 * @property descripcion - Descripción del registro.
 * @property id_tramite - Identificador del trámite.
 * @property id_proceso - Identificador del proceso.
 * @property id_usuario - Identificador del usuario asignado.
 * @property nombre_usuario - Nombre del usuario asignado.
 * @property id_grupo - Identificador del grupo asignado.
 * @property nombre_grupo - Nombre del grupo asignado.
 * @property id_documento - Identificador del documento relacionado.
 * @property documento - Nombre o referencia del documento.
 * @property criteria_documento - Criterios asociados al documento.
 * @property action_id - Identificador de la acción.
 * @property action_name - Nombre de la acción.
 * @property bpi_id - Identificador del proceso de negocio.
 * @property bp_name - Nombre del proceso de negocio.
 * @property cancel_user - Usuario que canceló la tarea.
 * @property complete_user - Usuario que completó la tarea.
 * @property current_user - Usuario actual responsable de la tarea.
 * @property fecha_inicio_tramite - Fecha de inicio del trámite.
 * @property fecha_inicio_tarea - Fecha de inicio de la tarea.
 * @property fecha_nuevo_inicio_tarea - Fecha de nuevo inicio de la tarea.
 * @property folio_tramite - Folio del trámite.
 * @property estado_tramite - Estado actual del trámite.
 * @property tipo_tramite - Tipo de trámite.
 * @property fecha_fin_tarea - Fecha de finalización de la tarea.
 * @property nombre_pagina - Nombre de la página asociada.
 * @property rfc - RFC del usuario o entidad.
 * @property razon_social - Razón social asociada.
 * @property id_solicitud - Identificador de la solicitud.
 * @property dias_trascurridos - Días transcurridos desde el inicio.
 * @property estado_requerimiento - Estado del requerimiento.
 * @property estado_observacion - Estado de la observación.
 * @property estado_opinion - Estado de la opinión.
 * @property estado_dictamen - Estado del dictamen.
 * @property estado_solicitud - Estado de la solicitud.
 * @property estado_req_informacion - Estado del requerimiento de información.
 * @property descripcion_tipo_tramite - Descripción del tipo de trámite.
 * @property descripcion_estado_tramite - Descripción del estado del trámite.
 * @property ua - Unidad administrativa asociada.
 * @property rol_tarea - Rol asignado a la tarea.
 * @property id_tarea - Identificador de la tarea.
 * @property numero_iteracion - Número de iteración de la tarea.
 * @property generico - Indicador genérico.
 * @property valid_task - Indica si la tarea es válida.
 * @property modalidad - Modalidad del trámite o tarea.
 * @property prioridad - Prioridad de la tarea.
 * @property context - Contexto adicional de la tarea.
 * @property action_sso - Acción SSO asociada.
 * @property informacion_adicional - Información adicional relevante.
 * @property tareas_usuario - Tareas asignadas al usuario.
 */
export interface RespuestaDatos {
    id: string,
    nombre: string,
    descripcion: string,
    id_tramite: string,
    id_proceso: string,
    id_usuario: string,
    nombre_usuario: string,
    id_grupo: string,
    nombre_grupo: string,
    id_documento: string,
    documento: string,
    criteria_documento: string
    action_id: string,
    action_name: string,
    bpi_id: string,
    bp_name: string,
    cancel_user: string,
    complete_user: string,
    current_user: string,
    fecha_inicio_tramite: string,
    fecha_inicio_tarea: string,
    fecha_nuevo_inicio_tarea: string,
    folio_tramite: string,
    estado_tramite: string,
    tipo_tramite: string,
    fecha_fin_tarea: string,
    nombre_pagina: string,
    rfc: string,
    razon_social: string,
    id_solicitud: string,
    dias_trascurridos: string,
    estado_requerimiento: string,
    estado_observacion: string,
    estado_opinion: string,
    estado_dictamen: string,
    estado_solicitud: string,
    estado_req_informacion: string,
    descripcion_tipo_tramite: string,
    descripcion_estado_tramite: string,
    ua: string,
    rol_tarea: string,
    id_tarea: string,
    numero_iteracion: string,
    generico: string,
    valid_task: boolean,
    modalidad: string,
    prioridad: string,
    context: string,
    action_sso: string,
    informacion_adicional: string,
    tareas_usuario: string
}