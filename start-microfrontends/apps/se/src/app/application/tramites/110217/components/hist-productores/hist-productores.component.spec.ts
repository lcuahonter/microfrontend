import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistProductoresComponent } from './hist-productores.component';
import { CertificadosOrigenService } from '../../services/certificado-origen.service.ts';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, Subject } from 'rxjs';
import { Tramite110217Store } from '../../../../estados/tramites/tramite110217.store';
import { Tramite110217Query } from '../../../../estados/queries/tramite110217.query';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { HistoricoProductoresComponent } from '../../../../shared/components/historico-productores/historico-productores.component';

const mockStore = {
  setFormHistorico: jest.fn(),
  setAgregarFormDatosProductor: jest.fn(),
  setProductoresExportador: jest.fn(),
  setFormValidity: jest.fn(),
  setmercanciaTabla: jest.fn(),
  setAgregarProductoresExportador: jest.fn(),
};

const mockTramiteQuery = {
  selectAgregarProductoresExportador$: of([]),
  selectSolicitud$: of({
    productoresExportador: [{ id: 1, nombreProductor: 'Juan' }],
    mercanciaTabla: [{ id: 99, descripcion: 'Mercancia test' }],
  }),
  formulario$: of({ form: 'test' }),
  datosProductorFormulario$: of({ campo1: 'valor1' }),
};

const mockConsultaioQuery = {
  selectConsultaioState$: of({ readonly: false }),
};

describe('HistProductoresComponent', () => {
  let component: HistProductoresComponent;
  let fixture: ComponentFixture<HistProductoresComponent>;
  let certificadoService: jest.Mocked<CertificadosOrigenService>;

  beforeEach(async () => {
    const mockCertificadosOrigenService = {
      obtenerProductorPorExportador: jest.fn().mockReturnValue(of({
        datos: [
          {
            nombreCompleto: 'Pedro',
            rfc: 'RFC123',
            direccionCompleta: 'Calle 1',
            correoElectronico: 'pedro@mail.com',
            telefono: '5551234',
            fax: '999',
          },
        ],
      })),
      agregarProductores: jest.fn().mockReturnValue(of({
        datos: [
          {
            nombreCompleto: 'Carlos',
            rfc: 'RFC456',
            direccionCompleta: 'Calle 2',
            correoElectronico: 'carlos@mail.com',
            telefono: '5555678',
            fax: '888',
          },
        ],
      })),
    } as unknown as jest.Mocked<CertificadosOrigenService>;

    await TestBed.configureTestingModule({
      imports: [HistProductoresComponent],
      providers: [
        { provide: CertificadosOrigenService, useValue: mockCertificadosOrigenService },
        { provide: Tramite110217Store, useValue: mockStore },
        { provide: Tramite110217Query, useValue: mockTramiteQuery },
        { provide: ConsultaioQuery, useValue: mockConsultaioQuery },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(HistProductoresComponent);
    component = fixture.componentInstance;
    certificadoService = TestBed.inject(CertificadosOrigenService) as jest.Mocked<CertificadosOrigenService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call cargarProductorPorExportador and initialize observables on ngOnInit', () => {
    const spy = jest.spyOn(component, 'cargarProductorPorExportador');
    component.ngOnInit();

    expect(spy).toHaveBeenCalled();
    expect(component.productoresExportador.length).toBe(1);
    expect(component.mercanciaProductores[0].descripcion).toBe('Mercancia test');
    expect(component.solicitudState).toBeDefined();
    expect(component.tramiteState).toEqual({ form: 'test' });
    expect(component.agregarDatosProductor).toEqual({ campo1: 'valor1' });
  });

  it('should map service data correctly in cargarProductorPorExportador', () => {
    component.cargarProductorPorExportador();
    expect(certificadoService.obtenerProductorPorExportador).toHaveBeenCalledWith('AAL0409235E6');
    expect(mockStore.setProductoresExportador).toHaveBeenCalledWith([
      {
        id: 1,
        nombreProductor: 'Pedro',
        numeroRegistroFiscal: 'RFC123',
        direccion: 'Calle 1',
        correoElectronico: 'pedro@mail.com',
        telefono: '5551234',
        fax: '999',
      },
    ]);
  });

  it('should call setFormHistorico on store when setValoresStore is called', () => {
    component.setValoresStore({ formGroupName: 'x', campo: 'nombre', valor: 'Juan', storeStateName: '' });
    expect(mockStore.setFormHistorico).toHaveBeenCalledWith({ nombre: 'Juan' });
  });

  it('should call setAgregarFormDatosProductor on store when setValoresStoreAgregarForm is called', () => {
    component.setValoresStoreAgregarForm({ formGroupName: '', campo: 'rfc', valor: 'RFC999', storeStateName: '' });
    expect(mockStore.setAgregarFormDatosProductor).toHaveBeenCalledWith({ rfc: 'RFC999' });
  });

  it('should call setFormValidity when formaValida is called', () => {
    component.formaValida(true);
    expect(mockStore.setFormValidity).toHaveBeenCalledWith('histProductores', true);
  });

  it('should call setmercanciaTabla when setMercanciaDatos is called', () => {
    const mercancias = [{ id: 1, descripcion: 'test mercancia' }] as any;
    component.setMercanciaDatos(mercancias);
    expect(mockStore.setmercanciaTabla).toHaveBeenCalledWith(mercancias);
  });

  it('should call setAgregarProductoresExportador with mapped object when full producer data provided', () => {
    const event = {
      id: 1,
      nombreProductor: 'Carlos',
      numeroRegistroFiscal: 'RFC456',
      direccion: 'Calle 2',
      correoElectronico: 'mail@test.com',
      telefono: '5555',
      fax: '222',
    };
    component.emitAgregarExportador(event);
    expect(mockStore.setAgregarProductoresExportador).toHaveBeenCalledWith([event]);
  });

  it('should call agregarProductores service and set store when only numeroRegistroFiscal provided', () => {
    const event = { numeroRegistroFiscal: 'RFC777' };
    component.emitAgregarExportador(event);
    expect(certificadoService.agregarProductores).toHaveBeenCalledWith({ rfc_solicitante: 'RFC777' });
    expect(mockStore.setAgregarProductoresExportador).toHaveBeenCalledWith([
      {
        id: 1,
        nombreProductor: 'Carlos',
        numeroRegistroFiscal: 'RFC456',
        direccion: 'Calle 2',
        correoElectronico: 'carlos@mail.com',
        telefono: '5555678',
        fax: '888',
      },
    ]);
  });

  it('should call validarFormulario on HistoricoProductoresComponent', () => {
    const mockChild = { validarFormulario: jest.fn() } as unknown as HistoricoProductoresComponent;
    component.historicoProductoresComponent = mockChild;
    component.validarFormulario();
    expect(mockChild.validarFormulario).toHaveBeenCalled();
  });

  it('should complete destroyNotifier$ on ngOnDestroy', () => {
    const completeSpy = jest.spyOn(component.destroyNotifier$, 'complete');
    const nextSpy = jest.spyOn(component.destroyNotifier$, 'next');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
