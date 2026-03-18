// ============================================================
// MODELOS - Módulo Usuarios VUCEM
// ============================================================

export enum TipoPersona {
  FISICA = 'FISICA',
  MORAL = 'MORAL',
}

export enum TipoNacionalidad {
  MEXICANO = 'MEXICANO',
  EXTRANJERO = 'EXTRANJERO',
}

export enum EstatusUsuario {
  ACTIVO = 'ACTIVO',
  INACTIVO = 'INACTIVO',
  BLOQUEADO = 'BLOQUEADO',
  PENDIENTE_CORREO = 'PENDIENTE_CORREO',
  PENDIENTE_VALIDACION = 'PENDIENTE_VALIDACION',
}

export enum TipoRol {
  OPERATIVO = 'OPERATIVO',
  AUTORIZADOR = 'AUTORIZADOR',
  ADMINISTRADOR = 'ADMINISTRADOR',
  FUNCIONARIO = 'FUNCIONARIO',
}

// ---- Interfaces principales ----

export interface Usuario {
  id: number;
  rfc: string;
  curp?: string;
  nombre: string;
  primerApellido: string;
  segundoApellido?: string;
  correo: string;
  tipoPersona: TipoPersona;
  tipoNacionalidad: TipoNacionalidad;
  estatus: EstatusUsuario;
  fechaRegistro: string;
  fechaUltimoAcceso?: string;
  roles?: RolAsignado[];
  accionistas?: Accionista[];
  capturistas?: CapturistaPrivado[];
  personasOirRecibir?: PersonaOirRecibir[];
  suplencias?: Suplencia[];
}

export interface RolAsignado {
  id: number;
  nombreRol: string;
  tipoRol: TipoRol;
  dependencia?: string;
  unidadAdministrativa?: string;
  fechaAsignacion: string;
  activo: boolean;
}

export interface Accionista {
  id: number;
  rfc: string;
  nombre: string;
  primerApellido: string;
  segundoApellido?: string;
  tipoPersona: TipoPersona;
  tipoNacionalidad: TipoNacionalidad;
  porcentajeParticipacion: number;
  activo: boolean;
  fechaAlta: string;
}

export interface CapturistaPrivado {
  id: number;
  rfc: string;
  curp: string;
  nombre: string;
  primerApellido: string;
  segundoApellido?: string;
  correo: string;
  activo: boolean;
  fechaAlta: string;
}

export interface PersonaOirRecibir {
  id: number;
  rfc?: string;
  nombre: string;
  primerApellido: string;
  segundoApellido?: string;
  correo: string;
  telefono?: string;
  activo: boolean;
  fechaAlta: string;
}

export interface Suplencia {
  id: number;
  rfcTitular: string;
  nombreTitular: string;
  rfcSuplente: string;
  nombreSuplente: string;
  fechaInicio: string;
  fechaFin: string;
  motivo?: string;
  activa: boolean;
  tramitesAplicados?: string[];
}

// ---- DTOs ----

export interface RegistroUsuarioDTO {
  rfc: string;
  curp?: string;
  nombre: string;
  primerApellido: string;
  segundoApellido?: string;
  correo: string;
  confirmacionCorreo: string;
  tipoPersona: TipoPersona;
  tipoNacionalidad: TipoNacionalidad;
  aceptaTerminos: boolean;
  firmaCer?: string;
  firmaKey?: string;
  firmaCadena?: string;
}

export interface CambioCorreoDTO {
  rfcUsuario: string;
  correoActual: string;
  correoNuevo: string;
  confirmacionCorreo: string;
  motivoCambio?: string;
}

export interface SesionActiva {
  usuario: Usuario;
  rolActivo: RolAsignado;
  token: string;
  expira: string;
}
