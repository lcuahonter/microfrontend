import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Solicitud80104State, Tramite80104Store } from '../../../estados/tramites/tramite80104.store';
import { Tramite80101State, Tramite80101Store } from '../../80103/estados/tramite80101.store';
import { ComplementosSeccionState, ComplementosSeccionStore } from '../../../estados/tramites/complementos-seccion.store';
import { FederatoriosState, FederatoriosStore } from '../../../estados/tramites/federatarios.store';
import { ComplementarState, ComplementarStore } from '../../../estados/tramites/complementar.store';
import { Solocitud80105Service } from './service80105.service';

const mockTramite80104Store = () => ({
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
});

const mockTramite80101Store = () => ({
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
});

const mockComplementosSeccionStore = () => ({
  setDynamicFieldValue: jest.fn(),
});

const mockFederatoriosStore = () => ({
  setDynamicFieldValue: jest.fn(),
});

const mockComplementarStore = () => ({
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
});

describe('Solocitud80105Service', () => {
  let service: Solocitud80105Service;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
      Solocitud80105Service,
      { provide: Tramite80104Store, useValue: mockTramite80104Store() },
      { provide: Tramite80101Store, useValue: mockTramite80101Store() },
      { provide: ComplementosSeccionStore, useValue: mockComplementosSeccionStore() },
      { provide: FederatoriosStore, useValue: mockFederatoriosStore() },
      { provide: ComplementarStore, useValue: mockComplementarStore() },
    ],
    });
    service = TestBed.inject(Solocitud80105Service);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('debe ser creado', () => {
    expect(service).toBeTruthy();
  });

  it('debe obtener getRegistroTomaMuestrasMercanciasData()', () => {
    const mockData: Solicitud80104State = { rfc: 'RFC123', estado: '', disponibles: [], seleccionadas: [], fraccionArancelaria: '', descripcion: '', fraccionTres: '', descripcionTres: '', anexoDos: [], anexoTres: [] } as any;
    service.getRegistroTomaMuestrasMercanciasData().subscribe(data => {
      expect(data).toEqual(mockData);
    });
    const req = httpMock.expectOne('assets/json/80104/serviciosExtraordinarios.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('debe obtener getRegistroComplementosData()', () => {
    const mockData: ComplementosSeccionState = {} as any;
    service.getRegistroComplementosData().subscribe(data => {
      expect(data).toEqual(mockData);
    });
    const req = httpMock.expectOne('assets/json/80104/serviciosExtraordinarios.json');
    req.flush(mockData);
  });

  it('debe obtener getRegistroFederatoriosData()', () => {
    const mockData: FederatoriosState = {} as any;
    service.getRegistroFederatoriosData().subscribe(data => {
      expect(data).toEqual(mockData);
    });
    const req = httpMock.expectOne('assets/json/80104/serviciosExtraordinarios.json');
    req.flush(mockData);
  });

  it('debe obtener getRegistroComplementarData()', () => {
    const mockData: ComplementarState = { permanecera: 'Sí' } as any;
    service.getRegistroComplementarData().subscribe(data => {
      expect(data).toEqual(mockData);
    });
    const req = httpMock.expectOne('assets/json/80104/serviciosExtraordinarios.json');
    req.flush(mockData);
  });

  it('debe actualizar ComplementosSeccionStore con los datos proporcionados', () => {
    const mockComplementosStore = TestBed.inject(ComplementosSeccionStore);
    const spy = jest.spyOn(mockComplementosStore, 'setDynamicFieldValue');

    const testData: ComplementosSeccionState = {
        campo1: 'valor1',
        campo2: 'valor2',
    } as any;

    service.actualizarComplementos(testData);

    expect(spy).toHaveBeenCalledTimes(Object.keys(testData).length);
    expect(spy).toHaveBeenCalledWith('campo1', 'valor1');
    expect(spy).toHaveBeenCalledWith('campo2', 'valor2');
    });

    it('debe actualizar FederatoriosStore con los datos proporcionados', () => {
    const mockFederatoriosStore = TestBed.inject(FederatoriosStore);
    const spy = jest.spyOn(mockFederatoriosStore, 'setDynamicFieldValue');

    const testData: FederatoriosState = {
        clave1: 'valorA',
        clave2: 'valorB',
    } as any;

    service.actualizarFederatorios(testData);

    expect(spy).toHaveBeenCalledTimes(Object.keys(testData).length);
    expect(spy).toHaveBeenCalledWith('clave1', 'valorA');
    expect(spy).toHaveBeenCalledWith('clave2', 'valorB');
    });

    it('debe actualizar ComplementarStore con los datos proporcionados', () => {
        const mockComplementarStore = TestBed.inject(ComplementarStore);

        const testData: ComplementarState = {
            permanecera: 'Sí',
            tipo: 'Tipo A',
            fechaDeFirma: '2025-01-01',
            fetchaDeFinDeVigencia: '2025-12-31',
            tipos: ['A', 'B'],
            cantidad: 100,
            descripsion: 'desc',
            mnx: 1000,
            totalDeEmpleados: 50,
            directos: 30,
            indirectos: 20,
            directo: 'D1',
            cedula: 'C123',
            fechaCedula: '2025-06-24',
            indirectosDatos: {},
            contrato: 'C987',
            objeto: 'Obj',
            fechaFirma: '2025-01-01',
            fechaFinVigencia: '2025-12-31',
            rfcEmpresa: 'RFC001',
            razonSocial: 'Empresa S.A.',
            fraccionArancelariaProductoTerminado: '0101.21.00',
            umt: 'kg',
            descripcionComercialProductoTerminado: 'Producto A',
            turnos: 3,
            horasPorTurno: 8,
            cantidadEmpleados: 150,
            cantidadMaquinaria: 20,
            descripcionMaquinaria: 'Maquinas',
            capacidadInstaladaMensual: 5000,
            capacidadInstaladaAnual: 60000,
            calculoCapacidadInstalada: 'auto',
            capacidadUtilizadaPct: 80,
        } as any;

        service.actualizarComplementar(testData);

        expect(mockComplementarStore.setPermanecera).toHaveBeenCalledWith('Sí');
        expect(mockComplementarStore.setTipo).toHaveBeenCalledWith('Tipo A');
        expect(mockComplementarStore.setCantidad).toHaveBeenCalledWith(100);
        expect(mockComplementarStore.setDescripcionComercialProductoTerminado).toHaveBeenCalledWith('Producto A');
        // Add more expects as needed
        });

        it('debe actualizar Tramite80104Store con los datos proporcionados de Solicitud80104State', () => {
  const tramiteStore = TestBed.inject(Tramite80104Store);
  const testData: Solicitud80104State = {
    rfc: 'RFC001',
    estado: 'Activo',
    disponibles: ['A'],
    seleccionadas: ['B'],
    fraccionArancelaria: '123',
    descripcion: 'desc',
    fraccionTres: '456',
    descripcionTres: 'desc3',
    anexoDos: [1],
    anexoTres: [2],
  } as any;

  service.actualizarEstadoFormulario(testData);

  expect(tramiteStore.setRfc).toHaveBeenCalledWith('RFC001');
  expect(tramiteStore.setEstado).toHaveBeenCalledWith('Activo');
  expect(tramiteStore.setDisponibles).toHaveBeenCalledWith(['A']);
  expect(tramiteStore.setSeleccionadas).toHaveBeenCalledWith(['B']);
  expect(tramiteStore.setFraccionArancelaria).toHaveBeenCalledWith('123');
  expect(tramiteStore.setDescripcion).toHaveBeenCalledWith('desc');
  expect(tramiteStore.setFraccionTres).toHaveBeenCalledWith('456');
  expect(tramiteStore.setDescripcionTres).toHaveBeenCalledWith('desc3');
  expect(tramiteStore.setAnexoDos).toHaveBeenCalledWith([1]);
  expect(tramiteStore.setAnexoTres).toHaveBeenCalledWith([2]);
});

it('debe actualizar Tramite80101Store con los datos proporcionados de Tramite80101State', () => {
  const tramiteStore = TestBed.inject(Tramite80101Store);

  const testData: Tramite80101State = {
    infoRegistro: { nombre: 'test' },
    aduanaDeIngreso: ['aduana'],
    datosImmex: [{ id: 1 }],
    datos: ['dato'],
    aduanaDeIngresoSelecion: { id: 2 },
    formaValida: { a: true },
    rfcEmpresa: 'RFCX',
    numeroPrograma: 'NP001',
    tiempoPrograma: '12M',
    annexoDosTres: {
      anexoDosTablaLista: ['dos'],
      anexoTresTablaLista: ['tres'],
    },
    indicePrevioRuta: 1,
    annexoUno: {
      seccionActiva: 'A',
      datosParaNavegar: {},
      importarDatosTabla: [],
      exportarDatosTabla: [],
    },
    empresas: ['empresa1'],
    servicios: ['serv1'],
    paisesOrigen: ['pais'],
    datosEmpresaExtranjera: ['extranjera'],
    datosComplimentos: {},
    empressaSubFabricantePlantas: {
      datosSubcontratista: { rfc: 'rfc' },
      plantasSubfabricantesAgregar: [],
      plantasBuscadas: ['buscar'],
      plantasPorCompletar: [],
    },
    tablaDatosComplimentos: ['comp'],
    tablaDatosComplimentosExtranjera: ['compExt'],
  } as any;

  service.actualizarEstadoFormularios(testData);

  expect(tramiteStore.setInfoRegistro).toHaveBeenCalledWith(testData.infoRegistro);
  expect(tramiteStore.setRfcEmpresa).toHaveBeenCalledWith('RFCX');
  expect(tramiteStore.setFormValida).toHaveBeenCalledWith({ a: true });
  expect(tramiteStore.setAnnexoDosTableLista).toHaveBeenCalledWith(['dos']);
  expect(tramiteStore.setAnnexoTresTableLista).toHaveBeenCalledWith(['tres']);
  expect(tramiteStore.setAnnexoUnoSeccionActiva).toHaveBeenCalledWith('A');
  expect(tramiteStore.setCamposEmpresa).toHaveBeenCalledWith('RFCX', 'NP001', '12M');
  expect(tramiteStore.eliminarPlantas).toHaveBeenCalledWith(['buscar']);
});

});
