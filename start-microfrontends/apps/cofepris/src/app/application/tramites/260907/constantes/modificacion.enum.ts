/**
 * `MODIFICACION_PERMISO_ENUM`
 * 
 * Esta constante representa los pasos del asistente (wizard) para el proceso de modificación de permisos sanitarios.
 * 
 * ### Estructura:
 * - Cada objeto dentro del array representa un paso del asistente y contiene las siguientes propiedades:
 *   - `indice`: Número del paso en el flujo del asistente.
 *   - `titulo`: Título descriptivo del paso.
 *   - `activo`: Indica si el paso está activo actualmente.
 *   - `completado`: Indica si el paso ha sido completado.
 * 
 * ### Propósito:
 * - Esta constante se utiliza para definir y gestionar los pasos del asistente en el flujo de modificación de permisos sanitarios.
 * - Permite controlar el estado de cada paso (activo o completado) y mostrar el título correspondiente en la interfaz de usuario.
 * 
 * ### Ejemplo de uso:
  * ```typescript
 */
export const MODIFICACION_PERMISO_ENUM = [
    {
        indice: 1,
        titulo: 'Capturar solicitud',
        activo: true,
        completado: false,
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
      }

]
/**
 * `MODIFICACION_PERMISO_DATA`
 * 
 * Esta constante contiene una descripción general del proceso de modificación del permiso sanitario.
 * 
 * ### Propósito:
 * - Proporcionar un texto descriptivo que explique el objetivo del trámite.
 * - Se utiliza para mostrar información general sobre el proceso en la interfaz de usuario.
 *  
 *  */
export const MODIFICACION_PERMISO_DATA='Modificación del permiso sanitario de importación de insumos para la salud de medicamentos destinados a tratamientos especiales (enfermedades de baja incidencia con repercusión social)'

