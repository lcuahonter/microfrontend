// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { PeruCertificadoComponent } from './peru-certificado.component';
import { SeccionLibStore } from '@ng-mf/data-access-user';
import { Tramite110205Query } from '../../estados/tramite110205.query';
import { Tramite110205Store } from '../../estados/tramite110205.store';
import { PeruCertificadoService } from '../../services/peru-certificado.service';
import { ToastrService } from 'ngx-toastr';

@Injectable()
class MockTramite110205Query {
  FormaValida$ = observableOf({});
  selectCambioModalidad$ = observableOf({
    cambioError: false,
    serviciosImmxError: false
  });
}

@Injectable()
class MockTramite110205Store {}

@Injectable()
class MockPeruCertificadoService {
  buildProductoresPorExportador = jest.fn().mockReturnValue([]);
  buildMercanciasProductor = jest.fn().mockReturnValue([]);
  guardarDatosPost = jest.fn().mockReturnValue(observableOf({
    datos: { idSolicitud: 123 }
  }));
  getAllState = jest.fn().mockReturnValue(observableOf({}));
}

@Injectable()
class MockToastrService {
  success = jest.fn();
  error = jest.fn();
  info = jest.fn();
  warning = jest.fn();
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

describe('PeruCertificadoComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule ],
      declarations: [
        PeruCertificadoComponent,
        TranslatePipe, PhoneNumberPipe, SafeHtmlPipe,
        MyCustomDirective
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        SeccionLibStore,
        { provide: Tramite110205Query, useClass: MockTramite110205Query },
        { provide: Tramite110205Store, useClass: MockTramite110205Store },
        { provide: PeruCertificadoService, useClass: MockPeruCertificadoService },
        { provide: ToastrService, useClass: MockToastrService }
      ]


    }).compileComponents();
    fixture = TestBed.createComponent(PeruCertificadoComponent);
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
    expect(() => component.ngOnInit()).not.toThrow();
  });

  it('should run #getValorIndice()', async () => {
    component.datosPasos = component.datosPasos || {};
    component.datosPasos.indice = 'indice';
    component.validarTodosFormulariosPasoUno = jest.fn();
    component.obtenerDatosDelStore = jest.fn();
    component.pasos = component.pasos || {};
    component.pasoNavegarPor = jest.fn();
    component.getValorIndice({
      accion: {},
      valor: {}
    });
  });

  it('should run #pasoNavegarPor()', async () => {
    component.datosPasos = component.datosPasos || {};
    component.datosPasos.indice = 'indice';
    component.wizardComponent = component.wizardComponent || {};
    component.wizardComponent.siguiente = jest.fn();
    component.wizardComponent.atras = jest.fn();
    component.pasoNavegarPor({
      valor: {},
      accion: {}
    });
  });

  it('should run #obtenerDatosDelStore()', async () => {
    component.guardar = jest.fn();
    component.obtenerDatosDelStore();
    expect(component.peruCertificadoService.getAllState).toHaveBeenCalled();
  });

  it('should run #validarTodosFormulariosPasoUno()', async () => {
    component.pasoUnoComponent = component.pasoUnoComponent || {};
    component.pasoUnoComponent.validarFormularios = jest.fn();
    component.validarTodosFormulariosPasoUno();
  });

  it('should run #guardar()', async () => {
    component.solicitudState = { idSolicitud: 123 };
    component.tramite110205Store = { setIdSolicitud: jest.fn() };
    component.pasoNavegarPor = jest.fn();
    component.guardar({
      agregarProductoresExportador: {},
      productoresExportador: {},
      mercanciaProductores: {},
      formCertificado: {
        'entidadFederativa': {},
        'bloque': {},
        'fraccionArancelariaForm': {},
        'nombreComercialForm': {},
        'numeroDeRegistroProductoForm': {},
        'fechaInicioInput': {},
        'fechaFinalInput': {},
        'si': {},
        'nombres': {},
        'primerApellido': {},
        'segundoApellido': {},
        'numeroDeRegistroFiscal': {},
        'razonSocial': {},
        'pais': {},
        'ciudad': {},
        'calle': {},
        'numeroLetra': {},
        'telefono': {},
        'correo': {}
      },
      mercanciaTabla: [{
        id: {},
        fraccionArancelaria: {},
        tipoFactura: {},
        numeroFactura: {},
        complementoDescripcion: {},
        fechaFactura: {},
        cantidad: {},
        umc: {},
        valorMercancia: {}
      }],
      formDatosDelDestinatario: {
        'nombres': {},
        'primerApellido': {},
        'segundoApellido': {},
        'numeroDeRegistroFiscal': {},
        'razonSocial': {},
        'medioTransporte': {}
      },
      formDestinatario: {
        'ciudad': {},
        'calle': {},
        'numeroLetra': {},
        'lada': {},
        'telefono': {},
        'fax': {},
        'correoElectronico': {},
        'paisDestino': {}
      },
      formExportor: {
        'lugar': {},
        'exportador': {},
        'nombres': {},
        'puesto': {},
        'telefono': {},
        'correoElectronico': {}
      },
      formDatosCertificado: {
        'observacionesDates': {},
        'idiomaDates': {},
        'EntidadFederativaDates': {},
        'representacionFederalDates': {}
      },
      formulario: {
        'datosConfidencialesProductor': {},
        'productorMismoExportador': {}
      }
    });
  });

  it('should run #ngOnDestroy()', async () => {
    component.destroyNotifier$ = component.destroyNotifier$ || {};
    component.destroyNotifier$.next = jest.fn();
    component.destroyNotifier$.complete = jest.fn();
    component.ngOnDestroy();
  });

});