import { PasoUnoComponent } from './paso-uno.component';
import { SeccionLibStore } from '@ng-mf/data-access-user';
import { ServicioDeMensajesService } from '../../services/servicio-de-mensajes.service';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { of, Subject } from 'rxjs';

jest.mock('@ng-mf/data-access-user');
jest.mock('../../services/servicio-de-mensajes.service');

describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let seccionStoreMock: jest.Mocked<SeccionLibStore>;
  let servicioDeMensajesServiceMock: jest.Mocked<ServicioDeMensajesService>;
  let consultaQueryMock: jest.Mocked<ConsultaioQuery>;
  let consultaState: ConsultaioState;

  beforeEach(() => {
    seccionStoreMock = {
      establecerFormaValida: jest.fn(),
      establecerSeccion: jest.fn(),
    } as any;

    servicioDeMensajesServiceMock = {
      establecerDatosDePermiso: jest.fn(),
      getRegistroTomaMuestrasMercanciasData: jest.fn(),
      actualizarEstadoFormulario: jest.fn(),
      enviarMensaje: jest.fn(),
      mensaje$: of(false),
    } as any;

    consultaState = { update: false } as ConsultaioState;
    consultaQueryMock = {
      selectConsultaioState$: of(consultaState),
    } as any;

    component = new PasoUnoComponent(seccionStoreMock, servicioDeMensajesServiceMock, consultaQueryMock);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize indice to 1', () => {
    expect(component.indice).toBe(1);
  });

  it('should initialize seccionesDeLaSolicitud with two sections', () => {
    expect(component.seccionesDeLaSolicitud.length).toBe(2);
    expect(component.seccionesDeLaSolicitud[0].title).toBe('Solicitante');
  });

  it('should set mostrarBusqueda to false by default', () => {
    expect(component.mostrarBusqueda).toBe(false);
  });

  it('should call establecerFormaValida and establecerSeccion in constructor', () => {
    expect(seccionStoreMock.establecerFormaValida).toHaveBeenCalledWith([false]);
    expect(seccionStoreMock.establecerSeccion).toHaveBeenCalledWith([false]);
  });

  it('should set esDatosRespuesta to true if consultaState.update is false', () => {
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('should update indice when seleccionaPestana is called', () => {
    component.seleccionaPestana(2);
    expect(component.indice).toBe(2);
  });

  it('should update mostrarBusqueda on mensaje$ emission in ngOnInit', () => {
    servicioDeMensajesServiceMock.mensaje$ = of(true);
    component.ngOnInit();
    expect(component.mostrarBusqueda).toBe(true);
  });

  it('should call enviarMensaje(false) and complete destroyNotifier$ on ngOnDestroy', () => {
    const completeSpy = jest.spyOn<any, any>(component['destroyNotifier$'], 'complete');
    const nextSpy = jest.spyOn<any, any>(component['destroyNotifier$'], 'next');
    component.ngOnDestroy();
    expect(servicioDeMensajesServiceMock.enviarMensaje).toHaveBeenCalledWith(false);
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
    completeSpy.mockRestore();
    nextSpy.mockRestore();
  });

  it('guardarDatosFormulario should not call actualizarEstadoFormulario if resp is falsy', () => {
    servicioDeMensajesServiceMock.getRegistroTomaMuestrasMercanciasData.mockReturnValue(of(undefined as any));
    component.guardarDatosFormulario();
    expect(servicioDeMensajesServiceMock.actualizarEstadoFormulario).not.toHaveBeenCalled();
  });
});