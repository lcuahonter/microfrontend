/**
 * Constantes con la información de los pasos del wizard.
 * Cada objeto representa un paso con su índice, título y estado de actividad/completado.
 * @const PASOSACUICULTURA
 * @type {Array<{indice: number, titulo: string, activo: boolean, completado: boolean}>}
 * @description
 * Arreglo de objetos que define los pasos del wizard para el trámite de importación de acuicultura.
 * - indice: número de orden del paso.
 * - titulo: nombre del paso mostrado al usuario.
 * - activo: indica si el paso está activo.
 * - completado: indica si el paso ya fue completado.
 */
export const PASOSACUICULTURA = [
    {
        indice: 1,
        titulo: 'Capturar solicitud',
        activo: true,
        completado: true,
    },
    {
        indice: 2,
        titulo: 'Anexar necesarios',
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
 * Constantes con las opciones de radio para la exención de pago.
 * @const
 * @type {Array<{label: string, value: string}>}
 */
export const TIPO_RADIO = [
    {
        label: "No",
        value: "No"
    },
    {
        label: "Sí",
        value: "Si"
    }
];

/**
 * Constantes con la configuración para el input de fecha de salida.
 * @const
 * @type {{labelNombre: string, required: boolean, habilitado: boolean}}
 */
export const FECHA_SALIDA_ACUICULTURA = {
    labelNombre: 'Fecha de pago',
    required: true,
    habilitado: false,
};

/**
 * Constantes con el mensaje para el doble clic en un registro.
 * @const
 * @type {string}
 */
export const MENSAJE_DOBLE_CLIC = "Al dar doble clic en el registro seleccionado creará una nueva solicitud con los mismos datos de la solicitud elegida.";

/**
 * Constantes con los documentos seleccionados requeridos para el trámite.
 * @const
 * @type {Array<{id: number, descripcion: string}>}
 */
export const DOCUMENTOSSELECCIONADOS = [
    { id: 1, descripcion: 'Documentos que ampare el valor de la mercancía' },
    { id: 2, descripcion: 'Documentos del medio de transporte (Guías, BL o carta porte según corresponda)' },
];
/**
 * Contenido del aviso de privacidad simplificado.
 * @const
 * @type {string}
 * @description
 * Este contenido se muestra al usuario para informarle sobre el tratamiento de sus datos personales.
 */
export const PRIVACY_NOTICE_CONTENT = `
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
 * Fecha de pago por defecto (formato DD/MM/YYYY).
 * @const
 * @type {string}
 */
export const ERROR_FORMA_ALERT =
  `
<div class="d-flex justify-content-center text-center">
  <div>
    <div class="col-md-12">
    <strong>¡Error de registro! </strong> Faltan campos por capturar</div>
  </div>
</div>
`;

/**
 * mensaje cuando se finaliza la solicitud paso 1.
 * @const
 * @type {string}
 */
export const MENSAJE_DE_EXITO_ETAPA_UNO = `La solicitud ha quedado registrada con el número temporal _folio_. Este no tiene validez legal y sirve solamente para efectos de identificar tu solicitud. Un folio oficial le será asignado a la solicitud al momento en que ésta sea firmada.`;
