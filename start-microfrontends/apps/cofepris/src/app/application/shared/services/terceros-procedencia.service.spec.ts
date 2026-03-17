import { TercerosProcedenciaService } from './terceros-procedencia.service';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';

describe('TercerosProcedenciaService (Jest)', () => {
  let service: TercerosProcedenciaService;
  let httpClient: jest.Mocked<HttpClient>;

  beforeEach(() => {
    httpClient = {
      get: jest.fn(),
    } as any;

    service = new TercerosProcedenciaService(httpClient);
  });

  it('debería ser creado correctamente', () => {
    expect(service).toBeTruthy();
  });

  describe('getData', () => {
    it('debería llamar http.get con la URL correcta', (done) => {
      const mockResponse = [{ id: '1', descripcion: 'Test', activo: true }];
      httpClient.get.mockReturnValueOnce(of(mockResponse));

      service.getData().subscribe((res) => {
        expect(res).toEqual(mockResponse);
        expect(httpClient.get).toHaveBeenCalledWith(
          'assets/json/260212/terceros-relacionados.json'
        );
        done();
      });
    });

    it('debería manejar respuesta de arreglo vacío', (done) => {
      const mockResponse: any[] = [];
      httpClient.get.mockReturnValueOnce(of(mockResponse));

      service.getData().subscribe((res) => {
        expect(res).toEqual([]);
        expect(res.length).toBe(0);
        done();
      });
    });

    it('debería manejar errores HTTP', (done) => {
      const errorResponse = new Error('HTTP Error');
      httpClient.get.mockReturnValueOnce(throwError(() => errorResponse));

      service.getData().subscribe({
        error: (error) => {
          expect(error).toBe(errorResponse);
          done();
        },
      });
    });
  });

  describe('getInformacioDeTabla', () => {
    it('debería llamar http.get con la URL correcta', (done) => {
      const mockResponse = { success: true, data: [], message: 'OK' };
      httpClient.get.mockReturnValueOnce(of(mockResponse));

      service.getInformacioDeTabla().subscribe((res) => {
        expect(res).toEqual(mockResponse);
        expect(httpClient.get).toHaveBeenCalledWith(
          'assets/json/260402/informacio-procedencia.json'
        );
        done();
      });
    });

    it('debería manejar respuesta exitosa con datos', (done) => {
      const mockResponse = {
        success: true,
        data: [{ campo1: 'valor1' }],
        message: 'Success',
      };
      httpClient.get.mockReturnValueOnce(of(mockResponse));

      service.getInformacioDeTabla().subscribe((res) => {
        expect(res.data.length).toBe(1);
        done();
      });
    });

    it('debería manejar errores HTTP', (done) => {
      const errorResponse = new Error('Network Error');
      httpClient.get.mockReturnValueOnce(throwError(() => errorResponse));

      service.getInformacioDeTabla().subscribe({
        error: (error) => {
          expect(error).toBe(errorResponse);
          done();
        },
      });
    });
  });

  describe('getFabricanteDatos', () => {
    it('debería llamar http.get con la URL correcta', (done) => {
      const mockResponse = [
        {
          id: 1,
          nombre: 'Fabricante 1',
          direccion: 'Dir 1',
          telefono: '123',
          activo: true,
        },
      ];
      httpClient.get.mockReturnValueOnce(of(mockResponse));

      service.getFabricanteDatos().subscribe((res) => {
        expect(res).toEqual(mockResponse);
        expect(httpClient.get).toHaveBeenCalledWith(
          'assets/json/260402/fabricante.json'
        );
        done();
      });
    });

    it('debería manejar respuesta de arreglo vacío', (done) => {
      const mockResponse: any[] = [];
      httpClient.get.mockReturnValueOnce(of(mockResponse));

      service.getFabricanteDatos().subscribe((res) => {
        expect(res).toEqual([]);
        expect(res.length).toBe(0);
        done();
      });
    });

    it('debería manejar múltiples fabricantes', (done) => {
      const mockResponse = [
        {
          id: 1,
          nombre: 'Fabricante 1',
          direccion: 'Dir 1',
          telefono: '123',
          activo: true,
        },
        {
          id: 2,
          nombre: 'Fabricante 2',
          direccion: 'Dir 2',
          telefono: '456',
          activo: false,
        },
      ];
      httpClient.get.mockReturnValueOnce(of(mockResponse));

      service.getFabricanteDatos().subscribe((res) => {
        expect(res.length).toBe(2);
        done();
      });
    });

    it('debería manejar errores HTTP', (done) => {
      const errorResponse = new Error('File not found');
      httpClient.get.mockReturnValueOnce(throwError(() => errorResponse));

      service.getFabricanteDatos().subscribe({
        error: (error) => {
          expect(error).toBe(errorResponse);
          done();
        },
      });
    });
  });

  describe('Constructor', () => {
    it('debería inyectar HttpClient correctamente', () => {
      expect(service['http']).toBeTruthy();
      expect(service['http']).toBe(httpClient);
    });
  });

  describe('Múltiples llamadas a métodos', () => {
    it('debería manejar llamadas secuenciales', (done) => {
      const mockCatalogo = [{ id: '1', descripcion: 'Test', activo: true }];
      const mockInfo = { success: true, data: [], message: 'OK' };
      const mockFabricante = [
        {
          id: 1,
          nombre: 'Test',
          direccion: 'Test',
          telefono: '123',
          activo: true,
        },
      ];

      httpClient.get
        .mockReturnValueOnce(of(mockCatalogo))
        .mockReturnValueOnce(of(mockInfo))
        .mockReturnValueOnce(of(mockFabricante));

      let callCount = 0;
      const checkComplete = () => {
        callCount++;
        if (callCount === 3) {
          expect(httpClient.get).toHaveBeenCalledTimes(3);
          done();
        }
      };

      service.getData().subscribe(() => checkComplete());
      service.getInformacioDeTabla().subscribe(() => checkComplete());
      service.getFabricanteDatos().subscribe(() => checkComplete());
    });
  });
});
