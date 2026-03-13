
/**
 * Modelos de datos para la gestión de modalidades del trámite CAAT Naviero 40301.
 *
 * Este archivo contiene las interfaces TypeScript que definen la estructura de datos
 * para la información de metadatos de agentes navieros en el sistema CAAT (Certificado
 * de Autorización de Agente de Transporte). Define los contratos de datos utilizados
 * para representar información descriptiva y clasificación de agentes en el proceso
 * de registro y gestión de operadores navieros.
 *
 * Las interfaces incluyen:
 * - Información de metadatos para entidades CAAT Naviero
 * - Etiquetas descriptivas y clasificaciones de tipos de agente
 * - Datos requeridos para la identificación y categorización de agentes
 *
 * @fileoverview Modelos de datos para modalidades CAAT Naviero del trámite 40301
 * @author Sistema de Gestión de Trámites - Frontend Team
 * @version 1.0.0
 * @since 1.0.0
 * @module CaatNavieroModalidadModels
 */

/**
 * Interfaz que define la estructura de metadatos para entidades CAAT Naviero.
 *
 * Esta interfaz especifica la información descriptiva necesaria para identificar
 * y clasificar agentes navieros dentro del sistema CAAT. Contiene datos de
 * referencia que se utilizan para mostrar información contextual en la interfaz
 * de usuario y para la gestión de diferentes tipos de agentes de transporte
 * naviero según sus modalidades de operación.
 *
 * La información de metadatos se utiliza principalmente para:
 * - Mostrar etiquetas descriptivas en formularios y listados
 * - Clasificar agentes según su tipo y modalidad de operación
 * - Proporcionar contexto visual al usuario durante el proceso de registro
 * - Facilitar la identificación rápida de diferentes categorías de agentes
 *
 * @interface CaatNaviroMetaInfo
 *
 * @example
 * ```typescript
 * // Ejemplo de metadatos para un agente naviero:
 * const metadatosAgente: CaatNaviroMetaInfo = {
 *   tutilo: 'Agente Naviero Especializado en Contenedores',
 *   tipoAgenteLabel: 'Agente de Carga Marítima - Contenedores'
 * };
 *
 * // Uso en componentes para mostrar información:
 * this.tituloAgente = metadatosAgente.tutilo;
 * this.etiquetaTipo = metadatosAgente.tipoAgenteLabel;
 * ```
 *
 * @since 1.0.0
 */
export interface CaatNaviroMetaInfo {
  /**
   * @property {string} tutilo
   * Título o nombre descriptivo asociado con el agente CAAT Naviero.
   * 
   * Este campo contiene la denominación principal del agente naviero,
   * utilizada para identificación y visualización en la interfaz de usuario.
   * Representa el nombre comercial, razón social o título específico
   * que caracteriza al agente dentro del sistema de transporte marítimo.
   */
  tutilo: string;

  /**
   * @property {string} tipoAgenteLabel
   * Etiqueta descriptiva que especifica el tipo y modalidad del agente naviero.
   * 
   * Campo que define la clasificación específica del agente según su
   * modalidad de operación, especialización y tipo de servicios que presta
   * en el ámbito del transporte marítimo. Esta etiqueta se utiliza para
   * categorizar y filtrar agentes según sus capacidades operativas.
   */
  tipoAgenteLabel: string;
}
