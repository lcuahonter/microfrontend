// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Component } from '@angular/core';
import { IntroPermisoComponent } from './intro-permiso.component';
import { ServicioDeMensajesService } from '../../services/servicio-de-mensajes.service';
import { DesistimientoStore } from '../../estados/desistimiento-de-permiso.store';
import { DesistimientoQuery } from '../../estados/desistimiento-de-permiso.query';
import { RegistroSolicitudService } from '@ng-mf/data-access-user';
import { ToastrService, provideToastr } from 'ngx-toastr';

@Injectable()
class MockServicioDeMensajesService {
  mensaje$ = observableOf({});
  postGuardarDatos = jest.fn().mockReturnValue(observableOf({ 
    codigo: '00',
    datos: { id_solicitud: 123 },
    mensaje: 'Success'
  }));
}

@Injectable()
class MockDesistimientoStore {
  update = jest.fn();
  setIdSolicitud = jest.fn();
}

@Injectable()
class MockDesistimientoQuery {
  selectTramite$ = observableOf({
    rfc: 'TEST123',
    claveEntidadFederativa: '09',
    idTipoTramite: 140105
  });

  selectTramite140105$ = observableOf({
    rfc: 'TEST123',
    claveEntidadFederativa: '09',
    idTipoTramite: 140105,
    datos: [],
    motivoCancelacion: ''
  });

  getValue() {
    return {
      rfc: 'TEST123',
      claveEntidadFederativa: '09',
      idTipoTramite: 140105,
      idSolicitud: null,
      datos: [],
      motivoCancelacion: ''
    };
  }

  select() {
    return observableOf({
      rfc: 'TEST123',
      claveEntidadFederativa: '09', 
      idTipoTramite: 140105,
      idSolicitud: null,
      datos: [],
      motivoCancelacion: ''
    });
  }
}

@Injectable()
class MockRegistroSolicitudService {
  postGuardarDatos = jest.fn().mockReturnValue(observableOf({ success: true }));
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

describe('IntroPermisoComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, HttpClientTestingModule],
      declarations: [
        IntroPermisoComponent,
        TranslatePipe, PhoneNumberPipe, SafeHtmlPipe,
        MyCustomDirective
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        ToastrService,
        provideToastr({
          positionClass: 'toast-top-right',
        }),
        { provide: ServicioDeMensajesService, useClass: MockServicioDeMensajesService },
        { provide: DesistimientoStore, useClass: MockDesistimientoStore },
        { provide: DesistimientoQuery, useClass: MockDesistimientoQuery },
        { provide: RegistroSolicitudService, useClass: MockRegistroSolicitudService }
      ]
    }).overrideComponent(IntroPermisoComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(IntroPermisoComponent);
    component = fixture.debugElement.componentInstance;
    
    // Initialize component properties needed for tests
    component.destroyNotifier$ = {
      next: jest.fn(),
      complete: jest.fn()
    };
  });

  afterEach(() => {
    component.ngOnDestroy = function () { };
    fixture.destroy();
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #ngOnInit()', async () => {
    component.servicioDeMensajesService = component.servicioDeMensajesService || {};
    component.servicioDeMensajesService.mensaje$ = observableOf({});
    component.ngOnInit();

  });

  it('should run #ngOnDestroy()', async () => {

    component.ngOnDestroy();

  });

  it('should run #getValorIndice()', async () => {
    component.componenteWizard = component.componenteWizard || {};
    component.componenteWizard.siguiente = jest.fn();
    component.componenteWizard.atras = jest.fn();
    component.getValorIndice({
      valor: {},
      accion: {}
    });
    // expect(component.componenteWizard.siguiente).toHaveBeenCalled();
    // expect(component.componenteWizard.atras).toHaveBeenCalled();
  });

});