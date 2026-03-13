// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { RegistroModificacionComponent } from './registro-modificacion.component';
import { Router, ActivatedRoute } from '@angular/router';
import { ImmerModificacionService } from '../../service/immer-modificacion.service';


@Injectable()
class MockRouter {
  navigate() {};
}

@Injectable()
class MockActivatedRoute {
  snapshot = {};
  params = observableOf({});
  queryParams = observableOf({});
  data = observableOf({});
}

@Injectable()
class MockImmerModificacionService {}

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

describe('RegistroModificacionComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ RegistroModificacionComponent, FormsModule, ReactiveFormsModule ],
      declarations: [
       
        TranslatePipe, PhoneNumberPipe, SafeHtmlPipe,
        MyCustomDirective
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        { provide: Router, useClass: MockRouter },
        { provide: ImmerModificacionService, useClass: MockImmerModificacionService },
        { provide: ActivatedRoute, useClass: MockActivatedRoute }
      ]
    }).overrideComponent(RegistroModificacionComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(RegistroModificacionComponent);
    component = fixture.debugElement.componentInstance;
  });

  afterEach(() => {
    if (component) {
      component.ngOnDestroy = function() {};
    }
    if (fixture) {
      fixture.destroy();
    }
  });


  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should have encabezadoDeTabla defined and be an array', () => {
    expect(component.encabezadoDeTabla).toBeDefined();
    expect(Array.isArray(component.encabezadoDeTabla)).toBe(true);
  });

  it('should navigate to /se/immex-modificacion/solicitud in valorDeAlternancia', () => {
    component.router = { url: 'something/se/other', navigate: jest.fn() } as any;
    component.valorDeAlternancia();
    expect(component.router.navigate).toHaveBeenCalledWith(['/se/immex-modificacion/solicitud']);
  });

  it('should navigate to /pago/immex-modificacion/solicitud in valorDeAlternancia', () => {
    component.router = { url: 'something/pago/other', navigate: jest.fn() } as any;
    component.valorDeAlternancia();
    expect(component.router.navigate).toHaveBeenCalledWith(['/pago/immex-modificacion/solicitud']);
  });

  it('should call actualizarSeleccionadaPrograma and navigate in onFilaClic', () => {
    const event = { folioPrograma: '123', tipoPrograma: 'IMMEX' };
    component.actualizarSeleccionadaPrograma = jest.fn();
    component.router = { navigate: jest.fn() } as any;
    component.route = {} as any;
    component.onFilaClic(event);
    expect(component.actualizarSeleccionadaPrograma).toHaveBeenCalledWith(event);
    expect(component.router.navigate).toHaveBeenCalledWith(['../solicitud'], { relativeTo: component.route });
  });

  it('should be standalone and have correct selector', () => {
    const metadata = (RegistroModificacionComponent as any).ɵcmp;
    expect(metadata.standalone).toBe(true);
    expect(metadata.selectors[0][0]).toBe('app-registro-modificacion');
  });

  it('should run #ngOnInit()', async () => {
    component.llenarLaTabla = jest.fn();
    component.ngOnInit();
    expect(component.llenarLaTabla).toHaveBeenCalled();
  });

  it('should run #ngOnDestroy()', async () => {
    component.destroyNotifier$ = component.destroyNotifier$ || {};
    component.destroyNotifier$.next = jest.fn();
    component.destroyNotifier$.complete = jest.fn();
    component.ngOnDestroy();
    expect(component.destroyNotifier$.next).toHaveBeenCalled();
    expect(component.destroyNotifier$.complete).toHaveBeenCalled();
  });

  it('should run #valorDeAlternancia()', async () => {
    component.router = component.router || {};
    component.router.url = {
      includes: function() {}
    };
    component.router.navigate = jest.fn();
    component.valorDeAlternancia();
    expect(component.router.navigate).toHaveBeenCalled();
  });

});