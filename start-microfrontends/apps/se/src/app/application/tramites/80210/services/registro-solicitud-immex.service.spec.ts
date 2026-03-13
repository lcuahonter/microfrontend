import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { registroSolicitudImmexService } from './registro-solicitud-immex.service';
import { FormularioDatos, RespuestaPlantas } from '../modelos/registro-solicitud-immex.model';
import { RespuestaCatalogos } from '@libs/shared/data-access-user/src';

describe('registroSolicitudImmexService', () => {
  let service: registroSolicitudImmexService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [registroSolicitudImmexService],
    });

    service = TestBed.inject(registroSolicitudImmexService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería crear el servicio', () => {
    expect(service).toBeTruthy();
  });

  it('debería obtener los datos del formulario desde un archivo JSON', () => {
    const MOCK_FORMULARIO_DATOS: FormularioDatos = {
      modalidad: 'Modalidad 1',
      folio: '12345',
      ano: '2023',
    };

    service.obtenerFormularioDatos().subscribe((datos) => {
      expect(datos).toEqual(MOCK_FORMULARIO_DATOS);
    });

    const REQ = httpMock.expectOne('assets/json/80210/formularioDatos.json');
    expect(REQ.request.method).toBe('GET');
    REQ.flush(MOCK_FORMULARIO_DATOS);
  });

  it('debería obtener la lista de estados desde un archivo JSON y asignarla a la variable `estados`', () => {
    const MOCK_ESTADOS: RespuestaCatalogos = {
      code: 200,
      data: [
        { id: 1, descripcion: 'Estado 1' },
        { id: 2, descripcion: 'Estado 2' },
      ],
      message: ''
    };

    service.obtenerEstados();

    const REQ = httpMock.expectOne('assets/json/80210/estados.json');
    expect(REQ.request.method).toBe('GET');
    REQ.flush(MOCK_ESTADOS);

    expect(service.estados).toEqual(MOCK_ESTADOS.data);
  });

  it('debería obtener los datos de las plantas desde un archivo JSON', () => {
    const MOCK_PLANTAS: RespuestaPlantas = {
      code: 200,
      datos: [
        {
          id: 1,
          calle: 'Calle 1',
          numeroExterio: '123',
          numeroInterio: 'A',
          codiogoPostal: '12345',
          colonia: 'Colonia 1',
          municipio: 'Municipio 1',
          entidadFederativa: 'Entidad 1',
          pais: 'México',
          registroFederal: 'RFC123',
          domicilio: 'Domicilio 1',
          razon: 'Razón Social 1',
        },
        {
          id: 2,
          calle: 'Calle 2',
          numeroExterio: '456',
          numeroInterio: 'B',
          codiogoPostal: '67890',
          colonia: 'Colonia 2',
          municipio: 'Municipio 2',
          entidadFederativa: 'Entidad 2',
          pais: 'México',
          registroFederal: 'RFC456',
          domicilio: 'Domicilio 2',
          razon: 'Razón Social 2',
        },
      ],
      message: ''
    };

    service.obtenerPlantasDatos().subscribe((datos) => {
      expect(datos).toEqual(MOCK_PLANTAS);
    });

    const REQ = httpMock.expectOne('assets/json/80210/plantasDatos.json');
    expect(REQ.request.method).toBe('GET');
    REQ.flush(MOCK_PLANTAS);
  });

  it('debería manejar correctamente una respuesta vacía o con error en obtenerRespuestaPorUrl', () => {
    service.obtenerRespuestaPorUrl(service, 'estados', '/80210/estados.json');

    const REQ = httpMock.expectOne('assets/json/80210/estados.json');
    expect(REQ.request.method).toBe('GET');
    REQ.flush({ code: 500, data: null });

    expect(service.estados).toEqual([]);
  });

  it('debería asignar datos correctamente en obtenerRespuestaPorUrl', () => {
    const MOCK_ESTADOS: RespuestaCatalogos = {
      code: 200,
      data: [
        { id: 1, descripcion: 'Estado 1' },
        { id: 2, descripcion: 'Estado 2' },
      ],
      message: ''
    };

    service.obtenerRespuestaPorUrl(service, 'estados', '/80210/estados.json');

    const REQ = httpMock.expectOne('assets/json/80210/estados.json');
    expect(REQ.request.method).toBe('GET');
    REQ.flush(MOCK_ESTADOS);

    expect(service.estados).toEqual(MOCK_ESTADOS.data);
  });
});