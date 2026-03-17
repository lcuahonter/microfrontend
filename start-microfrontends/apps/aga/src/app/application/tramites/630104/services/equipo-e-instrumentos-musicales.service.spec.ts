import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EquipoEInstrumentosMusicalesService } from './equipo-e-instrumentos-musicales.service';
import { Catalogo } from '@ng-mf/data-access-user';

describe('EquipoEInstrumentosMusicalesService', () => {
  let service: EquipoEInstrumentosMusicalesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EquipoEInstrumentosMusicalesService],
    });
    service = TestBed.inject(EquipoEInstrumentosMusicalesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('debería obtener la sección aduanera', () => {
    const mockData: Catalogo[] = [{ id: 3, descripcion: 'Sección 1' }];
    service.getSeccionAduanera().subscribe((data) => {
      expect(data).toEqual(mockData);
    });
    const req = httpMock.expectOne('/assets/json/630104/seccion-aduanera.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('debería obtener la aduana de ingreso', () => {
    const mockData: Catalogo[] = [{ id: 4, descripcion: 'Aduana 1' }];
    service.getAduanaDeIngreso().subscribe((data) => {
      expect(data).toEqual(mockData);
    });
    const req = httpMock.expectOne('/assets/json/630104/aduana-de-ingreso.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('debería obtener el propietario', () => {
    const mockData: Catalogo[] = [{ id: 6, descripcion: 'Propietario 1' }];
    service.getPropietario().subscribe((data) => {
      expect(data).toEqual(mockData);
    });
    const req = httpMock.expectOne('/assets/json/630104/propietario.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('debería obtener el tipo de propietario', () => {
    const mockData: Catalogo[] = [{ id: 7, descripcion: 'Tipo 1' }];
    service.getTipoDePropietario().subscribe((data) => {
      expect(data).toEqual(mockData);
    });
    const req = httpMock.expectOne('/assets/json/630104/tipo-de-propietario.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('debería obtener la información al consultar por RFC', () => {
    const mockData: Catalogo[] = [{ id: 8, descripcion: 'RFC 1' }];
    service.getconsultarPorRFC().subscribe((data) => {
      expect(data).toEqual(mockData);
    });
    const req = httpMock.expectOne('/assets/json/630104/consultar-por-rfc.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('debería obtener el tipo de representante', () => {
    const mockData: Catalogo[] = [{ id: 9, descripcion: 'Representante 1' }];
    service.getTipoDeRepresentante().subscribe((data) => {
      expect(data).toEqual(mockData);
    });
    const req = httpMock.expectOne('/assets/json/630104/tipo-de-representante.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('debería obtener el país', () => {
    const mockData: Catalogo[] = [{ id: 10, descripcion: 'País 1' }];
    service.getPais().subscribe((data) => {
      expect(data).toEqual(mockData);
    });
    const req = httpMock.expectOne('/assets/json/630104/pais.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });
});
