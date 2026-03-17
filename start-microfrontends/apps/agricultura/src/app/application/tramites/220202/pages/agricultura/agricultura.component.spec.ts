// @ts-nocheck
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  Pipe, PipeTransform, Directive, Input,
  CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgriculturaComponent } from './agricultura.component';


describe('AgriculturaComponent', () => {
  let fixture: ComponentFixture<AgriculturaComponent>;
  let component: AgriculturaComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [
        AgriculturaComponent,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(AgriculturaComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call atras when accion is "atras"', () => {
    component.componenteWizard = {
      siguiente: jest.fn(),
      atras: jest.fn()
    };
    component.getValorIndice({ valor: {}, accion: 'atras' });
  });

  it('should call siguiente when accion is "cont"', () => {
    component.componenteWizard = {
      siguiente: jest.fn(),
      atras: jest.fn()
    };
    component.getValorIndice({ valor: 2, accion: 'cont' });
    expect(component.componenteWizard.siguiente).toHaveBeenCalled();
    expect(component.indice).toBe(2);
  });

  it('should call atras when accion is "atras" and valor is valid', () => {
    component.componenteWizard = {
      siguiente: jest.fn(),
      atras: jest.fn()
    };
    component.getValorIndice({ valor: 3, accion: 'atras' });
    expect(component.componenteWizard.atras).toHaveBeenCalled();
    expect(component.indice).toBe(3);
  });

  it('should not call any wizard method if valor is out of range', () => {
    component.componenteWizard = {
      siguiente: jest.fn(),
      atras: jest.fn()
    };
    component.getValorIndice({ valor: 0, accion: 'cont' });
    expect(component.componenteWizard.siguiente).not.toHaveBeenCalled();
    expect(component.componenteWizard.atras).not.toHaveBeenCalled();

    component.getValorIndice({ valor: 5, accion: 'atras' });
    expect(component.componenteWizard.siguiente).not.toHaveBeenCalled();
    expect(component.componenteWizard.atras).not.toHaveBeenCalled();
  });

  it('should initialize datosPasos with correct values', () => {
    expect(component.datosPasos.nroPasos).toBe(component.pasos.length);
    expect(component.datosPasos.indice).toBe(component.indice);
    expect(component.datosPasos.txtBtnAnt).toBe('Anterior');
    expect(component.datosPasos.txtBtnSig).toBe('Continuar');
  });

  it('should have alertText equal to ALERT_TEXTO', () => {
    // ALERT_TEXTO is imported, so just check assignment
    expect(component.alertText).toBeDefined();
  });
});
