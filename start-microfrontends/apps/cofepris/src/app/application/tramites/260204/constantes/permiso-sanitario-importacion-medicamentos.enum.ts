
/**
 * Representa los pasos necesarios para completar un trámite de permiso sanitario 
 * de importación de medicamentos. Cada paso contiene información sobre su índice, 
 * título, estado de actividad y estado de completado.
 *
 * Propiedades:
 * - `indice`: Número entero que indica el orden del paso dentro del proceso.
 * - `titulo`: Cadena de texto que describe brevemente el paso.
 * - `activo`: Valor booleano que indica si el paso está actualmente activo 
 *   y puede ser realizado por el usuario.
 * - `completado`: Valor booleano que indica si el paso ha sido completado 
 *   satisfactoriamente.
 *
 * Ejemplo de uso:
 * ```typescript
 * console.log(PASOS[0].titulo); // Salida: 'Capturar solicitud'
 * ```
 *
 * Este arreglo es útil para gestionar el flujo de trabajo en la interfaz de usuario 
 * y para determinar el estado actual del trámite.
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
    indice: 4,
    titulo: 'Firmar solicitud',
    activo: false,
    completado: false,
  },
];
/**
 * @constante PRIVACY_NOTICE_CONTENT
 * @tipo {string}
 * @exportado
 * @descripcion
 * Contenido HTML completo del aviso de privacidad simplificado para el sistema VUCEM.
 * Contiene información legal requerida sobre el tratamiento de datos personales.
 * 
 * @estructura_legal
 * **Encabezado**: "Aviso de privacidad simplificado"
 * - Identifica claramente el tipo de documento
 * - Cumple con nomenclatura legal estándar
 * - Diferencia del aviso integral
 * 
 * **Responsable**: Servicio de Administración Tributaria (SAT)
 * - Sujeto obligado según la ley
 * - Responsable del tratamiento de datos
 * - Autoridad competente identificada
 * 
 * **Medio de recolección**: Ventanilla Digital Mexicana de Comercio Exterior (VUCEM)
 * - Plataforma oficial de recolección
 * - Sistema autorizado gubernamental
 * - Canal digital oficial
 * 
 * @finalidades_tratamiento
 * Los datos personales se utilizan para:
 * - **Trámites de comercio exterior**: Importaciones, exportaciones, tránsito
 * - **Regulaciones no arancelarias**: Cumplimiento de restricciones específicas
 * - **Consultas de información**: Procedimientos y requisitos
 * - **Notificaciones**: Comunicaciones derivadas de trámites
 * 
 * @transferencias_datos
 * - **Autoridades competentes**: Según Decreto del 14 de enero de 2011
 * - **Titular de la información**: El propio usuario
 * - **Base legal**: Decreto de establecimiento de VUCEM
 * - **Publicación**: Diario Oficial de la Federación
 * 
 * @derechos_titular
 * - **Manifestar negativa**: Para tratamientos que requieren consentimiento
 * - **Consulta de aviso integral**: Disponible en el portal oficial
 * - **Acceso a información completa**: Derechos ARCO implícitos
 * 
 * @estructura_html
 * Utiliza elementos semánticos:
 * - **div.my-4**: Márgenes verticales para espaciado
 * - **h4.mb-4**: Encabezado principal con margen inferior
 * - **p.text-justify**: Párrafos justificados para mejor legibilidad
 * - **div.text-center**: Centrado para enlaces importantes
 * - **a.text-primary**: Enlaces estilizados con color primario
 * 
 * @cumplimiento_normativo
 * - **Ley Federal de Protección de Datos Personales**
 * - **Lineamientos del IFAI/INAI**
 * - **Decretos presidenciales sobre VUCEM**
 * - **Normatividad de comercio exterior**
 * 
 * @interaccion_usuario
 * ```html
 * <!-- Enlace para aviso integral -->
 * <a (click)="seccionStore.establecerSeccion([false])">
 *   Aviso de privacidad integral
 * </a>
 * ```
 * 
 * @consideraciones_implementacion
 * - **innerHTML seguro**: Validar contenido antes del renderizado
 * - **Event binding**: Configurar correctamente clicks en enlaces
 * - **Responsive**: Asegurar legibilidad en dispositivos móviles
 * - **Accesibilidad**: Considerar lectores de pantalla
 * 
 * @actualizaciones_legales
 * Este contenido debe revisarse cuando:
 * - Cambien las leyes de protección de datos
 * - Se modifiquen decretos relacionados con VUCEM
 * - Actualicen las finalidades del tratamiento
 * - Cambien las autoridades responsables
 */
export const PRIVACY_NOTICE_CONTENT = `
  <div class="my-4">
  <div class="text-center">
    <h4 class="mb-4">Aviso de privacidad simplificado</h4>
    </div>
    <div>
    <p class="text-justify">
      El Servicio de Administración Tributaria (SAT), es el sujeto obligado y responsable del tratamiento de los datos personales que se recaban a través de la Ventanilla Digital Mexicana de Comercio Exterior (VUCEM), los datos personales podrán ser utilizados y transferidos a la autoridades competentes, con la finalidad de llevar a cabo cualquier trámite relacionado con importaciones, exportaciones y tránsito de mercancías de comercio exterior, incluyendo las regulaciones y restricciones no arancelarias que, conforme a la legislación aplicable, sea exigido por las autoridades competentes en materia de comercio exterior y/o consultar información sobre los procedimientos para la importación, exportación y tránsito de mercancías de comercio exterior, incluyendo las regulaciones y restricciones no arancelarias, así como las notificaciones que se deriven de dichos trámites y serán protegidos, incorporados y tratados en el sistema de datos personales de la VUCEM, asimismo podrán ser transmitidos a las autoridades competentes establecidas en el Decreto por el que se establece la Ventanilla Digital Mexicana de Comercio Exterior, publicado en el Diario Oficial de la Federación el 14 de enero de 2011, así como al propio titular de la información. El titular, en su caso, podrá manifestar su negativa para el tratamiento de sus datos personales para finalidades y transferencias de los mismos que requieran el consentimiento del titular. Si desea conocer nuestro aviso de privacidad integral, lo podrá consultar en el portal.
    </p>
    </div>
    <div class="text-center">
      <a class="text-primary" style="cursor: pointer;" (click)="seccionStore.establecerSeccion([false])">
        Aviso de privacidad integral
      </a>
    </div>
  </div>
`;

export const ID_PROCEDIMIENTO = 260204;

/**
 * Mensaje de validación que solicita confirmación al usuario
 * sobre la ausencia de datos relacionados con el pago de derechos.
 */
export const MENSAJE_DE_VALIDACION = '<div><b>¡Error de registro!</b> Faltan campos por capturar.</div>';
/**
 * @const ELEMENTOS_REQUERIDOS
 * @description Lista de elementos requeridos para completar el formulario o proceso.
 */
export const ELEMENTOS_REQUERIDOS = [
  'correoElectronico',
  'denominacionRazon',
  'scian'
];

/**
 * Constante que representa el título del mensaje utilizado en el permiso sanitario
 * de importación de medicamentos y materias primas destinados a investigación en humanos.
 * 
 * Esta constante se utiliza para mostrar un mensaje descriptivo en la interfaz de usuario
 * relacionado con el trámite correspondiente. Proporciona información clara y específica
 * sobre el propósito del permiso sanitario.
 * 
 * @constant
 * @type {string}
 */
export const TITULO_MENSAJE =
  'Permiso sanitario de importación de medicamentos con registro sanitario';

/**
 * Mensaje de validación que solicita confirmación al usuario
 * sobre la ausencia de datos relacionados con el pago de derechos.
 */
export const MENSAJE_DE_PAGE= '¿Está seguro que su solicitud no requiere los datos del Pago de derechos?';
/**
 * Mensaje de validación que solicita confirmación al usuario
 * sobre la ausencia de datos relacionados con el pago de derechos.
 */
export const MENSAJE_DE_VALIDACION_PAGO_DERECHOS = '<div>¿Está seguro que su solicitud no requiere los datos del Pago de derechos?</div>';