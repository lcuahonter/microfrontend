/**
 * Mensaje de alerta relacionado con la mercancía.
 */
export const MENSAJE_DE_ALERTA_MERCANCIA: string =
  'De no existir marca anotar "sin marca". En su caso el sistema de marca con las especificaciones correspondientes';

/**
 * Etiquetas para los movimientos disponibles y seleccionados en la interfaz.
 * 
 * @tituluDeLaIzquierda Título para los movimientos disponibles.
 * @derecha Título para los movimientos seleccionados.
 * 
 * 
 */
export const MOVIMIENTO_CROSSLIST_LABEL = {
  tituluDeLaIzquierda: 'Movimientos disponibles:',
  derecha: 'Movimientos seleccionados*:',
};

/**
 * Etiquetas para las aduanas disponibles y seleccionadas en la interfaz.
 * 
 * @tituluDeLaIzquierda Título para las aduanas disponibles.
 * @derecha Título para las aduanas seleccionadas.
 */
export const AQUANDAS_CROSSLIST_LABEL = {
  tituluDeLaIzquierda: 'Aduanas disponibles:',
  derecha: 'Aduanas seleccionadas*:',
};

/**
 * Configuración para el campo de fecha.
 * 
 * @labelNombre  Etiqueta para el nombre del campo de fecha.
 * @required Indica si el campo de fecha es obligatorio.
 * @habilitado Indica si el campo de fecha está habilitado.
 */
export const FECHA = {
  labelNombre: 'Fecha de pago',
  required: true,
  habilitado: true,
};

/**
 * Configuración para el modal.
 */
export const MODAL_CONFIG = {
  animated: true,
  keyboard: false,
  backdrop: true,
  ignoreBackdropClick: true,
  class: 'modal-xl'
};