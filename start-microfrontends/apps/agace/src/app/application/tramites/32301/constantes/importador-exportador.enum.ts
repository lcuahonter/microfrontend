/**
 * Objeto de selección que contiene constantes para distintas acciones de selección.
 */
export const SELECCION = {
  /**
   * Representa una acción para seleccionar todos los elementos disponibles.
   */
  SELECT_ALL: 'selectAll',
};

  

/**
 * Mensaje de aviso para la adjunción del listado de fracciones arancelarias
 * dentro de la descripción de actividades relacionadas con procesos productivos
 * o presentación de servicios, tal como se indica en la solicitud de inscripción.
 */
export const MESSAGE_FRACCION = 'Deberás adjuntar el listado de fracciones arancelarias señaladas en la descripción de las actividades relacionadas con los procesos productivos o presentación de servicios, exhibido en tu solicitud de inscripción.';

/**
 * Mensaje que indica que se debe incluir un escrito libre en el apartado correspondiente si se modifican
 * las partes contratantes en la documentación con la que se acreditó el legal uso y goce del domicilio.
 * Este mensaje se utiliza para informar al usuario sobre la necesidad de adjuntar un documento adicional.
 */
export interface FraccionGridItem {
  cve_fraccion_declarada: string;
  actividad_proceso: string;
  cve_fraccion_correlacion: string;
  descripcion_mercancia: string;
  nico: string;
  descripcion_nico: string;
  cve_unidad_medida: string;
  cve_paises_origen: string;
  id?: number;
}

/**
 * Configuración de las columnas para la tabla de fracciones arancelarias.
 * Cada objeto en el array representa una columna con su encabezado, clave para acceder a los datos y orden de visualización.
 */
export const CONFIGURATION_TABLA_GRID_FRACCIONES_HEADER = [
  {
    encabezado: 'Fracción declarada',
    clave: (item: FraccionGridItem): string => item.cve_fraccion_declarada,
    orden: 1
  },
  {
    encabezado: 'Actividad relacionada',
    clave: (item: FraccionGridItem): string => item.actividad_proceso,
    orden: 2
  },
  {
    encabezado: 'Correlación fracción actual',
    clave: (item: FraccionGridItem): string => item.cve_fraccion_correlacion,
    orden: 3
  },
  {
    encabezado: 'Descripción fracción actual',
    clave: (item: FraccionGridItem): string => item.descripcion_mercancia,
    orden: 4
  },
  {
    encabezado: 'NICO',
    clave: (item: FraccionGridItem): string => item.nico,
    orden: 5
  },
  {
    encabezado: 'Descripción del NICO',
    clave: (item: FraccionGridItem): string => item.descripcion_nico,
    orden: 6
  },
  {
    encabezado: 'UMT',
    clave: (item: FraccionGridItem): string => item.cve_unidad_medida,
    orden: 7
  },
  {
    encabezado: 'País de origen',
    clave: (item: FraccionGridItem): string => item.cve_paises_origen,
    orden: 8
  }
];


/**
 * Lista de pasos para el proceso, con información sobre su estado actual.
 * Cada paso tiene un índice, un título, y valores que indican si está activo o completado.
 */
export const PASOS = [
  {
      /**
       * Índice del primer paso dentro del proceso.
       */
      indice: 1,

      /**
       * Título del primer paso: Capturar solicitud.
       */
      titulo: 'Capturar solicitud',

      /**
       * Indica que el primer paso está activo.
       */
      activo: true,

      /**
       * Indica que el primer paso ya ha sido completado.
       */
      completado: true,
  },
  {
      /**
       * Índice del segundo paso dentro del proceso.
       */
      indice: 2,

      /**
       * Título del segundo paso: Anexar requisitos.
       */
      titulo: 'Anexar requisitos',

      /**
       * Indica que el segundo paso aún no está activo.
       */
      activo: false,

      /**
       * Indica que el segundo paso aún no ha sido completado.
       */
      completado: false,
  },
  {
      /**
       * Índice del tercer paso dentro del proceso.
       */
      indice: 3,

      /**
       * Título del tercer paso: Firmar solicitud.
       */
      titulo: 'Firmar solicitud',

      /**
       * Indica que el tercer paso aún no está activo.
       */
      activo: false,

      /**
       * Indica que el tercer paso aún no ha sido completado.
       */
      completado: false,
  },
];