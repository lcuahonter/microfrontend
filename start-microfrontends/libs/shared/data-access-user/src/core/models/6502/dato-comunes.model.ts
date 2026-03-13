/**
 * @interface InstalacionesPrincipalesTablaInfo
 * @description Representa la información de las instalaciones principales en la tabla.
 * @property {string} tipo_persona - Tipo de persona (física o moral).
 * @property {string} nombre - Nombre de la persona o entidad.
 * @property {string} rfc - Registro Federal de Contribuyentes.
 * @property {string} registro_poblacional - Clave Única de Registro de Población (CURP).
 */
export interface InstalacionesPrincipalesTablaInfo {
    tipo_persona: string;
    nombre: string;
    rfc: string;
    registro_poblacional: string;
}

/**
 * @constant {Array} INSTALACIONES_PRINCIPALES_TABLA
 * @description Configuración de la tabla de instalaciones principales, incluyendo encabezados, claves y orden.
 */
export const INSTALACIONES_PRINCIPALES_TABLA = [
    {
        encabezado: 'Tipo persona',
        clave: (ele: InstalacionesPrincipalesTablaInfo): string => ele.tipo_persona,
        orden: 1,
    },
    {
        encabezado: 'Nombre',
        clave: (ele: InstalacionesPrincipalesTablaInfo): string => ele.nombre,
        orden: 2,
    },
    {
        encabezado: 'RFC',
        clave: (ele: InstalacionesPrincipalesTablaInfo): string => ele.rfc,
        orden: 3,
    },
    {
        encabezado: 'Clave única de registro poblacional (CURP)',
        clave: (ele: InstalacionesPrincipalesTablaInfo): string => ele.registro_poblacional,
        orden: 4,
    },
];

/**
 * @interface InstalacionesPrincipalesRespuestaTabla
 * @description Representa la respuesta de la tabla de instalaciones principales.
 * @property {number} code - Código de respuesta.
 * @property {InstalacionesPrincipalesTablaInfo[]} data - Datos de la tabla NICO.
 * @property {string} message - Mensaje de la respuesta.
 */
export interface InstalacionesPrincipalesRespuestaTabla {
    code: number;
    data: InstalacionesPrincipalesTablaInfo[];
    message: string;
}

/**
 * @interface FormaDatosInfo
 * @description Representa la información de los datos de un formulario.
 * @property {string} nombre - Nombre de la persona o entidad.
 * @property {string} registroFederal - Registro Federal de Contribuyentes.
 * @property {string} curp - Clave Única de Registro de Población (CURP).
 */
export interface FormaDatosInfo {
    nombre: string;
    registroFederal: string;
    curp: string;
}

/**
 * @interface FormaRespuestaDatos
 * @description Representa la respuesta de los datos de un formulario.
 * @property {number} code - Código de respuesta.
 * @property {formaDatosInfo[]} data - Datos de la tabla NICO.
 * @property {string} message - Mensaje de la respuesta.
 */
export interface FormaRespuestaDatos {
    code: number;
    data: FormaDatosInfo[];
    message: string;
}