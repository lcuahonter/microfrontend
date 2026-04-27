import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideRouter } from '@angular/router';

import { RecuperarPasswordComponent } from './recuperar-password.component';

describe('RecuperarPasswordComponent', () => {
  let component: RecuperarPasswordComponent;
  let fixture: ComponentFixture<RecuperarPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecuperarPasswordComponent, ReactiveFormsModule],
      providers: [provideRouter([])],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(RecuperarPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('tipoUsuarioCtrl, metodoCtrl y valorIdentificadorCtrl deberían existir', () => {
    expect(component.tipoUsuarioCtrl).toBeTruthy();
    expect(component.metodoCtrl).toBeTruthy();
    expect(component.valorIdentificadorCtrl).toBeTruthy();
  });

  it('tipoUsuarioCtrl debería iniciar con valor mexicano', () => {
    expect(component.tipoUsuarioCtrl.value).toBe('mexicano');
  });

  it('metodoCtrl debería iniciar con valor rfc', () => {
    expect(component.metodoCtrl.value).toBe('rfc');
  });

  it('valorIdentificadorCtrl debería iniciar con cadena vacía', () => {
    expect(component.valorIdentificadorCtrl.value).toBe('');
  });

  it('el signal cargando debería iniciar en false', () => {
    expect(component.cargando()).toBe(false);
  });

  it('el signal enviado debería iniciar en false', () => {
    expect(component.enviado()).toBe(false);
  });

  it('cambiar tipoUsuarioCtrl a extranjero debería actualizar el valor del control', () => {
    component.tipoUsuarioCtrl.setValue('extranjero');
    expect(component.tipoUsuarioCtrl.value).toBe('extranjero');
  });

  it('cambiar tipoUsuarioCtrl a extranjero no debería resetear metodoCtrl automáticamente', () => {
    component.tipoUsuarioCtrl.setValue('extranjero');
    // El componente no resetea metodoCtrl en código; el valor se mantiene
    expect(component.metodoCtrl.value).toBe('rfc');
  });

  it('onFirmado() debería poner enviado() en true', () => {
    component.onFirmado({ rfc: 'GOMA800101AB1' });
    expect(component.enviado()).toBe(true);
  });

  it('cambiar metodoCtrl a curp debería actualizar el valor', () => {
    component.metodoCtrl.setValue('curp');
    expect(component.metodoCtrl.value).toBe('curp');
  });

  it('cambiar metodoCtrl a fiel debería actualizar el valor', () => {
    component.metodoCtrl.setValue('fiel');
    expect(component.metodoCtrl.value).toBe('fiel');
  });

  describe('enviar()', () => {
    it('debería poner cargando en true inmediatamente al llamar enviar()', fakeAsync(() => {
      component.valorIdentificadorCtrl.setValue('GOMA800101AB1');
      component.enviar();
      expect(component.cargando()).toBe(true);
      tick(1000);
    }));

    it('debería poner enviado en true después de 1000ms', fakeAsync(() => {
      component.valorIdentificadorCtrl.setValue('GOMA800101AB1');
      component.enviar();
      tick(1000);
      expect(component.enviado()).toBe(true);
    }));

    it('debería poner cargando en false después de 1000ms', fakeAsync(() => {
      component.valorIdentificadorCtrl.setValue('GOMA800101AB1');
      component.enviar();
      tick(1000);
      expect(component.cargando()).toBe(false);
    }));
  });
});
