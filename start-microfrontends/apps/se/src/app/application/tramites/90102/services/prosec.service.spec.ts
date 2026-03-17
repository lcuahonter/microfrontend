import { TestBed } from '@angular/core/testing';
import { ProsecService } from './prosec.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AutorizacionProsecStore, ProsecState } from '../estados/autorizacion-prosec.store';
import { RespuestaCatalogos } from '@libs/shared/data-access-user/src';

describe('ProsecService', () => {
  let service: ProsecService;
  let httpMock: HttpTestingController;
  let storeMock: jest.Mocked<AutorizacionProsecStore>;
  
  beforeEach(() => {
    storeMock = {
      setModalidad: jest.fn(),
      setEstadoSeleccionar: jest.fn(),
      setRepresentacionFederalLista: jest.fn(),
      setActividadProductiva: jest.fn(),
      setSector: jest.fn(),
      setFraccionArancelaria: jest.fn(),
      setcontribuyentes: jest.fn(),
      setFormaValida: jest.fn(),
    } as unknown as jest.Mocked<AutorizacionProsecStore>;

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ProsecService,
        { provide: AutorizacionProsecStore, useValue: storeMock }
      ]
    });
    service = TestBed.inject(ProsecService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debe ser creado', () => {
    expect(service).toBeTruthy();
  });

  describe('obtenerMenuDesplegable', () => {
    it('debe retornar Catalogo[] de response.data', () => {
      const fileName = 'bancos.json';
      const mockResponse: RespuestaCatalogos = {
        code: 200,
        message: 'OK',
        data: [
          { id: 1, descripcion: 'Banco A' },
          { id: 2, descripcion: 'Banco B' }
        ]
      };

      service.obtenerMenuDesplegable(fileName).subscribe(data => {
        expect(data).toEqual(mockResponse.data);
      });

      const req = httpMock.expectOne(`../../../../../assets/json/90102/${fileName}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('obtenerTablaDatos', () => {
    it('debe retornar los datos de la tabla como Record<string, unknown>[]', () => {
      const fileName = 'tabla.json';
      const mockData = [
        { clave: 'A1', valor: 'Item 1' },
        { clave: 'A2', valor: 'Item 2' }
      ];

      service.obtenerTablaDatos(fileName).subscribe(data => {
        expect(data).toEqual(mockData);
      });

      const req = httpMock.expectOne(`../../../../../assets/json/90102/${fileName}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockData);
    });
  });

  describe('actualizarEstadoFormulario', () => {
    it('debe llamar a todos los setters del store con los valores correctos', () => {
      const mockState: ProsecState = {
        modalidad: 'modalidadA',
        Estado: 'EstadoB',
        RepresentacionFederal: 'RepFedC',
        ActividadProductiva: 'ProdD',
        Sector: 'SectorE',
        Fraccion_arancelaria: 'FA123',
        contribuyentes: 'RFC123',
        formaValida: 'true'
      };

      service.actualizarEstadoFormulario(mockState);

      expect(storeMock.setModalidad).toHaveBeenCalledWith(mockState.modalidad);
      expect(storeMock.setEstadoSeleccionar).toHaveBeenCalledWith(mockState.Estado);
      expect(storeMock.setRepresentacionFederalLista).toHaveBeenCalledWith(mockState.RepresentacionFederal);
      expect(storeMock.setActividadProductiva).toHaveBeenCalledWith(mockState.ActividadProductiva);
      expect(storeMock.setSector).toHaveBeenCalledWith(mockState.Sector);
      expect(storeMock.setFraccionArancelaria).toHaveBeenCalledWith(mockState.Fraccion_arancelaria);
      expect(storeMock.setcontribuyentes).toHaveBeenCalledWith(mockState.contribuyentes);
      expect(storeMock.setFormaValida).toHaveBeenCalledWith(mockState.formaValida);
    });
  });
});
