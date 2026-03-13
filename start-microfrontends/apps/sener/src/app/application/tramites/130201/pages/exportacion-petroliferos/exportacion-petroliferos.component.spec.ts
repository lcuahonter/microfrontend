import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExportacionPetroliferosComponent } from './exportacion-petroliferos.component';
import { WizardComponent } from '@libs/shared/data-access-user/src';
import { PASOS_EXPORTACION } from '../../constants/exportacion-minerales-de-hierro-pasos.enum';
import { AccionBoton } from '../../enums/accion-botton.enum';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

describe('ExportacionPetroliferosComponent', () => {
  let component: ExportacionPetroliferosComponent;
  let fixture: ComponentFixture<ExportacionPetroliferosComponent>;
  let wizardComponentSpy: Partial<WizardComponent>;

  beforeEach(async () => {
    wizardComponentSpy = {
      siguiente: jest.fn(),
      atras: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [ExportacionPetroliferosComponent],
      providers: [{ provide: WizardComponent, useValue: wizardComponentSpy }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ExportacionPetroliferosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar pasosSolicitar con PASOS_EXPORTACION', () => {
    expect(component.pasosSolicitar).toEqual(PASOS_EXPORTACION);
  });

  it('debería inicializar datosPasos correctamente', () => {
    expect(component.datosPasos).toEqual({
      nroPasos: PASOS_EXPORTACION.length,
      indice: 1,
      txtBtnAnt: 'Anterior',
      txtBtnSig: 'Continuar',
    });
  });

  it('debería actualizar el índice y llamar a siguiente en wizardComponent cuando AccionBoton sea "cont"', () => {
    const ACTION: AccionBoton = { accion: 'cont', valor: 2 };
    component.wizardComponent = wizardComponentSpy as WizardComponent;

    component.getValorIndice(ACTION);

    expect(component.indice).toBe(2);
    expect(wizardComponentSpy.siguiente).toHaveBeenCalled();
  });

  it('debería actualizar el índice y llamar a atras en wizardComponent cuando AccionBoton no sea "cont"', () => {
    const ACTION: AccionBoton = { accion: 'ant', valor: 1 };
    component.wizardComponent = wizardComponentSpy as WizardComponent;

    component.getValorIndice(ACTION);

    expect(component.indice).toBe(1);
    expect(wizardComponentSpy.atras).toHaveBeenCalled();
  });

  it('no debería llamar a siguiente ni atras cuando el valor de AccionBoton esté fuera de los límites', () => {
    const ACTION: AccionBoton = { accion: 'cont', valor: 5 };
    component.wizardComponent = wizardComponentSpy as WizardComponent;

    component.getValorIndice(ACTION);

    expect(component.indice).toBe(1); // Permanece sin cambios
    expect(wizardComponentSpy.siguiente).not.toHaveBeenCalled();
    expect(wizardComponentSpy.atras).not.toHaveBeenCalled();
  });

  it('debería establecer correctamente tabIndex', () => {
    expect(component.tabIndex).toBe(1);
  });
});
