/**
 * PASOS_EXPORTACION:
 * Este arreglo representa los pasos necesarios para completar el proceso de exportación.
 * Cada paso contiene las siguientes propiedades:
 * 
 * - indice: Número que indica el orden del paso en el proceso.
 * - titulo: Descripción breve del paso.
 * - activo: Indica si el paso está habilitado para ser realizado.
 * - completado: Indica si el paso ya ha sido completado.
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
export const FECHA = {
  /** Texto que se muestra como etiqueta del campo. */
    labelNombre:'Fecha de expedición de factura',
    /** Indica si el campo es obligatorio. */
    required: true,
    /** Indica si el campo debe estar habilitado. */
    habilitado: true,
  }

  /**
   * Contenido HTML del aviso de privacidad simplificado.
   * @constant {string}
   */
  export const AVISO_PRIVACIDAD_CONTENIDO = `
    <div class="my-4">
    <div class="text-center">
      <h4 class="mb-4">Aviso de privacidad simplificado</h4>
      </div>
      <div>
      <p class="text-justify">
        El Servicio de Administración Tributaria (SAT), es el sujeto obligado y responsable del tratamiento de los datos personales que se recaban a través de la Ventanilla Digital Mexicana de Comercio Exterior (VUCEM), los datos personales podrán ser utilizados y transferidos a la autoridades competentes, con la finalidad de llevar a cabo cualquier trámite relacionado con importaciones, exportaciones y tránsito de mercancías de comercio exterior, incluyendo las regulaciones y restricciones no arancelarias que, conforme a la legislación aplicable, sea exigido por las autoridades competentes en materia de comercio exterior y/o consultar información sobre los procedimientos para la importación, exportación y tránsito de mercancías de comercio exterior, incluyendo las regulaciones y restricciones no arancelarias, así como las notificaciones que se deriven de dichos trámites y serán protegidos, incorporados y tratados en el sistema de datos personales de la VUCEM, asimismo podrán ser transmitidos a las autoridades competentes establecidas en el Decreto por el que se establece la Ventanilla Digital Mexicana de Comercio Exterior, publicado en el Diario Oficial de la Federación el 14 de enero de 2011, así como al propio titular de la información. El titular, en su caso, podrá manifestar su negativa para el tratamiento de sus datos personales para finalidades y transferencias de los mismos que requieran el consentimiento del titular. Si desea conocer nuestro aviso de privacidad integral, lo podrá consultar en el portal.
      </p>
      </div>
      <div class="text-center">
        <a class="text-primary" style="cursor: pointer;" (click)="seccionStore.establecerSeccion([false])">
          Aviso de privacidad integral
        </a>
      </div>
    </div>
  `;  

/**
 * ID del procedimiento para la importación de vehículos usados por donación.
 * @constant {number}
 */
export const ID_PROCEDIMIENTO : number = 130119;


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