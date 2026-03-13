import { Transportista } from "@libs/shared/data-access-user/src";

/**
 * Definición de las columnas para la tabla de Transportistas
 */
export const CONFIGURACION_ENCABEZADO_TRASPORTISTA = [
    { encabezado: 'Trasportista', clave: (item: Transportista):string => item.nacionalidad, orden: 1 },
    { encabezado: 'Denominación o Razón Social', clave: (item: Transportista):string => item.denominacionRazonSocial, orden: 2 },
    { encabezado: 'R.F.C.', clave: (item: Transportista):string => item.rfc, orden: 3 },
    { encabezado: 'Nombre(s)', clave: (item: Transportista):string => item.nombre, orden: 4 },
    { encabezado: 'Primer Apellido', clave: (item: Transportista):string => item.apellidoPaterno, orden: 5 },
    { encabezado: 'Segundo Apellido', clave: (item: Transportista):string => item.apellidoMaterno, orden: 6 },
    { encabezado: 'Tax ID', clave: (item: Transportista):string => item.taxId, orden: 7 }
];
