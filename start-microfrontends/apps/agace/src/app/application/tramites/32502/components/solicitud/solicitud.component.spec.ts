// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { SolicitudComponent } from './solicitud.component';
import { AvisoService } from '../../services/aviso.service';
import { FormBuilder } from '@angular/forms';
import { ValidacionesFormularioService, ConsultaioQuery } from '@ng-mf/data-access-user';
import { Tramite32502Store } from '../../../../estados/tramites/tramite32502.store';
import { Tramite32502Query } from '../../../../estados/queries/tramite32502.query';

@Injectable()
class MockAvisoService {}



@Injectable()
class MockTramite32502Store {
  establecerDatos = jest.fn(); 
}


@Injectable()
class MockTramite32502Query {}

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

describe('SolicitudComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule ],
      declarations: [
        SolicitudComponent,
        TranslatePipe, PhoneNumberPipe, SafeHtmlPipe,
        MyCustomDirective
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        { provide: AvisoService, useClass: MockAvisoService },
        FormBuilder,
        ValidacionesFormularioService,
        { provide: Tramite32502Store, useClass: MockTramite32502Store },
        { provide: Tramite32502Query, useClass: MockTramite32502Query },
        ConsultaioQuery
      ]
    }).overrideComponent(SolicitudComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(SolicitudComponent);
    component = fixture.debugElement.componentInstance;
  });

  afterEach(() => {
    component.ngOnDestroy = function() {};
    fixture.destroy();
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run GetterDeclaration #adaceForm', async () => {
    component.FormSolicitud = component.FormSolicitud || {};
    component.FormSolicitud.get = jest.fn();
    const adaceForm = component.adaceForm;
   
  });

  it('should run GetterDeclaration #extranjeroAvisoAgace', async () => {
    component.FormSolicitud = component.FormSolicitud || {};
    component.FormSolicitud.get = jest.fn();
    const extranjeroAvisoAgace = component.extranjeroAvisoAgace;
    
  });

  it('should run GetterDeclaration #mercanciaST', async () => {
    component.FormSolicitud = component.FormSolicitud || {};
    component.FormSolicitud.get = jest.fn();
    const mercanciaST = component.mercanciaST;
   
  });

  it('should run GetterDeclaration #direccionST', async () => {
    component.FormSolicitud = component.FormSolicitud || {};
    component.FormSolicitud.get = jest.fn();
    const direccionST = component.direccionST;
  
  });

  it('should run GetterDeclaration #pedimentoST', async () => {
    component.FormSolicitud = component.FormSolicitud || {};
    component.FormSolicitud.get = jest.fn();
    const pedimentoST = component.pedimentoST;
    
  });

  it('should run #ngOnInit()', async () => {
    component.inicializarEstadoFormulario = jest.fn();
    component.inicializaCatalogos = jest.fn();
    component.tramite32502Query = component.tramite32502Query || {};
    component.tramite32502Query.select = jest.fn().mockReturnValue(observableOf({}));
    component.crearFormSolicitud = jest.fn();
    component.ngOnInit();
   
  });

  it('should run #ngOnDestroy()', async () => {
    component.destroy$ = component.destroy$ || {};
    component.destroy$.next = jest.fn();
    component.destroy$.complete = jest.fn();
    component.ngOnDestroy();
   
  });

  it('should run #isValid()', async () => {
    component.validacionesService = component.validacionesService || {};
    component.validacionesService.isValid = jest.fn();
    component.isValid({}, {});
  
  });

  it('should run #allowOnlyNumbers()', async () => {

    component.allowOnlyNumbers({
      key: {},
      preventDefault: function() {}
    });

  });

  it('should run #crearFormSolicitud()', async () => {
    component.tramite32502Query = component.tramite32502Query || {};
    component.tramite32502Query.selectSolicitud$ = observableOf({});
    component.seccionState = component.seccionState || {};
    component.seccionState.adace = 'adace';
    component.seccionState.razonSocial = 'razonSocial';
    component.seccionState.rfc = 'rfc';
    component.seccionState.rfcExtranjero = 'rfcExtranjero';
    component.seccionState.cveFraccionArancelaria = 'cveFraccionArancelaria';
    component.seccionState.reglaFraccion = 'reglaFraccion';
    component.seccionState.nico = 'nico';
    component.seccionState.valorUSD = 'valorUSD';
    component.seccionState.marca = 'marca';
    component.seccionState.peso = 'peso';
    component.seccionState.fechaInicio = 'fechaInicio';
    component.seccionState.numeroSerie = 'numeroSerie';
    component.seccionState.descripcionMercancia = 'descripcionMercancia';
    component.seccionState.informacionExtra = 'informacionExtra';
    component.seccionState.entidadFederativa = 'entidadFederativa';
    component.seccionState.delegacionMunicipio = 'delegacionMunicipio';
    component.seccionState.colonia = 'colonia';
    component.seccionState.calle = 'calle';
    component.seccionState.numeroExterior = 'numeroExterior';
    component.seccionState.numeroInterior = 'numeroInterior';
    component.seccionState.codigoPostal = 'codigoPostal';
    component.seccionState.patenteAutorizacion = 'patenteAutorizacion';
    component.seccionState.rfcAgenteAduanal = 'rfcAgenteAduanal';
    component.seccionState.numeroPedimento = 'numeroPedimento';
    component.seccionState.claveAduana = 'claveAduana';
    component.seccionState.informacionConfidencial = 'informacionConfidencial';
    component.fb = component.fb || {};
    component.fb.group = jest.fn().mockReturnValue({
      enable: function() {},
      disable: function() {}
    });
    component.crearFormSolicitud();
    
  });

  it('should run #inicializaCatalogos()', async () => {
    component.avisoService = component.avisoService || {};
    component.avisoService.getFraccionArancelariaCatalogo = jest.fn().mockReturnValue(observableOf({
      0: "F",
      1: "R",
      2: "A",
      3: "C",
      4: "C",
      5: "I",
      6: "O",
      7: "N",
      8: "_",
      9: "A",
      10: "R",
      11: "A",
      12: "N",
      13: "C",
      14: "E",
      15: "L",
      16: "A",
      17: "T",
      18: "I",
      19: "A",
      20: "$"
    }));
    component.avisoService.getFraccionReglaCatalogo = jest.fn().mockReturnValue(observableOf({
      0: "R",
      1: "E",
      2: "G",
      3: "L",
      4: "A",
      5: "_",
      6: "A",
      7: "R",
      8: "A",
      9: "N",
      10: "C",
      11: "E",
      12: "L",
      13: "A",
      14: "R",
      15: "I",
      16: "A",
      17: "$"
    }));
    component.inicializaCatalogos();
   
  });

 

  it('should call establecerDatos with correct values from the form', () => {
    
    const tramite32502StoreMock = TestBed.inject(Tramite32502Store);
    const establecerDatosSpy = jest.spyOn(tramite32502StoreMock, 'establecerDatos');
  
    component.FormSolicitud = new FormBuilder().group({
      adaceForm: new FormBuilder().group({
        adace: ['Centro'],
      }),
      extranjeroAvisoAgace: new FormBuilder().group({
        razonSocial: ['Test Razon Social'],
        rfc: ['TEST123456ABC'],
        rfcExtranjero: ['RFC123'],
      }),
      mercanciaST: new FormBuilder().group({
        cveFraccionArancelaria: ['1234'],
        reglaFraccion: ['Regla 1'],
        nico: ['NICO'],
        valorUSD: ['1000'],
        marca: ['Marca Test'],
        peso: ['50.5'],
        fechaInicio: ['2023-01-01'],
        numeroSerie: ['12345'],
        descripcionMercancia: ['Descripcion Test'],
      }),
      direccionST: new FormBuilder().group({
        informacionExtra: ['Extra Info'],
        entidadFederativa: ['Entidad Test'],
        delegacionMunicipio: ['Municipio Test'],
        colonia: ['Colonia Test'],
        calle: ['Calle Test'],
        numeroExterior: ['123'],
        numeroInterior: ['A'],
        codigoPostal: ['12345'],
      }),
      pedimentoST: new FormBuilder().group({
        patenteAutorizacion: ['1234'],
        rfcAgenteAduanal: ['RFC123456ABC'],
        numeroPedimento: ['56789'],
        claveAduana: ['Clave Test'],
        informacionConfidencial: [true],
      }),
    });
  
    component.setValoresStore(component.FormSolicitud);
  
    
    expect(establecerDatosSpy).toHaveBeenCalledWith({
      razonSocial: 'Test Razon Social',
      rfc: 'TEST123456ABC',
      rfcExtranjero: 'RFC123',
      cveFraccionArancelaria: '1234',
      reglaFraccion: 'Regla 1',
      nico: 'NICO',
      valorUSD: '1000',
      marca: 'Marca Test',
      peso: '50.5',
      fechaInicio: '2023-01-01',
      numeroSerie: '12345',
      descripcionMercancia: 'Descripcion Test',
      informacionExtra: 'Extra Info',
      entidadFederativa: 'Entidad Test',
      delegacionMunicipio: 'Municipio Test',
      colonia: 'Colonia Test',
      calle: 'Calle Test',
      numeroExterior: '123',
      numeroInterior: 'A',
      codigoPostal: '12345',
      patenteAutorizacion: '1234',
      rfcAgenteAduanal: 'RFC123456ABC',
      numeroPedimento: '56789',
      claveAduana: 'Clave Test',
      adace: 'Centro',
      informacionConfidencial: true,
    });
  });


 

  it('should run #validarFormulario()', async () => {
    component.FormSolicitud = component.FormSolicitud || {};
    component.FormSolicitud.invalid = 'invalid';
    component.FormSolicitud.markAllAsTouched = jest.fn();
    component.validarFormulario();
    
  });

 

  it('should run #inicializarEstadoFormulario()', async () => {
    component.guardarDatosFormulario = jest.fn();
    component.crearFormSolicitud = jest.fn();
    component.inicializarEstadoFormulario();
    
  });

  it('should run #permitirSoloNumerosDecimal()', async () => {

    component.permitirSoloNumerosDecimal({
      key: {},
      target: {
        value: {
          includes: function() {}
        }
      },
      ctrlKey: {},
      metaKey: {},
      preventDefault: function() {}
    });

  });

  it('should run #permitirSoloNumeros()', async () => {

    component.permitirSoloNumeros({
      key: {},
      preventDefault: function() {}
    });

  });

  it('should run #guardarDatosFormulario()', async () => {
    component.crearFormSolicitud = jest.fn();
    component.guardarDatosFormulario();
   
  });

});