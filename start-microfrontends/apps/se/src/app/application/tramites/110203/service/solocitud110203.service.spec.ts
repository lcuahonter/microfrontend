
import { TestBed } from '@angular/core/testing';
import { Solocitud110203Service } from './service110203.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { Solicitud110203State } from '../../../estados/tramites/tramite110203.store';
import { Tramite110203Store } from '../../../estados/tramites/tramite110203.store';
import { Tramite110203Query } from '../../../estados/queries/tramite110203.query';
import { HttpCoreService } from '@libs/shared/data-access-user/src';

describe('Solocitud110203Service', () => {
  let service: Solocitud110203Service;
  let httpClientMock: jest.Mocked<HttpClient>;
  let tramiteStoreMock: jest.Mocked<Tramite110203Store>;
  let tramiteQueryMock: jest.Mocked<Tramite110203Query>;
  let httpCoreServiceMock: jest.Mocked<HttpCoreService>;

  const MOCK_DATA: Solicitud110203State = {
    tratado: 'TLC',
    bloque: 'NAFTA',
    origen: 'México',
    destino: 'Canadá',
    expedicion: '2024-01-01',
    vencimiento: '2025-01-01',
    nombre: 'Juan',
    primer: 'Pérez',
    segundo: 'García',
    fiscal: 'RFC123456',
    razon: 'Empresa SA de CV',
    calle: 'Insurgentes',
    letra: 'A',
    ciudad: 'CDMX',
    correo: 'juan@empresa.com',
    fax: '5555555',
    telefono: '5551234567',
    medio: 'correo',
    observaciones: 'Ninguna',
    precisa: 'Descripción detallada',
    presenta: 'Representante',
    valorSeleccionado: 'Valor X',
    numeroDeCertificado: 'CERT-001',
    tratadoAcuerdo: 'TLCAN',
    paisBloque: 'Norteamérica',
    medida: 'kg',
    comercializacion: 'Exportación',
    tipo: 'Temporal',
    idSolicitud: null,
    complemento: '', marca: '', valor: '', bruta: '', factura: '',
    orden: '', arancelaria: '', tecnico: '', comercial: '', ingles: '',
    registro: '', cantidad: '', fechaFactura: '', pasoActivo: 0
  };

  beforeEach(() => {
    httpClientMock = {
      get: jest.fn(),
      post: jest.fn()
    } as unknown as jest.Mocked<HttpClient>;

    tramiteStoreMock = {
      setTratado: jest.fn(),
      setBloque: jest.fn(),
      setOrigen: jest.fn(),
      setDestino: jest.fn(),
      setExpedicion: jest.fn(),
      setVencimiento: jest.fn(),
      setNombre: jest.fn(),
      setPrimer: jest.fn(),
      setSegundo: jest.fn(),
      setFiscal: jest.fn(),
      setRazon: jest.fn(),
      setCalle: jest.fn(),
      setLetra: jest.fn(),
      setCiudad: jest.fn(),
      setCorreo: jest.fn(),
      setFax: jest.fn(),
      setTelefono: jest.fn(),
      setMedio: jest.fn(),
      setObservaciones: jest.fn(),
      setPrecisa: jest.fn(),
      setPresenta: jest.fn(),
      setValorSeleccionado: jest.fn(),
      setNumeroDeCertificado: jest.fn(),
      setTratadoAcuerdo: jest.fn(),
      setPaisBloque: jest.fn(),
      setMedida: jest.fn(),
      setComercializacion: jest.fn(),
      setTipo: jest.fn(),
    } as unknown as jest.Mocked<Tramite110203Store>;

    tramiteQueryMock = {
      selectSolicitud$: of(MOCK_DATA)
    } as unknown as jest.Mocked<Tramite110203Query>;

    httpCoreServiceMock = {
      post: jest.fn(() => of({ success: true }))
    } as unknown as jest.Mocked<HttpCoreService>;

    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: httpClientMock },
        { provide: Tramite110203Store, useValue: tramiteStoreMock },
        { provide: Tramite110203Query, useValue: tramiteQueryMock },
        { provide: HttpCoreService, useValue: httpCoreServiceMock }
      ]
    });

    service = TestBed.inject(Solocitud110203Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call all store setters when actualizarEstadoFormulario is called', () => {
    service.actualizarEstadoFormulario(MOCK_DATA);

    expect(tramiteStoreMock.setTratado).toHaveBeenCalledWith(MOCK_DATA.tratado);
    expect(tramiteStoreMock.setBloque).toHaveBeenCalledWith(MOCK_DATA.bloque);
    expect(tramiteStoreMock.setNombre).toHaveBeenCalledWith(MOCK_DATA.nombre);
  });

  it('should call HttpClient.get when getRegistroTomaMuestrasMercanciasData is called', (done) => {
    httpClientMock.get.mockReturnValue(of(MOCK_DATA));

    service.getRegistroTomaMuestrasMercanciasData().subscribe((data) => {
      expect(data).toEqual(MOCK_DATA);
      expect(httpClientMock.get).toHaveBeenCalledWith('assets/json/110203/serviciosExtraordinarios.json');
      done();
    });
  });

  it('should return observable from getAllState', (done) => {
    service.getAllState().subscribe((data) => {
      expect(data).toEqual(MOCK_DATA);
      done();
    });
  });
});