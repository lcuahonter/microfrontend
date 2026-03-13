export interface RespuestaSolicitud {
  codigo: number;
  data: string;
  descripcion: string;
  message: string;
}

export interface DatosGenerales {
  curp?: string;
  rfc?: string;
  nombreRazonSocial: string;
  primerApellido?: string;
  segundoApellido?: string;
  actEconomica: string;
  correo: string;
}
export interface DomicilioFiscal {
  pais: string;
  codigoPostal: string;
  entidadFederativa: string;
  municipio: string;
  localidad: string;
  colonia: string;
  calle: string;
  nExt: string;
  nInt: string;
  lada: string;
  telefono: string;
}
export interface PersonaTerceros {
  nombre: string;
  correo: string;
}







/** Hasta aqui terminan las interfaces de la solicitud */

export interface Personas {
  razonSocial: string;
  correo: string;
}

export interface TipoDocumento {
  tipoDocumento: number;
}

export interface ListaPasosWizard {
  indice: number;
  titulo: string;
  activo: boolean;
  completado: boolean;
}
/**
 * @description Representa la estructura de una vista emergente.
 * @property {boolean} abierto - Indica si la vista emergente está abierta o cerrada.
 * @property {number} indice - Representa el índice asociado a la vista emergente.
 */
export interface VistaEmergente {
  abierto: boolean;
  indice: number;
}
