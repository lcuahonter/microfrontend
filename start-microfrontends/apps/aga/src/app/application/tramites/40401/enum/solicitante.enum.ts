/**
 * Constantes utilizadas en el trámite 40401 para la configuración de pasos del proceso de solicitud del solicitante.
 *
 * Este archivo contiene configuraciones que definen los pasos específicos del flujo de trabajo
 * para el trámite 40401 del sistema AGA. Define la secuencia de pasos que debe seguir
 * el solicitante durante el proceso de certificación de registro, incluyendo la captura
 * de información y la firma electrónica de la solicitud.
 *
 * Las configuraciones incluyen:
 * - Definición de pasos del proceso de solicitud
 * - Estados de activación y completado de cada paso
 * - Títulos descriptivos para cada etapa del flujo
 * - Control de navegación y validación del proceso
 *
 * @fileoverview Configuración de pasos para el proceso de solicitud del trámite 40401
 * @author Sistema de Gestión de Trámites - Frontend Team
 * @version 1.0.0
 * @since 1.0.0
 * @module SolicitanteEnum
 */

/**
 * Configuración de los pasos del trámite 40401 para el proceso de solicitud del solicitante.
 *
 * Define la secuencia ordenada de pasos que debe completar el solicitante durante
 * el proceso de certificación de registro del trámite 40401. Cada paso representa
 * una etapa específica del flujo de trabajo con su estado de activación y completado,
 * utilizado para controlar la navegación del usuario y validar el progreso del trámite.
 *
 * Cada paso está representado por un objeto que contiene las siguientes propiedades:
 * - `indice`: Número secuencial del paso en el flujo de trabajo.
 * - `titulo`: Título descriptivo que se muestra al usuario para identificar la etapa.
 * - `activo`: Indica si el paso está disponible para interacción del usuario.
 * - `completado`: Indica si el paso ha sido completado exitosamente por el solicitante.
 *
 * @constant {Array<Object>}
 *
 * @example
 * ```typescript
 * // Uso en componente de wizard para mostrar progreso:
 * export class SolicitudWizardComponent {
 *   pasos = PASOS;
 *   pasoActual = 1;
 *
 *   constructor() {
 *     this.inicializarPasos();
 *   }
 *
 *   private inicializarPasos(): void {
 *     this.pasos.forEach((paso, index) => {
 *       paso.activo = index === 0; // Solo el primer paso está activo inicialmente
 *       paso.completado = false;
 *     });
 *   }
 *
 *   public avanzarPaso(): void {
 *     const pasoActual = this.pasos.find(p => p.indice === this.pasoActual);
 *     if (pasoActual) {
 *       pasoActual.completado = true;
 *       pasoActual.activo = false;
 *     }
 *   }
 * }
 * ```
 *
 * @since 1.0.0
 */
export const PASOS = [
    {
      /**
       * @property {number} indice
       * Índice numérico del paso en la secuencia del flujo de trabajo del trámite.
       * 
       * Número secuencial que identifica la posición del paso dentro del proceso
       * de solicitud del trámite 40401, utilizado para ordenamiento, navegación
       * y control de progreso en la interfaz de usuario del wizard.
       */
      indice: 1,

      /**
       * @property {string} titulo
       * Título descriptivo del paso que se muestra al usuario en la interfaz.
       * 
       * Texto descriptivo que identifica la actividad principal que debe realizar
       * el solicitante en este paso del proceso, utilizado como etiqueta en
       * indicadores de progreso y navegación del formulario wizard.
       */
      titulo: 'Capturar solicitud',

      /**
       * @property {boolean} activo
       * Indica si el paso está activo y disponible para interacción del usuario.
       * 
       * Estado que determina si el usuario puede acceder e interactuar con
       * este paso del proceso. Un paso activo permite navegación y edición,
       * mientras que un paso inactivo está deshabilitado para el usuario.
       */
      activo: true,

      /**
       * @property {boolean} completado
       * Indica si el paso ha sido completado exitosamente por el solicitante.
       * 
       * Estado que marca si todas las validaciones y requisitos del paso
       * han sido cumplidos correctamente, permitiendo avanzar al siguiente
       * paso del proceso y actualizar el progreso del trámite.
       */
      completado: true,
    },
    {
      /**
       * @property {number} indice
       * Índice numérico del paso en la secuencia del flujo de trabajo del trámite.
       */
      indice: 2,

      /**
       * @property {string} titulo
       * Título descriptivo del paso que se muestra al usuario en la interfaz.
       */
      titulo: 'Firmar solicitud',

      /**
       * @property {boolean} activo
       * Indica si el paso está activo y disponible para interacción del usuario.
       */
      activo: false,

      /**
       * @property {boolean} completado
       * Indica si el paso ha sido completado exitosamente por el solicitante.
       */
      completado: false,
    }
  ];
