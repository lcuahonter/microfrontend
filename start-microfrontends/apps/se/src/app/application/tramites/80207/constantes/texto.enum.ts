/**
 * @fileoverview Archivo de constantes de texto para gestión de requisitos documentales del trámite 80207
 * @description
 * Este archivo centraliza todos los textos estáticos utilizados en la sección de requisitos
 * del proceso de trámite 80207. Contiene instrucciones detalladas para el usuario sobre
 * cómo gestionar documentos obligatorios y opcionales, así como mensajes informativos
 * sobre el proceso de adjuntar documentación adicional.
 * 
 * @module TextoRequisitos
 * @tramite 80207
 * @version 1.0.0
 * @author Sistema VUCEM
 * @since 2024
 */

/**
 * @constant {TextosRequisitosInterface} TEXTOS_REQUISITOS
 * @description
 * Objeto que contiene todas las constantes de texto utilizadas en la interfaz de
 * gestión de requisitos documentales. Centraliza mensajes, instrucciones y textos
 * informativos para mantener consistencia en la experiencia del usuario.
 * 
 * @purpose
 * Proporciona textos estandarizados para:
 * - **Instrucciones de uso**: Guías paso a paso para el manejo de documentos
 * - **Mensajes informativos**: Comunicación clara sobre procesos y opciones
 * - **Textos de ayuda**: Asistencia contextual para operaciones documentales
 * - **Contenido HTML**: Textos formateados para presentación en interfaz
 * 
 * @user_experience
 * Los textos están diseñados para:
 * - Facilitar la comprensión del proceso documental
 * - Reducir errores en la gestión de requisitos
 * - Proporcionar claridad sobre documentos obligatorios vs opcionales
 * - Guiar al usuario en operaciones de agregar/eliminar documentos
 * 
 * @content_structure
 * Cada constante contiene:
 * - **Contenido HTML**: Textos formateados con etiquetas para presentación
 * - **Instrucciones específicas**: Pasos claros y concisos
 * - **Casos de uso**: Situaciones particulares y sus procedimientos
 * - **Opciones disponibles**: Acciones que puede realizar el usuario
 * 
 * @html_formatting
 * Los textos incluyen:
 * - Etiquetas `<h6>` para títulos de sección
 * - Etiquetas `<p>` para párrafos informativos
 * - Formato de lista con guiones para instrucciones secuenciales
 * - Texto enfatizado para acciones específicas
 * 
 * @business_rules
 * Los textos reflejan reglas de negocio como:
 * - Documentos pueden ser obligatorios según caso particular
 * - Flexibilidad para eliminar documentos no requeridos
 * - Capacidad de agregar múltiples documentos del mismo tipo
 * - Opción de adjuntar documentos adicionales no listados
 * 
 * @accessibility
 * Textos diseñados considerando:
 * - Claridad y simplicidad en el lenguaje
 * - Estructura HTML accesible para lectores de pantalla
 * - Instrucciones específicas para reducir confusión
 * - Terminología consistente con el sistema VUCEM
 * 
 * @maintenance
 * Para modificaciones de textos considerar:
 * - Mantener consistencia con otros módulos del sistema
 * - Preservar formato HTML para correcta presentación
 * - Validar que cambios no afecten funcionalidad UI
 * - Revisar impacto en experiencia del usuario
 * 
 * @export
 * @readonly
 * @interface TextosRequisitosInterface
 * @property {string} INSTRUCCIONES - Instrucciones detalladas para gestión de requisitos
 * @property {string} ADJUNTAR - Mensaje para proceso de adjuntar documentos nuevos
 */
export const TEXTOS_REQUISITOS = {
  /**
   * @property {string} INSTRUCCIONES
   * @description
   * Texto HTML que contiene las instrucciones principales para la gestión de requisitos
   * documentales en el trámite 80207. Proporciona orientación clara sobre el manejo
   * de documentos obligatorios y opcionales, así como procedimientos para agregar
   * o eliminar documentación según las necesidades específicas del caso.
   * 
   * @content_purpose
   * Estas instrucciones sirven para:
   * - **Clarificar flexibilidad**: Explicar que algunos documentos pueden ser obligatorios según el caso
   * - **Enseñar eliminación**: Instruir cómo remover documentos no necesarios
   * - **Guiar duplicación**: Mostrar cómo agregar múltiples documentos del mismo tipo
   * - **Orientar flujo**: Dirigir al usuario a través del proceso documental
   * 
   * @html_structure
   * Contiene elementos HTML estructurados:
   * - **Encabezado h6**: "Instrucciones" como título de la sección
   * - **Párrafos informativos**: Tres puntos clave con guiones para fácil lectura
   * - **Formato de lista**: Estructura visual clara para instrucciones secuenciales
   * - **Texto enfatizado**: Palabras clave como "Agregar nuevo" destacadas
   * 
   * @user_instructions
   * Las tres instrucciones principales cubren:
   * 1. **Obligatoriedad condicional**: Documentos pueden ser requeridos según caso particular
   * 2. **Eliminación selectiva**: Procedimiento para remover documentos innecesarios
   * 3. **Adición múltiple**: Proceso para agregar varios documentos del mismo tipo
   * 
   * @business_logic
   * Refleja reglas de negocio importantes:
   * - Flexibilidad en requisitos según caso específico
   * - Control del usuario sobre documentos necesarios
   * - Capacidad de gestión dinámica de documentación
   * - Proceso intuitivo para operaciones comunes
   * 
   * @ui_integration
   * Se integra con:
   * - Componente de lista de requisitos
   * - Botones de eliminación de documentos
   * - Selector de tipos de documento
   * - Botón "Agregar nuevo" para duplicación
   * 
   * @accessibility_considerations
   * - Estructura HTML semántica para lectores de pantalla
   * - Instrucciones claras y directas
   * - Terminología consistente con el sistema
   * - Formato de lista para fácil navegación
   * 
   * @formatting_details
   * - Utiliza etiquetas p para cada instrucción
   * - Incluye guiones para crear formato de lista visual
   * - Comillas para destacar texto de botones específicos
   * - Estructura jerárquica clara con encabezado
   * 
   * @value "<h6>Instrucciones</h6><p>- De acuerdo al caso particular...</p>"
   * @type {string}
   * @readonly
   * @html_content Contiene etiquetas HTML para presentación formatada
   */
  INSTRUCCIONES: `<h6>Instrucciones</h6>
    <p>- De acuerdo al caso particular, algunos documentos podrían ser obligatorios</p>
    <p>- En caso de que no requieras algún documento, selecciónalo y elíminalo</p>
    <p>- Si necesitas anexar más de un documento del mismo tipo selecciónalo de la lista y presiona "Agregar nuevo".</p>`,

  /**
   * @property {string} ADJUNTAR
   * @description
   * Texto HTML informativo que explica el proceso para adjuntar documentos adicionales
   * que no están incluidos en la lista predefinida de requisitos. Proporciona instrucciones
   * específicas sobre cómo utilizar la opción de "Adjuntar nuevo documento" para
   * agregar documentación personalizada o adicional al trámite.
   * 
   * @functionality_purpose
   * Este mensaje guía al usuario para:
   * - **Adjuntar documentos no listados**: Agregar documentación no incluida en requisitos predefinidos
   * - **Utilizar opción especial**: Acceder a la funcionalidad de "Adjuntar nuevo documento"
   * - **Activar proceso**: Usar el botón "Adjuntar documentos" para iniciar carga
   * - **Complementar requisitos**: Añadir documentación adicional según necesidades específicas
   * 
   * @user_workflow
   * Describe un flujo de trabajo de dos pasos:
   * 1. **Selección**: Elegir la opción "--Adjuntar nuevo documento--" de la lista
   * 2. **Acción**: Presionar el botón "Adjuntar documentos" para proceder
   * 
   * @ui_elements_referenced
   * Menciona elementos específicos de la interfaz:
   * - **Opción de lista**: "--Adjuntar nuevo documento--" como elemento seleccionable
   * - **Botón de acción**: "Adjuntar documentos" para ejecutar la funcionalidad
   * - **Lista de selección**: Dropdown o selector donde aparece la opción especial
   * 
   * @business_scenario
   * Cubre casos donde:
   * - Documentos requeridos no están en la lista predefinida
   * - Usuario necesita agregar documentación complementaria
   * - Proceso requiere documentos específicos del caso particular
   * - Flexibilidad para adjuntar documentación adicional
   * 
   * @html_formatting
   * Utiliza:
   * - Etiqueta `<p>` para párrafo informativo
   * - Guiones dobles para destacar texto de opción
   * - Comillas para identificar texto exacto de botones
   * - Estructura simple y clara para fácil comprensión
   * 
   * @integration_context
   * Se integra con:
   * - Selector de tipos de documento
   * - Sistema de carga de archivos
   * - Validador de documentos adjuntos
   * - Proceso de envío de trámite
   * 
   * @user_experience
   * Diseñado para:
   * - Proporcionar claridad sobre proceso de adjuntar documentos personalizados
   * - Reducir confusión sobre opciones disponibles
   * - Guiar paso a paso el proceso de adjuntar documentos adicionales
   * - Mantener consistencia con terminología del sistema
   * 
   * @accessibility_features
   * - Texto claro y directo
   * - Instrucciones específicas sobre qué seleccionar
   * - Identificación exacta de elementos de UI
   * - Lenguaje comprensible para todos los usuarios
   * 
   * @maintenance_notes
   * Al modificar considerar:
   * - Sincronización con texto real de opciones de UI
   * - Consistencia con nombres de botones en interfaz
   * - Mantenimiento de claridad en instrucciones
   * - Validación de proceso descrito vs funcionalidad real
   * 
   * @value "<p>Si deseas adjuntar un nuevo documento...</p>"
   * @type {string}
   * @readonly
   * @html_content Párrafo HTML con instrucciones para adjuntar documentos
   */
  ADJUNTAR: `<p>Si deseas adjuntar un nuevo documento, selecciona la opción --Adjuntar nuevo documento-- y presiona el botón "Adjuntar documentos"</p>`,
};