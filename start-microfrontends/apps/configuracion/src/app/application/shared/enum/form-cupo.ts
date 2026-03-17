/**
 * Define los tipos posibles de clasificación de régimen que pueden
 * ser seleccionados en el formulario.
 *
 * - "IMPORTACION": Régimen de importación.
 * - "EXPORTACION": Régimen de exportación.
 * - undefined: Valor inicial o no seleccionado.
 */
export type ClasificacionRegimenType =
    | 'IMPORTACION'
    | 'EXPORTACION'
    | undefined;

/**
 * Define los tipos de modal que pueden abrirse en la aplicación.
 *
 * Se utiliza para determinar qué contenido debe mostrarse:
 * - PRODUCTOS: Abre el modal de selección o gestión de productos.
 * - MONTO: Abre el modal de captura o visualización de montos.
 */
export enum TipoModal {
    PRODUCTOS = 'PRODUCTOS',
    MONTO = 'MONTO',
    TEXTIL = 'TEXTIL',
    FRACCIONES_ARANCELARIAS = 'FRACCIONES_ARANCELARIAS',
    FRACCIONES_USA = 'FRACCIONES_USA'
}

export enum TipoForm {
    REGISTRAR_CUPO = 'REGISTRAR_CUPO',
    SUBCUPO = 'SUBCUPO',
    TPL = 'TPL'
}