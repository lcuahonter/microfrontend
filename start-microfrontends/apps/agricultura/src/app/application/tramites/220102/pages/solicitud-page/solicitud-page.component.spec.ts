import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolicitudPageComponent } from './solicitud-page.component';
import { SeccionLibStore } from '@ng-mf/data-access-user';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { WizardComponent } from '@ng-mf/data-access-user';
import { Component, ViewChild } from '@angular/core';

describe('SolicitudPageComponent', () => {
  let component: SolicitudPageComponent;
  let fixture: ComponentFixture<SolicitudPageComponent>;
  let mockSeccionStore: any;

  beforeEach(async () => {
    mockSeccionStore = {
      establecerFormaValida: jest.fn(),
      establecerSeccion: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [SolicitudPageComponent],
      imports: [FormsModule, ReactiveFormsModule],
      providers: [{ provide: SeccionLibStore, useValue: mockSeccionStore }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(SolicitudPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component and call constructor logic', () => {
    expect(component).toBeTruthy();
    mockSeccionStore.establecerFormaValida([false]);
    mockSeccionStore.establecerSeccion([true]);
    expect(mockSeccionStore.establecerFormaValida).toHaveBeenCalledWith([false]);
    expect(mockSeccionStore.establecerSeccion).toHaveBeenCalledWith([true]);
  });

  it('should call wizardComponent.siguiente() if accion is "cont"', () => {
    const siguienteSpy = jest.fn();
    component.wizardComponent = { siguiente: siguienteSpy, atras: jest.fn() } as any;

    component.getValorIndice({ valor: 2, accion: 'cont' });
    expect(component.indice).toBe(2);
    expect(siguienteSpy).toHaveBeenCalled();
  });

  it('should call wizardComponent.atras() if accion is not "cont"', () => {
    const atrasSpy = jest.fn();
    component.wizardComponent = { siguiente: jest.fn(), atras: atrasSpy } as any;

    component.getValorIndice({ valor: 3, accion: 'atras' });
    expect(component.indice).toBe(3);
    expect(atrasSpy).toHaveBeenCalled();
  });

  it('should not call wizardComponent if valor is out of bounds', () => {
    const siguienteSpy = jest.fn();
    const atrasSpy = jest.fn();
    component.wizardComponent = { siguiente: siguienteSpy, atras: atrasSpy } as any;

    component.getValorIndice({ valor: 6, accion: 'cont' }); // outside valid range (1-4)
    expect(component.indice).toBe(1); // should remain unchanged
    expect(siguienteSpy).not.toHaveBeenCalled();
    expect(atrasSpy).not.toHaveBeenCalled();
  });
});
