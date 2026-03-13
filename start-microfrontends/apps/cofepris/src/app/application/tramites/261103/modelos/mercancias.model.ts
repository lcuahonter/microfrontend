/**
 * Representa la estructura de los datos de mercancías.
 */
export interface MercanciasData {
    /**
     * Código de respuesta del servicio.
     */
    code: number;

    /**
     * Lista de mercancías.
     */
    data: Mercancias[];

    /**
     * Mensaje asociado a la respuesta del servicio.
     */
    message: string;
}

/**
 * Representa la información detallada de una mercancía.
 */
export interface Mercancias {
    /**
     * Clasificación del producto.
     */
    clasificacionDelProducto: string;

    /**
     * Especificación de la clasificación del producto.
     */
    especificarClasificacionDelProduct: string;

    /**
     * Denominación del producto.
     */
    denominacion: string;

    /**
     * Denominación distintiva del producto.
     */
    denominacionDistintiva: string;

    /**
     * Número CAS (Chemical Abstracts Service) del producto.
     */
    numeroCAS: string;

    /**
     * Fracción arancelaria del producto.
     */
    fraccionArancelaria: string;

    /**
     * Descripción de la fracción arancelaria.
     */
    descripcionDeFraccion: string;
}
