import { Pantallas301Module } from './../../../301/pantallas.module';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProcesoCompletoComponent } from './proceso-completo.component';
import { AccionBoton, BtnContinuarComponent, SolicitanteComponent, SolicitanteService, WizardComponent } from '@libs/shared/data-access-user/src';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('ProcesoCompletoComponent', () => {
  let component: ProcesoCompletoComponent;
  let fixture: ComponentFixture<ProcesoCompletoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProcesoCompletoComponent, PasoUnoComponent],
      imports: [WizardComponent, BtnContinuarComponent, Pantallas301Module, SolicitanteComponent],
      providers: [
        SolicitanteService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProcesoCompletoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.indice).toBe(1);
    expect(component.pasos).toBeDefined();
    expect(component.pasos.length).toBeGreaterThan(0);
    expect(component.datosPasos).toEqual({
      nroPasos: component.pasos.length,
      indice: 1,
      txtBtnAnt: 'Anterior',
      txtBtnSig: 'Continuar',
    });
  });

  it('should define wizardComponent after initialization', () => {
    fixture.detectChanges();
    expect(component.wizardComponent).toBeDefined();
  });

  it('should update indice when seleccionaTab is called', () => {
    component.seleccionaTab(3);
    expect(component.indice).toBe(3);
  });

  it('should respond to button actions correctly', () => {
    const mockAccionBoton: AccionBoton = { accion: 'ant', valor: 1 };
    const spyBack = jest.spyOn(component.wizardComponent, 'atras');
    
    component.getValorIndice(mockAccionBoton);
    expect(spyBack).toHaveBeenCalled();
    expect(component.indice).toBe(1);
  });
  
  it('should handle invalid AccionBoton inputs gracefully', () => {
    const mockAccionBoton: AccionBoton = { accion: 'invalid', valor: 3 };
    expect(() => component.getValorIndice(mockAccionBoton)).not.toThrow();
  });

  it('should trigger WizardComponent methods on valid actions', () => {
    const spyNext = jest.spyOn(component.wizardComponent, 'siguiente');
    component.getValorIndice({ accion: 'cont', valor: 2 });
    expect(spyNext).toHaveBeenCalled();
  });

  it('should not update indice for out-of-range values', () => {
    const mockAccionBoton: AccionBoton = { accion: 'cont', valor: 6 };
    component.getValorIndice(mockAccionBoton);
    expect(component.indice).not.toBe(6);
  });
  
});
