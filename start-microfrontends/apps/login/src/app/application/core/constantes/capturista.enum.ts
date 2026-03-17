import { Capturista } from "../models/capturista.model";

/**
 * Configuración de los encabezados para la tabla de capturistas.
 * Cada objeto define el nombre del encabezado, la clave para extraer el valor del modelo Capturista,
 * y el orden en el que se mostrarán las columnas en la tabla.
 */
export const CONFIGURACION_ENCABEZADO_CAPTURISTAS = [
    { encabezado: 'RFC', clave: (item: Capturista) => item.rfc, orden: 1 },
    { encabezado: 'CURP', clave: (item: Capturista) => item.curp, orden: 2 },
    { encabezado: 'FNOMBRE', clave: (item: Capturista) => item.nombre, orden: 3 },
    { encabezado: 'APELLIDO PATERNO', clave: (item: Capturista) => item.apellidoPaterno, orden: 4 },
    { encabezado: 'APELLIDO MATERNO', clave: (item: Capturista) => item.apellidoMaterno, orden: 5 }
]