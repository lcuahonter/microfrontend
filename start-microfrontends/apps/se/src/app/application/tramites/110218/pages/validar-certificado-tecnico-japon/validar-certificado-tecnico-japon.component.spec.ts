import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ValidarCertificadoTecnicoJaponComponent } from './validar-certificado-tecnico-japon.component';
import { Component } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('ValidarCertificadoTecnicoJaponComponent', () => {
  let component: ValidarCertificadoTecnicoJaponComponent;
  let fixture: ComponentFixture<ValidarCertificadoTecnicoJaponComponent>;


  @Component({selector: 'app-wizard', template: ''})
  class MockWizardComponent {
    siguiente = jest.fn();
    atras = jest.fn();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ValidarCertificadoTecnicoJaponComponent, MockWizardComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      
    }).compileComponents();

    fixture = TestBed.createComponent(ValidarCertificadoTecnicoJaponComponent);
    component = fixture.componentInstance;
    
    component.wizardComponent = new MockWizardComponent() as any;
    
    component.solicitanteTabsComponent = { validarCamposObligatorios: jest.fn(() => true) } as any;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize pasosSolicitar and datosPasos', () => {
    expect(Array.isArray(component.pasosSolicitar)).toBe(true);
    expect(component.datosPasos.nroPasos).toBe(component.pasosSolicitar.length);
    expect(component.datosPasos.indice).toBe(component.indice);
  });

  it('should call wizardComponent.siguiente and update indice on getValorIndice with accion "cont"', () => {
    
  component.wizardComponent = new MockWizardComponent() as any;
  component.solicitanteTabsComponent = { validarCamposObligatorios: jest.fn(() => true) } as any;
  const spy = jest.spyOn(component.wizardComponent, 'siguiente');
  component.getValorIndice({ accion: 'cont', valor: 2 });
  expect(component.indice).toBe(2);
  expect(spy).toHaveBeenCalled();
  });

  it('should call wizardComponent.atras and update indice on getValorIndice with accion not "cont"', () => {
    
    component.wizardComponent = new MockWizardComponent() as any;
    const spy = jest.spyOn(component.wizardComponent, 'atras');
    component.getValorIndice({ accion: 'ant', valor: 3 });
    expect(component.indice).toBe(3);
    expect(spy).toHaveBeenCalled();
  });

  it('should not change indice or call wizard methods if valor is out of range', () => {
    
    component.wizardComponent = new MockWizardComponent() as any;
    const spySiguiente = jest.spyOn(component.wizardComponent, 'siguiente');
    const spyAtras = jest.spyOn(component.wizardComponent, 'atras');
    component.indice = 1;
    component.solicitanteTabsComponent = { validarCamposObligatorios: jest.fn(() => true) } as any;
    component.getValorIndice({ accion: 'cont', valor: 0 });
    expect(component.indice).toBe(1);
    expect(spySiguiente).not.toHaveBeenCalled();
    expect(spyAtras).not.toHaveBeenCalled();
    component.getValorIndice({ accion: 'cont', valor: 5 });
    expect(component.indice).toBe(1);
    expect(spySiguiente).not.toHaveBeenCalled();
    expect(spyAtras).not.toHaveBeenCalled();
  });

  it('should update showMercanciaForm and capturarTapIndice on isModificar', () => {
    component.showMercanciaForm = false;
    component.capturarTapIndice = 1;
    component.isModificar(true, 4);
    expect(component.showMercanciaForm).toBe(true);
    expect(component.capturarTapIndice).toBe(4);
  });
});