import { ProgramaLista } from "../models/lista-programa.model";

/**
 * Configuración de la lista de programas utilizada para definir las columnas
 * y el orden de visualización en una tabla o lista.
 */
export const CONFIGURACION_LISTA_PROGRAMA = [
    {
      /** Encabezado de la columna */
      encabezado: 'Folio de programa',
      /** Función para obtener el valor de la columna desde un objeto ProgramaLista */
      clave: (ele: ProgramaLista): string | undefined => ele.idProgramaCompuesto,
      /** Orden de la columna */
      orden: 1,
    },
    {
      /** Encabezado de la columna */
      encabezado: 'Tipo de programa',
      /** Función para obtener el valor de la columna desde un objeto ProgramaLista */
      clave: (ele: ProgramaLista): string | undefined => ele.tipoPrograma,
      /** Orden de la columna */
      orden: 2,
    }
];