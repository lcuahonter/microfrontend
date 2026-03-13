/**
 * Representa un producto dentro del sistema.
 *
 * Contiene la información básica de identificación y descripción
 * del producto, utilizada en formularios, catálogos y procesos
 * relacionados con cupos o trámites.
 */
export interface Producto {
    /**
     * Identificador único del producto.
     */
    id: number;

    /**
     * Clave numérica del producto.
     */
    clave: number;

    /**
     * Nombre del producto.
     */
    nombre: string;

    /**
     * Descripción detallada del producto.
     */
    descripcion: string;

    /**
     * Sigla o abreviatura asociada al producto.
     */
    sigla: string;
}
