import { TestBed } from '@angular/core/testing';
import { RegistrosDeComercioExteriorService } from './registros-de-comercio-exterior.service';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { Tramite31603Store } from '../estados/stores/tramite31603.store';
import { Tramite31603IvaeiepsStore } from '../estados/stores/tramite31603ivaeieps.store';

jest.mock('@libs/shared/data-access-user/src/enviroments/enviroment', () => ({
  ENVIRONMENT: { URL_SERVER_JSON_AUXILIAR: 'http://mockserver' }
}));

describe('RegistrosDeComercioExteriorService', () => {
  let service: RegistrosDeComercioExteriorService;
  let httpMock: jest.Mocked<HttpClient>;
  let tramiteStoreMock: jest.Mocked<Tramite31603Store>;
  let tramiteIvaeiepsStoreMock: jest.Mocked<Tramite31603IvaeiepsStore>;

  beforeEach(() => {
    httpMock = { get: jest.fn() } as any;
    tramiteStoreMock = {
      setDynamicFieldValue: jest.fn(),
    } as any;
    tramiteIvaeiepsStoreMock = {
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
    } as any;

    TestBed.configureTestingModule({
      providers: [
        RegistrosDeComercioExteriorService,
        { provide: HttpClient, useValue: httpMock },
        { provide: Tramite31603Store, useValue: tramiteStoreMock },
        { provide: Tramite31603IvaeiepsStore, useValue: tramiteIvaeiepsStoreMock },
      ],
    });

    service = TestBed.inject(RegistrosDeComercioExteriorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call obtenerTramite and return data', (done) => {
    const mockResponse = { data: 'ok' };
    httpMock.get.mockReturnValueOnce(of(mockResponse));
    service.obtenerTramite(123).subscribe(data => {
      expect(data).toEqual(mockResponse);
      expect(httpMock.get).toHaveBeenCalledWith('http://mockserver/123');
      done();
    });
  });

  it('should propagate error in obtenerTramite', (done) => {
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

  it('should getBancoDatos (success)', (done) => {
    const mockResponse = { data: 'bank' };
    httpMock.get.mockReturnValueOnce(of(mockResponse));
    service.getBancoDatos().subscribe(data => {
      expect(data).toEqual(mockResponse);
      expect(httpMock.get).toHaveBeenCalledWith('assets/json/31603/banco-catalog.json');
      done();
    });
  });

  it('should getBancoDatos (error)', (done) => {
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

  it('should getAnterioresDatos (success)', (done) => {
    const mockResponse = { data: 'anteriores' };
    httpMock.get.mockReturnValueOnce(of(mockResponse));
    service.getAnterioresDatos().subscribe(data => {
      expect(data).toEqual(mockResponse);
      expect(httpMock.get).toHaveBeenCalledWith('assets/json/31603/anteriores-tabla.json');
      done();
    });
  });

  it('should getEmpresasTablaDatos (success)', (done) => {
    const mockResponse = { data: 'empresas' };
    httpMock.get.mockReturnValueOnce(of(mockResponse));
    service.getEmpresasTablaDatos().subscribe(data => {
      expect(data).toEqual(mockResponse);
      expect(httpMock.get).toHaveBeenCalledWith('./assets/json/31603/empresas-del-grupo-tabla.json');
      done();
    });
  });

  it('should getConsultaDatos (success)', (done) => {
    const mockResponse = { foo: 'bar' };
    httpMock.get.mockReturnValueOnce(of(mockResponse));
    service.getConsultaDatos().subscribe(data => {
      expect(data).toEqual(mockResponse);
      expect(httpMock.get).toHaveBeenCalledWith('assets/json/31603/consulta-datos.json');
      done();
    });
  });

  it('should actualizarEstadoFormulario call setDynamicFieldValue', () => {
    service.actualizarEstadoFormulario('campo', 123);
    expect(tramiteStoreMock.setDynamicFieldValue).toHaveBeenCalledWith('campo', 123);
  });

  it('should getConsultaDatosDos (success)', (done) => {
    const mockResponse = { bar: 'baz' };
    httpMock.get.mockReturnValueOnce(of(mockResponse));
    service.getConsultaDatosDos().subscribe(data => {
      expect(data).toEqual(mockResponse);
      expect(httpMock.get).toHaveBeenCalledWith('assets/json/31603/consulta-datos-por-regimen.json');
      done();
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
    expect(tramiteIvaeiepsStoreMock.setIndiqueCheck).toHaveBeenCalledWith(datos.indiqueCheck);
    expect(tramiteIvaeiepsStoreMock.setResigtro).toHaveBeenCalledWith(datos.resigtro);
    expect(tramiteIvaeiepsStoreMock.setTelefono).toHaveBeenCalledWith(datos.telefono);
    expect(tramiteIvaeiepsStoreMock.setCorreo).toHaveBeenCalledWith(datos.correo);
    expect(tramiteIvaeiepsStoreMock.setManifieste).toHaveBeenCalledWith(datos.manifieste);
    expect(tramiteIvaeiepsStoreMock.setIndiqueIva).toHaveBeenCalledWith(datos.indiqueIva);
    expect(tramiteIvaeiepsStoreMock.setEmpleados).toHaveBeenCalledWith(datos.empleados);
    expect(tramiteIvaeiepsStoreMock.setInfraestructura).toHaveBeenCalledWith(datos.infraestructura);
    expect(tramiteIvaeiepsStoreMock.setMonto).toHaveBeenCalledWith(datos.monto);
    expect(tramiteIvaeiepsStoreMock.setAntiguedad).toHaveBeenCalledWith(datos.antiguedad);
    expect(tramiteIvaeiepsStoreMock.setTipoDe).toHaveBeenCalledWith(datos.tipoDe);
    expect(tramiteIvaeiepsStoreMock.setValorPesos).toHaveBeenCalledWith(datos.valorPesos);
    expect(tramiteIvaeiepsStoreMock.setDescripcion).toHaveBeenCalledWith(datos.descripcion);
    expect(tramiteIvaeiepsStoreMock.setHaContado).toHaveBeenCalledWith(datos.haContado);
    expect(tramiteIvaeiepsStoreMock.setEnCasoIva).toHaveBeenCalledWith(datos.enCasoIva);
    expect(tramiteIvaeiepsStoreMock.setNumeroOperacion).toHaveBeenCalledWith(datos.numeroOperacion);
    expect(tramiteIvaeiepsStoreMock.setBanco).toHaveBeenCalledWith(datos.banco);
    expect(tramiteIvaeiepsStoreMock.setLlavePago).toHaveBeenCalledWith(datos.llavePago);
    expect(tramiteIvaeiepsStoreMock.setImportaciones).toHaveBeenCalledWith(datos.importaciones);
    expect(tramiteIvaeiepsStoreMock.setInfraestructuraIndique).toHaveBeenCalledWith(datos.infraestructuraIndique);
    expect(tramiteIvaeiepsStoreMock.setUltimosMeses).toHaveBeenCalledWith(datos.ultimosMeses);
    expect(tramiteIvaeiepsStoreMock.setOperacionesmeses).toHaveBeenCalledWith(datos.operacionesmeses);
    expect(tramiteIvaeiepsStoreMock.setValor).toHaveBeenCalledWith(datos.valor);
    expect(tramiteIvaeiepsStoreMock.setTransferencias).toHaveBeenCalledWith(datos.transferencias);
    expect(tramiteIvaeiepsStoreMock.setTransferenciasVir).toHaveBeenCalledWith(datos.transferenciasVir);
    expect(tramiteIvaeiepsStoreMock.setRetornos).toHaveBeenCalledWith(datos.retornos);
    expect(tramiteIvaeiepsStoreMock.setRetornosSe).toHaveBeenCalledWith(datos.retornosSe);
    expect(tramiteIvaeiepsStoreMock.setConstancias).toHaveBeenCalledWith(datos.constancias);
    expect(tramiteIvaeiepsStoreMock.setConstanciasDe).toHaveBeenCalledWith(datos.constanciasDe);
    expect(tramiteIvaeiepsStoreMock.setEmpleadosPropios).toHaveBeenCalledWith(datos.empleadosPropios);
    expect(tramiteIvaeiepsStoreMock.setNumeroEmpleados).toHaveBeenCalledWith(datos.numeroEmpleados);
    expect(tramiteIvaeiepsStoreMock.setNumeroEmpleadosDos).toHaveBeenCalledWith(datos.numeroEmpleadosDos);
    expect(tramiteIvaeiepsStoreMock.setNumeroEmpleadosTres).toHaveBeenCalledWith(datos.numeroEmpleadosTres);
    expect(tramiteIvaeiepsStoreMock.setComboBimestresUno).toHaveBeenCalledWith(datos.comboBimestresUno);
    expect(tramiteIvaeiepsStoreMock.setComboBimestresDos).toHaveBeenCalledWith(datos.comboBimestresDos);
    expect(tramiteIvaeiepsStoreMock.setComboBimestresTres).toHaveBeenCalledWith(datos.comboBimestresTres);
    expect(tramiteIvaeiepsStoreMock.setProveedorCumplimiento).toHaveBeenCalledWith(datos.proveedorCumplimiento);
    expect(tramiteIvaeiepsStoreMock.setDeclaracionISR).toHaveBeenCalledWith(datos.declaracionISR);
    expect(tramiteIvaeiepsStoreMock.setCancelacion).toHaveBeenCalledWith(datos.cancelacion);
    expect(tramiteIvaeiepsStoreMock.setCumplimientoReglas).toHaveBeenCalledWith(datos.cumplimientoReglas);
    expect(tramiteIvaeiepsStoreMock.setRecintoFiscalizado).toHaveBeenCalledWith(datos.recintoFiscalizado);
    expect(tramiteIvaeiepsStoreMock.setRecintoEstrategico).toHaveBeenCalledWith(datos.recintoEstrategico);
    expect(tramiteIvaeiepsStoreMock.setCumplimientoLineamientos).toHaveBeenCalledWith(datos.cumplimientoLineamientos);
    expect(tramiteIvaeiepsStoreMock.setTotal).toHaveBeenCalledWith(datos.total);
    expect(tramiteIvaeiepsStoreMock.setTotalDos).toHaveBeenCalledWith(datos.totalDos);
    expect(tramiteIvaeiepsStoreMock.setConEmpleados).toHaveBeenCalledWith(datos.conEmpleados);
    expect(tramiteIvaeiepsStoreMock.setIndiqueSiLosSocios).toHaveBeenCalledWith(datos.indiqueSiLosSocios);
  });
});