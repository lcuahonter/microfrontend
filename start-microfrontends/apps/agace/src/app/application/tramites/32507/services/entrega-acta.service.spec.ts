import { TestBed } from '@angular/core/testing';
import { EntregaActaService } from './entrega-acta.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import {
  AvisoTablaDatos,
  CatalogoLista,
  DatosSolicitante
} from '../models/aviso-traslado.model';

describe('EntregaActaService', () => {
  let service: EntregaActaService;
  let httpClientMock: jest.Mocked<HttpClient>;

  beforeEach(() => {
    const httpClientSpy = {
      get: jest.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        EntregaActaService,
        { provide: HttpClient, useValue: httpClientSpy }
      ]
    });

    service = TestBed.inject(EntregaActaService);
    httpClientMock = TestBed.inject(HttpClient) as jest.Mocked<HttpClient>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch datos del solicitante', (done) => {
    const mockDatos: DatosSolicitante = {
        rfc: 'GARC850101XZ1',
        denominacion: '',
        actividadEconomica: '',
        correoElectronico: '',
        pais: '',
        codigoPostal: '',
        entidadFederativa: '',
        municipio: '',
        localidad: '',
        colonia: '',
        calle: '',
        nExt: '',
        nInt: '',
        lada: '',
        telefono: '',
        adace: ''
    };

    httpClientMock.get.mockReturnValue(of(mockDatos));

    service.obtenerDatosSolicitante().subscribe((res) => {
      expect(res).toEqual(mockDatos);
      expect(httpClientMock.get).toHaveBeenCalledWith(
        'assets/json/32507/datosSolicitante.json'
      );
      done();
    });
  });

  it('should fetch aviso tabla', (done) => {
    const mockAviso: AvisoTablaDatos = {
      datos: [
        {
            descripcion: 'Producto A', cantidad: "20",
            idTransaccionVUCEM: '',
            pesoKg: '',
            descripcionUnidadMedida: ''
        },
        {
            descripcion: 'Producto B', cantidad: "10",
            idTransaccionVUCEM: '',
            pesoKg: '',
            descripcionUnidadMedida: ''
        }
      ]
    };

    httpClientMock.get.mockReturnValue(of(mockAviso));

    service.obtenerAvisoTabla().subscribe((res) => {
      expect(res).toEqual(mockAviso);
      expect(httpClientMock.get).toHaveBeenCalledWith(
        'assets/json/32507/aviso-tabla.json'
      );
      done();
    });
  });

  it('should fetch levanta acta catalog', (done) => {
    const mockCatalog: CatalogoLista = {
      datos: [{
          descripcion: 'Ciudad de México',
          id: 0
      }]
    };

    httpClientMock.get.mockReturnValue(of(mockCatalog));

    service.obtenerLevantaActa().subscribe((res) => {
      expect(res).toEqual(mockCatalog);
      expect(httpClientMock.get).toHaveBeenCalledWith(
        'assets/json/32507/levanta-acta.json'
      );
      done();
    });
  });

  it('should fetch unidad de medida catalog', (done) => {
    const mockUnidad: CatalogoLista = {
      datos: [{
          descripcion: 'Kilogramo',
          id: 0
      }]
    };

    httpClientMock.get.mockReturnValue(of(mockUnidad));

    service.obtenerUnidadMedida().subscribe((res) => {
      expect(res).toEqual(mockUnidad);
      expect(httpClientMock.get).toHaveBeenCalledWith(
        'assets/json/32507/entidad-federativa.json'
      );
      done();
    });
  });
});
