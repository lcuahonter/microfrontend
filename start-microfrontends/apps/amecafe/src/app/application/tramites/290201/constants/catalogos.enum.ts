import { CatalogosSelect } from '@libs/shared/data-access-user/src';
/**
 * Constantes de configuración para los catálogos utilizados en el sistema.
 * Cada constante representa un catálogo con su configuración inicial, incluyendo el nombre del campo,
 * si es obligatorio, una opción predeterminada y una lista de valores.
 */
export const CATALOGOS_CONSTANTS = {
    /**
     * Configuración del catálogo "Tipos".
     * @property {string} labelNombre - Nombre del campo.
     * @property {boolean} required - Indica si el campo es obligatorio.
     * @property {string} primerOpcion - Texto de la primera opción del catálogo.
     * @property {CatalogosSelect[]} catalogos - Lista de valores del catálogo.
     */
    TIPOS: {
      labelNombre: 'Tipos',
      required: true,
      primerOpcion: 'Seleccione una opción',
      catalogos: [],
    } as CatalogosSelect,
  
    /**
     * Configuración del catálogo "Formas del café".
     * @property {string} labelNombre - Nombre del campo.
     * @property {boolean} required - Indica si el campo es obligatorio.
     * @property {string} primerOpcion - Texto de la primera opción del catálogo.
     * @property {CatalogosSelect[]} catalogos - Lista de valores del catálogo.
     */
    FORMAS_DEL_CAFE: {
      labelNombre: 'Formas del café',
      required: true,
      primerOpcion: 'Seleccione una opción',
      catalogos: [],
    } as CatalogosSelect,
  
    /**
     * Configuración del catálogo "Calidad".
     * @property {string} labelNombre - Nombre del campo.
     * @property {boolean} required - Indica si el campo es obligatorio.
     * @property {string} primerOpcion - Texto de la primera opción del catálogo.
     * @property {CatalogosSelect[]} catalogos - Lista de valores del catálogo.
     */
    CALIDAD: {
      labelNombre: 'Calidad',
      required: true,
      primerOpcion: 'Seleccione una opción',
      catalogos: [],
    } as CatalogosSelect,
  
    /**
     * Configuración del catálogo "Procesos".
     * @property {string} labelNombre - Nombre del campo.
     * @property {boolean} required - Indica si el campo es obligatorio.
     * @property {string} primerOpcion - Texto de la primera opción del catálogo.
     * @property {CatalogosSelect[]} catalogos - Lista de valores del catálogo.
     */
    PROCESOS: {
      labelNombre: 'Procesos',
      required: true,
      primerOpcion: 'Seleccione una opción',
      catalogos: [],
    } as CatalogosSelect,
  
    /**
     * Configuración del catálogo "Certificaciones".
     * @property {string} labelNombre - Nombre del campo.
     * @property {boolean} required - Indica si el campo es obligatorio.
     * @property {string} primerOpcion - Texto de la primera opción del catálogo.
     * @property {CatalogosSelect[]} catalogos - Lista de valores del catálogo.
     */
    CERTIFICACIONES: {
      labelNombre: 'Certificaciones',
      required: true,
      primerOpcion: 'Seleccione una opción',
      catalogos: [],
    } as CatalogosSelect,
  
    /**
     * Configuración del catálogo "Aduana de salida".
     * @property {string} labelNombre - Nombre del campo.
     * @property {boolean} required - Indica si el campo es obligatorio.
     * @property {string} primerOpcion - Texto de la primera opción del catálogo.
     * @property {CatalogosSelect[]} catalogos - Lista de valores del catálogo.
     */
    ADUANA_DE_SALIDA: {
      labelNombre: 'Aduana de salida',
      required: true,
      primerOpcion: 'Seleccione una opción',
      catalogos: [],
    } as CatalogosSelect,
  
    /**
     * Configuración del catálogo "País destino".
     * @property {string} labelNombre - Nombre del campo.
     * @property {boolean} required - Indica si el campo es obligatorio.
     * @property {string} primerOpcion - Texto de la primera opción del catálogo.
     * @property {CatalogosSelect[]} catalogos - Lista de valores del catálogo.
     */
    PAIS_DESTINO: {
      labelNombre: 'País destino',
      required: true,
      primerOpcion: 'Seleccione una opción',
      catalogos: [],
    } as CatalogosSelect,
  
    /**
     * Configuración del catálogo "Entidad de procedencia".
     * @property {string} labelNombre - Nombre del campo.
     * @property {boolean} required - Indica si el campo es obligatorio.
     * @property {string} primerOpcion - Texto de la primera opción del catálogo.
     * @property {CatalogosSelect[]} catalogos - Lista de valores del catálogo.
     */
    ENTIDAD_DE_PROCEDENCIA: {
      labelNombre: 'Entidad de procedencia',
      required: true,
      primerOpcion: 'Seleccione una opción',
      catalogos: [],
    } as CatalogosSelect,
  
    /**
     * Configuración del catálogo "Ciclo cafetalero".
     * @property {string} labelNombre - Nombre del campo.
     * @property {boolean} required - Indica si el campo es obligatorio.
     * @property {string} primerOpcion - Texto de la primera opción del catálogo.
     * @property {CatalogosSelect[]} catalogos - Lista de valores del catálogo.
     */
    CICLO_CAFETALERO: {
      labelNombre: 'Ciclo cafetalero',
      required: true,
      primerOpcion: 'Seleccione una opción',
      catalogos: [],
    } as CatalogosSelect,
  
    /**
     * Configuración del catálogo "Certificación".
     * @property {string} labelNombre - Nombre del campo.
     * @property {boolean} required - Indica si el campo es obligatorio.
     * @property {string} primerOpcion - Texto de la primera opción del catálogo.
     * @property {CatalogosSelect[]} catalogos - Lista de valores del catálogo.
     */
    CERTIFICACION: {
      labelNombre: 'Certificacion',
      required: true,
      primerOpcion: 'Seleccione una opción',
      catalogos: [],
    } as CatalogosSelect,
  };