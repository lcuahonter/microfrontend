import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PantallasComponent } from './pantallas.component';
import { WizardComponent } from '@libs/shared/data-access-user/src';
import { PANTA_PASOS } from '../../../../../../../../../libs/shared/data-access-user/src/core/enums/120404/pantallas260514.enum';
import { AccionBoton } from '../../../../../../../../../libs/shared/data-access-user/src/core/models/260514/aviso-pantallas.model';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('PantallasComponent', () => {
  let component: PantallasComponent;
  let fixture: ComponentFixture<PantallasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PantallasComponent],
      schemas: [NO_ERRORS_SCHEMA], 
    }).compileComponents();

    fixture = TestBed.createComponent(PantallasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializar pantallasPasos y datosPasos correctamente', () => {
    expect(component.pantallasPasos).toEqual(PANTA_PASOS);
    expect(component.datosPasos).toEqual({
      nroPasos: PANTA_PASOS.length,
      indice: 1,
      txtBtnAnt: 'Anterior',
      txtBtnSig: 'Continuar',
    });
  });

  it('debe actualizar el índice y navegar hacia adelante cuando getValorIndice es llamado con "cont"', () => {
    const mockWizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn(),
    };
    component.wizardComponent = mockWizardComponent as unknown as WizardComponent;

    const accion: AccionBoton = { valor: 2, accion: 'cont' };
    component.getValorIndice(accion);

    expect(component.indice).toBe(2);
    expect(component.datosPasos.indice).toBe(2);
    expect(mockWizardComponent.siguiente).toHaveBeenCalled();
    expect(mockWizardComponent.atras).not.toHaveBeenCalled();
  });

  it('debe actualizar el índice y navegar hacia atrás cuando getValorIndice es llamado con "atras"', () => {
    const mockWizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn(),
    };
    component.wizardComponent = mockWizardComponent as unknown as WizardComponent;

    const accion: AccionBoton = { valor: 1, accion: 'atras' };
    component.getValorIndice(accion);

    expect(component.indice).toBe(1);
    expect(component.datosPasos.indice).toBe(1);
    expect(mockWizardComponent.atras).toHaveBeenCalled();
    expect(mockWizardComponent.siguiente).not.toHaveBeenCalled();
  });

  it('no debe actualizar el índice ni llamar métodos de navegación si el valor está fuera de rango', () => {
    const mockWizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn(),
    };
    component.wizardComponent = mockWizardComponent as unknown as WizardComponent;

    const accion: AccionBoton = { valor: 0, accion: 'cont' };
    component.getValorIndice(accion);

    expect(component.indice).toBe(1); 
    expect(component.datosPasos.indice).toBe(1);
    expect(mockWizardComponent.siguiente).not.toHaveBeenCalled();
    expect(mockWizardComponent.atras).not.toHaveBeenCalled();
  });
});
