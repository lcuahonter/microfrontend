import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoUnoComponent } from './paso-uno.component';
import { SolicitanteComponent } from '@libs/shared/data-access-user/src';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { of, Subject } from 'rxjs';

describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let fixture: ComponentFixture<PasoUnoComponent>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PasoUnoComponent],
      imports: [SolicitanteComponent,HttpClientTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('validateAllForms should return true if destinatarioComponent is undefined', () => {
    component.destinatarioComponent = undefined as any;
    expect(component.validateAllForms()).toBe(true);
  });

  it('validateAllForms should call validateAllForms on destinatarioComponent', () => {
    component.destinatarioComponent = { validateAllForms: jest.fn(() => false) } as any;
    expect(component.validateAllForms()).toBe(false);
    expect(component.destinatarioComponent.validateAllForms).toHaveBeenCalled();
  });

  it('guardarDatosFormulario should update store if response', () => {
    const mockService = {
      getRegistroTomaMuestrasMercanciasData: jest.fn(() => of({ foo: 'bar' })),
      actualizarEstadoFormulario: jest.fn()
    };
    component.validarInicialmenteCertificadoService = mockService as any;
    component.destroyNotifier$ = new Subject();
    component.esDatosRespuesta = false;
    component.guardarDatosFormulario(component.consultaState?.id_solicitud);
    expect(mockService.getRegistroTomaMuestrasMercanciasData).toHaveBeenCalled();
  });

  it('seleccionaTab should set indice', () => {
    component.indice = 0;
    component.seleccionaTab(3);
    expect(component.indice).toBe(3);
  });

  it('validarFormularios should return false if solicitante is undefined', () => {
    component.solicitante = undefined as any;
    component.certificadoOrigen = undefined as any;
    component.destinatarioComponent = undefined as any;
    component.datosCertificado = undefined as any;
    expect(component.validarFormularios()).toBe(false);
  });

  it('validarFormularios should markAllAsTouched and return false if form invalid', () => {
    const form = { invalid: true, markAllAsTouched: jest.fn() };
    component.solicitante = { form } as any;
    component.certificadoOrigen = undefined as any;
    component.destinatarioComponent = undefined as any;
    component.datosCertificado = undefined as any;
    expect(component.validarFormularios()).toBe(false);
    expect(form.markAllAsTouched).toHaveBeenCalled();
  });

  it('validarFormularios should return false if certificadoOrigen is undefined', () => {
    component.solicitante = { form: { invalid: false, markAllAsTouched: jest.fn() } } as any;
    component.certificadoOrigen = undefined as any;
    component.destinatarioComponent = undefined as any;
    component.datosCertificado = undefined as any;
    expect(component.validarFormularios()).toBe(false);
  });

  it('validarFormularios should return false if certificadoOrigen.validarFormulario is false', () => {
    component.solicitante = { form: { invalid: false, markAllAsTouched: jest.fn() } } as any;
    component.certificadoOrigen = { validarFormulario: jest.fn(() => false) } as any;
    component.destinatarioComponent = undefined as any;
    component.datosCertificado = undefined as any;
    expect(component.validarFormularios()).toBe(false);
  });

  it('validarFormularios should return false if destinatarioComponent is undefined', () => {
    component.solicitante = { form: { invalid: false, markAllAsTouched: jest.fn() } } as any;
    component.certificadoOrigen = { validarFormulario: jest.fn(() => true) } as any;
    component.destinatarioComponent = undefined as any;
    component.datosCertificado = undefined as any;
    expect(component.validarFormularios()).toBe(false);
  });

  it('validarFormularios should return false if destinatarioComponent.validarFormulario is false', () => {
    component.solicitante = { form: { invalid: false, markAllAsTouched: jest.fn() } } as any;
    component.certificadoOrigen = { validarFormulario: jest.fn(() => true) } as any;
    component.destinatarioComponent = { validarFormulario: jest.fn(() => false) } as any;
    component.datosCertificado = undefined as any as any;
    expect(component.validarFormularios()).toBe(false);
  });

  it('validarFormularios should return false if datosCertificado is undefined', () => {
    component.solicitante = { form: { invalid: false, markAllAsTouched: jest.fn() } } as any;
    component.certificadoOrigen = { validarFormulario: jest.fn(() => true) } as any;
    component.destinatarioComponent = { validarFormulario: jest.fn(() => true) } as any;
    component.datosCertificado = undefined as any as any;
    expect(component.validarFormularios()).toBe(false);
  });

  it('validarFormularios should return false if datosCertificado.validateAll is false', () => {
    component.solicitante = { form: { invalid: false, markAllAsTouched: jest.fn() } } as any;
    component.certificadoOrigen = { validarFormulario: jest.fn(() => true) } as any;
    component.destinatarioComponent = { validarFormulario: jest.fn(() => true) } as any;
    component.datosCertificado = { validateAll: jest.fn(() => false) } as any;
    expect(component.validarFormularios()).toBe(false);
  });

  it('validarFormularios should return true if all valid', () => {
    component.solicitante = { form: { invalid: false, markAllAsTouched: jest.fn() } } as any;
    component.certificadoOrigen = { validarFormulario: jest.fn(() => true) } as any;
    component.destinatarioComponent = { validarFormulario: jest.fn(() => true) } as any;
    component.datosCertificado = { validateAll: jest.fn(() => true) } as any;
    expect(component.validarFormularios()).toBe(true);
  });
});
