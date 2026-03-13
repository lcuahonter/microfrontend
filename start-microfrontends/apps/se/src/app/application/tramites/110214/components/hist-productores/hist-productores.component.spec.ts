import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { HistProductoresComponent } from './hist-productores.component';
import { of } from 'rxjs';
import { Tramite110214Store } from '../../../../estados/tramites/tramite110214.store';
import { Tramite110214Query } from '../../../../estados/queries/tramite110214.query';
import { ValidarInicialmenteCertificadoService } from '../../services/validar-inicialmente-certificado.service';
import { ConsultaioQuery } from '@libs/shared/data-access-user/src';

describe('HistProductoresComponent', () => {
  let component: HistProductoresComponent;
  let fixture: ComponentFixture<HistProductoresComponent>;

  const mockStore = {
    setFormHistorico: jest.fn(),
    setAgregarFormDatosProductor: jest.fn(),
    setProductoresExportador: jest.fn(),
    setMercanciaProductores: jest.fn(),
    setTipoFacturaOpciones: jest.fn(),
    setFormValidity: jest.fn(),
    setAgregarProductoresExportador: jest.fn(),
  };

  const mockTramiteQuery = {
    selectAgregarProductoresExportador$: of([]),
    selectMercanciaProductores$: of([]),
    selectSolicitud$: of({
      productoresExportador: [{ id: 1, nombreProductor: 'Laura' }],
      optionsTipoFactura: [],
      agregarProductoresExportador: [],
    }),
    formulario$: of({}),
    datosProductorFormulario$: of({ campo: 'valor' }),
  };

  const mockCertificadoService = {
    obtenerProductorPorExportador: jest.fn().mockReturnValue(of({ datos: [] })),
    getMercanciasSeleccionadas: jest.fn().mockReturnValue(of([{ id: 1, nombre: 'Mercancia 1' }])),
    getTipoFactura: jest.fn().mockReturnValue(of({ datos: [{ clave: '1', descripcion: 'Factura A' }] })),
    agregarProductores: jest.fn().mockReturnValue(of({ datos: [{ nombreCompleto: 'LAURA CONTRERAS' }] })),
  };

  const mockConsultaQuery = {
    selectConsultaioState$: of({ readonly: false }),
  };
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistProductoresComponent, HttpClientModule],
      providers: [
        { provide: Tramite110214Store, useValue: mockStore },
        { provide: Tramite110214Query, useValue: mockTramiteQuery },
        { provide: ValidarInicialmenteCertificadoService, useValue: mockCertificadoService },
        { provide: ConsultaioQuery, useValue: mockConsultaQuery },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HistProductoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize and subscribe to observables on ngOnInit', () => {
    component.tramiteQuery = {
      ...component.tramiteQuery,
      selectSolicitud$: of({
        idSolicitud: 0,
        pasoActivo: 0,
        pestanaActiva: 0,
        asignarProductor: null,
        optionsTipoFactura: [],
        productoresExportador: [],
        agregarProductoresExportador: [],
      } as any),
      store: {} as any,
      select: jest.fn(),
      selectLoading: jest.fn(),
      selectError: jest.fn(),
      selectSnapshot: jest.fn(),
      getValue: jest.fn(),
      selectAgregarProductoresExportador$: of([]),
      selectMercanciaProductores$: of([]),
      formulario$: of({}),
      datosProductorFormulario$: of({ campo: 'valor' }),
    } as any;
    const cargarSpy = jest.spyOn(component, 'cargarProductorPorExportador');
    const facturaSpy = jest.spyOn(component, 'facturaOpcion');
    component.ngOnInit();
    expect(cargarSpy).toHaveBeenCalled();
    expect(facturaSpy).toHaveBeenCalled();
  });

  it('should complete destroyNotifier$', () => {
    const nextSpy = jest.spyOn(component.destroyNotifier$, 'next');
    const completeSpy = jest.spyOn(component.destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should call store.setAgregarFormDatosProductor with correct args', () => {
    const event = { formGroupName: 'test', campo: 'campo2', valor: 123, storeStateName: 'name' };
    component.setValoresStoreAgregarForm(event);
    expect(mockStore.setAgregarFormDatosProductor).toHaveBeenCalledWith({ campo2: 123 });
  });

  it('should call obtenerProductorPorExportador and update store', () => {
    component.cargarProductorPorExportador();
    expect(mockCertificadoService.obtenerProductorPorExportador).toHaveBeenCalled();
    expect(mockStore.setProductoresExportador).toHaveBeenCalledWith([]);
  });

  it('should call getTipoFactura and update store', () => {
    component.facturaOpcion();
    expect(mockCertificadoService.getTipoFactura).toHaveBeenCalled();
    expect(mockStore.setTipoFacturaOpciones).toHaveBeenCalledWith([{ clave: '1', descripcion: 'Factura A' }]);
  });

  it('should call setFormValidity with correct args', () => {
    component.formaValida(true);
    expect(mockStore.setFormValidity).toHaveBeenCalledWith('histProductores', true);
  });

  it('should call validarFormulario on historicoProductoresComponent', () => {
    component.historicoProductoresComponent = {
      validarFormulario: jest.fn(),
    } as any;
    component.validarFormulario();
    expect(component.historicoProductoresComponent.validarFormulario).toHaveBeenCalled();
  });

  it('should call store.setAgregarProductoresExportador when event has nombreProductor', () => {
    const event = { id: 1, nombreProductor: 'Laura', numeroRegistroFiscal: '1234', direccion: 'X', correoElectronico: 'a@a.com', telefono: '123', fax: '321' };
    component.solicitudState = { agregarProductoresExportador: [] } as any;
    component.emitAgregarExportador(event);
    expect(mockStore.setAgregarProductoresExportador).toHaveBeenCalledWith([
      expect.objectContaining({ nombreProductor: 'Laura' })
    ]);
  });

  it('should handle event with numeroRegistroFiscal only', () => {
    const event = { numeroRegistroFiscal: '999', fax: '123' };
    component.solicitudState = { agregarProductoresExportador: [] } as any;
    component.emitAgregarExportador(event);
    expect(mockStore.setAgregarProductoresExportador).toHaveBeenCalledWith([
      expect.objectContaining({ nombreProductor: 'LAURA CONTRERAS' })
    ]);
  });
});
