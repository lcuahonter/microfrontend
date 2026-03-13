import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, Subject } from 'rxjs';
import { PasoUnoComponent } from './paso-uno.component';
import { DiamanteBrutoService } from '../../services/diamante-bruto.service';
import { ConsultaioQuery, ConsultaioState, SolicitanteComponent } from '@ng-mf/data-access-user';
import { SolicitudComponent } from '../../component/solicitud/solicitud.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let fixture: ComponentFixture<PasoUnoComponent>;
  let mockDiamanteBrutoService: jest.Mocked<DiamanteBrutoService>;
  let mockConsultaioQuery: jest.Mocked<ConsultaioQuery>;
  let mockConsultaState: ConsultaioState;

  beforeEach(async () => {
    mockDiamanteBrutoService = {
      getDatosDeLaSolicitud: jest.fn(()=> of()),
      actualizarEstadoFormulario: jest.fn(()=> of())
    } as any;

    mockConsultaioQuery = {
      selectConsultaioState$: of({})
    } as jest.Mocked<ConsultaioQuery>;

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SolicitanteComponent],
      declarations: [PasoUnoComponent, SolicitudComponent],
      providers: [
        { provide: DiamanteBrutoService, useValue: mockDiamanteBrutoService },
        { provide: ConsultaioQuery, useValue: mockConsultaioQuery }
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
    expect(component.destroyNotifier$).toBeInstanceOf(Subject);
  });

  it('should subscribe to consultaState$ and call guardarDatosFormulario when update is true', () => {
    mockConsultaState = { update: true } as ConsultaioState;
    Object.defineProperty(mockConsultaioQuery, 'selectConsultaioState$', {
      value: of(mockConsultaState)
    });
    const guardarDatosFormularioSpy = jest.spyOn(component, 'guardarDatosFormulario');

    component.ngOnInit();

    expect(component.consultaState).toEqual(mockConsultaState);
    expect(guardarDatosFormularioSpy).toHaveBeenCalled();
  });

  it('should set esDatosRespuesta to true when update is false', () => {
    mockConsultaState = { update: false } as ConsultaioState;
    Object.defineProperty(mockConsultaioQuery, 'selectConsultaioState$', {
      value: of(mockConsultaState)
    });

    component.ngOnInit();

    expect(component.esDatosRespuesta).toBe(true);
  });

  it('should set esDatosRespuesta to true and call actualizarEstadoFormulario when response is valid', () => {
    const mockResponse = { data: 'test' } as any;
    mockDiamanteBrutoService.getDatosDeLaSolicitud.mockReturnValue(of(mockResponse));

    component.guardarDatosFormulario();

    expect(component.esDatosRespuesta).toBe(true);
    expect(mockDiamanteBrutoService.actualizarEstadoFormulario).toHaveBeenCalledWith(mockResponse);
  });

  it('should set esDatosRespuesta to false when response is null', () => {
    mockDiamanteBrutoService.getDatosDeLaSolicitud.mockReturnValue(of(null as any));

    component.guardarDatosFormulario();

    expect(component.esDatosRespuesta).toBe(false);
    expect(mockDiamanteBrutoService.actualizarEstadoFormulario).not.toHaveBeenCalled();
  });

  it('should set indice to the provided value', () => {
    const testIndex = 3;

    component.seleccionaTab(testIndex);

    expect(component.indice).toBe(testIndex);
  });

  it('should complete destroyNotifier$ subject', () => {
    const nextSpy = jest.spyOn(component.destroyNotifier$, 'next');
    const completeSpy = jest.spyOn(component.destroyNotifier$, 'complete');

    component.ngOnDestroy();

    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});