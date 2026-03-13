import { EnlaceOperativo } from "../../models/303/enlace-operativo.model";

/**
 * Definición de las columnas para la tabla de Enlace Operativo
 */
export const ENLACE_OPERATIVO = [
    { encabezado: 'RFC', clave: (item: EnlaceOperativo): string => item.rfc, orden: 1 },
    { encabezado: 'Nombre', clave: (item: EnlaceOperativo): string => item.nombre, orden: 2 },
    { encabezado: 'Primer apellido', clave: (item: EnlaceOperativo): string => item.apellidoPaterno, orden: 3 },
    { encabezado: 'Segundo apellido', clave: (item: EnlaceOperativo): string => item.apellidoMaterno, orden: 4 },
    { encabezado: 'Ciudad o estado de Recidencia', clave: (item: EnlaceOperativo): string => item.ciudad, orden: 5 },
    { encabezado: 'Cargo o Puesto', clave: (item: EnlaceOperativo): string => item.cargoPuesto, orden: 6 },
    { encabezado: 'Telefono', clave: (item: EnlaceOperativo): string => item.telefono, orden: 7 },
    { encabezado: 'Correo Electronico', clave: (item: EnlaceOperativo): string => item.correoElectronico, orden: 8 },
    { encabezado: 'Suplente', clave: (item: EnlaceOperativo): boolean => item.suplente, orden: 9 }
]