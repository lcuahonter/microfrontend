import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { RolAsignado, SesionActiva, Usuario } from '../models/usuario.model';
import { delay, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { USUARIOS_MOCK } from '../../mocks/usuarios.mock';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private router = inject(Router);

  // --- State con Signals ---
  private _sesion = signal<SesionActiva | null>(null);

  readonly logueado = computed(() => this._sesion() !== null);
  readonly usuario = computed(() => this._sesion()?.usuario ?? null);
  readonly rol = computed(() => this._sesion()?.rolActivo ?? null);
  readonly rolesDisponibles = computed(() => this._sesion()?.usuario?.roles ?? []);

  // --- Login con password ---
  loginConPassword(rfc: string, _password: string): Observable<Usuario | { error: string }> {
    const USUARIO = USUARIOS_MOCK.find(u => u.rfc === rfc);
    if (!USUARIO) {
      return of({ error: 'Usuario no encontrado' }).pipe(delay(800));
    }
    return of(USUARIO as Usuario).pipe(
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
  loginConFiel(_cerFile: File, _keyFile: File, _passphrase: string): Observable<Usuario> {
    const USUARIO = USUARIOS_MOCK[0];
    return of(USUARIO).pipe(
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
    const SESION = this._sesion();
    if (SESION) {
      this._sesion.set({ ...SESION, rolActivo: rol });
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
