import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, Subject, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { ProgramasReporteAnualComponent } from './programas-reporte-anual.component';
import { FormBuilder } from '@angular/forms';
import { Solicitud150103Store } from '../../estados/solicitud150103.store';
import { Solicitud150103Query } from '../../estados/solicitud150103.query';
import { InformeAnualProgramaService } from '../../services/informe-anual-programa.service';
import { ConsultaioQuery } from '@libs/shared/data-access-user/src';
import { provideHttpClient } from '@angular/common/http';

/**
 * @descripcion
 * Clase mock para simular el comportamiento del store de solicitudes 150103 en pruebas unitarias.
 * Proporciona métodos simulados para actualizar el estado de inicio y fin del reporte anual.
 */
@Injectable()
class MockSolicitud150103Store {
  /**
   * @descripcion
   * Método simulado para actualizar la fecha de inicio del reporte anual.
   */
  actualizarInicio = jest.fn();

  /**
   * @descripcion
   * Método simulado para actualizar la fecha de fin del reporte anual.
   * 
   */
  actualizarFin = jest.fn();
  actualizarFolioPrograma = jest.fn();
  actualizarModalidad = jest.fn();
  actualizarTipoPrograma = jest.fn();
  actualizarEstatus = jest.fn();
  actualizarIndiceDeRegistroDelPrograma = jest.fn();
}

/**
 * @descripcion
 * Clase mock para simular el comportamiento de las consultas de solicitudes 150103 en pruebas unitarias.
 * Proporciona métodos simulados para obtener valores del estado de la aplicación.
 * 
 * @remarks
 * Esta clase se utiliza para crear un entorno de pruebas controlado, evitando
 * dependencias externas y permitiendo verificar el comportamiento del componente
 * de forma aislada.
 */
@Injectable()
class MockSolicitud150103Query {
  /**
   * @descripcion
   * Método simulado para obtener valores del estado de la solicitud 150103.
   */
  getValue = jest.fn().mockReturnValue({});
}

/**
 * @descripcion
 * Clase mock para simular el comportamiento del servicio de informes anuales de programas en pruebas unitarias.
 * Proporciona métodos simulados para obtener fechas de reportes y programas de reporte.
 */
@Injectable()
class MockInformeAnualProgramaService {
  /**
   * @descripcion
   * Método simulado para obtener las fechas de inicio y fin del reporte anual.
   * 
   */
  obtenerReporteFechas = jest.fn().mockReturnValue(observableOf({ 
    inicio: '2023-01-01', 
    fin: '2023-12-31' 
  }));

  /**
   * @descripcion
   * Método simulado para obtener la lista de programas de reporte disponibles.
   * 
   */
  obtenerProgramasReporte = jest.fn().mockReturnValue(observableOf([])); 
}

describe('ProgramasReporteAnualComponent', () => {
  let fixture: ComponentFixture<ProgramasReporteAnualComponent>;
  let component: {
    esFormularioSoloLectura: boolean; ngOnDestroy: () => void; fb: { group?: any; }; solicitud150103State: { inicio?: any; fin?: any; folioPrograma?: any; modalidad?: any; tipoPrograma?: any; estatus?: any; }; solicitud150103Query: { seleccionarSolicitud$?: any; }; consultaioQuery: { selectConsultaioState$?: any; }; inicializarEstadoFormulario: jest.Mock<any, any, any> | (() => void); ngOnInit: () => void; informaAnualPrograma: { obtenerReporteFechas?: any; obtenerProgramasReporte?: any; }; solicitud150103Store: { actualizarInicio?: any; actualizarFin?: any; actualizarFolioPrograma?: any; actualizarModalidad?: any; actualizarTipoPrograma?: any; actualizarEstatus?: any; }; obtenerReporteFechas: () => void; obtenerProgramasReporte: () => void; filaDeInformeSeleccionada: { emit?: any; }; actualizarProgramasReporte: (arg0: { folioPrograma: {}; modalidad: {}; tipoPrograma: {}; estatus: {}; }) => void; formProgrmasReporte: { disable?: any; enable?: any; }; destroyNotifier$: { next?: any; complete?: any; }; destroyed$?: Subject<void>; 
};

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule ],
      declarations: [ProgramasReporteAnualComponent],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        provideHttpClient(),
        FormBuilder,
        { provide: Solicitud150103Store, useClass: MockSolicitud150103Store },
        { provide: Solicitud150103Query, useClass: MockSolicitud150103Query },
        { provide: InformeAnualProgramaService, useClass: MockInformeAnualProgramaService },
        ConsultaioQuery
      ]
    }).overrideComponent(ProgramasReporteAnualComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(ProgramasReporteAnualComponent);
    component = fixture.debugElement.componentInstance;
    component['destroyed$'] = new Subject<void>();

  });

  afterEach(() => {
    component.ngOnDestroy = function() {};
    fixture.destroy();
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #ngOnInit()', async () => {
    component.fb = component.fb || {};
    component.fb.group = jest.fn().mockReturnValue({
      patchValue: function() {}
    });
    component.solicitud150103State = component.solicitud150103State || {};
    component.solicitud150103State.inicio = 'inicio';
    component.solicitud150103State.fin = 'fin';
    component.solicitud150103State.folioPrograma = 'folioPrograma';
    component.solicitud150103State.modalidad = 'modalidad';
    component.solicitud150103State.tipoPrograma = 'tipoPrograma';
    component.solicitud150103State.estatus = 'estatus';
    component.solicitud150103Query = component.solicitud150103Query || {};
    component.solicitud150103Query.seleccionarSolicitud$ = observableOf({});
    component.consultaioQuery = component.consultaioQuery || {};
    component.consultaioQuery.selectConsultaioState$ = observableOf({});
    component.inicializarEstadoFormulario = jest.fn();
    component.ngOnInit();
     expect(component.fb.group).toHaveBeenCalled();
     expect(component.inicializarEstadoFormulario).toHaveBeenCalled();
  });

  it('should run #obtenerProgramasReporte()', async () => {
    const informeAnualPrograma = TestBed.inject(InformeAnualProgramaService);
    informeAnualPrograma.obtenerProgramasReporte = jest.fn().mockReturnValue(observableOf({ datos: [{ folioPrograma: 'FP', modalidad: 'MOD', tipoPrograma: 'TP', estatus: 'EST' }] }));
    (component as any).solicitudDatos = [];
    component.obtenerProgramasReporte();
    expect(informeAnualPrograma.obtenerProgramasReporte).toHaveBeenCalled();
    expect((component as any).solicitudDatos).toEqual([{ folioPrograma: 'FP', modalidad: 'MOD', tipoPrograma: 'TP', estatus: 'EST' }]);
  });

  it('should run #actualizarProgramasReporte()', async () => {
    component.solicitud150103Store = component.solicitud150103Store || {};
    component.solicitud150103Store.actualizarFolioPrograma = jest.fn();
    component.solicitud150103Store.actualizarModalidad = jest.fn();
    component.solicitud150103Store.actualizarTipoPrograma = jest.fn();
    component.solicitud150103Store.actualizarEstatus = jest.fn();
    component.filaDeInformeSeleccionada = component.filaDeInformeSeleccionada || {};
    component.filaDeInformeSeleccionada.emit = jest.fn();
    component.actualizarProgramasReporte({
      folioPrograma: {},
      modalidad: {},
      tipoPrograma: {},
      estatus: {}
    });
     expect(component.solicitud150103Store.actualizarFolioPrograma).toHaveBeenCalled();
     expect(component.solicitud150103Store.actualizarModalidad).toHaveBeenCalled();
     expect(component.solicitud150103Store.actualizarTipoPrograma).toHaveBeenCalled();
     expect(component.solicitud150103Store.actualizarEstatus).toHaveBeenCalled();
     expect(component.filaDeInformeSeleccionada.emit).toHaveBeenCalled();
  });
  it('should run #inicializarEstadoFormulario()', async () => {
    component.formProgrmasReporte = {
      disable: jest.fn(),
      enable: jest.fn(),
    };
  
    component.esFormularioSoloLectura = true;
  
    component.inicializarEstadoFormulario();
  
  
    component.esFormularioSoloLectura = false;
    component.inicializarEstadoFormulario();
  
    expect(component.formProgrmasReporte.enable).toHaveBeenCalled();
  });
  it('should run #ngOnDestroy()', async () => {
    component.destroyNotifier$ = new Subject<void>();
    const nextSpy = jest.spyOn(component.destroyNotifier$, 'next');
    const completeSpy = jest.spyOn(component.destroyNotifier$, 'complete');
  
    component.ngOnDestroy();
  
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});