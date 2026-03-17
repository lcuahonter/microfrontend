import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LicitacionesDisponiblesService } from './licitaciones-disponibles.service';
import { Tramite120501Store } from '../estados/tramites/tramite120501.store';
import { Tramite120501Query } from '../estados/queries/tramite120501.query';
import { of } from 'rxjs';
import { COMUN_URL } from '@libs/shared/data-access-user/src';
import { PROC_120501 } from '../servers/api-route';

describe('LicitacionesDisponiblesService', () => {
    let service: LicitacionesDisponiblesService;
    let httpMock: HttpTestingController;
    let tramiteStoreSpy: jest.Mocked<Tramite120501Store>;
    let tramiteQuerySpy: jest.Mocked<Tramite120501Query>;

    const mockState = {
        rfc: 'TEST123456789',
        entidadFederativa: 'CDMX',
        representacionFederal: 'REP01',
        montoRecibir: 1000,
        idAsignacion: 123,
        licitacionesDatos: {
            licitacionPublica: {
                idLicitacion: 1,
                anio: 2024,
                cantidadMaxima: 100,
                fechaLimiteCalificacion: '2024-12-31',
                fechaConcurso: '2024-12-01',
                fechaInicioVigencia: '2024-01-01',
                fechaFinVigencia: '2024-12-31',
                fundamento: 'Test fundamento',
                ideTipoConstancia: 'TC01',
                ideTipoLicitacion: 'TL01',
                numeroLicitacion: 'LIC2024001',
                idMecanismoAsignacion: 'MA01',
                producto: 'Test producto',
                unidadMedidaTarifaria: 'KG',
                bloqueComercial: 'TLCAN',
                paises: 'México'
            },
            fraccionArancelaria: 'FA123456',
            maximoTransferir: 500,
            montoTransferir: 300
        }
    } as any;

    beforeEach(() => {
        const storeSpy = {
            actualizarEstado: jest.fn()
        } as any;

        const querySpy = {
            selectSolicitud$: of(mockState)
        } as any;

        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                LicitacionesDisponiblesService,
                { provide: Tramite120501Store, useValue: storeSpy },
                { provide: Tramite120501Query, useValue: querySpy }
            ]
        });

        service = TestBed.inject(LicitacionesDisponiblesService);
        httpMock = TestBed.inject(HttpTestingController);
        tramiteStoreSpy = TestBed.inject(Tramite120501Store) as jest.Mocked<Tramite120501Store>;
        tramiteQuerySpy = TestBed.inject(Tramite120501Query) as jest.Mocked<Tramite120501Query>;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
        expect(service.host).toBe(COMUN_URL.BASE_URL);
    });

    it('should get licitaciones disponibles data', (done) => {
        const mockData = [{ id: 1, name: 'Test Licitacion' }];

        service.getData().subscribe(data => {
            expect(data).toEqual(mockData);
            done();
        });

        const req = httpMock.expectOne('assets/json/120501/licitaciones-disponibles.json');
        expect(req.request.method).toBe('GET');
        req.flush(mockData);
    });

    it('should get entidades federativas catalog', (done) => {
        const tramite = '120501';
        const mockResponse = { datos: [{ id: 1, nombre: 'CDMX' }] };

        service.entidadesFederativasCatalogo(tramite).subscribe(response => {
            expect(response).toEqual(mockResponse);
            done();
        });

        const req = httpMock.expectOne(`${service.host}${tramite}/entidades-federativas`);
        expect(req.request.method).toBe('GET');
        req.flush(mockResponse);
    });

    it('should get representacion federal catalog', (done) => {
        const tramite = '120501';
        const cveEntidad = 'CDMX';
        const mockResponse = { datos: [{ id: 1, nombre: 'Representacion' }] };

        service.representacionFederalCatalogo(tramite, cveEntidad).subscribe(response => {
            expect(response).toEqual(mockResponse);
            done();
        });

        const req = httpMock.expectOne(`${service.host}${tramite}/representacion-federal/${cveEntidad}`);
        expect(req.request.method).toBe('GET');
        req.flush(mockResponse);
    });

    it('should return state from query', (done) => {
        service.getAllState().subscribe(state => {
            expect(state).toEqual(mockState);
            done();
        });
    });

    it('should get licitaciones for RFC', (done) => {
        const rfc = 'TEST123456789';
        const mockResponse = { data: 'test' };

        service.getLicitacionesDisponiblesData(rfc).subscribe(response => {
            expect(response).toEqual(mockResponse);
            done();
        });

        const req = httpMock.expectOne(`${PROC_120501.PREFILLED}/${rfc}`);
        expect(req.request.method).toBe('GET');
        req.flush(mockResponse);
    });

    it('should fetch RFC data successfully', (done) => {
        const rfc = 'TEST123456789';
        const idLicitacion = 1;
        const mockParticipanteData = { nombre: 'Test Participante' };
        const mockResponse = { datos: mockParticipanteData };

        service.fetchRFCData(rfc, idLicitacion).subscribe(data => {
            expect(data).toEqual(mockParticipanteData);
            done();
        });

        const req = httpMock.expectOne(`${PROC_120501.FETCH_RFC}/${rfc}/${idLicitacion}`);
        expect(req.request.method).toBe('GET');
        req.flush(mockResponse);
    });

    it('should throw error when no data in response', (done) => {
        const rfc = 'TEST123456789';
        const idLicitacion = 1;
        const mockResponse = { datos: null };

        service.fetchRFCData(rfc, idLicitacion).subscribe({
            next: () => {
                fail('Should have thrown an error');
                done();
            },
            error: (error) => {
                expect(error.message).toBe('No se encontraron datos en la respuesta');
                done();
            }
        });

        const req = httpMock.expectOne(`${PROC_120501.FETCH_RFC}/${rfc}/${idLicitacion}`);
        req.flush(mockResponse);
    });

    it('should handle HTTP error', (done) => {
        const rfc = 'TEST123456789';
        const idLicitacion = 1;

        service.fetchRFCData(rfc, idLicitacion).subscribe({
            error: (error) => {
                expect(error.message).toContain('Ocurrió un error al devolver la información');
                done();
            }
        });

        const req = httpMock.expectOne(`${PROC_120501.FETCH_RFC}/${rfc}/${idLicitacion}`);
        req.error(new ErrorEvent('Network error'));
    });

    it('should post form data for licitaciones', (done) => {
        const body = { test: 'data' };
        const mockResponse = { success: true };

        service.getLicitacionesFormData(body).subscribe(response => {
            expect(response).toEqual(mockResponse);
            done();
        });

        const req = httpMock.expectOne(PROC_120501.BUSCAR);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(body);
        req.flush(mockResponse);
    });

    it('should post data to save', (done) => {
        const body = { test: 'data' };
        const mockResponse = { success: true };

        service.guardarDatosPost(body).subscribe(response => {
            expect(response).toEqual(mockResponse);
            done();
        });

        const req = httpMock.expectOne(PROC_120501.GUARDAR);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(body);
        req.flush(mockResponse);
    });

    it('should get vigentes data', (done) => {
        service.getLicitationesVigentesData().subscribe(data => {
            expect(data).toEqual(mockState);
            done();
        });

        const req = httpMock.expectOne('assets/json/120501/solicitar-transferencia-cupos.json');
        expect(req.request.method).toBe('GET');
        req.flush(mockState);
    });

    it('should update store state', () => {
        service.actualizarEstadoFormulario(mockState);
        expect(tramiteStoreSpy.actualizarEstado).toHaveBeenCalledWith(mockState);
    });

    it('should generate correct payload', () => {
        const result = service.getGuardarPayload(mockState);

        expect(result['entidadFederativa']).toEqual({
            entidad: { clave: mockState.entidadFederativa }
        });
        expect(result['idSolicitud']).toBeNull();
        expect(result['unidadAdministrativaRepresentacionFederal']).toEqual({
            clave: mockState.representacionFederal
        });
        expect((result['licitacion'] as any).idLicitacion).toBe(1);
        expect(result['fraccionArancelaria']).toBe(mockState.licitacionesDatos.fraccionArancelaria);
        expect((result['solicitud'] as any).participante.rfc).toBe(mockState.rfc);
        expect((result['solicitud'] as any).montoRecibir).toBe(mockState.montoRecibir);
    });

    it('should handle missing licitacion data', () => {
        const stateWithoutLicitacion = { ...mockState, licitacionesDatos: {} };
        const result = service.getGuardarPayload(stateWithoutLicitacion);

        expect((result['licitacion'] as any).idLicitacion).toBe(0);
    });

    it('should handle undefined licitacionesDatos', () => {
        const stateWithoutLicitacionesDatos = { ...mockState, licitacionesDatos: undefined };
        
        expect(() => service.getGuardarPayload(stateWithoutLicitacionesDatos)).toThrow();
    });

    it('should handle missing licitacionPublica in licitacionesDatos', () => {
        const stateWithoutLicitacionPublica = { 
            ...mockState, 
            licitacionesDatos: { 
                fraccionArancelaria: 'FA123456',
                maximoTransferir: 500,
                montoTransferir: 300
            }
        };
        const result = service.getGuardarPayload(stateWithoutLicitacionPublica);

        expect((result['licitacion'] as any).idLicitacion).toBe(0);
        expect((result['licitacion'] as any).anio).toBeUndefined();
        expect((result['licitacion'] as any).cantidadMaxima).toBeUndefined();
    });

    it('should handle empty licitacionPublica object', () => {
        const stateWithEmptyLicitacionPublica = { 
            ...mockState, 
            licitacionesDatos: { 
                licitacionPublica: {},
                fraccionArancelaria: 'FA123456',
                maximoTransferir: 500,
                montoTransferir: 300
            }
        };
        const result = service.getGuardarPayload(stateWithEmptyLicitacionPublica);

        expect((result['licitacion'] as any).idLicitacion).toBe(0);
        expect((result['licitacion'] as any).anio).toBeUndefined();
    });

    it('should handle all licitacionPublica properties being undefined', () => {
        const stateWithUndefinedProperties = { 
            ...mockState, 
            licitacionesDatos: { 
                licitacionPublica: {
                    idLicitacion: undefined,
                    anio: undefined,
                    cantidadMaxima: undefined,
                    fechaLimiteCalificacion: undefined,
                    fechaConcurso: undefined,
                    fechaInicioVigencia: undefined,
                    fechaFinVigencia: undefined,
                    fundamento: undefined,
                    ideTipoConstancia: undefined,
                    ideTipoLicitacion: undefined,
                    numeroLicitacion: undefined,
                    idMecanismoAsignacion: undefined,
                    producto: undefined,
                    unidadMedidaTarifaria: undefined,
                    bloqueComercial: undefined,
                    paises: undefined
                },
                fraccionArancelaria: 'FA123456',
                maximoTransferir: 500,
                montoTransferir: 300
            }
        };
        const result = service.getGuardarPayload(stateWithUndefinedProperties);

        expect((result['licitacion'] as any).idLicitacion).toBe(0);
        expect((result['licitacion'] as any).anio).toBeUndefined();
        expect((result['licitacion'] as any).cantidadMaxima).toBeUndefined();
    });

    it('should handle null values in licitacionPublica', () => {
        const stateWithNullValues = { 
            ...mockState, 
            licitacionesDatos: { 
                licitacionPublica: {
                    idLicitacion: null,
                    anio: null,
                    cantidadMaxima: null,
                    fechaLimiteCalificacion: null,
                    fechaConcurso: null,
                    fechaInicioVigencia: null,
                    fechaFinVigencia: null,
                    fundamento: null,
                    ideTipoConstancia: null,
                    ideTipoLicitacion: null,
                    numeroLicitacion: null,
                    idMecanismoAsignacion: null,
                    producto: null,
                    unidadMedidaTarifaria: null,
                    bloqueComercial: null,
                    paises: null
                },
                fraccionArancelaria: 'FA123456',
                maximoTransferir: 500,
                montoTransferir: 300
            }
        };
        const result = service.getGuardarPayload(stateWithNullValues);

        expect((result['licitacion'] as any).idLicitacion).toBe(0);
        expect((result['licitacion'] as any).anio).toBeNull();
        expect((result['licitacion'] as any).cantidadMaxima).toBeNull();
    });

    it('should handle error when fetchRFCData receives null datos', (done) => {
        const rfc = 'TEST123456789';
        const idLicitacion = 1;
        const mockResponse = { datos: null };

        service.fetchRFCData(rfc, idLicitacion).subscribe({
            next: () => {
                fail('Should have thrown an error');
                done();
            },
            error: (error) => {
                expect(error.message).toBe('No se encontraron datos en la respuesta');
                done();
            }
        });

        const req = httpMock.expectOne(`${PROC_120501.FETCH_RFC}/${rfc}/${idLicitacion}`);
        req.flush(mockResponse);
    });

    it('should handle error when fetchRFCData receives undefined datos', (done) => {
        const rfc = 'TEST123456789';
        const idLicitacion = 1;
        const mockResponse = { datos: undefined };

        service.fetchRFCData(rfc, idLicitacion).subscribe({
            next: () => {
                fail('Should have thrown an error');
                done();
            },
            error: (error) => {
                expect(error.message).toBe('No se encontraron datos en la respuesta');
                done();
            }
        });

        const req = httpMock.expectOne(`${PROC_120501.FETCH_RFC}/${rfc}/${idLicitacion}`);
        req.flush(mockResponse);
    });

    it('should handle fetchRFCData network error with proper error message', (done) => {
        const rfc = 'TEST123456789';
        const idLicitacion = 1;
        const expectedEndpoint = `${PROC_120501.FETCH_RFC}/${rfc}/${idLicitacion}`;

        service.fetchRFCData(rfc, idLicitacion).subscribe({
            next: () => {
                fail('Should have thrown an error');
                done();
            },
            error: (error) => {
                expect(error.message).toBe(`Ocurrió un error al devolver la información ${expectedEndpoint} `);
                done();
            }
        });

        const req = httpMock.expectOne(expectedEndpoint);
        req.error(new ErrorEvent('Network error'), { status: 500, statusText: 'Internal Server Error' });
    });

    it('should handle fetchRFCData with empty response object', (done) => {
        const rfc = 'TEST123456789';
        const idLicitacion = 1;
        const mockResponse = {};

        service.fetchRFCData(rfc, idLicitacion).subscribe({
            next: () => {
                fail('Should have thrown an error');
                done();
            },
            error: (error) => {
                expect(error.message).toBe('No se encontraron datos en la respuesta');
                done();
            }
        });

        const req = httpMock.expectOne(`${PROC_120501.FETCH_RFC}/${rfc}/${idLicitacion}`);
        req.flush(mockResponse);
    });

    it('should verify correct endpoint construction for entidades federativas', (done) => {
        const tramite = '120501';
        const expectedEndpoint = `${service.host}${tramite}/entidades-federativas`;
        const mockResponse = { datos: [] };

        service.entidadesFederativasCatalogo(tramite).subscribe();

        const req = httpMock.expectOne(expectedEndpoint);
        expect(req.request.url).toBe(expectedEndpoint);
        req.flush(mockResponse);
        done();
    });

    it('should verify correct endpoint construction for representacion federal', (done) => {
        const tramite = '120501';
        const cveEntidad = 'CDMX';
        const expectedEndpoint = `${service.host}${tramite}/representacion-federal/${cveEntidad}`;
        const mockResponse = { datos: [] };

        service.representacionFederalCatalogo(tramite, cveEntidad).subscribe();

        const req = httpMock.expectOne(expectedEndpoint);
        expect(req.request.url).toBe(expectedEndpoint);
        req.flush(mockResponse);
        done();
    });

    it('should handle special characters in RFC for getLicitacionesDisponiblesData', (done) => {
        const rfc = 'TEST#123@456';
        const expectedEndpoint = `${PROC_120501.PREFILLED}/${rfc}`;
        const mockResponse = { data: 'test' };

        service.getLicitacionesDisponiblesData(rfc).subscribe(response => {
            expect(response).toEqual(mockResponse);
            done();
        });

        const req = httpMock.expectOne(expectedEndpoint);
        req.flush(mockResponse);
    });

    it('should handle different content types for POST requests', (done) => {
        const body = { test: 'data', nested: { value: 123 } };
        const mockResponse = { success: true };

        service.getLicitacionesFormData(body).subscribe(response => {
            expect(response).toEqual(mockResponse);
            done();
        });

        const req = httpMock.expectOne(PROC_120501.BUSCAR);
        expect(req.request.headers.get('content-type')).toBeNull(); // Angular sets this automatically
        req.flush(mockResponse);
    });

    it('should handle HTTP errors in entidades federativas catalog', (done) => {
        const tramite = '120501';
        
        service.entidadesFederativasCatalogo(tramite).subscribe({
            next: () => {
                fail('Should have thrown an error');
                done();
            },
            error: (error) => {
                expect(error.status).toBe(500);
                done();
            }
        });

        const req = httpMock.expectOne(`${service.host}${tramite}/entidades-federativas`);
        req.error(new ErrorEvent('Network error'), { status: 500, statusText: 'Internal Server Error' });
    });

    it('should handle HTTP errors in representacion federal catalog', (done) => {
        const tramite = '120501';
        const cveEntidad = 'CDMX';
        
        service.representacionFederalCatalogo(tramite, cveEntidad).subscribe({
            next: () => {
                fail('Should have thrown an error');
                done();
            },
            error: (error) => {
                expect(error.status).toBe(404);
                done();
            }
        });

        const req = httpMock.expectOne(`${service.host}${tramite}/representacion-federal/${cveEntidad}`);
        req.error(new ErrorEvent('Not found'), { status: 404, statusText: 'Not Found' });
    });

    it('should handle HTTP errors in getLicitacionesDisponiblesData', (done) => {
        const rfc = 'TEST123456789';
        
        service.getLicitacionesDisponiblesData(rfc).subscribe({
            next: () => {
                fail('Should have thrown an error');
                done();
            },
            error: (error) => {
                expect(error.status).toBe(500);
                done();
            }
        });

        const req = httpMock.expectOne(`${PROC_120501.PREFILLED}/${rfc}`);
        req.error(new ErrorEvent('Server error'), { status: 500, statusText: 'Internal Server Error' });
    });

    it('should handle HTTP errors in getLicitacionesFormData', (done) => {
        const body = { test: 'data' };
        
        service.getLicitacionesFormData(body).subscribe({
            next: () => {
                fail('Should have thrown an error');
                done();
            },
            error: (error) => {
                expect(error.status).toBe(400);
                done();
            }
        });

        const req = httpMock.expectOne(PROC_120501.BUSCAR);
        req.error(new ErrorEvent('Bad request'), { status: 400, statusText: 'Bad Request' });
    });

    it('should handle HTTP errors in guardarDatosPost', (done) => {
        const body = { test: 'data' };
        
        service.guardarDatosPost(body).subscribe({
            next: () => {
                fail('Should have thrown an error');
                done();
            },
            error: (error) => {
                expect(error.status).toBe(422);
                done();
            }
        });

        const req = httpMock.expectOne(PROC_120501.GUARDAR);
        req.error(new ErrorEvent('Unprocessable entity'), { status: 422, statusText: 'Unprocessable Entity' });
    });

    it('should handle HTTP errors in getLicitationesVigentesData', (done) => {
        service.getLicitationesVigentesData().subscribe({
            next: () => {
                fail('Should have thrown an error');
                done();
            },
            error: (error) => {
                expect(error.status).toBe(404);
                done();
            }
        });

        const req = httpMock.expectOne('assets/json/120501/solicitar-transferencia-cupos.json');
        req.error(new ErrorEvent('File not found'), { status: 404, statusText: 'Not Found' });
    });

    it('should handle HTTP errors in getData', (done) => {
        service.getData().subscribe({
            next: () => {
                fail('Should have thrown an error');
                done();
            },
            error: (error) => {
                expect(error.status).toBe(404);
                done();
            }
        });

        const req = httpMock.expectOne('assets/json/120501/licitaciones-disponibles.json');
        req.error(new ErrorEvent('File not found'), { status: 404, statusText: 'Not Found' });
    });

    it('should generate payload with complete licitacion data mapping', () => {
        const result = service.getGuardarPayload(mockState);
        const licitacion = result['licitacion'] as any;

        expect(licitacion.idLicitacion).toBe(mockState.licitacionesDatos.licitacionPublica.idLicitacion);
        expect(licitacion.anio).toBe(mockState.licitacionesDatos.licitacionPublica.anio);
        expect(licitacion.cantidadMaxima).toBe(mockState.licitacionesDatos.licitacionPublica.cantidadMaxima);
        expect(licitacion.fechaLimiteCalificacion).toBe(mockState.licitacionesDatos.licitacionPublica.fechaLimiteCalificacion);
        expect(licitacion.fechaConcurso).toBe(mockState.licitacionesDatos.licitacionPublica.fechaConcurso);
        expect(licitacion.fechaInicioVigencia).toBe(mockState.licitacionesDatos.licitacionPublica.fechaInicioVigencia);
        expect(licitacion.fechaFinVigencia).toBe(mockState.licitacionesDatos.licitacionPublica.fechaFinVigencia);
        expect(licitacion.fundamento).toBe(mockState.licitacionesDatos.licitacionPublica.fundamento);
        expect(licitacion.ideTipoConstancia).toBe(mockState.licitacionesDatos.licitacionPublica.ideTipoConstancia);
        expect(licitacion.ideTipoLicitacion).toBe(mockState.licitacionesDatos.licitacionPublica.ideTipoLicitacion);
        expect(licitacion.numeroLicitacion).toBe(mockState.licitacionesDatos.licitacionPublica.numeroLicitacion);
        expect(licitacion.idMecanismoAsignacion).toBe(mockState.licitacionesDatos.licitacionPublica.idMecanismoAsignacion);
        expect(licitacion.producto).toBe(mockState.licitacionesDatos.licitacionPublica.producto);
        expect(licitacion.unidadMedidaTarifaria).toBe(mockState.licitacionesDatos.licitacionPublica.unidadMedidaTarifaria);
        expect(licitacion.bloqueComercial).toBe(mockState.licitacionesDatos.licitacionPublica.bloqueComercial);
        expect(licitacion.paises).toBe(mockState.licitacionesDatos.licitacionPublica.paises);
    });

    it('should generate payload with complete solicitud data mapping', () => {
        const result = service.getGuardarPayload(mockState);
        const solicitud = result['solicitud'] as any;

        expect(solicitud.participante.rfc).toBe(mockState.rfc);
        expect(solicitud.solicitante.rfc).toBe(mockState.rfc);
        expect(solicitud.solicitante.nombre).toBe('ACEROS ALVARADO S.A. DE C.V.');
        expect(solicitud.maximoTransferir).toBe(mockState.licitacionesDatos.maximoTransferir);
        expect(solicitud.montoTransferir).toBe(mockState.licitacionesDatos.montoTransferir);
        expect(solicitud.montoRecibir).toBe(mockState.montoRecibir);
        expect(solicitud.idAsignacion).toBe(mockState.idAsignacion);
    });

    it('should generate payload with null root level values', () => {
        const stateWithNulls = {
            ...mockState,
            rfc: null,
            entidadFederativa: null,
            representacionFederal: null,
            montoRecibir: null,
            idAsignacion: null
        };
        
        const result = service.getGuardarPayload(stateWithNulls);
        
        expect(result['entidadFederativa']).toEqual({ entidad: { clave: null } });
        expect(result['unidadAdministrativaRepresentacionFederal']).toEqual({ clave: null });
        expect((result['solicitud'] as any).participante.rfc).toBeNull();
        expect((result['solicitud'] as any).montoRecibir).toBeNull();
        expect((result['solicitud'] as any).idAsignacion).toBeNull();
    });

    it('should generate payload with undefined root level values', () => {
        const stateWithUndefined = {
            ...mockState,
            rfc: undefined,
            entidadFederativa: undefined,
            representacionFederal: undefined,
            montoRecibir: undefined,
            idAsignacion: undefined
        };
        
        const result = service.getGuardarPayload(stateWithUndefined);
        
        expect(result['entidadFederativa']).toEqual({ entidad: { clave: undefined } });
        expect(result['unidadAdministrativaRepresentacionFederal']).toEqual({ clave: undefined });
        expect((result['solicitud'] as any).participante.rfc).toBeUndefined();
        expect((result['solicitud'] as any).montoRecibir).toBeUndefined();
        expect((result['solicitud'] as any).idAsignacion).toBeUndefined();
    });

    it('should verify all static values in payload', () => {
        const result = service.getGuardarPayload(mockState);
        const solicitud = result['solicitud'] as any;
        
        expect(result['idSolicitud']).toBeNull();
        expect(solicitud.solicitante.nombre).toBe('ACEROS ALVARADO S.A. DE C.V.');
        expect(solicitud.solicitante.actividad_economica).toBe('Fabricación de productos de hierro y acero');
        expect(solicitud.solicitante.correo_electronico).toBe('contacto@acerosalvarado.com');
        expect(solicitud.solicitante.certificado_serial_number).toBe('SN123456789');
        expect(solicitud.solicitante.domicilio.pais).toBe('México');
        expect(solicitud.solicitante.domicilio.codigo_postal).toBe('06700');
        expect(solicitud.solicitante.domicilio.estado).toBe('Ciudad de México');
    });

    it('should verify host property initialization in constructor', () => {
        expect(service.host).toBeDefined();
        expect(typeof service.host).toBe('string');
        expect(service.host).toBe(COMUN_URL.BASE_URL);
    });

    it('should handle empty string RFC values', (done) => {
        const rfc = '';
        const mockResponse = { data: 'test' };

        service.getLicitacionesDisponiblesData(rfc).subscribe(response => {
            expect(response).toEqual(mockResponse);
            done();
        });

        const req = httpMock.expectOne(`${PROC_120501.PREFILLED}/`);
        req.flush(mockResponse);
    });

    it('should handle empty string tramite values in catalog methods', (done) => {
        const tramite = '';
        const mockResponse = { datos: [] };

        service.entidadesFederativasCatalogo(tramite).subscribe(response => {
            expect(response).toEqual(mockResponse);
            done();
        });

        const req = httpMock.expectOne(`${service.host}/entidades-federativas`);
        req.flush(mockResponse);
    });

    it('should verify idMecanismoAsignacion type compatibility in payload', () => {
        // Testing with different idMecanismoAsignacion types
        const stateWithStringIdMecanismo = {
            ...mockState,
            licitacionesDatos: {
                ...mockState.licitacionesDatos,
                licitacionPublica: {
                    ...mockState.licitacionesDatos.licitacionPublica,
                    idMecanismoAsignacion: 'STRING_VALUE'
                }
            }
        };
        
        const result = service.getGuardarPayload(stateWithStringIdMecanismo);
        const licitacion = result['licitacion'] as any;
        
        expect(licitacion.idMecanismoAsignacion).toBe('STRING_VALUE');
    });

    it('should handle zero values correctly in payload', () => {
        const stateWithZeros = {
            ...mockState,
            montoRecibir: 0,
            idAsignacion: 0,
            licitacionesDatos: {
                ...mockState.licitacionesDatos,
                maximoTransferir: 0,
                montoTransferir: 0,
                licitacionPublica: {
                    ...mockState.licitacionesDatos.licitacionPublica,
                    idLicitacion: 0,
                    anio: 0,
                    cantidadMaxima: 0
                }
            }
        };
        
        const result = service.getGuardarPayload(stateWithZeros);
        const solicitud = result['solicitud'] as any;
        const licitacion = result['licitacion'] as any;
        
        expect(solicitud.montoRecibir).toBe(0);
        expect(solicitud.idAsignacion).toBe(0);
        expect(solicitud.maximoTransferir).toBe(0);
        expect(solicitud.montoTransferir).toBe(0);
        expect(licitacion.idLicitacion).toBe(0);
        expect(licitacion.anio).toBe(0);
        expect(licitacion.cantidadMaxima).toBe(0);
    });

});