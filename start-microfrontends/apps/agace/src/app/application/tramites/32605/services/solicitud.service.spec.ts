import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SolicitudService } from './solicitud.service';
import { Solicitud32605Store, Solicitud32605State } from '../estados/solicitud32605.store';
import {
    RecibirNotificaciones,
    EnlaceOperativo,
    RepresentanteLegal,
    SolicitudRadioLista,
    SolicitudCatologoSelectLista,
    SeccionSubcontratados,
    Inventarios,
    GuardarDatosFormulario,
    RFCEnlaceOperativo,
    TransportistasListaInterface,
    InputRadio
} from '../models/solicitud.model';
import { PersonaRespuestaTabla, TablaPersonasNotificaciones } from '../models/personas-notificaciones-tabla.model';
import { Catalogo } from '@libs/shared/data-access-user/src';
import { ApiResponse, BuscarRfcResponse, InstalacionesInterface } from '../models/oea-textil-registro.model';

describe('SolicitudService', () => {
    let service: SolicitudService;
    let httpMock: HttpTestingController;
    let mockStore: jest.Mocked<Solicitud32605Store>;

    beforeEach(() => {
        mockStore = {
            actualizarEstado: jest.fn()
        } as any;

        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                SolicitudService,
                { provide: Solicitud32605Store, useValue: mockStore }
            ]
        });

        service = TestBed.inject(SolicitudService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
        jest.clearAllMocks();
    });

    describe('Constructor', () => {
        it('debe crear el servicio correctamente', () => {
            expect(service).toBeTruthy();
        });

        it('debe inyectar HttpClient y Solicitud32605Store correctamente', () => {
            expect(service['http']).toBeDefined();
            expect(service.solicitud32605Store).toBeDefined();
            expect(service.solicitud32605Store).toBe(mockStore);
        });
    });

    describe('conseguirRecibirNotificaciones', () => {
        it('debe obtener la lista de opciones para recibir notificaciones', () => {
            const mockResponse: RecibirNotificaciones[] = [
                {
                    rfc: 'ABCD123456EFG',
                    curp: 'ABCD123456HDFGHJ01',
                    nombre: 'Juan',
                    apellidoPaterno: 'Pérez',
                    apellidoMaterno: 'García'
                },
                {
                    rfc: 'EFGH789012IJK',
                    curp: 'EFGH789012MNOPQR02',
                    nombre: 'María',
                    apellidoPaterno: 'López',
                    apellidoMaterno: 'Martínez'
                }
            ];

            service.conseguirRecibirNotificaciones().subscribe(response => {
                expect(response).toEqual(mockResponse);
                expect(response.length).toBe(2);
                expect(response[0].rfc).toBe('ABCD123456EFG');
            });

            const req = httpMock.expectOne('assets/json/32605/recibir-notificaciones.json');
            expect(req.request.method).toBe('GET');
            req.flush(mockResponse);
        });

        it('debe manejar errores de HTTP correctamente', () => {
            service.conseguirRecibirNotificaciones().subscribe({
                next: () => fail('Should have failed'),
                error: (error) => {
                    expect(error.status).toBe(404);
                }
            });

            const req = httpMock.expectOne('assets/json/32605/recibir-notificaciones.json');
            req.flush('Not Found', { status: 404, statusText: 'Not Found' });
        });

        it('debe retornar array vacío cuando no hay datos', () => {
            const mockResponse: RecibirNotificaciones[] = [];

            service.conseguirRecibirNotificaciones().subscribe(response => {
                expect(response).toEqual([]);
                expect(Array.isArray(response)).toBeTruthy();
            });

            const req = httpMock.expectOne('assets/json/32605/recibir-notificaciones.json');
            req.flush(mockResponse);
        });
    });

    describe('conseguirEnlaceOperativoDatos', () => {
        it('debe obtener la lista de enlaces operativos', () => {
            const mockResponse: EnlaceOperativo[] = [
                {
                    rfc: 'JUAN851201ABC',
                    nombre: 'Juan',
                    apellidoPaterno: 'Perez',
                    apellidoMaterno: 'García',
                    claveCiudad: '09001',
                    ciudad: 'Ciudad de México',
                    cargo: 'Director',
                    telefono: '5551234567',
                    correo: 'juan@empresa.com',
                    suplente: 'NO',
                    calle: 'Av. Principal',
                    numeroExterior: '123',
                    numeroInterior: '1',
                    colonia: 'Centro',
                    codigoPostal: '06000',
                    localidad: 'Cuauhtémoc',
                    delegacionMunicipio: 'Cuauhtémoc'
                }
            ];

            service.conseguirEnlaceOperativoDatos().subscribe(response => {
                expect(response).toEqual(mockResponse);
                expect(response.length).toBe(1);
                expect(response[0].rfc).toBe('JUAN851201ABC');
            });

            const req = httpMock.expectOne('assets/json/32605/enlace-operativo-datos.json');
            expect(req.request.method).toBe('GET');
            req.flush(mockResponse);
        });

        it('debe retornar array vacío cuando no hay datos', () => {
            const mockResponse: EnlaceOperativo[] = [];

            service.conseguirEnlaceOperativoDatos().subscribe(response => {
                expect(response).toEqual([]);
                expect(Array.isArray(response)).toBeTruthy();
            });

            const req = httpMock.expectOne('assets/json/32605/enlace-operativo-datos.json');
            req.flush(mockResponse);
        });

        it('debe manejar errores de HTTP para enlace operativo', () => {
            service.conseguirEnlaceOperativoDatos().subscribe({
                next: () => fail('Should have failed'),
                error: (error) => {
                    expect(error.status).toBe(500);
                }
            });

            const req = httpMock.expectOne('assets/json/32605/enlace-operativo-datos.json');
            req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });
        });
    });

    describe('conseguirRepresentanteLegalDatos', () => {
        it('debe obtener los datos del representante legal', () => {
            const mockResponse: RepresentanteLegal = {
                idPersonaSolicitud: '12345',
                rfcTercero: 'TERC123456ABC',
                rfc: 'REPR123456DEF',
                nombre: 'Carlos Rodriguez',
                apellidoPaterno: 'Martínez',
                apellidoMaterno: 'López',
                telefono: '5551234567',
                correoElectronico: 'carlos@empresa.com'
            };

            service.conseguirRepresentanteLegalDatos().subscribe(response => {
                expect(response).toEqual(mockResponse);
                expect(response.rfc).toBe('REPR123456DEF');
                expect(response.nombre).toBe('Carlos Rodriguez');
            });

            const req = httpMock.expectOne('assets/json/32605/representante-legal-datos.json');
            expect(req.request.method).toBe('GET');
            req.flush(mockResponse);
        });

        it('debe manejar respuesta con datos vacíos', () => {
            const mockResponse: RepresentanteLegal = {
                rfcTercero: '',
                rfc: '',
                nombre: '',
                apellidoPaterno: '',
                apellidoMaterno: '',
                telefono: '',
                correoElectronico: ''
            };

            service.conseguirRepresentanteLegalDatos().subscribe(response => {
                expect(response).toEqual(mockResponse);
                expect(response.rfc).toBe('');
            });

            const req = httpMock.expectOne('assets/json/32605/representante-legal-datos.json');
            req.flush(mockResponse);
        });
    });

    describe('conseguirOpcionDeRadio', () => {
        it('debe obtener las opciones de radio de la solicitud', () => {
            const mockInputRadio: InputRadio = {
                radioOptions: [
                    {
                        label: 'Sí',
                        value: 'si'
                    }
                ],
                isRequired: true
            };

            const mockResponse: SolicitudRadioLista = {
                requisitos: mockInputRadio,
                clasificacionInformacion: mockInputRadio,
                reconocimientoMutuo: mockInputRadio
            };

            service.conseguirOpcionDeRadio().subscribe(response => {
                expect(response).toEqual(mockResponse);
                expect(response.requisitos).toBeDefined();
                expect(response.clasificacionInformacion).toBeDefined();
                expect(response.reconocimientoMutuo).toBeDefined();
            });

            const req = httpMock.expectOne('assets/json/32605/solicitud-radio-lista.json');
            expect(req.request.method).toBe('GET');
            req.flush(mockResponse);
        });
    });

    describe('conseguirSolicitudCatologoSelectLista', () => {
        it('debe obtener los catálogos selectivos de la solicitud', () => {
            const mockResponse: SolicitudCatologoSelectLista = {} as SolicitudCatologoSelectLista;

            service.conseguirSolicitudCatologoSelectLista().subscribe(response => {
                expect(response).toEqual(mockResponse);
            });

            const req = httpMock.expectOne('assets/json/32605/solicitud-catologo-select-lista.json');
            expect(req.request.method).toBe('GET');
            req.flush(mockResponse);
        });
    });

    describe('conseguirSeccionSubcontratados', () => {
        it('debe obtener los datos de la sección de subcontratados', () => {
            const mockResponse: SeccionSubcontratados = {} as SeccionSubcontratados;

            service.conseguirSeccionSubcontratados().subscribe(response => {
                expect(response).toEqual(mockResponse);
            });

            const req = httpMock.expectOne('assets/json/32605/seccion-subcontratados.json');
            expect(req.request.method).toBe('GET');
            req.flush(mockResponse);
        });
    });

    describe('conseguirInventarios', () => {
        it('debe obtener los inventarios registrados', () => {
            const mockResponse: Inventarios[] = [
                {} as Inventarios,
                {} as Inventarios
            ];

            service.conseguirInventarios().subscribe(response => {
                expect(response).toEqual(mockResponse);
                expect(response.length).toBe(2);
            });

            const req = httpMock.expectOne('assets/json/32605/inventarios-datos.json');
            expect(req.request.method).toBe('GET');
            req.flush(mockResponse);
        });

        it('debe manejar lista vacía de inventarios', () => {
            const mockResponse: Inventarios[] = [];

            service.conseguirInventarios().subscribe(response => {
                expect(response).toEqual([]);
                expect(response.length).toBe(0);
            });

            const req = httpMock.expectOne('assets/json/32605/inventarios-datos.json');
            req.flush(mockResponse);
        });
    });

    describe('guardarDatosFormulario', () => {
        it('debe obtener los datos guardados del formulario', () => {
            const mockResponse: GuardarDatosFormulario = {} as GuardarDatosFormulario;

            service.guardarDatosFormulario().subscribe(response => {
                expect(response).toEqual(mockResponse);
            });

            const req = httpMock.expectOne('assets/json/32605/guardar-datos-formulario.json');
            expect(req.request.method).toBe('GET');
            req.flush(mockResponse);
        });
    });

    describe('conseguirDatosPorRFC', () => {
        it('debe obtener datos de empresa por RFC', () => {
            const rfc = 'ABC123456DEF';
            const mockResponse: { [key: string]: RFCEnlaceOperativo } = {
                [rfc]: {} as RFCEnlaceOperativo
            };

            service.conseguirDatosPorRFC(rfc).subscribe(response => {
                expect(response).toEqual(mockResponse);
                expect(response[rfc]).toBeDefined();
            });

            const req = httpMock.expectOne('assets/json/32605/rfc-datos.json');
            expect(req.request.method).toBe('GET');
            req.flush(mockResponse);
        });

        it('debe manejar RFC no encontrado', () => {
            const rfc = 'NOTFOUND123';
            const mockResponse: { [key: string]: RFCEnlaceOperativo } = {};

            service.conseguirDatosPorRFC(rfc).subscribe(response => {
                expect(response).toEqual(mockResponse);
                expect(response[rfc]).toBeUndefined();
            });

            const req = httpMock.expectOne('assets/json/32605/rfc-datos.json');
            req.flush(mockResponse);
        });

        it('debe ignorar el parámetro RFC y hacer la petición al endpoint fijo', () => {
            const rfc1 = 'RFC1';
            const rfc2 = 'RFC2';
            const mockResponse = { test: 'data' };

            service.conseguirDatosPorRFC(rfc1).subscribe();
            service.conseguirDatosPorRFC(rfc2).subscribe();

            const requests = httpMock.match('assets/json/32605/rfc-datos.json');
            expect(requests.length).toBe(2);
            requests.forEach(req => {
                expect(req.request.method).toBe('GET');
                req.flush(mockResponse);
            });
        });
    });

    describe('conseguirTransportistasLista', () => {
        it('debe obtener la lista de transportistas', () => {
            const rfc = 'TRANS123';
            const mockResponse: { [key: string]: TransportistasListaInterface } = {
                transportista1: {} as TransportistasListaInterface,
                transportista2: {} as TransportistasListaInterface
            };

            service.conseguirTransportistasLista(rfc).subscribe(response => {
                expect(response).toEqual(mockResponse);
                expect(Object.keys(response).length).toBe(2);
            });

            const req = httpMock.expectOne('assets/json/32605/transportistas-lista.json');
            expect(req.request.method).toBe('GET');
            req.flush(mockResponse);
        });

        it('debe manejar lista vacía de transportistas', () => {
            const rfc = 'EMPTY123';
            const mockResponse: { [key: string]: TransportistasListaInterface } = {};

            service.conseguirTransportistasLista(rfc).subscribe(response => {
                expect(response).toEqual({});
                expect(Object.keys(response).length).toBe(0);
            });

            const req = httpMock.expectOne('assets/json/32605/transportistas-lista.json');
            req.flush(mockResponse);
        });
    });

    describe('actualizarEstado', () => {
        it('debe actualizar el estado completo de la solicitud en el store', () => {
            const datosCompletos: Solicitud32605State = {
                sectorProductivo: 'Textil',
                sectorServicio: 'Manufactura',
                cumplimientoFiscalAduanero: 'Si',
                representanteRfc: 'REP123456',
                representanteNombre: 'Juan Pérez'
            } as Solicitud32605State;

            service.actualizarEstado(datosCompletos);

            expect(mockStore.actualizarEstado).toHaveBeenCalledWith(datosCompletos);
            expect(mockStore.actualizarEstado).toHaveBeenCalledTimes(1);
        });

        it('debe actualizar el estado con datos parciales', () => {
            const datosParcialesCasted = {
                representanteNombre: 'Maria García',
                representanteTelefono: '5559876543'
            } as Solicitud32605State;

            service.actualizarEstado(datosParcialesCasted);

            expect(mockStore.actualizarEstado).toHaveBeenCalledWith(datosParcialesCasted);
        });

        it('debe manejar estado vacío', () => {
            const estadoVacio = {} as Solicitud32605State;

            service.actualizarEstado(estadoVacio);

            expect(mockStore.actualizarEstado).toHaveBeenCalledWith(estadoVacio);
        });
    });

    describe('obtenerDatos', () => {
        it('debe obtener los datos completos de la solicitud', () => {
            const mockResponse: Solicitud32605State = {
                sectorProductivo: 'Servicios',
                representanteRfc: 'SOL123456',
                representanteNombre: 'Empresa Solicitud S.A.'
            } as Solicitud32605State;

            service.obtenerDatos().subscribe(response => {
                expect(response).toEqual(mockResponse);
            });

            const req = httpMock.expectOne('assets/json/32605/datos.json');
            expect(req.request.method).toBe('GET');
            req.flush(mockResponse);
        });

        it('debe manejar datos de solicitud con campos nulos', () => {
            const mockResponse: Solicitud32605State = {
                sectorProductivo: '',
                representanteRfc: null,
                representanteNombre: undefined
            } as any;

            service.obtenerDatos().subscribe(response => {
                expect(response).toEqual(mockResponse);
                expect(response.representanteRfc).toBeNull();
            });

            const req = httpMock.expectOne('assets/json/32605/datos.json');
            req.flush(mockResponse);
        });
    });

    describe('obtenerPersonaTablaDatos', () => {
        it('debe obtener los datos de la tabla de personas', () => {
            const mockResponse: PersonaRespuestaTabla = {
                code: 200,
                data: [
                    {
                        rfc: 'PERS123456ABC',
                        curp: 'PERS123456HDFGHJ01',
                        nombre: 'Persona A',
                        apellidoPaterno: 'García',
                        apellidoMaterno: 'López'
                    },
                    {
                        rfc: 'PERS789012DEF',
                        curp: 'PERS789012MNOPQR02',
                        nombre: 'Persona B',
                        apellidoPaterno: 'Martínez',
                        apellidoMaterno: 'Pérez'
                    }
                ],
                message: 'Datos obtenidos correctamente'
            };

            service.obtenerPersonaTablaDatos().subscribe(response => {
                expect(response).toEqual(mockResponse);
                expect(response.data.length).toBe(2);
                expect(response.code).toBe(200);
            });

            const req = httpMock.expectOne('assets/json/32605/personas-notificacione.json');
            expect(req.request.method).toBe('GET');
            req.flush(mockResponse);
        });

        it('debe manejar tabla de personas vacía', () => {
            const mockResponse: PersonaRespuestaTabla = {
                code: 200,
                data: [],
                message: 'No hay datos disponibles'
            };

            service.obtenerPersonaTablaDatos().subscribe(response => {
                expect(response.data).toEqual([]);
                expect(response.code).toBe(200);
            });

            const req = httpMock.expectOne('assets/json/32605/personas-notificacione.json');
            req.flush(mockResponse);
        });
    });

    describe('sectorListaDeSelects', () => {
        it('debe obtener todas las listas de selects del sector usando forkJoin', () => {
            const mockSectorProductivo: Catalogo[] = [
                { id: 1, descripcion: 'Textil' },
                { id: 2, descripcion: 'Automotriz' }
            ];
            const mockSectorServicio: Catalogo[] = [
                { id: 1, descripcion: 'Logística' },
                { id: 2, descripcion: 'Consultoría' }
            ];
            const mockBimestre: Catalogo[] = [
                { id: 1, descripcion: 'Enero-Febrero' },
                { id: 2, descripcion: 'Marzo-Abril' }
            ];

            service.sectorListaDeSelects().subscribe(response => {
                expect(response.sectorProductivoList).toEqual(mockSectorProductivo);
                expect(response.sectorServicioList).toEqual(mockSectorServicio);
                expect(response.bimestreList).toEqual(mockBimestre);
                expect(response.sectorProductivoList.length).toBe(2);
                expect(response.sectorServicioList.length).toBe(2);
                expect(response.bimestreList.length).toBe(2);
            });

            const reqSectorProductivo = httpMock.expectOne('assets/json/32605/sector-productivo-list.json');
            const reqSectorServicio = httpMock.expectOne('assets/json/32605/sector-servicio-list.json');
            const reqBimestre = httpMock.expectOne('assets/json/32605/bimestre-list.json');

            expect(reqSectorProductivo.request.method).toBe('GET');
            expect(reqSectorServicio.request.method).toBe('GET');
            expect(reqBimestre.request.method).toBe('GET');

            reqSectorProductivo.flush(mockSectorProductivo);
            reqSectorServicio.flush(mockSectorServicio);
            reqBimestre.flush(mockBimestre);
        });

        it('debe manejar listas vacías en forkJoin', () => {
            const mockSectorProductivo: Catalogo[] = [];
            const mockSectorServicio: Catalogo[] = [];
            const mockBimestre: Catalogo[] = [];

            service.sectorListaDeSelects().subscribe(response => {
                expect(response.sectorProductivoList).toEqual([]);
                expect(response.sectorServicioList).toEqual([]);
                expect(response.bimestreList).toEqual([]);
            });

            const reqSectorProductivo = httpMock.expectOne('assets/json/32605/sector-productivo-list.json');
            const reqSectorServicio = httpMock.expectOne('assets/json/32605/sector-servicio-list.json');
            const reqBimestre = httpMock.expectOne('assets/json/32605/bimestre-list.json');

            reqSectorProductivo.flush(mockSectorProductivo);
            reqSectorServicio.flush(mockSectorServicio);
            reqBimestre.flush(mockBimestre);
        });

        it('debe manejar error en una de las peticiones del forkJoin', () => {
            service.sectorListaDeSelects().subscribe({
                next: () => fail('Should have failed'),
                error: (error) => {
                    expect(error.status).toBe(500);
                }
            });

            const reqSectorProductivo = httpMock.expectOne('assets/json/32605/sector-productivo-list.json');
            const reqSectorServicio = httpMock.expectOne('assets/json/32605/sector-servicio-list.json');
            const reqBimestre = httpMock.expectOne('assets/json/32605/bimestre-list.json');

            reqSectorServicio.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });
        });
    });

    describe('getRFCDetails', () => {
        it('debe obtener los detalles del RFC', () => {
            const mockResponse: BuscarRfcResponse = {
                code: 200,
                data: {
                    denominacionSocial: 'Empresa RFC S.A.',
                    rfc: 'RFC123456ABC',
                    numeroDeEmpleados: 100,
                    bimestre: '2023-01'
                },
                message: 'RFC encontrado correctamente'
            };

            service.getRFCDetails().subscribe(response => {
                expect(response).toEqual(mockResponse);
                expect(response.code).toBe(200);
                expect(response.data.denominacionSocial).toBe('Empresa RFC S.A.');
            });

            const req = httpMock.expectOne('assets/json/32605/buscar-rfc-datos.json');
            expect(req.request.method).toBe('GET');
            req.flush(mockResponse);
        });

        it('debe manejar RFC no encontrado', () => {
            const mockResponse: BuscarRfcResponse = {
                code: 404,
                data: {},
                message: 'RFC no encontrado'
            };

            service.getRFCDetails().subscribe(response => {
                expect(response.code).toBe(404);
                expect(response.message).toBe('RFC no encontrado');
            });

            const req = httpMock.expectOne('assets/json/32605/buscar-rfc-datos.json');
            req.flush(mockResponse);
        });
    });

    describe('getEntidadesFederativas', () => {
        it('debe obtener la lista de Entidades Federativas', () => {
            const mockResponse: ApiResponse<Catalogo> = {
                code: 200,
                data: [
                    { id: 1, descripcion: 'Ciudad de México' },
                    { id: 2, descripcion: 'Jalisco' },
                    { id: 3, descripcion: 'Nuevo León' }
                ],
                message: 'Entidades obtenidas correctamente'
            };

            service.getEntidadesFederativas().subscribe(response => {
                expect(response).toEqual(mockResponse);
                expect(response.data.length).toBe(3);
                expect(response.code).toBe(200);
            });

            const req = httpMock.expectOne('assets/json/32605/entidad-federativa-list.json');
            expect(req.request.method).toBe('GET');
            req.flush(mockResponse);
        });

        it('debe manejar respuesta con error', () => {
            const mockResponse: ApiResponse<Catalogo> = {
                code: 500,
                data: [],
                message: 'Error al obtener entidades'
            };

            service.getEntidadesFederativas().subscribe(response => {
                expect(response.code).toBe(500);
                expect(response.data).toEqual([]);
                expect(response.message).toBe('Error al obtener entidades');
            });

            const req = httpMock.expectOne('assets/json/32605/entidad-federativa-list.json');
            req.flush(mockResponse);
        });
    });

    describe('getInstalacionesDatos', () => {
        it('debe obtener la lista de instalaciones', () => {
            const mockResponse: ApiResponse<InstalacionesInterface> = {
                code: 200,
                data: [
                    {
                        entidadFederativa: 'Ciudad de México',
                        municipio: 'Cuauhtémoc',
                        direccion: 'Av. Instalación A 123'
                    },
                    {
                        entidadFederativa: 'Jalisco',
                        municipio: 'Guadalajara',
                        direccion: 'Calle Instalación B 456'
                    }
                ] as InstalacionesInterface[],
                message: 'Instalaciones obtenidas correctamente'
            };

            service.getInstalacionesDatos().subscribe(response => {
                expect(response).toEqual(mockResponse);
                expect(response.data.length).toBe(2);
                expect(response.code).toBe(200);
            });

            const req = httpMock.expectOne('assets/json/32605/instalaciones-list.json');
            expect(req.request.method).toBe('GET');
            req.flush(mockResponse);
        });

        it('debe manejar lista vacía de instalaciones', () => {
            const mockResponse: ApiResponse<InstalacionesInterface> = {
                code: 200,
                data: [] as InstalacionesInterface[],
                message: 'No hay instalaciones disponibles'
            };

            service.getInstalacionesDatos().subscribe(response => {
                expect(response.data).toEqual([]);
                expect(response.code).toBe(200);
            });

            const req = httpMock.expectOne('assets/json/32605/instalaciones-list.json');
            req.flush(mockResponse);
        });
    });

    describe('getDomiciliosRegistrados', () => {
        it('debe obtener la lista de domicilios registrados', () => {
            const mockResponse: ApiResponse<Catalogo> = {
                code: 200,
                data: [
                    { id: 1, descripcion: 'Domicilio Principal' },
                    { id: 2, descripcion: 'Sucursal Norte' }
                ],
                message: 'Domicilios obtenidos correctamente'
            };

            service.getDomiciliosRegistrados().subscribe(response => {
                expect(response).toEqual(mockResponse);
                expect(response.data.length).toBe(2);
            });

            const req = httpMock.expectOne('assets/json/32605/domicilios-registrados-list.json');
            expect(req.request.method).toBe('GET');
            req.flush(mockResponse);
        });
    });

    describe('getTipoInstalacion', () => {
        it('debe obtener los tipos de instalación', () => {
            const mockResponse: ApiResponse<Catalogo> = {
                code: 200,
                data: [
                    { id: 1, descripcion: 'Almacén' },
                    { id: 2, descripcion: 'Oficina Administrativa' },
                    { id: 3, descripcion: 'Planta Industrial' }
                ],
                message: 'Tipos de instalación obtenidos'
            };

            service.getTipoInstalacion().subscribe(response => {
                expect(response).toEqual(mockResponse);
                expect(response.data.length).toBe(3);
                expect(response.code).toBe(200);
            });

            const req = httpMock.expectOne('assets/json/32605/tipo-Instalacion-list.json');
            expect(req.request.method).toBe('GET');
            req.flush(mockResponse);
        });
    });

    describe('empresaListaDeSelects', () => {
        it('debe obtener todas las listas de selects de empresa usando forkJoin', () => {
            const mockEnSuCaracterDe: Catalogo[] = [
                { id: 1, descripcion: 'Propietario' },
                { id: 2, descripcion: 'Representante Legal' }
            ];
            const mockNacionalidad: Catalogo[] = [
                { id: 1, descripcion: 'Mexicana' },
                { id: 2, descripcion: 'Extranjera' }
            ];
            const mockTipoDePersona: Catalogo[] = [
                { id: 1, descripcion: 'Física' },
                { id: 2, descripcion: 'Moral' }
            ];

            service.empresaListaDeSelects().subscribe(response => {
                expect(response.enSuCaracterDeList).toEqual(mockEnSuCaracterDe);
                expect(response.nacionalidadList).toEqual(mockNacionalidad);
                expect(response.tipoDePersonaList).toEqual(mockTipoDePersona);
                expect(response.enSuCaracterDeList.length).toBe(2);
                expect(response.nacionalidadList.length).toBe(2);
                expect(response.tipoDePersonaList.length).toBe(2);
            });

            const reqEnSuCaracterDe = httpMock.expectOne('assets/json/32605/en-su-caracter-de-list.json');
            const reqNacionalidad = httpMock.expectOne('assets/json/32605/nacionali-dad-list.json');
            const reqTipoDePersona = httpMock.expectOne('assets/json/32605/tipo-de-persona-list.json');

            expect(reqEnSuCaracterDe.request.method).toBe('GET');
            expect(reqNacionalidad.request.method).toBe('GET');
            expect(reqTipoDePersona.request.method).toBe('GET');

            reqEnSuCaracterDe.flush(mockEnSuCaracterDe);
            reqNacionalidad.flush(mockNacionalidad);
            reqTipoDePersona.flush(mockTipoDePersona);
        });

        it('debe manejar listas vacías en forkJoin para empresa', () => {
            const mockEnSuCaracterDe: Catalogo[] = [];
            const mockNacionalidad: Catalogo[] = [];
            const mockTipoDePersona: Catalogo[] = [];

            service.empresaListaDeSelects().subscribe(response => {
                expect(response.enSuCaracterDeList).toEqual([]);
                expect(response.nacionalidadList).toEqual([]);
                expect(response.tipoDePersonaList).toEqual([]);
            });

            const reqEnSuCaracterDe = httpMock.expectOne('assets/json/32605/en-su-caracter-de-list.json');
            const reqNacionalidad = httpMock.expectOne('assets/json/32605/nacionali-dad-list.json');
            const reqTipoDePersona = httpMock.expectOne('assets/json/32605/tipo-de-persona-list.json');

            reqEnSuCaracterDe.flush(mockEnSuCaracterDe);
            reqNacionalidad.flush(mockNacionalidad);
            reqTipoDePersona.flush(mockTipoDePersona);
        });

        it('debe manejar error en empresaListaDeSelects forkJoin', () => {
            service.empresaListaDeSelects().subscribe({
                next: () => fail('Should have failed'),
                error: (error) => {
                    expect(error.status).toBe(404);
                }
            });

            const reqEnSuCaracterDe = httpMock.expectOne('assets/json/32605/en-su-caracter-de-list.json');
            const reqNacionalidad = httpMock.expectOne('assets/json/32605/nacionali-dad-list.json');
            const reqTipoDePersona = httpMock.expectOne('assets/json/32605/tipo-de-persona-list.json');

            reqNacionalidad.flush('Not Found', { status: 404, statusText: 'Not Found' });
        });
    });

    describe('Integration Tests', () => {
        it('debe poder realizar múltiples llamadas simultaneas', () => {
            const mockRecibirNotificaciones: RecibirNotificaciones[] = [];
            const mockEnlaceOperativo: EnlaceOperativo[] = [];

            service.conseguirRecibirNotificaciones().subscribe();
            service.conseguirEnlaceOperativoDatos().subscribe();

            const reqNotificaciones = httpMock.expectOne('assets/json/32605/recibir-notificaciones.json');
            const reqEnlace = httpMock.expectOne('assets/json/32605/enlace-operativo-datos.json');

            expect(reqNotificaciones.request.method).toBe('GET');
            expect(reqEnlace.request.method).toBe('GET');

            reqNotificaciones.flush(mockRecibirNotificaciones);
            reqEnlace.flush(mockEnlaceOperativo);
        });

        it('debe mantener la consistencia del store a través de múltiples actualizaciones', () => {
            const primerEstado: Partial<Solicitud32605State> = { representanteNombre: 'Juan' };
            const segundoEstado: Partial<Solicitud32605State> = { representanteRfc: 'RFC123' };

            service.actualizarEstado(primerEstado as Solicitud32605State);
            service.actualizarEstado(segundoEstado as Solicitud32605State);

            expect(mockStore.actualizarEstado).toHaveBeenCalledTimes(2);
            expect(mockStore.actualizarEstado).toHaveBeenNthCalledWith(1, primerEstado);
            expect(mockStore.actualizarEstado).toHaveBeenNthCalledWith(2, segundoEstado);
        });
    });

    describe('Edge Cases and Error Handling', () => {
        it('debe manejar respuestas JSON malformadas', () => {
            service.conseguirRecibirNotificaciones().subscribe({
                next: () => fail('Should have failed'),
                error: (error) => {
                    expect(error).toBeDefined();
                }
            });

            const req = httpMock.expectOne('assets/json/32605/recibir-notificaciones.json');
            req.error(new ErrorEvent('Invalid JSON'));
        });

        it('debe manejar timeout de peticiones HTTP', () => {
            service.conseguirInventarios().subscribe({
                next: () => fail('Should have failed'),
                error: (error) => {
                    expect(error.type).toBeDefined();
                }
            });

            const req = httpMock.expectOne('assets/json/32605/inventarios-datos.json');
            req.error(new ErrorEvent('TimeoutError'), { status: 0, statusText: 'Timeout' });
        });

        it('debe manejar respuestas con códigos de estado HTTP diversos', () => {
            service.conseguirRepresentanteLegalDatos().subscribe({
                next: () => fail('Should have failed'),
                error: (error) => {
                    expect(error.status).toBe(401);
                }
            });

            const req = httpMock.expectOne('assets/json/32605/representante-legal-datos.json');
            req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
        });

        it('debe manejar errores de red', () => {
            service.conseguirSeccionSubcontratados().subscribe({
                next: () => fail('Should have failed'),
                error: (error) => {
                    expect(error.type).toBeDefined();
                }
            });

            const req = httpMock.expectOne('assets/json/32605/seccion-subcontratados.json');
            req.error(new ErrorEvent('Network error'));
        });

        it('debe manejar errores de CORS', () => {
            service.guardarDatosFormulario().subscribe({
                next: () => fail('Should have failed'),
                error: (error) => {
                    expect(error.status).toBe(0);
                }
            });

            const req = httpMock.expectOne('assets/json/32605/guardar-datos-formulario.json');
            req.flush(null, { status: 0, statusText: 'Unknown Error' });
        });
    });

    describe('Service Public Properties', () => {
        it('debe exponer solicitud32605Store como propiedad pública', () => {
            expect(service.solicitud32605Store).toBeDefined();
            expect(service.solicitud32605Store).toBe(mockStore);
        });

        it('debe permitir acceso directo al store para actualizaciones externas', () => {
            const testData: Partial<Solicitud32605State> = { sectorProductivo: 'Test' };

            service.solicitud32605Store.actualizarEstado(testData as Solicitud32605State);

            expect(mockStore.actualizarEstado).toHaveBeenCalledWith(testData);
        });
    });
});
