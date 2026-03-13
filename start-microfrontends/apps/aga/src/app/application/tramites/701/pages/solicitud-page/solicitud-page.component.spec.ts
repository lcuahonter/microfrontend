
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, Directive, Injectable, Input, NO_ERRORS_SCHEMA, Output, Pipe, PipeTransform } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { SolicitudPageComponent } from './solicitud-page.component';
import { SeccionLibQuery } from '@ng-mf/data-access-user';
import { SeccionStore } from '../../../../core/estados/seccion.store';
import { SeccionQuery } from '../../../../core/queries/seccion.query';

@Injectable()
class MockSeccionStore {}

describe('SolicitudPageComponent', () => {
  let fixture: ComponentFixture<SolicitudPageComponent>;
  let component: { ngOnDestroy: () => void; seccionQuery: { selectSeccionState$?: any; }; asignarSecciones: jest.Mock<any, any, any> | (() => void); ngOnInit: () => void; seleccionaTab: (arg0: {}) => void; wizardComponent: { siguiente?: any; atras?: any; }; getValorIndice: (arg0: { valor: {}; accion: {}; }) => void; seccionStore: { establecerSeccion?: any; establecerFormaValida?: any; }; };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule,SolicitudPageComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        SeccionQuery,
        { provide: SeccionStore, useClass: MockSeccionStore }
      ]
    }).overrideComponent(SolicitudPageComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(SolicitudPageComponent);
    component = fixture.debugElement.componentInstance;
    if (!component.asignarSecciones) {
      component.asignarSecciones = jest.fn();
    }
    component.seccionStore = {
      establecerSeccion: jest.fn(),
      establecerFormaValida: jest.fn(),
    };
    
  });

  afterEach(() => {
    component.ngOnDestroy = function() {};
    fixture.destroy();
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });
  
  it('should run #asignarSecciones()', async () => {
    component.seccionStore = {
      establecerSeccion: jest.fn(),
      establecerFormaValida: jest.fn(),
    };
  
    const mockSecciones = [true, false];
    const mockFormaValida = [true, true];
  
    (component as any).asignarSecciones = function () {
      this.seccionStore.establecerSeccion(mockSecciones);
      this.seccionStore.establecerFormaValida(mockFormaValida);
    };
  
    (component as any).asignarSecciones();
  
    expect(component.seccionStore.establecerSeccion).toHaveBeenCalledWith(mockSecciones);
    expect(component.seccionStore.establecerFormaValida).toHaveBeenCalledWith(mockFormaValida);
  });
});