import { of } from 'rxjs';
import { PasoUnoComponent } from './paso-uno.component';

describe('PasoUnoComponent', () => {
  let componente: PasoUnoComponent;

  let mockRegistroSolicitudService: any;
  let mockConsultaQuery: any;

  beforeEach(() => {
  mockRegistroSolicitudService = { 
    someMethod: jest.fn(),
    getRegistroTomaMuestrasMercanciasData: jest.fn() // Add the missing mocked method
  };
  mockConsultaQuery = { someOtherMethod: jest.fn() };
  componente = new PasoUnoComponent(mockRegistroSolicitudService, mockConsultaQuery);
});

  it('debería inicializar indice con 1', () => {
    expect(componente.indice).toBe(1);
  });

  it('debería actualizar indice cuando se llama a seleccionaTab', () => {
    componente.seleccionaTab(2);
    expect(componente.indice).toBe(2);

    componente.seleccionaTab(1);
    expect(componente.indice).toBe(1);
  });

  it('debería poner esDatosRespuesta en true si update es false', () => {
    mockConsultaQuery.selectConsultaioState$ = of({ update: false });
    componente = new PasoUnoComponent(mockRegistroSolicitudService, mockConsultaQuery);
    componente.ngOnInit();
    expect(componente.esDatosRespuesta).toBe(true);
  });

  it('debería asignar consultaState desde el observable', () => {
    const state = { update: false, foo: 'bar' };
    mockConsultaQuery.selectConsultaioState$ = of(state);
    componente = new PasoUnoComponent(mockRegistroSolicitudService, mockConsultaQuery);
    componente.ngOnInit();
    expect(componente.consultaState).toEqual(state);
  });

  it('debería poner esDatosRespuesta en true y llamar actualizarEstadoFormulario si resp es truthy', (done) => {
  const respMock = { foo: 'bar' };
  mockRegistroSolicitudService.getRegistroTomaMuestrasMercanciasData.mockReturnValue(of(respMock));
  mockRegistroSolicitudService.actualizarEstadoFormulario = jest.fn();

  componente = new PasoUnoComponent(mockRegistroSolicitudService, mockConsultaQuery);

  componente.guardarDatosFormulario();

  // Wait for the observable to emit
  setTimeout(() => {
    expect(componente.esDatosRespuesta).toBe(true);
    expect(mockRegistroSolicitudService.actualizarEstadoFormulario).toHaveBeenCalledWith(respMock);
    done();
  });
});

it('no debe llamar actualizarEstadoFormulario ni poner esDatosRespuesta en true si resp es falsy', () => {
  // Mock getRegistroTomaMuestrasMercanciasData to return observable with null
  mockRegistroSolicitudService.getRegistroTomaMuestrasMercanciasData = jest.fn(() => of(null));
  mockRegistroSolicitudService.actualizarEstadoFormulario = jest.fn();

  componente = new PasoUnoComponent(mockRegistroSolicitudService, mockConsultaQuery);
  componente.destroyNotifier$ = { next: jest.fn(), complete: jest.fn() } as any;

  componente.guardarDatosFormulario();

  expect(componente.esDatosRespuesta).toBe(false);
  expect(mockRegistroSolicitudService.actualizarEstadoFormulario).not.toHaveBeenCalled();
});
  
});