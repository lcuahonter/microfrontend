import { TestBed } from '@angular/core/testing';
import { DatosComunesService } from './datos-comunes.service';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { DatosComunesStore, DatosComunesState } from '../estados/stores/datos-comunes.store';

describe('DatosComunesService', () => {
  let service: DatosComunesService;
  let httpMock: jest.Mocked<HttpClient>;
  let storeMock: jest.Mocked<DatosComunesStore>;

  beforeEach(() => {
    const httpClientMock = { get: jest.fn() } as unknown as jest.Mocked<HttpClient>;
    const datosComunesStoreMock = {
      setAutorizacionIVAIEPS: jest.fn(),
      setRegimenUno: jest.fn(),
      setRegimenDos: jest.fn(),
      setRegimenTres: jest.fn(),
      setSectorProductivo: jest.fn(),
      setServicio: jest.fn(),
      setPreOperativo: jest.fn(),
      setIndiqueSi: jest.fn(),
      setSenale: jest.fn(),
      setEmpPropios: jest.fn(),
      setBimestre: jest.fn(),
      setSenaleSi: jest.fn(),
      setSeMomento: jest.fn(),
      setCumplir: jest.fn(),
      setIndique: jest.fn(),
      setEncuentra: jest.fn(),
      setDelMismo: jest.fn(),
      setSenaleMomento: jest.fn(),
      setEnCaso: jest.fn(),
      setComboBimestresIDCSeleccione: jest.fn(),
      setIngresar: jest.fn(),
      setEncuentraSus: jest.fn(),
      setRegistrosQue: jest.fn(),
      setRegistrosQue2: jest.fn(),
      setMomentoIngresar: jest.fn(),
      setIndiqueCuenta: jest.fn(),
      setIndiqueCheck: jest.fn(),
      setNombreDel: jest.fn(),
      setLugarDeRadicacion: jest.fn(),
      setContabilidad: jest.fn(),
      setRmfRadio: jest.fn(),
      setVinculacionRegistroCancelado: jest.fn(),
      setProveedoresListadoSAT: jest.fn(),
      setManifestado: jest.fn(),
      setProtesta: jest.fn(),
    } as unknown as jest.Mocked<DatosComunesStore>;

    TestBed.configureTestingModule({
      providers: [
        DatosComunesService,
        { provide: HttpClient, useValue: httpClientMock },
        { provide: DatosComunesStore, useValue: datosComunesStoreMock }
      ]
    });

    service = TestBed.inject(DatosComunesService);
    httpMock = TestBed.inject(HttpClient) as jest.Mocked<HttpClient>;
    storeMock = TestBed.inject(DatosComunesStore) as jest.Mocked<DatosComunesStore>;
  });

  const httpMethods = [
    { name: 'getProductivoDatos', url: './assets/json/31602/productivo.json' },
    { name: 'getServiciosAgaceDatos', url: './assets/json/31602/serviciosAgace.json' },
    { name: 'getTablaDatos', url: './assets/json/31602/mencione-el-nombre.json' },
    { name: 'getBancoDatos', url: 'assets/json/31602/banco-catalog.json' },
    { name: 'getComboBimestres', url: 'assets/json/31602/combo-bimestres.json' },
    { name: 'getInstalacionesPrincipalesDatos', url: 'assets/json/31602/instalacionesPrincipales-tabla.json' },
    { name: 'getControlInventariosTabla', url: 'assets/json/31602/control-inventarios-tabla.json' },
    { name: 'getAgregarMiembroTabla', url: 'assets/json/31602/agregar.json' },
    { name: 'getConsultaDatosComunes', url: './assets/json/31602/datos-commune-consulta.json' },
  ];

  httpMethods.forEach(({ name, url }) => {
    it(`should return data for ${name}`, (done) => {
      const mockResponse = { data: 'test' };
      httpMock.get.mockReturnValueOnce(of(mockResponse));
      (service as any)[name]().subscribe((data: any) => {
        expect(data).toEqual(mockResponse);
        expect(httpMock.get).toHaveBeenCalledWith(url);
        done();
      });
    });

    it(`should propagate error for ${name}`, (done) => {
      const error = new Error('fail');
      httpMock.get.mockReturnValueOnce(throwError(() => error));
      (service as any)[name]().subscribe({
        next: () => fail('should error'),
        error: (err: any) => {
          expect(err).toBe(error);
          done();
        }
      });
    });
  });

  it('should update all fields in store in actualizarEstadoFormulario', () => {
    const datos: DatosComunesState = {
      autorizacionIVAIEPS: 'a',
      regimenUno: true,
      regimenDos: false,
      regimenTres: true,
      sectorProductivo: 'e',
      servicio: 'f',
      preOperativo: false,
      indiqueSi: true,
      senale: false,
      empPropios: 'j',
      bimestre: 'k',
      senaleSi: true,
      seMomento: false,
      cumplir: true,
      indique: false,
      encuentra: true,
      delMismo: false,
      senaleMomento: true,
      enCaso: false,
      comboBimestresIDCSeleccione: 'r',
      ingresar: true,
      encuentraSus: false,
      registrosQue: 'u',
      registrosQue2: 'v',
      momentoIngresar: true,
      indiqueCuenta: false,
      nombreDel: 'z',
      lugarDeRadicacion: 'aa',
      contabilidad: true,
      rmfRadio: false,
      vinculacionRegistroCancelado: true,
      proveedoresListadoSAT: false,
      indiqueCheck: 'y',
      manifestado: true,
      protesta: false,
    };

    service.actualizarEstadoFormulario(datos);

    expect(storeMock.setAutorizacionIVAIEPS).toHaveBeenCalledWith('a');
    expect(storeMock.setRegimenUno).toHaveBeenCalledWith(true);
    expect(storeMock.setRegimenDos).toHaveBeenCalledWith(false);
    expect(storeMock.setRegimenTres).toHaveBeenCalledWith(true);
    expect(storeMock.setSectorProductivo).toHaveBeenCalledWith('e');
    expect(storeMock.setServicio).toHaveBeenCalledWith('f');
    expect(storeMock.setPreOperativo).toHaveBeenCalledWith(false);
    expect(storeMock.setIndiqueSi).toHaveBeenCalledWith(true);
    expect(storeMock.setSenale).toHaveBeenCalledWith(false);
    expect(storeMock.setEmpPropios).toHaveBeenCalledWith('j');
    expect(storeMock.setBimestre).toHaveBeenCalledWith('k');
    expect(storeMock.setSenaleSi).toHaveBeenCalledWith(true);
    expect(storeMock.setSeMomento).toHaveBeenCalledWith(false);
    expect(storeMock.setEncuentra).toHaveBeenCalledWith(true);
    expect(storeMock.setDelMismo).toHaveBeenCalledWith(false);
    expect(storeMock.setSenaleMomento).toHaveBeenCalledWith(true);
    expect(storeMock.setEnCaso).toHaveBeenCalledWith(false);
    expect(storeMock.setComboBimestresIDCSeleccione).toHaveBeenCalledWith('r');
    expect(storeMock.setIngresar).toHaveBeenCalledWith(true);
    expect(storeMock.setEncuentraSus).toHaveBeenCalledWith(false);
    expect(storeMock.setRegistrosQue).toHaveBeenCalledWith('u');
    expect(storeMock.setRegistrosQue2).toHaveBeenCalledWith('v');
    expect(storeMock.setMomentoIngresar).toHaveBeenCalledWith(true);
    expect(storeMock.setIndiqueCuenta).toHaveBeenCalledWith(false);
    expect(storeMock.setNombreDel).toHaveBeenCalledWith('z');
    expect(storeMock.setLugarDeRadicacion).toHaveBeenCalledWith('aa');
    expect(storeMock.setContabilidad).toHaveBeenCalledWith(true);
    expect(storeMock.setRmfRadio).toHaveBeenCalledWith(false);
    expect(storeMock.setVinculacionRegistroCancelado).toHaveBeenCalledWith(true);
    expect(storeMock.setProveedoresListadoSAT).toHaveBeenCalledWith(false);
    expect(storeMock.setIndiqueCheck).toHaveBeenCalledWith('y');
  });
});