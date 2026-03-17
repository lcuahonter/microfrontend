/**
 * Representa una lista de elementos del catálogo de tipos de equipo.
 * 
 * @property {CatalogoTipoEquipo[]} datos - Arreglo que contiene los elementos del catálogo de tipos de equipo.
 */
export interface CatalogoTipoEquipoLista {
    datos: CatalogoTipoEquipo[];
}

/**
 * Representa un elemento del catálogo de tipos de equipo.
 *
 * @property clave - Clave única que identifica el tipo de equipo.
 * @property descripcion - Descripción del tipo de equipo.
 */
export interface CatalogoTipoEquipo {
    clave: string;
    descripcion: string;
}