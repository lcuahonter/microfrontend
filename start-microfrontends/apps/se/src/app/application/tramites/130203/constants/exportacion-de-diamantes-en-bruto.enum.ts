/**
 * @const PASOS_EXPORTACION
 * @description
 * Lista de pasos que conforman el flujo de exportación.
 * Cada paso contiene un índice, un título, y banderas que indican si el paso está activo o completado.
 *
 * Esta estructura se utiliza para controlar y visualizar el progreso del usuario dentro del proceso de exportación.
 *
 * Ejemplo de un paso:
 * {
 *   indice: 1,
 *   titulo: 'Capturar solicitud',
 *   activo: true,
 *   completado: true
 * }
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
  },
];

/**
 * ID_PROCEDIMIENTO representa el identificador numérico del procedimiento
 * asociado a este tipo de solicitud específica.
 */
export const ID_PROCEDIMIENTO = 130203;

/**
 * DATOS_DEL_TRAMITE define los campos necesarios para capturar
 * la información relevante del trámite de exportación de diamantes en bruto.
 * Cada objeto en el arreglo especifica la etiqueta, el marcador de posición,
 * si el campo es obligatorio y el nombre del control asociado.
 */
export const DATOS_DEL_TRAMITE = [{
  label: 'Régimen al que se destinará la mercancía',
  placeholder: 'Seleccione un documento',
  required: true,
  controlName: 'regimen',
},
{
  label: 'Clasificación del régimen',
  placeholder: 'Seleccione un documento',
  required: true,
  controlName: 'clasificacion',
},
]

/**
 * Opciones de opiniones para la solicitud.
 */
export const OPINIONES_SOLICITUD = [{
    /** Etiqueta para la opción "Inicial" */
    label: 'Inicial', value: 'TISOL.I'
}];

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


/** Genera el mensaje HTML para registro exitoso
 * @param numeroSolicitud Número de solicitud a incluir en el mensaje
 * @returns Mensaje HTML formateado para registro exitoso
 */
export const MSG_REGISTRO_EXITOSO = (numeroSolicitud: string): string =>
  `<p>La solicitud ha quedado registrada con el número temporal ${numeroSolicitud ?? ''}. Este no tiene válidez legal y sirve solamente para efectos de identificar tu solicitud. Un folio oficial le será asignado al momento en que ésta sea firmada.</p>`;

/**
 * Plantilla HTML utilizada para mostrar un mensaje de error en el formulario
 * cuando existen campos obligatorios sin capturar.
 */
export const FORM_ERROR_ALERT = `<div class="d-flex justify-content-center text-center">
  <div>
    <div class="col-md-12">
     <b>¡Error de registro!</b> Faltan campos por capturar.
    </div>
  </div>
</div>
`
/**
 * Genera una plantilla HTML con un mensaje de error personalizado relacionado
 * con el proceso de cálculo.
 */
export const CALCULATE_ALERT_ERROR = (mensajeDeError: string): string => `<div class="d-flex justify-content-center text-center">
  <div>
    <div class="col-md-12">
     <p style="color: #000000;">Corrija los siguientes errores:</p>
     <ol><li style="color: #b72222;"> ${mensajeDeError} </li></ol>
    </div>
  </div>
</div>
`
