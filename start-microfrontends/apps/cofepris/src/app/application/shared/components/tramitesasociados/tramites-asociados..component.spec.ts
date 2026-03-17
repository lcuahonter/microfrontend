
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { TramitesAsociadosComponent } from './tramites-asociados.component';
import { RegistrarSolicitudMcpService } from '../../services/registrar-solicitud-mcp.service';

@Injectable()
class MockRegistrarSolicitudMcpService {}



describe('TramitesAsociadosComponent', () => {
  let fixture: ComponentFixture<TramitesAsociadosComponent>;
  let component: { ngOnDestroy: () => void; getTramitesAsociados: jest.Mock<any, any, any> | (() => void); ngOnInit: () => void; registrarsolicitudmcp: { getTramitesAsociados?: any; }; abrirModal: jest.Mock<any, any, any> | (() => void); mostrarModal: () => void; ocultarModal: () => void; pedimentos: { splice?: any; }; eliminarPedimento: (arg0: {}) => void; destroyed$: { next?: any; complete?: any; }; };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule,TramitesAsociadosComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        { provide: RegistrarSolicitudMcpService, useClass: MockRegistrarSolicitudMcpService }
      ]
    }).overrideComponent(TramitesAsociadosComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(TramitesAsociadosComponent);
    component = fixture.debugElement.componentInstance;
  });

  afterEach(() => {
    component.ngOnDestroy = function() {};
    fixture.destroy();
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #ngOnInit()', async () => {
    component.getTramitesAsociados = jest.fn();
    component.ngOnInit();
     expect(component.getTramitesAsociados).toHaveBeenCalled();
  });

  it('should run #getTramitesAsociados()', async () => {
    component.registrarsolicitudmcp = component.registrarsolicitudmcp || {};
    component.registrarsolicitudmcp.getTramitesAsociados = jest.fn().mockReturnValue(observableOf({}));
    component.getTramitesAsociados();
     expect(component.registrarsolicitudmcp.getTramitesAsociados).toHaveBeenCalled();
  });

  it('should run #mostrarModal()', async () => {
    component.abrirModal = jest.fn();
    component.mostrarModal();
     expect(component.abrirModal).toHaveBeenCalled();
  });

  it('should run #ocultarModal()', async () => {

    component.ocultarModal();

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

  it('should run #ngOnDestroy()', async () => {
    component.destroyed$ = component.destroyed$ || {};
    component.destroyed$.next = jest.fn();
    component.destroyed$.complete = jest.fn();
    component.ngOnDestroy();
     expect(component.destroyed$.next).toHaveBeenCalled();
     expect(component.destroyed$.complete).toHaveBeenCalled();
  });

});