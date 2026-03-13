import { Notificadores } from "../../models/303/notificadores.model";

/**
 * Definición de las columnas para la tabla de Personas OIR Recibir Notificaciones
 */
export const PERSONAS_OIR_RECIBIR_NOTIFICACIONES = [
    { encabezado: 'RFC', clave: (item: Notificadores): number => item.RFC, orden: 1 },
    { encabezado: 'CURP', clave: (item: Notificadores): string => item.curp, orden: 2 },
    { encabezado: 'Nombre', clave: (item: Notificadores): string => item.nombre, orden: 3 },
    { encabezado: 'Apellido Paterno', clave: (item: Notificadores): string => item.apellidoPaterno, orden: 4 },
    { encabezado: 'Apellido Materno', clave: (item: Notificadores): string => item.apellidoMaterno, orden: 5 }
];
