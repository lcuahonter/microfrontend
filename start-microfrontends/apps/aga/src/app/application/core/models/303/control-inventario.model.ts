/**
 * Modelo para el control de inventario.
 */
export interface ControlInventario {
    //Identificador único del control de inventario.
    id: string;
    //Nombre del sistema.
    nombreSistema: string;
    //Lugar de radicación.
    lugarRadicacion: string;
    //Indica si es un sistema de control.
    esSistemaControl: boolean;
}
