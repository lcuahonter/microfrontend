export interface QuickAction {
  label: string;
  icon: string;
  route: string;
}

export const QUICK_ACTIONS: QuickAction[] = [
  { label: 'Nuevo Registro', icon: 'bi-person-plus', route: '/registro' },
  { label: 'Asignar Rol', icon: 'bi-person-gear', route: '/roles/asignar' },
  { label: 'Alta Accionista', icon: 'bi-people', route: '/accionista/alta' },
  { label: 'Nueva Suplencia', icon: 'bi-arrow-left-right', route: '/suplencias' },
  { label: 'Cambio Correo', icon: 'bi-envelope', route: '/correo/cambio' },
];
