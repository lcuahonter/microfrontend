import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BtnContinuarComponent, WizardComponent } from '@libs/shared/data-access-user/src';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { PantallasComponent } from './pantallas.component';

describe('PantallasComponent', () => {
  let component: PantallasComponent;
  let fixture: ComponentFixture<PantallasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PantallasComponent],
      imports: [
        WizardComponent,
        BtnContinuarComponent
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PantallasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should update the indice and navigate wizard on getValorIndice call', () => {
    const mockWizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn(),
    };
    component.wizardComponent = mockWizardComponent as unknown as WizardComponent;

    component.datos = { busquedaPermisosComponent: { validarFormulario: () => true } } as any;

    component.getValorIndice({ accion: 'cont', valor: 2 });
    expect(component.indice).toBe(2);
    expect(mockWizardComponent.siguiente).toHaveBeenCalled();

    component.getValorIndice({ accion: 'back', valor: 1 });
    expect(component.indice).toBe(1);
    expect(mockWizardComponent.atras).toHaveBeenCalled();
  });

  it('should not update indice if valor is out of range', () => {
    const mockWizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn(),
    };
    component.wizardComponent = mockWizardComponent as unknown as WizardComponent;
    const initialIndice = component.indice;

    component.getValorIndice({ accion: 'cont', valor: 0 });
    expect(component.indice).toBe(initialIndice);

    component.getValorIndice({ accion: 'cont', valor: 999 });
    expect(component.indice).toBe(initialIndice);
  });

  it('should not proceed if esValido is false on first step', () => {
    const mockWizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn(),
    };
    component.wizardComponent = mockWizardComponent as unknown as WizardComponent;
    component.indice = 1;
    component.datos = { busquedaPermisosComponent: { validarFormulario: () => false } } as any;

    component.getValorIndice({ accion: 'cont', valor: 2 });
    expect(component.indice).toBe(1);
    expect(component.datosPasos.indice).toBe(1);
    expect(mockWizardComponent.siguiente).not.toHaveBeenCalled();
  });

  it('should call atras if accion is not "cont"', () => {
    const mockWizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn(),
    };
    component.wizardComponent = mockWizardComponent as unknown as WizardComponent;
    component.datos = { busquedaPermisosComponent: { validarFormulario: () => true } } as any;

    component.getValorIndice({ accion: 'back', valor: 2 });
    expect(component.indice).toBe(2);
    expect(mockWizardComponent.atras).toHaveBeenCalled();
    expect(mockWizardComponent.siguiente).not.toHaveBeenCalled();
  });

  it('should set esValido to result of validarFormulario when indice is 1', () => {
    const mockWizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn(),
    };
    component.wizardComponent = mockWizardComponent as unknown as WizardComponent;
    const validarFormulario = jest.fn().mockReturnValue(true);
    component.datos = { busquedaPermisosComponent: { validarFormulario } } as any;
    component.indice = 1;

    component.getValorIndice({ accion: 'cont', valor: 2 });
    expect(validarFormulario).toHaveBeenCalled();
    expect(component.esValido).toBe(true);
  });
});