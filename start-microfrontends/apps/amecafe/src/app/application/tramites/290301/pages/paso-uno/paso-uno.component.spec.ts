
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { PasoUnoComponent } from './paso-uno.component';
import { Solicitud290301Store } from '../../estados/tramite290301.store';
import { Solicitud290301Query } from '../../estados/tramite290301.query';
import { NacionalRegistroDelCafeExportadoresService } from '../../services/nacional-registro-del-cafe-exportadores.service';
import { ConsultaioQuery } from '@ng-mf/data-access-user';

@Injectable()
class MockSolicitud290301Store {}

@Injectable()
class MockSolicitud290301Query {}

@Injectable()
class MockNacionalRegistroDelCafeExportadoresService {}



describe('PasoUnoComponent', () => {
  let fixture: ComponentFixture<PasoUnoComponent>;
  let component: { ngOnDestroy: () => void; consultaQuery: { selectConsultaioState$?: any; }; guardarDatosFormulario: jest.Mock<any, any, any> | (() => void); ngOnInit: () => void; nacionalRegistroDelCafeExportadoresService: { getConsultaData?: any; actualizarEstadoFormulario?: any; }; seleccionaTab: (arg0: {}) => void; destroyNotifier$: { next?: any; complete?: any; }; };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PasoUnoComponent],
      imports: [ FormsModule, ReactiveFormsModule],
      
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        { provide: Solicitud290301Store, useClass: MockSolicitud290301Store },
        { provide: Solicitud290301Query, useClass: MockSolicitud290301Query },
        { provide: NacionalRegistroDelCafeExportadoresService, useClass: MockNacionalRegistroDelCafeExportadoresService },
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

  it('should run #ngOnInit()', async () => {
    component.consultaQuery = {
      selectConsultaioState$: observableOf({ update: true }) 
    };
  
    component.guardarDatosFormulario = jest.fn();
  
    component.ngOnInit();
  
    expect(component.guardarDatosFormulario).toHaveBeenCalled();
  });
  it('should run #guardarDatosFormulario()', async () => {
    component.nacionalRegistroDelCafeExportadoresService = component.nacionalRegistroDelCafeExportadoresService || {};
    component.nacionalRegistroDelCafeExportadoresService.getConsultaData = jest.fn().mockReturnValue(observableOf({}));
    component.nacionalRegistroDelCafeExportadoresService.actualizarEstadoFormulario = jest.fn();
    component.guardarDatosFormulario();
     expect(component.nacionalRegistroDelCafeExportadoresService.getConsultaData).toHaveBeenCalled();
     expect(component.nacionalRegistroDelCafeExportadoresService.actualizarEstadoFormulario).toHaveBeenCalled();
  });

  it('should run #seleccionaTab()', async () => {

    component.seleccionaTab({});

  });

  it('should run #ngOnDestroy()', async () => {
    component.destroyNotifier$ = {
      next: jest.fn(),
      complete: jest.fn()
    };
  
    component.ngOnDestroy();
  
    expect(component.destroyNotifier$.next).toHaveBeenCalled();
    expect(component.destroyNotifier$.complete).toHaveBeenCalled();
  });

});