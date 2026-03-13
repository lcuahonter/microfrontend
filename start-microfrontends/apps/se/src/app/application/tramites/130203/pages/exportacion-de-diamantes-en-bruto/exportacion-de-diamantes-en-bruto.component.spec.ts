import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExportacionDeDiamantesEnBrutoComponent } from './exportacion-de-diamantes-en-bruto.component';
import { PASOS_EXPORTACION } from '../../constants/exportacion-de-diamantes-en-bruto.enum';
import { AccionBoton } from '../../enums/accion-botton.enum';
import { BtnContinuarComponent, WizardComponent } from '@libs/shared/data-access-user/src';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ExportacionDeDiamantesEnBrutoComponent', () => {
  let component: ExportacionDeDiamantesEnBrutoComponent;
  let fixture: ComponentFixture<ExportacionDeDiamantesEnBrutoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WizardComponent, BtnContinuarComponent, HttpClientTestingModule],
      providers: [],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ExportacionDeDiamantesEnBrutoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize pasosSolicitar with PASOS_EXPORTACION', () => {
    expect(component.pasosSolicitar).toEqual(PASOS_EXPORTACION);
  });

  it('should initialize datosPasos correctly', () => {
    expect(component.datosPasos).toEqual({
      nroPasos: PASOS_EXPORTACION.length,
      indice: 1,
      txtBtnAnt: 'Anterior',
      txtBtnSig: 'Continuar',
    });
  });

  it('should update indice and call wizardComponent.siguiente() on "cont" action', () => {
    const mockWizardComponent = { siguiente: jest.fn(), atras: jest.fn() };
    component.wizardComponent = mockWizardComponent as unknown as WizardComponent;

    const accionBoton: AccionBoton = { valor: 2, accion: 'cont' };
    component.getValorIndice(accionBoton);

    expect(component.indice).toBe(2);
    expect(mockWizardComponent.siguiente).toHaveBeenCalled();
    expect(mockWizardComponent.atras).not.toHaveBeenCalled();
  });

  it('should update indice and call wizardComponent.atras() on non-"cont" action', () => {
    const mockWizardComponent = { siguiente: jest.fn(), atras: jest.fn() };
    component.wizardComponent = mockWizardComponent as unknown as WizardComponent;

    const accionBoton: AccionBoton = { valor: 2, accion: 'back' };
    component.getValorIndice(accionBoton);

    expect(component.indice).toBe(2);
    expect(mockWizardComponent.atras).toHaveBeenCalled();
    expect(mockWizardComponent.siguiente).not.toHaveBeenCalled();
  });

  it('should not update indice or call wizardComponent methods if valor is out of range', () => {
    const mockWizardComponent = { siguiente: jest.fn(), atras: jest.fn() };
    component.wizardComponent = mockWizardComponent as unknown as WizardComponent;

    const accionBoton: AccionBoton = { valor: 5, accion: 'cont' };
    component.getValorIndice(accionBoton);

    expect(component.indice).toBe(1);
    expect(mockWizardComponent.siguiente).not.toHaveBeenCalled();
    expect(mockWizardComponent.atras).not.toHaveBeenCalled();
  });
});