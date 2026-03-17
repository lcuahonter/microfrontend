import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolicitudPageComponent } from './solicitud-page.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('SolicitudPageComponent', () => {
  let component: SolicitudPageComponent;
  let fixture: ComponentFixture<SolicitudPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SolicitudPageComponent],
      schemas: [NO_ERRORS_SCHEMA] 
    }).compileComponents();

    fixture = TestBed.createComponent(SolicitudPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render <app-paso-uno> when indice is 1', () => {
    component.indice = 1;
    fixture.detectChanges(); 

    const PASO_UNO_ELEMENT= fixture.debugElement.query(By.css('app-paso-uno'));
    expect(PASO_UNO_ELEMENT).toBeTruthy();
  });

  it('should render <app-paso-dos> when indice is 2', () => {
    component.indice = 2;
    fixture.detectChanges(); 

    const PASO_DOS_ELEMENT = fixture.debugElement.query(By.css('app-paso-dos'));
    expect(PASO_DOS_ELEMENT).toBeTruthy();  
  });

  it('should render <app-paso-tres> when indice is 3', () => {
    component.indice = 3;
    fixture.detectChanges();  

    const PASO_TRES_ELEMENT = fixture.debugElement.query(By.css('app-paso-tres'));
    expect(PASO_TRES_ELEMENT).toBeTruthy(); 
  });

  it('should render the correct step based on the current indice', () => {
    component.indice = 1;
    fixture.detectChanges();
    let PASO_UNO_ELEMENT= fixture.debugElement.query(By.css('app-paso-uno'));
    expect(PASO_UNO_ELEMENT).toBeTruthy();
    let PASO_DOS_ELEMENT = fixture.debugElement.query(By.css('app-paso-dos'));
    let PASO_TRES_ELEMENT = fixture.debugElement.query(By.css('app-paso-tres'));
    expect(PASO_DOS_ELEMENT).toBeFalsy();
    expect(PASO_TRES_ELEMENT).toBeFalsy();

    component.indice = 2;
    fixture.detectChanges();
    PASO_UNO_ELEMENT= fixture.debugElement.query(By.css('app-paso-uno'));
    PASO_DOS_ELEMENT = fixture.debugElement.query(By.css('app-paso-dos'));
    PASO_TRES_ELEMENT = fixture.debugElement.query(By.css('app-paso-tres'));
    expect(PASO_UNO_ELEMENT).toBeFalsy();
    expect(PASO_DOS_ELEMENT).toBeTruthy();
    expect(PASO_TRES_ELEMENT).toBeFalsy();

    component.indice = 3;
    fixture.detectChanges();
    PASO_UNO_ELEMENT= fixture.debugElement.query(By.css('app-paso-uno'));
    PASO_DOS_ELEMENT = fixture.debugElement.query(By.css('app-paso-dos'));
    PASO_TRES_ELEMENT = fixture.debugElement.query(By.css('app-paso-tres'));
    expect(PASO_UNO_ELEMENT).toBeFalsy();
    expect(PASO_DOS_ELEMENT).toBeFalsy();
    expect(PASO_TRES_ELEMENT).toBeTruthy();
  });

  it('should trigger getValorIndice when btn-continuar is clicked', () => {
    const ACTION_EVENT = { valor: 2, accion: 'cont' };
    const GET_VALOR_INDICE_SPY = jest.spyOn(component, 'getValorIndice');
    component.indice = 1;
    fixture.detectChanges();

    const CONTINUAR_BUTTON = fixture.debugElement.query(By.css('btn-continuar'));
    CONTINUAR_BUTTON.triggerEventHandler('continuarEvento', ACTION_EVENT);
    expect(GET_VALOR_INDICE_SPY).toHaveBeenCalledWith(ACTION_EVENT);
  });

  it('should not navigate when an invalid action is triggered', () => {
    const ACTION_EVENT = { valor: 5, accion: 'cont' }; 

    const GET_VALOR_INDICE_SPY = jest.spyOn(component, 'getValorIndice');
    component.getValorIndice(ACTION_EVENT);

    expect(component.indice).toBe(1);  
    expect(GET_VALOR_INDICE_SPY).toHaveBeenCalledWith(ACTION_EVENT);
  });
});
