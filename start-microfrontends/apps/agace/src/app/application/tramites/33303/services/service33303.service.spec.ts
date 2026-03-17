import { TestBed } from '@angular/core/testing';
import { Service33303Service } from './service33303.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UnicoStore } from '../estados/renovacion.store';
import { UnicoState } from '../estados/renovacion.store';

describe('Service33303Service', () => {
  let service: Service33303Service;
  let httpMock: HttpTestingController;
  let storeMock: jest.Mocked<UnicoStore>;

  beforeEach(() => {
    storeMock = {
      setnumeroOperacion: jest.fn(),
      setbanco: jest.fn(),
      setllavePago: jest.fn(),
      setfechaPago: jest.fn(),
      setmapTipoTramite: jest.fn(),
      setforeignClientsSuppliers: jest.fn(),
      setnationalSuppliers: jest.fn(),
      setmodificationsMembers: jest.fn(),
      setchangesToLegalDocuments: jest.fn(),
      setmergerOrSplitNotice: jest.fn(),
      setadditionFractions: jest.fn(),
      setadditionmodificación: jest.fn(),
      setadditionPresentación: jest.fn(),
      setacepto253: jest.fn(),
    } as unknown as jest.Mocked<UnicoStore>;

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        Service33303Service,
        { provide: UnicoStore, useValue: storeMock }
      ]
    });

    service = TestBed.inject(Service33303Service);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call all relevant UnicoStore methods when updating state', () => {
    const mockState: UnicoState = {
      numeroOperacion: '123',
      banco: 'BBVA',
      llavePago: 'abc123',
      fechaPago: '2025-07-14',
      mapTipoTramite: 'T33303',
      foreignClientsSuppliers: true,
      nationalSuppliers: true,
      modificationsMembers: true,
      changesToLegalDocuments: true,
      mergerOrSplitNotice: true,
      additionFractions: true,
      additionmodificación: true,
      additionPresentación: true,
      acepto253: true,
      mapDeclaracionSolicitud: '',
      envioAviso: '',
      numeroAviso: '',
      claveReferencia: '',
      cadenaDependencia: '',
      importePago: '',
      modalidadCertificacion: ''
    };

    service.actualizarEstadoFormulario(mockState);

    expect(storeMock.setnumeroOperacion).toHaveBeenCalledWith('123');
    expect(storeMock.setbanco).toHaveBeenCalledWith('BBVA');
    expect(storeMock.setllavePago).toHaveBeenCalledWith('abc123');
    expect(storeMock.setfechaPago).toHaveBeenCalledWith('2025-07-14');
    expect(storeMock.setmapTipoTramite).toHaveBeenCalledWith('T33303');
    expect(storeMock.setforeignClientsSuppliers).toHaveBeenCalledWith(true);
    expect(storeMock.setnationalSuppliers).toHaveBeenCalledWith(true);
    expect(storeMock.setmodificationsMembers).toHaveBeenCalledWith(true);
    expect(storeMock.setchangesToLegalDocuments).toHaveBeenCalledWith(true);
    expect(storeMock.setmergerOrSplitNotice).toHaveBeenCalledWith(true);
    expect(storeMock.setadditionFractions).toHaveBeenCalledWith(true);
    expect(storeMock.setadditionmodificación).toHaveBeenCalledWith(true);
    expect(storeMock.setadditionPresentación).toHaveBeenCalledWith(true);
    expect(storeMock.setacepto253).toHaveBeenCalledWith(true);
  });

  it('should fetch registro toma muestras data from JSON file', () => {
    const mockData: UnicoState = {
      numeroOperacion: '456',
      banco: 'SBI',
      llavePago: 'xyz456',
      fechaPago: '2025-07-10',
      mapTipoTramite: 'T33303',
      foreignClientsSuppliers: false,
      nationalSuppliers: false,
      modificationsMembers: false,
      changesToLegalDocuments: false,
      mergerOrSplitNotice: false,
      additionFractions: false,
      additionmodificación: false,
      additionPresentación: false,
      acepto253: false,
      mapDeclaracionSolicitud: '',
      envioAviso: '',
      numeroAviso: '',
      claveReferencia: '',
      cadenaDependencia: '',
      importePago: '',
      modalidadCertificacion: ''
    };

    service.getRegistroTomaMuestrasMercanciasData().subscribe((data) => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne('assets/json/33303/consulta.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });
});
