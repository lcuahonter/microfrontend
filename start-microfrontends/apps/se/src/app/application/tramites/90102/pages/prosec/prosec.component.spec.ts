import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProsecComponent } from './prosec.component';
import { WizardComponent } from '@libs/shared/data-access-user/src/tramites/components/wizard/wizard.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('ProsecComponent', () => {
  let component: ProsecComponent;
  let fixture: ComponentFixture<ProsecComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProsecComponent],
      imports: [WizardComponent], // Import the standalone component here
      schemas: [CUSTOM_ELEMENTS_SCHEMA], // Add this to suppress unknown element errors
    }).compileComponents();

    fixture = TestBed.createComponent(ProsecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.indice).toBe(1);
    expect(component.datosPasos.nroPasos).toBe(component.pasos.length);
    expect(component.datosPasos.indice).toBe(component.indice);
    expect(component.datosPasos.txtBtnAnt).toBe('Anterior');
    expect(component.datosPasos.txtBtnSig).toBe('Continuar');
  });

  it('should update indice and call wizardComponent.siguiente() when getValorIndice is called with accion "cont"', () => {
    const wizardComponentSpy = jest.spyOn(
      component.wizardComponent,
      'siguiente'
    );
    component.getValorIndice({ accion: 'cont', valor: 2 });
    expect(component.indice).toBe(2);
    expect(wizardComponentSpy).toHaveBeenCalled();
  });

  it('should update indice and call wizardComponent.atras() when getValorIndice is called with accion "back"', () => {
    const wizardComponentSpy = jest.spyOn(component.wizardComponent, 'atras');
    component.getValorIndice({ accion: 'back', valor: 1 });
    expect(component.indice).toBe(1);
    expect(wizardComponentSpy).toHaveBeenCalled();
  });

  it('should not update indice if valor is out of range', () => {
    const initialIndice = component.indice;
    component.getValorIndice({ accion: 'cont', valor: 0 });
    expect(component.indice).toBe(initialIndice);

    component.getValorIndice({ accion: 'cont', valor: 5 });
    expect(component.indice).toBe(initialIndice);
  });

  it('should render the wizard component', () => {
    const wizardElement = fixture.debugElement.query(
      By.directive(WizardComponent)
    );
    expect(wizardElement).toBeTruthy();
  });

  it('should render the correct step component based on indice', () => {
    component.indice = 1;
    fixture.detectChanges();
    let stepOne = fixture.debugElement.query(By.css('app-paso-uno'));
    expect(stepOne).toBeTruthy();

    component.indice = 2;
    fixture.detectChanges();
    let stepTwo = fixture.debugElement.query(By.css('app-paso-dos'));
    expect(stepTwo).toBeTruthy();

    component.indice = 3;
    fixture.detectChanges();
    let stepThree = fixture.debugElement.query(By.css('app-paso-tres'));
    expect(stepThree).toBeTruthy();
  });

  it('should emit continuarEvento when btn-continuar is clicked', () => {
    const continuarButton = fixture.debugElement.query(By.css('btn-continuar'));
    const continuarSpy = jest.spyOn(component, 'getValorIndice');
    continuarButton.triggerEventHandler('continuarEvento', {
      accion: 'cont',
      valor: 2,
    });
    expect(continuarSpy).toHaveBeenCalledWith({ accion: 'cont', valor: 2 });
  });
});
