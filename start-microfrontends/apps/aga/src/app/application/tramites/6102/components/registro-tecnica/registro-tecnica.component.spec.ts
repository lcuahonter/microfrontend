import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { of as observableOf } from 'rxjs';

import { RegistroTecnicaComponent } from './registro-tecnica.component';
import { Solicitud6102Store } from '../../estados/solicitud6102.store';
import { Solicitud6102Query } from '../../estados/solicitud6102.query';
import { Router } from '@angular/router';

@Injectable()
class MockSolicitud6102Store {
  setRadioParcial = jest.fn();
}

@Injectable()
class MockSolicitud6102Query {
  seleccionarSolicitud$ = observableOf({ radioParcial: 'test' });
}

@Injectable()
class MockRouter {
  private _url = '';

  set testUrl(value: string) {
    this._url = value;
  }

  get url() {
    return this._url;
  }

  navigate = jest.fn();
}

describe('RegistroTecnicaComponent', () => {
  let fixture: ComponentFixture<RegistroTecnicaComponent>;
  let component: RegistroTecnicaComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, RegistroTecnicaComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        FormBuilder,
        { provide: Solicitud6102Store, useClass: MockSolicitud6102Store },
        { provide: Solicitud6102Query, useClass: MockSolicitud6102Query },
        { provide: Router, useClass: MockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegistroTecnicaComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    component.ngOnDestroy();
    fixture.destroy();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should run ngOnInit()', () => {
    const initSpy = jest.spyOn(component, 'inicializarFormulario');
    component.ngOnInit();
    expect(initSpy).toHaveBeenCalled();
  });

  it('should run ngOnDestroy()', () => {
    const nextSpy = jest.spyOn(component['destroyNotifier$'], 'next');
    const completeSpy = jest.spyOn(component['destroyNotifier$'], 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should initialize the form with radioParcial value', () => {
    component.solicitudState = { radioParcial: 'parcial' } as any;
    component.fb = new FormBuilder();
    component.inicializarFormulario();
    expect(component.reunionForm.get('radioParcial')?.value).toBe('parcial');
  });

  it('should call store method with form value in setValoresStore()', () => {
    const mockForm = {
      get: () => ({ value: 'testValue' })
    } as any;

    const storeSpy = jest.spyOn(component['store'], 'setRadioParcial' as any);
    component.setValoresStore(mockForm, 'radioParcial', 'setRadioParcial');
    expect(storeSpy).toHaveBeenCalledWith('testValue');
  });

  it('should navigate to aga route if url contains "aga"', () => {
    (component.router as unknown as MockRouter).testUrl = '/aga/some-path';
    component.onSiguienteClick();
    expect(component.router.navigate).toHaveBeenCalledWith(['/aga/junta-tecnica-registro/solicitud']);
  });

it('should navigate to pago route if url contains "pago"', () => {
  (component.router as unknown as MockRouter).testUrl = '/pago/some-path';
  component.onSiguienteClick();
  expect(component.router.navigate).toHaveBeenCalledWith(['/pago/junta-tecnica-registro/solicitud']);
});

  it('should mark radioParcial as invalid when empty', () => {
    component.solicitudState = { radioParcial: '' } as any;
    component.fb = new FormBuilder();
    component.inicializarFormulario();
    const control = component.reunionForm.get('radioParcial');
    control?.setValue('');
    expect(control?.valid).toBe(false);
    expect(control?.hasError('required')).toBe(true);
  });
});
