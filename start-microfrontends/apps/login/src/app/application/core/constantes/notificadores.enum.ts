import { ConsultaRegistro } from "../models/consulta-registro.model";

/**
 * Configuración de los encabezados para la tabla de notificadores.
 * Cada objeto define el nombre del encabezado, la clave para extraer el valor del modelo
 * y el orden en el que debe aparecer en la tabla.
 */
export const CONFIGURACION_ENCABEZADO_NOTIFICADORES = [
    { encabezado: 'RFC', clave: (item: ConsultaRegistro) => item.rfc, orden: 1 },
    { encabezado: 'CURP', clave: (item: ConsultaRegistro) => item.curp, orden: 2 },
    { encabezado: 'FNOMBRE', clave: (item: ConsultaRegistro) => item.nombre, orden: 3 },
    { encabezado: 'APELLIDO PATERNO', clave: (item: ConsultaRegistro) => item.apellidoPaterno, orden: 4 },
    { encabezado: 'APELLIDO MATERNO', clave: (item: ConsultaRegistro) => item.apellidoMaterno, orden: 5 }
]