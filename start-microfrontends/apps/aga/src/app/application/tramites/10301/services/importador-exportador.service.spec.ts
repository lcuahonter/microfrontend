import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ImportadorExportadorService } from './importador-exportador.service';
import { Tramite10301Store } from '../../10301/estados/tramite10301.store';
import { RespuestaCatalogos } from '@libs/shared/data-access-user/src';
import { RespuestaMercancia } from '../models/importador-exportador.model';

describe('ImportadorExportadorService', () => {
  let service: ImportadorExportadorService;
  let httpMock: HttpTestingController;
  let store: Tramite10301Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ImportadorExportadorService, Tramite10301Store]
    });

    service = TestBed.inject(ImportadorExportadorService);
    httpMock = TestBed.inject(HttpTestingController);
    store = TestBed.inject(Tramite10301Store);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should getAduanaIngresara', () => {
    const mockResponse: RespuestaCatalogos = {
      data: [{ id: 1, descripcion: 'Aduana 1' }],
      code: 0,
      message: ''
    };
    service.getAduanaIngresara().subscribe(response => {
      expect(response).toEqual(mockResponse);
    });
    const req = httpMock.expectOne('assets/json/10301/aduanaIngresara.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should getAno', () => {
    const mockResponse: RespuestaCatalogos = {
      data: [{ id: 1, descripcion: '2021' }],
      code: 0,
      message: ''
    };
    service.getAno().subscribe(response => {
      expect(response).toEqual(mockResponse);
    });
    const req = httpMock.expectOne('assets/json/10301/ano.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should getCondicion', () => {
    const mockResponse: RespuestaCatalogos = {
      data: [{ id: 1, descripcion: 'Nuevo' }],
      code: 0,
      message: ''
    };
    service.getCondicion().subscribe(response => {
      expect(response).toEqual(mockResponse);
    });
    const req = httpMock.expectOne('assets/json/10301/condicion.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should getPais', () => {
    const mockResponse: RespuestaCatalogos = {
      data: [{ id: 1, descripcion: 'México' }],
      code: 0,
      message: ''
    };
    service.getPais().subscribe(response => {
      expect(response).toEqual(mockResponse);
    });
    const req = httpMock.expectOne('assets/json/10301/pais.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should getFinesDeMercancia', () => {
    const mockResponse: RespuestaCatalogos = {
      data: [{ id: 1, descripcion: 'F1' }],
      code: 0,
      message: ''
    };
    service.getFinesDeMercancia().subscribe(response => {
      expect(response).toEqual(mockResponse);
    });
    const req = httpMock.expectOne('assets/json/10301/fines.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should getTipoDocumento and update store', () => {
    const mockResponse: RespuestaCatalogos = {
      data: [{ id: 1, descripcion: 'Pasaporte' }],
      code: 0,
      message: ''
    };
    const spy = jest.spyOn(store, 'setTipoDocumento');
    service.getTipoDocumento().subscribe(response => {
      expect(response).toEqual(mockResponse);
      expect(spy).toHaveBeenCalledWith(mockResponse.data);
    });
    const req = httpMock.expectOne('assets/json/10301/tipodocumento.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should run #getFinesDeMercancia()', () => {
    const mockResponse: RespuestaCatalogos = {
      data: [
        { id: 1, descripcion: 'Fin 1' },
        { id: 2, descripcion: 'Fin 2' }
      ],
      code: 0,
      message: ''
    };

    service.getFinesDeMercancia().subscribe((response: RespuestaCatalogos) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('assets/json/10301/fines.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should run #getDocumentos()', () => {
    const mockResponse: RespuestaCatalogos = {
      data: [
        { id: 1, descripcion: 'Documento 1' },
        { id: 2, descripcion: 'Documento 2' }
      ],
      code: 0,
      message: ''
    };

    const spy = jest.spyOn(store, 'setDocumentos');

    service.getDocumentos().subscribe((response: RespuestaCatalogos) => {
      expect(response).toEqual(mockResponse);
      expect(spy).toHaveBeenCalledWith(mockResponse.data);
    });
    const req = httpMock.expectOne('assets/json/10301/documentos.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should agregarMercancia', () => {
    const mockResponse: RespuestaMercancia = {
      code: 0,
      message: '',
      data: [{ id: 1, descripcion: 'Mercancia 1' }]
    } as any;
    service.agregarMercancia().subscribe(response => {
      expect(response).toEqual(mockResponse);
    });
    const req = httpMock.expectOne('assets/json/10301/mercancia-table.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});