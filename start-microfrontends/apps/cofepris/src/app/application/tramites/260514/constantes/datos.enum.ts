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

  /**
 * Mensaje de validación que solicita confirmación al usuario
 * sobre la ausencia de datos relacionados con el pago de derechos.
 */
export const MENSAJE_DE_VALIDACION = '<strong>¡Error de registro!</strong> Faltan campos por capturar';

/**
 * Mensaje de validación que solicita confirmación al usuario
 * sobre la ausencia de datos relacionados con el pago de derechos.
 */
export const MENSAJE_DE_VALIDACION_PAGO_DERECHOS = '<div>¿Está seguro que su solicitud no requiere los datos del Pago de derechos?</div>';

export const MSG_REGISTRO_EXITOSO = (numeroSolicitud: string) =>
  `<p style="text-align: center;">
    La solicitud ha quedado registrada con el número temporal ${numeroSolicitud ?? ''}. 
    Este no tiene válidez legal y sirve solamente para efectos de identificar tu solicitud. 
    Un folio oficial le será asignado al momento en que ésta sea firmada.
  </p>`;