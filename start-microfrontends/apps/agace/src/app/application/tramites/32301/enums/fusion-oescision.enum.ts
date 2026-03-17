/**
 * Definición de una opción de correlación de fracción con un valor inicial.
 * Se utiliza para la selección dentro de un formulario o sistema.
 */
export const CVE_FRACCION_CORRELACION_MOD_OPTION = [
  {
      /**
       * ID de la opción de correlación de fracción.
       * Se establece en -1 como valor inicial.
       */
      "id": -1,

      /**
       * Descripción que se muestra en el formulario o sistema.
       */
      "descripcion": "Selecciona un valor"
  }
];

/**
 * Enum que define las opciones de fusión o escisión disponibles.
 * Cada opción tiene una etiqueta descriptiva y un valor asociado.
 */
export const FUSION_O_ESCISION_OPTIONS = [
    {
      "label": "Aviso de fusión o escisión de empresas que cuenten con el Registro en el Esquema de Certificación de Empresas, cuando resulte una nueva sociedad o extinguiéndose una o más empresas con Registro.",
      "value": "fusion1"
    },
    {
      "label": "Aviso de fusión de una empresa que se encuentre registrada en el Esquema de Certificación de Empresas con una o más empresas que no cuenten con el Registro en el Esquema de Certificación de Empresas y subsista la que cuenta con dicho Registro. ",
      "value": "fusion2"
    }
   
  ]
/**
* Opciones de radio para indicar si la operación es una fusión o una escisión.
*/
export const FUSIONRADIO_OPTIONS = [
  {
      /**
       * Opción para indicar que la operación es una fusión.
       */
      "label": "Fusión",
      "value": "1"
  },
  {
      /**
       * Opción para indicar que la operación es una escisión.
       */
      "label": "Escisión",
      "value": "0"
  }
];

/**
* Opciones de radio para indicar si la operación es una fusión o una escisión.
*/
export const FUSIONRADIO_OPTIONS_ONLY = [
  {
      /**
       * Opción para indicar que la operación es una fusión.
       */
      "label": "Fusión",
      "value": "1"
  },
];

/**
* Opciones para seleccionar si hay una cantidad de bienes determinada.
*/
export const CANTIDAD_BIENES_OPTION = [
  {
      /**
       * Opción para indicar que sí hay una cantidad determinada de bienes.
       */
      "label": "Sí",
      "value": "1"
  },
  {
      /**
       * Opción para indicar que no hay una cantidad determinada de bienes.
       */
      "label": "No",
      "value": "0"
  }
];

/**
* Declaración oficial relacionada con la importación de mercancías,
* asegurando que el aviso se presenta con la anticipación requerida.
*/
export const ALOTO_FRACCIONES: string = 
  "Declaro bajo protesta a decir verdad que este aviso se presenta al menos 30 días previos a aquel en el que se pretende efectuar la primera importación de las mercancías informadas.";

  /**
   * Representa la configuración para el campo "Fecha de Ingreso".
   *
   * @property {string} labelNombre - Etiqueta que se muestra para el campo.
   * @property {boolean} required - Indica si el campo es obligatorio.
   * @property {boolean} habilitado - Indica si el campo está habilitado.
   */
  export const FECHA_INGRESO = {
  labelNombre: '',
  required: true,
  habilitado: true,
};

/**
 * Interfaz que define la estructura de un encabezado de escisión.
 * Utilizada para representar los datos de una empresa en un registro de escisión.
 */
export interface EscisionHeaderItem {
  /**
   * Identificador único del registro.
   */
  id?: number;

  /**
   * Registro Federal de Contribuyentes (RFC) de la empresa.
   */
  rfc: string;

  /**
   * Denominación o Razón Social de la empresa.
   */
  razon_social: string;

  /**
   * Folio VUCEM de la última certificación o renovación.
   */
  num_folio_tramite: string;

  /**
   * Fecha de inicio de vigencia de la última certificación o renovación.
   */
  fecha_inicio_vigencia: string;

  /**
   * Fecha de fin de vigencia de la última certificación o renovación.
   */
  fecha_fin_vigencia: string;
  /**
   * Descripción adicional o Clob genérica.
   */
  descripcionClobGenerica2?: string;
}
/**
 * Configuración de la tabla para mostrar los encabezados de escisión.
 * Cada objeto en el array representa una columna con su encabezado, clave para acceder a los datos y orden de visualización.
 */
export const CONFIGURATION_TABLA_GRID_FUSION_ESCISION = [
  {
    encabezado: 'Registro Federal de Contribuyentes',
    clave: (item: EscisionHeaderItem): string => item.rfc,
    orden: 1
  },
  {
    encabezado: 'Denominación o Razón Social',
    clave: (item: EscisionHeaderItem): string => item.razon_social,
    orden: 2
  },
  {
    encabezado: 'Folio VUCEM de la última certificación/renovación',
    clave: (item: EscisionHeaderItem): string => item.num_folio_tramite,
    orden: 3
  },
  {
    encabezado: 'Fecha de inicio de vigencia de la última certificación/renovación',
    clave: (item: EscisionHeaderItem): string => item.fecha_inicio_vigencia,
    orden: 4
  },
  {
    encabezado: 'Fecha de fin de vigencia de la última certificación/renovación',
    clave: (item: EscisionHeaderItem): string => item.fecha_fin_vigencia,
    orden: 5
  }
]
