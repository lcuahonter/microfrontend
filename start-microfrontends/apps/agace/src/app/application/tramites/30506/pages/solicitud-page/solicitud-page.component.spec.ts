import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolicitudPageComponent } from './solicitud-page.component';
import { BtnContinuarComponent, WizardComponent, PASOS, SolicitanteComponent } from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PasoDosComponent } from '../paso-dos/paso-dos.component';
import { PasoTresComponent } from '../paso-tres/paso-tres.component';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SolicitudPageComponent', () => {
  let component: SolicitudPageComponent;
  let fixture: ComponentFixture<SolicitudPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        SolicitudPageComponent,
        PasoUnoComponent,
        PasoDosComponent,
        PasoTresComponent
      ],
      imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        BtnContinuarComponent,
        WizardComponent,
        SolicitanteComponent,
        HttpClientTestingModule
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(SolicitudPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with correct default values', () => {
    expect(component.TEXTO_DE_ALERTA).toBe(
      'La solicitud ha quedado registrada con el número temporal 202757598 Éste no tiene validez legal y sirve solamente para efectos de identificar tu solicitud. Un folio oficial le será asignado a la solicitud al momento en que ésta sea firmada.'
    );
    expect(component.pasos).toEqual(PASOS);
    expect(component.indice).toBe(1);
    expect(component.datosPasos.nroPasos).toBe(PASOS.length);
    expect(component.datosPasos.indice).toBe(1);
    expect(component.datosPasos.txtBtnAnt).toBe('Anterior');
    expect(component.datosPasos.txtBtnSig).toBe('Continuar');
  });

  describe('seleccionaTab', () => {
    it('should update indice when seleccionaTab is called', () => {
      component.seleccionaTab(2);
      expect(component.indice).toBe(2);
    });

    it('should update indice to different values', () => {
      component.seleccionaTab(3);
      expect(component.indice).toBe(3);

      component.seleccionaTab(1);
      expect(component.indice).toBe(1);

      component.seleccionaTab(4);
      expect(component.indice).toBe(4);
    });

    it('should accept zero as a valid index', () => {
      component.seleccionaTab(0);
      expect(component.indice).toBe(0);
    });

    it('should accept negative numbers', () => {
      component.seleccionaTab(-1);
      expect(component.indice).toBe(-1);
    });
  });

  describe('getValorIndice', () => {
    beforeEach(() => {
      component.wizardComponent = {
        siguiente: jest.fn(),
        atras: jest.fn()
      } as any;
    });

    it('should update indice and call siguiente when accion is "cont" and valor is valid', () => {
      const accionBoton = { accion: 'cont', valor: 2 };
      
      component.getValorIndice(accionBoton);
      
      expect(component.indice).toBe(2);
      expect(component.wizardComponent.siguiente).toHaveBeenCalled();
      expect(component.wizardComponent.atras).not.toHaveBeenCalled();
    });

    it('should update indice and call atras when accion is not "cont" and valor is valid', () => {
      const accionBoton = { accion: 'prev', valor: 3 };
      
      component.getValorIndice(accionBoton);
      
      expect(component.indice).toBe(3);
      expect(component.wizardComponent.atras).toHaveBeenCalled();
      expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
    });

    it('should not update indice or call wizard methods when valor is 0', () => {
      const accionBoton = { accion: 'cont', valor: 0 };
      const initialIndice = component.indice;
      
      component.getValorIndice(accionBoton);
      
      expect(component.indice).toBe(initialIndice);
      expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
      expect(component.wizardComponent.atras).not.toHaveBeenCalled();
    });

    it('should not update indice or call wizard methods when valor is 5', () => {
      const accionBoton = { accion: 'cont', valor: 5 };
      const initialIndice = component.indice;
      
      component.getValorIndice(accionBoton);
      
      expect(component.indice).toBe(initialIndice);
      expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
      expect(component.wizardComponent.atras).not.toHaveBeenCalled();
    });

    it('should not update indice or call wizard methods when valor is negative', () => {
      const accionBoton = { accion: 'cont', valor: -1 };
      const initialIndice = component.indice;
      
      component.getValorIndice(accionBoton);
      
      expect(component.indice).toBe(initialIndice);
      expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
      expect(component.wizardComponent.atras).not.toHaveBeenCalled();
    });

    it('should work with valor 1 (lower boundary)', () => {
      const accionBoton = { accion: 'cont', valor: 1 };
      
      component.getValorIndice(accionBoton);
      
      expect(component.indice).toBe(1);
      expect(component.wizardComponent.siguiente).toHaveBeenCalled();
    });

    it('should work with valor 4 (upper boundary)', () => {
      const accionBoton = { accion: 'prev', valor: 4 };
      
      component.getValorIndice(accionBoton);
      
      expect(component.indice).toBe(4);
      expect(component.wizardComponent.atras).toHaveBeenCalled();
    });

    it('should handle empty string accion correctly', () => {
      const accionBoton = { accion: '', valor: 2 };
      
      component.getValorIndice(accionBoton);
      
      expect(component.indice).toBe(2);
      expect(component.wizardComponent.atras).toHaveBeenCalled();
      expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
    });

    it('should handle different accion values correctly', () => {
      const accionBoton1 = { accion: 'continue', valor: 2 };
      const accionBoton2 = { accion: 'back', valor: 3 };
      
      component.getValorIndice(accionBoton1);
      expect(component.wizardComponent.atras).toHaveBeenCalledTimes(1);
      
      component.getValorIndice(accionBoton2);
      expect(component.wizardComponent.atras).toHaveBeenCalledTimes(2);
    });
  });

  describe('Component properties', () => {
    it('should have wizardComponent as ViewChild', () => {
      expect(component.wizardComponent).toBeDefined();
    });

    it('should initialize datosPasos with correct structure', () => {
      expect(component.datosPasos).toEqual({
        nroPasos: PASOS.length,
        indice: 1,
        txtBtnAnt: 'Anterior',
        txtBtnSig: 'Continuar',
      });
    });

    it('should maintain pasos reference to PASOS constant', () => {
      expect(component.pasos).toBe(PASOS);
    });
  });
});