import { TestBed } from '@angular/core/testing';
import { PantallasSvcService } from './pantallas-svc.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Tramite110101Store } from '../estados/tramites/solicitante110101.store';
import { ENVIRONMENT } from '../../../../environments/environment';
import { Solicitante110101State } from '../estados/tramites/solicitante110101.store';
import { JSONResponse } from '@libs/shared/data-access-user/src';

describe('PantallasSvcService', () => {
  let service: PantallasSvcService;
  let httpMock: HttpTestingController;
  let mockStore: jest.Mocked<Tramite110101Store>;

  const MOCK_DATOS: Solicitante110101State = {
    rfc: 'XAXX010101000',
    denominacion: 'Empresa S.A.',
    actividadEconomica: 'Industria',
    correoElectronico: 'correo@empresa.com',
    pais: 'MX',
    tratado: 'TLCAN',
    origen: 'Nacional',
    nombreComercial: 'Comercial SA',
    nombreIngles: 'Commercial Inc.',
    fraccionArancelaria: '1234.56.78',
    descripcion: 'Producto industrial',
    valorTransaccion: '500000',
    entidad: 'CDMX',
    representacion: 'Legal',
    metodoSeparacion: false,
    exportadorAutorizado: false,
    informacionRadios: ''
  };

  beforeEach(() => {
    mockStore = {
      setRfc: jest.fn(),
      setDenominacion: jest.fn(),
      setActividadEconomica: jest.fn(),
      setCorreoElectronico: jest.fn(),
      setPais: jest.fn(),
      setTratado: jest.fn(),
      setOrigen: jest.fn(),
      setNombreComercial: jest.fn(),
      setNombreIngles: jest.fn(),
      setFraccionArancelaria: jest.fn(),
      setDescripcion: jest.fn(),
      setValorTransaccion: jest.fn(),
      setEntidad: jest.fn(),
      setRepresentacion: jest.fn(),
      setMetodoSeparacion: jest.fn(),
      setExportadorAutorizado: jest.fn(),
      setInformacionRadios: jest.fn()
    } as unknown as jest.Mocked<Tramite110101Store>;

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: Tramite110101Store, useValue: mockStore }
      ]
    });

    service = TestBed.inject(PantallasSvcService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call obtenerTramite and return response', () => {
    const MOCK_RESPONSE: JSONResponse = { id: 1, descripcion: 'Trámite', codigo: 'TRAMITE', data: JSON.stringify({ nombre: 'Trámite' }) };
    const ID = 19;

    service.obtenerTramite(ID).subscribe((response) => {
      expect(response).toEqual(MOCK_RESPONSE);
    });

    const req = httpMock.expectOne(`${ENVIRONMENT.URL_SERVER_JSON_AUXILIAR}/${ID}`);
    expect(req.request.method).toBe('GET');
    req.flush(MOCK_RESPONSE);
  });

  it('should throw error if obtenerTramite fails', () => {
    const ID = 99;

    service.obtenerTramite(ID).subscribe({
      error: (err) => {
        expect(err.status).toBe(500);
      }
    });

    const req = httpMock.expectOne(`${ENVIRONMENT.URL_SERVER_JSON_AUXILIAR}/${ID}`);
    req.flush({ message: 'error' }, { status: 500, statusText: 'Server Error' });
  });

  it('should call getConsultaDatos and return state', () => {
    service.getConsultaDatos().subscribe((response) => {
      expect(response).toEqual(MOCK_DATOS);
    });

    const req = httpMock.expectOne('assets/json/110101/consulta-datos.json');
    expect(req.request.method).toBe('GET');
    req.flush(MOCK_DATOS);
  });

  it('should call getCatalogoDatos and return catalogos', () => {
    const MOCK_CATALOG: JSONResponse = { id: 1, descripcion: 'Catálogo', codigo: 'CATALOGO', data: JSON.stringify({ tratado: ['TLCAN'] }) };

    service.getCatalogoDatos().subscribe((response) => {
      expect(response).toEqual(MOCK_CATALOG);
    });

    const req = httpMock.expectOne('assets/json/110101/tratdos-dropdown.json');
    expect(req.request.method).toBe('GET');
    req.flush(MOCK_CATALOG);
  });

  it('should update tramite store with actualizarEstadoFormulario', () => {
    service.actualizarEstadoFormulario(MOCK_DATOS);

    expect(mockStore.setRfc).toHaveBeenCalledWith(MOCK_DATOS.rfc);
    expect(mockStore.setDenominacion).toHaveBeenCalledWith(MOCK_DATOS.denominacion);
    expect(mockStore.setActividadEconomica).toHaveBeenCalledWith(MOCK_DATOS.actividadEconomica);
    expect(mockStore.setCorreoElectronico).toHaveBeenCalledWith(MOCK_DATOS.correoElectronico);
    expect(mockStore.setPais).toHaveBeenCalledWith(MOCK_DATOS.pais);
    expect(mockStore.setTratado).toHaveBeenCalledWith(MOCK_DATOS.tratado);
    expect(mockStore.setOrigen).toHaveBeenCalledWith(MOCK_DATOS.origen);
    expect(mockStore.setNombreComercial).toHaveBeenCalledWith(MOCK_DATOS.nombreComercial);
    expect(mockStore.setNombreIngles).toHaveBeenCalledWith(MOCK_DATOS.nombreIngles);
    expect(mockStore.setFraccionArancelaria).toHaveBeenCalledWith(MOCK_DATOS.fraccionArancelaria);
    expect(mockStore.setDescripcion).toHaveBeenCalledWith(MOCK_DATOS.descripcion);
    expect(mockStore.setValorTransaccion).toHaveBeenCalledWith(MOCK_DATOS.valorTransaccion);
    expect(mockStore.setEntidad).toHaveBeenCalledWith(MOCK_DATOS.entidad);
    expect(mockStore.setRepresentacion).toHaveBeenCalledWith(MOCK_DATOS.representacion);
    expect(mockStore.setMetodoSeparacion).toHaveBeenCalledWith(MOCK_DATOS.metodoSeparacion);
    expect(mockStore.setExportadorAutorizado).toHaveBeenCalledWith(MOCK_DATOS.exportadorAutorizado);
    expect(mockStore.setInformacionRadios).toHaveBeenCalledWith(MOCK_DATOS.informacionRadios);
  });
});
