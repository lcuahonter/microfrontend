import { TableBodyData } from "../shared/components.model";

/**
 * Representa la acción de un botón en el wizard.
 */
export interface AccionBoton {
  accion: string;
  valor: number;
}
/**
 * Datos de pago asociados a una transacción.
 */
export interface PagoData {
  claveReferencia: string;
  numeroOperacion: string;
  cadenaDependencia: string;
  banco: string;
  llavePago: string;
  fechaPago: string;
  importePago: string | number;
}
/**
 * Representa un tipo de documento.
 */
export interface Tipos {
  tiposData: string; // Tipo de documento.
}
/**
 * Datos personales de una persona.
 */
export interface Personas {
  rfc: string; // RFC de la persona
  curp: string; // CURP de la persona
  nombre: string; // Nombre de la persona
  apellidoPaterno: string; // Apellido paterno de la persona
  apellidoMaterno: string; // Apellido materno de la persona
}
/**
 * Estructura para representar datos de una tabla.
 */
export interface TableData {
  tableHeader: string[];
  tableBody: TableBodyData[];
}
/**
 * Fila del cuerpo de la tabla con sus celdas.
 */
export interface TableBodyRow {
  tbodyData: string[][];
}
/**
 * Interfaz que representa los datos básicos de una persona
 * @description Define la estructura de datos para información personal básica,
 * incluyendo identificadores oficiales y nombres.
 * 
 * @example
 * const personaEjemplo: Persona = {
 *   RFC: 'XAXX010101000',
 *   CURP: 'XAXX010101HDFXXX00',
 *   Nombre: 'Juan',
 *   Apellido_paterno: 'Pérez',
 *   Apellido_materno: 'López'
 * };
 */
export interface Persona {
  RFC: string;
  CURP: string;
  Nombre: string;
  Apellido_paterno: string;
  Apellido_materno: string;
}

/**
 * Interfaz que representa un documento
 */
export interface TipoDocumento {
  /**
   * Tipo de documento
   */
  tiposdata: string;
  
  // Otras propiedades que pueda tener el documento...
  // id: number;
  // fecha: Date;
  // etc...
}
