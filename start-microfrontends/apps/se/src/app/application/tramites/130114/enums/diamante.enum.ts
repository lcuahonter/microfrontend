/**
 * AccionBoton:
 * Esta interfaz representa la estructura de un botón de acción.
 * Contiene las siguientes propiedades:
 * 
 * - accion: Una cadena que describe la acción que realiza el botón.
 * - valor: Un número asociado al valor o identificador de la acción.
 */
export interface AccionBoton {
    accion: string;
    valor: number;
}