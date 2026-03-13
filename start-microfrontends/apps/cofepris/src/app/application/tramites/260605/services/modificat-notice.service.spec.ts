import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { ModificatNoticeService } from './modificat-notice.service';
import { Tramite260605Store } from '../../../estados/tramites/tramite260605.store';
import { Solicitud260605State } from '../../../estados/tramites/tramite260605.store';

describe('ModificatNoticeService', () => {
  let service: ModificatNoticeService;
  let httpMock: jest.Mocked<HttpClient>;
  let storeMock: jest.Mocked<Tramite260605Store>;

  beforeEach(() => {
    httpMock = {
      get: jest.fn(),
    } as any;

    storeMock = {
      setNumeroDPmiso: jest.fn(),
      setCstumbresAtuales: jest.fn(),
      setRfc: jest.fn(),
      setNombre: jest.fn(),
      setApellidoPaterno: jest.fn(),
      setApellidoMaterno: jest.fn(),
      setAduanasDisponibles: jest.fn(),
      setAduanasSeleccionadas: jest.fn(),
      setCantidadSolicitada: jest.fn(),
      setCostumbresActuales: jest.fn(),
    } as any;

    service = new ModificatNoticeService(httpMock, storeMock);
  });

  it('debe crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('debe obtener los datos del representante correctamente', (done) => {
    const mockBody = { id: 1 };
    const mockData = { nombre: 'Juan' };
    httpMock.post = jest.fn().mockReturnValue(of(mockData));

    service.ObtenerReprestantanteData(mockBody).subscribe((data) => {
      expect(data).toEqual(mockData);
      expect(httpMock.post).toHaveBeenCalledWith(expect.anything(), mockBody);
      done();
    });
  });

  it('debe manejar error al obtener los datos del representante', (done) => {
    const mockBody = { id: 1 };
    httpMock.post = jest.fn().mockReturnValue(throwError(() => new Error('Error')));

    service.ObtenerReprestantanteData(mockBody).subscribe({
      error: (err) => {
        expect(err).toBeTruthy();
        done();
      },
    });
  });

  it('debe obtener la lista de aduanas disponibles correctamente', (done) => {
    const mockAduanas = { data: [{ id: 1, nombre: 'Aduana1' }, { id: 2, nombre: 'Aduana2' }] };
    httpMock.get.mockReturnValue(of(mockAduanas));

    service.obteneraduanasDisponiblesdatos().subscribe((data) => {
      expect(data).toEqual(mockAduanas);
      expect(httpMock.get).toHaveBeenCalledWith(expect.anything());
      done();
    });
  });

  it('debe manejar error al obtener la lista de aduanas disponibles', (done) => {
    httpMock.get.mockReturnValue(throwError(() => new Error('Error')));

    service.obteneraduanasDisponiblesdatos().subscribe({
      error: (err) => {
        expect(err).toBeTruthy();
        done();
      },
    });
  });

  it('debe actualizar el estado del formulario correctamente', () => {
    const datos: Solicitud260605State = {
      numeroDePermiso: '123',
      cstumbresAtuales: 'actual',
      rfc: 'RFC123',
      nombre: 'Juan',
      apellidoPaterno: 'Pérez',
      apellidoMaterno: 'Gómez',
      aduanasDisponibles: [],
      aduanasSeleccionadas: [],
      cantidadSolicitada: '10',
      aduanaActual: '',
      idSolicitud: 1,
    };

    service.actualizarEstadoFormulario(datos);

    expect(storeMock.setNumeroDPmiso).toHaveBeenCalledWith('123');
    expect(storeMock.setCstumbresAtuales).toHaveBeenCalledWith('actual');
    expect(storeMock.setRfc).toHaveBeenCalledWith('RFC123');
    expect(storeMock.setNombre).toHaveBeenCalledWith('Juan');
    expect(storeMock.setApellidoPaterno).toHaveBeenCalledWith('Pérez');
    expect(storeMock.setApellidoMaterno).toHaveBeenCalledWith('Gómez');
    expect(storeMock.setAduanasDisponibles).toHaveBeenCalledWith([]);
    expect(storeMock.setAduanasSeleccionadas).toHaveBeenCalledWith([]);
    expect(storeMock.setCantidadSolicitada).toHaveBeenCalledWith('10');
  });

  it('debe obtener los datos de registro de toma de muestras de mercancías correctamente', (done) => {
    const mockData = { nombre: 'Prueba' } as Solicitud260605State;
    httpMock.get.mockReturnValue(of(mockData));

    service.getRegistroTomaMuestrasMercanciasData().subscribe((data) => {
      expect(data).toEqual(mockData);
      expect(httpMock.get).toHaveBeenCalledWith('assets/json/260605/registro_toma_muestras_mercancias.json');
      done();
    });
  });

  it('debe manejar error al obtener los datos de registro de toma de muestras de mercancías', (done) => {
    httpMock.get.mockReturnValue(throwError(() => new Error('Error')));

    service.getRegistroTomaMuestrasMercanciasData().subscribe({
      error: (err) => {
        expect(err).toBeTruthy();
        done();
      },
    });
  });

  it('debe guardar la solicitud correctamente', (done) => {
    const payload = { test: 'data' };
    const mockResponse = { success: true };
    httpMock.post = jest.fn().mockReturnValue(of(mockResponse));

    service.guardarSolicitud(payload).subscribe((data) => {
      expect(data).toEqual(mockResponse);
      expect(httpMock.post).toHaveBeenCalledWith(expect.anything(), payload);
      done();
    });
  });

  it('debe manejar error al guardar la solicitud', (done) => {
    const payload = { test: 'data' };
    httpMock.post = jest.fn().mockReturnValue(throwError(() => new Error('Error')));

    service.guardarSolicitud(payload).subscribe({
      error: (err) => {
        expect(err).toBeTruthy();
        done();
      },
    });
  });
});