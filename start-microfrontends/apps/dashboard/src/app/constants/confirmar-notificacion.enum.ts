import { ConfiguracionColumna } from '@ng-mf/data-access-user';

/**
 * @interface AcuseNotificacionRequerimiento
 * @description
 * Representa la estructura de datos para los documentos de notificación de requerimiento.
 */
export interface AcuseNotificacionRequerimiento {
  /** Número de identificación del documento. */
  numero: string;

  /** Descripción o nombre del documento. */
  documento: string;
}

/**
 * @constant ACUSE_NOTIFICACION_REQUERIMIENTO_ENCABEZADO_DE_TABLA
 * @description
 * Configuración de columnas de la tabla para mostrar los documentos de notificación de requerimiento.
 *
 * Cada columna contiene:
 * - encabezado: Título visible de la columna.
 * - clave: Función para acceder al campo correspondiente.
 * - orden: Orden de aparición.
 *
 * @type {ConfiguracionColumna<AcuseNotificacionRequerimiento>[]}
 */
export const ACUSE_CONFIRMAR_NOTIFICACION_REQUERIMIENTO_ENCABEZADO_DE_TABLA: ConfiguracionColumna<AcuseNotificacionRequerimiento>[] =
  [
    {
      encabezado: 'No.',
      clave: (fila) => fila.numero,
      orden: 1,
    },
    {
      encabezado: 'Documento',
      clave: (fila) => fila.documento,
      orden: 2,
    }
  ];

/**
 * @constant CONFIRMAR_NOTIFICACION_ALERT
 * @description
 * Mensaje de alerta para la notificación de requerimiento.
 */
export const CONFIRMAR_NOTIFICACION_ALERT = "<div class='text-center'>La notificación de Requerimiento de Información para el trámite con número 0200800300820252540000011 ha sido confirmada.</div>";

/**
 * @constant CONFIRMAR_NOTIFICACION_RESOLUCION_ALERT
 * @description
 * Mensaje de alerta para la notificación de resolución.
 */
export const CONFIRMAR_NOTIFICACION_RESOLUCION_ALERT = "<div class='text-center'>La notificación de la resolución para el trámite con número 2500301600120259910000129 ha sido confirmada.</div>";

