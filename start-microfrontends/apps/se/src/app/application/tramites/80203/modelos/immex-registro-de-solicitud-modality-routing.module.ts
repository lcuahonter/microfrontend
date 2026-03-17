/**
 * @interface ListaPasosWizard
 * @description
 * Interfaz que define la estructura de los pasos en el asistente (wizard) del trámite IMMEX 
 * (Industria Manufacturera, Maquiladora y de Servicios de Exportación).
 * 
 * Esta interfaz proporciona la estructura de datos necesaria para gestionar la navegación
 * y el estado de cada paso dentro del flujo de trabajo del trámite. Permite controlar
 * la progresión del usuario a través del proceso de registro de solicitud, manteniendo
 * un registro del estado actual y del progreso completado.
 * 
 * @author Sistema VUCEM 3.0
 * @version 1.0.0
 * @since 2025
 * 
 * @example
 * ```typescript
 * const pasoEjemplo: ListaPasosWizard = {
 *   indice: 1,
 *   titulo: "Datos Generales",
 *   activo: true,
 *   completado: false
 * };
 * ```
 */
export interface ListaPasosWizard {
    /**
     * @property {number} indice
     * @description 
     * Número secuencial que identifica el orden posicional del paso dentro del asistente.
     * 
     * Este valor determina la secuencia lógica de navegación y se utiliza para:
     * - Establecer el orden de ejecución de los pasos
     * - Validar la navegación secuencial del usuario
     * - Determinar pasos anteriores y posteriores
     * - Controlar la habilitación/deshabilitación de navegación
     * 
     * @remarks
     * - Debe ser un número entero positivo
     * - Generalmente comienza desde 1 o 0
     * - Debe ser único dentro del conjunto de pasos
     * - Se recomienda que sea consecutivo para evitar errores de navegación
     * 
     * @example
     * ```typescript
     * // Primer paso del wizard
     * indice: 1
     * 
     * // Segundo paso del wizard
     * indice: 2
     * ```
     */
    indice: number;

    /**
     * @property {string} titulo
     * @description 
     * Título descriptivo y legible del paso que se muestra al usuario en la interfaz.
     * 
     * Este campo contiene el texto que identifica visualmente el paso dentro del
     * componente wizard. Debe ser claro, conciso y representativo del contenido
     * o acción que se realiza en ese paso específico.
     * 
     * @remarks
     * - Debe ser un texto descriptivo y claro
     * - Se recomienda usar máximo 50 caracteres para una buena UX
     * - Puede incluir caracteres especiales y acentos
     * - Debe ser único para evitar confusión al usuario
     * - Se sugiere usar sustantivos o frases nominales
     * 
     * @example
     * ```typescript
     * // Ejemplos de títulos apropiados
     * titulo: "Datos Generales"
     * titulo: "Información de la Empresa"
     * titulo: "Documentos Adjuntos"
     * titulo: "Revisión y Confirmación"
     * ```
     */
    titulo: string;

    /**
     * @property {boolean} activo
     * @description 
     * Indicador booleano que determina si el paso está actualmente seleccionado o en foco.
     * 
     * Este estado controla la visualización activa del paso en la interfaz de usuario,
     * permitiendo al sistema y al usuario identificar en qué parte del proceso se
     * encuentran actualmente. Solo un paso puede estar activo a la vez en el wizard.
     * 
     * @remarks
     * - Solo un paso debe tener valor `true` a la vez
     * - Controla el resaltado visual del paso en la UI
     * - Se utiliza para mostrar el contenido correspondiente al paso
     * - Cambia dinámicamente según la navegación del usuario
     * - Debe sincronizarse con la lógica de navegación del componente
     * 
     * @example
     * ```typescript
     * // Paso actualmente seleccionado
     * activo: true
     * 
     * // Paso no seleccionado
     * activo: false
     * ```
     */
    activo: boolean;

    /**
     * @property {boolean} completado
     * @description 
     * Indicador booleano que señala si el paso ha sido completado exitosamente por el usuario.
     * 
     * Este estado permite al sistema realizar un seguimiento del progreso del usuario
     * a través del wizard, habilitando funcionalidades como:
     * - Validación de completitud antes de avanzar
     * - Indicadores visuales de progreso
     * - Navegación hacia atrás a pasos ya completados
     * - Persistencia del estado del formulario
     * 
     * @remarks
     * - Se establece como `true` cuando el paso cumple todos los criterios de validación
     * - Permite la navegación no lineal hacia pasos previamente completados
     * - Se utiliza para mostrar indicadores visuales (checkmarks, colores, etc.)
     * - Puede revertirse a `false` si se detectan errores en validaciones posteriores
     * - Es independiente del estado `activo`
     * 
     * @example
     * ```typescript
     * // Paso completado exitosamente
     * completado: true
     * 
     * // Paso pendiente o con errores
     * completado: false
     * ```
     */
    completado: boolean;
}