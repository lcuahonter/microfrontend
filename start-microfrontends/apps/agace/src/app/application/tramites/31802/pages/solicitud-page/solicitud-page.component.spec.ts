import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SolicitudPageComponent } from './solicitud-page.component';
import { WizardComponent } from '@ng-mf/data-access-user';
import { PASOS } from '@ng-mf/data-access-user';

describe('SolicitudPageComponent', () => {
  let component: SolicitudPageComponent;
  let fixture: ComponentFixture<SolicitudPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SolicitudPageComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SolicitudPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.TEXTO_DE_ALERTA).toBe(
      'La solicitud ha quedado registrada con el número temporal 202757598 Éste no tiene validez legal y sirve solamente para efectos de identificar tu solicitud. Un folio oficial le será asignado a la solicitud al momento en que ésta sea firmada.'
    );
    expect(component.pasos).toEqual(PASOS);
    expect(component.indice).toBe(1);
    expect(component.datosPasos).toEqual({
      nroPasos: PASOS.length,
      indice: 1,
      txtBtnAnt: 'Anterior',
      txtBtnSig: 'Continuar',
    });
  });

  it('should select a tab on seleccionaTab', () => {
    component.seleccionaTab(3);
    expect(component.indice).toBe(3);
  });

  it('should handle getValorIndice for "cont" action', () => {
    const mockWizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn(),
    };
    component.wizardComponent =
      mockWizardComponent as unknown as WizardComponent;

    component.pasoUnoComponent = {
      registroForm: {
        markAllAsTouched: jest.fn(),
        updateValueAndValidity: jest.fn(),
        get: jest.fn((controlName: string) => {
          return { invalid: false };
        }),
      },
      solicitudComponent: {
        validarFormulario: jest.fn().mockReturnValue(true),
      },
    } as unknown as any;
    const accionBoton = { accion: 'cont', valor: 2 };
    component.getValorIndice(accionBoton);

    expect(component.indice).toBe(1);
    mockWizardComponent.siguiente();
    expect(mockWizardComponent.siguiente).toHaveBeenCalled();
    expect(mockWizardComponent.atras).not.toHaveBeenCalled();
    expect(
      component.pasoUnoComponent.registroForm.markAllAsTouched
    ).toHaveBeenCalled();
    expect(
      component.pasoUnoComponent.registroForm.updateValueAndValidity
    ).toHaveBeenCalled();
  });

  it('should handle getValorIndice for "atras" action', () => {
    const mockWizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn(),
    };
    component.wizardComponent =
      mockWizardComponent as unknown as WizardComponent;

    component.pasoUnoComponent = {
      registroForm: {
        markAllAsTouched: jest.fn(),
        updateValueAndValidity: jest.fn(),
        get: jest.fn((controlName: string) => {
        return { invalid: false };
      }),
      },
      solicitudComponent: {
        validarFormulario: jest.fn().mockReturnValue(true),
      },
    } as unknown as any;

    const accionBoton = { accion: 'atras', valor: 2 };
    component.getValorIndice(accionBoton);
    mockWizardComponent.atras();
    expect(component.indice).toBe(1);
    expect(mockWizardComponent.atras).toHaveBeenCalled();
    expect(mockWizardComponent.siguiente).not.toHaveBeenCalled();
  });

  it('should not change indice or call wizard methods if valor is out of range', () => {
    const mockWizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn(),
    };
    component.wizardComponent =
      mockWizardComponent as unknown as WizardComponent;

    const accionBoton = { accion: 'cont', valor: 6 };
    component.getValorIndice(accionBoton);

    expect(component.indice).toBe(1);
    expect(mockWizardComponent.siguiente).not.toHaveBeenCalled();
    expect(mockWizardComponent.atras).not.toHaveBeenCalled();
  });
});