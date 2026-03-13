import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Solicitud10301Service } from './solicitud10301.service';
import { Tramite10301Store } from '../estados/tramite10301.store';
import { Solicitud10301State } from '../estados/tramite10301.store';

const MOCK_STATE: Solicitud10301State = {
  tipoMercancia: 'Mercancia X',
  usoEspecifico: 'Uso Y',
  marca: 'Marca Z',
  modelo: 'Modelo A',
  serie: '123',
  calle: 'Calle B',
  numeroExterior: 10,
  numeroInterior: 20,
  telefono: 5555555555,
  correoElectronico: 'correo@ejemplo.com',
  codigoPostal: 12345,
  estado: 1,
  colonia: 1,
  opcion: 'Opcion 1'
} as unknown as Solicitud10301State;

describe('Solicitud10301Service', () => {
  let service: Solicitud10301Service;
  let httpMock: HttpTestingController;
  let store: Tramite10301Store;

  const MOCK_STORE = {
    setTipoMercancia: jest.fn(),
    setUsoEspecifico: jest.fn(),
    setMarca: jest.fn(),
    setModelo: jest.fn(),
    setSerie: jest.fn(),
    setCalle: jest.fn(),
    setNumeroExterior: jest.fn(),
    setNumeroInterior: jest.fn(),
    setTelefono: jest.fn(),
    setCorreoElectronico: jest.fn(),
    setCodigoPostal: jest.fn(),
    setEstado: jest.fn(),
    setColonia: jest.fn(),
    setOpcion: jest.fn()
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        Solicitud10301Service,
        { provide: Tramite10301Store, useValue: MOCK_STORE }
      ]
    });
    service = TestBed.inject(Solicitud10301Service);
    httpMock = TestBed.inject(HttpTestingController);
    store = TestBed.inject(Tramite10301Store);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch JSON data from getDatosDeTrtamitelDoc()', () => {
    service.getDatosDeTrtamitelDoc().subscribe((result) => {
      expect(result).toEqual(MOCK_STATE);
    });

    const REQ = httpMock.expectOne('assets/json/10301/datos-del-tramite.json');
    expect(REQ.request.method).toBe('GET');
    REQ.flush(MOCK_STATE);
  });
});