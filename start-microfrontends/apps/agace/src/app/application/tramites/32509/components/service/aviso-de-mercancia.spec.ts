import { AvisoDeMercanciaService } from './aviso-de-mercancia';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { DestruccionStore, DestruccionState } from '../../estados/Tramite32509.store';
import { DestruccionQuery } from '../../estados/Tramite32509.query';

describe('AvisoDeMercanciaService', () => {
    let service: AvisoDeMercanciaService;
    let httpClientMock: jest.Mocked<HttpClient>;
    let storeMock: jest.Mocked<DestruccionStore>;
    let queryMock: jest.Mocked<DestruccionQuery>;

    beforeEach(() => {
        httpClientMock = {
            get: jest.fn()
        } as any;

        // Mock all store methods used in actualizarEstadoFormulario
        storeMock = {
            setTipoDeAviso: jest.fn(),
            setNombre: jest.fn(),
            setRfc: jest.fn(),
            setEntidadFederativa: jest.fn(),
            setAlcaldiaMunicipo: jest.fn(),
            setColonia: jest.fn(),
            setCalle: jest.fn(),
            setNumeroExterior: jest.fn(),
            setNumeroInterior: jest.fn(),
            setCodigoPostal: jest.fn(),
            setCartaCupo: jest.fn(),
            setNumeraDeAcuse: jest.fn(),
            setDestruccionMercancia: jest.fn(),
            setMerccanciaEntidadFederativa: jest.fn(),
            setMerccanciaAlcaldiaMunicipo: jest.fn(),
            setMerccanciaColonia: jest.fn(),
            setMerccanciaCalle: jest.fn(),
            setMerccanciaNumeroExterior: jest.fn(),
            setMerccanciaNumeroInterior: jest.fn(),
            setMerccanciaCodigoPostal: jest.fn(),
            setDestruir: jest.fn(),
            setTarifa: jest.fn(),
            setDestruccionEntidadFederativa: jest.fn(),
            setDestruccionAlcaldiaMunicipo: jest.fn(),
            setDestruccionColonia: jest.fn(),
            setDestruccionCalle: jest.fn(),
            setDestruccionNumeroExterior: jest.fn(),
            setDestruccionNumeroInterior: jest.fn(),
            setDestruccionCodigoPostal: jest.fn(),
            setDestruccionHora: jest.fn(),
            setDesturccionProceso: jest.fn(),
            setCasofortuito: jest.fn(),
            setDonoMercancia: jest.fn(),
            setCondicionesMateriales: jest.fn(),
            setCaboDestruccionFecha: jest.fn(),
        } as any;

        queryMock = {} as any;

        service = new AvisoDeMercanciaService(httpClientMock, storeMock, queryMock);
    });

    describe('getAcuiculturaData', () => {
        it('should call httpClient.get with the correct URL and return its observable', () => {
            const mockState = { tipoDeAviso: 'test' } as DestruccionState;
            (httpClientMock.get as jest.Mock).mockReturnValue(of(mockState));

            const obs$ = service.getAcuiculturaData();

            expect(httpClientMock.get).toHaveBeenCalledWith('assets/json/32509/tipo_form.json');
            obs$.subscribe(data => {
                expect(data).toEqual(mockState);
            });
        });
    });

    describe('actualizarEstadoFormulario', () => {
        it('should call all store setters with the correct values', () => {
            const datos: DestruccionState = {
                tipoDeAviso: 'aviso',
                nombre: 'Juan',
                rfc: 'RFC123',
                entidadFederativa: 'CDMX',
                alcaldiaMunicipo: 'Benito Juárez',
                colonia: 'Centro',
                calle: 'Calle 1',
                numeroExterior: '10',
                numeroInterior: '2',
                codigoPostal: '01234',
                cartaCupo: 'carta',
                numeraDeAcuse: 'acuse',
                destruccionMercancia: 'mercancia',
                merccanciaEntidadFederativa: 'CDMX',
                merccanciaAlcaldiaMunicipo: 'Benito Juárez',
                merccanciaColonia: 'Centro',
                merccanciaCalle: 'Calle 2',
                merccanciaNumeroExterior: '20',
                merccanciaNumeroInterior: '3',
                merccanciaCodigoPostal: '56789',
                destruir: 'sí',
                tarifa: '100',
                destruccionEntidadFederativa: 'CDMX',
                destruccionAlcaldiaMunicipo: 'Benito Juárez',
                destruccionColonia: 'Centro',
                destruccionCalle: 'Calle 3',
                destruccionNumeroExterior: '30',
                destruccionNumeroInterior: '4',
                destruccionCodigoPostal: '67890',
                destruccionHora: '12:00',
                desturccionProceso: 'proceso',
                casofortuito: 'no',
                donoMercancia: 'no',
                condicionesMateriales: 'buenas',
                caboDestruccionFecha: '2025-01-01'
            };

            service.actualizarEstadoFormulario(datos);

            expect(storeMock.setTipoDeAviso).toHaveBeenCalledWith(datos.tipoDeAviso);
            expect(storeMock.setNombre).toHaveBeenCalledWith(datos.nombre);
            expect(storeMock.setRfc).toHaveBeenCalledWith(datos.rfc);
            expect(storeMock.setEntidadFederativa).toHaveBeenCalledWith(datos.entidadFederativa);
            expect(storeMock.setAlcaldiaMunicipo).toHaveBeenCalledWith(datos.alcaldiaMunicipo);
            expect(storeMock.setColonia).toHaveBeenCalledWith(datos.colonia);
            expect(storeMock.setCalle).toHaveBeenCalledWith(datos.calle);
            expect(storeMock.setNumeroExterior).toHaveBeenCalledWith(datos.numeroExterior);
            expect(storeMock.setNumeroInterior).toHaveBeenCalledWith(datos.numeroInterior);
            expect(storeMock.setCodigoPostal).toHaveBeenCalledWith(datos.codigoPostal);
            expect(storeMock.setCartaCupo).toHaveBeenCalledWith(datos.cartaCupo);
            expect(storeMock.setNumeraDeAcuse).toHaveBeenCalledWith(datos.numeraDeAcuse);
            expect(storeMock.setDestruccionMercancia).toHaveBeenCalledWith(datos.destruccionMercancia);
            expect(storeMock.setMerccanciaEntidadFederativa).toHaveBeenCalledWith(datos.merccanciaEntidadFederativa);
            expect(storeMock.setMerccanciaAlcaldiaMunicipo).toHaveBeenCalledWith(datos.merccanciaAlcaldiaMunicipo);
            expect(storeMock.setMerccanciaColonia).toHaveBeenCalledWith(datos.merccanciaColonia);
            expect(storeMock.setMerccanciaCalle).toHaveBeenCalledWith(datos.merccanciaCalle);
            expect(storeMock.setMerccanciaNumeroExterior).toHaveBeenCalledWith(datos.merccanciaNumeroExterior);
            expect(storeMock.setMerccanciaNumeroInterior).toHaveBeenCalledWith(datos.merccanciaNumeroInterior);
            expect(storeMock.setMerccanciaCodigoPostal).toHaveBeenCalledWith(datos.merccanciaCodigoPostal);
            expect(storeMock.setDestruir).toHaveBeenCalledWith(datos.destruir);
            expect(storeMock.setTarifa).toHaveBeenCalledWith(datos.tarifa);
            expect(storeMock.setDestruccionEntidadFederativa).toHaveBeenCalledWith(datos.destruccionEntidadFederativa);
            expect(storeMock.setDestruccionAlcaldiaMunicipo).toHaveBeenCalledWith(datos.destruccionAlcaldiaMunicipo);
            expect(storeMock.setDestruccionColonia).toHaveBeenCalledWith(datos.destruccionColonia);
            expect(storeMock.setDestruccionCalle).toHaveBeenCalledWith(datos.destruccionCalle);
            expect(storeMock.setDestruccionNumeroExterior).toHaveBeenCalledWith(datos.destruccionNumeroExterior);
            expect(storeMock.setDestruccionNumeroInterior).toHaveBeenCalledWith(datos.destruccionNumeroInterior);
            expect(storeMock.setDestruccionCodigoPostal).toHaveBeenCalledWith(datos.destruccionCodigoPostal);
            expect(storeMock.setDestruccionHora).toHaveBeenCalledWith(datos.destruccionHora);
            expect(storeMock.setDesturccionProceso).toHaveBeenCalledWith(datos.desturccionProceso);
            expect(storeMock.setCasofortuito).toHaveBeenCalledWith(datos.casofortuito);
            expect(storeMock.setDonoMercancia).toHaveBeenCalledWith(datos.donoMercancia);
            expect(storeMock.setCondicionesMateriales).toHaveBeenCalledWith(datos.condicionesMateriales);
            expect(storeMock.setCaboDestruccionFecha).toHaveBeenCalledWith(datos.caboDestruccionFecha);
        });
    });
});