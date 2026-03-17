// @ts-nocheck
import { SeccionLibStore, SeccionLibQuery } from '@libs/shared/data-access-user/src';
import { ConsultaioQuery } from '@ng-mf/data-access-user';

import { Tramite110222Store } from '../../estados/tramite110222.store';
import {Tramite110222Query} from '../../estados/tramite110222.query';
import { ValidarInicialmenteCertificadoService } from '../../services/validar-inicialmente-certificado.service';
import { TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CertificadoOrigenComponent } from './certificado-origen.component';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService, TOAST_CONFIG, ToastConfig } from 'ngx-toastr';
import { of, Subject } from 'rxjs';
class MockToastrService {
  success = jest.fn();
  error = jest.fn();
  info = jest.fn();
  warning = jest.fn();
}

class MockValidarInicialmenteCertificadoService {}
class MockTramite110222Store {
  setFormValida = jest.fn();
  setmercanciaTabla = jest.fn();
}
class MockTramite110222Query {
  formCertificado$ = of({});
  selectPeru$ = of({});
}
describe('CertificadoOrigenComponent', () => {
  let fixture;
  let component;
  let store;

  beforeEach(() => {
    TestBed.configureTestingModule({
  imports: [ FormsModule, ReactiveFormsModule, CommonModule ],
  declarations: [ CertificadoOrigenComponent ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
  providers: [
  FormBuilder,
        { provide: ValidarInicialmenteCertificadoService, useClass: MockValidarInicialmenteCertificadoService },
        { provide: Tramite110222Store, useClass: MockTramite110222Store },
        { provide: Tramite110222Query, useClass: MockTramite110222Query },
        SeccionLibStore,
        SeccionLibQuery,
        ConsultaioQuery,
        { provide: ToastrService, useClass: MockToastrService },
        { provide: TOAST_CONFIG, useValue: {} as Partial<ToastConfig> }
      ]
    }).overrideComponent(CertificadoOrigenComponent, {
    }).compileComponents();
  fixture = TestBed.createComponent(CertificadoOrigenComponent);
  component = fixture.debugElement.componentInstance;
  store = TestBed.inject(Tramite110222Store);
  });

  it('should run #constructor()',  () => {
    expect(component).toBeTruthy();
  });

  it('should run #ngOnInit()',  () => {
    component.seccionQuery = component.seccionQuery || {};
    component.seccionQuery.selectSeccionState$ = of({});
    component.consultaQuery = component.consultaQuery || {};
    component.consultaQuery.selectConsultaioState$ = of({});
    component.query = component.query || {};
    component.query.selectTramite$ = of({});
    component.query.selectmercanciaTabla$ = 'selectmercanciaTabla$';
    expect(() => component.ngOnInit()).not.toThrow();
  });

  it('should run #setValoresStore()',  () => {
    component.store = component.store || {};
    component.store.setFormCertificadoGenric = jest.fn();
    component.setValoresStore({});
    expect(component.store.setFormCertificadoGenric).toHaveBeenCalled();
  });


  it('should run #conseguirDisponiblesDatos()',  () => {
    component.ValidarInicialmenteCertificadoService = component.ValidarInicialmenteCertificadoService || {};
  component.ValidarInicialmenteCertificadoService.obtenerTablaDatos = jest.fn().mockReturnValue(of({}));
    component.conseguirDisponiblesDatos();
  });

  it('should run #obtenerDatosFormulario()',  () => {
    component.store = component.store || {};
    component.store.setFormCertificado = jest.fn();
    component.obtenerDatosFormulario({});
  });

  it('should run #tipoEstadoSeleccion()',  () => {
    component.store = component.store || {};
    component.store.setEstado = jest.fn();
    component.tipoEstadoSeleccion({});
  });

  it('should run #tipoSeleccion()',  () => {
    component.store = component.store || {};
    component.store.setBloque = jest.fn();
    component.tipoSeleccion({});
  });

  it('should run #abrirModificarModal()', () => {
    component.store = component.store || {};
    component.store.setFormMercancia = jest.fn();
    component.modalInstance = component.modalInstance || {};
    component.modalInstance.show = jest.fn();
    component.abrirModificarModal({});
  });

  it('should call cerrarModificarModal and hide modal', () => {
    component.modalInstance = { hide: jest.fn() };
    component.cerrarModificarModal();
    expect(component.modalInstance.hide).toHaveBeenCalled();
  });

  it('should call setFormValida', () => {
    const spy = jest.spyOn(store, 'setFormValida');
    component.store = store;
    component.setFormValida(true);
    expect(spy).toHaveBeenCalledWith({ certificado: true });
  });

  it('should call guardarClicado and set datosTabla$', () => {
    component.guardarClicado([{ id: 1 }]);
    expect(component.datosTabla$).toEqual([{ id: 1 }]);
  });

  it('should call emitmercaniasDatos and setmercanciaTabla', () => {
    const spy = jest.spyOn(store, 'setmercanciaTabla');
    component.store = store;
    component.emitmercaniasDatos({ id: 1 });
    expect(spy).toHaveBeenCalledWith([{ id: 1 }]);
  });

  it('should call ngAfterViewInit and set modalInstance', () => {
    const modalElement = document.createElement('div');
    component.modifyModal = { nativeElement: modalElement };
    window.bootstrap = { Modal: jest.fn(() => ({ test: true })) };
    component.ngAfterViewInit();
    expect(component.modalInstance).toBeDefined();
  });

  it('should call ngOnDestroy and complete notifier', () => {
    component.destroyNotifier$ = new Subject();
    const spyNext = jest.spyOn(component.destroyNotifier$, 'next');
    const spyComplete = jest.spyOn(component.destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(spyNext).toHaveBeenCalled();
    expect(spyComplete).toHaveBeenCalled();
  });

  it('should validate validarFormulario true/false', () => {
    component.certificadoDeOrigen = { validarFormularios: jest.fn(() => true) };
    expect(component.validarFormulario()).toBe(true);
    component.certificadoDeOrigen = { validarFormularios: jest.fn(() => false) };
    expect(component.validarFormulario()).toBe(false);
    component.certificadoDeOrigen = undefined;
    expect(component.validarFormulario()).toBe(false);
  });
});