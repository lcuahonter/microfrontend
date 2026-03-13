/**
 * Define una constante que representa la lista de pasos para un asistente (wizard).
 * Cada paso incluye su índice, título, estado de actividad y estado de completitud.
 *
 * Índice numérico del paso.
 * Título descriptivo del paso.
 * Indica si el paso está actualmente activo y visible.
 * Indica si el paso ha sido completado.
 */
export const PASOS = [
    {
      indice: 1,
      titulo: 'Capturar solicitud',
      activo: true,
      completado: true,
    },
    {
      indice: 2,
      titulo: 'Anexar requisitos',
      activo: false,
      completado: false,
    },
    {
      indice: 4,
      titulo: 'Firmar solicitud',
      activo: false,
      completado: false,
    },
  ];

  /**
* Secciones a mostrar dentro de cada Paso de acuerdo al trámite
*/
export const SECCIONES_TRAMITE_260206 = {
    PASO_1: {
      VALIDACION_SECCION_1: false,
      VALIDACION_SECCION_2: false,
      VALIDACION_SECCION_3: false,
      VALIDACION_SECCION_4: false,
    },
    PASO_2: {
      VALIDACION_SECCION: true,
    },
    PASO_3: {
      requiereValidacion: true,
    },
  };

  /**
   * Constante que define los elementos requeridos para el proceso de tramitación.
   * 
   * Contiene un arreglo de cadenas que representan los campos obligatorios
   * necesarios para completar el trámite. Estos elementos incluyen:
   * - `denominacionRazon`: Representa la denominación o razón social.
   * - `correoElectronico`: Correo electrónico de contacto.
   * - `scian`: Código SCIAN relacionado con la actividad económica.
   */
  export const DATOS_ELEMENTOS_REQUERIDOS = ['denominacionRazon', 'correoElectronico', 'scian'];

  export const ELEMENTOS_REQUERIDOS = [
  
    'fabricante'
  ];

  /**
 * Constante que representa el título del mensaje utilizado en el permiso sanitario
 * de importación de medicamentos y materias primas destinados a investigación en humanos.
 * 
 * Esta constante se utiliza para mostrar un mensaje descriptivo en la interfaz de usuario
 * relacionado con el trámite correspondiente. Proporciona información clara y específica
 * sobre el propósito del permiso sanitario.
 * 
 * @constant
 * @type {string}
 */
export const TITULO_MENSAJE =
  'Permiso sanitario de importación de medicamentos y materias primas destinados a investigación en humanos';

  /**
 * Mensaje de validación que solicita confirmación al usuario
 * sobre la ausencia de datos relacionados con el pago de derechos.
 */
export const MENSAJE_DE_VALIDACION = '<div><b>¡Error de registro!</b> Faltan campos por capturar.</div>';

/**
 * Mensaje de validación que solicita confirmación al usuario
 * sobre la ausencia de datos relacionados con el pago de derechos.
 */
export const MENSAJE_DE_PAGE= '¿Está seguro que su solicitud no requiere los datos del Pago de derechos?';

/**
 * Mensaje de validación que solicita confirmación al usuario
 * sobre la ausencia de datos relacionados con el pago de derechos.
 */
export const MENSAJE_DE_VALIDACION_PAGO_DERECHOS = '<div>¿Está seguro que su solicitud no requiere los datos del Pago de derechos?</div>';