import { TestBed } from '@angular/core/testing';
import { Solocitud80103Service } from './service80103service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Tramite80104Store } from '../../../estados/tramites/tramite80104.store';
import { Tramite80101Store } from '../estados/tramite80101.store';
import { ComplementosSeccionStore } from '../../../estados/tramites/complementos-seccion.store';
import { FederatoriosStore } from '../../../estados/tramites/federatarios.store';
import { ComplementarStore } from '../../../estados/tramites/complementar.store';
import { ENVIRONMENT } from '../../../../environments/environment';

describe('Solocitud80103Service', () => {
  let service: Solocitud80103Service;
  let httpMock: HttpTestingController;

  let mock80104Store: jest.Mocked<Tramite80104Store>;
  let mock80101Store: jest.Mocked<Tramite80101Store>;
  let mockCompStore: jest.Mocked<ComplementosSeccionStore>;
  let mockFedStore: jest.Mocked<FederatoriosStore>;
  let mockComplementarStore: jest.Mocked<ComplementarStore>;

  beforeEach(() => {
    mock80104Store = {
      setRfc: jest.fn(),
      setEstado: jest.fn(),
      setDisponibles: jest.fn(),
      setSeleccionadas: jest.fn(),
      setFraccionArancelaria: jest.fn(),
      setDescripcion: jest.fn(),
      setFraccionTres: jest.fn(),
      setDescripcionTres: jest.fn(),
      setAnexoDos: jest.fn(),
      setAnexoTres: jest.fn(),
    } as any;

    mock80101Store = {
      setInfoRegistro: jest.fn(),
      setAduanaDeIngreso: jest.fn(),
      setDatosImmex: jest.fn(),
      setDatos: jest.fn(),
      setAduanaDeIngresoSeleccion: jest.fn(),
      setFormValida: jest.fn(),
      setRfcEmpresa: jest.fn(),
      setNumeroPrograma: jest.fn(),
      setTiempoPrograma: jest.fn(),
      setAnnexoDosTableLista: jest.fn(),
      setAnnexoTresTableLista: jest.fn(),
      setindicePrevioRuta: jest.fn(),
      setAnnexoUnoSeccionActiva: jest.fn(),
      setDatosParaNavegar: jest.fn(),
      setImportarDatosTabla: jest.fn(),
      setExportarDatosTabla: jest.fn(),
      setCamposEmpresa: jest.fn(),
      setEmpresas: jest.fn(),
      setServicios: jest.fn(),
      setPaisesOrigen: jest.fn(),
      eliminarDatosEmpresaExtranjera: jest.fn(),
      setDatosComplimentos: jest.fn(),
      setDatosSubcontratista: jest.fn(),
      setPlantasSubfabricantesAgregar: jest.fn(),
      setPlantasBuscadas: jest.fn(),
      eliminarPlantas: jest.fn(),
      setPlantasPorCompletar: jest.fn(),
      eliminarTablaDatosComplimentos: jest.fn(),
      eliminarTablaDatosComplimentosExtranjera: jest.fn(),
    } as any;

    mockCompStore = {
      setDynamicFieldValue: jest.fn()
    } as any;

    mockFedStore = {
      setDynamicFieldValue: jest.fn()
    } as any;

    mockComplementarStore = {
      setPermanecera: jest.fn(),
      setTipo: jest.fn(),
      setFechaDeFirma: jest.fn(),
      setFetchaDeFinDeVigencia: jest.fn(),
      setTipos: jest.fn(),
      setCantidad: jest.fn(),
      setDescripsion: jest.fn(),
      setMnx: jest.fn(),
      setTotalDeEmpleados: jest.fn(),
      setDirectos: jest.fn(),
      setIndirectos: jest.fn(),
      setDirecto: jest.fn(),
      setCedula: jest.fn(),
      setFechaCedula: jest.fn(),
      setIndirectosDatos: jest.fn(),
      setContrato: jest.fn(),
      setObjeto: jest.fn(),
      setFechaFirma: jest.fn(),
      setFechaFinVigencia: jest.fn(),
      setRfcEmpresa: jest.fn(),
      setRazonSocial: jest.fn(),
      setFraccionArancelariaProductoTerminado: jest.fn(),
      setUmt: jest.fn(),
      setDescripcionComercialProductoTerminado: jest.fn(),
      setTurnos: jest.fn(),
      setHorasPorTurno: jest.fn(),
      setCantidadEmpleados: jest.fn(),
      setCantidadMaquinaria: jest.fn(),
      setDescripcionMaquinaria: jest.fn(),
      setCapacidadInstaladaMensual: jest.fn(),
      setCapacidadInstaladaAnual: jest.fn(),
      setCalculoCapacidadInstalada: jest.fn(),
      setCapacidadUtilizadaPct: jest.fn(),
    } as any;

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: Tramite80104Store, useValue: mock80104Store },
        { provide: Tramite80101Store, useValue: mock80101Store },
        { provide: ComplementosSeccionStore, useValue: mockCompStore },
        { provide: FederatoriosStore, useValue: mockFedStore },
        { provide: ComplementarStore, useValue: mockComplementarStore },
      ]
    });

    service = TestBed.inject(Solocitud80103Service);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('debe actualizar estado formulario en tramite80104Store', () => {
    const mockData: any = { rfc: 'ABC', estado: 'CDMX' };
    service.actualizarEstadoFormulario(mockData);
    expect(mock80104Store.setRfc).toHaveBeenCalledWith('ABC');
    expect(mock80104Store.setEstado).toHaveBeenCalledWith('CDMX');
  });

  it('debe actualizar estado formulario en tramite80101Store', () => {
    const mockData: any = {
      infoRegistro: 'info',
      formaValida: { paso1: true },
      rfcEmpresa: 'XYZ',
      numeroPrograma: 'NP',
      tiempoPrograma: '12',
      annexoDosTres: { anexoDosTablaLista: [], anexoTresTablaLista: [] },
      annexoUno: {
        seccionActiva: true,
        datosParaNavegar: [],
        importarDatosTabla: [],
        exportarDatosTabla: []
      },
      empressaSubFabricantePlantas: {
        datosSubcontratista: [],
        plantasSubfabricantesAgregar: [],
        plantasBuscadas: [],
        plantasPorCompletar: []
      },
      datosEmpresaExtranjera: [],
      datosComplimentos: {},
      tablaDatosComplimentos: [],
      tablaDatosComplimentosExtranjera: [],
    };
    service.actualizarEstadoFormularios(mockData);
    expect(mock80101Store.setInfoRegistro).toHaveBeenCalledWith('info');
    expect(mock80101Store.setFormValida).toHaveBeenCalledWith({ paso1: true });
    expect(mock80101Store.setRfcEmpresa).toHaveBeenCalledWith('XYZ');
  });

  it('debe actualizar datos de complementos', () => {
    const mockData: any = { campo1: 'valor1', campo2: 123 };
    service.actualizarComplementos(mockData);
    expect(mockCompStore.setDynamicFieldValue).toHaveBeenCalledWith('campo1', 'valor1');
    expect(mockCompStore.setDynamicFieldValue).toHaveBeenCalledWith('campo2', 123);
  });

  it('debe actualizar datos de federatorios', () => {
    const mockData: any = { key1: 'val1' };
    service.actualizarFederatorios(mockData);
    expect(mockFedStore.setDynamicFieldValue).toHaveBeenCalledWith('key1', 'val1');
  });

  it('debe actualizar datos de complementar', () => {
    const mockData: any = {
      permanecera: true,
      tipo: 'A',
      fechaDeFirma: '2023-01-01',
      fetchaDeFinDeVigencia: '2023-12-31',
      tipos: [],
      cantidad: 1,
      descripsion: 'desc',
      mnx: 100,
      totalDeEmpleados: 10,
      directos: 5,
      indirectos: 5,
      directo: true,
      cedula: 'ABC',
      fechaCedula: '2024-01-01',
      indirectosDatos: [],
      contrato: 'C123',
      objeto: 'OBJ',
      fechaFirma: '2024-02-01',
      fechaFinVigencia: '2024-12-31',
      rfcEmpresa: 'RFC123',
      razonSocial: 'Empresa SA',
      fraccionArancelariaProductoTerminado: '1234.56',
      umt: 'kg',
      descripcionComercialProductoTerminado: 'producto',
      turnos: 2,
      horasPorTurno: 8,
      cantidadEmpleados: 20,
      cantidadMaquinaria: 10,
      descripcionMaquinaria: 'Máquinas',
      capacidadInstaladaMensual: 1000,
      capacidadInstaladaAnual: 12000,
      calculoCapacidadInstalada: 'manual',
      capacidadUtilizadaPct: 80,
    };

    service.actualizarComplementar(mockData);
    expect(mockComplementarStore.setTipo).toHaveBeenCalledWith('A');
    expect(mockComplementarStore.setCapacidadInstaladaAnual).toHaveBeenCalledWith(12000);
  });

  it('debe obtener datos desde getRegistroTomaMuestrasMercanciasData()', () => {
    service.getRegistroTomaMuestrasMercanciasData().subscribe((resp) => {
      expect(resp).toEqual({ test: 'data' });
    });

    const req = httpMock.expectOne('assets/json/80104/serviciosExtraordinarios.json');
    expect(req.request.method).toBe('GET');
    req.flush({ test: 'data' });
  });

  it('debe obtener datos desde getRegistroTomaMuestrasMercanciasDatas()', () => {
    service.getRegistroTomaMuestrasMercanciasDatas().subscribe((resp) => {
      expect(resp).toEqual({ datos: 'mock' });
    });

    const req = httpMock.expectOne('assets/json/80104/serviciosExtraordinarios.json');
    req.flush({ datos: 'mock' });
  });

  it('debe obtener datos desde getRegistroComplementosData()', () => {
    service.getRegistroComplementosData().subscribe((resp) => {
      expect(resp).toEqual({ data: 'complementos' });
    });

    const req = httpMock.expectOne('assets/json/80104/serviciosExtraordinarios.json');
    req.flush({ data: 'complementos' });
  });

  it('debe obtener datos desde getRegistroFederatoriosData()', () => {
    service.getRegistroFederatoriosData().subscribe((resp) => {
      expect(resp).toEqual({ federatorios: true });
    });

    const req = httpMock.expectOne('assets/json/80104/serviciosExtraordinarios.json');
    req.flush({ federatorios: true });
  });

  it('debe obtener datos desde getRegistroComplementarData()', () => {
    service.getRegistroComplementarData().subscribe((resp) => {
      expect(resp).toEqual({ complementar: true });
    });

    const req = httpMock.expectOne('assets/json/80104/serviciosExtraordinarios.json');
    req.flush({ complementar: true });
  });
});
