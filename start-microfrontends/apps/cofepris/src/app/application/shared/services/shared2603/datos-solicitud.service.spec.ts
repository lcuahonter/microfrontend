import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { DatosSolicitudService, RfcSearchPayload } from './datos-solicitud.service';

describe('DatosSolicitudService', () => {
  let service: DatosSolicitudService;
  let httpMock: { get: jest.Mock; post: jest.Mock };

  beforeEach(() => {
    httpMock = {
      get: jest.fn(),
      post: jest.fn(),
    };
    TestBed.configureTestingModule({
      providers: [
        DatosSolicitudService,
        { provide: HttpClient, useValue: httpMock }
      ]
    });
    service = TestBed.inject(DatosSolicitudService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('obtenerRespuestaPorUrl', () => {
    it('should assign data to variable if response is valid', () => {
      const self: any = {};
      const variable = 'testVar';
      const url = '/test.json';
      const mockResponse = { code: 200, data: [1, 2, 3] };
      httpMock.get.mockReturnValue(of(mockResponse));
      service.obtenerRespuestaPorUrl(self, variable, url);
      expect(httpMock.get).toHaveBeenCalledWith('assets/json' + url);
    });

    it('should assign empty array if response is invalid', () => {
      const self: any = {};
      const variable = 'testVar';
      const url = '/test.json';
      const mockResponse = { code: 404, data: null };
      httpMock.get.mockReturnValue(of(mockResponse));
      service.obtenerRespuestaPorUrl(self, variable, url);
      expect(httpMock.get).toHaveBeenCalled();
    });

    it('should not call http if params are missing', () => {
      const self: any = {};
      service.obtenerRespuestaPorUrl(self, '', '');
      expect(httpMock.get).not.toHaveBeenCalled();
    });
  });

  it('should get lista de países', (done) => {
    const mock = { pais: [{ id: 1, nombre: 'México' }] };
    httpMock.get.mockReturnValue(of(mock));
    service.obtenerListaPaises().subscribe(res => {
      expect(res).toEqual(mock.pais);
      done();
    });
  });

  it('should get lista de estados', (done) => {
    const mock = { estado: [{ id: 1, nombre: 'CDMX' }] };
    httpMock.get.mockReturnValue(of(mock));
    service.obtenerListaEstados().subscribe(res => {
      expect(res).toEqual(mock.estado);
      done();
    });
  });

  it('should get banco datos', (done) => {
    const mock = { banco: [{ id: 1, nombre: 'Banamex' }] };
    httpMock.get.mockReturnValue(of(mock));
    service.getBancoDatos().subscribe(res => {
      expect(res).toEqual(mock.banco);
      done();
    });
  });

  it('should get lista de municipios', (done) => {
    const mock = { municipio: [{ id: 1, nombre: 'Benito Juárez' }] };
    httpMock.get.mockReturnValue(of(mock));
    service.obtenerListaMunicipios().subscribe(res => {
      expect(res).toEqual(mock.municipio);
      done();
    });
  });

  it('should get lista de localidades', (done) => {
    const mock = { localidad: [{ id: 1, nombre: 'Centro' }] };
    httpMock.get.mockReturnValue(of(mock));
    service.obtenerListaLocalidades().subscribe(res => {
      expect(res).toEqual(mock.localidad);
      done();
    });
  });

  it('should get lista de códigos postales', (done) => {
    const mock = { codigo_postal: [{ id: 1, nombre: '03000' }] };
    httpMock.get.mockReturnValue(of(mock));
    service.obtenerListaCodigosPostales().subscribe(res => {
      expect(res).toEqual(mock.codigo_postal);
      expect(httpMock.get).toHaveBeenCalledWith('assets/json/cofepris/domicilio.json');
      done();
    });
  });

  it('should get lista de colonias', (done) => {
    const mock = { colonia: [{ id: 1, nombre: 'Roma' }] };
    httpMock.get.mockReturnValue(of(mock));
    service.obtenerListaColonias().subscribe(res => {
      expect(res).toEqual(mock.colonia);
      expect(httpMock.get).toHaveBeenCalledWith('assets/json/cofepris/domicilio.json');
      done();
    });
  });

  it('should buscar representante por RFC', (done) => {
    const payload: RfcSearchPayload = { rfcRepresentanteLegal: 'RFC123' };
    const mockResponse = { data: { rfc: 'RFC123' }, code: 200 };
    httpMock.post.mockReturnValue(of(mockResponse));
    service.host = 'http://localhost/api/';
    
    service.buscarRepresentantePorRfc('123', payload).subscribe(res => {
      expect(res).toEqual(mockResponse);
      expect(httpMock.post).toHaveBeenCalledWith('http://localhost/api/123/buscarRepresentante', payload);
      done();
    });
  });

  it('should obtener fracciones arancelarias', (done) => {
    const mockResponse = { data: { descripcion: 'Test' }, code: 200 };
    httpMock.get.mockReturnValue(of(mockResponse));
    service.host = 'http://localhost/api/';
    
    service.obtenerFraccionesArancelarias(1, 'clave123').subscribe(res => {
      expect(res).toEqual(mockResponse);
      expect(httpMock.get).toHaveBeenCalledWith('http://localhost/api/1/obtenerFraccionesArancelarias/clave123');
      done();
    });
  });

  it('should obtener UMT', (done) => {
    const mockResponse = { data: { unidad: 'KG' }, code: 200 };
    httpMock.get.mockReturnValue(of(mockResponse));
    service.host = 'http://localhost/api/';
    
    service.obtenerUMT(1, 'fraccion123').subscribe(res => {
      expect(res).toEqual(mockResponse);
      expect(httpMock.get).toHaveBeenCalledWith('http://localhost/api/1/obtenerUMT/fraccion123');
      done();
    });
  });

  it('should call obtenerRespuestaPorUrl with valid parameters', () => {
    const self = { testVar: null };
    const variable = 'testVar';
    const url = '/test.json';
    const mockResponse = { code: 200, data: [1, 2, 3] };
    
    httpMock.get.mockReturnValue(of(mockResponse));
    service.obtenerRespuestaPorUrl(self, variable, url);
    
    expect(httpMock.get).toHaveBeenCalledWith('assets/json/test.json');
  });

  it('should handle obtenerRespuestaPorUrl with invalid response code', () => {
    const self = { testVar: null };
    const variable = 'testVar';
    const url = '/test.json';
    const mockResponse = { code: 404, data: null };
    
    httpMock.get.mockReturnValue(of(mockResponse));
    service.obtenerRespuestaPorUrl(self, variable, url);
    
    expect(httpMock.get).toHaveBeenCalledWith('assets/json/test.json');
  });

  it('should not make HTTP call when parameters are invalid in obtenerRespuestaPorUrl', () => {
    service.obtenerRespuestaPorUrl(null, '', '');
    expect(httpMock.get).not.toHaveBeenCalled();
    
    service.obtenerRespuestaPorUrl({}, '', '/test.json');
    expect(httpMock.get).not.toHaveBeenCalled();
    
    service.obtenerRespuestaPorUrl({}, 'variable', '');
    expect(httpMock.get).not.toHaveBeenCalled();
  });

  it('should handle constructor and set host correctly', () => {
    expect(service.host).toContain('/api/');
  });

  it('should handle errors in obtenerListaPaises', (done) => {
    const error = new Error('Network error');
    httpMock.get.mockReturnValue(throwError(() => error));
    
    service.obtenerListaPaises().subscribe({
      next: () => fail('should have failed'),
      error: (err) => {
        expect(err).toBe(error);
        done();
      }
    });
  });

  it('should handle errors in obtenerListaEstados', (done) => {
    const error = new Error('Network error');
    httpMock.get.mockReturnValue(throwError(() => error));
    
    service.obtenerListaEstados().subscribe({
      next: () => fail('should have failed'),
      error: (err) => {
        expect(err).toBe(error);
        done();
      }
    });
  });

  it('should handle errors in getBancoDatos', (done) => {
    const error = new Error('Network error');
    httpMock.get.mockReturnValue(throwError(() => error));
    
    service.getBancoDatos().subscribe({
      next: () => fail('should have failed'),
      error: (err) => {
        expect(err).toBe(error);
        done();
      }
    });
  });

  it('should handle errors in obtenerListaMunicipios', (done) => {
    const error = new Error('Network error');
    httpMock.get.mockReturnValue(throwError(() => error));
    
    service.obtenerListaMunicipios().subscribe({
      next: () => fail('should have failed'),
      error: (err) => {
        expect(err).toBe(error);
        done();
      }
    });
  });

  it('should handle errors in obtenerListaLocalidades', (done) => {
    const error = new Error('Network error');
    httpMock.get.mockReturnValue(throwError(() => error));
    
    service.obtenerListaLocalidades().subscribe({
      next: () => fail('should have failed'),
      error: (err) => {
        expect(err).toBe(error);
        done();
      }
    });
  });

  it('should handle errors in obtenerListaCodigosPostales', (done) => {
    const error = new Error('Network error');
    httpMock.get.mockReturnValue(throwError(() => error));
    
    service.obtenerListaCodigosPostales().subscribe({
      next: () => fail('should have failed'),
      error: (err) => {
        expect(err).toBe(error);
        done();
      }
    });
  });

  it('should handle errors in obtenerListaColonias', (done) => {
    const error = new Error('Network error');
    httpMock.get.mockReturnValue(throwError(() => error));
    
    service.obtenerListaColonias().subscribe({
      next: () => fail('should have failed'),
      error: (err) => {
        expect(err).toBe(error);
        done();
      }
    });
  });

  it('should handle errors in buscarRepresentantePorRfc', (done) => {
    const payload: RfcSearchPayload = { rfcRepresentanteLegal: 'RFC123' };
    const error = new Error('Network error');
    httpMock.post.mockReturnValue(throwError(() => error));
    
    service.buscarRepresentantePorRfc('123', payload).subscribe({
      next: () => fail('should have failed'),
      error: (err) => {
        expect(err).toBe(error);
        done();
      }
    });
  });

  it('should handle errors in obtenerFraccionesArancelarias', (done) => {
    const error = new Error('Network error');
    httpMock.get.mockReturnValue(throwError(() => error));
    
    service.obtenerFraccionesArancelarias(1, 'clave').subscribe({
      next: () => fail('should have failed'),
      error: (err) => {
        expect(err).toBe(error);
        done();
      }
    });
  });

  it('should handle errors in obtenerUMT', (done) => {
    const error = new Error('Network error');
    httpMock.get.mockReturnValue(throwError(() => error));
    
    service.obtenerUMT(1, 'fraccion').subscribe({
      next: () => fail('should have failed'),
      error: (err) => {
        expect(err).toBe(error);
        done();
      }
    });
  });
});
function throwError(arg0: () => Error): any {
    throw new Error('Function not implemented.');
}

