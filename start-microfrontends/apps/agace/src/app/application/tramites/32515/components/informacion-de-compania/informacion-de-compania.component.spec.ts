// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { InformacionDeCompaniaComponent } from './informacion-de-compania.component';
import { InformationGeneralSolicitanteService } from '../../services/information-general-solicitante.service';
import { Tramite32515Store } from '../../estados/tramite32515.store';
import { Tramite32515Query } from '../../estados/tramite32515.query';
import { ConsultaioQuery } from '@libs/shared/data-access-user/src';

@Injectable()
class MockInformationGeneralSolicitanteService {}

@Injectable()
class MockTramite32515Store {}

@Injectable()
class MockTramite32515Query {}

describe('InformacionDeCompaniaComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        { provide: InformationGeneralSolicitanteService, useClass: MockInformationGeneralSolicitanteService },
        { provide: Tramite32515Store, useClass: MockTramite32515Store },
        { provide: Tramite32515Query, useClass: MockTramite32515Query },
        ConsultaioQuery
      ]
    }).overrideComponent(InformacionDeCompaniaComponent, {

      set: { providers: [{ provide: InformationGeneralSolicitanteService, useClass: MockInformationGeneralSolicitanteService }] }    
    }).compileComponents();
    fixture = TestBed.createComponent(InformacionDeCompaniaComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run GetterDeclaration #ninoFormGroup', async () => {
    component.forma = component.forma || {};
    component.forma.get = jest.fn();
    const ninoFormGroup = component.ninoFormGroup;
    expect(component.forma.get).toHaveBeenCalled();
  });

  it('should run #establecerCambioDeValor()', async () => {
    component.cambioEnValoresStore = jest.fn();
    component.establecerCambioDeValor({
      campo: {},
      valor: {}
    });
    expect(component.cambioEnValoresStore).toHaveBeenCalled();
  });

  it('should run #cambioEnValoresStore()', async () => {
    component.tramiteStore32515 = component.tramiteStore32515 || {};
    component.tramiteStore32515.establecerDatos = jest.fn();
    component.cambioEnValoresStore({}, {});
    expect(component.tramiteStore32515.establecerDatos).toHaveBeenCalled();
  });

  it('should run #ngOnInit()', async () => {
    component.tramiteQuery32515 = component.tramiteQuery32515 || {};
    component.tramiteQuery32515.select$ = observableOf({});
    component.consultaQuery = component.consultaQuery || {};
    component.consultaQuery.selectConsultaioState$ = observableOf({});
    component.obtenerEntidadFederativa = jest.fn();
    component.obtenerMunicipio = jest.fn();
    component.obtenerColonia = jest.fn();
    component.ngOnInit();
    expect(component.obtenerEntidadFederativa).toHaveBeenCalled();
    expect(component.obtenerMunicipio).toHaveBeenCalled();
    expect(component.obtenerColonia).toHaveBeenCalled();
  });

  it('should run #obtenerEntidadFederativa()', async () => {
    component.informationGeneralService = component.informationGeneralService || {};
    component.informationGeneralService.getEntidadFederativa = jest.fn().mockReturnValue(observableOf({}));
    component.informacionDeCompaniaFormData = component.informacionDeCompaniaFormData || {};
    component.informacionDeCompaniaFormData.find = jest.fn().mockReturnValue([
      {
        "campo": {}
      }
    ]);
    component.obtenerEntidadFederativa();
    expect(component.informationGeneralService.getEntidadFederativa).toHaveBeenCalled();
    expect(component.informacionDeCompaniaFormData.find).toHaveBeenCalled();
  });

  it('should run #obtenerMunicipio()', async () => {
    component.informationGeneralService = component.informationGeneralService || {};
    component.informationGeneralService.getMunicipio = jest.fn().mockReturnValue(observableOf({}));
    component.informacionDeCompaniaFormData = component.informacionDeCompaniaFormData || {};
    component.informacionDeCompaniaFormData.find = jest.fn().mockReturnValue([
      {
        "campo": {}
      }
    ]);
    component.obtenerMunicipio();
    expect(component.informationGeneralService.getMunicipio).toHaveBeenCalled();
    expect(component.informacionDeCompaniaFormData.find).toHaveBeenCalled();
  });

  it('should run #obtenerColonia()', async () => {
    component.informationGeneralService = component.informationGeneralService || {};
    component.informationGeneralService.getColonia = jest.fn().mockReturnValue(observableOf({}));
    component.informacionDeCompaniaFormData = component.informacionDeCompaniaFormData || {};
    component.informacionDeCompaniaFormData.find = jest.fn().mockReturnValue([
      {
        "campo": {}
      }
    ]);
    component.obtenerColonia();
    expect(component.informationGeneralService.getColonia).toHaveBeenCalled();
    expect(component.informacionDeCompaniaFormData.find).toHaveBeenCalled();
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