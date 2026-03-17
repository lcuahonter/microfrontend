/**
 * @constant MODIFICACION_PERMISO_ENUM
 * @description
 * Arreglo de objetos que define las etapas del proceso de modificación de permiso sanitario.
 * Cada objeto representa un paso con su índice, título, y banderas de estado (activo, completado).
 */
export const MODIFICACION_PERMISO_ENUM = [
  {
    indice: 1,
    titulo: 'Capturar solicitud',
    activo: true,
    completado: false,
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
 * @constant MODIFICACION_PERMISO_DATA
 * @description
 * Descripción textual del trámite de modificación al permiso sanitario de importación de medicamentos.
 * Se utiliza para mostrar información contextual o encabezados en la interfaz de usuario.
 */
export const MODIFICACION_PERMISO_DATA =
  'Modificación al permiso sanitario de importación de medicamentos destinados a pruebas de laboratorio';

/**
 * @constant ERROR_FORMA_ALERT
 * @description
 * Mensaje HTML que se muestra como alerta cuando faltan campos por capturar en el formulario.
 * Se utiliza para informar al usuario que debe completar todos los campos requeridos antes de continuar.
 */
export const ERROR_FORMA_ALERT = `
<div class="d-flex justify-content-center text-center">
  <div>
    <div class="col-md-12">
      Faltan campos por capturar.
    </div>
  </div>
</div>
`;

/**
 * @constant AVISO_PRIVACIDAD
 * @description
 * Objeto que contiene mensajes HTML relacionados con el aviso de privacidad.
 */
export const AVISO_PRIVACIDAD = {
  ADJUNTAR: `<h5>Aviso de privacidad simplificado</h5>
    <p style="text-align: justify">El Servicio de Administración Tributaria (SAT), es el sujeto obligado y responsable del tratamiento de los datos personales que se recaban a través de la Ventanilla Digital Mexicana de Comercio Exterior (VUCEM), los datos personales podrán ser utilizados y transferidos a la autoridades competentes, con la finalidad de llevar a cabo cualquier trámite relacionado con importaciones, exportaciones y tránsito de mercancías de comercio exterior, incluyendo las regulaciones y restricciones no arancelarias que, conforme a la legislación aplicable, sea exigido por las autoridades competentes en materia de comercio exterior y/o consultar información sobre los procedimientos para la importación, exportación y tránsito de mercancías de comercio exterior, incluyendo las regulaciones y restricciones no arancelarias, así como las notificaciones que se deriven de dichos trámites y serán protegidos, incorporados y tratados en el Sistema de datos personales de la VUCEM, asimismo podrán ser transmitidos a las autoridades competentes establecidad en el Decreto por el que se establece la Ventanilla Digital Mexicana de Comercio Exterior, publicado en el Diario Oficial de la Federaciónel 14 de enero de 2011, así como al propio titular de la información. El titular, en su caso, podrá manifestar su negativa para el tratamiento de sus datos personales para finalidades y transferencias de los mismos que requieran el consentimiento del titular. Si desea conocer nuestro aviso de privacidad integral, lo podrá consultar en el portal.</p><a href="">Aviso de privacidad integral</a>`,
};

/**
 * @constant MENSAJE_DE_VALIDACION_PAGO_DERECHOS
 * @description
 * Mensaje HTML de confirmación que se muestra cuando el usuario indica que su solicitud no requiere datos de Pago de derechos.
 * Se utiliza para advertir y solicitar confirmación antes de omitir la sección de pago.
 */
export const MENSAJE_DE_VALIDACION_PAGO_DERECHOS =
  '<div>¿Está seguro que su solicitud no requiere los datos del Pago de derechos?</div>';

/**
 * Identificador del procedimiento administrativo correspondiente al trámite.
 *
 * @constant
 * @type {number}
 */
export const ID_PROCEDIMIENTO = 260910;

/**
 * @constant MENSAJE_DE_VALIDACION
 * @description
 * Mensaje HTML de error que se muestra cuando faltan campos por capturar en el formulario de registro.
 * Se utiliza para alertar al usuario sobre la necesidad de completar todos los campos requeridos.
 */
export const MENSAJE_DE_VALIDACION =
  '<div><b>¡Error de registro!</b> Faltan campos por capturar.</div>';

/**
 * @constant ELEMENTOS_REQUERIDOS
 * @description
 * Lista de claves de campos requeridos para completar el formulario o proceso de modificación de permiso.
 * Se utiliza para validar que todos los campos obligatorios han sido capturados antes de continuar.
 */
export const ELEMENTOS_REQUERIDOS = [
  'correoElectronico',
  'denominacionRazon',
  'scian',
];
