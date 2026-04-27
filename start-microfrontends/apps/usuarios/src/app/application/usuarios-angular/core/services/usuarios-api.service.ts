import { Accionista, CambioCorreoDTO, CapturistaPrivado, EstatusUsuario, PersonaOirRecibir, RegistroUsuarioDTO, Suplencia, Usuario } from '../models/usuario.model';
import { AsignarRolDTO, Dependencia, DesasignarRolDTO, Rol, UnidadAdministrativa } from '../models/rol.model';
import { DEPENDENCIAS_MOCK, ROLES_MOCK, TRAMITES_MOCK, UNIDADES_MOCK } from '../../mocks/catalogos.mock';
import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Tramite } from '../models/tramite.model';
import { USUARIOS_MOCK } from '../../mocks/usuarios.mock';
import { delay } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UsuariosApiService {
  // Estado en memoria (simulando DB)
  private _usuarios = signal<Usuario[]>([...USUARIOS_MOCK]);

  // =================== USUARIOS ===================

  buscarUsuario(rfc: string): Observable<Usuario | null> {
    return of(this._usuarios().find(u => u.rfc === rfc) ?? null).pipe(delay(600));
  }

  listarUsuarios(filtros?: Partial<{ estatus: EstatusUsuario; tipoPersona: string; busqueda: string }>): Observable<Usuario[]> {
    let lista = this._usuarios();
    if (filtros?.estatus) { lista = lista.filter(u => u.estatus === filtros.estatus); }
    if (filtros?.busqueda) {
      const B = filtros.busqueda.toLowerCase();
      lista = lista.filter(u =>
        u.rfc.toLowerCase().includes(B) ||
        u.nombre.toLowerCase().includes(B) ||
        u.primerApellido.toLowerCase().includes(B)
      );
    }
    return of(lista).pipe(delay(500));
  }

  registrarUsuario(dto: RegistroUsuarioDTO): Observable<{ exitoso: boolean; usuario: Usuario }> {
    const NUEVO: Usuario = {
      id: Date.now(),
      ...dto,
      estatus: EstatusUsuario.PENDIENTE_CORREO,
      fechaRegistro: new Date().toISOString().split('T')[0],
      roles: [],
    };
    this._usuarios.update(u => [...u, NUEVO]);
    return of({ exitoso: true, usuario: NUEVO }).pipe(delay(1200));
  }

  modificarDatos(rfc: string, datos: Partial<Usuario>): Observable<{ exitoso: boolean }> {
    this._usuarios.update(lista =>
      lista.map(u => u.rfc === rfc ? { ...u, ...datos } : u)
    );
    return of({ exitoso: true }).pipe(delay(800));
  }

  bloquearUsuario(rfc: string, _motivo: string): Observable<{ exitoso: boolean }> {
    this._usuarios.update(lista =>
      lista.map(u => u.rfc === rfc ? { ...u, estatus: EstatusUsuario.BLOQUEADO } : u)
    );
    return of({ exitoso: true }).pipe(delay(700));
  }

  desbloquearUsuario(rfc: string): Observable<{ exitoso: boolean }> {
    this._usuarios.update(lista =>
      lista.map(u => u.rfc === rfc ? { ...u, estatus: EstatusUsuario.ACTIVO } : u)
    );
    return of({ exitoso: true }).pipe(delay(700));
  }

  // =================== ROLES ===================

  getCatalogosRoles(): Observable<{ roles: Rol[]; dependencias: Dependencia[]; unidades: UnidadAdministrativa[] }> {
    return of({
      roles: ROLES_MOCK,
      dependencias: DEPENDENCIAS_MOCK,
      unidades: UNIDADES_MOCK,
    }).pipe(delay(400));
  }

  asignarRol(_dto: AsignarRolDTO): Observable<{ exitoso: boolean; mensaje: string }> {
    return of({ exitoso: true, mensaje: 'Rol asignado correctamente' }).pipe(delay(900));
  }

  desasignarRoles(_dto: DesasignarRolDTO): Observable<{ exitoso: boolean; mensaje: string }> {
    return of({ exitoso: true, mensaje: 'Roles desasignados correctamente' }).pipe(delay(900));
  }

  // =================== TRÁMITES ===================

  getCatalogoTramites(): Observable<Tramite[]> {
    return of(TRAMITES_MOCK).pipe(delay(400));
  }

  asignarTramites(_rfcUsuario: string, tramiteIds: number[]): Observable<{ exitoso: boolean; asignados: number }> {
    return of({ exitoso: true, asignados: tramiteIds.length }).pipe(delay(800));
  }

  // =================== CORREO ===================

  cambiarCorreo(_dto: CambioCorreoDTO): Observable<{ exitoso: boolean; mensaje: string }> {
    return of({ exitoso: true, mensaje: 'Correo actualizado. Se enviará confirmación.' }).pipe(delay(1000));
  }

  reenviarConfirmacion(_rfc: string): Observable<{ exitoso: boolean }> {
    return of({ exitoso: true }).pipe(delay(600));
  }

  // =================== ACCIONISTAS ===================

  getAccionistas(rfcMoral: string): Observable<Accionista[]> {
    const USUARIO = this._usuarios().find(u => u.rfc === rfcMoral);
    return of(USUARIO?.accionistas ?? []).pipe(delay(500));
  }

  altaAccionista(_rfcMoral: string, _accionista: Partial<Accionista>): Observable<{ exitoso: boolean }> {
    return of({ exitoso: true }).pipe(delay(900));
  }

  bajaAccionista(_rfcMoral: string, _accionistaId: number): Observable<{ exitoso: boolean }> {
    return of({ exitoso: true }).pipe(delay(700));
  }

  // =================== CAPTURISTAS ===================

  getCapturistas(rfcUsuario: string): Observable<CapturistaPrivado[]> {
    const USUARIO = this._usuarios().find(u => u.rfc === rfcUsuario);
    return of(USUARIO?.capturistas ?? []).pipe(delay(500));
  }

  altaCapturista(_rfcUsuario: string, _capturista: Partial<CapturistaPrivado>): Observable<{ exitoso: boolean }> {
    return of({ exitoso: true }).pipe(delay(900));
  }

  bajaCapturista(_rfcUsuario: string, _capturistaId: number): Observable<{ exitoso: boolean }> {
    return of({ exitoso: true }).pipe(delay(700));
  }

  // =================== PERSONA OIR/RECIBIR ===================

  getPersonasOirRecibir(rfcUsuario: string): Observable<PersonaOirRecibir[]> {
    const USUARIO = this._usuarios().find(u => u.rfc === rfcUsuario);
    return of(USUARIO?.personasOirRecibir ?? []).pipe(delay(500));
  }

  altaPersonaOirRecibir(_rfcUsuario: string, _persona: Partial<PersonaOirRecibir>): Observable<{ exitoso: boolean }> {
    return of({ exitoso: true }).pipe(delay(900));
  }

  // =================== SUPLENCIAS ===================

  getSuplencias(rfcUsuario: string): Observable<Suplencia[]> {
    const USUARIO = this._usuarios().find(u => u.rfc === rfcUsuario);
    return of(USUARIO?.suplencias ?? []).pipe(delay(500));
  }

  crearSuplencia(_suplencia: Partial<Suplencia>): Observable<{ exitoso: boolean }> {
    return of({ exitoso: true }).pipe(delay(900));
  }

  cancelarSuplencia(_suplenciaId: number): Observable<{ exitoso: boolean }> {
    return of({ exitoso: true }).pipe(delay(700));
  }

  // =================== VALIDACIONES ===================

  verificarRfc(rfc: string): Observable<{ valido: boolean; existe: boolean; rfc: string }> {
    const EXISTE = this._usuarios().some(u => u.rfc === rfc);
    return of({ valido: true, existe: EXISTE, rfc }).pipe(delay(600));
  }

  verificarCurp(curp: string): Observable<{ valido: boolean; curp: string; nombreCompleto: string }> {
    return of({ valido: true, curp, nombreCompleto: 'NOMBRE VERIFICADO RENAPO' }).pipe(delay(800));
  }

  verificarFiel(_cerFile: File, _keyFile: File, _passphrase: string): Observable<{ valido: boolean; rfc: string; nombre: string }> {
    return of({ valido: true, rfc: 'GOMA800101AB1', nombre: 'ARTURO GONZALEZ MARTINEZ' }).pipe(delay(1500));
  }
}
