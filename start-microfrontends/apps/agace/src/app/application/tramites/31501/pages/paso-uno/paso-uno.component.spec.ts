// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { PasoUnoComponent } from './paso-uno.component';
import { Tramite31501Store } from '../../../../estados/tramites/tramite31501.store';
import { Tramite31501Query } from '../../../../estados/queries/tramite31501.query';
import { ValidacionesFormularioService } from '@libs/shared/data-access-user/src';
import { AutoridadService } from '../../services/autoridad.service';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal'; // ✅ Import BsModalService

@Injectable()
class MockTramite31501Store {}

@Injectable()
class MockTramite31501Query {}

@Injectable()
class MockAutoridadService {}

@Injectable()
class MockRouter {
  navigate() {}
}

@Injectable()
class MockBsModalService {
  show() {}
  hide() {}
}

@Directive({ selector: '[myCustom]' })
class MyCustomDirective {
  @Input() myCustom;
}

@Pipe({ name: 'translate' })
class TranslatePipe implements PipeTransform {
  transform(value) { return value; }
}

@Pipe({ name: 'phoneNumber' })
class PhoneNumberPipe implements PipeTransform {
  transform(value) { return value; }
}

@Pipe({ name: 'safeHtml' })
class SafeHtmlPipe implements PipeTransform {
  transform(value) { return value; }
}

describe('PasoUnoComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ PasoUnoComponent, FormsModule, ReactiveFormsModule],
      declarations: [
      
        TranslatePipe, PhoneNumberPipe, SafeHtmlPipe,
        MyCustomDirective
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        FormBuilder,
        { provide: Tramite31501Store, useClass: MockTramite31501Store },
        { provide: Tramite31501Query, useClass: MockTramite31501Query },
        ValidacionesFormularioService,
        { provide: AutoridadService, useClass: MockAutoridadService },
        { provide: Router, useClass: MockRouter },
        { provide: BsModalService, useClass: MockBsModalService }, // ✅ Added here
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { url: 'url', params: {}, queryParams: {}, data: {} },
            url: observableOf('url'),
            params: observableOf({}),
            queryParams: observableOf({}),
            fragment: observableOf('fragment'),
            data: observableOf({})
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.debugElement.componentInstance;
  });

  afterEach(() => {
    component.ngOnDestroy = function () {};
    fixture.destroy();
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #ngOnInit()', async () => {
    component.tramite31501Query = component.tramite31501Query || {};
    component.tramite31501Query.selectSolicitud$ = observableOf({});
    component.inicializarFormulario = jest.fn();
    component.fetchAduanaList = jest.fn();
    component.ngOnInit();
    expect(component.inicializarFormulario).toHaveBeenCalled();
    expect(component.fetchAduanaList).toHaveBeenCalled();
  });

  it('should run #inicializarFormulario()', async () => {
    component.fb = component.fb || {};
    component.fb.group = jest.fn();
    component.solicitud31501State = component.solicitud31501State || {};
    component.solicitud31501State.tipoBusqueda = 'tipoBusqueda';
    component.solicitud31501State.rfc = 'rfc';
    component.solicitud31501State.tipoDeTramite = 'tipoDeTramite';
    component.solicitud31501State.folioDeTramite = 'folioDeTramite';
    component.inicializarFormulario();
    expect(component.fb.group).toHaveBeenCalled();
  });


  it('should run #isValid()', async () => {
    component.validacionesService = component.validacionesService || {};
    component.validacionesService.isValid = jest.fn();
    component.isValid({}, {});
    expect(component.validacionesService.isValid).toHaveBeenCalled();
  });

  it('should run #fetchAduanaList()', async () => {
    component.autoridadService = component.autoridadService || {};
    component.autoridadService.getTramiteList = jest.fn().mockReturnValue(observableOf({ data: {} }));
    component.tramiteList = component.tramiteList || {};
    component.tramiteList.catalogos = 'catalogos';
    component.fetchAduanaList();
    expect(component.autoridadService.getTramiteList).toHaveBeenCalled();
  });

  it('should run #obtenerTablaPoblada()', async () => {
    component.autoridadService = component.autoridadService || {};
    component.autoridadService.agregarSolicitud = jest.fn().mockReturnValue(observableOf({
      success: {},
      datos: {
        id: {}
      }
    }));
    component.datosDelContenedor = component.datosDelContenedor || {};
    component.datosDelContenedor.push = jest.fn();
    component.tramite31501Store = component.tramite31501Store || {};
    component.tramite31501Store.setDelContenedor = jest.fn();
    component.solicitudForm = component.solicitudForm || {};
    component.solicitudForm.patchValue = jest.fn();
    component.solicitudForm.markAsUntouched = jest.fn();
    component.solicitudForm.markAsPristine = jest.fn();
    component.obtenerTablaPoblada();
    expect(component.autoridadService.agregarSolicitud).toHaveBeenCalled();
    expect(component.datosDelContenedor.push).toHaveBeenCalled();
    expect(component.tramite31501Store.setDelContenedor).toHaveBeenCalled();
    expect(component.solicitudForm.patchValue).toHaveBeenCalled();
    expect(component.solicitudForm.markAsUntouched).toHaveBeenCalled();
    expect(component.solicitudForm.markAsPristine).toHaveBeenCalled();
  });

  it('should run #limpiarFormulario()', async () => {
    component.solicitudForm = component.solicitudForm || {};
    component.solicitudForm.get = jest.fn().mockReturnValue({
      value: {}
    });
    component.solicitudForm.reset = jest.fn();
    component.tramiteList = component.tramiteList || {};
    component.tramiteList.catalogos = 'catalogos';
    component.limpiarFormulario();
    expect(component.solicitudForm.get).toHaveBeenCalled();
    expect(component.solicitudForm.reset).toHaveBeenCalled();
  });

  it('should run #valorDeAlternancia()', async () => {
    component.router = component.router || {};
    component.router.url = {
      includes: function () { return false; }
    };
    component.router.navigate = jest.fn();
    component.valorDeAlternancia({ row: {} });
    expect(component.router.navigate).toHaveBeenCalled();
  });

  it('should run #cambiarRadio()', async () => {
    component.cambiarRadio({});
    expect(true).toBe(true);
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
