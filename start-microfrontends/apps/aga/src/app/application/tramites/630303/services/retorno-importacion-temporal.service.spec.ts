import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RetornoImportacionTemporalService } from './retorno-importacion-temporal.service';
import { Catalogo } from '@libs/shared/data-access-user/src';

describe('RetornoImportacionTemporalService', () => {
  let servicio: RetornoImportacionTemporalService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RetornoImportacionTemporalService],
    });

    servicio = TestBed.inject(RetornoImportacionTemporalService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería crear el servicio', () => {
    expect(servicio).toBeTruthy();
  });

  it('debería obtener los datos de sección aduanera', () => {
    const DATOS_MOCK: Catalogo[] = [{ id: 1, descripcion: 'Sección 1' }];

    servicio.getSeccionAduanera().subscribe((datos) => {
      expect(datos).toEqual(DATOS_MOCK);
    });

    const REQ = httpMock.expectOne('/assets/json/630303/seccion-aduanera.json');
    expect(REQ.request.method).toBe('GET');
    REQ.flush(DATOS_MOCK);
  });

  it('debería obtener los datos de aduana de ingreso', () => {
    const DATOS_MOCK: Catalogo[] = [{ id: 2, descripcion: 'Aduana 1' }];

    servicio.getAduanaDeIngreso().subscribe((datos) => {
      expect(datos).toEqual(DATOS_MOCK);
    });

    const REQ = httpMock.expectOne('/assets/json/630303/aduana-de-ingreso.json');
    expect(REQ.request.method).toBe('GET');
    REQ.flush(DATOS_MOCK);
  });

  it('debería obtener los datos de prórroga', () => {
    const DATOS_MOCK: Catalogo[] = [{ id: 3, descripcion: 'Prórroga 1' }];

    servicio.getProrroga().subscribe((datos) => {
      expect(datos).toEqual(DATOS_MOCK);
    });

    const REQ = httpMock.expectOne('/assets/json/630303/prorroga.json');
    expect(REQ.request.method).toBe('GET');
    REQ.flush(DATOS_MOCK);
  });

  it('debería obtener los datos de propietario', () => {
    const DATOS_MOCK: Catalogo[] = [{ id: 4, descripcion: 'Propietario 1' }];

    servicio.getPropietario().subscribe((datos) => {
      expect(datos).toEqual(DATOS_MOCK);
    });

    const REQ = httpMock.expectOne('/assets/json/630303/propietario.json');
    expect(REQ.request.method).toBe('GET');
    REQ.flush(DATOS_MOCK);
  });

  it('debería obtener los datos de tipo de propietario', () => {
    const DATOS_MOCK: Catalogo[] = [{ id: 5, descripcion: 'Tipo Propietario 1' }];

    servicio.getTipoDePropietario().subscribe((datos) => {
      expect(datos).toEqual(DATOS_MOCK);
    });

    const REQ = httpMock.expectOne('/assets/json/630303/tipo-de-propietario.json');
    expect(REQ.request.method).toBe('GET');
    REQ.flush(DATOS_MOCK);
  });

  it('debería obtener los datos de país', () => {
    const DATOS_MOCK: Catalogo[] = [{ id: 6, descripcion: 'País 1' }];

    servicio.getPais().subscribe((datos) => {
      expect(datos).toEqual(DATOS_MOCK);
    });

    const REQ = httpMock.expectOne('/assets/json/630303/pais.json');
    expect(REQ.request.method).toBe('GET');
    REQ.flush(DATOS_MOCK);
  });
});