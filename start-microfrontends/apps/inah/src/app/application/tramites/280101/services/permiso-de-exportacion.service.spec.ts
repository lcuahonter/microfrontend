import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PermisoDeExportacionService } from './permiso-de-exportacion.service';
import { Tramite280101Store } from '../../../estados/tramite/tramite280101.store';

describe('PermisoDeExportacionService', () => {
  let service: PermisoDeExportacionService;
  let httpMock: HttpTestingController;
  let tramiteStoreMock: any;

  beforeEach(() => {
    tramiteStoreMock = {
      setModalidad: jest.fn(),
      setExposicionOpcion: jest.fn(),
      setNombre: jest.fn(),
      setCantMonumentos: jest.fn(),
      setAduana: jest.fn(),
      setAduanaEntrada: jest.fn(),
      setPais: jest.fn(),
      setDescripcionClobGenerica: jest.fn(),
      setMunicipioOAlcadia: jest.fn(),
      setLocalidad: jest.fn(),
      setCodigoPostal: jest.fn(),
      setEstado: jest.fn(),
      setColonia: jest.fn(),
      setCalle: jest.fn(),
      setNumeroExterior: jest.fn(),
      setNumeroInterior: jest.fn(),
      setMonumento: jest.fn()
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: Tramite280101Store, useValue: tramiteStoreMock }
      ]
    });

    service = TestBed.inject(PermisoDeExportacionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should getAduana and return Catalogo', () => {
    const mockResponse = { id: 1, descripcion: 'Aduana' };
    service.getAduana().subscribe((data) => {
      expect(data).toEqual(mockResponse);
    });
    const req = httpMock.expectOne('assets/json/120204/entidad-federativa.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should getPermisoExportacion and return Solicitud280101State', () => {
    const mockResponse = { nombre: 'Juan' };
    service.getPermisoExportacion().subscribe((data) => {
      expect(data).toEqual(mockResponse);
    });
    const req = httpMock.expectOne('assets/json/280101/permiso-exportacion.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should call all store methods with correct values in setDatosFormulario', () => {
    const datos: any = {
      modalidadOpcion: 'mod1',
      exposicionOpcion: 'expo1',
      nombre: 'Juan',
      cantMonumentos: 2,
      aduana: 'aduana1',
      aduanaEntrada: 'entrada1',
      pais: 'MX',
      descripcionClobGenerica: 'desc',
      municipioOAlcadia: 'mun',
      localidad: 'loc',
      codigoPostal: '12345',
      estado: 'CDMX',
      colonia: 'col',
      calle: 'calle',
      numeroExterior: '10',
      numeroInterior: '20',
      monumentoTablaDatos: [{ id: 1, titulo: 'Monumento 1' }]
    };

    service.setDatosFormulario(datos);

    expect(tramiteStoreMock.setModalidad).toHaveBeenCalledWith('mod1');
    expect(tramiteStoreMock.setExposicionOpcion).toHaveBeenCalledWith('expo1');
    expect(tramiteStoreMock.setNombre).toHaveBeenCalledWith('Juan');
    expect(tramiteStoreMock.setCantMonumentos).toHaveBeenCalledWith(2);
    expect(tramiteStoreMock.setAduana).toHaveBeenCalledWith('aduana1');
    expect(tramiteStoreMock.setAduanaEntrada).toHaveBeenCalledWith('entrada1');
    expect(tramiteStoreMock.setPais).toHaveBeenCalledWith('MX');
    expect(tramiteStoreMock.setDescripcionClobGenerica).toHaveBeenCalledWith('desc');
    expect(tramiteStoreMock.setMunicipioOAlcadia).toHaveBeenCalledWith('mun');
    expect(tramiteStoreMock.setLocalidad).toHaveBeenCalledWith('loc');
    expect(tramiteStoreMock.setCodigoPostal).toHaveBeenCalledWith('12345');
    expect(tramiteStoreMock.setEstado).toHaveBeenCalledWith('CDMX');
    expect(tramiteStoreMock.setColonia).toHaveBeenCalledWith('col');
    expect(tramiteStoreMock.setCalle).toHaveBeenCalledWith('calle');
    expect(tramiteStoreMock.setNumeroExterior).toHaveBeenCalledWith('10');
    expect(tramiteStoreMock.setNumeroInterior).toHaveBeenCalledWith('20');
    expect(tramiteStoreMock.setMonumento).toHaveBeenCalledWith({ id: 1, titulo: 'Monumento 1' });
  });
});
