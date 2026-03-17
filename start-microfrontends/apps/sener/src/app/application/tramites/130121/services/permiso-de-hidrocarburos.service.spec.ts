import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PermisoDeHidrocarburosService } from './permiso-de-hidrocarburos.service';
import { ProductoResponse, Pais } from '../../../shared/constantes/vehiculos-adaptados.enum';

describe('PermisoDeHidrocarburosService', () => {
  let service: PermisoDeHidrocarburosService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PermisoDeHidrocarburosService],
    });

    service = TestBed.inject(PermisoDeHidrocarburosService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve lista de países disponibles', (done) => {
    const mockPaises: Pais[] = [{ id: 1, descripcion: 'México' }];

    service.getListaDePaisesDisponibles().subscribe((paises) => {
      expect(paises).toEqual(mockPaises);
      done();
    });

    const req = httpMock.expectOne('/assets/json/130121/pais-procenia.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockPaises);
  });

  it('should retrieve lista de países por bloque', (done) => {
    const mockPaises: Pais[] = [{ id: 2, descripcion: 'Brasil' }];

    service.getPaisesPorBloque(1).subscribe((paises) => {
      expect(paises).toEqual(mockPaises);
      done();
    });

    const req = httpMock.expectOne('/assets/json/130121/paises-por-bloque.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockPaises);
  });

  it('should retrieve lista de entidades federativas', (done) => {
    const mockEntidades: Pais[] = [{ id: 1, descripcion: 'Jalisco' }];

    service.getEstado().subscribe((estado) => {
      expect(estado).toEqual(mockEntidades);
      done();
    });

    const req = httpMock.expectOne('/assets/json/130121/estado.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockEntidades);
  });

  it('should retrieve lista de representaciones federales', (done) => {
    const mockRepresentaciones: Pais[] = [{ id: 1, descripcion: 'Representación A' }];

    service.getRepresentacionFederal().subscribe((representaciones) => {
      expect(representaciones).toEqual(mockRepresentaciones);
      done();
    });

    const req = httpMock.expectOne('/assets/json/130121/representacion-federal.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockRepresentaciones);
  });

  it('should retrieve solicitud options', (done) => {
    const mockResponse: ProductoResponse = {
      options: [
        { label: 'Solicitud A', value: 'Solicitud A' },
        { label: 'Solicitud B', value: 'Solicitud B' }
      ],
      defaultSelect: 'Solicitud A'
    };

    service.getSolicitudeOptions().subscribe((response) => {
      expect(response).toEqual(mockResponse);
      done();
    });

    const req = httpMock.expectOne('assets/json/130121/solicitude-options.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should retrieve producto options', (done) => {
    const mockResponse: ProductoResponse = {
      options: [
        { label: 'Largo plazo (5 años)', value: 'Largo plazo (5 años)' },
        { label: 'Corto plazo (60 días o 1 año)', value: 'Corto plazo (60 días o 1 año)' }
      ],
      defaultSelect: 'Largo plazo (5 años)'
    };

    service.getProductoOptions().subscribe((response) => {
      expect(response).toEqual(mockResponse);
      done();
    });

    const req = httpMock.expectOne('assets/json/130121/plazo-options.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});
