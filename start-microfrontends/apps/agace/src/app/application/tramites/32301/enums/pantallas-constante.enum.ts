/** 
 * Lista de países en formato string.
 * Esta constante contiene una lista de países con su nombre completo y sus variantes.
 */
export const CROSLISTA_DE_PAISES: string[] = [
  "AFGANISTÁN (EMIRATO ISLÁMICO)",
  "ALBANIA (REPÚBLICA DE)",
  "ALEMANIA (REPÚBLICA FEDERAL DE)",
  "ANDORRA (PRINCIPADO DE)",
  "ANGOLA (REPÚBLICA DE)",
  "ANGUILLA",
  "ANTIGUA Y BARBUDA",
  "ARABIA SAUDITA (COMUNIDAD ECONÓMICA EUROPEA)",
  "ARGELIA (REPÚBLICA DEMOCRÁTICA Y POPULAR DE)",
  "ARGENTINA (REPÚBLICA)",
  "AUSTRALIA (COMMONWEALTH OF)",
  "AUSTRIA (REPUBLIC OF)",
  "BAHAMAS (COMMONWEALTH OF THE)",
  "BAHRAIN (KINGDOM OF)",
  "BANGLADESH (PEOPLE'S REPUBLIC OF)",
  "BARBADOS","ALBANIA",
  "BELGIUM (KINGDOM OF)",
  "BELIZE",
  "BENIN (REPUBLIC OF)",
  "BHUTAN (KINGDOM OF)"
];

/**
* Textos de requisitos y sus instrucciones.
* Estos textos proporcionan instrucciones de cómo manejar los documentos en el trámite.
*/
export const TEXTOS_REQUISITOS = {
INSTRUCCIONES: `<h6>Instrucciones</h6>
    <p>- De acuerdo al caso particular, algunos documentos podrían ser obligatorios</p>
    <p>- En caso de que no requieras algún documento, selecciónalo y elimínalo</p>
    <p>- Si necesitas anexar más de un documento del mismo tipo selecciónalo de la lista y presiona "Agregar nuevo".</p>`,
ADJUNTAR: `<p>Si deseas adjuntar un nuevo documento, selecciona la opción --Adjuntar nuevo documento-- y presiona el botón "Adjuntar documentos"</p>`,
};

/**
* Interfaz para definir la acción y el valor del botón.
* Esta interfaz es usada para gestionar la acción del botón de continuar o regresar dentro del flujo de pasos.
*/
export interface AccionBoton {
accion: string; // La acción del botón ('cont' o 'atras').
valor: number; // El índice del paso al que se navega.
}

/**
* Lista de entradas personalizadas.
* Esta lista contiene nombres de ubicaciones específicas, como puertos y aeropuertos en México.
*/
export const LISTA_DE_ENTRADA_PERSONALIZADA: string[] = [
  "ACAPULCO, PUERTO Y AEROPUERTO",
  "ADUANA DE PANTACO",
  "AEROPUERTO INT. DE LA CD DE MEXICO",
  "AEROPUERTO INTERNACIONAL FELIPE ANGELES",
  "AGUA PRIETA",
  "AGUASCALIENTES, AGS.",
  "ALTAMIRA",
  "CANCUN, AEROPUERTO",
  "CD. CAMARGO, TAMPS.",
  "CD. DEL CARMEN, CAMP.",
  "CD. JUAREZ, CHIHUAHUA, CHIH."
];

/**
* Constante global para el botón de continuar dentro del procedimiento 230401.
* 't' es utilizado como valor para indicar que se debe continuar en el flujo del trámite.
*/
export const CONTINUAR: string = "t";

/**
* Secciones a mostrar dentro de cada Paso de acuerdo al trámite 230401.
* Cada paso tiene configuraciones de validación para mostrar u ocultar secciones específicas.
*/
/**
 * Definición de las secciones y pasos del trámite 230401.
 * Cada paso contiene validaciones específicas para asegurar el cumplimiento de requisitos.
 */
export const SECCIONES_TRAMITE_230401 = {

  /**
   * Paso 1 del trámite, con varias secciones que pueden requerir validación.
   */
  PASO_1: {
      /**
       * La validación para la sección 1 está deshabilitada en este paso.
       */
      VALIDACION_SECCION_1: false,

      /**
       * La validación para la sección 2 está habilitada en este paso.
       */
      VALIDACION_SECCION_2: true,

      /**
       * La validación para la sección 3 está habilitada en este paso.
       */
      VALIDACION_SECCION_3: true,
  },

  /**
   * Paso 2 del trámite, con una única validación de sección.
   */
  PASO_2: {
      /**
       * La validación de la sección en el paso 2 está habilitada.
       */
      VALIDACION_SECCION: true,
  },

  /**
   * Paso 3 del trámite, que requiere validación.
   */
  PASO_3: {
      /**
       * Se establece que el paso 3 requiere validación obligatoria.
       */
      requiereValidacion: true,
  },
};
