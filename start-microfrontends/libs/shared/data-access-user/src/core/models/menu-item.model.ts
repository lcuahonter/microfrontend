/**
 * Interfaz que define la estructura de un elemento de menú.
 * Permite crear menús jerárquicos con submenús, rutas de navegación,
 * iconos y opciones de habilitación/deshabilitación.
 */
export interface MenuItem {
  /** label: Texto visible del elemento de menú. */
  label: string;
  /** path: (Opcional) Ruta de navegación asociada al elemento. */
  path?: string;
  /** expanded: (Opcional) Indica si el submenú está expandido. */
  expanded?: boolean;
  /** icon: (Opcional) Nombre del icono a mostrar junto al elemento. */
  icon?: string;
  /** disabled: (Opcional) Si es true, el elemento aparece deshabilitado. */
  disabled?: boolean;
  /** children: (Opcional) Lista de subelementos de menú (submenús). */
  children?: MenuItem[];
}