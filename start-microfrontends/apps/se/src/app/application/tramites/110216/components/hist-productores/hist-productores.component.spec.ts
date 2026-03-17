import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistProductoresComponent } from './hist-productores.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Tramite110216Store } from '../../../../estados/tramites/tramite110216.store';
import { Tramite110216Query } from '../../../../estados/queries/tramite110216.query';
import { CertificadosOrigenService } from '../../services/certificado-origen.service';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { of } from 'rxjs';

describe('HistProductoresComponent', () => {
  let component: HistProductoresComponent;
  let fixture: ComponentFixture<HistProductoresComponent>;
  let storeMock: any;
  let serviceMock: any;
  let queryMock: any;

  beforeEach(async () => {
    storeMock = {
      setFormHistorico: jest.fn(),
      setAgregarFormDatosProductor: jest.fn(),
      setProductoresExportador: jest.fn(),
      setAgregarProductoresExportador: jest.fn(),
      setFormValidity: jest.fn(),
      setMercanciaTabla: jest.fn()
    };

    serviceMock = {
      obtenerProductorPorExportador: jest.fn().mockReturnValue(of({ datos: [] })),
      agregarProductores: jest.fn().mockReturnValue(of({ datos: [] }))
    };

    queryMock = {
      selectAgregarProductoresExportador$: of([]),
      selectSolicitud$: of({ productoresExportador: [], mercanciaTabla: [] }),
      formulario$: of({}),
      datosProductorFormulario$: of({}),
      selectConsultaioState$: of({ readonly: false })
    };

    await TestBed.configureTestingModule({
      imports: [HistProductoresComponent, HttpClientTestingModule],
      providers: [
        { provide: Tramite110216Store, useValue: storeMock },
        { provide: Tramite110216Query, useValue: queryMock },
        { provide: CertificadosOrigenService, useValue: serviceMock },
        { provide: ConsultaioQuery, useValue: queryMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HistProductoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should complete destroyNotifier$ on ngOnDestroy', () => {
    const nextSpy = jest.spyOn(component.destroyNotifier$, 'next');
    const completeSpy = jest.spyOn(component.destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should call store.setFormHistorico in setValoresStore', () => {
    const event = { formGroupName: '', campo: 'test', valor: undefined, storeStateName: '' };
    component.setValoresStore(event);
    expect(storeMock.setFormHistorico).toHaveBeenCalledWith({ test: undefined });
  });

  it('should call store.setAgregarFormDatosProductor in setValoresStoreAgregarForm', () => {
    const event = { formGroupName: '', campo: 'test', valor: 'value', storeStateName: '' };
    component.setValoresStoreAgregarForm(event);
    expect(storeMock.setAgregarFormDatosProductor).toHaveBeenCalledWith({ test: 'value' });
  });

  it('should call certificadoDeService.obtenerProductorPorExportador in cargarProductorPorExportador', () => {
    component.cargarProductorPorExportador();
    expect(serviceMock.obtenerProductorPorExportador).toHaveBeenCalledWith(component['loginRFC']);
  });

  it('should call store.setFormValidity in formaValida', () => {
    component.formaValida(true);
    expect(storeMock.setFormValidity).toHaveBeenCalledWith('histProductores', true);
  });

  it('should call historicoProductoresComponent.validarFormulario in validarFormulario', () => {
    component.historicoProductoresComponent = { validarFormulario: jest.fn() } as any;
    component.validarFormulario();
    expect(component.historicoProductoresComponent.validarFormulario).toHaveBeenCalled();
  });

  it('should call store.setAgregarProductoresExportador when emitAgregarExportador receives full object', () => {
    const event = { id: 1, nombreProductor: 'Test', numeroRegistroFiscal: '123' };
    component.emitAgregarExportador(event as any);
    expect(storeMock.setAgregarProductoresExportador).toHaveBeenCalledWith([{
      id: 1,
      nombreProductor: 'Test',
      numeroRegistroFiscal: '123',
      direccion: '',
      correoElectronico: '',
      telefono: '',
      fax: ''
    }]);
  });

  it('should call certificadoDeService.agregarProductores when emitAgregarExportador receives object with numeroRegistroFiscal', () => {
    const spy = jest.spyOn(serviceMock, 'agregarProductores');
    const event = { numeroRegistroFiscal: '123' };
    component.emitAgregarExportador(event as any);
    expect(spy).toHaveBeenCalledWith({ rfc_solicitante: '123' });
  });

  it('should call store.setMercanciaTabla in setMercanciaDatos', () => {
    const mercancia = [{ id: 1, nombre: 'Mercancia 1' }] as any;
    component.setMercanciaDatos(mercancia);
    expect(storeMock.setMercanciaTabla).toHaveBeenCalledWith(mercancia);
  });

});
