import { TestBed } from '@angular/core/testing';
import { ExportaccionAcuicolaService } from './exportaccion-acuicola.service';
import { HttpClient } from '@angular/common/http';
import { of, throwError, Subject } from 'rxjs';
import { Tramite220403Store } from '../estados/tramite220403.store';
import { Tramite220403Query } from '../estados/tramite220403.query';
import { SeccionLibStore } from '@ng-mf/data-access-user';
import { SeccionLibQuery } from '@ng-mf/data-access-user';

describe('ExportaccionAcuicolaService', () => {
    let service: ExportaccionAcuicolaService;
    let httpClientMock: any;
    let storeMock: any;
    let queryMock: any;
    let seccionStoreMock: any;
    let seccionQueryMock: any;

    beforeEach(() => {
        httpClientMock = { get: jest.fn() };
        storeMock = {
            setDatosRealizar: jest.fn(),
            setCombinacionRequerida: jest.fn(),
            setTransporte: jest.fn(),
            setPagoDerechos: jest.fn(),
            actualizarTercerosRelacionados: jest.fn()
        };
        queryMock = {
            selectTramite$: of({
                datosRealizarValidada: true,
                combinacionRequeridaValidada: true,
                transporteValidada: true,
                pagoDerechosValidada: true
            })
        };
        seccionStoreMock = {
            establecerSeccion: jest.fn(),
            establecerFormaValida: jest.fn()
        };
        seccionQueryMock = {
            selectSeccionState$: of({})
        };

        TestBed.configureTestingModule({
            providers: [
                ExportaccionAcuicolaService,
                { provide: HttpClient, useValue: httpClientMock },
                { provide: Tramite220403Store, useValue: storeMock },
                { provide: Tramite220403Query, useValue: queryMock },
                { provide: SeccionLibStore, useValue: seccionStoreMock },
                { provide: SeccionLibQuery, useValue: seccionQueryMock }
            ]
        });

        service = TestBed.inject(ExportaccionAcuicolaService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('getDatos', () => {
        it('should return mapped data on success', (done) => {
            const mockData = [{ label: 'A', value: 1 }, { label: 'B', value: 2 }];
            httpClientMock.get.mockReturnValue(of(mockData));
            service.getDatos('file.json').subscribe(data => {
                expect(data).toEqual(mockData);
                done();
            });
        });

        it('should return empty array on error', (done) => {
            httpClientMock.get.mockReturnValue(throwError(() => new Error('fail')));
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            service.getDatos('file.json').subscribe(data => {
                expect(data).toEqual([]);
                expect(consoleSpy).toHaveBeenCalled();
                done();
            });
        });
    });

    describe('obtenerMenuDesplegable', () => {
        it('should return catalog data', (done) => {
            const mockResponse = { data: [{ id: 1, nombre: 'Banco' }] };
            httpClientMock.get.mockReturnValue(of(mockResponse));
            service.obtenerMenuDesplegable('bancos').subscribe(data => {
                expect(data).toEqual(mockResponse.data);
                done();
            });
        });
    });

    describe('actualizarFormaValida', () => {
        it('should set seccion and forma as valid if all are validated', () => {
            (service as any).TramiteState = {
                datosRealizarValidada: true,
                combinacionRequeridaValidada: true,
                transporteValidada: true,
                pagoDerechosValidada: true
            };
            service.actualizarFormaValida();
            expect(seccionStoreMock.establecerSeccion).toHaveBeenCalledWith([true]);
            expect(seccionStoreMock.establecerFormaValida).toHaveBeenCalledWith([true]);
        });

        it('should set forma as invalid if any are not validated', () => {
            (service as any).TramiteState = {
                datosRealizarValidada: true,
                combinacionRequeridaValidada: false,
                transporteValidada: true,
                pagoDerechosValidada: true
            };
            service.actualizarFormaValida();
            expect(seccionStoreMock.establecerSeccion).toHaveBeenCalledWith([true]);
            expect(seccionStoreMock.establecerFormaValida).toHaveBeenCalledWith([false]);
        });
    });

    describe('getAcuiculturaData', () => {
        it('should call httpClient.get with correct URL', (done) => {
            const mockData = { datosRealizar: {} };
            httpClientMock.get.mockReturnValue(of(mockData));
            service.getAcuiculturaData().subscribe(data => {
                expect(httpClientMock.get).toHaveBeenCalledWith('assets/json/220403/exportaccion-acuicola.json');
                expect(data).toEqual(mockData);
                done();
            });
        });
    });

    describe('actualizarEstadoFormulario', () => {
        it('should update all form states in store', () => {
            const datos = {
                datosRealizar: { a: 1 },
                combinacionRequerida: { b: 2 },
                transporte: { c: 3 },
                pagoDerechos: { d: 4 }
            };
            service.actualizarEstadoFormulario(datos as any);
            expect(storeMock.setDatosRealizar).toHaveBeenCalledWith(datos.datosRealizar);
            expect(storeMock.setCombinacionRequerida).toHaveBeenCalledWith(datos.combinacionRequerida);
            expect(storeMock.setTransporte).toHaveBeenCalledWith(datos.transporte);
            expect(storeMock.setPagoDerechos).toHaveBeenCalledWith(datos.pagoDerechos);
        });
    });
});