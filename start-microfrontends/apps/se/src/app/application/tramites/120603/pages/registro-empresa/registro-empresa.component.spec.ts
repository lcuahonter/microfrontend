
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { RegistroEmpresaComponent } from './registro-empresa.component';
import { SeccionLibQuery, SeccionLibStore } from '@ng-mf/data-access-user';
import { provideHttpClient } from '@angular/common/http';


describe('RegistroEmpresaComponent', () => {
  let fixture: ComponentFixture<RegistroEmpresaComponent>;
  let component: {
    indice: number; ngOnDestroy: () => void; seleccionaTab: (arg0: {}) => void; seccionQuery: { selectSeccionState$?: any; }; ngOnInit: () => void; pedimentos: { splice?: any; }; eliminarPedimento: (arg0: {}) => void; abrirModal: jest.Mock<any, any, any> | (() => void); wizardComponent: { siguiente?: any; atras?: any; }; getValorIndice: (arg0: { valor: {}; accion: {}; }) => void; onAlertClick: () => void; destroyed$: { next?: any; complete?: any; }; 
};

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule ],
      declarations: [
        RegistroEmpresaComponent,
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        provideHttpClient(),
        SeccionLibQuery,
        SeccionLibStore
      ]
    }).overrideComponent(RegistroEmpresaComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(RegistroEmpresaComponent);
    component = fixture.debugElement.componentInstance;
  });

  afterEach(() => {
    component.ngOnDestroy = function() {};
    fixture.destroy();
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #seleccionaTab()', async () => {

    component.seleccionaTab({});

  });

  it('should run #ngOnInit()', async () => {
    component.seccionQuery = component.seccionQuery || {};
    component.seccionQuery.selectSeccionState$ = observableOf({});
    component.ngOnInit();

  });

  it('should run #eliminarPedimento()', async () => {
    component.pedimentos = component.pedimentos || {};
    component.pedimentos.splice = jest.fn();
    component.eliminarPedimento({});
     expect(component.pedimentos.splice).toHaveBeenCalled();
  });

  it('should run #abrirModal()', async () => {

    component.abrirModal();

  });
  it('should run #getValorIndice()', async () => {
    component.wizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn(),
    };
  
    component.indice = 1; 
    component.getValorIndice({
      valor: 3, 
      accion: 'cont',
    });
  
    expect(component.wizardComponent.siguiente).toHaveBeenCalled();
    expect(component.wizardComponent.atras).not.toHaveBeenCalled();
  
    component.getValorIndice({
      valor: 2, 
      accion: 'atras',
    });
  
    expect(component.wizardComponent.atras).toHaveBeenCalled();
    expect(component.wizardComponent.siguiente).toHaveBeenCalledTimes(1); 
  });
  it('should run #onAlertClick()', async () => {
    component.abrirModal = jest.fn();
    component.onAlertClick();
     expect(component.abrirModal).toHaveBeenCalled();
  });

  it('should run #ngOnDestroy()', async () => {
    component.destroyed$ = component.destroyed$ || {};
    component.destroyed$.next = jest.fn();
    component.destroyed$.complete = jest.fn();
    component.ngOnDestroy();
     expect(component.destroyed$.next).toHaveBeenCalled();
     expect(component.destroyed$.complete).toHaveBeenCalled();
  });

});