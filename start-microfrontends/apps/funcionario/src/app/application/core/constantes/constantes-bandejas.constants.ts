import { ListaPendientes } from "../models/pendientes.model"
import { ListaSolicitudes } from "../models/solicitudes.model"
/**
 * Configuración de encabezados para la tabla de solicitudes.
 * Cada objeto define el encabezado, la clave para obtener el valor correspondiente
 * de un elemento de tipo `ListaSolicitudes` y el orden en que se muestra.
 */
export const CONFIGURACION_ENCABEZADO_SOLICITUDES = [
    { encabezado: 'Id solicitud', clave: (item: ListaSolicitudes) => item.idSolicitud, orden: 1 },
    { encabezado: 'Tipo de trámite', clave: (item: ListaSolicitudes) => item.tipoTramite, orden: 2 },
    { encabezado: 'Fecha de asignación', clave: (item: ListaSolicitudes) => item.fechaCreacion, orden: 3 },
    { encabezado: 'Fecha de actualización', clave: (item: ListaSolicitudes) => item.fechaActualizacion, orden: 4 },
    { encabezado: 'Dias trascurridos', clave: (item: ListaSolicitudes) => item.diasTrascurridos, orden: 5 }
]
/**
 * Configuración de encabezados para la tabla de pendientes.
 * Cada objeto define el encabezado, la clave para obtener el valor correspondiente
 * de un elemento de tipo `ListaPendientes` y el orden en que se muestra.
 */
export const CONFIGURACION_ENCABEZADO_PENDIENTES = [
    { encabezado: 'Folio tramite', clave: (item: ListaPendientes) => item.folio, orden: 1 },
    { encabezado: 'Tipo de trámite', clave: (item: ListaPendientes) => item.tipoTramite, orden: 2 },
    { encabezado: 'Nombre de la tarea', clave: (item: ListaPendientes) => item.nombreTarea, orden: 3 },
    { encabezado: 'Fecha de asignación', clave: (item: ListaPendientes) => item.fechaAsignacion, orden: 4 },
    { encabezado: 'Estado de tramite', clave: (item: ListaPendientes) => item.estatusTramite, orden: 5 }
]