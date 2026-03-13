
/**
  * @constant ERROR_FORMA_ALERT
  * @type {string}
  * @description
  * Este mensaje de alerta informa al usuario sobre el proceso para agregar datos del traslado y la sede, 
  * indicando que a cada traslado le corresponde una sede con un máximo de dos itinerarios.
  */
export const ERROR_FORMA_ALERT =
`
<div class="d-flex justify-content-center text-center">
  <div>
    <div class="col-md-12">
      <strong>¡Error de registro!</strong>
    </div>
    <div class="col-md-12">
      Faltan campos por capturar.
    </div>
  </div>
</div>
`;
 
/**
 * Interfaz que define la configuración de visibilidad para diferentes atributos relacionados con países.
 * 
 * @property {boolean} paisOrigen - Indica si el país de origen es visible.
 * @property {boolean} paisFabrica - Indica si el país de fabricación es visible.
 * @property {boolean} paisElaboracion - Indica si el país de elaboración es visible.
 * @property {boolean} paisProveedor - Indica si el país del proveedor es visible.
 * @property {boolean} paisProcedencia - Indica si el país de procedencia es visible.
 */
export interface ConfiguracionVisibilidad {
  paisOrigen: boolean;
  paisFabrica: boolean;
  paisElaboracion: boolean;
  paisProveedor: boolean;
  paisProcedencia: boolean;
}
/**
 * Configuración predeterminada de visibilidad para los datos de solicitud.
 * 
 * Esta constante define qué campos relacionados con los países son visibles
 * o no en la configuración inicial de la solicitud.
 * 
 * @property paisOrigen - Indica si el país de origen es visible (true) o no (false).
 * @property paisFabrica - Indica si el país de la fábrica es visible (true) o no (false).
 * @property paisElaboracion - Indica si el país de elaboración es visible (true) o no (false).
 * @property paisProveedor - Indica si el país del proveedor es visible (true) o no (false).
 * @property paisProcedencia - Indica si el país de procedencia es visible (true) o no (false).
 */
export const DEFAULT_CONFIGURACION_VISIBILIDAD: ConfiguracionVisibilidad = {
  paisOrigen: true,
  paisFabrica: false,
  paisElaboracion: false,
  paisProveedor: false,
  paisProcedencia: true
};
export const MENSAJE_DE_VALIDACION = '<div style="text-align: center;"><b>¡Error de registro!</b> Faltan campos por capturar.</div>';
/*
 * Título del mensaje informativo para el permiso sanitario de importación de medicamentos destinados a donación.
 * 
 * @description Texto descriptivo que se muestra al usuario para identificar el tipo específico 
 * de trámite que está realizando. Este título aparece en la interfaz de usuario como encabezado 
 * principal del formulario de solicitud.
 * 
 * @type {string}
 * @constant
 * @readonly
 * @since 1.0.0
 * @example
 * // Uso en componente de interfaz
 * <h1>{TITULO_MENSAJE}</h1>
 */
export const TITULO_MENSAJE = 
  'Permiso de importación de sustancias tóxicas';

  /**
  * Mensaje de validación que solicita confirmación al usuario
  * sobre la ausencia de datos relacionados con el pago de derechos.
  */
 export const MENSAJE_DE_PAGE= '¿Está seguro que su solicitud no requiere los datos del Pago de derechos?';

 export const MSG_REGISTRO_EXITOSO = (numeroSolicitud: string) =>
    `<p style="text-align: center;">
      La solicitud ha quedado registrada con el número temporal ${numeroSolicitud ?? ''}. 
      Este no tiene válidez legal y sirve solamente para efectos de identificar tu solicitud. 
      Un folio oficial le será asignado al momento en que ésta sea firmada.
    </p>`;

        /**
 * Texto del mensaje de título utilizado en el trámite.
 *
 * Este texto se utiliza para mostrar el título principal relacionado con el trámite de dispositivos médicos.
 */
export const TITULOMENSAJE =
  'Permiso de importación de muestras experimentales de sustancias tóxicas';