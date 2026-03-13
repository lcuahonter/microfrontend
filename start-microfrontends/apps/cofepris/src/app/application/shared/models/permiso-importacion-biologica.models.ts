/**
 * Modelo de datos para una fila de una tabla.
 * Representa los datos que se mostrarán en la tabla.
 */
export interface TableData {

  tbodyData: string[];
}


/**
 * Modelo de datos para TipoMo.
 * Representa los datos de una persona o entidad.
 */
export interface TipoMoModel {
  tipoPersona: boolean | string; // Indica si es persona física o moral (boolean or string)
  razonSocial: string; // Nombre o razón social
  pais: string; // País
  estado: string; // Estado
  codigoPostal: string; // Código postal
  calle: string; // Calle
  numeroExterior: string; // Número exterior
  numeroInterior: string; // Número interior
  lada: string; // LADA (clave de área telefónica)
  telefono: string; // Teléfono
  correoElectronico: string; // Correo electrónico
  rfc: string; // Registro Federal de Contribuyentes
  curp: string; // Clave Única de Registro de Población
  colonia: string; // Colonia
  municipio: string; // Municipio
  localidad: string; // Localidad
  entidadFederativa: string; // Entidad federativa
  coloniaEquivalente: string; // Colonia equivalente
  nombre?: string; // Nombre (opcional, para persona física)
  primerApellido?: string;
  segundoApellido?: string;
}

