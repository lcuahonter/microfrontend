import { Type } from "@angular/core";

/**
 * Representa la configuración de una sección dinámica para el componente de acordeón.
 * @property titulo - Título que se mostrará en la sección.
 * @property componentClase - Clase del componente que se cargará dinámicamente en la sección.
 */
export interface SeccionDinamica {
    titulo: string;
    componentClase?: Type<unknown>;
}