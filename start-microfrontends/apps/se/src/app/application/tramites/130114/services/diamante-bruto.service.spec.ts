import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DiamanteBrutoService } from './diamante-bruto.service';
import { Tramite130114Store } from '../../../estados/tramites/tramite130114.store';
import { Tramite130114Query } from '../../../estados/queries/tramite130114.query';
import { CatalogoServices } from '@libs/shared/data-access-user/src';
import { of } from 'rxjs';
import { PROC_130114 } from '../servers/api-route';

describe('DiamanteBrutoService', () => {
    let service: DiamanteBrutoService;
    let httpMock: HttpTestingController;
    let mockStore: jest.Mocked<Tramite130114Store>;
    let mockQuery: jest.Mocked<Tramite130114Query>;
    let mockCatalogoServices: jest.Mocked<CatalogoServices>;

    beforeEach(() => {
        const storeMock = {
            actualizarEstado: jest.fn(() => of())
        } as any;

        const queryMock = {
            selectSolicitud$: of({})
        } as jest.Mocked<Tramite130114Query>;

        const catalogoMock = {
            regimenesCatalogo: jest.fn(() => of({})),
            clasificacionRegimenCatalogo: jest.fn(() => of({})),
            fraccionesArancelariasCatalogo: jest.fn(() => of({})),
            unidadesMedidasTarifariasCatalogo: jest.fn(() => of({})),
            entidadesFederativasCatalogo: jest.fn(() => of({})),
            representacionFederalCatalogo: jest.fn(() => of({})),
            todosPaisesSeleccionados: jest.fn(() => of()),
            tratadosAcuerdoCatalogo: jest.fn(() => of()),
            getpaisesBloqueCatalogo: jest.fn(() => of())
        } as any;

        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                DiamanteBrutoService,
                { provide: Tramite130114Store, useValue: storeMock },
                { provide: Tramite130114Query, useValue: queryMock },
                { provide: CatalogoServices, useValue: catalogoMock }
            ]
        });

        service = TestBed.inject(DiamanteBrutoService);
        httpMock = TestBed.inject(HttpTestingController);
        mockStore = TestBed.inject(Tramite130114Store) as jest.Mocked<Tramite130114Store>;
        mockQuery = TestBed.inject(Tramite130114Query) as jest.Mocked<Tramite130114Query>;
        mockCatalogoServices = TestBed.inject(CatalogoServices) as jest.Mocked<CatalogoServices>;
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });


    it('should call store actualizarEstado', () => {
        const mockData = { id: '123' } as any;

        service.actualizarEstadoFormulario(mockData);

        expect(mockStore.actualizarEstado).toHaveBeenCalledWith(mockData);
    });

    it('should fetch datos de la solicitud', () => {
        const mockResponse = { id: '123' } as any;

        service.getDatosDeLaSolicitud().subscribe(response => {
            expect(response).toEqual(mockResponse);
        });

        const req = httpMock.expectOne('assets/json/130114/datos-de-la-solicitud.json');
        expect(req.request.method).toBe('GET');
        req.flush(mockResponse);
    });

    it('should post data to save endpoint', () => {
        const mockBody = { test: 'data' };
        const mockResponse = { success: true };

        service.guardarDatosPost(mockBody).subscribe(response => {
            expect(response).toEqual(mockResponse);
        });

        const req = httpMock.expectOne(PROC_130114.GUARDAR);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(mockBody);
        req.flush(mockResponse);
    });

    it('should return regimen catalogo data', () => {
        const mockResponse = { datos: [{ id: '1', nombre: 'test' }] } as any;
        mockCatalogoServices.regimenesCatalogo.mockReturnValue(of(mockResponse));

        service.getRegimenCatalogo('123').subscribe(result => {
            expect(result).toEqual(mockResponse.datos);
        });

        expect(mockCatalogoServices.regimenesCatalogo).toHaveBeenCalledWith('123');
    });

    it('should return empty array when no data', () => {
        mockCatalogoServices.regimenesCatalogo.mockReturnValue(of(null as any));

        service.getRegimenCatalogo('123').subscribe(result => {
            expect(result).toEqual([]);
        });
    });

    it('should return clasificacion regimen catalogo data', () => {
        const mockResponse = { datos: [{ id: '1', nombre: 'test' }] } as any;
        const expectedPayload = { tramite: 'TITPEX.130114', id: '123' } as any;
        mockCatalogoServices.clasificacionRegimenCatalogo.mockReturnValue(of(mockResponse));

        service.getClasificacionRegimenCatalogo('123').subscribe(result => {
            expect(result).toEqual(mockResponse.datos);
        });

        expect(mockCatalogoServices.clasificacionRegimenCatalogo).toHaveBeenCalledWith('130114', expectedPayload);
    });

    it('should return fraccion catalogo data', () => {
        const mockResponse = { datos: [{ id: '1', nombre: 'test' }] } as any;
        mockCatalogoServices.fraccionesArancelariasCatalogo.mockReturnValue(of(mockResponse));

        service.getFraccionCatalogoService('123').subscribe(result => {
            expect(result).toEqual(mockResponse.datos);
        });

        expect(mockCatalogoServices.fraccionesArancelariasCatalogo).toHaveBeenCalledWith('123', 'TITPEX.130114');
    });

    it('should fetch mostrar partidas data', () => {
        const mockResponse = { datos: [] };
        const solicitudId = 123;

        service.getMostrarPartidasService(solicitudId).subscribe(response => {
            expect(response).toEqual(mockResponse);
        });

        const req = httpMock.expectOne(PROC_130114.MOSTAR_PARTIDAS + solicitudId);
        expect(req.request.method).toBe('GET');
        req.flush(mockResponse);
    });

    it('should return state from query', () => {
        const mockState = { id: '123' } as any;
        Object.defineProperty(mockQuery, 'selectSolicitud$', { value: of(mockState) });

        service.getAllState().subscribe(result => {
            expect(result).toEqual(mockState);
        });
    });

    it('should transform data correctly', () => {
        const mockItem = {
            tableBodyData: [
                {
                    cantidad: '10',
                    descripcion: 'test desc',
                    precioUnitarioUSD: '100',
                    totalUSD: '1000'
                }
            ],
            cantidad: '15',
            descripcion: 'authorized desc',
            valorFacturaUSD: '1500',
            fraccion: 'ABC123',
            unidadMedida: 'KG'
        } as any;

        const result = service.getPayloadDatos(mockItem);

        expect(result).toEqual([{
            unidadesSolicitadas: 10,
            unidadesAutorizadas: 15,
            descripcionSolicitada: 'test desc',
            descripcionAutorizada: 'authorized desc',
            importeUnitarioUSD: 100,
            importeTotalUSD: 1000,
            autorizada: true,
            importeUnitarioUSDAutorizado: 100,
            importeTotalUSDAutorizado: 1500,
            fraccionArancelariaClave: 'ABC123',
            unidadMedidaClave: 'KG'
        }]);
    });

    it('should handle empty tableBodyData', () => {
        const mockItem = { tableBodyData: null } as any;

        const result = service.getPayloadDatos(mockItem);

        expect(result).toEqual([]);
    });

    it('should return UMT service data', () => {
        const mockResponse = { datos: [{ id: '1', nombre: 'Kilogramo' }] } as any;
        mockCatalogoServices.unidadesMedidasTarifariasCatalogo.mockReturnValue(of(mockResponse));

        service.getUMTService('123', 'ABC456').subscribe(result => {
            expect(result).toEqual(mockResponse.datos);
        });

        expect(mockCatalogoServices.unidadesMedidasTarifariasCatalogo).toHaveBeenCalledWith('123', 'ABC456');
    });

    it('should return empty array when UMT service has no data', () => {
        mockCatalogoServices.unidadesMedidasTarifariasCatalogo.mockReturnValue(of(null as any));

        service.getUMTService('123', 'ABC456').subscribe(result => {
            expect(result).toEqual([]);
        });
    });

    it('should return entidades federativas data', () => {
        const mockResponse = { datos: [{ id: '1', nombre: 'Ciudad de México' }] } as any;
        mockCatalogoServices.entidadesFederativasCatalogo.mockReturnValue(of(mockResponse));

        service.getEntidadesFederativasCatalogo('123').subscribe(result => {
            expect(result).toEqual(mockResponse.datos);
        });

        expect(mockCatalogoServices.entidadesFederativasCatalogo).toHaveBeenCalledWith('123');
    });

    it('should return empty array when entidades federativas has no data', () => {
        mockCatalogoServices.entidadesFederativasCatalogo.mockReturnValue(of(null as any));

        service.getEntidadesFederativasCatalogo('123').subscribe(result => {
            expect(result).toEqual([]);
        });
    });

    it('should return representacion federal data', () => {
        const mockResponse = { datos: [{ id: '1', nombre: 'Representación Centro' }] } as any;
        mockCatalogoServices.representacionFederalCatalogo.mockReturnValue(of(mockResponse));

        service.getRepresentacionFederalCatalogo('123', 'CDMX').subscribe(result => {
            expect(result).toEqual(mockResponse.datos);
        });

        expect(mockCatalogoServices.representacionFederalCatalogo).toHaveBeenCalledWith('123', 'CDMX');
    });

    it('should return empty array when representacion federal has no data', () => {
        mockCatalogoServices.representacionFederalCatalogo.mockReturnValue(of(null as any));

        service.getRepresentacionFederalCatalogo('123', 'CDMX').subscribe(result => {
            expect(result).toEqual([]);
        });
    });

    it('should return todos paises seleccionados data', () => {
        const mockResponse = { datos: [{ id: '1', nombre: 'México' }] } as any;
        mockCatalogoServices.todosPaisesSeleccionados.mockReturnValue(of(mockResponse));

        service.getTodosPaisesSeleccionados('123').subscribe(result => {
            expect(result).toEqual(mockResponse.datos);
        });

        expect(mockCatalogoServices.todosPaisesSeleccionados).toHaveBeenCalledWith('123');
    });

    it('should return empty array when todos paises seleccionados has no data', () => {
        mockCatalogoServices.todosPaisesSeleccionados.mockReturnValue(of(null as any));

        service.getTodosPaisesSeleccionados('123').subscribe(result => {
            expect(result).toEqual([]);
        });
    });

    it('should return bloque service data', () => {
        const mockResponse = { datos: [{ id: '1', nombre: 'TLCAN' }] } as any;
        mockCatalogoServices.tratadosAcuerdoCatalogo.mockReturnValue(of(mockResponse));

        service.getBloqueService('130114').subscribe(result => {
            expect(result).toEqual(mockResponse.datos);
        });

        expect(mockCatalogoServices.tratadosAcuerdoCatalogo).toHaveBeenCalledWith('130114', 'TITRAC.TA');
    });

    it('should return empty array when bloque service has no data', () => {
        mockCatalogoServices.tratadosAcuerdoCatalogo.mockReturnValue(of(null as any));

        service.getBloqueService('130114').subscribe(result => {
            expect(result).toEqual([]);
        });
    });

    it('should return paises por bloque data', () => {
        const mockResponse = { datos: [{ id: '1', nombre: 'Estados Unidos' }] } as any;
        mockCatalogoServices.getpaisesBloqueCatalogo.mockReturnValue(of(mockResponse));

        service.getPaisesPorBloqueService('130114', 'BLOQUE123').subscribe(result => {
            expect(result).toEqual(mockResponse.datos);
        });

        expect(mockCatalogoServices.getpaisesBloqueCatalogo).toHaveBeenCalledWith('130114', 'BLOQUE123');
    });

    it('should return empty array when paises por bloque has no data', () => {
        mockCatalogoServices.getpaisesBloqueCatalogo.mockReturnValue(of(null as any));

        service.getPaisesPorBloqueService('130114', 'BLOQUE123').subscribe(result => {
            expect(result).toEqual([]);
        });
    });
});