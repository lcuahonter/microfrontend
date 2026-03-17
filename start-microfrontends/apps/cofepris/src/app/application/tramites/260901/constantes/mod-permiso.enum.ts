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
export const MODIFICACION_PERMISO_DATA='Modificación del permiso sanitario de importación de insumos para la salud por retorno'

/**
 * Contiene el aviso de privacidad simplificado con su correspondiente enlace al aviso integral.
 */
// export const AVISO_PRIVACIDAD = {
//     ADJUNTAR: `<h5>Aviso de privacidad simplificado</h5>
//       <p style="text-align: justify">El Servicio de Administración Tributaria (SAT), es el sujeto obligado y responsable del tratamiento de los datos personales que se recaban a través de la Ventanilla Digital Mexicana de Comercio Exterior (VUCEM), los datos personales podrán ser utilizados y transferidos a la autoridades competentes, con la finalidad de llevar a cabo cualquier trámite relacionado con importaciones, exportaciones y tránsito de mercancías de comercio exterior, incluyendo las regulaciones y restricciones no arancelarias que, conforme a la legislación aplicable, sea exigido por las autoridades competentes en materia de comercio exterior y/o consultar información sobre los procedimientos para la importación, exportación y tránsito de mercancías de comercio exterior, incluyendo las regulaciones y restricciones no arancelarias, así como las notificaciones que se deriven de dichos trámites y serán protegidos, incorporados y tratados en el Sistema de datos personales de la VUCEM, asimismo podrán ser transmitidos a las autoridades competentes establecidad en el Decreto por el que se establece la Ventanilla Digital Mexicana de Comercio Exterior, publicado en el Diario Oficial de la Federaciónel 14 de enero de 2011, así como al propio titular de la información. El titular, en su caso, podrá manifestar su negativa para el tratamiento de sus datos personales para finalidades y transferencias de los mismos que requieran el consentimiento del titular. Si desea conocer nuestro aviso de privacidad integral, lo podrá consultar en el portal.</p><a href="">Aviso de privacidad integral</a>`
//   }