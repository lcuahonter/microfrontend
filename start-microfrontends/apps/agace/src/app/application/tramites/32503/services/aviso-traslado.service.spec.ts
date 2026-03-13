import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AvisoTrasladoService } from './aviso-traslado.service';
import { CatalogoLista, AvisoTablaDatos, MercanciaTablaDatos, DatosSolicitante, RespuestaConsulta } from '../models/aviso-traslado.model';

describe('AvisoTrasladoService', () => {
    let service: AvisoTrasladoService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [AvisoTrasladoService],
        });

        service = TestBed.inject(AvisoTrasladoService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('debería crearse el servicio', () => {
        expect(service).toBeTruthy();
    });


    it('debería obtener los datos del solicitante', () => {
        const mockResponse: DatosSolicitante = {
            "rfc": "AAL0409235E6",
            "denominacion": "AGRICOLA ALPE S DE RL DE CV",
            "actividadEconomica": "Siembra, cultivo y cosecha de otros cultivos",
            "correoElectronico": "caguileram@ultrasist.com.mx",
            "pais": "ESTADOSUNIDOSMEXICANOS",
            "codigoPostal": "34078",
            "entidadFederativa": "DURANGO",
            "municipio": "DURANGO",
            "localidad": "VICTORIADEDURANGO",
            "colonia": "LOSSAUCES",
            "calle": "PRIV.PINOPIÑON",
            "nExt": "703",
            "nInt": "",
            "lada": "",
            "telefono": "",
            "adace": "Occidente"
        };

        service.obtenerDatosSolicitante().subscribe((response) => {
            expect(response).toEqual(mockResponse);
        });

        const req = httpMock.expectOne('assets/json/32503/datosSolicitante.json');
        expect(req.request.method).toBe('GET');
        req.flush(mockResponse);
    });

    it('debería obtener la lista de entidades federativas', () => {
        const mockResponse: CatalogoLista = { datos: [{ id: 1, descripcion: 'Entidad 1' }] };

        service.obtenerFederativa().subscribe((response) => {
            expect(response).toEqual(mockResponse);
        });

        const req = httpMock.expectOne('assets/json/32503/entidad-federativa.json');
        expect(req.request.method).toBe('GET');
        req.flush(mockResponse);
    });

    it('debería obtener la lista de municipios', () => {
        const mockResponse: CatalogoLista = { datos: [{ id: 1, descripcion: 'Municipio 1' }] };

        service.obtenerMunicipio().subscribe((response) => {
            expect(response).toEqual(mockResponse);
        });

        const req = httpMock.expectOne('assets/json/32503/entidad-federativa.json');
        expect(req.request.method).toBe('GET');
        req.flush(mockResponse);
    });

    it('debería obtener la lista de colonias', () => {
        const mockResponse: CatalogoLista = { datos: [{ id: 1, descripcion: 'Colonia 1' }] };

        service.obtenerColonias().subscribe((response) => {
            expect(response).toEqual(mockResponse);
        });

        const req = httpMock.expectOne('assets/json/32503/entidad-federativa.json');
        expect(req.request.method).toBe('GET');
        req.flush(mockResponse);
    });

    it('debería obtener los datos de la tabla de aviso', () => {
        const mockResponse: AvisoTablaDatos = {
            datos: [{
                "id": 1,
                "rfc": "XAXX010101000",
                "nombreComercial": "NOMBRE COMERCIAL",
                "entidadFederativa": "ENTIDAD FEDERATIVA",
                "alcaldioOMuncipio": "ALCALDIA O MUNICIPIO",
                "colonia": "COLONIA"
            },]
        };

        service.obtenerAvisoTabla().subscribe((response) => {
            expect(response).toEqual(mockResponse);
        });

        const req = httpMock.expectOne('assets/json/32503/aviso-tabla.json');
        expect(req.request.method).toBe('GET');
        req.flush(mockResponse);
    });

    it('debería obtener los datos de la tabla de mercancías', () => {
        const mockResponse: MercanciaTablaDatos = {
            datos: [{
                "id": 1,
                "claveFraccionArancelaria": "certificado",
                "nico": "01",
                "cantidad": "50",
                "claveUnidadMedida": "Botella",
                "valorUSD": "2555",
                "numPedimentoExportacion": "certificado",
                "numPedimentoImportacion": "certificado"
            }]
        };

        service.obtenerMercanciaTabla().subscribe((response) => {
            expect(response).toEqual(mockResponse);
        });

        const req = httpMock.expectOne('assets/json/32503/mercancia-tabla.json');
        expect(req.request.method).toBe('GET');
        req.flush(mockResponse);
    });

    it('debería obtener la lista de fracciones arancelarias', () => {
        const mockResponse: CatalogoLista = { datos: [{ id: 1, descripcion: 'Fracción 1' }] };

        service.obtenerFraccionArancelaria().subscribe((response) => {
            expect(response).toEqual(mockResponse);
        });

        const req = httpMock.expectOne('assets/json/32503/entidad-federativa.json');
        expect(req.request.method).toBe('GET');
        req.flush(mockResponse);
    });

    it('debería obtener la lista de unidades de medida', () => {
        const mockResponse: CatalogoLista = { datos: [{ id: 1, descripcion: 'Unidad 1' }] };

        service.obtenerUnidadMedida().subscribe((response) => {
            expect(response).toEqual(mockResponse);
        });

        const req = httpMock.expectOne('assets/json/32503/entidad-federativa.json');
        expect(req.request.method).toBe('GET');
        req.flush(mockResponse);
    });
    it('should fetch datos consulta from the correct URL', () => {
        const mockResponse: RespuestaConsulta = {
            "success": true,
            "message": "",
            "datos": {
                "avisoFormulario": {
                    "adace": "adace",
                    "valorProgramaImmex": "  programa IMMEX",
                    "valorAnioProgramaImmex": "Año de programa",
                    "tipoAviso": "prorroga",
                    "tieneIdTransaccionVucem": "si",
                    "idTransaccion": "aviso inicial",
                    "motivoProrroga": "de la Prórroga",
                    "fechaTranslado": "15/10/2025",
                    "nombreComercial": "comercial",
                    "claveEntidadFederativa": "2",
                    "claveDelegacionMunicipio": "3",
                    "claveColonia": "5",
                    "calle": "Calle",
                    "numeroExterior": "1",
                    "numeroInterior": "12",
                    "codigoPostal": "34343",
                    "tipoCarga": "manual"
                },
                "tablaDeDatos": [
                    {
                        "id": 1,
                        "rfc": "XAXX010101000",
                        "nombreComercial": "NOMBRE COMERCIAL",
                        "entidadFederativa": "ENTIDAD FEDERATIVA",
                        "alcaldioOMuncipio": "ALCALDIA O MUNICIPIO",
                        "colonia": "COLONIA"
                    },
                    {
                        "id": 1,
                        "rfc": "XAXX010101000",
                        "nombreComercial": "NOMBRE COMERCIAL",
                        "entidadFederativa": "ENTIDAD FEDERATIVA",
                        "alcaldioOMuncipio": "ALCALDIA O MUNICIPIO",
                        "colonia": "COLONIA"
                    }
                ]
            }
        };

        service.getDatosConsulta().subscribe((response) => {
            expect(response).toEqual(mockResponse);
        });

        const req = httpMock.expectOne('assets/json/32503/consulta-32503.json');
        expect(req.request.method).toBe('GET');
        req.flush(mockResponse); // Simulate the HTTP response
    });
});