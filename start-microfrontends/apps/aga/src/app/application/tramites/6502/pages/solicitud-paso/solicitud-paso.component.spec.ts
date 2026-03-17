import { AccionBoton, WizardComponent,BtnContinuarComponent } from '@libs/shared/data-access-user/src';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SolicitudPasoComponent } from './solicitud-paso.component';
import { PASOS } from "@libs/shared/data-access-user/src/core/enums/6502/modificacion.enum";
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
@Component({
  selector: 'app-wizard',
  template: ''
})
class MockWizardComponent {
  siguiente = jest.fn();
  atras = jest.fn();
}
describe('SolicitudPasoComponent', () => {
  let component: SolicitudPasoComponent;
  let fixture: ComponentFixture<SolicitudPasoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SolicitudPasoComponent, MockWizardComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SolicitudPasoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.wizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn(),
    } as unknown as any;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initial State', () => {
    it('should initialize with correct default values', () => {
      expect(component.indice).toBe(1);
      expect(component.pasos).toEqual(PASOS);
      expect(component.datosPasos).toEqual({
        nroPasos: PASOS.length,
        indice: 1,
        txtBtnAnt: 'Anterior',
        txtBtnSig: 'Continuar'
      });
    });
  });

  describe('getValorIndice', () => {

    it('should handle "cont" action correctly', () => {
      const EVENTO: AccionBoton = { valor: 2, accion: 'cont' };
      component.getValorIndice(EVENTO);
      expect(component.indice).toBe(2);
      expect(component.wizardComponent.siguiente).toHaveBeenCalled();
    });
    

    it('should handle "atras" action correctly', () => {
      component.indice = 3; // Set to higher value first
      const testAction: AccionBoton = { accion: 'atras', valor: 2 };
      
      component.getValorIndice(testAction);
      
      expect(component.indice).toBe(2);
      expect(component.wizardComponent.atras).toHaveBeenCalled();
    });

    it('should not change index for invalid values (less than 1)', () => {
      const initialIndex = component.indice;
      const testAction: AccionBoton = { accion: 'cont', valor: 0 };
      
      component.getValorIndice(testAction);
      
      expect(component.indice).toBe(initialIndex);
    });

    it('should not change index for invalid values (greater than 4)', () => {
      const initialIndex = component.indice;
      const testAction: AccionBoton = { accion: 'cont', valor: 5 };
      
      component.getValorIndice(testAction);
      
      expect(component.indice).toBe(initialIndex);
      expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
    });
  });
});