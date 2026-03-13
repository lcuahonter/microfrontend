import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContenedorDeDatosSolicitudComponent } from './contenedor-de-datos-solicitud.component';
import { Tramite260219Query } from '../../estados/tramite260219Query.query';
import { Tramite260219Store } from '../../estados/tramite260219Store.store';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { of } from 'rxjs';
import { Tramite260219State } from '../../estados/tramite260219Store.store';
import {
  
  TablaOpcionConfig,
  TablaScianConfig,
  TablaMercanciasDatos,
  DatosDeTablaSeleccionados,
  DatosSolicitudFormState,
} from '../../../../shared/models/datos-solicitud.model';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

describe('ContenedorDeDatosSolicitudComponent', () => {
  let component: ContenedorDeDatosSolicitudComponent;
  let fixture: ComponentFixture<ContenedorDeDatosSolicitudComponent>;
  let tramite260219QueryMock: jest.Mocked<Tramite260219Query>;
  let tramite260219StoreMock: jest.Mocked<Tramite260219Store>;
  let consultaQueryMock: jest.Mocked<ConsultaioQuery>;

  beforeEach(() => {
    tramite260219QueryMock = {
      selectTramiteState$: of({
        opcionConfigDatos: [] as TablaOpcionConfig[],
        scianConfigDatos: [] as TablaScianConfig[],
        tablaMercanciasConfigDatos: [] as TablaMercanciasDatos[],
      } as Tramite260219State),
      getTabSeleccionado$: of(2), 
    } as any;

    tramite260219StoreMock = {
      updateOpcionConfigDatos: jest.fn(),
      updateScianConfigDatos: jest.fn(),
      updateTablaMercanciasConfigDatos: jest.fn(),
      updateDatosSolicitudFormState: jest.fn(),
      update: jest.fn(),
    } as any;

    consultaQueryMock = {
      selectConsultaioState$: of({
        procedureId: '260219',
        readonly: true,
        create: false,
        update: false,
        parameter: '',
        department: '',
        folioTramite: '',
        tipoDeTramite: '',
        estadoDeTramite: '',
        consultaioSolicitante: null,
      }),
    } as any;

    TestBed.configureTestingModule({
      imports: [ContenedorDeDatosSolicitudComponent,ReactiveFormsModule,FormsModule, HttpClientModule],
      providers: [
        { provide: Tramite260219Query, useValue: tramite260219QueryMock },
        { provide: Tramite260219Store, useValue: tramite260219StoreMock },
        { provide: ConsultaioQuery, useValue: consultaQueryMock },
        { provide: ActivatedRoute,
                useValue: {
                  snapshot: {
                    params: {},
                    queryParams: {}
                  }
                }}
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ContenedorDeDatosSolicitudComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize tramiteState and table configurations correctly', () => {
    component.ngOnInit();

    expect(component.tramiteState).toEqual({
      opcionConfigDatos: [],
      scianConfigDatos: [],
      tablaMercanciasConfigDatos: [],
    });

    expect(component.opcionConfig.datos).toEqual([]);
    expect(component.scianConfig.datos).toEqual([]);
    expect(component.tablaMercanciasConfig.datos).toEqual([]);
  });

  

  it('should call updateOpcionConfigDatos when opcionSeleccionado is triggered', () => {
    const mockEvent: TablaOpcionConfig[] = [];
    component.opcionSeleccionado(mockEvent);
    expect(tramite260219StoreMock.updateOpcionConfigDatos).toHaveBeenCalledWith(mockEvent);
  });

  it('should call updateScianConfigDatos when scianSeleccionado is triggered', () => {
    const mockEvent: TablaScianConfig[] = [];
    component.scianSeleccionado(mockEvent);
    expect(tramite260219StoreMock.updateScianConfigDatos).toHaveBeenCalledWith(mockEvent);
  });

  it('should call updateTablaMercanciasConfigDatos when mercanciasSeleccionado is triggered', () => {
    const mockEvent: TablaMercanciasDatos[] = [];
    component.mercanciasSeleccionado(mockEvent);
    expect(tramite260219StoreMock.updateTablaMercanciasConfigDatos).toHaveBeenCalledWith(mockEvent);
  });

  it('should call updateDatosSolicitudFormState when datasolicituActualizar is triggered', () => {
    const mockEvent: DatosSolicitudFormState = { campo: 'valor' } as any;
    component.datasolicituActualizar(mockEvent);
    expect(tramite260219StoreMock.updateDatosSolicitudFormState).toHaveBeenCalledWith(mockEvent);
  });

  it('should call update with selected table data when datosDeTablaSeleccionados is triggered', () => {
    const mockEvent: DatosDeTablaSeleccionados = {
      opcionSeleccionados: [],
      scianSeleccionados: [],
      mercanciasSeleccionados: [],
      opcionesColapsableState: true,
    };
    component.datosDeTablaSeleccionados(mockEvent);
    expect(tramite260219StoreMock.update).toHaveBeenCalledWith(expect.any(Function));
  });

  it('should complete destroyNotifier$ on ngOnDestroy', () => {
    const destroyNotifierSpy = jest.spyOn(component['destroyNotifier$'], 'next');
    const destroyNotifierCompleteSpy = jest.spyOn(component['destroyNotifier$'], 'complete');
    component.ngOnDestroy();
    expect(destroyNotifierSpy).toHaveBeenCalled();
    expect(destroyNotifierCompleteSpy).toHaveBeenCalled();
  });
});