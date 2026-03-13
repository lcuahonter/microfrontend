/**
 * Interfaz que representa los detalles de un producto.
 */
export interface DetallesDelMercancia {
    /**
     * Tipo de mercancía, por ejemplo, "electrónica", "ropa", etc.
     */
    tipoDeMercancia: string;
    /**
     * Condición de la mercancía, como "nueva", "usada", etc.
     */
    condicionDeLaMercancia: string;
    /**
     * Cantidad de unidades de la mercancía.
     */
    cantidad: string;
    /**
     * Información adicional en caso de ser necesario.
     */
    enSucaso: string;
    /**
     * Unidad de medida utilizada, como "kilogramos", "litros", etc.
     */
    unidadDeMedida: string;
    /**
     * Año en el que se realizó la importación temporal.
     */
    anoDeImportacionTemporal: string;
    /**
     * Modelo del producto.
     */
    modelo: string;
    /**
     * Marca del producto.
     */
    marca: string;
    /**
     * Número de serie del producto.
     */
    numeroDeSerie: string;
}