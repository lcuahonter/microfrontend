import { EmpresasSubfabricanteComponent } from "./empresas-subfabricante.component";



describe('EmpresasSubfabricanteComponent (80102) - Unit', () => {
  let component: EmpresasSubfabricanteComponent;
  let mockAutorizacionProgrmaNuevoService: any;
  let mockFormBuilder: any;
  let mockQuery: any;
  let mockStore: any;
  let mockRouter: any;
  let mockActivatedRoute: any;
  let mockConsultaQuery: any;
  let mockComplimentosService: any;

  beforeEach(() => {
    mockAutorizacionProgrmaNuevoService = {
      obtenerListaEstado: jest.fn().mockReturnValue({
        pipe: jest.fn().mockReturnThis(),
        subscribe: jest.fn((cb) => cb({ data: [{ clave: '01', nombre: 'Estado' }] }))
      })
    };
    mockFormBuilder = {
      group: jest.fn().mockReturnValue({
        get: jest.fn((key) => ({
          value: key === 'rfc' ? 'RFC' : key === 'estado' ? '01' : ''
        })),
        setValue: jest.fn(),
        patchValue: jest.fn(),
        valid: true,
        value: { rfc: 'RFC', estado: '01' }
      })
    };
    mockQuery = {
      datosSubcontratistaEstado$: {
        pipe: jest.fn().mockReturnThis(),
        subscribe: jest.fn((cb) => cb({ rfc: 'RFC', estado: '01' }))
      },
      plantasBuscadas$: {
        pipe: jest.fn().mockReturnThis(),
        subscribe: jest.fn((cb) => cb([{ rfc: 'RFC', estado: '01' }]))
      },
      plantasSubfabricantesAgregar$: {
        pipe: jest.fn().mockReturnThis(),
        subscribe: jest.fn((cb) => cb([{ rfc: 'RFC', estado: '01' }]))
      }
    };
    mockStore = {
      setFormValida: jest.fn(),
      setDatosSubcontratista: jest.fn(),
      setPlantasBuscadas: jest.fn(),
      setPlantasSubfabricantesAgregar: jest.fn(),
      eliminarPlantas: jest.fn(),
      setPlantasPorCompletar: jest.fn(),
      setindicePrevioRuta: jest.fn()
    };
    mockRouter = { navigate: jest.fn() };
    mockActivatedRoute = {};
    mockConsultaQuery = {
      selectConsultaioState$: {
        pipe: jest.fn().mockReturnThis(),
        subscribe: jest.fn((cb) => cb({ readonly: false }))
      }
    };
    mockComplimentosService = {
      getSubfabricantesDisponibles: jest.fn().mockReturnValue({
        pipe: jest.fn().mockReturnThis(),
        subscribe: jest.fn((cb) => cb({ datos: [{ rfc: 'RFC', estado: '01' }] }))
      }),
      mapApiResponseToPlantasSubfabricante: jest.fn().mockReturnValue([{ rfc: 'RFC', estado: '01' }])
    };

    component = new EmpresasSubfabricanteComponent(
      mockAutorizacionProgrmaNuevoService,
      mockFormBuilder,
      mockQuery,
      mockStore,
      mockRouter,
      mockActivatedRoute,
      mockConsultaQuery,
      mockComplimentosService
    );
    component.formularioDatosSubcontratista = mockFormBuilder.group();
    component.store = mockStore;
    component.query = mockQuery;
    component._compartidaSvc = mockComplimentosService;
    component.AutorizacionProgrmaNuevoServiceServicios = mockAutorizacionProgrmaNuevoService;
  });

  it('should create and initialize formularioDatosSubcontratista', () => {
    expect(component).toBeTruthy();
    expect(component.formularioDatosSubcontratista).toBeDefined();
  });

  it('should set esFormularioSoloLectura from consultaQuery', () => {
    expect(component.esFormularioSoloLectura).toBe(false);
  });

  it('should run ngOnInit and call obtenerDatosDelAlmacen and obtenerListaEstado', () => {
    const spyDatos = jest.spyOn(component, 'obtenerDatosDelAlmacen');
    const spyLista = jest.spyOn(component, 'obtenerListaEstado');
    component.ngOnInit();
    expect(spyDatos).toHaveBeenCalled();
    expect(spyLista).toHaveBeenCalled();
  });

  it('should run obtenerDatosDelAlmacen and set form values and arrays', () => {
    component.obtenerDatosDelAlmacen();
    expect(component.formularioDatosSubcontratista.setValue).toHaveBeenCalled();
    expect(component.store.setFormValida).toHaveBeenCalled();
    expect(component.datosTablaSubfabricantesDisponibles.length).toBeGreaterThan(0);
    expect(component.datosSubfabricanteParaSerAgregados.length).toBeGreaterThan(0);
  });

  it('should run enEstadoSeleccionado and update form and store', () => {
    const estado = { clave: '02', nombre: 'Nuevo Estado' };
    component.enEstadoSeleccionado(estado as any);
    expect(component.formularioDatosSubcontratista.patchValue).toHaveBeenCalled();
    expect(component.store.setDatosSubcontratista).toHaveBeenCalled();
  });

  it('should run alCambiarRFC and call store.setDatosSubcontratista', () => {
    component.alCambiarRFC({ rfc: 'RFC', estado: '01' });
    expect(component.store.setDatosSubcontratista).toHaveBeenCalled();
  });

  it('should not call store.setDatosSubcontratista if datosSubcontratista is falsy', () => {
    component.alCambiarRFC(undefined as any);
    expect(component.store.setDatosSubcontratista).not.toHaveBeenCalledWith(undefined);
  });

  it('should run inicializarFormularioDatosSubcontratista and set formularioDatosSubcontratista', () => {
    component.fb = mockFormBuilder as any;
    component.inicializarFormularioDatosSubcontratista();
    expect(component.formularioDatosSubcontratista).toBeDefined();
  });

  it('should run obtenerListaEstado and set estadoCatalogo', () => {
    component.obtenerListaEstado();
    expect(component.AutorizacionProgrmaNuevoServiceServicios.obtenerListaEstado).toHaveBeenCalled();
    expect(component.estadoCatalogo.length).toBeGreaterThan(0);
  });

  it('should run obtenerSubfabricantesDisponibles and set store.setPlantasBuscadas', () => {
    component.obtenerSubfabricantesDisponibles();
    expect(component._compartidaSvc.getSubfabricantesDisponibles).toHaveBeenCalled();
    expect(component._compartidaSvc.mapApiResponseToPlantasSubfabricante).toHaveBeenCalled();
    expect(component.store.setPlantasBuscadas).toHaveBeenCalled();
  });

  it('should run obtenerRegistroSeleccionado and set datosDelSubfabricanteSeleccionado', () => {
    component.obtenerRegistroSeleccionado([{ 
            calle : 'Calle Falsa',
            numExterior : 123,
            numInterior : 456,
            codigoPostal : 12345,
            colonia : 'Colonia Falsa',
            municipio : 'Municipio Falso',
            entidadFederativa : 'Entidad Falsa',
            pais : 'Pais Falso',
            rfc : 'RFC Falso',
            domicilioFiscal : 'Domicilio Fiscal Falso',
            razonSocial : 'Razon Social Falsa'
     }]);
    expect(component.datosDelSubfabricanteSeleccionado.length).toBe(1);
  });

  it('should not set datosDelSubfabricanteSeleccionado if event is empty', () => {
    component.datosDelSubfabricanteSeleccionado = [];
    component.obtenerRegistroSeleccionado([]);
    expect(component.datosDelSubfabricanteSeleccionado.length).toBe(0);
  });

  it('should run realizarBusqueda and call obtenerSubfabricantesDisponibles and store.setFormValida', () => {
    component.obtenerSubfabricantesDisponibles = jest.fn();
    component.realizarBusqueda();
    expect(component.obtenerSubfabricantesDisponibles).toHaveBeenCalled();
    expect(component.store.setFormValida).toHaveBeenCalledWith({ submanufacturas: true });
  });

  it('should not call obtenerSubfabricantesDisponibles if form fields are empty', () => {
    component.formularioDatosSubcontratista = {
      get: jest.fn().mockReturnValue({ value: '' })
    } as any;
    component.obtenerSubfabricantesDisponibles = jest.fn();
    component.realizarBusqueda();
    expect(component.obtenerSubfabricantesDisponibles).not.toHaveBeenCalled();
  });

  it('should run agregarPlantas and call store.setPlantasSubfabricantesAgregar', () => {
    component.agregarPlantas([{ 
            calle : 'Calle Falsa',
            numExterior : 123,
            numInterior : 456,
            codigoPostal : 12345,
            colonia : 'Colonia Falsa',
            municipio : 'Municipio Falso',
            entidadFederativa : 'Entidad Falsa',
            pais : 'Pais Falso',
            rfc : 'RFC Falso',
            domicilioFiscal : 'Domicilio Fiscal Falso',
            razonSocial : 'Razon Social Falsa'
     }]);
    expect(component.store.setPlantasSubfabricantesAgregar).toHaveBeenCalled();
  });

  it('should not call store.setPlantasSubfabricantesAgregar if plantasPorAgrupar is falsy', () => {
    component.agregarPlantas(undefined as any);
    expect(component.store.setPlantasSubfabricantesAgregar).not.toHaveBeenCalled();
  });

  it('should run datosDelSubfabricantePorEliminar and set listaDeSubfabricantesPorEliminar', () => {
    component.datosDelSubfabricantePorEliminar([{ 
            calle : 'Calle Falsa',
            numExterior : 123,
            numInterior : 456,
            codigoPostal : 12345,
            colonia : 'Colonia Falsa',
            municipio : 'Municipio Falso',
            entidadFederativa : 'Entidad Falsa',
            pais : 'Pais Falso',
            rfc : 'RFC Falso',
            domicilioFiscal : 'Domicilio Fiscal Falso',
            razonSocial : 'Razon Social Falsa'
     }]);
    expect(component.listaDeSubfabricantesPorEliminar.length).toBe(1);
  });

  it('should run eliminarPlantas and call store.eliminarPlantas', () => {
    component.eliminarPlantas([{ 
            calle : 'Calle Falsa',
            numExterior : 123,
            numInterior : 456,
            codigoPostal : 12345,
            colonia : 'Colonia Falsa',
            municipio : 'Municipio Falso',
            entidadFederativa : 'Entidad Falsa',
            pais : 'Pais Falso',
            rfc : 'RFC Falso',
            domicilioFiscal : 'Domicilio Fiscal Falso',
            razonSocial : 'Razon Social Falsa'
     }]);
    expect(component.store.eliminarPlantas).toHaveBeenCalled();
  });

  it('should not call store.eliminarPlantas if plantasPorEliminar is falsy', () => {
    component.eliminarPlantas(undefined as any);
    expect(component.store.eliminarPlantas).not.toHaveBeenCalled();
  });

  it('should run complementarPlantas and call store.setPlantasPorCompletar and setindicePrevioRuta', () => {
    component.tabIndex = 1;
    component.complementarPlantas([{ 
            calle : 'Calle Falsa',
            numExterior : 123,
            numInterior : 456,
            codigoPostal : 12345,
            colonia : 'Colonia Falsa',
            municipio : 'Municipio Falso',
            entidadFederativa : 'Entidad Falsa',
            pais : 'Pais Falso',
            rfc : 'RFC Falso',
            domicilioFiscal : 'Domicilio Fiscal Falso',
            razonSocial : 'Razon Social Falsa'
     }]);
    expect(component.store.setPlantasPorCompletar).toHaveBeenCalled();
    expect(component.store.setindicePrevioRuta).toHaveBeenCalledWith(1);
  });

  it('should run complementarPlantas and not call setindicePrevioRuta if tabIndex is falsy', () => {
    component.tabIndex = 0;
    component.complementarPlantas([{ 
            calle : 'Calle Falsa',
            numExterior : 123,
            numInterior : 456,
            codigoPostal : 12345,
            colonia : 'Colonia Falsa',
            municipio : 'Municipio Falso',
            entidadFederativa : 'Entidad Falsa',
            pais : 'Pais Falso',
            rfc : 'RFC Falso',
            domicilioFiscal : 'Domicilio Fiscal Falso',
            razonSocial : 'Razon Social Falsa'
     }]);
    expect(component.store.setPlantasPorCompletar).toHaveBeenCalled();
    expect(component.store.setindicePrevioRuta).not.toHaveBeenCalled();
  });

  it('should run ngOnDestroy and complete destroyNotifier$', () => {
    const nextSpy = jest.spyOn((component as any)['destroyNotifier$'], 'next');
    const completeSpy = jest.spyOn((component as any)['destroyNotifier$'], 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});