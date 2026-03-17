import { CatalogosSelect } from '@libs/shared/data-access-user/src';
import { InputFecha } from '@libs/shared/data-access-user/src';

/**
 * Configuración del campo de fecha para la destrucción de mercancía.
 * Este objeto es utilizado para renderizar un componente de entrada de fecha.
 */
export const FECHA_DESTRUCCION_MERCANCIA: InputFecha = {
  /**
   * Etiqueta del campo de fecha de fin de vigencia.
   */
  labelNombre: 'Fecha en la que se llevará a cabo la destrucción de la mercancía',

  /**
   * Indica si el campo es obligatorio.
   */
  required: true,

  /**
   * Indica si el campo está habilitado.
   */
  habilitado: true,
};


/**
 * Catálogo base para el campo "Entidad federativa".
 */
export const ENTIDAD_FEDERATIVA: CatalogosSelect = {
  /**
   * Etiqueta que se muestra en el formulario.
   */
  labelNombre: 'Entidad federativa',

  /**
   * Indica si este campo es obligatorio.
   */
  required: true,

  /**
   * Texto de la primera opción del select.
   */
  primerOpcion: 'Seleccione un valor',

  /**
   * Arreglo donde se cargará el listado de entidades federativas.
   */
  catalogos: [],
};

/**
 * Catálogo base para el campo "Municipio / Alcaldía".
 */
export const MUNICIPIO_ALCALDIA: CatalogosSelect = {
  /**
   * Etiqueta que se muestra en el formulario.
   */
  labelNombre: 'Municipio/ Alcaldía',

  /**
   * Indica si este campo es obligatorio.
   */
  required: true,

  /**
   * Texto de la primera opción del select.
   */
  primerOpcion: 'Seleccione un valor',

  /**
   * Arreglo donde se cargará el listado de municipios o alcaldías.
   */
  catalogos: [],
};

/**
 * Catálogo base para el campo "Colonia".
 */
export const COLONIA: CatalogosSelect = {
  /**
   * Etiqueta que se muestra en el formulario.
   */
  labelNombre: 'Colonia',

  /**
   * Indica si este campo es obligatorio.
   */
  required: true,

  /**
   * Texto de la primera opción que aparece en el select.
   */
  primerOpcion: 'Seleccione un valor',

  /**
   * Arreglo de objetos tipo Catalogo donde se cargará el listado de colonias.
   */
  catalogos: [],
};
