import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { UsuariosApiService } from './usuarios-api.service';
import {
  TipoPersona,
  TipoNacionalidad,
  EstatusUsuario,
  RegistroUsuarioDTO,
  CambioCorreoDTO,
} from '../models/usuario.model';
import { AsignarRolDTO, DesasignarRolDTO } from '../models/rol.model';
import { USUARIOS_MOCK } from '../../mocks/usuarios.mock';
import { ROLES_MOCK, DEPENDENCIAS_MOCK, UNIDADES_MOCK, TRAMITES_MOCK } from '../../mocks/catalogos.mock';

describe('UsuariosApiService', () => {
  let service: UsuariosApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsuariosApiService);
  });

  // ─────────────────────────────────────────────────────────────
  // 1. Creación del servicio
  // ─────────────────────────────────────────────────────────────

  it('debe crearse el servicio correctamente', () => {
    expect(service).toBeTruthy();
  });

  // ─────────────────────────────────────────────────────────────
  // 2-3. buscarUsuario
  // ─────────────────────────────────────────────────────────────

  it('debería retornar null al buscar un RFC inexistente', fakeAsync(() => {
    let resultado: any;

    service.buscarUsuario('RFC_QUE_NO_EXISTE').subscribe(val => (resultado = val));
    tick(700);

    expect(resultado).toBeNull();
  }));

  it('debería retornar el usuario correspondiente al buscar un RFC existente', fakeAsync(() => {
    const rfcExistente = USUARIOS_MOCK[0].rfc; // 'GOMA800101AB1'
    let resultado: any;

    service.buscarUsuario(rfcExistente).subscribe(val => (resultado = val));
    tick(700);

    expect(resultado).toBeTruthy();
    expect(resultado.rfc).toBe(rfcExistente);
  }));

  // ─────────────────────────────────────────────────────────────
  // 4. listarUsuarios
  // ─────────────────────────────────────────────────────────────

  it('debería retornar un array al listar usuarios sin filtros', fakeAsync(() => {
    let resultado: any;

    service.listarUsuarios().subscribe(val => (resultado = val));
    tick(600);

    expect(Array.isArray(resultado)).toBe(true);
    expect(resultado.length).toBeGreaterThan(0);
  }));

  it('debería filtrar usuarios por estatus correctamente', fakeAsync(() => {
    let resultado: any;

    service
      .listarUsuarios({ estatus: EstatusUsuario.ACTIVO })
      .subscribe(val => (resultado = val));
    tick(600);

    expect(Array.isArray(resultado)).toBe(true);
    resultado.forEach((u: any) => expect(u.estatus).toBe(EstatusUsuario.ACTIVO));
  }));

  // ─────────────────────────────────────────────────────────────
  // 5-6. registrarUsuario
  // ─────────────────────────────────────────────────────────────

  it('debería retornar exitoso:true al registrar un usuario nuevo', fakeAsync(() => {
    const dto: RegistroUsuarioDTO = {
      rfc: 'TEST800101XX1',
      nombre: 'USUARIO TEST',
      primerApellido: 'TEST',
      segundoApellido: '',
      correo: 'test@test.com',
      confirmacionCorreo: 'test@test.com',
      tipoPersona: TipoPersona.FISICA,
      tipoNacionalidad: TipoNacionalidad.MEXICANO,
      aceptaTerminos: true,
    };
    let resultado: any;

    service.registrarUsuario(dto).subscribe(val => (resultado = val));
    tick(1300);

    expect(resultado).toBeTruthy();
    expect(resultado.exitoso).toBe(true);
  }));

  it('debería agregar el nuevo usuario a la lista interna tras registrarlo', fakeAsync(() => {
    const dto: RegistroUsuarioDTO = {
      rfc: 'NUEV900101ZZ9',
      nombre: 'NUEVO USUARIO',
      primerApellido: 'NUEVO',
      segundoApellido: 'PRUEBA',
      correo: 'nuevo@test.com',
      confirmacionCorreo: 'nuevo@test.com',
      tipoPersona: TipoPersona.FISICA,
      tipoNacionalidad: TipoNacionalidad.MEXICANO,
      aceptaTerminos: true,
    };

    service.registrarUsuario(dto).subscribe();
    tick(1300);

    let listaFinal: any[] = [];
    service.listarUsuarios().subscribe(val => (listaFinal = val));
    tick(600);

    const usuarioAgregado = listaFinal.find(u => u.rfc === dto.rfc);
    expect(usuarioAgregado).toBeTruthy();
    expect(usuarioAgregado.estatus).toBe(EstatusUsuario.PENDIENTE_CORREO);
    expect(usuarioAgregado.roles).toEqual([]);
  }));

  // ─────────────────────────────────────────────────────────────
  // 7. modificarDatos
  // ─────────────────────────────────────────────────────────────

  it('debería retornar exitoso:true al modificar datos de un usuario', fakeAsync(() => {
    const rfcExistente = USUARIOS_MOCK[0].rfc;
    let resultado: any;

    service
      .modificarDatos(rfcExistente, { correo: 'nuevo@correo.com' })
      .subscribe(val => (resultado = val));
    tick(900);

    expect(resultado).toBeTruthy();
    expect(resultado.exitoso).toBe(true);
  }));

  // ─────────────────────────────────────────────────────────────
  // 8. bloquearUsuario
  // ─────────────────────────────────────────────────────────────

  it('debería retornar exitoso:true al bloquear un usuario', fakeAsync(() => {
    const rfcExistente = USUARIOS_MOCK[0].rfc;
    let resultado: any;

    service
      .bloquearUsuario(rfcExistente, 'Conducta indebida')
      .subscribe(val => (resultado = val));
    tick(800);

    expect(resultado).toBeTruthy();
    expect(resultado.exitoso).toBe(true);
  }));

  it('debería actualizar el estatus del usuario a BLOQUEADO', fakeAsync(() => {
    const rfcExistente = USUARIOS_MOCK[0].rfc;

    service.bloquearUsuario(rfcExistente, 'Motivo de prueba').subscribe();
    tick(800);

    let usuarioActualizado: any;
    service.buscarUsuario(rfcExistente).subscribe(val => (usuarioActualizado = val));
    tick(700);

    expect(usuarioActualizado?.estatus).toBe(EstatusUsuario.BLOQUEADO);
  }));

  // ─────────────────────────────────────────────────────────────
  // 9. desbloquearUsuario
  // ─────────────────────────────────────────────────────────────

  it('debería retornar exitoso:true al desbloquear un usuario', fakeAsync(() => {
    const rfcBloqueado = USUARIOS_MOCK[4].rfc; // Miguel - BLOQUEADO
    let resultado: any;

    service.desbloquearUsuario(rfcBloqueado).subscribe(val => (resultado = val));
    tick(800);

    expect(resultado).toBeTruthy();
    expect(resultado.exitoso).toBe(true);
  }));

  it('debería actualizar el estatus del usuario a ACTIVO al desbloquearlo', fakeAsync(() => {
    const rfcBloqueado = USUARIOS_MOCK[4].rfc;

    service.desbloquearUsuario(rfcBloqueado).subscribe();
    tick(800);

    let usuarioActualizado: any;
    service.buscarUsuario(rfcBloqueado).subscribe(val => (usuarioActualizado = val));
    tick(700);

    expect(usuarioActualizado?.estatus).toBe(EstatusUsuario.ACTIVO);
  }));

  // ─────────────────────────────────────────────────────────────
  // 10. getCatalogosRoles
  // ─────────────────────────────────────────────────────────────

  it('debería retornar objeto con roles, dependencias y unidades al obtener catálogos de roles', fakeAsync(() => {
    let resultado: any;

    service.getCatalogosRoles().subscribe(val => (resultado = val));
    tick(500);

    expect(resultado).toBeTruthy();
    expect(Array.isArray(resultado.roles)).toBe(true);
    expect(Array.isArray(resultado.dependencias)).toBe(true);
    expect(Array.isArray(resultado.unidades)).toBe(true);
    expect(resultado.roles.length).toBe(ROLES_MOCK.length);
    expect(resultado.dependencias.length).toBe(DEPENDENCIAS_MOCK.length);
    expect(resultado.unidades.length).toBe(UNIDADES_MOCK.length);
  }));

  // ─────────────────────────────────────────────────────────────
  // 11. asignarRol
  // ─────────────────────────────────────────────────────────────

  it('debería retornar exitoso:true al asignar un rol a un usuario', fakeAsync(() => {
    const dto: AsignarRolDTO = {
      rfcUsuario: USUARIOS_MOCK[0].rfc,
      rolId: 1,
      dependenciaId: 1,
      unidadAdministrativaId: 1,
    };
    let resultado: any;

    service.asignarRol(dto).subscribe(val => (resultado = val));
    tick(1000);

    expect(resultado).toBeTruthy();
    expect(resultado.exitoso).toBe(true);
    expect(resultado.mensaje).toBe('Rol asignado correctamente');
  }));

  it('debería retornar exitoso:true y mensaje al desasignar roles', fakeAsync(() => {
    const dto: DesasignarRolDTO = {
      rfcUsuario: USUARIOS_MOCK[1].rfc,
      rolIds: [2, 3],
      motivo: 'Baja de roles por solicitud',
    };
    let resultado: any;

    service.desasignarRoles(dto).subscribe(val => (resultado = val));
    tick(1000);

    expect(resultado).toBeTruthy();
    expect(resultado.exitoso).toBe(true);
    expect(resultado.mensaje).toBe('Roles desasignados correctamente');
  }));

  // ─────────────────────────────────────────────────────────────
  // 12. getCatalogoTramites
  // ─────────────────────────────────────────────────────────────

  it('debería retornar un array de trámites al obtener el catálogo', fakeAsync(() => {
    let resultado: any;

    service.getCatalogoTramites().subscribe(val => (resultado = val));
    tick(500);

    expect(Array.isArray(resultado)).toBe(true);
    expect(resultado.length).toBe(TRAMITES_MOCK.length);
    expect(resultado[0]).toHaveProperty('id');
    expect(resultado[0]).toHaveProperty('clave');
    expect(resultado[0]).toHaveProperty('nombre');
  }));

  // ─────────────────────────────────────────────────────────────
  // 13. cambiarCorreo
  // ─────────────────────────────────────────────────────────────

  it('debería retornar exitoso:true al cambiar el correo de un usuario', fakeAsync(() => {
    const dto: CambioCorreoDTO = {
      rfcUsuario: USUARIOS_MOCK[0].rfc,
      correoActual: 'arturo.gonzalez@empresa.com.mx',
      correoNuevo: 'arturo.nuevo@empresa.com.mx',
      confirmacionCorreo: 'arturo.nuevo@empresa.com.mx',
      motivoCambio: 'Actualización de datos personales',
    };
    let resultado: any;

    service.cambiarCorreo(dto).subscribe(val => (resultado = val));
    tick(1100);

    expect(resultado).toBeTruthy();
    expect(resultado.exitoso).toBe(true);
  }));

  // ─────────────────────────────────────────────────────────────
  // 14. asignarTramites
  // ─────────────────────────────────────────────────────────────

  it('debería retornar la cantidad correcta de trámites asignados', fakeAsync(() => {
    const tramiteIds = [1, 2, 3, 5];
    let resultado: any;

    service
      .asignarTramites(USUARIOS_MOCK[0].rfc, tramiteIds)
      .subscribe(val => (resultado = val));
    tick(900);

    expect(resultado).toBeTruthy();
    expect(resultado.exitoso).toBe(true);
    expect(resultado.asignados).toBe(tramiteIds.length);
  }));

  // ─────────────────────────────────────────────────────────────
  // 15. verificarRfc
  // ─────────────────────────────────────────────────────────────

  it('debería retornar valido:true al verificar un RFC', fakeAsync(() => {
    let resultado: any;

    service.verificarRfc('GOMA800101AB1').subscribe(val => (resultado = val));
    tick(700);

    expect(resultado).toBeTruthy();
    expect(resultado.valido).toBe(true);
    expect(resultado.rfc).toBe('GOMA800101AB1');
  }));

  it('debería indicar que el RFC ya existe cuando pertenece a un usuario registrado', fakeAsync(() => {
    const rfcExistente = USUARIOS_MOCK[0].rfc;
    let resultado: any;

    service.verificarRfc(rfcExistente).subscribe(val => (resultado = val));
    tick(700);

    expect(resultado.existe).toBe(true);
  }));

  it('debería indicar que el RFC no existe cuando no está registrado', fakeAsync(() => {
    let resultado: any;

    service.verificarRfc('XXXX000000XX0').subscribe(val => (resultado = val));
    tick(700);

    expect(resultado.valido).toBe(true);
    expect(resultado.existe).toBe(false);
  }));

  // ─────────────────────────────────────────────────────────────
  // 16. verificarFiel
  // ─────────────────────────────────────────────────────────────

  it('debería retornar valido:true con rfc y nombre al verificar la FIEL', fakeAsync(() => {
    const cerFile = new File(['contenido-cer'], 'certificado.cer', { type: 'application/octet-stream' });
    const keyFile = new File(['contenido-key'], 'llave.key', { type: 'application/octet-stream' });
    let resultado: any;

    service.verificarFiel(cerFile, keyFile, 'passphrase123').subscribe(val => (resultado = val));
    tick(1600);

    expect(resultado).toBeTruthy();
    expect(resultado.valido).toBe(true);
    expect(resultado.rfc).toBe('GOMA800101AB1');
    expect(resultado.nombre).toBe('ARTURO GONZALEZ MARTINEZ');
  }));

  // ─────────────────────────────────────────────────────────────
  // Pruebas adicionales
  // ─────────────────────────────────────────────────────────────

  it('debería retornar exitoso:true al reenviar confirmación de correo', fakeAsync(() => {
    let resultado: any;

    service.reenviarConfirmacion(USUARIOS_MOCK[3].rfc).subscribe(val => (resultado = val));
    tick(700);

    expect(resultado).toBeTruthy();
    expect(resultado.exitoso).toBe(true);
  }));

  it('debería retornar los accionistas de una persona moral existente', fakeAsync(() => {
    const rfcMoral = USUARIOS_MOCK[2].rfc; // 'IMPEX001231' - tiene accionistas
    let resultado: any;

    service.getAccionistas(rfcMoral).subscribe(val => (resultado = val));
    tick(600);

    expect(Array.isArray(resultado)).toBe(true);
    expect(resultado.length).toBeGreaterThan(0);
  }));

  it('debería retornar un array vacío de accionistas para RFC sin persona moral', fakeAsync(() => {
    let resultado: any;

    service.getAccionistas('RFC_INEXISTENTE').subscribe(val => (resultado = val));
    tick(600);

    expect(Array.isArray(resultado)).toBe(true);
    expect(resultado.length).toBe(0);
  }));

  it('debería retornar exitoso:true al dar de alta un accionista', fakeAsync(() => {
    let resultado: any;

    service
      .altaAccionista(USUARIOS_MOCK[2].rfc, {
        rfc: 'NUEV900101ZZ9',
        nombre: 'Nuevo',
        primerApellido: 'Accionista',
        tipoPersona: TipoPersona.FISICA,
        tipoNacionalidad: TipoNacionalidad.MEXICANO,
        porcentajeParticipacion: 40,
        activo: true,
        fechaAlta: '2024-01-01',
      })
      .subscribe(val => (resultado = val));
    tick(1000);

    expect(resultado).toBeTruthy();
    expect(resultado.exitoso).toBe(true);
  }));

  it('debería retornar exitoso:true al dar de baja un accionista', fakeAsync(() => {
    let resultado: any;

    service.bajaAccionista(USUARIOS_MOCK[2].rfc, 1).subscribe(val => (resultado = val));
    tick(800);

    expect(resultado).toBeTruthy();
    expect(resultado.exitoso).toBe(true);
  }));

  it('debería retornar exitoso:true al dar de alta un capturista', fakeAsync(() => {
    let resultado: any;

    service
      .altaCapturista(USUARIOS_MOCK[0].rfc, {
        rfc: 'CAPT900101AB1',
        curp: 'CAPT900101HDFABC09',
        nombre: 'Capturista',
        primerApellido: 'Prueba',
        correo: 'capturista@test.com',
        activo: true,
        fechaAlta: '2024-01-01',
      })
      .subscribe(val => (resultado = val));
    tick(1000);

    expect(resultado).toBeTruthy();
    expect(resultado.exitoso).toBe(true);
  }));

  it('debería retornar exitoso:true al crear una suplencia', fakeAsync(() => {
    let resultado: any;

    service
      .crearSuplencia({
        rfcTitular: USUARIOS_MOCK[0].rfc,
        nombreTitular: 'Arturo González',
        rfcSuplente: USUARIOS_MOCK[1].rfc,
        nombreSuplente: 'Patricia Pérez',
        fechaInicio: '2024-04-01',
        fechaFin: '2024-04-30',
        motivo: 'Vacaciones',
        activa: true,
      })
      .subscribe(val => (resultado = val));
    tick(1000);

    expect(resultado).toBeTruthy();
    expect(resultado.exitoso).toBe(true);
  }));

  it('debería retornar exitoso:true al cancelar una suplencia', fakeAsync(() => {
    let resultado: any;

    service.cancelarSuplencia(1).subscribe(val => (resultado = val));
    tick(800);

    expect(resultado).toBeTruthy();
    expect(resultado.exitoso).toBe(true);
  }));

  it('debería retornar valido:true con CURP y nombre completo al verificar CURP', fakeAsync(() => {
    const curpPrueba = 'GOMA800101HDFNRN09';
    let resultado: any;

    service.verificarCurp(curpPrueba).subscribe(val => (resultado = val));
    tick(900);

    expect(resultado).toBeTruthy();
    expect(resultado.valido).toBe(true);
    expect(resultado.curp).toBe(curpPrueba);
    expect(resultado.nombreCompleto).toBe('NOMBRE VERIFICADO RENAPO');
  }));

  // ─────────────────────────────────────────────────────────────
  // listarUsuarios con filtros
  // ─────────────────────────────────────────────────────────────

  it('debería filtrar usuarios por búsqueda de texto', fakeAsync(() => {
    // Primero registramos un usuario para tener datos frescos
    let resultado: any;
    service.listarUsuarios({ busqueda: 'GOMA' }).subscribe(val => (resultado = val));
    tick(600);
    expect(Array.isArray(resultado)).toBe(true);
    expect(resultado.some((u: any) => u.rfc.includes('GOMA'))).toBe(true);
  }));

  it('debería filtrar usuarios por estatus', fakeAsync(() => {
    let resultado: any;
    service.listarUsuarios({ estatus: EstatusUsuario.ACTIVO }).subscribe(val => (resultado = val));
    tick(600);
    expect(Array.isArray(resultado)).toBe(true);
    resultado.forEach((u: any) => expect(u.estatus).toBe(EstatusUsuario.ACTIVO));
  }));

  // ─────────────────────────────────────────────────────────────
  // getCapturistas / bajaCapturista
  // ─────────────────────────────────────────────────────────────

  it('debería retornar un array de capturistas para un RFC existente', fakeAsync(() => {
    let resultado: any;
    service.getCapturistas(USUARIOS_MOCK[0].rfc).subscribe(val => (resultado = val));
    tick(600);
    expect(Array.isArray(resultado)).toBe(true);
  }));

  it('debería retornar exitoso:true al dar de baja un capturista', fakeAsync(() => {
    let resultado: any;
    service.bajaCapturista(USUARIOS_MOCK[0].rfc, 1).subscribe(val => (resultado = val));
    tick(800);
    expect(resultado.exitoso).toBe(true);
  }));

  // ─────────────────────────────────────────────────────────────
  // getPersonasOirRecibir / altaPersonaOirRecibir
  // ─────────────────────────────────────────────────────────────

  it('debería retornar un array de personas oír/recibir para un RFC', fakeAsync(() => {
    let resultado: any;
    service.getPersonasOirRecibir(USUARIOS_MOCK[0].rfc).subscribe(val => (resultado = val));
    tick(600);
    expect(Array.isArray(resultado)).toBe(true);
  }));

  it('debería retornar exitoso:true al dar de alta una persona oír/recibir', fakeAsync(() => {
    let resultado: any;
    service.altaPersonaOirRecibir(USUARIOS_MOCK[0].rfc, {
      rfc: 'REPR900101AB1',
      nombre: 'Representante',
      primerApellido: 'Prueba',
      correo: 'repr@test.com',
      activo: true,
      fechaAlta: '2024-01-01',
    }).subscribe(val => (resultado = val));
    tick(1000);
    expect(resultado.exitoso).toBe(true);
  }));

  // ─────────────────────────────────────────────────────────────
  // getSuplencias
  // ─────────────────────────────────────────────────────────────

  it('debería retornar un array de suplencias para un RFC', fakeAsync(() => {
    let resultado: any;
    service.getSuplencias(USUARIOS_MOCK[0].rfc).subscribe(val => (resultado = val));
    tick(600);
    expect(Array.isArray(resultado)).toBe(true);
  }));
});
