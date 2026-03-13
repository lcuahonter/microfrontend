import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelacionesComponent } from './cancelaciones.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CANCELACIONES_PASOS } from '../../constantes/cancelaciones.enum';

describe('CancelacionesComponent', () => {
  let component: CancelacionesComponent;
  let fixture: ComponentFixture<CancelacionesComponent>;
  let mockWizardComponent: { siguiente: jest.Mock; atras: jest.Mock };

  beforeEach(async () => {
    mockWizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [CancelacionesComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CancelacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.wizardComponent = mockWizardComponent as any;
  });

  beforeEach(() => {
    mockWizardComponent.siguiente.mockClear();
    mockWizardComponent.atras.mockClear();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializar con los valores por defecto correctos', () => {
    expect(component.indice).toBe(1);
    expect(component.pantallasPasos).toBe(CANCELACIONES_PASOS);
    expect(component.datosPasos.nroPasos).toBe(CANCELACIONES_PASOS.length);
    expect(component.datosPasos.indice).toBe(1);
    expect(component.datosPasos.txtBtnAnt).toBe('Anterior');
    expect(component.datosPasos.txtBtnSig).toBe('Continuar');
  });

  it('debe actualizar el índice y llamar a siguiente en getValorIndice con acción "cont"', () => {
    component.indice = 1;
    component.getValorIndice({ valor: 2, accion: 'cont' });
    expect(component.indice).toBe(2);
    expect(mockWizardComponent.siguiente).toHaveBeenCalled();
    expect(mockWizardComponent.atras).not.toHaveBeenCalled();
  });

  it('debe actualizar el índice y llamar a atras en getValorIndice con acción "atras"', () => {
    component.indice = 2;
    component.getValorIndice({ valor: 3, accion: 'atras' });
    expect(component.indice).toBe(3);
    expect(mockWizardComponent.atras).toHaveBeenCalled();
    expect(mockWizardComponent.siguiente).not.toHaveBeenCalled();
  });

  it('no debe actualizar el índice ni llamar métodos del wizardComponent si el valor está fuera de rango (0)', () => {
    component.indice = 1;
    component.getValorIndice({ valor: 0, accion: 'cont' });
    expect(component.indice).toBe(1);
    expect(mockWizardComponent.siguiente).not.toHaveBeenCalled();
    expect(mockWizardComponent.atras).not.toHaveBeenCalled();
  });

  it('no debe actualizar el índice ni llamar métodos del wizardComponent si el valor está fuera de rango (5)', () => {
    component.indice = 1;
    component.getValorIndice({ valor: 5, accion: 'atras' });
    expect(component.indice).toBe(1);
    expect(mockWizardComponent.siguiente).not.toHaveBeenCalled();
    expect(mockWizardComponent.atras).not.toHaveBeenCalled();
  });

  it('debe llamar a atras si la acción no es "cont"', () => {
    component.indice = 2;
    component.getValorIndice({ valor: 3, accion: 'atras' });
    expect(mockWizardComponent.atras).toHaveBeenCalled();
  });

  it('debe llamar a siguiente si la acción es "cont"', () => {
    component.indice = 2;
    component.getValorIndice({ valor: 3, accion: 'cont' });
    expect(mockWizardComponent.siguiente).toHaveBeenCalled();
  });

  it('no debe lanzar error si wizardComponent es undefined', () => {
    component.wizardComponent = undefined as any;
    expect(() => component.getValorIndice({ valor: 2, accion: 'cont' })).not.toThrow();
    expect(() => component.getValorIndice({ valor: 2, accion: 'atras' })).not.toThrow();
  });
});