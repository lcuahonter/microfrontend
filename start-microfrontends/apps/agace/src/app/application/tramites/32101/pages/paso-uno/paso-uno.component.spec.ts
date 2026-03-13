//@ts-nocheck
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { PasoUnoComponent } from './paso-uno.component';
import { Tramite32101Store } from '../../../../estados/tramites/tramite32101.store';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { ConsultaAvisoAcreditacionService } from '../../services/consulta-aviso-acreditacion.service';
import { fakeAsync, tick } from '@angular/core/testing';
import { of } from 'rxjs';

@Injectable()
class MockTramite32101Store {}

@Injectable()
class MockConsultaAvisoAcreditacionService {}

@Directive({ selector: '[myCustom]' })
class MyCustomDirective {
  @Input() myCustom;
}

@Pipe({name: 'translate'})
class TranslatePipe implements PipeTransform {
  transform(value) { return value; }
}

@Pipe({name: 'phoneNumber'})
class PhoneNumberPipe implements PipeTransform {
  transform(value) { return value; }
}

@Pipe({name: 'safeHtml'})
class SafeHtmlPipe implements PipeTransform {
  transform(value) { return value; }
}

describe('PasoUnoComponent', () => {
  let fixture: ComponentFixture<PasoUnoComponent>;
  let component: PasoUnoComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule ],
      declarations: [
        PasoUnoComponent,
        TranslatePipe, PhoneNumberPipe, SafeHtmlPipe,
        MyCustomDirective
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        { provide: Tramite32101Store, useClass: MockTramite32101Store },
        ConsultaioQuery,
        { provide: ConsultaAvisoAcreditacionService, useClass: MockConsultaAvisoAcreditacionService }
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
  
  it('should run #ngOnInit() with update false', () => {
    // Setup simple mocks
    component.consultaioQuery = {
      selectConsultaioState$: of({ update: false })
    };
    
    component.consultaDatos = { update: false };
    
    // Call ngOnInit
    component.ngOnInit();
    
    // Simple assertion
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('should run #ngOnInit() with update true', () => {
    // Setup simple mocks
    const fetchSpy = jest.spyOn(component, 'fetchGetDatosConsulta').mockImplementation(() => {});
    
    component.consultaioQuery = {
      selectConsultaioState$: of({ update: true })
    };
    
    component.consultaDatos = { update: true };
    
    // Call ngOnInit
    component.ngOnInit();
    
    // Simple assertion
    expect(fetchSpy).toHaveBeenCalled();
  });

it('should run #fetchGetDatosConsulta()', fakeAsync(() => {
  const solicitudFormulario = {
    tipoDeInversion: ['x'],
    valorEnPesos: 1,
    descripcionGeneral: 'desc',
    listaDeDocumentos: 'docs',
    manifiesto1: 'm1',
    manifiesto2: 'm2',
    manifiesto3: 'm3',
    claveDeReferencia: 123,
    cadenaDeLaDependencia: 'dep',
    numeroDeOperacion: 456,
    banco: ['banco1'],
    llaveDePago: 789,
    fechaInicialInput: '2024-01-01',
    importeDePago: 1000
  };

  component.consultaAvisoAcreditacionService = {
    getDatosConsulta: jest.fn().mockReturnValue(of({
      success: true,
      datos: { solicitudFormulario }
    }))
  };

  component.store = {
    setTipoDeInversion: jest.fn(),
    setValorEnPesos: jest.fn(),
    setDescripcionGeneral: jest.fn(),
    setListaDeDocumentos: jest.fn(),
    setManifiesto1: jest.fn(),
    setManifiesto2: jest.fn(),
    setManifiesto3: jest.fn(),
    setClaveDeReferencia: jest.fn(),
    setCadenaDeLaDependencia: jest.fn(),
    setNumeroDeOperacion: jest.fn(),
    setBanco: jest.fn(),
    setLlaveDePago: jest.fn(),
    setFechaInicialInput: jest.fn(),
    setImporteDePago: jest.fn(),
    setComprobante: jest.fn()
  };

  component.fetchGetDatosConsulta();
  tick();

  expect(component.consultaAvisoAcreditacionService.getDatosConsulta).toHaveBeenCalled();
  expect(component.store.setTipoDeInversion).toHaveBeenCalledWith(['x']);
  expect(component.store.setValorEnPesos).toHaveBeenCalledWith(1);
  expect(component.store.setDescripcionGeneral).toHaveBeenCalledWith('desc');
  expect(component.store.setListaDeDocumentos).toHaveBeenCalledWith('docs');
  expect(component.store.setManifiesto1).toHaveBeenCalledWith('m1');
  expect(component.store.setManifiesto2).toHaveBeenCalledWith('m2');
  expect(component.store.setManifiesto3).toHaveBeenCalledWith('m3');
  expect(component.store.setClaveDeReferencia).toHaveBeenCalledWith(123);
  expect(component.store.setCadenaDeLaDependencia).toHaveBeenCalledWith('dep');
  expect(component.store.setNumeroDeOperacion).toHaveBeenCalledWith(456);
  expect(component.store.setBanco).toHaveBeenCalledWith(['banco1']);
  expect(component.store.setLlaveDePago).toHaveBeenCalledWith(789);
  expect(component.store.setFechaInicialInput).toHaveBeenCalledWith('2024-01-01');
  expect(component.store.setImporteDePago).toHaveBeenCalledWith(1000);
}));

  it('should run #ngAfterViewInit()', async () => {
    component.solicitante = component.solicitante || {};
    component.solicitante.obtenerTipoPersona = jest.fn();
    component.ngAfterViewInit();
    expect(component.solicitante.obtenerTipoPersona).toHaveBeenCalled();
  });

  it('should run #ngOnDestroy()', async () => {
    component.destroyNotifier$ = component.destroyNotifier$ || {};
    component.destroyNotifier$.next = jest.fn();
    component.destroyNotifier$.complete = jest.fn();
    component.ngOnDestroy();
    expect(component.destroyNotifier$.next).toHaveBeenCalled();
    expect(component.destroyNotifier$.complete).toHaveBeenCalled();
  });

  it('should run #seleccionaTab()', async () => {

    component.seleccionaTab({});

  });

});