import { ListaOpiniones } from "../models/lista-opiniones.model";

/**
 * Configuración de encabezado de opinión
 */
export const CONFIGURACION_ENCABEZADO_OPINIONES = [
    { encabezado: 'Dependencia', clave: (item: ListaOpiniones) => item.dependencia, orden: 1 },
    { encabezado: 'Justificación', clave: (item: ListaOpiniones) => item.Justificación, orden: 2 },
    { encabezado: 'Estado del requerimiento', clave: (item: ListaOpiniones) => item.estadoRequerimento, orden: 3 }
]