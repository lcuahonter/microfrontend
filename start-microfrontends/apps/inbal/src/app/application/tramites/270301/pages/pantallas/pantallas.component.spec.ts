import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { PantallasComponent } from './pantallas.component';
import { WizardComponent } from '@libs/shared/data-access-user/src';
import { AccionBoton } from '@ng-mf/data-access-user';

describe('PantallasComponent', () => {
  let component: PantallasComponent;
  let fixture: ComponentFixture<PantallasComponent>;

  
  class WizardComponentMock {
    siguiente = jest.fn();
    atras = jest.fn();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PantallasComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PantallasComponent);
    component = fixture.componentInstance;
   
    component.wizardComponent = new WizardComponentMock() as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize datosPasos correctly', () => {
    expect(component.datosPasos.nroPasos).toBe(component.pantallasPasos.length);
    expect(component.datosPasos.indice).toBe(component.indice);
    expect(component.datosPasos.txtBtnAnt).toBe('Anterior');
    expect(component.datosPasos.txtBtnSig).toBe('Continuar');
  });

  it('should update indice and call siguiente on getValorIndice with accion "cont"', () => {
    component.wizardComponent = new WizardComponentMock() as any;
    const event: AccionBoton = { valor: 2, accion: 'cont' } as any;
    component.getValorIndice(event);
    expect(component.indice).toBe(2);
    expect(component.datosPasos.indice).toBe(2);
    expect(component.wizardComponent.siguiente).toHaveBeenCalled();
    expect(component.wizardComponent.atras).not.toHaveBeenCalled();
  });

  it('should update indice and call atras on getValorIndice with accion not "cont"', () => {
    component.wizardComponent = new WizardComponentMock() as any;
    const event: AccionBoton = { valor: 1, accion: 'back' } as any;
    component.getValorIndice(event);
    expect(component.indice).toBe(1);
    expect(component.datosPasos.indice).toBe(1);
    expect(component.wizardComponent.atras).toHaveBeenCalled();
    expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
  });

  it('should not update indice or call wizard methods if valor is out of range', () => {
    component.wizardComponent = new WizardComponentMock() as any;
    const event: AccionBoton = { valor: 0, accion: 'cont' } as any;
    component.indice = 1;
    component.datosPasos.indice = 1;
    component.getValorIndice(event);
    expect(component.indice).toBe(1);
    expect(component.datosPasos.indice).toBe(1);
    expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
    expect(component.wizardComponent.atras).not.toHaveBeenCalled();
  });

  it('should not update indice or call wizard methods if event is null', () => {
    component.wizardComponent = new WizardComponentMock() as any;
    component.indice = 1;
    component.datosPasos.indice = 1;
    component.getValorIndice(null as any);
    expect(component.indice).toBe(1);
    expect(component.datosPasos.indice).toBe(1);
    expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
    expect(component.wizardComponent.atras).not.toHaveBeenCalled();
  });
});


