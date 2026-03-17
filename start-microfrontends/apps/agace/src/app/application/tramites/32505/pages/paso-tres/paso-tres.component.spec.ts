// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import { Component } from '@angular/core';
import { PasoTresComponent } from './paso-tres.component';
import { Router } from '@angular/router';
import { TramiteFolioService, TramiteStore } from '@ng-mf/data-access-user';

@Injectable()
class MockRouter {
  navigate() { 
    return Promise.resolve(true);
  };
}

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

describe('PasoTresComponent', () => {
  let fixture;
  let component;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ 
        FormsModule, 
        ReactiveFormsModule,
        PasoTresComponent,
        HttpClientTestingModule,
        NoopAnimationsModule,
        ToastrModule.forRoot()
      ],
      declarations: [
        TranslatePipe, PhoneNumberPipe, SafeHtmlPipe,
        MyCustomDirective
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        { provide: Router, useClass: MockRouter },
        TramiteFolioService,
        TramiteStore
      ]
    }).overrideComponent(PasoTresComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(PasoTresComponent);
    component = fixture.debugElement.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    if (component && component.ngOnDestroy) {
      component.ngOnDestroy = function() {};
    }
    if (fixture) {
      fixture.destroy();
    }
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #obtenerTipoPersona()', async () => {
    const tipo = 1;
    component.obtenerTipoPersona(tipo);
    expect(component.tipoPersona).toBe(tipo);
  });

  it('should run #obtieneFirma() with valid firma', (done) => {
    const firma = 'test-firma';
    const mockResponse = {
      id: 1,
      descripcion: 'Success',
      codigo: '200',
      data: { folio: '123' }
    };

    jest.spyOn(component.serviciosExtraordinariosServices, 'obtenerTramite').mockReturnValue(observableOf(mockResponse));
    jest.spyOn(component.tramiteStore, 'establecerTramite');
    jest.spyOn(component.router, 'navigate');

    component.obtieneFirma(firma);

    setTimeout(() => {
      expect(component.serviciosExtraordinariosServices.obtenerTramite).toHaveBeenCalledWith(19);
      expect(component.tramiteStore.establecerTramite).toHaveBeenCalledWith(mockResponse.data, firma);
      expect(component.router.navigate).toHaveBeenCalledWith(['pago/registro-solicitud/acuse']);
      done();
    }, 0);
  });

  it('should not call services when firma is empty', () => {
    jest.spyOn(component.serviciosExtraordinariosServices, 'obtenerTramite');
    jest.spyOn(component.tramiteStore, 'establecerTramite');
    jest.spyOn(component.router, 'navigate');

    component.obtieneFirma('');

    expect(component.serviciosExtraordinariosServices.obtenerTramite).not.toHaveBeenCalled();
    expect(component.tramiteStore.establecerTramite).not.toHaveBeenCalled();
    expect(component.router.navigate).not.toHaveBeenCalled();
  });

  it('should run #ngOnDestroy()', async () => {
    const nextSpy = jest.spyOn(component.destroyed$, 'next');
    const completeSpy = jest.spyOn(component.destroyed$, 'complete');
    
    component.ngOnDestroy();
    
    expect(nextSpy).toHaveBeenCalledWith(true);
    expect(completeSpy).toHaveBeenCalled();
  });

});