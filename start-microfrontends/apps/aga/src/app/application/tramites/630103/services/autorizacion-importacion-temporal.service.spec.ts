import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AutorizacionImportacionTemporalService } from './autorizacion-importacion-temporal.service';
import { Tramite630103Store } from '../estados/tramite630103.store';
import { Catalogo, RespuestaCatalogos } from '@libs/shared/data-access-user/src/core/models/shared/catalogos.model';

describe('AutorizacionImportacionTemporalService', () => {
  let service: AutorizacionImportacionTemporalService;
  let httpMock: HttpTestingController;
  let tramite630103Store: Tramite630103Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AutorizacionImportacionTemporalService, Tramite630103Store],
    });
    service = TestBed.inject(AutorizacionImportacionTemporalService);
    httpMock = TestBed.inject(HttpTestingController);
    tramite630103Store = TestBed.inject(Tramite630103Store);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get seccion aduanera', () => {
    const mockData: Catalogo[] = [{ id: 1, descripcion: 'Aduana 1' }];
    service.getSeccionAduanera().subscribe(data => {
      expect(data).toEqual(mockData);
    });
    const req = httpMock.expectOne('/assets/json/630103/seccion-aduanera.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should get aduana de ingreso', () => {
    const mockData: Catalogo[] = [{ id: 2, descripcion: 'Ingreso 1' }];
    service.getAduanaDeIngreso().subscribe(data => {
      expect(data).toEqual(mockData);
    });
    const req = httpMock.expectOne('/assets/json/630103/aduana-de-ingreso.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should get propietario', () => {
    const mockData: Catalogo[] = [{ id: 3, descripcion: 'Propietario 1' }];
    service.getPropietario().subscribe(data => {
      expect(data).toEqual(mockData);
    });
    const req = httpMock.expectOne('/assets/json/630103/propietario.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should get tipo de propietario', () => {
    const mockData: Catalogo[] = [{ id: 4, descripcion: 'Tipo 1' }];
    service.getTipoDePropietario().subscribe(data => {
      expect(data).toEqual(mockData);
    });
    const req = httpMock.expectOne('/assets/json/630103/tipo-de-propietario.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should get pais', () => {
    const mockData: Catalogo[] = [{ id: 5, descripcion: 'Pais 1' }];
    service.getPais().subscribe(data => {
      expect(data).toEqual(mockData);
    });
    const req = httpMock.expectOne('/assets/json/630103/pais.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should obtener documentos seleccionados', () => {
    const mockData: RespuestaCatalogos = { code: 200, data: [], message: 'OK' };
    service.obtenerDocumentosSeleccionados().subscribe(data => {
      expect(data).toEqual(mockData);
    });
    const req = httpMock.expectOne('assets/json/630103/documentos-seleccionados.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should actualizar estado formulario', () => {
    const spy = jest.spyOn(tramite630103Store, 'setTramite630103State');
    const datos = { campo1: 'valor1', campo2: 'valor2' } as any;
    service.actualizarEstadoFormulario(datos);
    expect(spy).toHaveBeenCalledWith('campo1', 'valor1');
    expect(spy).toHaveBeenCalledWith('campo2', 'valor2');
  });

  it('should get registro toma muestras mercancias data', () => {
    const mockData = { campo: 'valor' };
    service.getRegistroTomaMuestrasMercanciasData().subscribe(data => {
      expect(data).toEqual(mockData);
    });
    const req = httpMock.expectOne('assets/json/630103/registro_toma_muestras_mercancias.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });
});