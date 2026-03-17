/**
 * @fileoverview Datos de ejemplo y prueba para choferes nacionales en el trámite 40102
 * 
 * Este archivo contiene datos simulados de un chofer nacional mexicano utilizados
 * para propósitos de desarrollo, pruebas y demostración en el sistema de gestión
 * de transportistas terrestres. Los datos incluyen información personal, documentación
 * oficial y detalles de domicilio que representan un caso típico de chofer nacional.
 * 
 * Los datos están organizados siguiendo la estructura requerida para choferes
 * mexicanos, incluyendo documentación específica como RFC, CURP, y información
 * geográfica basada en el sistema administrativo mexicano (entidades federativas,
 * delegaciones, colonias).
 * 
 * @author Sistema de Gestión de Trámites - Frontend Team
 * @version 1.0.0
 * @since 1.0.0
 * @module ChoferDataEnum
 */

/**
 * Datos de ejemplo para un chofer nacional mexicano.
 * 
 * Este objeto contiene información simulada de un chofer nacional que cumple
 * con todos los requerimientos del sistema mexicano de identificación y domicilio.
 * Los datos sirven como referencia para formularios, pruebas unitarias, y
 * demostraciones del sistema.
 * 
 * La información incluye:
 * - Datos personales (nombre, apellidos)
 * - Documentación oficial mexicana (RFC, gafete)
 * - Información de domicilio (dirección completa con división política mexicana)
 * - Datos de identificación específicos para choferes nacionales (CHN)
 * 
 * @constant {Object} CHOFER_DATA
 * 
 * @example
 * ```typescript
 * // Usar datos de ejemplo en formularios
 * const datosEjemplo = CHOFER_DATA;
 * this.formularioChofer.patchValue(datosEjemplo);
 * 
 * // Obtener información específica
 * const nombreCompleto = `${CHOFER_DATA.nombre} ${CHOFER_DATA.apellidoPaterno}`;
 * const rfcChofer = CHOFER_DATA.rfc;
 * 
 * // Usar para pruebas
 * expect(component.choferData.rfc).toBe(CHOFER_DATA.rfc);
 * ```
 * 
 * @since 1.0.0
 */
export const CHOFER_DATA = {
  /**
   * Nombre del chofer nacional.
   * 
   * @property {string} nombre
   * Valor: 'Juan' - Nombre de pila del conductor mexicano
   */
  nombre: 'Juan',
  
  /**
   * Apellido paterno del chofer.
   * 
   * @property {string} apellidoPaterno
   * Valor: 'Pérez' - Primer apellido según documentación oficial mexicana
   */
  apellidoPaterno: 'Pérez',
  
  /**
   * Apellido materno del chofer nacional (CHN).
   * 
   * @property {string} apellidoMaternoCHN
   * Valor: 'González' - Segundo apellido específico para chofer nacional
   */
  apellidoMaternoCHN: 'González',
  
  /**
   * RFC (Registro Federal de Contribuyentes) del chofer.
   * 
   * @property {string} rfc
   * Valor: 'JUAN890123ABC' - Clave de identificación fiscal mexicana de 13 caracteres
   */
  rfc: 'JUAN890123ABC',
  
  /**
   * Número de gafete del chofer.
   * 
   * @property {string} gafete
   * Valor: '123456' - Identificador único del gafete de conductor profesional
   */
  gafete: '123456',
  
  /**
   * Fecha de vigencia del gafete.
   * 
   * @property {string} vigenciagafete
   * Valor: '2025-12-31' - Fecha límite de validez del gafete en formato ISO
   */
  vigenciagafete: '2025-12-31',
  
  /**
   * Calle del domicilio del chofer.
   * 
   * @property {string} calle
   * Valor: 'Av. Reforma' - Nombre de la vía principal del domicilio
   */
  calle: 'Av. Reforma',
  
  /**
   * Número exterior del domicilio.
   * 
   * @property {string} numeroExterior
   * Valor: '123' - Numeración oficial de la fachada del inmueble
   */
  numeroExterior: '123',
  
  /**
   * Número interior del domicilio.
   * 
   * @property {string} numeroInterior
   * Valor: 'A1' - Identificación interna del departamento o local específico
   */
  numeroInterior: 'A1',
  
  /**
   * País del chofer nacional (CHN).
   * 
   * @property {string} paisCHN
   * Valor: 'MEX' - Código ISO de México para chofer nacional
   */
  paisCHN: 'MEX',
  
  /**
   * Entidad federativa del chofer nacional (CHN).
   * 
   * @property {string} entidadFederativaCHN
   * Valor: 'CDMX' - Ciudad de México según división política mexicana
   */
  entidadFederativaCHN: 'CDMX',
  
  /**
   * Delegación del chofer nacional (CHN).
   * 
   * @property {string} delegacionCHN
   * Valor: 'Benito Juárez' - Alcaldía o delegación dentro de la Ciudad de México
   */
  delegacionCHN: 'Benito Juárez',
  
  /**
   * Colonia del chofer nacional (CHN).
   * 
   * @property {string} coloniaCHN
   * Valor: 'Nápoles' - Colonia específica dentro de la delegación Benito Juárez
   */
  coloniaCHN: 'Nápoles',
};
