import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SolicitudPantallasService } from './solicitud-pantallas.service';
import { CatalogosSelect } from '@ng-mf/data-access-user';
import { CargarDatosIniciales, DatosDelTramiteRealizar } from '../models/pantallas-captura.model';

describe('SolicitudPantallasService', () => {
  let service: SolicitudPantallasService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SolicitudPantallasService],
    });

    service = TestBed.inject(SolicitudPantallasService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); 
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch data for getDataResponsableInspeccion', () => {
    const mockResponse = {
      tipoContenedor: {
        labelNombre: 'Contenedor A',
        required: true,
        primerOpcion: 'Seleccione un contenedor'
      } as CatalogosSelect,
    };

    service.getDataResponsableInspeccion().subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('../../../assets/json/220502/solicitud-pantallas-mock-data.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});
