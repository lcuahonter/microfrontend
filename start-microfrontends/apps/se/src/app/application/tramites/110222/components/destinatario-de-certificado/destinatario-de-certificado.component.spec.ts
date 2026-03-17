
import { TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { of as observableOf, Subject } from 'rxjs';
import { DestinatarioDeCertificadoComponent } from './destinatario-de-certificado.component';

class MockStore {
  setFormDatosDelDestinatario = jest.fn();
  setFormExportador = jest.fn();
  setFormDestinatario = jest.fn();
  setFormValida = jest.fn();
}
class MockQuery {
  selectFormDatosDelDestinatario$ = observableOf({});
  selectFormDestinatario$ = observableOf({});
  selectTramite$ = observableOf({ grupoRepresentativo: {} });
}
class MockSeccionLibQuery {
  selectSeccionState$ = observableOf({});
}
class MockConsultaioQuery {
  selectConsultaioState$ = observableOf({ readonly: false });
}

import { Tramite110222Store } from '../../estados/tramite110222.store';
import { Tramite110222Query } from '../../estados/tramite110222.query';
import { SeccionLibStore, SeccionLibQuery } from '@libs/shared/data-access-user/src';
import { ConsultaioQuery } from '@ng-mf/data-access-user';

describe('DestinatarioDeCertificadoComponent', () => {
  let component: DestinatarioDeCertificadoComponent;
  let store: Tramite110222Store;
  let query: Tramite110222Query;
  let seccionQuery: SeccionLibQuery;
  let consultaQuery: ConsultaioQuery;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DestinatarioDeCertificadoComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        FormBuilder,
        { provide: Tramite110222Store, useClass: MockStore },
        { provide: Tramite110222Query, useClass: MockQuery },
        { provide: SeccionLibStore, useClass: MockStore },
        { provide: SeccionLibQuery, useClass: MockSeccionLibQuery },
        { provide: ConsultaioQuery, useClass: MockConsultaioQuery }
      ]
    }).compileComponents();
    store = TestBed.inject(Tramite110222Store) as unknown as Tramite110222Store;
    query = TestBed.inject(Tramite110222Query) as unknown as Tramite110222Query;
    seccionQuery = TestBed.inject(SeccionLibQuery) as unknown as SeccionLibQuery;
    consultaQuery = TestBed.inject(ConsultaioQuery) as unknown as ConsultaioQuery;
    component = new DestinatarioDeCertificadoComponent(
      new FormBuilder(),
      store,
      query,
      store as unknown as SeccionLibStore,
      seccionQuery,
      consultaQuery
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should call ngOnInit and not throw', () => {
    expect(() => component.ngOnInit()).not.toThrow();
  });


  it('should call datosDelDestinatarioFunc', () => {
    const spy = jest.spyOn(store, 'setFormDatosDelDestinatario');
    component.datosDelDestinatarioFunc({ foo: 'bar' });
    expect(spy).toHaveBeenCalledWith({ foo: 'bar' });
  });


  it('should call setValoresStoreDatos', () => {
    const spy = jest.spyOn(store, 'setFormDatosDelDestinatario');
    component.setValoresStoreDatos({ campo: 'foo', valor: undefined } as any);
    expect(spy).toHaveBeenCalledWith({ foo: undefined });
  });


  it('should call setValoresStoreExportador', () => {
    const spy = jest.spyOn(store, 'setFormExportador');
    component.setValoresStoreExportador({ campo: 'foo', valor: undefined } as any);
    expect(spy).toHaveBeenCalledWith({ foo: undefined });
  });


  it('should call setValoresStoreDe', () => {
    const spy = jest.spyOn(store, 'setFormDestinatario');
    component.setValoresStoreDe({ campo: 'foo', valor: undefined } as any);
    expect(spy).toHaveBeenCalledWith({ foo: undefined });
  });


  it('should call setValoresStore1 and dynamic method', () => {
    const dynamicSpy = jest.fn();
    (store as any).dynamicMethod = dynamicSpy;
    component.setValoresStore1({ VALOR: 'val', METODO_NOMBRE: 'dynamicMethod' } as any);
    expect(dynamicSpy).toHaveBeenCalledWith('val');
  });


  it('should call donanteDomicilio and create form', () => {
    component.exportadoState = { grupoRepresentativo: { lugar: '', nombre: '', empresa: '', cargo: '', registroFiscal: '', telefono: '', fax: '', correo: '' } } as any;
    component.donanteDomicilio();
    expect(component.registroFormulario).toBeDefined();
  });


  it('should get grupoRepresentativo', () => {
    component.registroFormulario = new FormGroup({ grupoRepresentativo: new FormGroup({}) });
    expect(component.grupoRepresentativo).toBeInstanceOf(FormGroup);
  });


  it('should call setFormValida', () => {
    const spy = jest.spyOn(store, 'setFormValida');
    component.setFormValida(true);
    expect(spy).toHaveBeenCalledWith({ destinatrio: true });
  });


  it('should call setFormValidaExportador', () => {
    const spy = jest.spyOn(store, 'setFormValida');
    component.setFormValidaExportador(false);
    expect(spy).toHaveBeenCalledWith({ exportador: false });
  });


  it('should call setFormValidaDestinatario', () => {
    const spy = jest.spyOn(store, 'setFormValida');
    component.setFormValidaDestinatario(true);
    expect(spy).toHaveBeenCalledWith({ datosDestinatario: true });
  });


  it('should call validateAllForms with all valid/invalid branches', () => {
    const validForm = new FormGroup({});
    Object.defineProperty(validForm, 'valid', { get: () => true });
    const invalidForm = new FormGroup({});
    Object.defineProperty(invalidForm, 'valid', { get: () => false });
    component.destinatarioComponent = { markAllFieldsTouched: jest.fn(), formDestinatario: validForm } as any;
    component.datosDelDestinatarioComponent = { markAllFieldsTouched: jest.fn(), formDatosDelDestinatario: validForm } as any;
    component.representanteLegalExportadorComponent = { markAllFieldsTouched: jest.fn(), form: validForm } as any;
    expect(component.validateAllForms()).toBe(true);
    component.destinatarioComponent = { markAllFieldsTouched: jest.fn(), formDestinatario: invalidForm } as any;
    expect(component.validateAllForms()).toBe(false);
    component.destinatarioComponent = undefined;
    expect(component.validateAllForms()).toBe(false);
    component.destinatarioComponent = { markAllFieldsTouched: jest.fn(), formDestinatario: validForm } as any;
    component.datosDelDestinatarioComponent = undefined;
    expect(component.validateAllForms()).toBe(false);
    component.datosDelDestinatarioComponent = { markAllFieldsTouched: jest.fn(), formDatosDelDestinatario: validForm } as any;
    component.representanteLegalExportadorComponent = undefined;
    expect(component.validateAllForms()).toBe(false);
  });


  it('should call validarFormulario with all branches', () => {
    component.datosDelDestinatarioComponent = { markAllFieldsTouched: jest.fn(() => true) } as any;
    component.destinatarioComponent = { validarFormularios: jest.fn(() => true) } as any;
    component.representanteLegalExportadorComponent = { markAllFieldsTouched: jest.fn(() => true) } as any;
    expect(component.validarFormulario()).toBe(true);
    component.datosDelDestinatarioComponent = { markAllFieldsTouched: jest.fn(() => false) } as any;
    expect(component.validarFormulario()).toBe(false);
    component.datosDelDestinatarioComponent = undefined;
    expect(component.validarFormulario()).toBe(false);
    component.datosDelDestinatarioComponent = { markAllFieldsTouched: jest.fn(() => true) } as any;
    component.destinatarioComponent = { validarFormularios: jest.fn(() => false) } as any;
    expect(component.validarFormulario()).toBe(false);
    component.destinatarioComponent = undefined;
    expect(component.validarFormulario()).toBe(false);
    component.destinatarioComponent = { validarFormularios: jest.fn(() => true) } as any;
    component.representanteLegalExportadorComponent = { markAllFieldsTouched: jest.fn(() => false) } as any;
    expect(component.validarFormulario()).toBe(false);
    component.representanteLegalExportadorComponent = undefined;
    expect(component.validarFormulario()).toBe(false);
  });

  it('should call iniciarFormulario', () => {
    component.fb = new FormBuilder();
    component.iniciarFormulario();
    expect(component.registroFormulario).toBeDefined();
  });

  it('should call ngOnDestroy and complete notifier', () => {
    component.destroyNotifier$ = new Subject();
    const spyNext = jest.spyOn(component.destroyNotifier$, 'next');
    const spyComplete = jest.spyOn(component.destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(spyNext).toHaveBeenCalled();
    expect(spyComplete).toHaveBeenCalled();
  });
});