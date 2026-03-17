import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { ImportacionProductosService } from '../services/importacion-productos.service';
import { Tramite260101State } from '../estados/tramite260101Store.store';
jest.mock('@angular/common/http');

describe('ImportacionProductosService', () => {
  let service: ImportacionProductosService;
  let httpClientMock: jest.Mocked<HttpClient>;

  beforeEach(() => {
    httpClientMock = { get: jest.fn() } as any;

    TestBed.configureTestingModule({
      providers: [
        ImportacionProductosService,
        { provide: HttpClient, useValue: httpClientMock }
      ]
    });

    service = TestBed.inject(ImportacionProductosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call http.get with correct URL and return observable for getRegistroTomaMuestrasMercanciasData', (done) => {
    const mockData: Tramite260101State = { campo: 'valor' } as any;
    httpClientMock.get.mockReturnValue(of(mockData));
    service.getRegistroTomaMuestrasMercanciasData().subscribe(data => {
      expect(httpClientMock.get).toHaveBeenCalledWith('assets/json/260101/respuestaDeActualizacionDe.json');
      expect(data).toEqual(mockData);
      done();
    });
  });

  it('should get fabricante data from correct URL', (done) => {
    const mockFabricantes = [{ id: 1, nombre: 'Fabricante1' }];
    httpClientMock.get.mockReturnValue(of(mockFabricantes));
    service.getFabricanteTablaDatos().subscribe(data => {
      expect(httpClientMock.get).toHaveBeenCalledWith('assets/json/260101/fabricante.json');
      expect(data).toEqual(mockFabricantes);
      done();
    });
  });

  it('should get destinatario data from correct URL', (done) => {
    const mockDestinatarios = [{ id: 2, nombre: 'Destinatario1' }];
    httpClientMock.get.mockReturnValue(of(mockDestinatarios));
    service.getDestinatarioTablaDatos().subscribe(data => {
      expect(httpClientMock.get).toHaveBeenCalledWith('assets/json/260101/destinatario-final.json');
      expect(data).toEqual(mockDestinatarios);
      done();
    });
  });

  it('should get proveedor data from correct URL', (done) => {
    const mockProveedores = [{ id: 3, nombre: 'Proveedor1' }];
    httpClientMock.get.mockReturnValue(of(mockProveedores));
    service.getProveedorTablaDatos().subscribe(data => {
      expect(httpClientMock.get).toHaveBeenCalledWith('assets/json/260101/proveedor.json');
      expect(data).toEqual(mockProveedores);
      done();
    });
  });

  it('should get facturador data from correct URL', (done) => {
    const mockFacturadores = [{ id: 4, nombre: 'Facturador1' }];
    httpClientMock.get.mockReturnValue(of(mockFacturadores));
    service.getFacturadorTablaDatos().subscribe(data => {
      expect(httpClientMock.get).toHaveBeenCalledWith('assets/json/260101/facturador.json');
      expect(data).toEqual(mockFacturadores);
      done();
    });
  });
});