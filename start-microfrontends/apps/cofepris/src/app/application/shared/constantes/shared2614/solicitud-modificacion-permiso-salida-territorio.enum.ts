/**
 * Constante que define los pasos del proceso de exportación.
 * Cada paso incluye un índice, un título, y los estados de activo y completado.
 */
export const PASOS_EXPORTACION = [
    {
      /**
       * Índice del paso.
       */
      indice: 1,
  
      /**
       * Título del paso.
       */
      titulo: 'Capturar solicitud',
  
      /**
       * Indica si el paso está activo.
       */
      activo: true,
  
      /**
       * Indica si el paso está completado.
       */
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
    },
  ];

/**
 * ID_PROCEDIMIENTO representa el identificador numérico del procedimiento
 * asociado a este tipo de solicitud específica.
 * @constant {number} ID_PROCEDIMIENTO
 * @description Identificador único del trámite 261401, 261402 - Solicitud de modificación de permiso de salida del territorio nacional
 */
export const ID_PROCEDIMIENTO = ['261401', '261402'];

/**
 * Identificadores numéricos relacionados con permisos definitivos.
 *
 * @constant
 * @type {number[]}
 * @description Representa códigos específicos utilizados en el sistema para identificar tipos de permisos definitivos.
 */
export const PERMISO_DEFINITIVO_TITULO = ['261401', '261402'];

/**
 * Identificadores numéricos relacionados con permisos definitivos.
 *
 * @constant
 * @type {number[]}
 * @description Representa códigos específicos utilizados en el sistema para identificar tipos de permisos definitivos.
 */
export const PERMISO_SECCION = ['261401', '261402'];

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
</div>`;