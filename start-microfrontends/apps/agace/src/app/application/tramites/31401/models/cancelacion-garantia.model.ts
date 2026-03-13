/**
  * @interface RequisitosTabla
  * @description
  * Interfaz que define la estructura de los datos relacionados con los requisitos en una tabla.
  * 
  * Propiedades:
  * - `rfc`: Representa el Registro Federal de Contribuyentes (RFC) del requisito. Es un valor de tipo `string`.
  * - `nombre`: Nombre asociado al requisito. Es un valor de tipo `string`.
  * 
  * @example
  * const requisito: RequisitosTabla = {
  *   rfc: 'ABC123456789',
  *   nombre: 'Requisito Ejemplo'
  * };
  */
export interface RequisitosTabla {
    rfc: string;
    nombre: string;
}

/**
  * @interface MiembroTabla
  * @description
  * Interfaz que define la estructura de los datos relacionados con los miembros de la empresa en una tabla.
  * 
  * Propiedades:
  * - `tipoDePersona`: Tipo de persona (e.g., física o moral). Es un valor de tipo `string`.
  * - `rfc`: Registro Federal de Contribuyentes (RFC) del miembro. Es un valor de tipo `string`.
  * - `nombre`: Nombre del miembro de la empresa. Es un valor de tipo `string`.
  * - `enSuCarater`: Rol o carácter en el que actúa el miembro. Es un valor de tipo `string`.
  * 
  * @example
  * const miembro: MiembroTabla = {
  *   tipoDePersona: 'Física',
  *   rfc: 'ABC123456789',
  *   nombre: 'Juan Pérez',
  *   enSuCarater: 'Representante Legal'
  * };
  */export interface MiembroTabla {
    tipoDePersona: string;
    rfc: string;
    nombre: string;
    enSuCarater: string;
}
/**
  * @interface TipoInversionTabla
  * @description
  * Interfaz que define la estructura de los datos relacionados con los tipos de inversión en una tabla.
  * 
  * Propiedades:
  * - `tipoDeInversion`: Tipo de inversión (e.g., "Capital", "Acciones"). Es un valor de tipo `string`.
  * - `descripcion`: Descripción detallada del tipo de inversión. Es un valor de tipo `string`.
  * - `valor`: Valor asociado al tipo de inversión. Es un valor de tipo `string`.
  * 
  * @example
  * const tipoInversion: TipoInversionTabla = {
  *   tipoDeInversion: 'Capital',
  *   descripcion: 'Inversión en capital de la empresa',
  *   valor: '1000000'
  * };
  */
export interface TipoInversionTabla {
    tipoDeInversion: string;
    descripcion: string;
    valor: string;
}

/**
  * @interface TerecerosTabla
  * @description
  * Interfaz que define la estructura de los datos relacionados con los terceros en una tabla.
  * 
  * Propiedades:
  * - `rfc`: Registro Federal de Contribuyentes (RFC) del tercero. Es un valor de tipo `string`.
  * - `curp`: Clave Única de Registro de Población (CURP) del tercero. Es un valor de tipo `string`.
  * - `nombre`: Nombre del tercero. Es un valor de tipo `string`.
  * - `primerApellido`: Primer apellido del tercero. Es un valor de tipo `string`.
  * - `segundoApellido`: Segundo apellido del tercero. Es un valor de tipo `string`.
  * 
  * @example
  * const tercero: TerecerosTabla = {
  *   rfc: 'ABC123456789',
  *   curp: 'CURP123456HDFABC01',
  *   nombre: 'Juan',
  *   primerApellido: 'Pérez',
  *   segundoApellido: 'Gómez'
  * };
  */
export interface TerecerosTabla {
    rfc: string;
    curp: string;
    nombre: string;
    primerApellido: string;
    segundoApellido: string;
}