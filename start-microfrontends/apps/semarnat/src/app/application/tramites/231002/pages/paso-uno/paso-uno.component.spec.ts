// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { PasoUnoComponent } from './paso-uno.component';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { MercanciasDesmontadasOSinMontarService } from '../../services/mercancias-desmontadas-o-sin-montar.service';

@Injectable()
class MockMercanciasDesmontadasOSinMontarService {}

@Directive({ selector: '[myCustom]' })
class MyCustomDirective {
  @Input() myCustom;
}

describe('PasoUnoComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule , PasoUnoComponent ],
      declarations: [
        
        MyCustomDirective
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        ConsultaioQuery,
        { provide: MercanciasDesmontadasOSinMontarService, useClass: MockMercanciasDesmontadasOSinMontarService }
      ]
    }).overrideComponent(PasoUnoComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #seleccionaTab()', async () => {

    component.seleccionaTab({});

  });

  it('should run #ngOnInit()', async () => {
    component.configurarSuscripcionEstadoConsulta = jest.fn();
    component.ngOnInit();
    expect(component.configurarSuscripcionEstadoConsulta).toHaveBeenCalled();
  });

  it('should run #configurarSuscripcionEstadoConsulta()', async () => {
    component.consultaQuery = component.consultaQuery || {};
    component.consultaQuery.selectConsultaioState$ = observableOf({});
    component.consultaState = component.consultaState || {};
    component.consultaState.update = 'update';
    component.guardarDatosFormulario = jest.fn();
    component.configurarSuscripcionEstadoConsulta();

  });

  it('should run #guardarDatosFormulario()', async () => {
    component.mercanciasDesmontadasOSinMontarService = component.mercanciasDesmontadasOSinMontarService || {};
    component.mercanciasDesmontadasOSinMontarService.obtenerDatosSolicitudInicial = jest.fn().mockReturnValue(observableOf({}));
    component.mercanciasDesmontadasOSinMontarService.actualizarEstadoFormulario = jest.fn();
    component.guardarDatosFormulario();
    expect(component.mercanciasDesmontadasOSinMontarService.obtenerDatosSolicitudInicial).toHaveBeenCalled();
    expect(component.mercanciasDesmontadasOSinMontarService.actualizarEstadoFormulario).toHaveBeenCalled();
  });

  it('should run #ngOnDestroy()', async () => {
    component.destroy$ = component.destroy$ || {};
    component.destroy$.next = jest.fn();
    component.destroy$.complete = jest.fn();
    component.ngOnDestroy();
    expect(component.destroy$.next).toHaveBeenCalled();
    expect(component.destroy$.complete).toHaveBeenCalled();
  });

});