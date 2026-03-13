import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RegistroPoblacionalService } from './registro-poblacional.service';
import { InstalacionesPrincipalesRespuestaTabla, FormaRespuestaDatos } from '@libs/shared/data-access-user/src/core/models/6502/dato-comunes.model';

describe('RegistroPoblacionalService', () => {
  let service: RegistroPoblacionalService;
  let httpMock: HttpTestingController;
  const mockInstalacionesResponse: InstalacionesPrincipalesRespuestaTabla = {
    code:200,
    message:'Consulta exitosa',
    data: [
      { "tipo_persona": "AgenteAduanal",
        "nombre": "MISAEL BARRAGAN RUIZ",
        "rfc": "LEQI8101314S7",
        "registro_poblacional": "LEQI810131HDGSXGC" },
    ]
  };
  const mockFormaDatosResponse: FormaRespuestaDatos = {
    "code": 200,
    "data": [
      {
        "nombre": "MISAEL BARRAGAN RUIZ",
        "registroFederal": "LEQI8101314S7",
        "curp": "LEQI810131HDGSXG05"
      }
    ],
    "message": "Consulta exitosa"
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RegistroPoblacionalService]
    });

    service = TestBed.inject(RegistroPoblacionalService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verify that no unmatched requests are outstanding
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('obtenerInstalacionesPrincipalesTablaDatos', () => {
    it('should make GET request to correct URL and return data', () => {
      service.obtenerInstalacionesPrincipalesTablaDatos().subscribe(data => {
        expect(data).toEqual(mockInstalacionesResponse);
      });

      const req = httpMock.expectOne('assets/json/6502/instalacionesPrincipales-tabla.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockInstalacionesResponse);
    });

    it('should handle empty response', () => {
      service.obtenerInstalacionesPrincipalesTablaDatos().subscribe(data => {
        expect(data).toEqual({} as InstalacionesPrincipalesRespuestaTabla);
      });

      const req = httpMock.expectOne('assets/json/6502/instalacionesPrincipales-tabla.json');
      req.flush({});
    });

    it('should handle HTTP errors', () => {
      const mockError = new ProgressEvent('error');
      
      service.obtenerInstalacionesPrincipalesTablaDatos().subscribe({
        next: () => fail('should have failed with 404 error'),
        error: (error) => {
          expect(error).toBeTruthy();
        }
      });

      const req = httpMock.expectOne('assets/json/6502/instalacionesPrincipales-tabla.json');
      req.error(mockError);
    });
  });

  describe('obtenerFromaDatos', () => {
    it('should make GET request to correct URL and return data', () => {
      service.obtenerFromaDatos().subscribe(data => {
        expect(data).toEqual(mockFormaDatosResponse);
      });

      const req = httpMock.expectOne('assets/json/6502/forma-datos.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockFormaDatosResponse);
    });

    it('should handle empty response', () => {
      service.obtenerFromaDatos().subscribe(data => {
        expect(data).toEqual({} as FormaRespuestaDatos);
      });

      const req = httpMock.expectOne('assets/json/6502/forma-datos.json');
      req.flush({});
    });

    it('should handle HTTP errors', () => {
      const mockError = new ProgressEvent('error');
      
      service.obtenerFromaDatos().subscribe({
        next: () => fail('should have failed with 404 error'),
        error: (error) => {
          expect(error).toBeTruthy();
        }
      });

      const req = httpMock.expectOne('assets/json/6502/forma-datos.json');
      req.error(mockError);
    });
  });

  describe('Typo in method name', () => {
    // This test is just to document that there's a typo in the method name
    // (obtenerFromaDatos instead of obtenerFormaDatos)
    it('should have obtenerFromaDatos method (note the typo)', () => {
      expect(service.obtenerFromaDatos).toBeDefined();
    });
  });
});