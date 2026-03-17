/**
 * Interfaz que define la estructura básica de información de una entidad bancaria
 * Utilizada para representar bancos en listas, catálogos y selecciones de formularios
 * @interface BancoList
 */
export interface BancoList {
    /** Identificador único del banco, puede ser numérico o alfanumérico según el sistema */
    id: number | string;
    /** Nombre comercial o denominación oficial del banco */
    name: string;
}