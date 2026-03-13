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
export const MODIFICACION_PERMISO_DATA='Renuncia de derechos de permisos'

/**
 * Contiene el texto HTML del manifiesto de aceptación para la renuncia de permiso.
 *
 * @remarks
 * Este manifiesto se basa en lo dispuesto por los artículos 11, fracción V, 57 fracción II I y 58 de la Ley Federal de Procedimiento Administrativo,
 * aplicable de manera supletoria al Acuerdo que establece la clasificación y codificación de Hidrocarburos y Petrolíferos cuya importación y exportación
 * requieren Permiso Previo de la Secretaría de Energía. El texto declara, bajo protesta de decir verdad, que los derechos otorgados mediante el permiso
 * especificado no son de orden ni interés público y que su renuncia no afecta el interés público.
 *
 * @property Texto - Texto del manifiesto de aceptación en formato HTML.
 */
export const MANIFIESTO_ACEPTACION_HTML = {
  Texto: `De conformidad con lo dispuesto en los artículos 11, fracción V, 57 fracción II I y 58 de la Ley Federal de Procedimiento
Administrativo de aplicación supletoria al Acuerdo por el que se establece la clasificación y codificación de
Hidrocarburos y Petrolíferos cuya importación y exportación está sujeta a Permiso Previo por parte de la Secretaría de
Energía, así como sus modificaciones y adiciones, manifiesto bajo protesta de decir verdad que los derechos otorgados
a mi representada mediante el permiso 1701 C625000410 no son de orden e interés público y que su renuncia no
constituye un perjuicio al interés público`,
};



