/**
 * Interfaz que define la estructura de información de asociados o socios comerciales
 * Contiene los datos principales para el seguimiento y gestión de trámites asociados
 * @interface Asociados
 */
export interface Asociados {
    /** Identificador único numérico del asociado en el sistema */
    id: number;
    /** Número de folio único que identifica el trámite o proceso asociado */
    folioTramite: string;
    /** Tipo o categoría del trámite que está siendo procesado */
    tipoTramite: string;
    /** Estado actual del trámite (activo, pendiente, completado, cancelado, etc.) */
    estatus: string;
    /** Fecha de alta o registro inicial del asociado en formato string */
    fechaAltaDeRegistro: string;
}