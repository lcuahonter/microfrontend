import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoUnoComponent } from './paso-uno.component';
import { ConsultaioQuery, ConsultaioState } from '@libs/shared/data-access-user/src';
import { DepositoFiscalManufacturaVehiculosApiService } from '../../services/deposito-fiscal-manufactura-vehiculos-api.service';
import { of} from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DatosDelInmueble104State } from '../../../../core/estados/tramites/tramite104.store';

describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let fixture: ComponentFixture<PasoUnoComponent>;
  let consultaioQueryMock: Partial<ConsultaioQuery>;
  let apiServiceMock: Partial<DepositoFiscalManufacturaVehiculosApiService>;

  const MOCK_CONSULTA_STATE: ConsultaioState = {
    update: true
  } as ConsultaioState;

 const DATOS_INMUEBLE_STATE_MOCK: DatosDelInmueble104State = {
  fomentoExportacion: {
    tipoPrograma: '1',
    folioAutorizacion: '12345',
  },
  direccion: {
    calle: 'Main St',
    numeroExterior: '100',
    pais: 'México',
    entidadFederativa: 'CDMX',
    municipioDelegacion: 'Benito Juárez',
    colonia: 'Del Valle',
    localidad: 'Ciudad de México',
    codigoPostal: '03100',
  },
};


  beforeEach(async () => {
    consultaioQueryMock = {
      selectConsultaioState$: of(MOCK_CONSULTA_STATE)
    };

    apiServiceMock = {
      obtenerDatosInicialesFormulario: jest.fn(() => of(DATOS_INMUEBLE_STATE_MOCK)),
      actualizarEstadoFormulario: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [PasoUnoComponent],
      providers: [
        { provide: ConsultaioQuery, useValue: consultaioQueryMock },
        { provide: DepositoFiscalManufacturaVehiculosApiService, useValue: apiServiceMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente', (): void => {
    expect(component).toBeTruthy();
  });

  it('debe establecer consultaState desde selectConsultaioState$', (): void => {
    expect(component.consultaState).toEqual(MOCK_CONSULTA_STATE);
  });

  it('debe establecer esDatosRespuesta en true y llamar a actualizarEstadoFormulario cuando se llama a guardarDatosFormulario', (): void => {
    component.guardarDatosFormulario();
    expect(apiServiceMock.obtenerDatosInicialesFormulario).toHaveBeenCalled();
    expect(apiServiceMock.actualizarEstadoFormulario).toHaveBeenCalledWith(DATOS_INMUEBLE_STATE_MOCK);
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('debe llamar guardarDatosFormulario dos veces en ngOnInit cuando update es true', (): void => {
    const guardarSpy = jest.spyOn(component, 'guardarDatosFormulario');
    component.ngOnInit();
    expect(guardarSpy).toHaveBeenCalledTimes(2); // una por if(update), otra siempre
  });

  it('debe actualizar indice cuando se llama a seleccionaTab', (): void => {
    component.seleccionaTab(3);
    expect(component.indice).toBe(3);
  });
});
