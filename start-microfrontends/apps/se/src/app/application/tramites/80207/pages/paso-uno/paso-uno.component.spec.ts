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
import { SubfabricanteService } from '../../servicios/servicios-subfabricante.service';
 
@Injectable()
class MockSubfabricanteService {}
 
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
      imports: [ FormsModule, ReactiveFormsModule ],
      declarations: [
        PasoUnoComponent,
        TranslatePipe, PhoneNumberPipe, SafeHtmlPipe,
        MyCustomDirective
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        ConsultaioQuery,
        { provide: SubfabricanteService, useClass: MockSubfabricanteService }
      ]
    }).overrideComponent(PasoUnoComponent, {
 
      set: { providers: [{ provide: SubfabricanteService, useClass: MockSubfabricanteService }] }    
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
 
  it('should run #seleccionaTab()', async () => {
 
    component.seleccionaTab({});
 
  });
 
  it('should run #ngOnInit()', async () => {
    component.consultaQuery = component.consultaQuery || {};
    component.consultaQuery.selectConsultaioState$ = observableOf({});
    component.guardarDatosFormulario = jest.fn();
    component.ngOnInit();

  });
 
  it('should run #guardarDatosFormulario()', async () => {
    component.subfabricanteService = component.subfabricanteService || {};
    component.subfabricanteService.getServiciosData = jest.fn().mockReturnValue(observableOf({}));
    component.subfabricanteService.actualizarEstadoFormulario = jest.fn();
    component.guardarDatosFormulario();
    expect(component.subfabricanteService.getServiciosData).toHaveBeenCalled();
     expect(component.subfabricanteService.actualizarEstadoFormulario).toHaveBeenCalled();
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