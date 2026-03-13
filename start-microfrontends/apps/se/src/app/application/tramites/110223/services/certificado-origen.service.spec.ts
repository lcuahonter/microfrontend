import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CertificadosOrigenService } from './certificado-origen.service';
import { CatalogoLista, DisponiblesTabla, SeleccionadasTabla, ProductorExportador } from '../models/certificado-origen.model';

describe('CertificadosOrigenService', () => {
    let service: CertificadosOrigenService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [CertificadosOrigenService],
        });

        service = TestBed.inject(CertificadosOrigenService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should fetch idiomas', () => {
        const mockResponse: CatalogoLista = {
            datos: [{ id: 1, descripcion: 'Español' }, { id: 2, descripcion: 'Inglés' }],
        };

        service.obtenerIdioma().subscribe((response) => {
            expect(response).toEqual(mockResponse);
        });

        const req = httpMock.expectOne('assets/json/110223/idioma.json');
        expect(req.request.method).toBe('GET');
        req.flush(mockResponse);
    });

    it('should fetch entidades federativas', () => {
        const mockResponse: CatalogoLista = {
            datos: [{ id: 1, descripcion: 'Entidad 1' }, { id: 2, descripcion: 'Entidad 2' }],
        };

        service.obtenerEntidadFederativa().subscribe((response) => {
            expect(response).toEqual(mockResponse);
        });

        const req = httpMock.expectOne('assets/json/110223/entidad-federativa.json');
        expect(req.request.method).toBe('GET');
        req.flush(mockResponse);
    });

    it('should fetch representaciones federales', () => {
        const mockResponse: CatalogoLista = {
            datos: [{ id: 1, descripcion: 'Representación 1' }, { id: 2, descripcion: 'Representación 2' }],
        };

        service.obtenerRepresentacionFederal().subscribe((response) => {
            expect(response).toEqual(mockResponse);
        });

        const req = httpMock.expectOne('assets/json/110223/representacion-federal.json');
        expect(req.request.method).toBe('GET');
        req.flush(mockResponse);
    });

    it('should fetch productores/exportadores', () => {
        const mockResponse: ProductorExportador = {
            datos: [
                {
                    id: 1,
                    nombreProductor: 'Productor 1',
                    numeroRegistroFiscal: '12345',
                    direccion: 'Dirección 1',
                    correoElectronico: 'correo1@example.com',
                    telefono: '1234567890',
                    fax: '0987654321',
                },
            ],
        };        service.obtenerProductorPorExportador('AAL0409235E6').subscribe((response) => {
            expect(response).toEqual(mockResponse);
        });

        const req = httpMock.expectOne((request) => 
            request.url.includes('/solicitud/buscar-productor') && 
            request.url.includes('rfcSolicitante=AAL0409235E6')
        );
        expect(req.request.method).toBe('GET');
        req.flush(mockResponse);
    });

    it('should fetch mercancías disponibles', () => {
        const mockResponse: DisponiblesTabla[] = [
            {
                fraccionArancelaria: '12345678',
                nombreTecnico: 'Producto Técnico',
                nombreComercial: 'Producto Comercial',
                numeroRegistroProductos: 'REG123',
                fechaExpedicion: '2025-01-01',
                fechaVencimiento: '2025-12-31',
            },
        ];

        service.obtenerMercanciasDisponibles().subscribe((response) => {
            expect(response).toEqual(mockResponse);
        });

        const req = httpMock.expectOne('assets/json/110223/mercancia-disponsible.json');
        expect(req.request.method).toBe('GET');
        req.flush(mockResponse);
    });

    it('should fetch mercancías seleccionadas', () => {
        const mockResponse: SeleccionadasTabla[] = [
            {
                id: 1,
                fraccionArancelaria: '12345678',
                cantidad: '100',
                unidadMedida: 'Caja',
                valorMercancia: '1000',
                tipoFactura: 'Manual',
                numFactura: '12345',
                complementoDescripcion: 'Descripción',
                fechaFactura: '2025-01-01',
            },
        ];

        service.obtenerMercanciasSeleccionadas().subscribe((response) => {
            expect(response).toEqual(mockResponse);
        });

        const req = httpMock.expectOne('assets/json/110223/mercancias-seleccionadas.json');
        expect(req.request.method).toBe('GET');
        req.flush(mockResponse);
    });

    it('should fetch tratados', () => {
        const mockResponse: CatalogoLista = {
            datos: [{ id: 1, descripcion: 'Tratado 1' }, { id: 2, descripcion: 'Tratado 2' }],
        };

        service.obtenerTratado().subscribe((response) => {
            expect(response).toEqual(mockResponse);
        });

        const req = httpMock.expectOne('assets/json/110223/pais.json');
        expect(req.request.method).toBe('GET');
        req.flush(mockResponse);
    });

    it('should fetch países', () => {
        const mockResponse: CatalogoLista = {
            datos: [{ id: 1, descripcion: 'País 1' }, { id: 2, descripcion: 'País 2' }],
        };

        service.obtenerPais().subscribe((response) => {
            expect(response).toEqual(mockResponse);
        });

        const req = httpMock.expectOne('assets/json/110223/pais.json');
        expect(req.request.method).toBe('GET');
        req.flush(mockResponse);
    });
});