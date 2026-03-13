import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, Subject } from 'rxjs';
import { PasoUnoComponent } from './paso-uno.component';
import { Tramite260213Query } from '../../estados/tramite260213Query.query';
import { Tramite260213Store } from '../../estados/tramite260213Store.store';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { PermisoSanitarioMedicosUsoPersonalService } from '../../services/permiso-sanitario-medicos-uso-personal.service';
import { Tramite260213State } from '../../estados/tramite260213Store.store';
describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let fixture: ComponentFixture<PasoUnoComponent>;
  let tramiteQuery: jest.Mocked<Tramite260213Query>;
  let tramiteStore: jest.Mocked<Tramite260213Store>;
  let consultaQuery: jest.Mocked<ConsultaioQuery>;
  let permisoService: jest.Mocked<PermisoSanitarioMedicosUsoPersonalService>;

  beforeEach(async () => {
    const tramiteQueryMock = {
      getTabSeleccionado$: of(1),
    } as unknown as jest.Mocked<Tramite260213Query>;

    const tramiteStoreMock = {
      update: jest.fn(),
      updateTabSeleccionado: jest.fn(),
    } as unknown as jest.Mocked<Tramite260213Store>;

    const consultaQueryMock = {
      selectConsultaioState$: of({
        readonly: false,
        procedureId: '260213',
        update: true,
      }),
    } as unknown as jest.Mocked<ConsultaioQuery>;

    const permisoServiceMock = {
      getRegistroTomaMuestrasMercanciasData: jest.fn().mockReturnValue(of({})),
    } as unknown as jest.Mocked<PermisoSanitarioMedicosUsoPersonalService>;

    await TestBed.configureTestingModule({
      imports: [PasoUnoComponent],
      providers: [
        { provide: Tramite260213Query, useValue: tramiteQueryMock },
        { provide: Tramite260213Store, useValue: tramiteStoreMock },
        { provide: ConsultaioQuery, useValue: consultaQueryMock },
        { provide: PermisoSanitarioMedicosUsoPersonalService, useValue: permisoServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.componentInstance;
    tramiteQuery = TestBed.inject(Tramite260213Query) as jest.Mocked<Tramite260213Query>;
    tramiteStore = TestBed.inject(Tramite260213Store) as jest.Mocked<Tramite260213Store>;
    consultaQuery = TestBed.inject(ConsultaioQuery) as jest.Mocked<ConsultaioQuery>;
    permisoService = TestBed.inject(PermisoSanitarioMedicosUsoPersonalService) as jest.Mocked<PermisoSanitarioMedicosUsoPersonalService>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize consultaState and call guardarDatosFormulario on ngOnInit()', () => {
    // Mock the consultaQuery.selectConsultaioState$ observable to emit the correct data
    consultaQuery.selectConsultaioState$ = of({
      procedureId: '260213',
      parameter: 'param1',
      department: 'Health Department',
      folioTramite: 'FT123456',
      tipoDeTramite: 'Importation',
      estadoDeTramite: 'In Progress',
      readonly: false,
      create: true,
      update: true,
      consultaioSolicitante: null,
    });
  
   
    const guardarDatosFormularioSpy = jest.spyOn(component, 'guardarDatosFormulario');
  
    
    component.ngOnInit();
    
  
  });

  it('should set esDatosRespuesta to true if consultaState is invalid on ngOnInit()', () => {
    consultaQuery.selectConsultaioState$ = of({
      procedureId: '260213',
  parameter: 'param1',
  department: 'Health Department',
  folioTramite: 'FT123456',
  tipoDeTramite: 'Importation',
  estadoDeTramite: 'In Progress',
  readonly: false,
  create: true,
  update: false,
  consultaioSolicitante: null,

    });
    component.ngOnInit();
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('should update indice on getTabSeleccionado$ subscription', () => {
    tramiteQuery.getTabSeleccionado$ = of(2);
    component.ngOnInit();
    expect(component.indice).toBe(2);
  });

  it('should call getRegistroTomaMuestrasMercanciasData and actualizarEstadoFormulario on guardarDatosFormulario()', () => {
    const mockData : Tramite260213State = {
      destinatarioFinalTablaDatos: [],
      facturadorTablaDatos: [],
      proveedorTablaDatos: [],
      fabricanteTablaDatos: [],
      datosSolicitudFormState: {} as any,
      mercanciaForm: {} as any,
      opcionConfigDatos: [],
      scianConfigDatos: [],
      tablaMercanciasConfigDatos: [],
      seleccionadoopcionDatos: [],
      seleccionadoScianDatos: [],
      seleccionadoTablaMercanciasDatos: [],
      opcionesColapsableState: false,
      pagoDerechos: {} as any,
      tabSeleccionado: 1,
    };

    permisoService.getRegistroTomaMuestrasMercanciasData.mockReturnValue(of(mockData));
    const actualizarEstadoFormularioSpy = jest.spyOn(component, 'actualizarEstadoFormulario');

    component.guardarDatosFormulario();

    expect(permisoService.getRegistroTomaMuestrasMercanciasData).toHaveBeenCalled();
    expect(actualizarEstadoFormularioSpy).toHaveBeenCalledWith(mockData);
  });

  it('should update the store on actualizarEstadoFormulario()', () => {
    const mockData = { key: 'value' };
    component.actualizarEstadoFormulario(mockData as any);
    expect(tramiteStore.update).toHaveBeenCalledWith(expect.any(Function));
  });

  it('should call updateTabSeleccionado on seleccionaTab()', () => {
    component.seleccionaTab(3);
    expect(tramiteStore.updateTabSeleccionado).toHaveBeenCalledWith(3);
  });

  it('should clean up subscriptions on ngOnDestroy()', () => {
    const destroyNotifierSpy = jest.spyOn(component['destroyNotifier$'], 'next');
    const destroyNotifierCompleteSpy = jest.spyOn(component['destroyNotifier$'], 'complete');

    component.ngOnDestroy();

    expect(destroyNotifierSpy).toHaveBeenCalled();
    expect(destroyNotifierCompleteSpy).toHaveBeenCalled();
  });
});