/**
 * Textos y mensajes utilizados en el componente de carga por archivo para mostrar información y ayudas al usuario.
 */
export const TEXTOS = {
    PARA_1: `Has seleccionado la opción para cargar proveedores y clientes desde un archivo. A continuación te presentamos las consideraciones que toma en cuenta el sistema para llevar a cabo la carga de las mismas.`,
    PARA_2: `El archivo debe de encontrarse en formato .csv ó .txt y debe contener los valores a subir separados por pipes(). La primer línea del archivo debe de contener los encabezados de cada uno de los campos que se cargarán dentro del sistema.`,
    PARA_3: `A continuación se define el orden de cada uno de los campos.`,
    CARGA_DE_ARCHIVOS: `Choose File`,
    CARGA_DE_ARCHIVO_DE_TEXTO: `No file chosen`,
}

/**
 * Arreglo que define el orden y la descripción de los campos requeridos para la carga por archivo.
 */
export const TABLA_DATOS = [
    { posicion: 1, dato: 'IDENTIFICADOR DE LA FRACCIÓN ARANCELARIA AL QUE CORRESPONDE' },
    { posicion: 2, dato: 'TIPO DE REGISTRO (P) PARA PROVEEDORE (C) PARA CLIENTE' },
    { posicion: 3, dato: 'RFC' },
    { posicion: 4, dato: 'RAZÓN SOCIAL' },
    { posicion: 5, dato: 'PAÍS' }
  ]