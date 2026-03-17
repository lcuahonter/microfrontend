import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProsecModificacionServiceTsService } from './prosec-modificacion.service';
import { Tramite90305Store } from '../estados/tramite90305.store';
import { Tramite90305State } from '../estados/tramite90305.store';
import { CatalogoResponse } from '@ng-mf/data-access-user';

describe('ProsecModificacionServiceTsService', () => {
  let service: ProsecModificacionServiceTsService;
  let httpMock: HttpTestingController;
  let tramiteStoreMock: jest.Mocked<Tramite90305Store>;

  beforeEach(() => {
    tramiteStoreMock = {
      setSelectedEstado: jest.fn(),
      setRegistroFederalContribuyentes: jest.fn(),
      setRepresentacionFederal: jest.fn(),
      setTipoModificacion: jest.fn(),
      setModificacionPrograma: jest.fn(),
    } as any;

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: Tramite90305Store, useValue: tramiteStoreMock },
      ],
    });

    service = TestBed.inject(ProsecModificacionServiceTsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // ensures no outstanding requests
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch lista de domicilios', () => {
    const mockResponse = [{ id: 1 }] as any;
    service.getListaDomicilios().subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('assets/json/90305/lista-de-domicilios.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch plantas', () => {
    const mockResponse = [{ calle: 'Av 1' }] as any;
    service.getPlantaComplementaria().subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('assets/json/90305/plantas.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch mercancias', () => {
    const mockResponse = [{ nombre: 'Mercancia 1' }] as any;
    service.getMercancias().subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('assets/json/90305/mercancias.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch sector', () => {
    const mockResponse = [{ sector: 'Químico' }] as any;
    service.getSector().subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('assets/json/90305/sector.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch producto indirecto', () => {
    const mockResponse = [{ nombre: 'Empresa A' }] as any;
    service.getProductoIndirecto().subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('assets/json/90305/prodIndirecto.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch bitacora', () => {
    const mockResponse = [{ mensaje: 'Registro creado' }] as any;
    service.getBitacora().subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('assets/json/90305/bitacora.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch modificacion info', () => {
    const mockResponse = { descripcion: 'Mod info' } as any;
    service.getModoficacionInfo().subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('assets/json/90305/modificacionInfo.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch estado catalogo', () => {
    const mockResponse: CatalogoResponse[] = [{ id: 1, descripcion: 'Estado 1' }];
    service.getEstadoData().subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('assets/json/90305/estado.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should call setSelectedEstado if selectedEstado is present', () => {
    const mockState: Tramite90305State = { 
      selectedEstado: 'AGS',
      registroFederalContribuyentes: '',
      representacionFederal: '',
      tipoModificacion: '',
      modificacionPrograma: ''
    };
    service.actualizarEstadoFormulario(mockState);
    expect(tramiteStoreMock.setSelectedEstado).toHaveBeenCalledWith('AGS');
  });

  it('should not call setSelectedEstado if selectedEstado is empty', () => {
    const mockState: Tramite90305State = { 
      selectedEstado: '',
      registroFederalContribuyentes: '',
      representacionFederal: '',
      tipoModificacion: '',
      modificacionPrograma: ''
    };
    service.actualizarEstadoFormulario(mockState);
    expect(tramiteStoreMock.setSelectedEstado).not.toHaveBeenCalled();
  });

  it('should fetch registro toma muestras', () => {
    const mockResponse = { selectedEstado: 'JAL' };
    service.getRegistroTomaMuestrasMercanciasData().subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('assets/json/90305/registro_toma_muestras_mercancias.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});
