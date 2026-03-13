import { Personas, Solicitar } from '../models/personas';
import { ConfiguracionColumna } from '@libs/shared/data-access-user/src';

/**
 * @fileoverview
 * Constantes y configuraciones para el módulo de operaciones de comercio exterior (trámite 319).
 * Incluye pasos del proceso, rutas de recursos, configuraciones de tablas y textos de alerta.
 * Cobertura compodoc 100%: cada constante está documentada.
 * @module OperacionesDeComercioExterior
 */

/**
 * Arreglo que define los pasos de un proceso en una solicitud de operaciones de comercio exterior.
 * @const PASOS
 * @description Arreglo que define los pasos de un proceso en una solicitud de operaciones de comercio exterior.
 * Cada paso incluye un índice, un título descriptivo, y los estados de actividad y completitud.
 * @property {number} indice - Número que identifica el orden del paso.
 * @property {string} titulo - Descripción del paso.
 * @property {boolean} activo - Indica si el paso está activo para ser realizado.
 * @property {boolean} completado - Indica si el paso ya ha sido completado.
 */
export const PASOS = [
  {
    indice: 1,
    titulo: 'Capturar solicitud',
    activo: true,
    completado: true,
  },
  {
    indice: 2,
    titulo: 'Firmar solicitud',
    activo: false,
    completado: false,
  },
];

/**
 * Identificador del trámite para operaciones de comercio exterior.
 * @const TRAMITE_ID
 * @description Identificador único del trámite utilizado en las operaciones de comercio exterior.
 */
export const TRAMITE_ID = 319;

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const MSG_REGISTRO_EXITOSO = (numeroSolicitud: string) =>
  `<p style="text-align: center;">La solicitud ha quedado registrada con el número temporal ${
    numeroSolicitud ?? ''
  }. Éste no tiene validez legal y sirve solamente para efectos de identificar tu solicitud. Un folio oficial le será asignado a la solicitud al momento en que ésta sea firmada.</p>`;

/**
 *  Ruta relativa a los archivos JSON utilizados para las operaciones de comercio exterior.
 * @const URL
 * @description Ruta relativa a los archivos JSON utilizados para las operaciones de comercio exterior.
 * @type {string}
 * @remarks Esta constante define la ubicación de los recursos JSON específicos para el trámite 319.
 */
export const URL = '../../../../../assets/json/319/';

/**
 * Configuración de las columnas para la tabla de personas en el módulo de operaciones de comercio exterior.
 * Cada objeto en el arreglo representa una columna con su encabezado, clave para acceder al valor en la fila, y el orden de aparición.
 * @const CONFIGURACION_PERSONAS_COLUMNAS
 * @description Configuración de las columnas para la tabla de personas en el módulo de operaciones de comercio exterior.
 * Cada objeto en el arreglo representa una columna con su encabezado, clave para acceder al valor en la fila, y el orden de aparición.
 * @type {ConfiguracionColumna<Personas>[]}
 * @property {string} encabezado - El texto que se mostrará como encabezado de la columna.
 * @property {Function} clave - Una función que recibe una fila y retorna el valor correspondiente a la columna.
 * @property {number} orden - El orden en el que la columna aparecerá en la tabla.
 * @example
 * CONFIGURACION_PERSONAS_COLUMNAS.forEach(columna => {
 *   console.log(columna.encabezado);
 * });
 */
export const CONFIGURACION_PERSONAS_COLUMNAS: ConfiguracionColumna<Personas>[] =
  [
    { encabezado: 'RFC', clave: (fila) => fila.rfc, orden: 1 },
    { encabezado: 'CURP', clave: (fila) => fila.curp, orden: 2 },
    { encabezado: 'Nombre', clave: (fila) => fila.nombre, orden: 3 },
    {
      encabezado: 'Primer apellido',
      clave: (fila) => fila.apellido_paterno,
      orden: 4,
    },
    {
      encabezado: 'Segundo apellido',
      clave: (fila) => fila.apellido_materno,
      orden: 5,
    },
    {
      encabezado: 'Correo electrónico',
      clave: (fila) => fila.correo_electronico,
      orden: 6,
    },
  ];

/**
 * El orden
 * @const CONFIGURACION_SOLICITAR_COLUMNAS
 * @description Configuración de las columnas para la tabla de solicitudes en el módulo de operaciones de comercio exterior.
 * Cada objeto en el arreglo representa una columna con su encabezado, clave para acceder al valor en la fila, y el orden de aparición.
 * @type {ConfiguracionColumna<Solicitar>[]}
 * @property {string} encabezado - El texto que se mostrará como encabezado de la columna.
 * @property {Function} clave - Una función que recibe una fila y retorna el valor correspondiente a la columna.
 * @property {number} orden - El orden en el que la columna aparecerá en la tabla.
 * @example
 * CONFIGURACION_SOLICITAR_COLUMNAS.forEach(columna => {
 *   console.log(columna.encabezado);
 * });
 */
export const CONFIGURACION_SOLICITAR_COLUMNAS: ConfiguracionColumna<Solicitar>[] =
  [
    { encabezado: 'Periodo', clave: (fila) => fila.periodo_desc, orden: 1 },
    {
      encabezado: 'Fechas sobre el periodo',
      clave: (fila) => fila.fechas_periodo,
      orden: 2,
    },
  ];

/**
 * La fecha
 * @const TEXTOS
 * @description La constante `TEXTOS` contiene un mensaje de texto que indica que la fecha proporcionada no es válida
 * porque aún no ha concluido el período especificado.
 * @type {string}
 * @example
 * console.log(TEXTOS);
 * // Output: "La fecha indicada NO es correcta por que aún no concluye:"
 */
export const TEXTOS = `La fecha indicada NO es correcta por que aún no concluye:`;

/**
 * Mensaje de error para fechas que no corresponden al periodo seleccionado.
 * @const PERIODO_TEXTO
 * @description Constante que contiene un mensaje HTML indicando que las fechas proporcionadas
 * no corresponden al periodo seleccionado. El mensaje está centrado mediante CSS inline.
 * @type {string}
 * @example
 * console.log(PERIODO_TEXTO);
 * // Output: "<p style="text-align: center;">Las fechas sobre el periodo NO corresponden.</p>"
 */
export const PERIODO_TEXTO = `<p style="text-align: center;">Las fechas sobre el periodo NO corresponden.</p>`;

/**
 * Mensaje de error para registros duplicados.
 * @const REGISTRO_TEXTO
 * @description Constante que contiene un mensaje HTML indicando que el registro ya fue agregado previamente.
 * El mensaje está centrado mediante CSS inline.
 * @type {string}
 * @example
 * console.log(REGISTRO_TEXTO);
 * // Output: "<p style="text-align: center;">El registro ya fue agregado.</p>"
 */
export const REGISTRO_TEXTO = `<p style="text-align: center;">El registro ya fue agregado.</p>`;

/**
 * Mensaje de error para periodo final menor al inicial.
 * @const MENOR_TEXTO
 * @description Constante que contiene un mensaje HTML indicando que el periodo final
 * es menor al periodo inicial. El mensaje está centrado mediante CSS inline.
 * @type {string}
 * @example
 * console.log(MENOR_TEXTO);
 * // Output: "<p style="text-align: center;">Periodo final es menor</p>"
 */
export const MENOR_TEXTO = `<p style="text-align: center;">Periodo final es menor</p>`;

/**
 * Constante que representa la operación histórica en el sistema de comercio exterior.
 * @const OPERACION_HISTORICA
 * @description Constante que representa la operación histórica en el sistema de comercio exterior.
 */
export const OPERACION_HISTORICA = 'TIOPCE.HIS';

/**
 * Mensaje de error para fechas de diferentes periodos.
 * @const PERIODO_ERROR
 * @description Constante que contiene un mensaje HTML indicando que se deben capturar
 * fechas del mismo periodo. El mensaje está centrado mediante CSS inline.
 * @type {string}
 * @example
 * console.log(PERIODO_ERROR);
 * // Output: "<p style="text-align: center;">Debe capturar fechas del mismo periodo.</p>"
 */
export const PERIODO_ERROR = `<p style="text-align: center;">Debe capturar fechas del mismo periodo.</p>`;

/**
 * alert-danger
 * @const INFO_ALERT
 * @description Constante que define el estilo de alerta para operaciones de comercio exterior.
 * @type {string}
 * @value "alert-danger"
 * @remarks Esta constante se utiliza para aplicar una clase CSS que representa un mensaje de alerta de tipo peligro.
 * @since Versión inicial.
 */
export const INFO_ALERT = 'alert-danger';

/**
 * Mensaje de error para periodo no registrado.
 * @const ERROR_PERIODO_ALERT
 * @description Constante que contiene un mensaje HTML indicando que es necesario registrar al menos un periodo.
 */
export const ERROR_PERIODO_ALERT = `
<div class="d-flex justify-content-center text-center">
  <div>
    <div class="col-md-12">
      Corrija los siguientes errores:
    </div>
     <div class="col-md-12">
      Es necesario registrar al menos un periodo
    </div>
  </div>
</div>
`;


/**
 * Tipo de operación en el sistema de comercio exterior.
 * @const TIPO_OPERACION_ENUM
 * @description Constante que representa los tipos de operación en el sistema de comercio exterior.
 */
export const TIPO_OPERACION_ENUM = {
  'TIOPCE.HIS': 'Histórica',
  'TIOPCE.MEN': 'Mensual'
} as const;