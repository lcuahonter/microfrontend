import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

import { RegistroWizardComponent } from './registro-wizard.component';
import { UsuariosApiService } from '../../../core/services/usuarios-api.service';
import { Router } from '@angular/router';

const mockApi = {
  registrarUsuario: jest.fn().mockReturnValue(of({ exitoso: true })),
};

const mockRouter = { navigate: jest.fn() };

describe('RegistroWizardComponent', () => {
  let component: RegistroWizardComponent;
  let fixture: ComponentFixture<RegistroWizardComponent>;

  beforeEach(async () => {
    jest.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [RegistroWizardComponent],
      providers: [
        { provide: UsuariosApiService, useValue: mockApi },
        { provide: Router, useValue: mockRouter },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistroWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // 1. Creación del componente
  it('debería crear el componente correctamente', () => {
    expect(component).toBeTruthy();
  });

  // 2. Estado inicial
  it('debe iniciar con paso=0, cargando=false, registroExitoso=false y fielData=null', () => {
    expect(component.paso()).toBe(0);
    expect(component.cargando()).toBe(false);
    expect(component.registroExitoso()).toBe(false);
    expect(component.fielData).toBeNull();
  });

  // 3. pasos tiene 6 elementos
  it('debería tener exactamente 6 pasos definidos en el wizard', () => {
    expect(component.pasos.length).toBe(6);
  });

  it('debería definir los pasos con los labels correctos', () => {
    const labels = component.pasos.map(p => p.label);
    expect(labels).toEqual(['Tipo', 'Datos', 'Correo', 'Términos', 'e.firma', 'Confirmar']);
  });

  // 4. formDatos inválido sin rfc y nombre
  it('debe considerar formDatos como inválido cuando rfc y nombre están vacíos', () => {
    component.formDatos.setValue({
      rfc: '',
      curp: '',
      nombre: '',
      primerApellido: '',
      segundoApellido: '',
    });
    expect(component.formDatos.valid).toBe(false);
  });

  // 5. formDatos válido con rfc y nombre
  it('debería considerar formDatos como válido cuando rfc y nombre tienen valor', () => {
    component.formDatos.setValue({
      rfc: 'XAXX010101000',
      curp: '',
      nombre: 'Juan',
      primerApellido: 'Pérez',
      segundoApellido: '',
    });
    expect(component.formDatos.valid).toBe(true);
  });

  // 6. formCorreo inválido sin correo
  it('debe considerar formCorreo como inválido cuando el correo está vacío', () => {
    component.formCorreo.setValue({ correo: '', confirmacion: '' });
    expect(component.formCorreo.valid).toBe(false);
  });

  // 7. puedeContinuar() en paso 0 retorna true
  it('debería retornar true en puedeContinuar() cuando el paso actual es 0', () => {
    component.paso.set(0);
    expect(component.puedeContinuar()).toBe(true);
  });

  // 8a. puedeContinuar() en paso 1: false si formDatos inválido
  it('debe retornar false en puedeContinuar() cuando está en paso 1 y formDatos es inválido', () => {
    component.paso.set(1);
    component.formDatos.setValue({
      rfc: '',
      curp: '',
      nombre: '',
      primerApellido: '',
      segundoApellido: '',
    });
    expect(component.puedeContinuar()).toBe(false);
  });

  // 8b. puedeContinuar() en paso 1: true si formDatos válido
  it('debería retornar true en puedeContinuar() cuando está en paso 1 y formDatos es válido', () => {
    component.paso.set(1);
    component.formDatos.setValue({
      rfc: 'XAXX010101000',
      curp: '',
      nombre: 'Juan',
      primerApellido: 'Pérez',
      segundoApellido: '',
    });
    expect(component.puedeContinuar()).toBe(true);
  });

  // 9a. puedeContinuar() en paso 3: false si aceptaTerminos=false
  it('debe retornar false en puedeContinuar() cuando está en paso 3 y no se aceptaron los términos', () => {
    component.paso.set(3);
    component.aceptaTerminosCtrl.setValue(false);
    expect(component.puedeContinuar()).toBe(false);
  });

  // 9b. puedeContinuar() en paso 3: true si aceptaTerminos=true
  it('debería retornar true en puedeContinuar() cuando está en paso 3 y se aceptaron los términos', () => {
    component.paso.set(3);
    component.aceptaTerminosCtrl.setValue(true);
    expect(component.puedeContinuar()).toBe(true);
  });

  // 10a. puedeContinuar() en paso 4: false si fielData=null
  it('debe retornar false en puedeContinuar() cuando está en paso 4 y fielData es null', () => {
    component.paso.set(4);
    component.fielData = null;
    expect(component.puedeContinuar()).toBe(false);
  });

  // 10b. puedeContinuar() en paso 4: true si fielData existe
  it('debería retornar true en puedeContinuar() cuando está en paso 4 y fielData tiene datos', () => {
    component.paso.set(4);
    component.fielData = { certificado: 'cert-data', llave: 'key-data' };
    expect(component.puedeContinuar()).toBe(true);
  });

  // 11a. avanzar() incrementa paso si puedeContinuar() es true
  it('debería incrementar el paso al llamar avanzar() cuando puedeContinuar() es true', () => {
    component.paso.set(0);
    component.avanzar();
    expect(component.paso()).toBe(1);
  });

  // 11b. avanzar() no incrementa paso si puedeContinuar() es false
  it('no debe incrementar el paso al llamar avanzar() cuando puedeContinuar() es false', () => {
    component.paso.set(1);
    component.formDatos.setValue({
      rfc: '',
      curp: '',
      nombre: '',
      primerApellido: '',
      segundoApellido: '',
    });
    component.avanzar();
    expect(component.paso()).toBe(1);
  });

  // 12. retroceder() decrementa paso
  it('debería decrementar el paso al llamar retroceder()', () => {
    component.paso.set(3);
    component.retroceder();
    expect(component.paso()).toBe(2);
  });

  // 13. onFirmado() asigna fielData
  it('debería asignar el valor recibido a fielData al llamar onFirmado()', () => {
    const datosFirma = { certificado: 'abc123', llave: 'xyz789', rfc: 'XAXX010101000' };
    component.onFirmado(datosFirma);
    expect(component.fielData).toEqual(datosFirma);
  });

  // 14. registrar() llama api.registrarUsuario y setea registroExitoso=true en éxito
  it('debería llamar a api.registrarUsuario y establecer registroExitoso=true al completar el registro', fakeAsync(() => {
    mockApi.registrarUsuario.mockReturnValue(of({ exitoso: true }));

    component.formDatos.setValue({
      rfc: 'XAXX010101000',
      curp: '',
      nombre: 'Juan',
      primerApellido: 'Pérez',
      segundoApellido: '',
    });
    component.formCorreo.setValue({
      correo: 'juan@example.com',
      confirmacion: 'juan@example.com',
    });
    component.aceptaTerminosCtrl.setValue(true);

    component.registrar();
    tick();

    expect(mockApi.registrarUsuario).toHaveBeenCalledTimes(1);
    expect(component.registroExitoso()).toBe(true);
    expect(component.cargando()).toBe(false);
  }));

  it('debe establecer cargando=true antes de recibir respuesta al registrar', fakeAsync(() => {
    let cargandoDuranteLlamada = false;
    mockApi.registrarUsuario.mockImplementation(() => {
      cargandoDuranteLlamada = component.cargando();
      return of({ exitoso: true });
    });

    component.registrar();
    tick();

    expect(cargandoDuranteLlamada).toBe(true);
  }));

  // 15. irAlLogin() navega a /login
  it('debería navegar a /login al llamar irAlLogin()', () => {
    component.irAlLogin();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });
});
