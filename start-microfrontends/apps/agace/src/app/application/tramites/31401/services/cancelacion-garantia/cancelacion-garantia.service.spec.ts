import { TestBed } from '@angular/core/testing';
import { CancelacionGarantiaService } from './cancelacion-garantia.service';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';

describe('CancelacionGarantiaService', () => {
  let service: CancelacionGarantiaService;
  let httpMock: jest.Mocked<HttpClient>;

  beforeEach(() => {
    const httpClientMock = { get: jest.fn() } as unknown as jest.Mocked<HttpClient>;
    TestBed.configureTestingModule({
      providers: [
        CancelacionGarantiaService,
        { provide: HttpClient, useValue: httpClientMock }
      ]
    });
    service = TestBed.inject(CancelacionGarantiaService);
    httpMock = TestBed.inject(HttpClient) as jest.Mocked<HttpClient>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should getTipoDeGarantiaData', (done) => {
    const mockData = [{ label: 'A', value: 1 }];
    httpMock.get.mockReturnValueOnce(of(mockData));
    service.getTipoDeGarantiaData().subscribe(data => {
      expect(data).toEqual(mockData);
      expect(httpMock.get).toHaveBeenCalledWith('assets/json/31401/tipo-de-garantia.json');
      done();
    });
  });

  it('should getModalidadDeGarantiaData', (done) => {
    const mockData = [{ label: 'B', value: 2 }];
    httpMock.get.mockReturnValueOnce(of(mockData));
    service.getModalidadDeGarantiaData().subscribe(data => {
      expect(data).toEqual(mockData);
      expect(httpMock.get).toHaveBeenCalledWith('assets/json/31401/modalidad-de-la-garantia.json');
      done();
    });
  });

  it('should getTipoSectorData', (done) => {
    const mockData = [{ label: 'C', value: 3 }];
    httpMock.get.mockReturnValueOnce(of(mockData));
    service.getTipoSectorData().subscribe(data => {
      expect(data).toEqual(mockData);
      expect(httpMock.get).toHaveBeenCalledWith('assets/json/31401/tipo-sector.json');
      done();
    });
  });

  it('should obtenerDatosTablaRequisitos', (done) => {
    const mockData = [{ requisito: 'req' }];
    httpMock.get.mockReturnValueOnce(of(mockData));
    service.obtenerDatosTablaRequisitos().subscribe(data => {
      expect(data).toEqual(mockData);
      expect(httpMock.get).toHaveBeenCalledWith('assets/json/31401/requisitos-tabla.json');
      done();
    });
  });

  it('should obtenerDatosTablaTereceros', (done) => {
    const mockData = [{ tercero: 'ter' }];
    httpMock.get.mockReturnValueOnce(of(mockData));
    service.obtenerDatosTablaTereceros().subscribe(data => {
      expect(data).toEqual(mockData);
      expect(httpMock.get).toHaveBeenCalledWith('assets/json/31401/tereceros-tabla.json');
      done();
    });
  });

  it('should obtenerDatosTablaMiembro', (done) => {
    const mockData = [{ miembro: 'm' }];
    httpMock.get.mockReturnValueOnce(of(mockData));
    service.obtenerDatosTablaMiembro().subscribe(data => {
      expect(data).toEqual(mockData);
      expect(httpMock.get).toHaveBeenCalledWith('assets/json/31401/miembro-de-la-empresa.json');
      done();
    });
  });

  it('should obtenerTipoInversionData', (done) => {
    const mockData = [{ tipo: 'inv' }];
    httpMock.get.mockReturnValueOnce(of(mockData));
    service.obtenerTipoInversionData().subscribe(data => {
      expect(data).toEqual(mockData);
      expect(httpMock.get).toHaveBeenCalledWith('assets/json/31401/tipo-de-inversion.json');
      done();
    });
  });

  it('should getRequisitosRadioData', (done) => {
    const mockData = [{ label: 'radio', value: 4 }];
    httpMock.get.mockReturnValueOnce(of(mockData));
    service.getRequisitosRadioData().subscribe(data => {
      expect(data).toEqual(mockData);
      expect(httpMock.get).toHaveBeenCalledWith('assets/json/31401/requisitos-radio-data.json');
      done();
    });
  });

  it('should getRegimenAduaneraData', (done) => {
    const mockData = [{ label: 'aduana', value: 5 }];
    httpMock.get.mockReturnValueOnce(of(mockData));
    service.getRegimenAduaneraData().subscribe(data => {
      expect(data).toEqual(mockData);
      expect(httpMock.get).toHaveBeenCalledWith('assets/json/31401/regimen-adunaera.json');
      done();
    });
  });

  it('should propagate error for getTipoDeGarantiaData', (done) => {
    const error = new Error('fail');
    httpMock.get.mockReturnValueOnce(throwError(() => error));
    service.getTipoDeGarantiaData().subscribe({
      next: () => fail('should error'),
      error: (err) => {
        expect(err).toBe(error);
               done();
      }
    });
  });
});