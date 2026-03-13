/**
 * @fileoverview Constantes para la configuración de validaciones por secciones en el trámite 40102
 * 
 * Este archivo contiene las configuraciones de validación utilizadas en el trámite 40102
 * para el registro de transportistas terrestres. Define las reglas de validación por pasos
 * y secciones, controlando qué elementos requieren validación en cada etapa del proceso.
 * 
 * Las constantes están organizadas por pasos del trámite, donde cada paso puede tener
 * múltiples secciones con diferentes requerimientos de validación. Esto permite un
 * control granular sobre el flujo de validación y la experiencia del usuario.
 * 
 * @author Sistema de Gestión de Trámites - Frontend Team
 * @version 1.0.0
 * @since 1.0.0
 * @module SolicitudEnums
 */

/**
 * Configuración de validaciones por secciones para el trámite 40102.
 * 
 * Este objeto define las reglas de validación para cada paso del trámite de transportista terrestre.
 * Cada paso está dividido en secciones que pueden requerir o no validación específica,
 * permitiendo un control fino sobre el flujo de validación del formulario.
 * 
 * La estructura permite:
 * - Control de validación por paso del trámite
 * - Validación granular por sección dentro de cada paso
 * - Configuración flexible de requerimientos de validación
 * - Gestión del estado de validación en diferentes etapas
 * 
 * @constant {Object} SECCIONES_TRAMITE_40102
 * 
 * @example
 * ```typescript
 * // Verificar si una sección requiere validación
 * const requiereValidacionSeccion1 = SECCIONES_TRAMITE_40102.PASO_1.VALIDACION_SECCION_1;
 * 
 * // Obtener configuración completa de un paso
 * const configPaso1 = SECCIONES_TRAMITE_40102.PASO_1;
 * 
 * // Usar en componente para controlar validaciones
 * if (SECCIONES_TRAMITE_40102.PASO_2.VALIDACION_SECCION) {
 *   this.validarSeccion();
 * }
 * ```
 * 
 * @since 1.0.0
 */
export const SECCIONES_TRAMITE_40102 = {
    /**
     * Configuración de validaciones para el primer paso del trámite.
     * 
     * Este paso incluye múltiples secciones con diferentes requerimientos de validación.
     * La primera sección no requiere validación (generalmente información básica),
     * mientras que las secciones 2 y 3 sí requieren validación completa.
     * 
     * @property {Object} PASO_1
     */
    PASO_1: {
      /**
       * Validación para la primera sección del paso 1.
       * 
       * @property {boolean} VALIDACION_SECCION_1
       * Valor: false - Esta sección no requiere validación
       */
      VALIDACION_SECCION_1: false,
      
      /**
       * Validación para la segunda sección del paso 1.
       * 
       * @property {boolean} VALIDACION_SECCION_2
       * Valor: true - Esta sección requiere validación completa
       */
      VALIDACION_SECCION_2: true,
      
      /**
       * Validación para la tercera sección del paso 1.
       * 
       * @property {boolean} VALIDACION_SECCION_3
       * Valor: true - Esta sección requiere validación completa
       */
      VALIDACION_SECCION_3: true,
    },
    
    /**
     * Configuración de validaciones para el segundo paso del trámite.
     * 
     * Este paso tiene una configuración de validación unificada para toda la sección,
     * indicando que todos los elementos de este paso requieren validación.
     * 
     * @property {Object} PASO_2
     */
    PASO_2: {
      /**
       * Validación general para el paso 2.
       * 
       * @property {boolean} VALIDACION_SECCION
       * Valor: true - Este paso completo requiere validación
       */
      VALIDACION_SECCION: true,
    },
    
    /**
     * Configuración de validaciones para el tercer paso del trámite.
     * 
     * Este paso utiliza una nomenclatura diferente (requiereValidacion) pero
     * mantiene la misma funcionalidad, indicando que este paso final del
     * trámite requiere validación antes de completar el proceso.
     * 
     * @property {Object} PASO_3
     */
    PASO_3: {
      /**
       * Indicador de requerimiento de validación para el paso 3.
       * 
       * @property {boolean} requiereValidacion
       * Valor: true - Este paso final requiere validación antes de la finalización
       */
      requiereValidacion: true,
    },
  };