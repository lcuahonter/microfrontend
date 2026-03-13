
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PantallasComponent } from './pantallas.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BtnContinuarComponent, SolicitanteComponent, WizardComponent } from '@libs/shared/data-access-user/src';
import { AlertComponent } from 'ngx-bootstrap/alert';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { PasoDosComponent } from '../paso-dos/paso-dos.component';
import { PasoTresComponent } from '../paso-tres/paso-tres.component';
import { FormaServicioService } from '../../services/forma-servicio/forma-servicio.service';
import { FORMA_INVALIDO_ALERTA, FORMA_VALIDO_ALERTA } from '../../constantes/cancelacion-garantia.enum';
import { PANTA_PASOS } from '@libs/shared/data-access-user/src/core/services/31601/servicios-pantallas.enum';
import { AccionBoton } from '@libs/shared/data-access-user/src';
import { Component } from '@angular/core';

describe('PantallasComponent', () => {
  let component: PantallasComponent;
  let fixture: ComponentFixture<PantallasComponent>;
  let mockFormaServicioService: jest.Mocked<FormaServicioService>;
  @Component({ selector: 'lib-wizard', template: '' })
  class WizardComponentStub {
    siguiente = jest.fn();
    atras = jest.fn();
  }
  
  beforeEach(async () => {

    mockFormaServicioService = {
      isFormValid: jest.fn()
    } as unknown as jest.Mocked<FormaServicioService>;

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, WizardComponent, AlertComponent, BtnContinuarComponent, SolicitanteComponent],
      declarations: [PantallasComponent, PasoUnoComponent, PasoDosComponent, PasoTresComponent],
      providers: [
        { provide: FormaServicioService, useValue: mockFormaServicioService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PantallasComponent);
    component = fixture.componentInstance;
    const wizardComponent = new WizardComponentStub();
    component.wizardComponent = wizardComponent as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize default values', () => {
    expect(component.indice).toBe(1);
    expect(component.pantallasPasos).toBe(PANTA_PASOS);
    expect(component.datosPasos.nroPasos).toBe(PANTA_PASOS.length);
    expect(component.datosPasos.indice).toBe(1);
    expect(component.formaInvalidoAlerta).toBe(FORMA_INVALIDO_ALERTA.mensaje);
    expect(component.formaValidoAlerta).toBe(FORMA_VALIDO_ALERTA.mensaje);
  });

  it('verificarLaValidezDelFormulario should return true if form is valid', () => {
    mockFormaServicioService.isFormValid.mockReturnValue(true);
    expect(component.verificarLaValidezDelFormulario()).toBe(true);
  });

  it('verificarLaValidezDelFormulario should return false if form is invalid', () => {
    mockFormaServicioService.isFormValid.mockReturnValue(false);
    expect(component.verificarLaValidezDelFormulario()).toBe(false);
  });

  it('getValorIndice should update indice, datosPasos.indice and call siguiente() on action "cont"', () => {
  mockFormaServicioService.isFormValid.mockReturnValue(true);
  const event: AccionBoton = { valor: 2, accion: 'cont' };
  component.wizardComponent = {
    siguiente: jest.fn(),
    atras: jest.fn()
  } as any;
  component.getValorIndice(event);
  expect(component.esFormaValido).toBe(true);
  expect(component.indice).toBe(2);
  expect(component.datosPasos.indice).toBe(2);
  expect(component.wizardComponent.siguiente).toHaveBeenCalled();
});

  it('getValorIndice should call atras() on action "ant"', () => {
    mockFormaServicioService.isFormValid.mockReturnValue(true);
    const event: AccionBoton = { valor: 1, accion: 'ant' };
    component.wizardComponent = {
    siguiente: jest.fn(),
    atras: jest.fn()
  } as any;
    component.getValorIndice(event);
    expect(component.wizardComponent.atras).toHaveBeenCalled();
  });

  it('getValorIndice should not update or call wizard methods if valor is out of bounds', () => {
    mockFormaServicioService.isFormValid.mockReturnValue(true);
    component.wizardComponent = {
    siguiente: jest.fn(),
    atras: jest.fn()
  } as any;
    const invalidEvent: AccionBoton = { valor: 999, accion: 'cont' };
    const originalIndice = component.indice;
    component.getValorIndice(invalidEvent);
    expect(component.indice).toBe(originalIndice);
    expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
  });
});
