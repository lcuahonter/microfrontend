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
    const MOCK_WIZARD_COMPONENT = {
      siguiente: jest.fn(),
      atras: jest.fn(),
    };
    component.wizardComponent = MOCK_WIZARD_COMPONENT as unknown as WizardComponent;

    component.getValorIndice({ accion: 'cont', valor: 2 });
    expect(component.indice).toBe(2);
    expect(MOCK_WIZARD_COMPONENT.siguiente).toHaveBeenCalled();

    component.getValorIndice({ accion: 'back', valor: 1 });
    expect(component.indice).toBe(1);
    expect(MOCK_WIZARD_COMPONENT.atras).toHaveBeenCalled();
  });

  it('should not update indice if valor is out of range', () => {
    const MOCK_WIZARD_COMPONENT = {
      siguiente: jest.fn(),
      atras: jest.fn(),
    };
    component.wizardComponent = MOCK_WIZARD_COMPONENT as unknown as WizardComponent;
    const initialIndice = component.indice;

    component.getValorIndice({ accion: 'cont', valor: 0 });
    expect(component.indice).toBe(initialIndice);

    component.getValorIndice({ accion: 'cont', valor: 999 });
    expect(component.indice).toBe(initialIndice);
  });

  it('should call atras if accion is not "cont"', () => {
    const MOCK_WIZARD_COMPONENT = {
      siguiente: jest.fn(),
      atras: jest.fn(),
    };
    component.wizardComponent = MOCK_WIZARD_COMPONENT as unknown as WizardComponent;
    component.datosPasos = { busquedaPermisosComponent: { validarFormulario: () => true } } as any;

    component.getValorIndice({ accion: 'back', valor: 2 });
    expect(component.indice).toBe(2);
    expect(MOCK_WIZARD_COMPONENT.atras).toHaveBeenCalled();
    expect(MOCK_WIZARD_COMPONENT.siguiente).not.toHaveBeenCalled();
  });
});