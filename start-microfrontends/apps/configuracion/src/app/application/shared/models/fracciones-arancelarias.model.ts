/**
 * Representa una fracción arancelaria seleccionada o procesada
 * como resultado del formulario o la lógica de negocio.
 *
 * Contiene información jerárquica que permite identificar su
 * relación dentro del árbol de fracciones arancelarias.
 */
export interface FraccionesArancelariasOutput {
    /**
     * Identificador único de la fracción arancelaria.
     */
    id: string;

    /**
     * Título o descripción de la fracción arancelaria.
     */
    titulo: string;

    /**
     * Identificador del elemento padre dentro de la jerarquía
     * de fracciones arancelarias.
     */
    parent: string;

    /**
     * Nivel jerárquico de la fracción arancelaria dentro del árbol.
     */
    level: number;
}
