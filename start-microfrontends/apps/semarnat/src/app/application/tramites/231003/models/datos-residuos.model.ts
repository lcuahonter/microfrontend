import { ConfiguracionColumna } from "@libs/shared/data-access-user/src";
import { ResiduoPeligroso } from "../../231002/models/aviso-catalogo.model";

/**
 * Representa el estado de un formulario relacionado con residuos.
 */
export interface EstadoFormularioResiduo {
  /**
   * Datos del formulario relacionados con la materia prima.
   */
  formularioDatos: {
    /**
     * Número de identificación del registro de materia prima.
     *
     * @type {string}
     */
    numero: string;

    /**
     * Nombre de la materia prima.
     *
     * @type {string}
     */
    nombreMateriaPrima: string;

    /**
     * Cantidad numérica de materia prima.
     *
     * @type {string}
     */
    cantidad: string;

    /**
     * Cantidad escrita con letra.
     *
     * @type {string}
     */
    cantidadLetra: string;

    /**
     * Unidad de medida utilizada.
     *
     * @type {string}
     */
    unidadDeMedida: string;

    /**
     * Fracción arancelaria correspondiente a la materia prima.
     *
     * @type {string}
     */
    fraccionArancelaria: string;
  };

  /**
   * Datos del formulario relacionados con el residuo generado.
   */
  formularioResiduo: {
    /**
     * Fracción arancelaria correspondiente al residuo.
     *
     * @type {string}
     */
    fraccionArancelaria: string;

    fraccionDesc: string;

    /**
     * Número de Identificación Comercial (NICO).
     *
     * @type {string}
     */
    nico: string;

    nicoDesc: string;

    /**
     * Acotación específica del residuo.
     *
     * @type {string}
     */
    acotacion: string;

    /**
     * Indica si el residuo es peligroso.
     *
     * @type {string}
     */
    residuoPeligroso: string;

    /**
     * Cantidad numérica del residuo.
     *
     * @type {string}
     */
    cantidad: string;

    /**
     * Cantidad escrita con letra.
     *
     * @type {string}
     */
    cantidadLetra: string;

    /**
     * Unidad de medida del residuo.
     *
     * @type {string}
     */
    unidadMedida: string;

    unidadMedidaDesc: string;

    /**
     * Clasificación del residuo.
     *
     * @type {string}
     */
    clasificacion: string;

    clasificacionDesc: string;

    /**
     * Clave identificadora del residuo.
     *
     * @type {string}
     */
    claveResiduo: string;

    claveResiduoDesc: string;

    /**
     * Nombre del residuo.
     *
     * @type {string}
     */
    nombre: string;

    /**
     * Descripción detallada del residuo.
     *
     * @type {string}
     */
    descripcion: string;

    /**
     * Evaluación CRETI del residuo (Corrosivo, Reactivo, Explosivo, Tóxico, Inflamable).
     *
     * @type {string}
     */
    creti: string;

    cretiDesc: string;

    /**
     * Estado físico del residuo (sólido, líquido, etc.).
     *
     * @type {string}
     */
    estadoFisico: string;

    estadoFisicoDesc: string;

    otroEstadoFisicoDesc: string;

    /**
     * Manifiesto asociado al residuo.
     *
     * @type {string}
     */
    manifiesto: string;

    /**
     * Tipo de contenedor usado para el residuo.
     *
     * @type {string}
     */
    tipoContenedor: string;

    tipoContenedorDesc: string;

    otroTipoContenedorDesc: string;

    /**
     * Capacidad del contenedor.
     *
     * @type {string}
     */
    capacidad: string;
  };

  residuos: ResiduoPeligroso[];
}

export const CONFIG_TABLA_RESIDUOS: ConfiguracionColumna<ResiduoPeligroso>[] = [
  {
    encabezado: 'Orígen del residuo',
    clave: (item: ResiduoPeligroso): string => item.origenResiduoGeneracion,
    orden: 1,
  },
  {
    encabezado: 'Fracción Arancelaria',
    clave: (item: ResiduoPeligroso): string => item.fraccionCve,
    orden: 2,
  },
  {
    encabezado: 'NICO',
    clave: (item: ResiduoPeligroso): string => item.nicoDesc,
    orden: 3,
  },
  {
    encabezado: 'Acotación',
    clave: (item: ResiduoPeligroso): string => item.acotacion,
    orden: 4,
  },
  {
    encabezado: 'Nombre Residuo Peligroso',
    clave: (item: ResiduoPeligroso): string => item.nombreResiduo,
    orden: 5,
  },
  {
    encabezado: 'Cantidad',
    clave: (item: ResiduoPeligroso): string => item.cantidad,
    orden: 6,
  },
  {
    encabezado: 'Cantidad letra',
    clave: (item: ResiduoPeligroso): string => item.cantidadLetra,
    orden: 7,
  },
  {
    encabezado: 'Unidad de medida',
    clave: (item: ResiduoPeligroso): string => item.unidadMedidaDesc,
    orden: 8,
  },
  {
    encabezado: 'Clave Clasificación',
    clave: (item: ResiduoPeligroso): string => item.residuoCve,
    orden: 9,
  },
  {
    encabezado: 'Nombre Clasificación',
    clave: (item: ResiduoPeligroso): string => item.residuoNombreDesc,
    orden: 10,
  },
  {
    encabezado: 'Descripción clasificación',
    clave: (item: ResiduoPeligroso): string => item.residuoDescDesc,
    orden: 11,
  },
  {
    encabezado: 'Descripción otro Clasificación',
    clave: (item: ResiduoPeligroso): string => item.residuoOtro,
    orden: 12,
  },
  {
    encabezado: 'CRETI',
    clave: (item: ResiduoPeligroso): string => item.cretiDesc,
    orden: 13,
  },
  {
    encabezado: 'Estado físico',
    clave: (item: ResiduoPeligroso): string => item.estadoFisicoDesc,
    orden: 14,
  },
  {
    encabezado: 'Descripción otro estado físico',
    clave: (item: ResiduoPeligroso): string => item.estadoFisicoOtro,
    orden: 15,
  },
  {
    encabezado: 'No. de manifiesto',
    clave: (item: ResiduoPeligroso): string => item.numeroManifiesto,
    orden: 16,
  },
  {
    encabezado: 'Tipo de contenedor',
    clave: (item: ResiduoPeligroso): string => item.tipoContenedorDesc,
    orden: 17,
  },
  {
    encabezado: 'Descripción otro contenedor',
    clave: (item: ResiduoPeligroso): string => item.tipoContenedorOtro,
    orden: 18,
  },
  {
    encabezado: 'Capacidad',
    clave: (item: ResiduoPeligroso): string => item.capacidad,
    orden: 19,
  },
];
