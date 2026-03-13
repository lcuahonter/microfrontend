/**
 * @fileoverview Constantes para el trámite 240118 - Solicitud de Permiso Extraordinario para la Exportación de Sustancias Químicas.
 * @description Este archivo contiene todas las constantes utilizadas en el flujo del trámite de SEDENA.
 * @author VUCEM Development Team
 * @since 1.0.0
 * @version 1.0.0
 */

/**
 * Representa las etapas que conforman el proceso del trámite de solicitud de permiso extraordinario.
 */
export const PASOS = [
  {
    indice: 1,
    titulo: 'Capturar solicitud', // Paso 1: Capturar la información de la solicitud
    activo: true, // Este paso está activo actualmente
    completado: true, // Ya se ha completado este paso
  },
  {
    indice: 2,
    titulo: 'Anexar requisitos', // Paso 2: Subir o anexar los documentos requeridos
    activo: false, // Este paso aún no está activo
    completado: false, // Este paso no ha sido completado
  },
  {
    indice: 3,
    titulo: 'Firmar solicitud', // Paso 3: Firmar electrónicamente la solicitud
    activo: false, // Este paso aún no está activo
    completado: false, // Este paso no ha sido completado
  },
];

/**
 * Título del mensaje principal mostrado al usuario durante el trámite.
 * Se utiliza en encabezados, títulos de páginas y elementos de navegación relacionados
 * con el proceso de solicitud de permiso extraordinario para exportación de sustancias químicas.
 * 
 * @example
 * ```typescript
 * // Usar en un componente para mostrar el título
 * <h1>{{ TITULOMENSAJE }}</h1>
 * ```
 */
export const TITULOMENSAJE =
  'Solicitud Permiso extraordinario para la exportación de sustancias químicas';

/**
 * Texto explicativo que se muestra al usuario una vez registrada la solicitud.
 * Informa sobre el número temporal asignado y clarifica que no tiene validez legal hasta
 * que se complete el proceso de firma electrónica.
 * 
 * @example
 * ```typescript
 * // Mostrar mensaje informativo después del registro
 * this.notificationService.showInfo(TEXTOS_REQUISITOS);
 * ```
 */
export const TEXTOS_REQUISITOS =
  'La solicitud ha quedado registrada con el número temporal [202767640]. Este no tiene validez legal y sirve solamente para efectos de identificar tu Solicitud. Un folio oficial le será asignado a la solicitud al momento en que esta sea firmada.';

/**
 * Identificador único del procedimiento administrativo 240118 de SEDENA.
 * Se utiliza para identificar específicamente el trámite de "Permiso extraordinario para
 * la exportación de sustancias químicas" dentro del sistema VUCEM.
 * 
 * @example
 * ```typescript
 * // Usar en servicios para identificar el trámite
 * const tramite = this.tramiteService.obtenerPorId(ID_PROCEDIMIENTO);
 * ```
 */
export const ID_PROCEDIMIENTO = 240118;
