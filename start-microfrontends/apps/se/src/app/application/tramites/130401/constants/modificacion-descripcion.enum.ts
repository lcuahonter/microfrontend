import {
  DatosArancelaria,
  MercanciaTablaDatos,
  SolicitudTablaDatos,
} from '../models/modificacion-descripcion.model';

/**
 * Constante que define los pasos del proceso del trámite 130401.
 *
 * Cada paso incluye:
 * - `indice`: Número del paso en el proceso.
 * - `titulo`: Título descriptivo del paso.
 * - `activo`: Indica si el paso está activo.
 * - `completado`: Indica si el paso ha sido completado.
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
    titulo: 'Anexar requisitos',
    activo: false,
    completado: false,
  },
  {
    indice: 3,
    titulo: 'Firmar solicitud',
    activo: false,
    completado: false,
  },
];

/**
 * Constante que contiene textos utilizados en el trámite 130401.
 *
 * Incluye mensajes de alerta y textos informativos.
 */
export const TEXTOS = {
  /**
   * Mensaje de alerta para terceros.
   */
  TERCEROS_TEXTO_DE_ALERTA:
    'La solicitud ha quedado registrada con el número temporal 202768161 Éste no tiene validez legal y sirve solamente para efectos de identificar tu solicitud. Un folio oficial le será asignado a la solicitud al momento en que ésta sea firmada.',
};

/**
 * Mensaje de alerta para continuar con el trámite.
 *
 * Este mensaje se muestra cuando no se han agregado mercancías al trámite.
 */
export const TERCEROS_TEXTO_DE_ALERTA =
  'Para continuar con el trámite, debes agregar por lo menos una mercancía.';

/**
 * Opciones de radio para el tipo de solicitud.
 *
 * Cada opción incluye:
 * - `label`: Etiqueta descriptiva de la opción.
 * - `value`: Valor asociado a la opción.
 */
export const SOLICITUD_OPCION_RADIO = [
  {
    label: 'Modificación',
    value: 'TISOL.M',
  },
];

/**
 * Opciones de radio para el tipo de producto.
 *
 * Cada opción incluye:
 * - `label`: Etiqueta descriptiva de la opción.
 * - `value`: Valor asociado a la opción.
 */
export const PRODUCTO_OPCION_RADIO = [
  {
    label: 'Nuevo',
    value: 'CONDMER.N',
  },
  {
    label: 'Usado',
    value: 'CONDMER.U',
  },
];

/**
 * @constant MERCANCIA_TABLA_ENCABEZADOS
 * @description Encabezados de la tabla de mercancías.
 *
 * - Define las columnas que se mostrarán en la tabla de mercancías.
 * - Cada columna incluye:
 *   - `encabezado`: El título de la columna.
 *   - `clave`: Una función que obtiene el valor correspondiente a la columna desde un objeto de tipo `MercanciaTablaDatos`.
 *   - `orden`: El orden en el que se mostrarán las columnas.
 */
export const MERCANCIA_TABLA_ENCABEZADOS = [
  {
    encabezado: '',
    clave: (ele: MercanciaTablaDatos): number => ele.idPartidaSol,
    orden: 1,
  },
  {
    encabezado: 'Cantidad',
    clave: (ele: MercanciaTablaDatos): string => ele.unidadesAutorizadas,
    orden: 2,
  },
  {
    encabezado: 'Descripción autorizada',
    clave: (ele: MercanciaTablaDatos): string => ele.descripcionAutorizada,
    orden: 3,
  },
  {
    encabezado: 'Descripción solicitada',
    clave: (ele: MercanciaTablaDatos): string => ele.descripcionSolicitada,
    orden: 4,
  },
  {
    encabezado: 'Precio unitario USD',
    clave: (ele: MercanciaTablaDatos): string => ele.importeUnitarioUSDAutorizado,
    orden: 5,
  },
  {
    encabezado: 'Total USD',
    clave: (ele: MercanciaTablaDatos): string => ele.importeTotalUSDAutorizado,
    orden: 6,
  },
];

/**
 * @constant SOLICITUD_TABLA_ENCABEZADOS
 * @description Encabezados de la tabla de solicitudes.
 *
 * - Define las columnas que se mostrarán en la tabla de solicitudes.
 * - Cada columna incluye:
 *   - `encabezado`: El título de la columna.
 *   - `clave`: Una función que obtiene el valor correspondiente a la columna desde un objeto de tipo `SolicitudTablaDatos`.
 *   - `orden`: El orden en el que se mostrarán las columnas.
 */
export const SOLICITUD_TABLA_ENCABEZADOS = [
  {
    encabezado: '',
    clave: (ele: SolicitudTablaDatos): number => ele.idPartidaSol,
    orden: 1,
  },
  {
    encabezado: 'Cantidad',
    clave: (ele: SolicitudTablaDatos): string => ele.unidadesAutorizadas,
    orden: 2,
  },
  {
    encabezado: 'Descripción',
    clave: (ele: SolicitudTablaDatos): string => ele.descripcionAutorizada,
    orden: 3,
  },
  {
    encabezado: 'Precio unitario USD',
    clave: (ele: SolicitudTablaDatos): string => ele.importeUnitarioUSDAutorizado,
    orden: 4,
  },
  {
    encabezado: 'Total USD',
    clave: (ele: SolicitudTablaDatos): string => ele.importeTotalUSDAutorizado,
    orden: 5,
  },
];

/**
 * @constant ARANCELARIA_TABLA_ENCABEZADOS
 * @description Encabezados de la tabla de fracciones arancelarias.
 *
 * - Define las columnas que se mostrarán en la tabla de fracciones arancelarias.
 * - Cada columna incluye:
 *   - `encabezado`: El título de la columna.
 *   - `clave`: Una función que obtiene el valor correspondiente a la columna desde un objeto de tipo `DatosArancelaria`.
 *   - `orden`: El orden en el que se mostrarán las columnas.
 */
export const ARANCELARIA_TABLA_ENCABEZADOS = [
  {
    encabezado: '',
    clave: (ele: DatosArancelaria): number => ele.id,
    orden: 1,
  },
  {
    encabezado: 'Fracción arancelaria',
    clave: (ele: DatosArancelaria): string => ele.fraccionArancelaria,
    orden: 2,
  },
  {
    encabezado: 'Descripción',
    clave: (ele: DatosArancelaria): string => ele.descripcion,
    orden: 3,
  },
];

/**
 * Plantilla HTML utilizada para mostrar un mensaje de error en el formulario
 * cuando existen campos obligatorios sin capturar.
 * @constant {string}
 */
export const ERROR_ALERTA: string = `
<div class="d-flex justify-content-center text-center">
  <div>
    <div class="col-md-12">
      Favor de verificar los campos que marcan error.
    </div>
  </div>
</div>`;

/**
 * Genera el mensaje HTML para registro exitoso
 * @param numeroSolicitud Número de solicitud a incluir en el mensaje
 * @returns Mensaje HTML formateado para registro exitoso
 */
export const MSG_REGISTRO_EXITOSO = (numeroSolicitud: string): string =>
  `<p>La solicitud ha quedado registrada con el número temporal ${numeroSolicitud ?? ''}. Este no tiene válidez legal y sirve solamente para efectos de identificar tu solicitud. Un folio oficial le será asignado al momento en que ésta sea firmada.</p>`;
