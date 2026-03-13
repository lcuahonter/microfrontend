/**
 * Textos y mensajes utilizados en el componente de carga por archivo para mostrar información y ayudas al usuario.
 */
export const TEXTOS = {
    PARA_1: `Has seleccionado la opción para cargar las fracciones desde un archivo. 
              A continuación te presentamos las consideraciones que toma en cuenta el sistema
              para llevar a cabo la carga de las mismas.`,
    PARA_2: `El archivo debe de encontrarse en formato .csv ó .txt y debe contener los valores a subir separados por pipes (|).
              La primera línea del archivo debe contener los encabezados de cada uno de los campos que se cargarán dentro del sistema.`,
    PARA_3: `A continuación se define el orden de cada uno de los campos.`,
    CARGA_DE_ARCHIVOS: `Choose File`,
    CARGA_DE_ARCHIVO_DE_TEXTO: `No file chosen`,
}

/**
 * Arreglo que define el orden y la descripción de los campos requeridos para la carga por archivo.
 */
export const TABLA_DATOS = [
    { posicion: 1, dato: 'IDENTIFICADOR DE LA FRACCIÓN ARANCELARIA (para las fracciones de importación el valor debe corresponder al de la fracción de exportación)' },
    { posicion: 2, dato: 'TIPO DE FRACCIÓN ARANCELARIA (EXPO ó IMPO)' },
    { posicion: 3, dato: 'FRACCIÓN ARANCELARIA' },
    { posicion: 4, dato: 'DESCRIPCIÓN DE LA FRACCIÓN ARANCELARIA' },
    { posicion: 5, dato: 'CATEGORIA(PT para producto terminadoY MP para materia prima)' },
    { posicion: 6, dato: 'VOLÚMEN A REALIZARSE MENSUALMENTE' },
    { posicion: 7, dato: 'VOLÚMEN A REALIZARSE DURANTE EL PERIODO DE DOS AÑOS' },
    { posicion: 8, dato: 'VALOR EN MONEDA NACIONAL A REALIZARSE MENSUALMENTE' },
    { posicion: 9, dato: 'VALOR EN MONEDA NACIONAL REALIZARSE DURANTE EL PERIODO DE DOS AÑOS' }
  ]