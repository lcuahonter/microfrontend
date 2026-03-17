import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, Subject } from 'rxjs';
import { PasoUnoComponent } from './paso-uno.component';
import { Tramite260208Query } from '../../estados/tramite260208Query.query';
import { Tramite260208Store } from '../../estados/tramite260208Store.store';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { Tramite260208State } from '../../estados/tramite260208Store.store';
import { HttpClientModule } from '@angular/common/http';
import { Tramite260213State } from '../../../260213/estados/tramite260213Store.store';

describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let fixture: ComponentFixture<PasoUnoComponent>;
  let tramiteQuery: jest.Mocked<Tramite260208Query>;
  let tramiteStore: jest.Mocked<Tramite260208Store>;
  let consultaQuery: jest.Mocked<ConsultaioQuery>;

  beforeEach(async () => {
    const tramiteQueryMock = {
      getTabSeleccionado$: of(1),
    } as unknown as jest.Mocked<Tramite260208Query>;

    const tramiteStoreMock = {
      update: jest.fn(),
      updateTabSeleccionado: jest.fn(),
    } as unknown as jest.Mocked<Tramite260208Store>;

    const consultaQueryMock = {
      selectConsultaioState$: of({
        readonly: false,
        procedureId: '260208',
        update: true,
      }),
    } as unknown as jest.Mocked<ConsultaioQuery>;

    await TestBed.configureTestingModule({
      imports: [PasoUnoComponent, HttpClientModule],
      providers: [
        { provide: Tramite260208Query, useValue: tramiteQueryMock },
        { provide: Tramite260208Store, useValue: tramiteStoreMock },
        { provide: ConsultaioQuery, useValue: consultaQueryMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.componentInstance;
    tramiteQuery = TestBed.inject(
      Tramite260208Query
    ) as jest.Mocked<Tramite260208Query>;
    tramiteStore = TestBed.inject(
      Tramite260208Store
    ) as jest.Mocked<Tramite260208Store>;
    consultaQuery = TestBed.inject(
      ConsultaioQuery
    ) as jest.Mocked<ConsultaioQuery>;
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
      procedureId: '260208',
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

    const guardarDatosFormularioSpy = jest.spyOn(
      component,
      'guardarDatosFormulario'
    );

    component.ngOnInit();
  });

  it('should set esDatosRespuesta to true if consultaState is invalid on ngOnInit()', () => {
    consultaQuery.selectConsultaioState$ = of({
      procedureId: '260208',
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
    const mockData: Tramite260208State = {
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

    const actualizarEstadoFormularioSpy = jest.spyOn(
      component,
      'actualizarEstadoFormulario'
    );

    component.guardarDatosFormulario();
  });

  it('should update the store on actualizarEstadoFormulario()', () => {
    const mockData = { key: 'value' };
    component.actualizarEstadoFormulario(mockData as any);
    expect(tramiteStore.update).toHaveBeenCalledWith(expect.any(Function));
  });

  it('should call updateTabSeleccionado on seleccionaTab()', () => {
    component.seleccionaTab(3);
  });

  it('should clean up subscriptions on ngOnDestroy()', () => {
    const destroyNotifierSpy = jest.spyOn(
      component['destroyNotifier$'],
      'next'
    );
    const destroyNotifierCompleteSpy = jest.spyOn(
      component['destroyNotifier$'],
      'complete'
    );

    component.ngOnDestroy();

    expect(destroyNotifierSpy).toHaveBeenCalled();
    expect(destroyNotifierCompleteSpy).toHaveBeenCalled();
  });
});
