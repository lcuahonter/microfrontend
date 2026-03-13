import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, Subject } from 'rxjs';
import { DatosComponent } from './datos.component';
import { PantallasSvcService } from '../../services/pantallas-svc.service';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { ConsultaioState } from '@ng-mf/data-access-user';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('DatosComponent', () => {
  let component: DatosComponent;
  let fixture: ComponentFixture<DatosComponent>;

  // Mocks
  const destroy$ = new Subject<void>();
  const MOCK_STATE: ConsultaioState = {
    procedureId: '1',
    parameter: 'p',
    department: 'd',
    folioTramite: 'f',
    tipoDeTramite: 'tipo',
    estadoDeTramite: 'estado',
    readonly: false,
    create: false,
    update: true,
    consultaioSolicitante: null,
  };

  const mockConsultaQuery = {
    selectConsultaioState$: of(MOCK_STATE),
  };

  const mockPantallasSvc = {
    getConsultaDatos: jest.fn(() => of(MOCK_STATE)),
    actualizarEstadoFormulario: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DatosComponent],
      providers: [
        { provide: PantallasSvcService, useValue: mockPantallasSvc },
        { provide: ConsultaioQuery, useValue: mockConsultaQuery },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(DatosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Triggers ngOnInit
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe asignar consultaState y llamar a guardarDatosFormulario si update es true', () => {
    const spyGuardar = jest.spyOn(component, 'guardarDatosFormulario');
    component.ngOnInit();
    expect(component.consultaState).toEqual(MOCK_STATE);
    expect(spyGuardar).toHaveBeenCalled();
  });

  it('debe llamar a pantallasSvc.actualizarEstadoFormulario cuando se llama guardarDatosFormulario', () => {
    component.guardarDatosFormulario();
    expect(mockPantallasSvc.getConsultaDatos).toHaveBeenCalled();
    expect(mockPantallasSvc.actualizarEstadoFormulario).toHaveBeenCalledWith(MOCK_STATE);
  });

  it('debe actualizar indice cuando se llama seleccionaTab', () => {
    component.seleccionaTab(3);
    expect(component.indice).toBe(3);
  });

  it('debe completar destroyNotifier$ en ngOnDestroy', () => {
    const completeSpy = jest.spyOn(component['destroyNotifier$'], 'complete');
    const nextSpy = jest.spyOn(component['destroyNotifier$'], 'next');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
