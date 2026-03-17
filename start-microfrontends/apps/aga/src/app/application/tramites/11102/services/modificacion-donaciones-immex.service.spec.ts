import { TestBed } from '@angular/core/testing';
import { ModificacionDonacionesImmexService } from './modificacion-donaciones-immex.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { Tramite11102Store } from '../estados/tramite11102.store';
import { Solicitud11102State, Solicitud11102StaObjResp } from '../estados/tramite11102.store';
import { RespuestaCatalogos } from '@ng-mf/data-access-user';
import { DatosDelMercancia, RespuestaMercancia } from '../models/modificacion-donaciones-immex.model';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ModificacionDonacionesImmexService', () => {
    let service: ModificacionDonacionesImmexService;
    let httpMock: jest.Mocked<HttpClient>;
    let storeMock: jest.Mocked<Tramite11102Store>;

    beforeEach(() => {
        httpMock = {
            get: jest.fn()
        } as any;

        storeMock = {
            setAduana: jest.fn(),
            setOrganismoPublico: jest.fn(),
            setTipoDeMercancia: jest.fn(),
            setUnidadMedida: jest.fn(),
            setCondicionMercancia: jest.fn(),
            setAno: jest.fn(),
            setCantidad: jest.fn(),
            setMarca: jest.fn(),
            setModelo: jest.fn(),
            setPais: jest.fn(),
            setUsoEspecifico: jest.fn(),
            setCodigoPostal: jest.fn(),
            setRfc: jest.fn(),
            setNumeroProgramaImmex: jest.fn(),
            setCorreoElectronicoOpcional: jest.fn(),
            setTelefonoOpcional: jest.fn(),
            setDelMercancia: jest.fn()
        } as any;

        TestBed.configureTestingModule({
            imports:[HttpClientTestingModule],
            providers: [
                ModificacionDonacionesImmexService,
                { provide: HttpClient, useValue: httpMock },
                { provide: Tramite11102Store, useValue: storeMock }
            ]
        });
        service = TestBed.inject(ModificacionDonacionesImmexService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('getAduana should call http.get with correct URL', (done) => {
        const mockResponse: RespuestaCatalogos = { data: [] } as any;
        httpMock.get.mockReturnValue(of(mockResponse));
        service.getAduana().subscribe(res => {
            expect(res).toEqual(mockResponse);
            expect(httpMock.get).toHaveBeenCalledWith('assets/json/11102/aduanaIngresara.json');
            done();
        });
    });

    it('getTipoDeMercancia should call http.get with correct URL', (done) => {
        const mockResponse: RespuestaCatalogos = { data: [] } as any;
        httpMock.get.mockReturnValue(of(mockResponse));
        service.getTipoDeMercancia().subscribe(res => {
            expect(res).toEqual(mockResponse);
            expect(httpMock.get).toHaveBeenCalledWith('assets/json/11102/tipo-de-mercancia.json');
            done();
        });
    });

    it('getCondicionMercancia should call http.get with correct URL', (done) => {
        const mockResponse: RespuestaCatalogos = { data: [] } as any;
        httpMock.get.mockReturnValue(of(mockResponse));
        service.getCondicionMercancia().subscribe(res => {
            expect(res).toEqual(mockResponse);
            expect(httpMock.get).toHaveBeenCalledWith('assets/json/11102/condicion-mercancia.json');
            done();
        });
    });

    it('getUnidadMedida should call http.get with correct URL', (done) => {
        const mockResponse: RespuestaCatalogos = { data: [] } as any;
        httpMock.get.mockReturnValue(of(mockResponse));
        service.getUnidadMedida().subscribe(res => {
            expect(res).toEqual(mockResponse);
            expect(httpMock.get).toHaveBeenCalledWith('assets/json/11102/unidad-medida.json');
            done();
        });
    });

    it('getAno should call http.get with correct URL', (done) => {
        const mockResponse: RespuestaCatalogos = { data: [] } as any;
        httpMock.get.mockReturnValue(of(mockResponse));
        service.getAno().subscribe(res => {
            expect(res).toEqual(mockResponse);
            expect(httpMock.get).toHaveBeenCalledWith('assets/json/11102/ano.json');
            done();
        });
    });

    it('getPais should call http.get with correct URL', (done) => {
        const mockResponse: RespuestaCatalogos = { data: [] } as any;
        httpMock.get.mockReturnValue(of(mockResponse));
        service.getPais().subscribe(res => {
            expect(res).toEqual(mockResponse);
            expect(httpMock.get).toHaveBeenCalledWith('assets/json/11102/pais.json');
            done();
        });
    });

    it('agregarMercancias should call http.get with correct URL', (done) => {
        const mockResponse: RespuestaMercancia = { data: [] } as any;
        httpMock.get.mockReturnValue(of(mockResponse));
        service.agregarMercancias().subscribe(res => {
            expect(res).toEqual(mockResponse);
            expect(httpMock.get).toHaveBeenCalledWith('assets/json/11102/mercanciaDatos.json');
            done();
        });
    });

    it('actualizarEstadoFormulario should call store methods with correct values', () => {
        const datos: Solicitud11102State = {
            organismoPublico: 'org',
            tipoDeMercancia: 'tipo',
            unidadMedida: 'unidad',
            condicionMercancia: 'cond',
            ano: [2023],
            cantidad: 10,
            marca: 'marca',
            modelo: 'modelo',
            pais: ['MX'],
            usoEspecifico: 'uso',
            codigoPostal: '12345',
            rfc: 'RFC123',
            numeroProgramaImmex: 'IMMEX123',
            correoElectronicoOpcional: 'test@mail.com',
            telefonoOpcional: '5555555555',
            datosDelMercancia: [{ id: 1 }]
        } as any;

        service.actualizarEstadoFormulario(datos);

        expect(storeMock.setOrganismoPublico).toHaveBeenCalledWith('org');
        expect(storeMock.setTipoDeMercancia).toHaveBeenCalledWith('tipo');
        expect(storeMock.setUnidadMedida).toHaveBeenCalledWith('unidad');
        expect(storeMock.setCondicionMercancia).toHaveBeenCalledWith('cond');
        expect(storeMock.setAno).toHaveBeenCalledWith([2023]);
        expect(storeMock.setCantidad).toHaveBeenCalledWith(10);
        expect(storeMock.setMarca).toHaveBeenCalledWith('marca');
        expect(storeMock.setModelo).toHaveBeenCalledWith('modelo');
        expect(storeMock.setPais).toHaveBeenCalledWith(['MX']);
        expect(storeMock.setUsoEspecifico).toHaveBeenCalledWith('uso');
        expect(storeMock.setCodigoPostal).toHaveBeenCalledWith('12345');
        expect(storeMock.setRfc).toHaveBeenCalledWith('RFC123');
        expect(storeMock.setNumeroProgramaImmex).toHaveBeenCalledWith('IMMEX123');
        expect(storeMock.setCorreoElectronicoOpcional).toHaveBeenCalledWith('test@mail.com');
        expect(storeMock.setTelefonoOpcional).toHaveBeenCalledWith('5555555555');
        expect(storeMock.setDelMercancia).toHaveBeenCalledWith([{ id: 1 }]);
    });

    it('getDatosDeTrtamitelDoc should call http.get with correct URL', (done) => {
        const mockResponse: Solicitud11102StaObjResp = { data: {} } as any;
        httpMock.get.mockReturnValue(of(mockResponse));
        service.getDatosDeTrtamitelDoc().subscribe(res => {
            expect(res).toEqual(mockResponse);
            expect(httpMock.get).toHaveBeenCalledWith('assets/json/11102/datos-del-tramite.json');
            done();
        });
    });

    it('obtenerMercanciaDatos should call http.get with correct URL', (done) => {
        const MOCK_RESPONSE: DatosDelMercancia[] = [];
        httpMock.get.mockReturnValue(of(MOCK_RESPONSE));
        service.obtenerMercanciaDatos().subscribe(res => {
            expect(res).toEqual(MOCK_RESPONSE);
            expect(httpMock.get).toHaveBeenCalledWith('assets/json/11102/mercancia-table.json');
            done();
        });
    });
});