
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { PasoUnoComponent } from './paso-uno.component';
import { Solicitud260919Store } from '../../estados/tramites260919.store';
import { Solicitud260919Query } from '../../estados/tramites260919.query';
import { ImportarDeRemediosHerbalsService } from '../../services/importar-de-remedios-herbals.service';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { provideHttpClient } from '@angular/common/http';
@Injectable()
class MockSolicitud260919Store {}

@Injectable()
class MockSolicitud260919Query {}

@Injectable()
class MockImportarDeRemediosHerbalsService {}

describe('PasoUnoComponent', () => {
  let fixture: ComponentFixture<PasoUnoComponent>;
  let component: { ngOnDestroy: () => void; solicitante: { obtenerTipoPersona?: any; }; ngAfterViewInit: () => void; consultaQuery: { selectConsultaioState$?: any; }; guardarDatosFormulario: jest.Mock<any, any, any> | (() => void); ngOnInit: () => void; importarDeRemediosHerbals: { getConsultaData?: any; actualizarEstadoFormulario?: any; }; seleccionaTab: (arg0: {}) => void; destroyNotifier$: { next?: any; complete?: any; }; };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule ],
      declarations: [
        PasoUnoComponent
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        provideHttpClient(),
        { provide: Solicitud260919Store, useClass: MockSolicitud260919Store },
        { provide: Solicitud260919Query, useClass: MockSolicitud260919Query },
        { provide: ImportarDeRemediosHerbalsService, useClass: MockImportarDeRemediosHerbalsService },
        ConsultaioQuery
      ]
    }).overrideComponent(PasoUnoComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.debugElement.componentInstance;
  });

  afterEach(() => {
    component.ngOnDestroy = function() {};
    fixture.destroy();
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #ngAfterViewInit()', async () => {
    component.solicitante = component.solicitante || {};
    component.solicitante.obtenerTipoPersona = jest.fn();
    component.ngAfterViewInit();
     expect(component.solicitante.obtenerTipoPersona).toHaveBeenCalled();
  });

  it('should run #guardarDatosFormulario()', async () => {
    component.importarDeRemediosHerbals = component.importarDeRemediosHerbals || {};
    component.importarDeRemediosHerbals.getConsultaData = jest.fn().mockReturnValue(observableOf({}));
    component.importarDeRemediosHerbals.actualizarEstadoFormulario = jest.fn();
    component.guardarDatosFormulario();
     expect(component.importarDeRemediosHerbals.getConsultaData).toHaveBeenCalled();
     expect(component.importarDeRemediosHerbals.actualizarEstadoFormulario).toHaveBeenCalled();
  });

  it('should run #seleccionaTab()', async () => {

    component.seleccionaTab({});

  });

  it('should run #ngOnDestroy()', async () => {
    component.destroyNotifier$ = component.destroyNotifier$ || {};
    component.destroyNotifier$.next = jest.fn();
    component.destroyNotifier$.complete = jest.fn();
    component.ngOnDestroy();
     expect(component.destroyNotifier$.next).toHaveBeenCalled();
     expect(component.destroyNotifier$.complete).toHaveBeenCalled();
  });

});