export interface NavItem {
  label: string;
  icon: string;
  route: string;
  roles?: string[];
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', icon: 'bi-speedometer2', route: 'dashboard' },
  { label: 'Registro de Usuario', icon: 'bi-person-plus', route: 'registro' },
  { label: 'Asignar Roles', icon: 'bi-person-gear', route: 'roles/asignar' },
  { label: 'Desasignar Roles', icon: 'bi-person-dash', route: 'roles/desasignar' },
  { label: 'Cambio de Contraseña', icon: 'bi-key', route: 'password/cambio' },
  { label: 'Recuperar Contraseña', icon: 'bi-unlock', route: 'password/recuperar' },
  { label: 'Cambio de Correo', icon: 'bi-envelope', route: 'correo/cambio' },
  { label: 'Alta de Accionista', icon: 'bi-people', route: 'accionista/alta' },
  { label: 'Alta de Capturista', icon: 'bi-pencil-square', route: 'capturista/alta' },
  { label: 'Persona Oír/Recibir', icon: 'bi-telephone', route: 'persona-oir-recibir' },
  { label: 'Trámites', icon: 'bi-file-text', route: 'tramites' },
  { label: 'Suplencias', icon: 'bi-arrow-left-right', route: 'suplencias' },
  { label: 'Modificar Datos', icon: 'bi-pencil', route: 'funcionarios/modificar', roles: ['FUNCIONARIO', 'ADMINISTRADOR'] },
];
