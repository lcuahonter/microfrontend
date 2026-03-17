/**
 * Interfaz que representa una etiqueta para listas cruzadas.
 * Contiene los textos que se muestran en la parte izquierda y derecha de la etiqueta.
 */
export interface CrossListLable {
    /** Texto que aparece en la parte izquierda de la etiqueta. */
    tituluDeLaIzquierda: string;

    /** Texto que aparece en la parte derecha de la etiqueta. */
    derecha: string;
}

/**
 * Interfaz que representa una lista cruzada.
 * Incluye las etiquetas y las fechas asociadas a la lista.
 */
export interface CrossList {
    /** Etiquetas asociadas a la lista cruzada. */
    label: CrossListLable;

    /** Fechas asociadas con los datos de la lista cruzada. */
    fechas: string[];
}

/**
 * Interfaz que agrupa las listas cruzadas relacionadas con la mercancía.
 * Incluye listas para país de origen, país de procedencia y uso específico.
 */
export interface MercanciaCrossList {
    /** Lista cruzada para los países de origen de la mercancía. */
    paisOrigenCrossList: CrossList;

    /** Lista cruzada para los países de procedencia de la mercancía. */
    paisProcedencisCrossList: CrossList;

    /** Lista cruzada para los usos específicos de la mercancía. */
    usoEspecificoCrossList: CrossList;
}

/**
 * Interfaz que representa la información detallada de una mercancía.
 * Incluye identificadores, denominaciones, clasificaciones, cantidades, unidades, países, tipo de producto y uso específico.
 */
export interface MercanciasInfo {
    /** Identificador único de la mercancía. */
    id: number;

    /** Clasificación de la mercancía. */
    clasificaionProductos: string;

    /** Especificación adicional de la mercancía. */
    especificarProducto: string;

    /** Denominación específica de la mercancía. */
    nombreProductoEspecifico: string;

    /** Denominación distintiva de la mercancía. */
    denominacionDistintiva: string;

    /** Denominación común de la mercancía. */
    denominacionNombre: string;

    /** Tipo de producto de la mercancía. */
    tipoProducto: string;

    /** Estado físico de la mercancía. */
    estadoFisico: string;

    /** Fracción arancelaria de la mercancía. */
    fraccionArancelaria: string;

    /** Descripción de la fracción arancelaria. */
    descripcionFraccionArancelaria: string;

    /** Cantidad en la unidad de medida de transporte (UMT). */
    cantidadUMT: string;

    /** Unidad de medida de transporte (UMT). */
    umt: string;

    /** Cantidad en la unidad de medida comercial (UMC). */
    cantidadUMC: string;

    /** Unidad de medida de la mercancía (UMC). */
    umc: string;

    /** Presentación farmacéutica de la mercancía. */
    presentacionFarmaceutica: string;

    /** País de origen de la mercancía. */
    paisDeOrigen: string;

    /** País de procedencia de la mercancía. */
    paisDeProcedencia: string;

    /** Uso específico de la mercancía. */
    usoEspecifico: string;
}