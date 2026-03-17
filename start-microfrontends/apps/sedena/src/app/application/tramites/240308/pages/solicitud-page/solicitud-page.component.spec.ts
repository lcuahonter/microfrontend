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

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });
  
  it('debe crear el componente correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debe renderizar <app-paso-uno> cuando indice es 1', () => {
    component.indice = 1;
    fixture.detectChanges(); 

    const elementoPasoUno = fixture.debugElement.query(By.css('app-paso-uno'));
    expect(elementoPasoUno).toBeTruthy();
  });

  it('debe renderizar <app-paso-dos> cuando indice es 2', () => {
    component.indice = 2;
    fixture.detectChanges(); 

    const elementoPasoDos = fixture.debugElement.query(By.css('app-paso-dos'));
    expect(elementoPasoDos).toBeTruthy();  
  });

  it('debe renderizar <app-paso-tres> cuando indice es 3', () => {
    component.indice = 3;
    fixture.detectChanges();  

    const elementoPasoTres = fixture.debugElement.query(By.css('app-paso-tres'));
    expect(elementoPasoTres).toBeTruthy(); 
  });

  it('debe renderizar el paso correcto según el indice actual', () => {
    component.indice = 1;
    fixture.detectChanges();
    let elementoPasoUno = fixture.debugElement.query(By.css('app-paso-uno'));
    expect(elementoPasoUno).toBeTruthy();
    let elementoPasoDos = fixture.debugElement.query(By.css('app-paso-dos'));
    let elementoPasoTres = fixture.debugElement.query(By.css('app-paso-tres'));
    expect(elementoPasoDos).toBeFalsy();
    expect(elementoPasoTres).toBeFalsy();

    component.indice = 2;
    fixture.detectChanges();
    elementoPasoUno = fixture.debugElement.query(By.css('app-paso-uno'));
    elementoPasoDos = fixture.debugElement.query(By.css('app-paso-dos'));
    elementoPasoTres = fixture.debugElement.query(By.css('app-paso-tres'));
    expect(elementoPasoUno).toBeFalsy();
    expect(elementoPasoDos).toBeTruthy();
    expect(elementoPasoTres).toBeFalsy();

    component.indice = 3;
    fixture.detectChanges();
    elementoPasoUno = fixture.debugElement.query(By.css('app-paso-uno'));
    elementoPasoDos = fixture.debugElement.query(By.css('app-paso-dos'));
    elementoPasoTres = fixture.debugElement.query(By.css('app-paso-tres'));
    expect(elementoPasoUno).toBeFalsy();
    expect(elementoPasoDos).toBeFalsy();
    expect(elementoPasoTres).toBeTruthy();
  });

  it('debe disparar getValorIndice cuando se hace clic en btn-continuar', () => {
    const eventoAccion = { valor: 2, accion: 'cont' };
    const espiaGetValorIndice = jest.spyOn(component, 'getValorIndice');
    component.indice = 1;
    fixture.detectChanges();

    const botonContinuar = fixture.debugElement.query(By.css('btn-continuar'));
    botonContinuar.triggerEventHandler('continuarEvento', eventoAccion);
    expect(espiaGetValorIndice).toHaveBeenCalledWith(eventoAccion);
  });

  it('no debe navegar cuando se dispara una acción inválida', () => {
    const eventoAccion = { valor: 5, accion: 'cont' }; 

    const espiaGetValorIndice = jest.spyOn(component, 'getValorIndice');
    component.getValorIndice(eventoAccion);

    expect(component.indice).toBe(1);  
    expect(espiaGetValorIndice).toHaveBeenCalledWith(eventoAccion);
  });
});
