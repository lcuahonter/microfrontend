import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoUnoComponent } from './paso-uno.component';
import { NO_ERRORS_SCHEMA } from '@angular/core'; 
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, Subject } from 'rxjs';
import { ExportacionPetroliferosService } from '../../services/exportacion-petroliferos.service';
import { Solocitud130201Service } from '../../services/service130201.service';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
describe('PasoUnoComponent (Jest)', () => {
  let component: PasoUnoComponent;
  let fixture: ComponentFixture<PasoUnoComponent>;

  let consultaQueryMock: Partial<jest.Mocked<ConsultaioQuery>>;
  let solicitudServiceMock: Partial<jest.Mocked<Solocitud130201Service>>;

  const destroy$ = new Subject<void>();

  const consultaStateUpdate: ConsultaioState = { update: true } as ConsultaioState;
  const consultaStateNoUpdate: ConsultaioState = { update: false } as ConsultaioState;

  beforeEach(async () => {
    consultaQueryMock = {
      selectConsultaioState$: of(consultaStateUpdate),
    };

    solicitudServiceMock = {
      getRegistroTomaMuestrasMercanciasData: jest.fn().mockReturnValue(of({ data: 'mocked' })),
      actualizarEstadoFormulario: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [PasoUnoComponent],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: ConsultaioQuery, useValue: consultaQueryMock },
        { provide: Solocitud130201Service, useValue: solicitudServiceMock },
        ExportacionPetroliferosService,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default index as 1', () => {
    expect(component.indice).toBe(1);
  });

  it('should select tab correctly', () => {
    component.seleccionaTab(2);
    expect(component.indice).toBe(2);
  });

  it('should call guardarDatosFormulario if consultaState.update is true', () => {
    const guardarSpy = jest.spyOn(component, 'guardarDatosFormulario');
    consultaQueryMock.selectConsultaioState$ = of(consultaStateUpdate);
    component.ngOnInit();
    expect(guardarSpy).toHaveBeenCalled();
  });

  it('should set esDatosRespuesta to true if consultaState.update is false', () => {
    consultaQueryMock.selectConsultaioState$ = of(consultaStateNoUpdate);
    component['consultaQuery'] = consultaQueryMock as unknown as ConsultaioQuery;
    component.ngOnInit();
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('should call actualizarEstadoFormulario and set esDatosRespuesta', () => {
    component['solocitud130201Service'] = solicitudServiceMock as unknown as Solocitud130201Service;
    component.guardarDatosFormulario();
    expect(solicitudServiceMock.getRegistroTomaMuestrasMercanciasData).toHaveBeenCalled();
    expect(solicitudServiceMock.actualizarEstadoFormulario).toHaveBeenCalledWith({ data: 'mocked' });
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('should complete destroyNotifier$ on ngOnDestroy', () => {
    const completeSpy = jest.spyOn(component['destroyNotifier$'], 'complete');
    component.ngOnDestroy();
    expect(completeSpy).toHaveBeenCalled();
  });
});