/**
 * @const PROCEDIMIENTOS_NUMERO_ES_DE_PERMISO_DECLARACIONES
 * @description
 * Lista de identificadores de procedimientos cuyo número corresponde a una declaración de permiso.
 * Se utiliza para validar o filtrar procedimientos que requieren un número de permiso en las declaraciones.
 */
export const PROCEDIMIENTOS_NUMERO_ES_DE_PERMISO_DECLARACIONES = [130203];


/**
 * @const PROCEDIMIENTOS_AYUDA_DECLARACIONES
 * @description
 * Lista de identificadores de procedimientos que requieren ayuda en las declaraciones.
 * Se utiliza para mostrar información adicional o asistencia en el proceso de declaración.
 */
export const PROCEDIMIENTOS_AYUDA_DECLARACIONES = [130203,130111, 130105, 130107, 130116, 130109];

/**
 * @const AYUDA
 * @description
 * Constante que contiene el título y mensaje de ayuda para vehículos usados adaptados para personas físicas.
 */
export const AYUDA = {
    /**
     * Título del mensaje de ayuda.
     */
    TITULO: 'Mensaje de ayuda',
    /**
     * Mensaje de ayuda detallado.
     */
    MENSAJE: 'Para vehículos usados adaptados para personas físicas se deberá especificar como mínimo: marca, año modelo, modelo, numero de serie y especificaciones técnicas del vehículo así como las características técnicas y/o descripción del equipo(s) aditamento(s) o dispositivo(s) integrado(s) al vehículo.'
};

/**
 * @const AYUDA_POR_PROCEDIMIENTO
 * @description
 * Objeto que contiene mensajes de ayuda específicos por procedimiento.
 * Cada procedimiento puede tener su propio título y mensaje personalizado.
 */
export const AYUDA_POR_PROCEDIMIENTO: { [key: number]: { TITULO: string; MENSAJE: string } } = {
    130107: {
        TITULO: 'Mensaje de ayuda',
        MENSAJE: 'Para vehículos usados adaptados para personas físicas se deberá especificar como mínimo: marca, año modelo, modelo, numero de serie y especificaciones técnicas del vehículo así como las características técnicas y/o descripción del equipo(s) aditamento(s) o dispositivo(s) integrado(s) al vehículo.'
    },
    130116: {
        TITULO: 'Mensaje de ayuda',
        MENSAJE: 'Para Ambulancia para reconstrucción y reacondicionamiento se deberá especificar como mínimo: marca, año modelo, modelo, numero de serie y especificaciones técnicas del vehículo así como las características técnicas y/o descripción del equipo(s) aditamento(s) o dispositivo(s) integrado(s) al vehículo. Señalar a qué nivel de equipamiento corresponde (1, 2, 3, o 4)'
    },
};