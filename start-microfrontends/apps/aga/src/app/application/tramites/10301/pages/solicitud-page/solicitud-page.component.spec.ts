import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SolicitudPageComponent } from './solicitud-page.component';
import { PASOS, SolicitanteComponent, WizardComponent } from '@ng-mf/data-access-user';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SolicitudPageComponent', () => {
  let component: SolicitudPageComponent;
  let fixture: ComponentFixture<SolicitudPageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [
        WizardComponent,
        SolicitudPageComponent,
        HttpClientTestingModule,
        SolicitanteComponent
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(SolicitudPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();  
    fixture.detectChanges(); 
  }));

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize TEXTO_DE_ALERTA with correct value', () => {
    expect(component.TEXTO_DE_ALERTA).toContain('número temporal');
  });

  it('should initialize pasos with PASOS constant', () => {
    expect(component.pasos).toEqual(PASOS);
  });

  it('should initialize datosPasos with correct structure', () => {
    expect(component.datosPasos).toEqual({
      nroPasos: PASOS.length,
      indice: 1,
      txtBtnAnt: 'Anterior',
      txtBtnSig: 'Continuar'
    });
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