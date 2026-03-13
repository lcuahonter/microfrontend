/**
 * Tipo para las fracciones restructuradas, las modica para usarlas en la tabla
 */
export interface FraccionesRestrucuradas {
    id: string;
    titulo: string;
    parent: string;
    level: number;
}
/**
 * enum para nombrar los modales.
 */
export enum ModalFracciones {
    'AGREGAR',
    'ELIMINAR',
    'CONSULTAR'
}
/**
 * interfaz para saber que modales estan habilitados para la vista y que no.
 */
export interface ModalesHabilitados {
    modal: ModalFracciones
    habilitado : boolean
}