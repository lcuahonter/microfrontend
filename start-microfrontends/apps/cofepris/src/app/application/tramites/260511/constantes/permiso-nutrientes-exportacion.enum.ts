/**
 * TABLA_ORDEN: Constante que define el orden y visibilidad de los sujetos en la tabla.
 * Cada objeto dentro del arreglo representa un sujeto con su nombre, orden de aparición y si es visible o no.
 */
export const TABLA_ORDEN = [
  { nombre: 'Fabricante', orden: 2, esVisible: true },
  { nombre: 'Formulador', orden: 3, esVisible: true },
  { nombre: 'Proveedor', orden: 1, esVisible: true },
];

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
  paisOrigen: false,
  paisFabrica: false,
  paisElaboracion: true,
  paisProveedor: true,
  paisProcedencia: true,
};

export const TEXTO_DE_PELIGRO = '<strong>¡Error de registro!</strong> Faltan campos por capturar';

/**
 * Mensaje HTML que se muestra cuando hay un error de registro debido a campos faltantes por capturar.
 * 
 * @remarks
 * Este mensaje se utiliza para validar formularios y notificar al usuario que existen campos obligatorios sin completar.
 */
export const MENSAJE_DE_VALIDACION = '<div><b>¡Error de registro!</b> Faltan campos por capturar.</div>';

/**
 * Genera un mensaje HTML de confirmación para el registro exitoso de una solicitud.
 * 
 * @param numeroSolicitud - El número temporal asignado a la solicitud registrada
 * @returns Una cadena HTML con el mensaje de confirmación que incluye el número temporal
 *          y las aclaraciones legales correspondientes
 * 
 * @example
 * ```typescript
 * const mensaje = MSG_REGISTRO_EXITOSO("SOL-2024-001");
 * // Retorna un párrafo HTML centrado con el mensaje de confirmación
 * ```
 */
export const MSG_REGISTRO_EXITOSO = (numeroSolicitud: string): string =>
  `<p style="text-align: center;">
    La solicitud ha quedado registrada con el número temporal ${numeroSolicitud ?? ''}. 
    Este no tiene válidez legal y sirve solamente para efectos de identificar tu solicitud. 
    Un folio oficial le será asignado al momento en que ésta sea firmada.
  </p>`;