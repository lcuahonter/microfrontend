// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { BitacoraComponent } from './bitacora.component';
import { AmpliacionServiciosService } from '../../services/ampliacion-servicios.service';

@Injectable()
class MockAmpliacionServiciosService {}

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

describe('BitacoraComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule ],
      declarations: [
        BitacoraComponent,
        TranslatePipe, PhoneNumberPipe, SafeHtmlPipe,
        MyCustomDirective
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        { provide: AmpliacionServiciosService, useClass: MockAmpliacionServiciosService }
      ]
    }).overrideComponent(BitacoraComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(BitacoraComponent);
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
    component.getBitacoraProsec = jest.fn();
    component.getMercanciasProsec = jest.fn();
    component.getPlantasProsec = jest.fn();
    component.getProductorProsec = jest.fn();
    component.getSectoresProsec = jest.fn();
    component.ngOnInit();
    
  });

  it('should run #getBitacoraProsec()', async () => {
    component.ampliacionServiciosService = component.ampliacionServiciosService || {};
    component.ampliacionServiciosService.getBitacoraProsec = jest.fn().mockReturnValue(observableOf({
      code: 200,
      data: "abc"
    }));
    component.getBitacoraProsec();
     });

  it('should run #getMercanciasProsec()', async () => {
    component.ampliacionServiciosService = component.ampliacionServiciosService || {};
    component.ampliacionServiciosService.getMercanciasProsec = jest.fn().mockReturnValue(observableOf({
      code: 200,
      data: "abc"
    }));
    component.getMercanciasProsec();
  });

  it('should run #getPlantasProsec()', async () => {
    component.ampliacionServiciosService = component.ampliacionServiciosService || {};
    component.ampliacionServiciosService.getPlantasProsec = jest.fn().mockReturnValue(observableOf({
      code: 200,
      data: "abc"
    }));
    component.getPlantasProsec();
    });

  it('should run #getProductorProsec()', async () => {
    component.ampliacionServiciosService = component.ampliacionServiciosService || {};
    component.ampliacionServiciosService.getProductorIndirectoProsec = jest.fn().mockReturnValue(observableOf({
      code: 200,
      data: "abc"
    }));
    component.getProductorProsec();
    });

  it('should run #getSectoresProsec()', async () => {
    component.ampliacionServiciosService = component.ampliacionServiciosService || {};
    component.ampliacionServiciosService.getSectoresProsec = jest.fn().mockReturnValue(observableOf({
      code: 200,
      data: "abc"
    }));
    component.getSectoresProsec();
  });

  it('should run #ngOnDestroy()', async () => {
    component.destroyNotifier$ = component.destroyNotifier$ || {};
    component.destroyNotifier$.next = jest.fn();
    component.destroyNotifier$.complete = jest.fn();
    component.ngOnDestroy();
     });

});