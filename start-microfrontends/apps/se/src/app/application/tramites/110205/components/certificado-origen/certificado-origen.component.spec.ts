import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { CertificadoOrigenComponent } from './certificado-origen.component';
import { FormBuilder } from '@angular/forms';
import { PeruCertificadoService } from '../../services/peru-certificado.service';
import { Tramite110205Store } from '../../estados/tramite110205.store';
import { Tramite110205Query } from '../../estados/tramite110205.query';
import { SeccionLibQuery } from '@libs/shared/data-access-user/src';
import { ConsultaioQuery } from '@ng-mf/data-access-user';

@Injectable()
class MockPeruCertificadoService {}

@Injectable()
class MockTramite110205Store {}

@Injectable()
class MockTramite110205Query {
  formCertificado$ = observableOf({});
}


describe('CertificadoOrigenComponent', () => {
  let fixture: ComponentFixture<CertificadoOrigenComponent>;
  let component: { ngOnDestroy: () => void; seccionQuery: { selectSeccionState$?: any; }; consultaQuery: { selectConsultaioState$?: any; }; query: { selectPeru$?: any; selectmercanciaTabla$?: any; }; estadoOpcion: jest.Mock<any, any, any> | (() => void); paisOpcion: jest.Mock<any, any, any> | (() => void); ngOnInit: () => void; store: { setFormCertificadoGenric?: any; setEstado?: any; setBloque?: any; setFormMercancia?: any; setFormValida?: any; }; setValoresStore: (arg0: {}) => void; peruCertificadoService: { obtenerMenuDesplegable?: any; obtenerTablaDatos?: any; }; conseguirDisponiblesDatos: () => void; tipoEstadoSeleccion: (arg0: {}) => void; tipoSeleccion: (arg0: {}) => void; modalInstance: { show?: any; hide?: any; }; abrirModificarModal: (arg0: {}) => void; cerrarModificarModal: () => void; modifyModal: { nativeElement?: any; }; ngAfterViewInit: () => void; setFormValida: (arg0: {}) => void; guardarClicado: (arg0: {}) => void; destroyNotifier$: { next?: any; complete?: any; }; };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule ],
      declarations: [
        CertificadoOrigenComponent,
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        FormBuilder,
        { provide: PeruCertificadoService, useClass: MockPeruCertificadoService },
        { provide: Tramite110205Store, useClass: MockTramite110205Store },
        { provide: Tramite110205Query, useClass: MockTramite110205Query },
        SeccionLibQuery,
        ConsultaioQuery
      ]
    }).overrideComponent(CertificadoOrigenComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(CertificadoOrigenComponent);
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
    component.seccionQuery = component.seccionQuery || {};
    component.seccionQuery.selectSeccionState$ = observableOf({});
    component.consultaQuery = component.consultaQuery || {};
    component.consultaQuery.selectConsultaioState$ = observableOf({});
    component.query = component.query || {};
    component.query.selectPeru$ = observableOf({});
    component.query.selectmercanciaTabla$ = 'selectmercanciaTabla$';
    component.estadoOpcion = jest.fn();
    component.paisOpcion = jest.fn();
    component.ngOnInit();
    // expect(component.estadoOpcion).toHaveBeenCalled();
    // expect(component.paisOpcion).toHaveBeenCalled();
  });

  it('should run #setValoresStore()', async () => {
    component.store = component.store || {};
    component.store.setFormCertificadoGenric = jest.fn();
    component.setValoresStore({});
    // expect(component.store.setFormCertificadoGenric).toHaveBeenCalled();
  });

  it('should run #conseguirDisponiblesDatos()', async () => {
    component.peruCertificadoService = component.peruCertificadoService || {};
    component.peruCertificadoService.obtenerTablaDatos = jest.fn().mockReturnValue(observableOf({}));
    component.conseguirDisponiblesDatos();
    // expect(component.peruCertificadoService.obtenerTablaDatos).toHaveBeenCalled();
  });

  it('should run #tipoEstadoSeleccion()', async () => {
    component.store = component.store || {};
    component.store.setEstado = jest.fn();
    component.tipoEstadoSeleccion({});
    // expect(component.store.setEstado).toHaveBeenCalled();
  });

  it('should run #tipoSeleccion()', async () => {
    component.store = component.store || {};
    component.store.setBloque = jest.fn();
    component.tipoSeleccion({});
    // expect(component.store.setBloque).toHaveBeenCalled();
  });

  it('should run #abrirModificarModal()', async () => {
    component.store = component.store || {};
    component.store.setFormMercancia = jest.fn();
    component.modalInstance = component.modalInstance || {};
    component.modalInstance.show = jest.fn();
    component.abrirModificarModal({});
    // expect(component.store.setFormMercancia).toHaveBeenCalled();
    // expect(component.modalInstance.show).toHaveBeenCalled();
  });

  it('should run #cerrarModificarModal()', async () => {
    component.modalInstance = component.modalInstance || {};
    component.modalInstance.hide = jest.fn();
    component.cerrarModificarModal();
    // expect(component.modalInstance.hide).toHaveBeenCalled();
  });

  it('should run #setFormValida()', async () => {
    component.store = component.store || {};
    component.store.setFormValida = jest.fn();
    component.setFormValida({});
    // expect(component.store.setFormValida).toHaveBeenCalled();
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