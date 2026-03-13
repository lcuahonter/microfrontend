import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { ComercioExteriorService } from './comercio-exterior.service';
import { Tramite31602Store } from '../estados/stores/tramite31602.store';
import { Tramite31602IvaeiepsStore } from '../estados/stores/tramite31602ivaeieps.store';

describe('ComercioExteriorService', () => {
  let service: ComercioExteriorService;
  let httpMock: jest.Mocked<HttpClient>;
  let tramite31602StoreMock: jest.Mocked<Tramite31602Store>;
  let tramite31602IvaeiepsStoreMock: jest.Mocked<Tramite31602IvaeiepsStore>;

  beforeEach(() => {
    const httpClientMock = { get: jest.fn() } as unknown as jest.Mocked<HttpClient>;
    const tramiteStoreMock = { setDynamicFieldValue: jest.fn() } as unknown as jest.Mocked<Tramite31602Store>;
    const ivaeiepsStoreMock = {
      setIndiqueCheck: jest.fn(),
      setResigtro: jest.fn(),
      setTelefono: jest.fn(),
      setCorreo: jest.fn(),
      setManifieste: jest.fn(),
      setIndiqueIva: jest.fn(),
      setEmpleados: jest.fn(),
      setInfraestructura: jest.fn(),
      setMonto: jest.fn(),
      setAntiguedad: jest.fn(),
      setTipoDe: jest.fn(),
      setValorPesos: jest.fn(),
      setDescripcion: jest.fn(),
      setHaContado: jest.fn(),
      setEnCasoIva: jest.fn(),
      setNumeroOperacion: jest.fn(),
      setBanco: jest.fn(),
      setLlavePago: jest.fn(),
      setImportaciones: jest.fn(),
      setInfraestructuraIndique: jest.fn(),
      setUltimosMeses: jest.fn(),
      setOperacionesmeses: jest.fn(),
      setValor: jest.fn(),
      setTransferencias: jest.fn(),
      setTransferenciasVir: jest.fn(),
      setRetornos: jest.fn(),
      setRetornosSe: jest.fn(),
      setConstancias: jest.fn(),
      setConstanciasDe: jest.fn(),
      setEmpleadosPropios: jest.fn(),
      setNumeroEmpleados: jest.fn(),
      setNumeroEmpleadosDos: jest.fn(),
      setNumeroEmpleadosTres: jest.fn(),
      setComboBimestresUno: jest.fn(),
      setComboBimestresDos: jest.fn(),
      setComboBimestresTres: jest.fn(),
      setProveedorCumplimiento: jest.fn(),
      setDeclaracionISR: jest.fn(),
      setCancelacion: jest.fn(),
      setCumplimientoReglas: jest.fn(),
      setRecintoFiscalizado: jest.fn(),
      setRecintoEstrategico: jest.fn(),
      setCumplimientoLineamientos: jest.fn(),
      setTotal: jest.fn(),
      setTotalDos: jest.fn(),
      setConEmpleados: jest.fn(),
      setIndiqueSiLosSocios: jest.fn(),
    } as unknown as jest.Mocked<Tramite31602IvaeiepsStore>;

    TestBed.configureTestingModule({
      providers: [
        ComercioExteriorService,
        { provide: HttpClient, useValue: httpClientMock },
        { provide: Tramite31602Store, useValue: tramiteStoreMock },
        { provide: Tramite31602IvaeiepsStore, useValue: ivaeiepsStoreMock }
      ]
    });

    service = TestBed.inject(ComercioExteriorService);
    httpMock = TestBed.inject(HttpClient) as jest.Mocked<HttpClient>;
    tramite31602StoreMock = TestBed.inject(Tramite31602Store) as jest.Mocked<Tramite31602Store>;
    tramite31602IvaeiepsStoreMock = TestBed.inject(Tramite31602IvaeiepsStore) as jest.Mocked<Tramite31602IvaeiepsStore>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('obtenerTramite', () => {
    it('should return JSONResponse from the server', (done) => {
      const mockResponse = { data: 'test' };
      httpMock.get.mockReturnValueOnce(of(mockResponse));
      service.obtenerTramite(123).subscribe(data => {
        expect(data).toEqual(mockResponse);
        expect(httpMock.get).toHaveBeenCalledWith(expect.stringContaining('/123'));
        done();
      });
    });

    it('should propagate error', (done) => {
      const error = new Error('fail');
      httpMock.get.mockReturnValueOnce(throwError(() => error));
      service.obtenerTramite(123).subscribe({
        next: () => fail('should error'),
        error: (err) => {
          expect(err).toBe(error);
          done();
        }
      });
    });
  });

  it('should getEmpresasTablaDatos and handle errors', (done) => {
    const mockResponse = { empresas: [] };
    httpMock.get.mockReturnValueOnce(of(mockResponse));
    service.getEmpresasTablaDatos().subscribe(data => {
      expect(data).toEqual(mockResponse);
      expect(httpMock.get).toHaveBeenCalledWith('./assets/json/31602/empresas-del-grupo-tabla.json');
      done();
    });
  });

  it('should propagate error in getEmpresasTablaDatos', (done) => {
    const error = new Error('fail');
    httpMock.get.mockReturnValueOnce(throwError(() => error));
    service.getEmpresasTablaDatos().subscribe({
      next: () => fail('should error'),
      error: (err) => {
        expect(err).toBe(error);
        done();
      }
    });
  });

  it('should getBancoDatos and handle errors', (done) => {
    const mockResponse = { bancos: [] };
    httpMock.get.mockReturnValueOnce(of(mockResponse));
    service.getBancoDatos().subscribe(data => {
      expect(data).toEqual(mockResponse);
      expect(httpMock.get).toHaveBeenCalledWith('assets/json/31602/banco-catalog.json');
      done();
    });
  });

  it('should propagate error in getBancoDatos', (done) => {
    const error = new Error('fail');
    httpMock.get.mockReturnValueOnce(throwError(() => error));
    service.getBancoDatos().subscribe({
      next: () => fail('should error'),
      error: (err) => {
        expect(err).toBe(error);
        done();
      }
    });
  });

  it('should getAnterioresDatos and handle errors', (done) => {
    const mockResponse = { anteriores: [] };
    httpMock.get.mockReturnValueOnce(of(mockResponse));
    service.getAnterioresDatos().subscribe(data => {
      expect(data).toEqual(mockResponse);
      expect(httpMock.get).toHaveBeenCalledWith('assets/json/31602/anteriores-tabla.json');
      done();
    });
  });

  it('should propagate error in getAnterioresDatos', (done) => {
    const error = new Error('fail');
    httpMock.get.mockReturnValueOnce(throwError(() => error));
    service.getAnterioresDatos().subscribe({
      next: () => fail('should error'),
      error: (err) => {
        expect(err).toBe(error);
        done();
      }
    });
  });

  it('should getConsultaDatos and handle errors', (done) => {
    const mockResponse = { consulta: [] };
    httpMock.get.mockReturnValueOnce(of(mockResponse));
    service.getConsultaDatos().subscribe(data => {
      expect(data).toEqual(mockResponse);
      expect(httpMock.get).toHaveBeenCalledWith('assets/json/31602/consulta-datos.json');
      done();
    });
  });

  it('should propagate error in getConsultaDatos', (done) => {
    const error = new Error('fail');
    httpMock.get.mockReturnValueOnce(throwError(() => error));
    service.getConsultaDatos().subscribe({
      next: () => fail('should error'),
      error: (err) => {
        expect(err).toBe(error);
        done();
      }
    });
  });

  it('should call setDynamicFieldValue in actualizarEstadoFormulario', () => {
    service.actualizarEstadoFormulario('campo', 'valor');
    expect(tramite31602StoreMock.setDynamicFieldValue).toHaveBeenCalledWith('campo', 'valor');
  });

  it('should getConsultaDatosDos and handle errors', (done) => {
    const mockResponse = { consulta: [] };
    httpMock.get.mockReturnValueOnce(of(mockResponse));
    service.getConsultaDatosDos().subscribe(data => {
      expect(data).toEqual(mockResponse);
      expect(httpMock.get).toHaveBeenCalledWith('assets/json/31602/consulta-datos-por-regimen.json');
      done();
    });
  });

  it('should propagate error in getConsultaDatosDos', (done) => {
    const error = new Error('fail');
    httpMock.get.mockReturnValueOnce(throwError(() => error));
    service.getConsultaDatosDos().subscribe({
      next: () => fail('should error'),
      error: (err) => {
        expect(err).toBe(error);
        done();
      }
    });
  });

it('should call all setters in estadoFormulario', () => {
  const datos: any = {
    indiqueCheck: true,
    resigtro: 'reg',
    telefono: 'tel',
    correo: 'mail',
    manifieste: 'man',
    indiqueIva: 'iva',
    empleados: 1,
    infraestructura: 'infra',
    monto: 100,
    antiguedad: 2,
    tipoDe: 'tipo',
    valorPesos: 200,
    descripcion: 'desc',
    haContado: true,
    enCasoIva: false,
    numeroOperacion: 'op',
    banco: 'ban',
    llavePago: 'llave',
    importaciones: [],
    infraestructuraIndique: 'ind',
    ultimosMeses: 3,
    operacionesmeses: 4,
    valor: 5,
    transferencias: [],
    transferenciasVir: [],
    retornos: [],
    retornosSe: [],
    constancias: [],
    constanciasDe: [],
    empleadosPropios: 10,
    numeroEmpleados: 11,
    numeroEmpleadosDos: 12,
    numeroEmpleadosTres: 13,
    comboBimestresUno: [],
    comboBimestresDos: [],
    comboBimestresTres: [],
    proveedorCumplimiento: 'prov',
    declaracionISR: 'dec',
    cancelacion: false,
    cumplimientoReglas: true,
    recintoFiscalizado: false,
    recintoEstrategico: true,
    cumplimientoLineamientos: false,
    total: 1000,
    totalDos: 2000,
    conEmpleados: true,
    indiqueSiLosSocios: false,
  };
  service.estadoFormulario(datos);

  const storeAny = tramite31602IvaeiepsStoreMock as Record<string, any>;
  Object.keys(datos).forEach(key => {
    const setterName = 'set' + key.charAt(0).toUpperCase() + key.slice(1);
    if (typeof storeAny[setterName] === 'function') {
      expect(storeAny[setterName]).toHaveBeenCalledWith(datos[key]);
    }
  });
});
});