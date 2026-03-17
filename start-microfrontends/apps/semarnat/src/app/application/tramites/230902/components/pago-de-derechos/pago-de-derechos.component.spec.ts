import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { PagoDeDerechosComponent } from './pago-de-derechos.component';
import { PermisoCitesService } from '../../services/permiso-cites.service';
import { Tramite230902Store } from '../../estados/tramite230902.store';
import { Tramite230902Query } from '../../estados/tramite230902.query';
import { CatalogoSelectComponent, InputFechaComponent, TituloComponent } from '@libs/shared/data-access-user/src';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('PagoDeDerechosComponent', () => {
  let component: PagoDeDerechosComponent;
  let fixture: ComponentFixture<PagoDeDerechosComponent>;
  let permisoCitesServiceMock: any;
  let tramite230902StoreMock: any;
  let tramite230902QueryMock: any;

  beforeEach(async () => {
    permisoCitesServiceMock = {
      inicializaPagoDeDerechosDatosCatalogos: jest.fn(),
    };
    tramite230902StoreMock = {
      setfecPago: jest.fn(),
      setbancoseleccionado: jest.fn(),
      setllaveDePago: jest.fn(),
      establecerDatos: jest.fn(),
    };
    tramite230902QueryMock = {
      selectSolicitud$: of({
        claveDeReferencia: '123',
        cadenaPagoDependencia: 'cadena',
        banco: 'banco',
        bancoseleccionado: 'banco',
        llaveDePago: 'llave',
        fecPago: '2023-01-01',
        impPago: 100,
      }),
    };

    await TestBed.configureTestingModule({
      declarations: [PagoDeDerechosComponent],
      imports: [ReactiveFormsModule, TituloComponent, CatalogoSelectComponent, InputFechaComponent],
      providers: [
        { provide: PermisoCitesService, useValue: permisoCitesServiceMock },
        { provide: Tramite230902Store, useValue: tramite230902StoreMock },
        { provide: Tramite230902Query, useValue: tramite230902QueryMock },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PagoDeDerechosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should handle cambioFechaFinal', () => {
    component.cambioFechaFinal('2023-02-01');
    expect(tramite230902StoreMock.setfecPago).toHaveBeenCalledWith('2023-02-01');
  });

  it('should clean up subscriptions on ngOnDestroy', () => {
    const destroyed$Spy = jest.spyOn(component['destroyed$'], 'next');
    component.ngOnDestroy();
    expect(destroyed$Spy).toHaveBeenCalled();
  });

  // Nuevos tests en español

  it('debería inicializar el formulario con los valores del estado', () => {
    expect(component.formPagoDerechos.get('claveDeReferencia')?.value).toBe('123');
    expect(component.formPagoDerechos.get('cadenaPagoDependencia')?.value).toBe('cadena');
    expect(component.formPagoDerechos.get('banco')?.value).toBe('banco');
    expect(component.formPagoDerechos.get('llaveDePago')?.value).toBe('llave');
    expect(component.formPagoDerechos.get('fecPago')?.value).toBe('2023-01-01');
    expect(component.formPagoDerechos.get('impPago')?.value).toBe(100);
  });

  it('debería deshabilitar los campos claveDeReferencia, cadenaPagoDependencia e impPago', () => {
    expect(component.formPagoDerechos.get('claveDeReferencia')?.disabled).toBe(true);
    expect(component.formPagoDerechos.get('cadenaPagoDependencia')?.disabled).toBe(true);
    expect(component.formPagoDerechos.get('impPago')?.disabled).toBe(true);
  });

  it('debería cambiar la llave de pago a mayúsculas', () => {
    component.formPagoDerechos.get('llaveDePago')?.setValue('abc123');
    component.onllavaDePagoChange();
    expect(component.formPagoDerechos.get('llaveDePago')?.value).toBe('ABC123');
  });

  it('debería actualizar el valor en el store usando setValoresStore', () => {
    component.formPagoDerechos.get('banco')?.setValue('nuevoBanco');
    component.setValoresStore(component.formPagoDerechos, 'banco');
    expect(tramite230902StoreMock.establecerDatos).toHaveBeenCalledWith({ banco: 'nuevoBanco' });
  });

  it('debería deshabilitar el formulario y la fecha si es solo lectura', () => {
    component.esFormularioSoloLectura = true;
    component.formPagoDerechos.enable();
    component.fechaFinalInput.habilitado = true;
    component.fechaFinalInput.required = true;
    component.guardarDatosFormulario();
  });

  it('debería habilitar el formulario y la fecha si no es solo lectura', () => {
    component.esFormularioSoloLectura = false;
    component.formPagoDerechos.disable();
    component.fechaFinalInput.habilitado = false;
    component.fechaFinalInput.required = false;
    component.guardarDatosFormulario();
  });

  it('debería llamar a inicializarEstadoFormulario en el constructor', () => {
    const spy = jest.spyOn(PagoDeDerechosComponent.prototype as any, 'inicializarEstadoFormulario');
    // For this test, we need to re-create the component to trigger the constructor
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      declarations: [PagoDeDerechosComponent],
      imports: [ReactiveFormsModule, TituloComponent, CatalogoSelectComponent, InputFechaComponent],
      providers: [
        { provide: PermisoCitesService, useValue: permisoCitesServiceMock },
        { provide: Tramite230902Store, useValue: tramite230902StoreMock },
        { provide: Tramite230902Query, useValue: tramite230902QueryMock },
        { provide: FormBuilder, useValue: new FormBuilder() }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });
    TestBed.createComponent(PagoDeDerechosComponent);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});