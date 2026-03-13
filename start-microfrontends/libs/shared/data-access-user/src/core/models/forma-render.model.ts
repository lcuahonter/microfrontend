import { Catalogo } from './shared/catalogos.model';

/**
 * Configuración de un input para el renderizado de formularios.
 */
export interface InputConfig {
  /** Título de la sección o grupo de campos */
  title: string,
  /** Nombre del FormGroup asociado */
  formGroupName: string,
  /** Lista de configuraciones de los campos del menú */
  menu: MenuConfig[],
}
  
/**
 * Configuración de un campo individual dentro del menú del formulario.
 */
export interface MenuConfig {
  /** Tipo de input (texto, select, radio, etc.) */
  inputType: string,
  /** Propiedades específicas del campo */
  props: Props,
  /** Clases CSS para el campo */
  class: string,
  /** Condición de visibilidad opcional */
  visibility?: string,
  /** Configuración de opciones de radio opcional */
  radioConfig?: string[],
  /** Valor inicial opcional */
  value?: string | number,
}
  
/**
 * Representa un paso dentro de un wizard de pasos.
 */
export interface ListaPasosWizard {
  /** Índice del paso */
  indice: number;
  /** Título del paso */
  titulo: string;
  /** Indica si el paso está activo */
  activo: boolean;
  /** Indica si el paso está completado */
  completado: boolean;
}

/**
 * Propiedades para un campo de texto en el formulario.
 */
export interface FormaTextProp {
  /** Etiqueta a mostrar */
  labelNombre: string;
  /** Nombre del campo */
  campo: string;
  /** Clases CSS opcionales */
  class?: string,
  /** Tipo de input (text, number, etc.) */
  tipo_input?: string,
  /** Indica si el campo está deshabilitado */
  disabled: boolean,
  /** Validadores aplicados al campo */
  validators?: string[],
  /** Texto de ayuda o ejemplo */
  placeholder?: string,
  /** Opciones disponibles para radio (si aplica) */
  availableRadioOptions?: (string | number)[]
}

/**
 * Propiedades para un campo select con catálogo.
 */
export interface CatalogoSelectProp {
  /** Etiqueta a mostrar */
  labelNombre: string;
  /** Nombre del campo */
  campo: string;
  /** Indica si el campo es requerido */
  required: true,
  /** Lista de opciones del catálogo */
  catalogos: Catalogo[];
  /** Texto de la primera opción */
  primerOpcion: string,
}

/**
 * Propiedades para un campo tipo radio.
 */
export interface RadioProps {
  /** Etiqueta a mostrar */
  labelNombre: string;
  /** Nombre del campo */
  campo: string;
  /** Opciones de radio disponibles */
  radioOptions: LabelValueDatos[];
  /** Valor seleccionado */
  radioSelectedValue: string | number;
  /** Nombre del archivo JSON de datos (si aplica) */
  jsonDataFileName: string;
}

/**
 * Propiedades para un campo de fecha.
 */
export interface FetchaProps {
  /** Etiqueta a mostrar */
  labelNombre: string;
  /** Nombre del campo */
  campo: string;
  /** Indica si el campo está habilitado */
  habilitado: boolean
}

/**
 * Estructura para opciones de tipo label-valor.
 */
export interface LabelValueDatos {
  /** Etiqueta a mostrar */
  label: string,
  /** Valor asociado */
  value: string | number
}

/**
 * Propiedades generales para un campo del formulario.
 * Puede combinar propiedades de texto, select, radio y fecha.
 */
export interface Props extends FormaTextProp, CatalogoSelectProp, RadioProps, FetchaProps {
  /** Etiqueta a mostrar */
  labelNombre: string;
  /** Nombre del campo */
  campo: string;
  /** Nombre de la función de almacenamiento asociada (opcional) */
  storeFunction?: string;
   /** Longitud máxima permitida para el campo (opcional) */
  maxlength?: number;
}
