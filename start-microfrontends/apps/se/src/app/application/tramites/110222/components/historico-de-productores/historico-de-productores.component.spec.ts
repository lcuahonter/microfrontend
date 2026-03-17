// @ts-nocheck

import { TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { of as observableOf, Subject } from 'rxjs';
import { HistoricoDeProductoresComponent } from './historico-de-productores.component';
import { Tramite110222Store } from '../../estados/tramite110222.store';
import { Tramite110222Query } from '../../estados/tramite110222.query';
import { ValidarInicialmenteCertificadoService } from '../../services/validar-inicialmente-certificado.service';
import { ConsultaioQuery } from '@ng-mf/data-access-user';

class MockCertService {
  obtenerProductorPorExportador = jest.fn(() => observableOf({ datos: [] }));
  getTipoFactura = jest.fn(() => observableOf({ datos: [{ id: 1 }] }));
  agregarProductores = jest.fn(() => observableOf({ datos: [{ nombreCompleto: 'a', rfc: 'b', direccionCompleta: 'c', correoElectronico: 'd', telefono: 'e', fax: 'f' }] }));
}
class MockStore {
  setProductoresExportador = jest.fn();
  setTipoFacturaOpciones = jest.fn();
  setFormHistorico = jest.fn();
  setAgregarFormDatosProductor = jest.fn();
  setAgregarProductoresExportador = jest.fn();
  setFormValidity = jest.fn();
  setmercanciaTabla = jest.fn();
}
class MockQuery {
  selectAgregarProductoresExportador$ = observableOf([]);
  selectTramite$ = observableOf({ productoresExportador: [], mercanciaTabla: [], optionsTipoFactura: [{ id: 1 }], solicitudState: {}, formCertificado: {}, formDatosCertificado: {} });
  formulario$ = observableOf({});
  agregarDatosProductorFormulario$ = observableOf({});
}
class MockConsultaioQuery {
  selectConsultaioState$ = observableOf({ readonly: false });
}


describe('HistoricoDeProductoresComponent', () => {
  let component: HistoricoDeProductoresComponent;
  let store: MockStore;
  let certService: MockCertService;
  let tramiteQuery: MockQuery;
  let consultaQuery: MockConsultaioQuery;
  beforeEach(() => {
    store = new MockStore();
    certService = new MockCertService();
    tramiteQuery = new MockQuery();
    consultaQuery = new MockConsultaioQuery();
    component = new HistoricoDeProductoresComponent(
      new FormBuilder(),
      certService as any,
      store as any,
      tramiteQuery as any,
      consultaQuery as any
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call ngOnInit and subscribe to observables', () => {
    component.solicitudState = { optionsTipoFactura: [] } as any;
    component.ngOnInit();
    expect(component.solicitudState).toBeDefined();
  });

  it('should call cargarProductorPorExportador and set store', () => {
    component.cargarProductorPorExportador();
    expect(certService.obtenerProductorPorExportador).toHaveBeenCalled();
    expect(store.setProductoresExportador).toHaveBeenCalled();
  });

  it('should call facturaOpcion and setTipoFacturaOpciones', () => {
    component.facturaOpcion();
    expect(certService.getTipoFactura).toHaveBeenCalled();
    expect(store.setTipoFacturaOpciones).toHaveBeenCalled();
  });

  it('should call setValoresStore', () => {
    component.setValoresStore({ campo: 'foo', valor: 'bar' } as any);
    expect(store.setFormHistorico).toHaveBeenCalledWith({ foo: 'bar' });
  });

  it('should call setValoresStoreAgregarForm', () => {
    component.setValoresStoreAgregarForm({ campo: 'foo', valor: 'bar' } as any);
    expect(store.setAgregarFormDatosProductor).toHaveBeenCalledWith({ foo: 'bar' });
  });

  it('should call emitAgregarExportador with HistoricoColumnas', () => {
    const event = { id: 1, nombreProductor: 'a', numeroRegistroFiscal: 'b', direccion: 'c', correoElectronico: 'd', telefono: 'e', fax: 'f' };
    component.emitAgregarExportador(event);
    expect(store.setAgregarProductoresExportador).toHaveBeenCalled();
  });

  it('should call emitAgregarExportador with numeroRegistroFiscal and call agregarProductores', () => {
    const event = { numeroRegistroFiscal: 'b' };
    component.emitAgregarExportador(event);
    expect(certService.agregarProductores).toHaveBeenCalled();
    expect(store.setAgregarProductoresExportador).toHaveBeenCalled();
  });

  it('should call formaValida', () => {
    component.formaValida(true);
    expect(store.setFormValidity).toHaveBeenCalledWith('histProductores', true);
  });

  it('should call setMercanciaDatos', () => {
    component.setMercanciaDatos([{ id: 1 } as any]);
    expect(store.setmercanciaTabla).toHaveBeenCalledWith([{ id: 1 }]);
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