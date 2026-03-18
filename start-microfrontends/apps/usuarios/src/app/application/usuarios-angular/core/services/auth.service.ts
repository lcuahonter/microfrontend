import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { SesionActiva, Usuario, RolAsignado } from '../models/usuario.model';
import { USUARIOS_MOCK } from '../../mocks/usuarios.mock';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private router = inject_router();

  // --- State con Signals ---
  private _sesion = signal<SesionActiva | null>(null);

  readonly logueado = computed(() => this._sesion() !== null);
  readonly usuario = computed(() => this._sesion()?.usuario ?? null);
  readonly rol = computed(() => this._sesion()?.rolActivo ?? null);
  readonly rolesDisponibles = computed(() => this._sesion()?.usuario?.roles ?? []);

  // --- Login con password ---
  loginConPassword(rfc: string, password: string) {
    const usuario = USUARIOS_MOCK.find(u => u.rfc === rfc);
    if (!usuario) {
      return of({ error: 'Usuario no encontrado' }).pipe(delay(800));
    }
    return of(usuario).pipe(
      delay(1000),
      tap(u => {
        if (u.roles && u.roles.length > 1) {
          // Requiere selección de rol
          this._sesion.set({
            usuario: u,
            rolActivo: u.roles[0],
            token: 'mock-token-' + Date.now(),
            expira: new Date(Date.now() + 8 * 3600000).toISOString(),
          });
        } else if (u.roles && u.roles.length === 1) {
          this._sesion.set({
            usuario: u,
            rolActivo: u.roles[0],
            token: 'mock-token-' + Date.now(),
            expira: new Date(Date.now() + 8 * 3600000).toISOString(),
          });
        }
      })
    );
  }

  // --- Login con e.firma ---
  loginConFiel(cerFile: File, keyFile: File, passphrase: string) {
    const usuario = USUARIOS_MOCK[0];
    return of(usuario).pipe(
      delay(1500),
      tap(u => {
        this._sesion.set({
          usuario: u,
          rolActivo: u.roles![0],
          token: 'fiel-token-' + Date.now(),
          expira: new Date(Date.now() + 8 * 3600000).toISOString(),
        });
      })
    );
  }

  // --- Selección de rol ---
  seleccionarRol(rol: RolAsignado) {
    const sesion = this._sesion();
    if (sesion) {
      this._sesion.set({ ...sesion, rolActivo: rol });
    }
  }

  // --- Logout ---
  logout() {
    this._sesion.set(null);
    this.router.navigate(['/login']);
  }

  getSesion(): SesionActiva | null {
    return this._sesion();
  }
}

// Helper para evitar circular DI en standalone
function inject_router(): Router {
  const { inject } = require('@angular/core');
  return inject(Router);
}
