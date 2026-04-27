import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const AUTH_GUARD: CanActivateFn = () => {
  const AUTH = inject(AuthService);
  const ROUTER = inject(Router);
  if (AUTH.logueado()) {
    return true;
  }
  return ROUTER.createUrlTree(['/login']);
};

export const NO_AUTH_GUARD: CanActivateFn = () => {
  const AUTH = inject(AuthService);
  const ROUTER = inject(Router);
  if (!AUTH.logueado()) {
    return true;
  }
  return ROUTER.createUrlTree(['/dashboard']);
};

export const ADMIN_GUARD: CanActivateFn = () => {
  const AUTH = inject(AuthService);
  const ROUTER = inject(Router);
  const ROL = AUTH.rol();
  if (ROL?.tipoRol === 'ADMINISTRADOR' || ROL?.tipoRol === 'FUNCIONARIO') {
    return true;
  }
  return ROUTER.createUrlTree(['/dashboard']);
};
