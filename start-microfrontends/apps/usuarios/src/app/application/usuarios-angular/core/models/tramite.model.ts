// ============================================================
// MODELOS - Trámites VUCEM
// ============================================================

export interface Tramite {
  id: number;
  clave: string;
  nombre: string;
  descripcion?: string;
  activo: boolean;
}

export interface TramiteAsignado {
  tramiteId: number;
  clave: string;
  nombre: string;
  fechaAsignacion: string;
  asignadoPor: string;
}
