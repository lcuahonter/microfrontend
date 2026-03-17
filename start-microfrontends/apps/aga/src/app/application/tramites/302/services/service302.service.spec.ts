import { Solicitud302Service } from './service302.service';
import { of } from 'rxjs';

describe('Solicitud302Service', () => {
  let service: Solicitud302Service;
  let httpMock: any;
  let tramite302StoreMock: any;

  beforeEach(() => {
    httpMock = {
      get: jest.fn()
    };
    tramite302StoreMock = {
      setDynamicFieldValue: jest.fn()
    };
    service = new Solicitud302Service(httpMock as any, tramite302StoreMock);
  });

  it('should call http.get for getCertiRegistroDatos', () => {
    httpMock.get.mockReturnValue(of({}));
    service.getCertiRegistroDatos().subscribe();
    expect(httpMock.get).toHaveBeenCalledWith('assets/json/302/certi-registro.json');
  });

  it('should call http.get for getProductos', () => {
    httpMock.get.mockReturnValue(of({}));
    service.getProductos().subscribe();
    expect(httpMock.get).toHaveBeenCalledWith('assets/json/302/producto.json');
  });

  it('should call setDynamicFieldValue for each entry in actualizarEstadoFormulario', () => {
    const datos = { campo1: 'valor1', campo2: 'valor2' };
    service.actualizarEstadoFormulario(datos);
    expect(tramite302StoreMock.setDynamicFieldValue).toHaveBeenCalledWith('campo1', 'valor1');
    expect(tramite302StoreMock.setDynamicFieldValue).toHaveBeenCalledWith('campo2', 'valor2');
  });
});
