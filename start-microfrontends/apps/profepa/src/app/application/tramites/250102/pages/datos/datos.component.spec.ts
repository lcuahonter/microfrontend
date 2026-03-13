import { DatosComponent } from './datos.component';
import { of, Subject } from 'rxjs';

// Mock for ConsultaioQuery
class MockConsultaioQuery {
  selectConsultaioState$ = of({ update: false });
}

// Mock for Solocitud250102Service
class MockSolocitud250102Service {
  getRegistroTomaMuestrasMercanciasData = jest.fn().mockReturnValue(of({ key: 'mockData' }));
  actualizarEstadoFormulario = jest.fn();
}

describe('DatosComponent (Jest)', () => {
  let component: DatosComponent;
  let mockQuery: MockConsultaioQuery;
  let mockService: MockSolocitud250102Service;

  beforeEach(() => {
    mockQuery = new MockConsultaioQuery();
    mockService = new MockSolocitud250102Service();
    component = new DatosComponent(mockQuery as any, mockService as any);
  });

  test('should create the component', () => {
    expect(component).toBeTruthy();
  });

  test('should initialize indice to 1', () => {
    expect(component.indice).toBe(1);
  });

  test('should update indice when seleccionaTab is called', () => {
    component.seleccionaTab(3);
    expect(component.indice).toBe(3);
  });

  test('should handle negative index in seleccionaTab', () => {
    component.seleccionaTab(-1);
    expect(component.indice).toBe(-1);
  });

  test('should handle zero in seleccionaTab', () => {
    component.seleccionaTab(0);
    expect(component.indice).toBe(0);
  });

  test('should set esDatosRespuesta to true if update is false', () => {
    component.ngOnInit();
    expect(component.esDatosRespuesta).toBe(true);
  });

  test('should call guardarDatosFormulario if update is true', () => {
    // Override selectConsultaioState$ to emit update: true
    mockQuery.selectConsultaioState$ = of({ update: true });

    component = new DatosComponent(mockQuery as any, mockService as any);
    const guardarSpy = jest.spyOn(component, 'guardarDatosFormulario');

    component.ngOnInit();

    expect(guardarSpy).toHaveBeenCalled();
  });

  test('guardarDatosFormulario should call service and set esDatosRespuesta to true', () => {
    component.guardarDatosFormulario();

    expect(mockService.getRegistroTomaMuestrasMercanciasData).toHaveBeenCalled();
    expect(mockService.actualizarEstadoFormulario).toHaveBeenCalledWith({ key: 'mockData' });
    expect(component.esDatosRespuesta).toBe(true);
  });

  test('should clean up on ngOnDestroy', () => {
    const nextSpy = jest.spyOn(component['destroyNotifier$'], 'next');
    const completeSpy = jest.spyOn(component['destroyNotifier$'], 'complete');

    component.ngOnDestroy();

    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
