import { TestBed } from '@angular/core/testing';
import { SolicitudeDeArtificiosPirotecnicosService } from './solicitude-de-artificios-pirotecnicos.service';
import { HttpClient } from '@angular/common/http';
import { Tramite240308Store } from '../estados/tramite240308Store.store';
import { of } from 'rxjs';

describe('SolicitudeDeArtificiosPirotecnicosService', () => {
    let service: SolicitudeDeArtificiosPirotecnicosService;
    let httpMock: jest.Mocked<HttpClient>;
    let storeMock: jest.Mocked<Tramite240308Store>;

    beforeEach(() => {
        httpMock = {
            get: jest.fn()
        } as any;

        storeMock = {
            updateDatosDelTramiteFormState: jest.fn(),
            updateDestinatarioFinalTablaDatos: jest.fn(),
            updateJustificacionFormulario: jest.fn(),
            updateMercanciaTablaDatos: jest.fn(),
            updatePagoDerechosFormState: jest.fn(),
            updateProveedorTablaDatos: jest.fn()
        } as any;

        TestBed.configureTestingModule({
            providers: [
                SolicitudeDeArtificiosPirotecnicosService,
                { provide: HttpClient, useValue: httpMock },
                { provide: Tramite240308Store, useValue: storeMock }
            ]
        });

        service = TestBed.inject(SolicitudeDeArtificiosPirotecnicosService);
    });

    it('debería ser creado', () => {
        expect(service).toBeTruthy();
    });

    it('debería llamar a http.get y devolver un observable en obtenerDatos', (hecho) => {
        const respuestaMock = { datosDelTramite: {}, destinatarioFinalTablaDatos: [], justificacionTramiteFormState: {}, merccancialTablaDatos: [], pagoDerechos: {}, proveedorTablaDatos: [] };
        httpMock.get.mockReturnValue(of(respuestaMock));

        service.obtenerDatos().subscribe((resultado) => {
            expect(resultado).toBe(respuestaMock);
            expect(httpMock.get).toHaveBeenCalledWith('./assets/json/240308/datos.json');
            hecho();
        });
    });

    it('debería actualizar todos los slices del store en establecerDatosDeLaSolicitud', () => {
        const datosMock = {
            datosDelTramite: { a: 1 },
            destinatarioFinalTablaDatos: [{ b: 2 }],
            justificacionTramiteFormState: { c: 3 },
            merccancialTablaDatos: [{ d: 4 }],
            pagoDerechos: { e: 5 },
            proveedorTablaDatos: [{ f: 6 }]
        };

        service.establecerDatosDeLaSolicitud(datosMock as any);

        expect(storeMock.updateDatosDelTramiteFormState).toHaveBeenCalledWith(datosMock.datosDelTramite);
        expect(storeMock.updateDestinatarioFinalTablaDatos).toHaveBeenCalledWith(datosMock.destinatarioFinalTablaDatos);
        expect(storeMock.updateJustificacionFormulario).toHaveBeenCalledWith(datosMock.justificacionTramiteFormState);
        expect(storeMock.updateMercanciaTablaDatos).toHaveBeenCalledWith(datosMock.merccancialTablaDatos);
        expect(storeMock.updatePagoDerechosFormState).toHaveBeenCalledWith(datosMock.pagoDerechos);
        expect(storeMock.updateProveedorTablaDatos).toHaveBeenCalledWith(datosMock.proveedorTablaDatos);
    });
});