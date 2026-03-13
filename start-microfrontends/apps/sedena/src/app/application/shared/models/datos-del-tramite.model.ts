import { ConfiguracionColumna } from '@ng-mf/data-access-user';
/**
 * Interfaz que representa el estado del formulario de datos del trámite.
 *
 * @property {string} permisoGeneral - Permiso general seleccionado por el usuario.
 * @property {string} usoFinal - Uso final declarado en el formulario.
 * @property {string[]} aduanasSeleccionadas - Lista de aduanas seleccionadas.
 * @property {string} paisDestino - País de destino de la mercancía.
 */
export interface DatosDelTramiteFormState {
  permisoGeneral: string;
  usoFinal: string;
  aduanasSeleccionadas: string[];
  paisDestino: string;
  anoEnCurso?: boolean;
  dosSemestre?: string;
  unoSemestre?: string;
  informacionConfidencial?: boolean;
  fechaPago?: string;
  fechaSalida?: string;
}

/**
 * Interfaz que representa el estado del formulario de justificación del trámite.
 *
 * @property {string} justificacion - Justificación proporcionada por el usuario para el trámite.
 */
export interface JustificacionTramiteFormState {
  justificacion: string;
}

/**
 * Interfaz que representa los datos capturados para una mercancía.
 *
 * @property {string} fraccionArancelaria - Clave de la fracción arancelaria.
 * @property {string} descripcionFraccion - Descripción de la fracción arancelaria.
 * @property {string} unidadMedidaTarifa - Unidad de medida de tarifa (UMT).
 * @property {string} umc - Unidad de medida comercial.
 * @property {number} cantidadUMT - Cantidad en unidad de medida de tarifa.
 * @property {number} valorComercial - Valor comercial total de la mercancía.
 * @property {string} tipoMoneda - Tipo de moneda utilizada.
 * @property {string} descripcion - Descripción general del producto.
 * @property {string} paisOrigen - País de origen de la mercancía.
 */
export interface MercanciaDetalle {
  fraccionArancelaria: string;
  descripcionFraccion: string;
  unidadMedidaTarifa: string;
  umc?: string;
  cve_umc?: string;
  cantidadUMT: number;
  cve_umt?: string;
  tipoMoneda: string;
  tipo_moneda: string;
  valorComercial: number;
  descripcion: string;
  paisOrigen?: string;
  cve_paisOrigen?: string;
  tableIndex?: number;
  id?:number;
}

/**
 * Constante que define la configuración de columnas para la tabla dinámica de mercancías.
 *
 * @constant
 * @type {ConfiguracionColumna<MercanciaDetalle>[]}
 */
export const MERCANCIA_ENCABEZADO_DE_TABLA: ConfiguracionColumna<MercanciaDetalle>[] =
  [
    {
      encabezado: 'Fracción arancelaria',
      clave: (fila) => fila.fraccionArancelaria,
      orden: 1,
    },
    {
      encabezado: 'Descripción de la fracción',
      clave: (fila) => fila.descripcionFraccion,
      orden: 2,
    },
    {
      encabezado: 'Unidad de medida de tarifa (UMT)',
      clave: (fila) => fila.unidadMedidaTarifa,
      orden: 3,
    },
    {
      encabezado: 'UMC',
      clave: (fila) => fila.umc,
      orden: 4,
    },
    {
      encabezado: 'Cantidad en UMT',
      clave: (fila) => fila.cantidadUMT,
      orden: 5,
    },
    {
      encabezado: 'Valor comercial',
      clave: (fila) => fila.valorComercial,
      orden: 6,
    },
    {
      encabezado: 'Tipo moneda',
      clave: (fila) => fila.tipoMoneda,
      orden: 7,
    },
    {
      encabezado: 'Descripción',
      clave: (fila) => fila.descripcion,
      orden: 8,
    },
    {
      encabezado: 'País de origen',
      clave: (fila) => fila.paisOrigen,
      orden: 9,
    },
  ];

  /**
 * Declaración de manifiestos para cumplir con normatividad.
 */
export const MANIFIESTOS_DECLARACION = {
  MANIFIESTOS:
    'Manifiesto bajo protesta de decir verdad, que los materiales o artículos motivo de importación o exportación, no serán destinados o utilizados para la fabricación, elaboración, ensamble, reparación o acondicionamiento de armas, municiones, explosivos, artificios para voladuras o demoliciones y/o artificios pirotécnicos',
};

/**
 * Constante que define la configuración para el campo de Fecha única de pago.
 *
 * @constant
 * @property {string} labelNombre - Etiqueta del campo mostrada al usuario.
 * @property {boolean} required - Indica si el campo es obligatorio.
 * @property {boolean} habilitado - Indica si el campo está habilitado para edición.
 */
export const FECHA_DE_PAGO = {
  labelNombre: 'Fecha única de entrada',
  required: true,
  habilitado: true,
};

/**
 * Constante que define la configuración para el campo de Fecha única de salida de la mercancía.
 *
 * @constant
 * @property {string} labelNombre - Etiqueta del campo mostrada al usuario.
 * @property {boolean} required - Indica si el campo es obligatorio.
 * @property {boolean} habilitado - Indica si el campo está habilitado para edición.
 */
export const FECHA_DE_SALIDA = {
  labelNombre: 'Fecha única de salida de la mercancía',
  required: true,
  habilitado: true,
};
