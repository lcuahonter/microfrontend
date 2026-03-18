import { Injectable, signal } from '@angular/core';
import { of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Usuario, EstatusUsuario, Accionista, CapturistaPrivado, PersonaOirRecibir, Suplencia, RegistroUsuarioDTO, CambioCorreoDTO } from '../models/usuario.model';
import { AsignarRolDTO, DesasignarRolDTO } from '../models/rol.model';
import { USUARIOS_MOCK } from '../../mocks/usuarios.mock';
import { ROLES_MOCK, DEPENDENCIAS_MOCK, UNIDADES_MOCK, TRAMITES_MOCK } from '../../mocks/catalogos.mock';

@Injectable({ providedIn: 'root' })
export class UsuariosApiService {
  // Estado en memoria (simulando DB)
  private _usuarios = signal<Usuario[]>([...USUARIOS_MOCK]);

  // =================== USUARIOS ===================

  buscarUsuario(rfc: string) {
    return of(this._usuarios().find(u => u.rfc === rfc) ?? null).pipe(delay(600));
  }

  listarUsuarios(filtros?: Partial<{ estatus: EstatusUsuario; tipoPersona: string; busqueda: string }>) {
    let lista = this._usuarios();
    if (filtros?.estatus) lista = lista.filter(u => u.estatus === filtros.estatus);
    if (filtros?.busqueda) {
      const b = filtros.busqueda.toLowerCase();
      lista = lista.filter(u =>
        u.rfc.toLowerCase().includes(b) ||
        u.nombre.toLowerCase().includes(b) ||
        u.primerApellido.toLowerCase().includes(b)
      );
    }
    return of(lista).pipe(delay(500));
  }

  registrarUsuario(dto: RegistroUsuarioDTO) {
    const nuevo: Usuario = {
      id: Date.now(),
      ...dto,
      estatus: EstatusUsuario.PENDIENTE_CORREO,
      fechaRegistro: new Date().toISOString().split('T')[0],
      roles: [],
    };
    this._usuarios.update(u => [...u, nuevo]);
    return of({ exitoso: true, usuario: nuevo }).pipe(delay(1200));
  }

  modificarDatos(rfc: string, datos: Partial<Usuario>) {
    this._usuarios.update(lista =>
      lista.map(u => u.rfc === rfc ? { ...u, ...datos } : u)
    );
    return of({ exitoso: true }).pipe(delay(800));
  }

  bloquearUsuario(rfc: string, motivo: string) {
    this._usuarios.update(lista =>
      lista.map(u => u.rfc === rfc ? { ...u, estatus: EstatusUsuario.BLOQUEADO } : u)
    );
    return of({ exitoso: true }).pipe(delay(700));
  }

  desbloquearUsuario(rfc: string) {
    this._usuarios.update(lista =>
      lista.map(u => u.rfc === rfc ? { ...u, estatus: EstatusUsuario.ACTIVO } : u)
    );
    return of({ exitoso: true }).pipe(delay(700));
  }

  // =================== ROLES ===================

  getCatalogosRoles() {
    return of({
      roles: ROLES_MOCK,
      dependencias: DEPENDENCIAS_MOCK,
      unidades: UNIDADES_MOCK,
    }).pipe(delay(400));
  }

  asignarRol(dto: AsignarRolDTO) {
    return of({ exitoso: true, mensaje: 'Rol asignado correctamente' }).pipe(delay(900));
  }

  desasignarRoles(dto: DesasignarRolDTO) {
    return of({ exitoso: true, mensaje: 'Roles desasignados correctamente' }).pipe(delay(900));
  }

  // =================== TRÁMITES ===================

  getCatalogoTramites() {
    return of(TRAMITES_MOCK).pipe(delay(400));
  }

  asignarTramites(rfcUsuario: string, tramiteIds: number[]) {
    return of({ exitoso: true, asignados: tramiteIds.length }).pipe(delay(800));
  }

  // =================== CORREO ===================

  cambiarCorreo(dto: CambioCorreoDTO) {
    return of({ exitoso: true, mensaje: 'Correo actualizado. Se enviará confirmación.' }).pipe(delay(1000));
  }

  reenviarConfirmacion(rfc: string) {
    return of({ exitoso: true }).pipe(delay(600));
  }

  // =================== ACCIONISTAS ===================

  getAccionistas(rfcMoral: string) {
    const usuario = this._usuarios().find(u => u.rfc === rfcMoral);
    return of(usuario?.accionistas ?? []).pipe(delay(500));
  }

  altaAccionista(rfcMoral: string, accionista: Partial<Accionista>) {
    return of({ exitoso: true }).pipe(delay(900));
  }

  bajaAccionista(rfcMoral: string, accionistaId: number) {
    return of({ exitoso: true }).pipe(delay(700));
  }

  // =================== CAPTURISTAS ===================

  getCapturistas(rfcUsuario: string) {
    const usuario = this._usuarios().find(u => u.rfc === rfcUsuario);
    return of(usuario?.capturistas ?? []).pipe(delay(500));
  }

  altaCapturista(rfcUsuario: string, capturista: Partial<CapturistaPrivado>) {
    return of({ exitoso: true }).pipe(delay(900));
  }

  bajaCapturista(rfcUsuario: string, capturistaId: number) {
    return of({ exitoso: true }).pipe(delay(700));
  }

  // =================== PERSONA OIR/RECIBIR ===================

  getPersonasOirRecibir(rfcUsuario: string) {
    const usuario = this._usuarios().find(u => u.rfc === rfcUsuario);
    return of(usuario?.personasOirRecibir ?? []).pipe(delay(500));
  }

  altaPersonaOirRecibir(rfcUsuario: string, persona: Partial<PersonaOirRecibir>) {
    return of({ exitoso: true }).pipe(delay(900));
  }

  // =================== SUPLENCIAS ===================

  getSuplencias(rfcUsuario: string) {
    const usuario = this._usuarios().find(u => u.rfc === rfcUsuario);
    return of(usuario?.suplencias ?? []).pipe(delay(500));
  }

  crearSuplencia(suplencia: Partial<Suplencia>) {
    return of({ exitoso: true }).pipe(delay(900));
  }

  cancelarSuplencia(suplenciaId: number) {
    return of({ exitoso: true }).pipe(delay(700));
  }

  // =================== VALIDACIONES ===================

  verificarRfc(rfc: string) {
    const existe = this._usuarios().some(u => u.rfc === rfc);
    return of({ valido: true, existe, rfc }).pipe(delay(600));
  }

  verificarCurp(curp: string) {
    return of({ valido: true, curp, nombreCompleto: 'NOMBRE VERIFICADO RENAPO' }).pipe(delay(800));
  }

  verificarFiel(cerFile: File, keyFile: File, passphrase: string) {
    return of({ valido: true, rfc: 'GOMA800101AB1', nombre: 'ARTURO GONZALEZ MARTINEZ' }).pipe(delay(1500));
  }
}
