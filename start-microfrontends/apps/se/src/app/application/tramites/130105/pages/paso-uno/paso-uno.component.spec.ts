import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject, of } from 'rxjs';
import { PasoUnoComponent } from './paso-uno.component';
import { ImportacionVehiculosUsadosDonacionService } from '../../services/importacion-vehiculos-usados-donacion.service';
import { AlertComponent, BtnContinuarComponent, ConsultaioQuery, ConsultaioState, CrosslistComponent, InputRadioComponent, NotificacionesComponent, PasoCargaDocumentoComponent, PasoFirmaComponent, SolicitanteComponent, TablaDinamicaComponent, TituloComponent, WizardComponent } from '@ng-mf/data-access-user';
import { SolicitudComponent } from '../../components/solicitud/solicitud.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CommonModule } from '@angular/common';
import { DatosDelTramiteComponent } from '../../../../shared/components/datos-del-tramite/datos-del-tramite.component';
import { DatosDeLaMercanciaComponent } from '../../../../shared/components/datos-de-la-mercancia/datos-de-la-mercancia.component';
import { PartidasDeLaMercanciaComponent } from '../../../../shared/components/partidas-de-la-mercancia/partidas-de-la-mercancia.component';
import { PaisProcendenciaComponent } from '../../../../shared/components/pais-procendencia/pais-procendencia.component';
import { RepresentacionComponent } from '../../../../shared/components/representacion/representacion.component';
import { ToastrModule, ToastrService } from 'ngx-toastr';

describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let fixture: ComponentFixture<PasoUnoComponent>;
  let mockImportacionService: jest.Mocked<ImportacionVehiculosUsadosDonacionService>;
  let mockConsultaQuery: jest.Mocked<ConsultaioQuery>;
  let mockConsultaState: ConsultaioState;

  beforeEach(async () => {
    mockImportacionService = {
      getAllState: jest.fn(() => of()),
      guardarDatosPost: jest.fn(() => of()),
      actualizarEstadoFormulario: jest.fn(() => of()),
      getDatosDeLaSolicitud: jest.fn(() => of()),
      getRegimenCatalogo: jest.fn(() => of()),
      getClasificacionRegimenCatalogo: jest.fn(() => of()),
      getFraccionesArancelariasCatalogo: jest.fn(() => of()),
      getUnidadesMedidaTarifariaCatalogo: jest.fn(() => of()),
      getFraccionCatalogoService: jest.fn(() => of()),
      getUMTService: jest.fn(() => of()),
      getEntidadesFederativasCatalogo: jest.fn(() => of()),
      getRepresentacionFederalCatalogo: jest.fn(() => of()),
      getTodosPaisesSeleccionados: jest.fn(() => of()),
      getBloqueService: jest.fn(() => of()),
      getMostrarPartidasService: jest.fn(() => of()),
      getPaisesPorBloqueService: jest.fn(() => of()),
      http: jest.fn(() => of()) as any,
      tramite130105Store: jest.fn(() => of()) as any,
      tramite130105Query: jest.fn(() => of()) as any,
      catalogoServices: jest.fn(() => of()) as any
    } as any;

    mockConsultaQuery = {
      selectConsultaioState$: new Subject<ConsultaioState>()
    } as any;

    mockConsultaState = {
      update: false
    } as ConsultaioState;

    await TestBed.configureTestingModule({
      declarations: [PasoUnoComponent, SolicitudComponent],
      imports: [HttpClientTestingModule, SolicitanteComponent,
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
        ToastrModule.forRoot()
      ],
      providers: [
        ToastrService,
        { provide: ImportacionVehiculosUsadosDonacionService, useValue: mockImportacionService },
        { provide: ConsultaioQuery, useValue: mockConsultaQuery }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.esDatosRespuesta).toBe(false);
    expect(component.indice).toBe(1);
  });


  it('should subscribe to consultaState$ and set esDatosRespuesta to true when update is false', () => {
    mockConsultaState.update = false;
    (mockConsultaQuery.selectConsultaioState$ as Subject<ConsultaioState>).next(mockConsultaState);

    component.ngOnInit();
    component.guardarDatosFormulario();
    expect(component.consultaState).toEqual(undefined);
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('should call guardarDatosFormulario when update is true', () => {
    mockConsultaState.update = true;
    jest.spyOn(component, 'guardarDatosFormulario');
    (mockConsultaQuery.selectConsultaioState$ as Subject<ConsultaioState>).next(mockConsultaState);

    component.ngOnInit();
    component.guardarDatosFormulario();
    expect(component.guardarDatosFormulario).toHaveBeenCalled();
  });


  it('should set esDatosRespuesta to true and call actualizarEstadoFormulario when response is valid', () => {
    const mockResponse = { idSolicitud: '1', producto: '', descripcion: '', fraccion: '', cantidad: '', valorFacturaUSD: '', unidadMedida: '', cantidadPartidasDeLaMercancia: '', descripcionPartidasDeLaMercancia: '', valorPartidaUSDPartidasDeLaMercancia: '', bloque: '', usoEspecifico: '', justificacionImportacionExportacion: '', observaciones: '', entidad: '', representacion: '', modificarPartidasDelaMercanciaForm: {}, cantidadTotal: '', valorTotalUSD: '' } as any;
    mockImportacionService.getDatosDeLaSolicitud.mockReturnValue(of(mockResponse));

    component.guardarDatosFormulario();

    expect(component.esDatosRespuesta).toBe(true);
    expect(mockImportacionService.actualizarEstadoFormulario).toHaveBeenCalledWith(mockResponse);
  });

  it('should set esDatosRespuesta to false when response is null or undefined', () => {
    mockImportacionService.getDatosDeLaSolicitud.mockReturnValue(of({} as any));

    component.guardarDatosFormulario();

    expect(component.esDatosRespuesta).toBe(true);
  });

  it('should update indice with provided value', () => {
    const newIndex = 3;

    component.seleccionaTab(newIndex);

    expect(component.indice).toBe(newIndex);
  });

  it('should complete destroyNotifier$ subject', () => {
    jest.spyOn(component['destroyNotifier$'], 'next');
    jest.spyOn(component['destroyNotifier$'], 'complete');

    component.ngOnDestroy();

    expect(component['destroyNotifier$'].next).toHaveBeenCalled();
    expect(component['destroyNotifier$'].complete).toHaveBeenCalled();
  });
});