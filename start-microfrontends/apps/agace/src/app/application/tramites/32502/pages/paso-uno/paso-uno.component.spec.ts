// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';
import { Subject } from 'rxjs';
import { Component } from '@angular/core';
import { PasoUnoComponent } from './paso-uno.component';
import { AvisoService } from '../../services/aviso.service';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { HttpClientTestingModule } from '@angular/common/http/testing';


@Injectable()
class MockAvisoService {}

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
      imports: [ FormsModule, ReactiveFormsModule, HttpClientTestingModule ],
      declarations: [
        PasoUnoComponent
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        { provide: AvisoService, useClass: MockAvisoService },
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
  const fakeState = { update: true };

  component.notificadorDestruccion$ = new Subject<void>();

  component.consultaQuery = {
    selectConsultaioState$: observableOf(fakeState)
  } as any;

  component.obtenerDatosBandejaSolicitudes = jest.fn();
  
  component.ngOnInit();

  expect(component.obtenerDatosBandejaSolicitudes).toHaveBeenCalled();
});

  it('should run #obtenerDatosBandejaSolicitudes()', async () => {
    component.AvisoService = component.AvisoService || {};
    component.AvisoService.obtenerDatosEstado = jest.fn().mockReturnValue(observableOf({}));
    component.AvisoService.establecerDatosEstado = jest.fn();
    component.obtenerDatosBandejaSolicitudes();
    expect(component.AvisoService.obtenerDatosEstado).toHaveBeenCalled();
    expect(component.AvisoService.establecerDatosEstado).toHaveBeenCalled();
  });

  it('should run #ngOnDestroy()', async () => {
    component.notificadorDestruccion$ = component.notificadorDestruccion$ || {};
    component.notificadorDestruccion$.next = jest.fn();
    component.notificadorDestruccion$.complete = jest.fn();
    component.ngOnDestroy();
    expect(component.notificadorDestruccion$.next).toHaveBeenCalled();
    expect(component.notificadorDestruccion$.complete).toHaveBeenCalled();
  });

  it('should run #ngAfterViewInit()', async () => {
    component.solicitante = component.solicitante || {};
    component.solicitante.obtenerTipoPersona = jest.fn();
    component.ngAfterViewInit();
    expect(component.solicitante.obtenerTipoPersona).toHaveBeenCalled();
  });

  it('should run #seleccionaTab()', async () => {

    component.seleccionaTab({});

  });

});