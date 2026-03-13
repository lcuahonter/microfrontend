/**
 * Interfaz que representa los detalles de un producto.
 */
export interface DetallesDelMercancia {
    /**
     * Tipo de mercancía, por ejemplo, "electrónica", "ropa", etc.
     */
    registroFederal: string;
   
    /**
     * Cantidad de unidades de la mercancía.
     */
    denominacionRazonSocial: string;

    /**
     * Unidad de medida utilizada, como "kilogramos", "litros", etc.
     */
    norma: string;
    /**
     * Año en el que se realizó la importación temporal.
     */
    fechaInicioRelacion: string;
   
}