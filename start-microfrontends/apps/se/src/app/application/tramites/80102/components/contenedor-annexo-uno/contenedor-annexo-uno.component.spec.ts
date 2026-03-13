import { ContenedorAnnexoUnoComponent } from "./contenedor-annexo-uno.component";



describe('ContenedorAnnexoUnoComponent', () => {
  let component: ContenedorAnnexoUnoComponent;
  let store: any;
  let query: any;
  let consultaQuery: any;
  let fb: any;
  let router: any;
  let activatedRoute: any;

  beforeEach(() => {
    store = {
      setDatosComplimento: jest.fn(),
      setDatosComplimentoDos: jest.fn(),
      setImportarDatosTabla: jest.fn(),
      setExportarDatosTabla: jest.fn(),
      setAnnexoUnoSeccionActiva: jest.fn(),
      setDatosParaNavegar: jest.fn(),
      setProveedorClienteDatosTablaUno: jest.fn(),
      setProveedorClienteDatosTablaDos: jest.fn(),
    };
    query = {
      selectImportarTablsDatos$: { pipe: jest.fn().mockReturnValue({ subscribe: jest.fn() }) },
      selectExportarTablsDatos$: { pipe: jest.fn().mockReturnValue({ subscribe: jest.fn() }) },
      selectDatosComplimentos$: { pipe: jest.fn().mockReturnValue({ subscribe: jest.fn() }) },
      selectDatosComplimentosDos$: { pipe: jest.fn().mockReturnValue({ subscribe: jest.fn() }) },
    };
    consultaQuery = {
      selectConsultaioState$: { pipe: jest.fn().mockReturnValue({ subscribe: jest.fn() }) },
    };
    fb = {
      group: jest.fn().mockImplementation((obj) => ({
        setValue: jest.fn(),
        ...obj,
      })),
    };
    router = {};
    activatedRoute = {};

    component = new ContenedorAnnexoUnoComponent(
      router,
      activatedRoute,
      store,
      query,
      consultaQuery,
      fb
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize anexoUnoConfig and anexoImportacionConfig', () => {
    expect(component.anexoUnoConfig).toBeDefined();
    expect(component.anexoImportacionConfig).toBeDefined();
  });

  it('should initialize form groups', () => {
    component.inicializarFormularioDatosSubcontratista();
    expect(component.anexoUnoFormGroup.get('fraccionArancelaria')).toBeDefined();
    expect(component.anexoUnoFormGroup.get('descripcion')).toBeDefined();

    component.inicializarFormularioDatosDosSubcontratista();
    expect(component.anexoDosFormGroup.get('fraccionArancelaria')).toBeDefined();
    expect(component.anexoDosFormGroup.get('descripcion')).toBeDefined();
  });

  it('should call store.setDatosComplimento in modifierComplimentos', () => {
    const complimentos = { test: 'value' } as any;
    component.modifierComplimentos(complimentos);
    expect(store.setDatosComplimento).toHaveBeenCalledWith(complimentos);
  });

  it('should call store.setDatosComplimentoDos in modifierDosComplimentos', () => {
    const complimentos = { test: 'value' } as any;
    component.modifierDosComplimentos(complimentos);
    expect(store.setDatosComplimentoDos).toHaveBeenCalledWith(complimentos);
  });

  it('should update anexoUnoTablaLista and call store.setImportarDatosTabla', () => {
    const event = [{ encabezadoFraccion: 'A' }] as any;
    component.obtenerAnexoUnoDevolverLaLlamada(event);
    expect(component.anexoUnoTablaLista).toEqual(event);
    expect(store.setImportarDatosTabla).toHaveBeenCalledWith(event);
  });

  it('should update anexoDosTablaLista and call store.setExportarDatosTabla', () => {
    const event = [{ encabezadoFraccion: 'B' }] as any;
    component.obtenerAnexoDosDevolverLaLlamada(event);
    expect(component.anexoDosTablaLista).toEqual(event);
    expect(store.setExportarDatosTabla).toHaveBeenCalledWith(event);
  });

  it('should handle rutaLaFraccionDeComplemento for complementar-fraccion', () => {
    const event:any = {
      catagoria: 'complementar-fraccion',
      id: '123',
      datos: { encabezadoFraccion: 'FRA' },
    };
    component.rutaLaFraccionDeComplemento(event);
    expect(component.selectedFraccion).toBe('FRA');
    expect(component.selectedTableId).toBe('123');
    expect(component.mostrarComplementarFraccionPopup).toBe(true);
    expect(store.setAnnexoUnoSeccionActiva).toHaveBeenCalledWith('123');
    expect(store.setDatosParaNavegar).toHaveBeenCalledWith(event.datos);
  });

  it('should handle rutaLaFraccionDeComplemento for contenedor-proveedor-cliente', () => {
    const event:any = {
      catagoria: 'contenedor-proveedor-cliente',
      id: '123',
      datos: {},
    };
    component.rutaLaFraccionDeComplemento(event);
    expect(component.mostrarProveedorClientePopup).toBe(true);
  });

  it('should handle rutaLaFraccionDeComplemento for proyecto-immex', () => {
    const event:any = {
      catagoria: 'proyecto-immex',
      id: '123',
      datos: {},
    };
    component.rutaLaFraccionDeComplemento(event);
    expect(component.mostrarProyectoImmexPopup).toBe(true);
  });

  it('should handle rutaLaFraccionDeComplemento for proveedor-por-archivo', () => {
    const event:any = {
      catagoria: 'proveedor-por-archivo',
      id: '123',
      datos: {},
    };
    component.rutaLaFraccionDeComplemento(event);
    expect(component.mostrarProveedorPorArchivoPopup).toBe(true);
  });

  it('should close popups', () => {
    component.mostrarComplementarFraccionPopup = true;
    component.cerrarComplementarFraccion();
    expect(component.mostrarComplementarFraccionPopup).toBe(false);

    component.mostrarProveedorClientePopup = true;
    component.cerrarContenedorProveedorCliente();
    expect(component.mostrarProveedorClientePopup).toBe(false);

    component.mostrarProyectoImmexPopup = true;
    component.cerrarProyectoImmex();
    expect(component.mostrarProyectoImmexPopup).toBe(false);

    component.mostrarProveedorPorArchivoPopup = true;
    component.cerrarProveedorPorArchivo();
    expect(component.mostrarProveedorPorArchivoPopup).toBe(false);
  });

  it('should call correct store method in datosActualizadosProveedorCliente', () => {
    component.proveedorClienteDatosTablaId = 'IMPORT';
    const event:any = [{ test: 1 }];
    component.datosActualizadosProveedorCliente(event);
    expect(store.setProveedorClienteDatosTablaUno).toHaveBeenCalledWith(event);

    component.proveedorClienteDatosTablaId = 'EXPORT';
    component.datosActualizadosProveedorCliente(event);
    expect(store.setProveedorClienteDatosTablaDos).toHaveBeenCalledWith(event);
  });

  it('should update anexoUnoTablaLista in onGuardarComplementarFraccion for IMPORT', () => {
    component.selectedTableId = 'IMPORT';
    component.anexoUnoTablaLista = [
      {
        encabezadoFraccion: 'desc',
        encabezadoFraccionArancelaria: '',
        encabezadoDescripcionComercial: '',
        encabezadoAnexoII: '',
        encabezadoTipo: '',
        encabezadoValorEnMonedaMensual: 0,
        encabezadoValorEnMonedaAnual: 0,
        encabezadoVolumenMensual: 0,
        encabezadoVolumenAnual: 0,
        encabezadoUmt: '',
        encabezadoCategoria: '',
        estatus: false,
      },
    ];
    const data = {
      descripcion: 'desc',
      monedaNacionalMensual: 10,
      monedaNacionalDeDosPeriodos: 20,
      volumenMensual: 30,
      twoPeriodVolume: 40,
    };
    component.onGuardarComplementarFraccion(data);
    expect(component.anexoUnoTablaLista[0].encabezadoValorEnMonedaMensual).toBe(10);
    expect(component.anexoUnoTablaLista[0].encabezadoValorEnMonedaAnual).toBe(20);
    expect(component.anexoUnoTablaLista[0].encabezadoVolumenMensual).toBe(30);
    expect(component.anexoUnoTablaLista[0].encabezadoVolumenAnual).toBe(40);
  });

  it('should update anexoDosTablaLista in onGuardarComplementarFraccion for EXPORT', () => {
    component.selectedTableId = 'EXPORT';
    component.anexoDosTablaLista = [
      { 
        encabezadoFraccion: 'desc',
        encabezadoFraccionExportacion: '',
        encabezadoFraccionImportacion: '',
        encabezadoDescripcionComercial: '',
        encabezadoDescripcionComercialImportacion: '',
        encabezadoAnexoII: '',
        encabezadoTipo: '',
        encabezadoValorEnMonedaMensual: 0,
        encabezadoValorEnMonedaAnual: 0,
        encabezadoVolumenMensual: 0,
        encabezadoVolumenAnual: 0,
        encabezadoUmt: '',
        encabezadoCategoria: '',
        estatus: false,
       },
    ];
    const data = {
      descripcion: 'desc',
      monedaNacionalMensual: 11,
      monedaNacionalDeDosPeriodos: 21,
      volumenMensual: 31,
      twoPeriodVolume: 41,
    };
    component.onGuardarComplementarFraccion(data);
    expect(component.anexoDosTablaLista[0].encabezadoValorEnMonedaMensual).toBe(11);
    expect(component.anexoDosTablaLista[0].encabezadoValorEnMonedaAnual).toBe(21);
    expect(component.anexoDosTablaLista[0].encabezadoVolumenMensual).toBe(31);
    expect(component.anexoDosTablaLista[0].encabezadoVolumenAnual).toBe(41);
  });

  it('should not update if index not found in onGuardarComplementarFraccion', () => {
    component.selectedTableId = 'IMPORT';
    component.anexoUnoTablaLista = [
      {
        encabezadoFraccion: 'other',
        encabezadoFraccionArancelaria: '',
        encabezadoDescripcionComercial: '',
        encabezadoAnexoII: '',
        encabezadoTipo: '',
        encabezadoValorEnMonedaMensual: 0,
        encabezadoValorEnMonedaAnual: 0,
        encabezadoVolumenMensual: 0,
        encabezadoVolumenAnual: 0,
        encabezadoUmt: '',
        encabezadoCategoria: '',
        estatus: false,
      },
    ];
    const data = { descripcion: 'desc' };
    component.onGuardarComplementarFraccion(data);
    expect(component.anexoUnoTablaLista[0].encabezadoValorEnMonedaMensual).toBe(0);
  });

  it('should call destroyNotifier$ on ngOnDestroy', () => {
    const nextSpy = jest.spyOn(component['destroyNotifier$'], 'next');
    const completeSpy = jest.spyOn(component['destroyNotifier$'], 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});