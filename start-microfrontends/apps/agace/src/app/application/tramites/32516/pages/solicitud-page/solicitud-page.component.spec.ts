import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolicitudPageComponent } from './solicitud-page.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('SolicitudPageComponent', () => {
  let component: SolicitudPageComponent;
  let fixture: ComponentFixture<SolicitudPageComponent>;

beforeEach(async () => {
  await TestBed.configureTestingModule({
    declarations: [SolicitudPageComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA], 
  }).compileComponents();

    fixture = TestBed.createComponent(SolicitudPageComponent);
    component = fixture.componentInstance;
    // Mock wizardComponent with spies for siguiente and atras
    component.wizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn(),
    } as any;
  });

  it('should call siguiente when accion is "cont"', () => {
    component.getValorIndice({ valor: 2, accion: 'cont' });
    expect(component.wizardComponent.siguiente).toHaveBeenCalled();
    expect(component.wizardComponent.atras).not.toHaveBeenCalled();
  });

  it('should call atras when accion is not "cont"', () => {
    component.getValorIndice({ valor: 2, accion: 'back' });
    expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
    expect(component.wizardComponent.atras).toHaveBeenCalled();
  });

  it('should not call siguiente or atras if valor is out of range', () => {
    component.getValorIndice({ valor: 0, accion: 'cont' });
    expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
    expect(component.wizardComponent.atras).not.toHaveBeenCalled();
  });

  it('should return correct title for obtenerNombreDelTítulo', () => {
    expect(SolicitudPageComponent.obtenerNombreDelTítulo(1)).toBeDefined();
    expect(SolicitudPageComponent.obtenerNombreDelTítulo(2)).toBe('Anexar requisitos');
    expect(SolicitudPageComponent.obtenerNombreDelTítulo(3)).toBe('Firmar');
    expect(SolicitudPageComponent.obtenerNombreDelTítulo(99)).toBeDefined();
  });
});