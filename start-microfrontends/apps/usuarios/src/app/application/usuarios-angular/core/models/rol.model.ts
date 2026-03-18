// ============================================================
// MODELOS - Roles VUCEM
// ============================================================

export interface Rol {
  id: number;
  clave: string;
  nombre: string;
  descripcion: string;
  tipoRol: string;
  activo: boolean;
}

export interface Dependencia {
  id: number;
  clave: string;
  nombre: string;
  activa: boolean;
}

export interface UnidadAdministrativa {
  id: number;
  clave: string;
  nombre: string;
  dependenciaId: number;
  activa: boolean;
}

export interface AsignarRolDTO {
  rfcUsuario: string;
  rolId: number;
  dependenciaId?: number;
  unidadAdministrativaId?: number;
  tramiteIds?: number[];
  motivo?: string;
}

export interface DesasignarRolDTO {
  rfcUsuario: string;
  rolIds: number[];
  motivo: string;
}
