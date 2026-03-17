import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImportacionNeumaticosComercializarComponent } from './importacion-neumaticos-comercializar.component';
import { BtnContinuarComponent, SolicitanteComponent, WizardComponent } from '@libs/shared/data-access-user/src';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ImportacionNeumaticosComercializarComponent', () => {
  let component: ImportacionNeumaticosComercializarComponent;
  let fixture: ComponentFixture<ImportacionNeumaticosComercializarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WizardComponent, BtnContinuarComponent, SolicitanteComponent,HttpClientModule],
      declarations: [ImportacionNeumaticosComercializarComponent,PasoUnoComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ImportacionNeumaticosComercializarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.indice).toBe(1);
    expect(component.pasosSolicitar.length).toBeGreaterThan(0);
    expect(component.datosPasos.nroPasos).toBe(component.pasosSolicitar.length);
    expect(component.datosPasos.indice).toBe(component.indice);
    expect(component.datosPasos.txtBtnAnt).toBe('Anterior');
    expect(component.datosPasos.txtBtnSig).toBe('Continuar');
  });

  it('should update indice and call wizardComponent.siguiente() on getValorIndice with accion "cont"', () => {
    component.wizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn(),
    } as any;

    const accionBoton = { accion: 'cont', valor: 2 };
    component.getValorIndice(accionBoton);

    expect(component.indice).toBe(accionBoton.valor);
    expect(component.wizardComponent.siguiente).toHaveBeenCalled();
  });

  it('should update indice and call wizardComponent.atras() on getValorIndice with accion "atras"', () => {
    component.wizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn(),
    } as any;

    const accionBoton = { accion: 'atras', valor: 2 };
    component.getValorIndice(accionBoton);

    expect(component.indice).toBe(accionBoton.valor);
    expect(component.wizardComponent.atras).toHaveBeenCalled();
  });

  it('should not update indice or call wizardComponent methods if valor is out of range', () => {
    component.wizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn(),
    } as any;

    const accionBoton = { accion: 'cont', valor: 5 };
    component.getValorIndice(accionBoton);

    expect(component.indice).not.toBe(accionBoton.valor);
    expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
    expect(component.wizardComponent.atras).not.toHaveBeenCalled();
  });
});
