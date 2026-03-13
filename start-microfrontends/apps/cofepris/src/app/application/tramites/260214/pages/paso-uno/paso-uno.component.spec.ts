// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, Subject, map, takeUntil } from 'rxjs';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { PasoUnoComponent } from './paso-uno.component';
import { Tramite260214Query } from '../../estados/tramite260214Query.query';
import { Tramite260214Store } from '../../estados/tramite260214Store.store';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { ImportacionDispositivosMedicosUsoService } from '../../services/importacion-dispositivos-medicos-uso.service';

@Injectable()
class MockTramite260214Query {}

@Injectable()
class MockTramite260214Store {}

@Injectable()
class MockImportacionDispositivosMedicosUsoService {}

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
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule,PasoUnoComponent,HttpClientModule ],
      declarations: [
        
        TranslatePipe, PhoneNumberPipe, SafeHtmlPipe,
        MyCustomDirective
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        { provide: Tramite260214Query, useClass: MockTramite260214Query },
        { provide: Tramite260214Store, useClass: MockTramite260214Store },
        ConsultaioQuery,
        { provide: ImportacionDispositivosMedicosUsoService, useClass: MockImportacionDispositivosMedicosUsoService }
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
   
    component.consultaState = {
      procedureId: '260214',
      update: true,
      readonly: false
    } as any; 
    
    component.guardarDatosFormulario = jest.fn();
  
   
    component.tramite260214Query = {
      getTabSeleccionado$: observableOf(1)    } as any;
    component.ngOnInit();
    expect(component.guardarDatosFormulario).toHaveBeenCalled();
  });

  it('should run #guardarDatosFormulario()', async () => {
    component.getRegistroTomaMuestrasMercanciasData = jest.fn().mockReturnValue(observableOf({}));
    component.actualizarEstadoFormulario = jest.fn();
    component.guardarDatosFormulario();
    
  });

  it('should run #actualizarEstadoFormulario()', async () => {
    component.tramite260214Store = component.tramite260214Store || {};
    component.tramite260214Store.update = jest.fn().mockReturnValue([
      null
    ]);
    component.actualizarEstadoFormulario({});
    // expect(component.tramite260214Store.update).toHaveBeenCalled();
  });

  it('should run #getRegistroTomaMuestrasMercanciasData()', async () => {
    component.importacionDispositivosMedicosUsoService = component.importacionDispositivosMedicosUsoService || {};
    component.importacionDispositivosMedicosUsoService.getRegistroTomaMuestrasMercanciasData = jest.fn();
    component.getRegistroTomaMuestrasMercanciasData();
    // expect(component.importacionDispositivosMedicosUsoService.getRegistroTomaMuestrasMercanciasData).toHaveBeenCalled();
  });

  it('should run #seleccionaTab()', async () => {
    component.tramite260214Store = component.tramite260214Store || {};
    component.tramite260214Store.updateTabSeleccionado = jest.fn();
    component.seleccionaTab({});
    // expect(component.tramite260214Store.updateTabSeleccionado).toHaveBeenCalled();
  });

  it('should run #ngOnDestroy()', async () => {
    component.destroyNotifier$ = component.destroyNotifier$ || {};
    component.destroyNotifier$.next = jest.fn();
    component.destroyNotifier$.complete = jest.fn();
    component.ngOnDestroy();
    // expect(component.destroyNotifier$.next).toHaveBeenCalled();
    // expect(component.destroyNotifier$.complete).toHaveBeenCalled();
  });

});