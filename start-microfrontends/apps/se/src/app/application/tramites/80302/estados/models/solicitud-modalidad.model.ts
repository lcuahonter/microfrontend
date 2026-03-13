
/**
 * @fileoverview Modelos de datos para la gestión de solicitudes de modalidad del trámite 80302
 * @description Este archivo contiene las interfaces y tipos de datos utilizados para
 * la gestión de solicitudes de cambio de modalidad en el sistema VUCEM para el
 * trámite 80302 (modificaciones al programa IMMEX)
 * @author Sistema VUCEM
 * @version 1.0.0
 * @since 2024
 */

/**
 * @module SharedModule
 * @description Módulo compartido para componentes y servicios del sistema VUCEM
 */

/**
 * Interfaz para representar un paso en un asistente (wizard) de navegación
 * @interface ListaPasosWizard
 * @description Define la estructura de datos para cada paso del asistente de solicitud,
 * permitiendo el control de navegación y estado de completado en formularios multi-paso
 * @example
 * ```typescript
 * const paso: ListaPasosWizard = {
 *   indice: 1,
 *   titulo: "Datos del Solicitante",
 *   activo: true,
 *   completado: false
 * };
 * ```
 * @see {@link AccionBoton} Para acciones de navegación entre pasos
 */
export interface ListaPasosWizard {
    /**
     * Número identificador del paso en la secuencia del wizard
     * @type {number}
     * @description Índice secuencial que determina el orden del paso en el asistente
     * @example 1, 2, 3, etc.
     */
    indice: number;

    /**
     * Título descriptivo del paso del wizard
     * @type {string}
     * @description Texto que se muestra al usuario para identificar el contenido del paso
     * @example "Datos del Solicitante", "Información de Plantas"
     */
    titulo: string;

    /**
     * Estado de actividad del paso actual
     * @type {boolean}
     * @description Indica si este paso es el que está siendo mostrado actualmente
     * @default false
     */
    activo: boolean;

    /**
     * Estado de completado del paso
     * @type {boolean}
     * @description Indica si el usuario ha completado satisfactoriamente este paso
     * @default false
     */
    completado: boolean;
}

/**
 * Interfaz genérica para representar la respuesta estándar de las APIs del sistema VUCEM
 * @interface RespuestaAPI
 * @template T - Tipo genérico de los datos contenidos en la respuesta
 * @description Define la estructura estándar de respuesta para todas las llamadas a API
 * del sistema VUCEM, proporcionando consistencia en el manejo de respuestas y errores
 * @example
 * ```typescript
 * // Respuesta exitosa con datos de banco
 * const respuesta: RespuestaAPI<Banco[]> = {
 *   code: 200,
 *   data: [{ id: 1, value: "BBVA Bancomer" }],
 *   message: "Consulta exitosa"
 * };
 * 
 * // Respuesta de error
 * const error: RespuestaAPI<null> = {
 *   code: 400,
 *   data: null,
 *   message: "Error en la validación de datos"
 * };
 * ```
 * @see {@link Banco} Para estructura de datos bancarios
 */
export interface RespuestaAPI<T> {
    /**
     * Código de estado HTTP de la respuesta
     * @type {number}
     * @description Código numérico que indica el resultado de la operación
     * @example 200 (éxito), 400 (error de cliente), 500 (error de servidor)
     */
    code: number;

    /**
     * Datos de respuesta de la API
     * @type {T}
     * @description Contenido principal de la respuesta, tipado según el genérico T
     * @example Array de objetos, objeto individual, o null en caso de error
     */
    data: T;

    /**
     * Mensaje descriptivo de la respuesta
     * @type {string}
     * @description Texto explicativo del resultado de la operación
     * @example "Operación exitosa", "Error de validación", "Datos no encontrados"
     */
    message: string;
}

/**
 * Interfaz para representar información de instituciones bancarias
 * @interface Banco
 * @description Define la estructura de datos para entidades bancarias utilizadas
 * en el sistema VUCEM, especialmente para procesos de garantías y fianzas
 * en trámites aduaneros del programa IMMEX
 * @example
 * ```typescript
 * const bancoBBVA: Banco = {
 *   id: 1,
 *   value: "BBVA Bancomer S.A."
 * };
 * 
 * const bancoSantander: Banco = {
 *   id: 2,
 *   value: "Banco Santander México S.A."
 * };
 * ```
 * @see {@link RespuestaAPI} Para respuestas que contienen arrays de bancos
 */
export interface Banco {
    /**
     * Identificador único de la institución bancaria
     * @type {number}
     * @description Clave numérica única que identifica la institución financiera
     * en el catálogo del sistema VUCEM
     * @example 1, 2, 3, etc.
     */
    id: number;

    /**
     * Nombre o razón social de la institución bancaria
     * @type {string}
     * @description Denominación oficial de la institución financiera
     * @example "BBVA Bancomer S.A.", "Banco Santander México S.A."
     */
    value: string;
}

/**
 * Interfaz para definir acciones de navegación en componentes de botones
 * @interface AccionBoton
 * @description Define la estructura para controlar la navegación entre pasos
 * en formularios tipo wizard, especificando tanto la acción como el destino
 * @example
 * ```typescript
 * // Acción para continuar al siguiente paso
 * const continuar: AccionBoton = {
 *   accion: 'cont',
 *   valor: 2
 * };
 * 
 * // Acción para retroceder al paso anterior
 * const retroceder: AccionBoton = {
 *   accion: 'atras',
 *   valor: 0
 * };
 * ```
 * @see {@link ListaPasosWizard} Para la estructura de pasos del wizard
 */
export interface AccionBoton {
    /**
     * Tipo de acción de navegación
     * @type {string}
     * @description Define la dirección del movimiento en el wizard
     * @example 'cont' para continuar, 'atras' para retroceder
     */
    accion: string;

    /**
     * Índice del paso de destino
     * @type {number}
     * @description Número del paso al cual se debe navegar tras ejecutar la acción
     * @example 0, 1, 2, etc. correspondientes a los índices de pasos del wizard
     */
    valor: number;
}