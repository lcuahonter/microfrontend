import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoUnoComponent } from './paso-uno.component';
import { ConsultaioQuery } from '@libs/shared/data-access-user/src';
import { SolicitudService } from '../../services/solicitud/solicitud.service';
import { of, Subject } from 'rxjs';
import { GuardarDatosFormulario } from '../../models/solicitud.model';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let fixture: ComponentFixture<PasoUnoComponent>;
  let mockConsultaioQuery: any;
  let mockSolicitudService: any;
  let consultaioStateMock: any;

  beforeEach(async () => {
    consultaioStateMock = { update: false };
    mockConsultaioQuery = {
      selectConsultaioState$: of(consultaioStateMock),
    };
    mockSolicitudService = {
      guardarDatosFormulario: jest.fn(),
      actualizarEstadoFormulario: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [PasoUnoComponent],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: ConsultaioQuery, useValue: mockConsultaioQuery },
        { provide: SolicitudService, useValue: mockSolicitudService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set consultaState and esDatosRespuesta to true if update is false', () => {
    consultaioStateMock.update = false;
    component.ngOnInit();
    expect(component.consultaState).toEqual(consultaioStateMock);
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('should call guardarDatosFormulario if update is true', () => {
    consultaioStateMock.update = true;
    mockConsultaioQuery.selectConsultaioState$ = of(consultaioStateMock);
    const guardarSpy = jest
      .spyOn(component, 'guardarDatosFormulario')
      .mockImplementation();
    component.ngOnInit();
    expect(guardarSpy).toHaveBeenCalled();
  });

  it('should set esDatosRespuesta to true and call actualizarEstadoFormulario on response', () => {
    const resp: GuardarDatosFormulario = { foo: 'bar' } as any;
    const subject = new Subject<GuardarDatosFormulario>();
    mockSolicitudService.guardarDatosFormulario.mockReturnValue(
      subject.asObservable()
    );
    component.guardarDatosFormulario();
    subject.next(resp);
    subject.complete();
    expect(component.esDatosRespuesta).toBe(true);
    expect(
      mockSolicitudService.actualizarEstadoFormulario
    ).toHaveBeenCalledWith(resp);
  });

  it('should not call actualizarEstadoFormulario if response is falsy', () => {
    const subject = new Subject<GuardarDatosFormulario>();
    mockSolicitudService.guardarDatosFormulario.mockReturnValue(
      subject.asObservable()
    );
    component.guardarDatosFormulario();
    subject.next(undefined as any);
    subject.complete();
    expect(
      mockSolicitudService.actualizarEstadoFormulario
    ).not.toHaveBeenCalled();
  });

  it('should set indice to the provided value', () => {
    component.indice = 1;
    component.seleccionaTab(3);
    expect(component.indice).toBe(3);
  });

  it('should complete destroyNotifier$', () => {
    const nextSpy = jest.spyOn((component as any).destroyNotifier$, 'next');
    const completeSpy = jest.spyOn(
      (component as any).destroyNotifier$,
      'complete'
    );
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
