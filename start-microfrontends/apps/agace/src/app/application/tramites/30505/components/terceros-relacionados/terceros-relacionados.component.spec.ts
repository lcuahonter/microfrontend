import { TercerosRelacionadosComponent } from './terceros-relacionados.component';
import { of } from 'rxjs';

describe('TercerosRelacionadosComponent', () => {
  let component: TercerosRelacionadosComponent;
  let serviceMock: any;

  beforeEach(() => {
    serviceMock = {
      obtenerDatos: jest.fn()
    };
    component = new TercerosRelacionadosComponent(serviceMock);
    (component as any).TercerosService = serviceMock;
  });

  it('should call cargarDatos on ngOnInit', () => {
    serviceMock.obtenerDatos.mockReturnValue(of([]));
    const spy = jest.spyOn(component, 'cargarDatos');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should assign array if obtenerDatos returns array', () => {
    const mockData = [{ id: 1, nombre: 'Tercero' }];
    serviceMock.obtenerDatos.mockReturnValue(of(mockData));
    component.cargarDatos();
    expect(component.tercerosRelacionadosDatos).toEqual(mockData);
  });

  it('should wrap object in array if obtenerDatos returns object', () => {
    const mockObj = { id: 2, nombre: 'Tercero2' };
    serviceMock.obtenerDatos.mockReturnValue(of(mockObj));
    component.cargarDatos();
    expect(component.tercerosRelacionadosDatos).toEqual([mockObj]);
  });

  it('should complete destroyNotifier$ on ngOnDestroy', () => {
    const completeSpy = jest.spyOn(component.destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(completeSpy).toHaveBeenCalled();
  });
});
