import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { ImportacionVehiculosUsadosDonacionService } from './importacion-vehiculos-usados-donacion.service';
import { Tramite130105Store } from '../../../estados/tramites/tramites130105.store';
import { Tramite130105Query } from '../../../estados/queries/tramite130105.query';
import { CatalogoServices, JSONResponse } from '@ng-mf/data-access-user';
import { PROC_130105 } from '../servers/api-route';

describe('ImportacionVehiculosUsadosDonacionService', () => {
    let service: ImportacionVehiculosUsadosDonacionService;
    let httpMock: HttpTestingController;
    let mockStore: jest.Mocked<Tramite130105Store>;
    let mockQuery: jest.Mocked<Tramite130105Query>;
    let mockCatalogoServices: jest.Mocked<CatalogoServices>;

    beforeEach(() => {
        const storeSpy = {
            actualizarEstado: jest.fn(),
            setIdSolicitud: jest.fn()
        } as Partial<jest.Mocked<Tramite130105Store>>;

        const querySpy = {
            selectSolicitud$: of({})
        } as jest.Mocked<Tramite130105Query>;

        const catalogoSpy = {
            regimenesCatalogo: jest.fn(() => of()),
            clasificacionRegimenCatalogo: jest.fn(() => of()),
            fraccionesArancelariasCatalogo: jest.fn(() => of()),
            unidadesMedidaTarifariaCatalogo: jest.fn(() => of()),
            entidadesFederativasCatalogo: jest.fn(() => of()),
            representacionFederalCatalogo: jest.fn(() => of()),
            todosPaisesSeleccionados: jest.fn(() => of()),
            tratadosAcuerdoCatalogo: jest.fn(() => of()),
            getpaisesBloqueCatalogo: jest.fn(() => of())
        } as any;

        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                ImportacionVehiculosUsadosDonacionService,
                { provide: Tramite130105Store, useValue: storeSpy },
                { provide: Tramite130105Query, useValue: querySpy },
                { provide: CatalogoServices, useValue: catalogoSpy }
            ]
        });

        service = TestBed.inject(ImportacionVehiculosUsadosDonacionService);
        httpMock = TestBed.inject(HttpTestingController);
        mockStore = TestBed.inject(Tramite130105Store) as jest.Mocked<Tramite130105Store>;
        mockQuery = TestBed.inject(Tramite130105Query) as jest.Mocked<Tramite130105Query>;
        mockCatalogoServices = TestBed.inject(CatalogoServices) as jest.Mocked<CatalogoServices>;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });


    it('should return observable from query', () => {
        const result = service.getAllState();
        expect(result).toBe(mockQuery.selectSolicitud$);
    });

    it('should call store actualizarEstado', () => {
        const mockState = {} as any;
        service.actualizarEstadoFormulario(mockState);
        expect(mockStore.actualizarEstado).toHaveBeenCalledWith(mockState);
    });

    it('should make HTTP GET request', () => {
        const mockResponse = {} as any;

        service.getDatosDeLaSolicitud().subscribe(response => {
            expect(response).toEqual(mockResponse);
        });

        const req = httpMock.expectOne('assets/json/130105/datos-de-la-solicitud.json');
        expect(req.request.method).toBe('GET');
        req.flush(mockResponse);
    });

    it('should make HTTP POST request', () => {
        const mockBody = { test: 'data' };
        const mockResponse: JSONResponse = {} as any;

        service.guardarDatosPost(mockBody).subscribe(response => {
            expect(response).toEqual(mockResponse);
        });

        const req = httpMock.expectOne(PROC_130105.GUARDAR);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(mockBody);
        req.flush(mockResponse);
    });

    it('should return mapped data from catalogo service', () => {
        const mockData = [{ id: 1, clave: '01', descripcion: 'Test catalogo' }];
        const mockResponse = {
            codigo: '200',
            path: '/test',
            timestamp: new Date().toISOString(),
            mensaje: 'Success',
            datos: mockData
        };
        mockCatalogoServices.regimenesCatalogo.mockReturnValue(of(mockResponse));

        service.getRegimenCatalogo('130105').subscribe(result => {
            expect(result).toEqual(mockData);
        });

        expect(mockCatalogoServices.regimenesCatalogo).toHaveBeenCalledWith('130105');
    });

    it('should return empty array when no data', () => {
        const mockResponse = {
            codigo: '200',
            path: '/test',
            timestamp: new Date().toISOString(),
            mensaje: 'Success',
            datos: undefined
        };
        mockCatalogoServices.regimenesCatalogo.mockReturnValue(of(mockResponse));

        service.getRegimenCatalogo('130105').subscribe(result => {
            expect(result).toEqual([]);
        });
    });

    it('should call catalogoServices with correct parameters for clasificacion', () => {
        const mockData = [{ id: 1, clave: '01', descripcion: 'Test clasificacion' }];
        const mockResponse = {
            codigo: '200',
            path: '/test',
            timestamp: new Date().toISOString(),
            mensaje: 'Success',
            datos: mockData
        };
        mockCatalogoServices.clasificacionRegimenCatalogo.mockReturnValue(of(mockResponse));

        service.getClasificacionRegimenCatalogo('130105').subscribe(result => {
            expect(result).toEqual(mockData);
        });

        expect(mockCatalogoServices.clasificacionRegimenCatalogo).toHaveBeenCalledWith(
            '130105',
            { tramite: 'TITPEX.130108', id: '130105' }
        );
    });

    it('should call catalogoServices with correct parameters for fraccion', () => {
        const mockData = [{ id: 1, clave: '01', descripcion: 'Test fraccion' }];
        const mockResponse = {
            codigo: '200',
            path: '/test',
            timestamp: new Date().toISOString(),
            mensaje: 'Success',
            datos: mockData
        };
        mockCatalogoServices.fraccionesArancelariasCatalogo.mockReturnValue(of(mockResponse));

        service.getFraccionCatalogoService('130105').subscribe(result => {
            expect(result).toEqual(mockData);
        });

        expect(mockCatalogoServices.fraccionesArancelariasCatalogo).toHaveBeenCalledWith('130105', 'TITPEX.130105');
    });

    it('should call catalogoServices with correct parameters', () => {
        const mockData = [{ id: 1, clave: 'KG', descripcion: 'Kilogramo' }];
        const mockResponse = {
            codigo: '200',
            path: '/test',
            timestamp: new Date().toISOString(),
            mensaje: 'Success',
            datos: mockData
        };
        mockCatalogoServices.unidadesMedidaTarifariaCatalogo.mockReturnValue(of(mockResponse));

        service.getUMTService('130105', '87012002').subscribe(result => {
            expect(result).toEqual(mockData);
        });

        expect(mockCatalogoServices.unidadesMedidaTarifariaCatalogo).toHaveBeenCalledWith('130105', '87012002');
    });

    it('should return mapped data', () => {
        const mockData = [{ id: 1, clave: 'MX-CMX', descripcion: 'Ciudad de México' }];
        const mockResponse = {
            codigo: '200',
            path: '/test',
            timestamp: new Date().toISOString(),
            mensaje: 'Success',
            datos: mockData
        };
        mockCatalogoServices.entidadesFederativasCatalogo.mockReturnValue(of(mockResponse));

        service.getEntidadesFederativasCatalogo('130105').subscribe(result => {
            expect(result).toEqual(mockData);
        });

        expect(mockCatalogoServices.entidadesFederativasCatalogo).toHaveBeenCalledWith('130105');
    });

    it('should call catalogoServices with correct parameters', () => {
        const mockData = [{ id: 1, clave: 'REP001', descripcion: 'Representación Federal' }];
        const mockResponse = {
            codigo: '200',
            path: '/test',
            timestamp: new Date().toISOString(),
            mensaje: 'Success',
            datos: mockData
        };
        mockCatalogoServices.representacionFederalCatalogo.mockReturnValue(of(mockResponse));

        service.getRepresentacionFederalCatalogo('130105', 'entidad').subscribe(result => {
            expect(result).toEqual(mockData);
        });

        expect(mockCatalogoServices.representacionFederalCatalogo).toHaveBeenCalledWith('130105', 'entidad');
    });

    it('should return mapped data', () => {
        const mockData = [{ id: 1, clave: 'US', descripcion: 'Estados Unidos' }];
        const mockResponse = {
            codigo: '200',
            path: '/test',
            timestamp: new Date().toISOString(),
            mensaje: 'Success',
            datos: mockData
        };
        mockCatalogoServices.todosPaisesSeleccionados.mockReturnValue(of(mockResponse));

        service.getTodosPaisesSeleccionados('130105').subscribe(result => {
            expect(result).toEqual(mockData);
        });

        expect(mockCatalogoServices.todosPaisesSeleccionados).toHaveBeenCalledWith('130105');
    });

    it('should call catalogoServices with correct parameters', () => {
        const mockData = [{ id: 1, clave: 'TLCAN', descripcion: 'Tratado de Libre Comercio' }];
        const mockResponse = {
            codigo: '200',
            path: '/test',
            timestamp: new Date().toISOString(),
            mensaje: 'Success',
            datos: mockData
        };
        mockCatalogoServices.tratadosAcuerdoCatalogo.mockReturnValue(of(mockResponse));

        service.getBloqueService('test-tramite').subscribe(result => {
            expect(result).toEqual(mockData);
        });

        expect(mockCatalogoServices.tratadosAcuerdoCatalogo).toHaveBeenCalledWith('test-tramite', 'TITRAC.TA');
    });

    it('should call catalogoServices with correct parameters', () => {
        const mockData = [{ idPartidaSol: 1, descripcionMercancia: 'Partida test' }] as any;
        const mockResponse = {
            codigo: '200',
            path: '/test',
            timestamp: new Date().toISOString(),
            mensaje: 'Success',
            datos: mockData
        };

        service.getMostrarPartidasService(123).subscribe(result => {
            expect(result).toEqual(mockData);
        });
    });

    it('should call catalogoServices with correct parameters', () => {
        const mockData = [{ id: 1, clave: 'US', descripcion: 'Estados Unidos' }];
        const mockResponse = {
            codigo: '200',
            path: '/test',
            timestamp: new Date().toISOString(),
            mensaje: 'Success',
            datos: mockData
        };
        mockCatalogoServices.getpaisesBloqueCatalogo.mockReturnValue(of(mockResponse));

        service.getPaisesPorBloqueService('test-tramite', '130105').subscribe(result => {
            expect(result).toEqual(mockData);
        });

        expect(mockCatalogoServices.getpaisesBloqueCatalogo).toHaveBeenCalledWith('test-tramite', '130105');
    });

    // Test error handling scenarios
    it('should handle undefined datos response', () => {
        const mockResponse = {
            codigo: '200',
            path: '/test',
            timestamp: new Date().toISOString(),
            mensaje: 'Success',
            datos: undefined
        };
        mockCatalogoServices.unidadesMedidaTarifariaCatalogo.mockReturnValue(of(mockResponse));

        service.getUMTService('130105', 'FRAC001').subscribe(result => {
            expect(result).toEqual([]);
        });
    });

    it('should handle undefined datos response for entidades', () => {
        const mockResponse = {
            codigo: '200',
            path: '/test',
            timestamp: new Date().toISOString(),
            mensaje: 'Success',
            datos: undefined
        };
        mockCatalogoServices.entidadesFederativasCatalogo.mockReturnValue(of(mockResponse));

        service.getEntidadesFederativasCatalogo('130105').subscribe(result => {
            expect(result).toEqual([]);
        });
    });
});