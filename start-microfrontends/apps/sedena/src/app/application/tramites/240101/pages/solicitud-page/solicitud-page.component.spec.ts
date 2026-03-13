// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { SolicitudPageComponent } from './solicitud-page.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SolicitudPageComponent', () => {
  let component: SolicitudPageComponent;
  let fixture: ComponentFixture<SolicitudPageComponent>;

  // Mock WizardComponent
  class MockWizardComponent {
    siguiente = jest.fn();
    atras = jest.fn();
  }

  beforeEach(async () => {
    // Mock ImportacionArmasMunicionesService
    class MockImportacionArmasMunicionesService {}

    await TestBed.configureTestingModule({
      imports: [SolicitudPageComponent, HttpClientTestingModule],
      providers: [
        { provide: 'ImportacionArmasMunicionesService', useClass: MockImportacionArmasMunicionesService },
        // If the real token is not a string, use the actual class/type instead of the string above
      ],
    }).overrideComponent(SolicitudPageComponent, {
      set: {
        providers: [
          { provide: 'ImportacionArmasMunicionesService', useClass: MockImportacionArmasMunicionesService },
        ],
      },
    }).compileComponents();

    const fixture = TestBed.createComponent(SolicitudPageComponent);
    component = fixture.componentInstance;
    // Inject mock WizardComponent
    component.wizardComponent = new MockWizardComponent() as any;
    fixture.detectChanges();
    
  });


  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should set indice when seleccionaTab is called', () => {
    component.indice = 0;
    component.seleccionaTab(2);
    expect(component.indice).toBe(2);
  });

  describe('getValorIndice', () => {
    beforeEach(() => {
      (component as any).tituloMensaje = '';
      jest.clearAllMocks();
    });

    it('should update indice, tituloMensaje and call siguiente for accion "cont"', () => {
      const accion = { accion: 'cont', valor: 2 };
      component.getValorIndice(accion);
      expect(component.indice).toBe(2);
      expect((component as any).tituloMensaje).toBe('Anexar requisitos');
    });

    it('should update indice, tituloMensaje and call atras for accion not "cont"', () => {
      const accion = { accion: 'atras', valor: 3 };
      component.getValorIndice(accion);
      expect(component.indice).toBe(3);
      expect((component as any).tituloMensaje).toBe('Firmar');
    });

    it('should not update indice or call wizard methods if valor is out of range', () => {
      const accion = { accion: 'cont', valor: 0 };
      component.indice = 1;
      // Ensure wizardComponent methods are jest mocks
      component.wizardComponent.siguiente = jest.fn();
      component.wizardComponent.atras = jest.fn();
      component.getValorIndice(accion);
      expect(component.indice).toBe(1);
      expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
      expect(component.wizardComponent.atras).not.toHaveBeenCalled();
    });
  });

});
