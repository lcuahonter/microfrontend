import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExportacionHidrocarburosComponent } from './exportacion-hidrocarburos.component';
import { WizardComponent } from '@libs/shared/data-access-user/src';
import { PASOS_EXPORTACION } from '../../constants/exportacion-minerales-de-hierro-pasos.enum';
import { AccionBoton } from '../../enums/accion-botton.enum';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

describe('ExportacionHidrocarburosComponent', () => {
  let component: ExportacionHidrocarburosComponent;
  let fixture: ComponentFixture<ExportacionHidrocarburosComponent>;
  let wizardComponentSpy: Partial<WizardComponent>;

  beforeEach(async () => {
    wizardComponentSpy = {
      siguiente: jest.fn(),
      atras: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [ExportacionHidrocarburosComponent],
      providers: [{ provide: WizardComponent, useValue: wizardComponentSpy }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ExportacionHidrocarburosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
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

  it('should update indice and call siguiente on wizardComponent when AccionBoton is "cont"', () => {
    const ACTION: AccionBoton = { accion: 'cont', valor: 2 };
    component.wizardComponent = wizardComponentSpy as WizardComponent;

    component.getValorIndice(ACTION);

    expect(component.indice).toBe(2);
    expect(wizardComponentSpy.siguiente).toHaveBeenCalled();
  });

  it('should update indice and call atras on wizardComponent when AccionBoton is not "cont"', () => {
    const ACTION: AccionBoton = { accion: 'ant', valor: 1 };
    component.wizardComponent = wizardComponentSpy as WizardComponent;

    component.getValorIndice(ACTION);

    expect(component.indice).toBe(1);
    expect(wizardComponentSpy.atras).toHaveBeenCalled();
  });

  it('should not call siguiente or atras when AccionBoton value is out of bounds', () => {
    const ACTION: AccionBoton = { accion: 'cont', valor: 5 };
    component.wizardComponent = wizardComponentSpy as WizardComponent;

    component.getValorIndice(ACTION);

    expect(component.indice).toBe(1); // Remains unchanged
    expect(wizardComponentSpy.siguiente).not.toHaveBeenCalled();
    expect(wizardComponentSpy.atras).not.toHaveBeenCalled();
  });

  it('should correctly set tabIndex', () => {
    expect(component.tabIndex).toBe(1);
  });
});
