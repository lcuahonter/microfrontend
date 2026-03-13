/**
 * Define los pasos del proceso de exportación.
 * Cada paso incluye un índice, un título descriptivo, y estados de actividad y completitud.
 */
export const PASOS_EXPORTACION = [
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
        indice: 3,
        titulo: 'Firmar solicitud',
        activo: false,
        completado: false,
    }
];

/**
 * Opciones de opiniones para la solicitud.
 */
export const OPINIONES_SOLICITUD = [
  {
    /** Etiqueta para la opción "Inicial" */
    label: 'Inicial',
    value: 'TISOL.I',
  },
];

/**
 * Opciones de productos para la solicitud.
 * Cada opción incluye una etiqueta y un valor asociado.
 * 
 */ 
export const PRODUCTO_OPCION = [
    {
        /** Etiqueta para la opción "Nuevo" */
        label: 'Nuevo',
        /** Valor asociado a la opción "Nuevo" */
        value: 'CONDMER.N'
    },
    {
        /** Etiqueta para la opción "Usado" */
        label: 'Usado',
        /** Valor asociado a la opción "Usado" */
        value: 'CONDMER.U'
    }
];

/**
 * ID del procedimiento para la importación de vehículos usados por donación.
 * @constant {number}
 */
export const ID_PROCEDIMIENTO: number = 130116;

/**
 * @constant TITULO_PASO_UNO
 * @description
 * Constante que representa el título para el paso uno en el proceso.
 */
export const TITULO_PASO_UNO = 'Solicitud importación ambulancia para reconstrucción y';

/**
 * @constant TITULO_PASO_DOS
 * @description
 * Constante que representa el título para el paso dos en el proceso.
 */
export const TITULO_PASO_DOS = 'Cargar archivos';

/**
 * @constant TITULO_PASO_TRES
 * @description
 * Constante que representa el título para el paso tres en el proceso.
 */
export const TITULO_PASO_TRES = 'Firmar';

/**
 * Plantilla HTML utilizada para mostrar un mensaje de error en el formulario
 * cuando existen campos obligatorios sin capturar.
 * @constant {string}
 */
export const ERROR_ALERTA: string = `<div class="d-flex justify-content-center text-center">
  <div>
    <div class="col-md-12">
     <b>¡Error de registro!</b> Faltan campos por capturar.
    </div>
  </div>
</div>
`

/**
 * Genera el mensaje HTML para registro exitoso
 * @param numeroSolicitud Número de solicitud a incluir en el mensaje
 * @returns Mensaje HTML formateado para registro exitoso
 */
export const MSG_REGISTRO_EXITOSO = (numeroSolicitud: string): string =>
  `<p>La solicitud ha quedado registrada con el número temporal ${numeroSolicitud ?? ''}. Este no tiene válidez legal y sirve solamente para efectos de identificar tu solicitud. Un folio oficial le será asignado al momento en que ésta sea firmada.</p>`;

/**
 * Genera una plantilla HTML con un mensaje de error personalizado relacionado
 * con el proceso de cálculo.
 * @param mensajeDeError Mensaje de error a incluir en la plantilla
 * @returns Plantilla HTML formateada con el mensaje de error
 */
export const MENSAJE_CORREGIR_ERRORES = (mensajeDeError: string): string => `<div class="d-flex justify-content-center text-center">
  <div>
    <div class="col-md-12">
     <p style="color: #000000;">Corrija los siguientes errores:</p>
     <ol><li style="color: #b72222;"> ${mensajeDeError} </li></ol>
    </div>
  </div>
</div>
`