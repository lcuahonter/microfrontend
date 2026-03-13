/**
 * Constantes para el trámite de importación de vehículos usados por donación.
 * Incluye los pasos del proceso, opciones de opiniones y productos, así como el ID del procedimiento y mensajes relevantes.
 * @module importacion-vehiculos-usados-donacion-pasos-enum
 */
export const PASOS_EXPORTACION = [
    {
        /** Paso para capturar la solicitud */
        indice: 1,
        /** Título del paso */
        titulo: 'Capturar solicitud',
        /** Indica si el paso está activo */
        activo: true,
        /** Indica si el paso está completado */
        completado: true,
    },
    {
        /** Paso para anexar requisitos */
        indice: 2,
        /** Título del paso */
        titulo: 'Anexar requisitos',
        /** Indica si el paso está activo */
        activo: false,
        /** Indica si el paso está completado */
        completado: false,
    },
    {
        /** Paso para firmar la solicitud */
        indice: 3,
        /** Título del paso */
        titulo: 'Firmar solicitud',
        /** Indica si el paso está activo */
        activo: false,
        /** Indica si el paso está completado */
        completado: false,
    }
];
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

/**
 * ID del procedimiento para la importación de vehículos usados por donación.
 * @constant {number}
 */
export const ID_PROCEDIMIENTO : number = 130105; 


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