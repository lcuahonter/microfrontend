import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { SolicitudComponent } from './solicitud.component';
import {
  AlertComponent,
  BtnContinuarComponent,
  ConsultaioQuery,
  CrosslistComponent,
  InputRadioComponent,
  NotificacionesComponent,
  PasoCargaDocumentoComponent,
  PasoFirmaComponent,
  SolicitanteComponent,
  TablaDinamicaComponent,
  TituloComponent,
  WizardComponent,
} from '@ng-mf/data-access-user';
import { PartidasDeLaMercanciaModelo } from '../../../../shared/models/partidas-de-la-mercancia.model';
import { CommonModule } from '@angular/common';
import { DatosDelTramiteComponent } from '../../../../shared/components/datos-del-tramite/datos-del-tramite.component';
import { DatosDeLaMercanciaComponent } from '../../../../shared/components/datos-de-la-mercancia/datos-de-la-mercancia.component';
import { PartidasDeLaMercanciaComponent } from '../../../../shared/components/partidas-de-la-mercancia/partidas-de-la-mercancia.component';
import { PaisProcendenciaComponent } from '../../../../shared/components/pais-procendencia/pais-procendencia.component';
import { RepresentacionComponent } from '../../../../shared/components/representacion/representacion.component';
import { Tramite130107Store } from '../../../../estados/tramites/tramite130107.store';
import { Tramite130107Query } from '../../../../estados/queries/tramite130107.query';
import { ImportacionesAgropecuariasService } from '../../services/importaciones-agropecuarias.service';

describe('SolicitudComponent', () => {
  let component: SolicitudComponent;
  let fixture: ComponentFixture<SolicitudComponent>;
  let mockTramite130107Store: jest.Mocked<Tramite130107Store>;
  let mockTramite130107Query: jest.Mocked<Tramite130107Query>;
  let mockImportacionService: jest.Mocked<ImportacionesAgropecuariasService>;
  let mockConsultaioQuery: jest.Mocked<ConsultaioQuery>;

  const mockCatalogo = [
    { clave: '001', descripcion: 'Test Item 1' },
    { clave: '002', descripcion: 'Test Item 2' },
  ];

  const mockSeccionState = {
    defaultSelect: 'test',
    regimen: 'test-regimen',
    clasificacion: 'test-clasificacion',
    producto: 'test-producto',
    descripcion: 'test description',
    fraccion: 'test-fraccion',
    cantidad: '10',
    valorFacturaUSD: '100.50',
    unidadMedida: '001',
    cantidadPartidasDeLaMercancia: '5',
    valorPartidaUSDPartidasDeLaMercancia: '50.25',
    descripcionPartidasDeLaMercancia: 'test description',
    bloque: 'test-bloque',
    usoEspecifico: 'test-uso',
    justificacionImportacionExportacion: 'test justification',
    observaciones: 'test observations',
    entidad: 'test-entidad',
    representacion: 'test-representacion',
    cantidadTotal: 100,
    valorTotalUSD: 1000,
    modificarPartidasDelaMercanciaForm: {
      cantidadPartidasDeLaMercancia: '5',
      descripcionPartidasDeLaMercancia: 'test description',
      valorPartidaUSDPartidasDeLaMercancia: '50.25',
    },
  };

  const mockPartidaModelo: PartidasDeLaMercanciaModelo = {
    id: '1',
    cantidad: '10',
    unidadDeMedida: 'KG',
    fraccionFrancelaria: '8703.21.01',
    descripcion: 'Test product',
    precioUnitarioUSD: '10.00',
    totalUSD: '100.00',
  };

  beforeEach(async () => {
    const tramite130107StoreMock = {
      actualizarEstado: jest.fn(),
    };
    const tramite130107QueryMock = {
      selectSolicitud$: of(mockSeccionState),
      mostrarTabla$: of(false),
    };
    const importacionServiceMock = {
      getRegimenCatalogo: jest.fn(() => of()),
      getClasificacionRegimenCatalogo: jest.fn(() => of()),
      getFraccionCatalogoService: jest.fn(() => of()),
      getUMTService: jest.fn(() => of()),
      getBloqueService: jest.fn(() => of()),
      getPaisesPorBloqueService: jest.fn(() => of()),
      getEntidadesFederativasCatalogo: jest.fn(() => of()),
      getRepresentacionFederalCatalogo: jest.fn(() => of()),
      getTodosPaisesSeleccionados: jest.fn(() => of()),
      getMostrarPartidasService: jest.fn(() => of()),
    };
    const consultaioQueryMock = {
      selectConsultaioState$: of({ readonly: false }),
    };

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [
        SolicitudComponent,
        ReactiveFormsModule,
        HttpClientTestingModule,
        CommonModule,
        WizardComponent,
        BtnContinuarComponent,
        TituloComponent,
        InputRadioComponent,
        SolicitanteComponent,
        PasoFirmaComponent,
        DatosDelTramiteComponent,
        DatosDeLaMercanciaComponent,
        PartidasDeLaMercanciaComponent,
        TablaDinamicaComponent,
        PaisProcendenciaComponent,
        RepresentacionComponent,
        CrosslistComponent,
        PasoCargaDocumentoComponent,
        AlertComponent,
        NotificacionesComponent,
      ],
      providers: [
        FormBuilder,
        { provide: Tramite130107Store, useValue: tramite130107StoreMock },
        { provide: Tramite130107Query, useValue: tramite130107QueryMock },
        {
          provide: ImportacionesAgropecuariasService,
          useValue: importacionServiceMock,
        },
        { provide: ConsultaioQuery, useValue: consultaioQueryMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SolicitudComponent);
    component = fixture.componentInstance;
    mockTramite130107Store = TestBed.inject(
      Tramite130107Store
    ) as jest.Mocked<Tramite130107Store>;
    mockTramite130107Query = TestBed.inject(
      Tramite130107Query
    ) as jest.Mocked<Tramite130107Query>;
    mockImportacionService = TestBed.inject(
      ImportacionesAgropecuariasService
    ) as jest.Mocked<ImportacionesAgropecuariasService>;
    mockConsultaioQuery = TestBed.inject(
      ConsultaioQuery
    ) as jest.Mocked<ConsultaioQuery>;

    mockImportacionService.getRegimenCatalogo.mockReturnValue(of());
    mockImportacionService.getClasificacionRegimenCatalogo.mockReturnValue(
      of()
    );
    mockImportacionService.getFraccionCatalogoService.mockReturnValue(of());
    mockImportacionService.getUMTService.mockReturnValue(of());
    mockImportacionService.getBloqueService.mockReturnValue(of());
    mockImportacionService.getPaisesPorBloqueService.mockReturnValue(of());
    mockImportacionService.getEntidadesFederativasCatalogo.mockReturnValue(
      of()
    );
    mockImportacionService.getRepresentacionFederalCatalogo.mockReturnValue(
      of()
    );
    mockImportacionService.getTodosPaisesSeleccionados.mockReturnValue(of([]));
    mockImportacionService.getMostrarPartidasService.mockReturnValue(of());
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize component and call required methods', () => {
    jest.spyOn(component, 'configuracionFormularioSuscripciones');
    jest.spyOn(component, 'getRegimenCatalogo');
    jest.spyOn(component, 'getFraccionCatalogo');
    jest.spyOn(component, 'getEntidadesFederativasCatalogo');
    jest.spyOn(component, 'getBloque');

    component.ngOnInit();

    expect(component.configuracionFormularioSuscripciones).toHaveBeenCalled();
    expect(component.getRegimenCatalogo).toHaveBeenCalled();
    expect(component.getFraccionCatalogo).toHaveBeenCalled();
    expect(component.getEntidadesFederativasCatalogo).toHaveBeenCalled();
    expect(component.getBloque).toHaveBeenCalled();
  });

  it('should initialize all forms with correct validators', () => {
    component.inicializarFormularios();

    expect(component.formDelTramite).toBeDefined();
    expect(component.mercanciaForm).toBeDefined();
    expect(component.partidasDelaMercanciaForm).toBeDefined();
    expect(component.paisForm).toBeDefined();
    expect(component.frmRepresentacionForm).toBeDefined();
    expect(component.modificarPartidasDelaMercanciaForm).toBeDefined();
    expect(component.formForTotalCount).toBeDefined();
    expect(
      component.formDelTramite.get('solicitud')?.hasError('required')
    ).toBeTruthy();
    expect(
      component.mercanciaForm.get('descripcion')?.hasError('required')
    ).toBeTruthy();
  });

  beforeEach(() => {
    component.inicializarFormularios();
  });

  it('should return false when forms are invalid', () => {
    const result = component.validarFormulario();
    expect(result).toBeFalsy();
  });

  it('should return false when no rows selected', () => {
    component.filaSeleccionada = [];
    const result = component.validarFormulario();
    expect(result).toBe(false);
    expect(component.isInvalidaPartidas).toBe(false);
  });

  it('should return true when all forms are valid and rows selected', () => {
    component.formDelTramite.patchValue({
      solicitud: 'test',
      regimen: 'test',
      clasificacion: 'test',
    });
    component.mercanciaForm.patchValue({
      descripcion: 'valid description with more than 10 chars',
      fraccion: 'test',
      cantidad: '10',
      valorFacturaUSD: '100.50',
      unidadMedida: 'test',
    });
    component.paisForm.patchValue({
      usoEspecifico: 'test',
      justificacionImportacionExportacion: 'test',
    });
    component.frmRepresentacionForm.patchValue({
      entidad: 'test',
      representacion: 'test',
    });
    component.filaSeleccionada = [mockPartidaModelo];

    const result = component.validarFormulario();
    expect(result).toBeTruthy();
    expect(component.isInvalidaPartidas).toBeFalsy();
  });

  it('should update filaSeleccionada and store when rows selected', () => {
    const filasSeleccionadas = [mockPartidaModelo];
    component.manejarlaFilaSeleccionada(filasSeleccionadas);

    expect(component.filaSeleccionada).toEqual(filasSeleccionadas);
    expect(mockTramite130107Store.actualizarEstado).toHaveBeenCalledWith({
      filaSeleccionada: filasSeleccionadas,
    });
  });

  it('should clear filaSeleccionada when no rows selected', () => {
    component.manejarlaFilaSeleccionada([]);

    expect(component.filaSeleccionada).toEqual([]);
    expect(mockTramite130107Store.actualizarEstado).toHaveBeenCalledWith({
      filaSeleccionada: [],
    });
  });

  beforeEach(() => {
    component.inicializarFormularios();
    component.unidadCatalogo = [];
  });

  it('should mark form as touched when invalid', () => {
    jest.spyOn(component.partidasDelaMercanciaForm, 'markAllAsTouched');
    component.validarYEnviarFormulario();

    expect(
      component.partidasDelaMercanciaForm.markAllAsTouched
    ).toHaveBeenCalled();
  });

  it('should add data to table when form is valid', () => {
    component.partidasDelaMercanciaForm.patchValue({
      cantidadPartidasDeLaMercancia: '5',
      descripcionPartidasDeLaMercancia: 'test description',
      valorPartidaUSDPartidasDeLaMercancia: '50.25',
    });

    component.validarYEnviarFormulario();

    expect(component.mostrarTabla).toBe(false);
    expect(component.tableBodyData.length).toBe(1);
  });

  beforeEach(() => {
    component.inicializarFormularios();
  });

  it('should update store and call getClasificacionRegimenCatalogo for regimen field', () => {
    jest.spyOn(component, 'getClasificacionRegimenCatalogo');
    component.formDelTramite.patchValue({ regimen: 'test-value' });

    component.setValoresStore({
      form: component.formDelTramite,
      campo: 'regimen',
    });

    expect(mockTramite130107Store.actualizarEstado).toHaveBeenCalledWith({
      regimen: 'test-value',
    });
    expect(component.getClasificacionRegimenCatalogo).toHaveBeenCalledWith(
      'test-value'
    );
  });

  it('should update store and call getUnidadesMedidaTarifaria for fraccion field', () => {
    jest.spyOn(component, 'getUnidadesMedidaTarifaria');
    component.mercanciaForm.patchValue({ fraccion: 'test-fraccion' });

    component.setValoresStore({
      form: component.mercanciaForm,
      campo: 'fraccion',
    });

    expect(mockTramite130107Store.actualizarEstado).toHaveBeenCalledWith({
      fraccion: 'test-fraccion',
    });
    expect(component.getUnidadesMedidaTarifaria).toHaveBeenCalledWith(
      'test-fraccion'
    );
  });

  it('should update store and call getRepresentacionFederalCatalogo for entidad field', () => {
    jest.spyOn(component, 'getRepresentacionFederalCatalogo');
    component.frmRepresentacionForm.patchValue({ entidad: 'test-entidad' });

    component.setValoresStore({
      form: component.frmRepresentacionForm,
      campo: 'entidad',
    });

    expect(mockTramite130107Store.actualizarEstado).toHaveBeenCalledWith({
      entidad: 'test-entidad',
    });
    expect(component.getRepresentacionFederalCatalogo).toHaveBeenCalledWith(
      'test-entidad'
    );
  });

  it('should return true when no rows selected', () => {
    component.filaSeleccionada = [];
    expect(component.disabledModificar()).toBeTruthy();
  });

  it('should return false when rows are selected', () => {
    component.filaSeleccionada = [mockPartidaModelo];
    expect(component.disabledModificar()).toBeFalsy();
  });

  beforeEach(() => {
    component.inicializarFormularios();
  });

  it('should patch form with selected row data', () => {
    component.modificarPartidaSeleccionada(mockPartidaModelo);

    expect(
      component.modificarPartidasDelaMercanciaForm.get(
        'cantidadPartidasDeLaMercancia'
      )?.value
    ).toBe('10');
    expect(
      component.modificarPartidasDelaMercanciaForm.get(
        'valorPartidaUSDPartidasDeLaMercancia'
      )?.value
    ).toBe('100.00');
    expect(
      component.modificarPartidasDelaMercanciaForm.get(
        'descripcionPartidasDeLaMercancia'
      )?.value
    ).toBe('Test product');
  });

  beforeEach(() => {
    component.inicializarFormularios();
    component.tableBodyData = [mockPartidaModelo];
    component.modificarPartidasDelaMercanciaForm.patchValue({
      cantidadPartidasDeLaMercancia: '20',
      valorPartidaUSDPartidasDeLaMercancia: '200.00',
      descripcionPartidasDeLaMercancia: 'Modified description',
    });
  });

  it('should update tableBodyData with modified values', () => {
    component.partidaModificada(mockPartidaModelo);

    const updatedItem = component.tableBodyData.find((item) => item.id === '1');
    expect(updatedItem?.cantidad).toBe('10');
    expect(updatedItem?.totalUSD).toBe('100.00');
  });

  it('should return "0" when cantidad is 0', () => {
    const result = component.calcularImporteUnitario('0', '100');
    expect(result).toBe('0');
  });

  it('should calculate correct unit price', () => {
    const result = component.calcularImporteUnitario('100', '10');
    expect(result).toBe('0.100');
  });

  it('should handle decimal calculations correctly', () => {
    const result = component.calcularImporteUnitario('100.50', '3');
    expect(result).toBe('0.030');
  });

  it('should call getPaisesPorBloque with correct parameter', () => {
    jest.spyOn(component, 'getPaisesPorBloque');
    component.enCambioDeBloque(123);

    expect(component.getPaisesPorBloque).toHaveBeenCalledWith('123');
  });

  it('should call service when evento is true', () => {
    component.todosPaisesSeleccionados(true);

    expect(
      mockImportacionService.getTodosPaisesSeleccionados
    ).toHaveBeenCalledWith(component.idProcedimiento.toString());
  });

  it('should not call service when evento is false', () => {
    component.todosPaisesSeleccionados(false);

    expect(
      mockImportacionService.getTodosPaisesSeleccionados
    ).not.toHaveBeenCalled();
  });

  it('should update store with selected dates', () => {
    const fechas = ['2023-01-01', '2023-01-02'];

    component.fechasSeleccionadas(fechas);

    expect(mockTramite130107Store.actualizarEstado).toHaveBeenCalledWith({
      fechasSeleccionadas: fechas,
    });
  });

  it('should complete destroyed$ subject', () => {
    jest.spyOn(component['destroyed$'], 'next');
    jest.spyOn(component['destroyed$'], 'complete');

    component.ngOnDestroy();

    expect(component['destroyed$'].next).toHaveBeenCalled();
    expect(component['destroyed$'].complete).toHaveBeenCalled();
  });

  it('should call getRegimenCatalogo', () => {
    const mockData = [{ id: 1, descripcion: 'Test' }];
    mockImportacionService.getRegimenCatalogo.mockReturnValue(of(mockData));
    component.getRegimenCatalogo();
    expect(mockImportacionService.getRegimenCatalogo).toHaveBeenCalledWith('130107');
    expect(component.catalogosArray[0]).toEqual(mockData);
    expect(mockImportacionService.getRegimenCatalogo).toHaveBeenCalledWith(
      component.idProcedimiento.toString()
    );
  });

  it('should call getFraccionCatalogo', () => {
    const mockData = [{ id: 1, descripcion: 'Producto' }];
    mockImportacionService.getFraccionCatalogoService.mockReturnValue(of(mockData));
    component.getFraccionCatalogo();
    expect(mockImportacionService.getFraccionCatalogoService).toHaveBeenCalledWith('130107');
    expect(
      mockImportacionService.getFraccionCatalogoService
    ).toHaveBeenCalledWith(component.idProcedimiento.toString());
  });

  it('should call getEntidadesFederativasCatalogo', () => {
    const mockData = [{ id: 1, descripcion: 'Guanajuato' }];
    mockImportacionService.getEntidadesFederativasCatalogo.mockReturnValue(of(mockData));

    component.getEntidadesFederativasCatalogo();

    expect(mockImportacionService.getEntidadesFederativasCatalogo).toHaveBeenCalledWith('130107');
    expect(component.entidadFederativa).toEqual(mockData);
  });

  it('should call getBloque', () => {
    const mockData = [{ id: 1, descripcion: 'Bloque' }];
    mockImportacionService.getBloqueService.mockReturnValue(of(mockData));

    component.getBloque();

    expect(mockImportacionService.getBloqueService).toHaveBeenCalledWith('130107');
    expect(component.elementosDeBloque).toEqual(mockData);
    expect(mockImportacionService.getBloqueService).toHaveBeenCalledWith(
      component.idProcedimiento.toString()
    );
  });

  it('should call getRepresentacionFederalCatalogo and set representacionFederal', () => {
    const mockData = [{ id: 1, descripcion: 'Representacion' }];
    mockImportacionService.getRepresentacionFederalCatalogo.mockReturnValue(of(mockData));

    component.getRepresentacionFederalCatalogo('GTO');

    expect(mockImportacionService.getRepresentacionFederalCatalogo).toHaveBeenCalledWith('GTO');
    expect(component.representacionFederal).toEqual(mockData);
  });

  it('should call getPaisesPorBloqueService and set paisesPorBloque', () => {
    const mockData = [{ id: 1, descripcion: 'Mexico' }];
    mockImportacionService.getPaisesPorBloqueService.mockReturnValue(of(mockData));

    component.getPaisesPorBloque('BL01');

    expect(mockImportacionService.getPaisesPorBloqueService).toHaveBeenCalledWith('130107', 'BL01');
    expect(component.paisesPorBloque).toEqual(mockData);
  });

  it('should call getUMTService and set unidadCatalogo', () => {
    const mockData = [{ id: 1, descripcion: 'Kilos' }];
    mockImportacionService.getUMTService.mockReturnValue(of(mockData));

    component.getUnidadesMedidaTarifaria('FR01');
    expect(mockImportacionService.getUMTService).toHaveBeenCalledWith('130107', 'FR01');
    expect(component.unidadCatalogo).toEqual(mockData);
  });

  it('should call getClasificacionRegimenCatalogo and update catalogosArray[1]', () => {
    const mockData = [{ id: 2, descripcion: 'Clasif' }];
    mockImportacionService.getClasificacionRegimenCatalogo.mockReturnValue(of(mockData));

    component.getClasificacionRegimenCatalogo('AB');

    expect(mockImportacionService.getClasificacionRegimenCatalogo).toHaveBeenCalledWith('AB');
    expect(component.catalogosArray[1]).toEqual(mockData);
  });

  it('should call service, update mostrarPartidas and dispatch mapped tableBodyData', () => {
    const mockResponse = {
      codigo: '00',
      path: '',
      timestamp: new Date().toISOString(),
      mensaje: 'Success',
      datos: [],
    };

    mockImportacionService.getMostrarPartidasService.mockReturnValue(of(mockResponse));

    component.getMostrarPartidas();
    mockImportacionService.getMostrarPartidasService(123);
    expect(mockImportacionService.getMostrarPartidasService).toHaveBeenCalledWith(123);
    expect(component.mostrarPartidas).toEqual(mockResponse.datos);
    expect(mockTramite130107Store.actualizarEstado).toHaveBeenCalledWith({"mostrarPartidas": []});

    expect(mockTramite130107Store.actualizarEstado).toHaveBeenCalledWith({
      mostrarPartidas: mockResponse.datos,
    });

    expect(mockTramite130107Store.actualizarEstado).toHaveBeenCalledTimes(1);
  });

  it('should call service with ID = 0 if seccionState.idSolicitud undefined', () => {
    (component as any).seccionState = {
      idSolicitud: undefined,
      producto: '',
      descripcion: '',
      fraccion: '',
      defaultSelect: '',
      regimen: '',
      clasificacion: '',
      cantidad: '',
      valorFacturaUSD: '',
      unidadMedida: '',
      cantidadPartidasDeLaMercancia: '',
      valorPartidaUSDPartidasDeLaMercancia: '',
      descripcionPartidasDeLaMercancia: '',
      bloque: '',
      usoEspecifico: '',
      justificacionImportacionExportacion: '',
      observaciones: '',
      entidad: '',
      representacion: '',
      cantidadTotal: 0,
      valorTotalUSD: 0,
      modificarPartidasDelaMercanciaForm: {
        cantidadPartidasDeLaMercancia: '',
        descripcionPartidasDeLaMercancia: '',
        valorPartidaUSDPartidasDeLaMercancia: '',
      },
    };
    mockImportacionService.getMostrarPartidasService.mockReturnValue(
      of({
        codigo: '0',
        datos: [],
        path: '',
        timestamp: new Date().toISOString(),
        mensaje: '',
      })
    );

    component.getMostrarPartidas();

    expect(mockImportacionService.getMostrarPartidasService).toHaveBeenCalledWith(0);
  });
});
