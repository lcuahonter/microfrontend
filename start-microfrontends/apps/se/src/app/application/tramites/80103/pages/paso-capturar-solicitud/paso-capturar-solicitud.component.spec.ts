describe('PasoCapturarSolicitudComponent', () => {
  let component: PasoCapturarSolicitudComponent;
  let mockWizardComponent: any;
  let mockWizardService: any;
  let mockTramiteQuery: any;
  let mockSeccion: any;
  let mockNuevoProgramaIndustrialService: any;
  let mockTramite80105Store: any;
  let mockTramite80105Query: any;
  let mockToastrService: any;
  let mockConsultaQuery: any;
  let mockServicioDeFormularioService: any;

  beforeEach(() => {
    mockWizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn(),
      indiceActual: 1
    };
    mockWizardService = { cambio_indice: jest.fn() };
    mockTramiteQuery = {};
    mockSeccion = {};
    mockNuevoProgramaIndustrialService = {
      getAllState: jest.fn().mockReturnValue({
        pipe: jest.fn().mockReturnThis(),
        subscribe: jest.fn()
      }),
      buildComplimentos: jest.fn().mockReturnValue({}),
      buildDeclaracionSolicitudEntries: jest.fn().mockReturnValue([]),
      buildPlantasControladoras: jest.fn().mockReturnValue([]),
      buildPlantas: jest.fn().mockReturnValue([]),
      buildAnexo: jest.fn().mockReturnValue({ anexo: {} }),
      buildPlantasSubmanufactureras: jest.fn().mockReturnValue([]),
      buildDatosFederatarios: jest.fn().mockReturnValue([]),
      buildSociosAccionistas: jest.fn().mockReturnValue([]),
      guardarDatosPost: jest.fn().mockReturnValue({
        subscribe: (cb: any, err: any) => cb({ codigo: '00', mensaje: 'OK', datos: { id_solicitud: 1 } })
      })
    };
    mockTramite80105Store = { setIdSolicitud: jest.fn() };
    mockTramite80105Query = {
      selectSeccionState$: { pipe: jest.fn().mockReturnThis(), subscribe: jest.fn() }
    };
    mockToastrService = { success: jest.fn(), error: jest.fn() };
    mockConsultaQuery = {
      selectConsultaioState$: { pipe: jest.fn().mockReturnThis(), subscribe: jest.fn() }
    };
    mockServicioDeFormularioService = {
      isFormValid: jest.fn().mockReturnValue(true),
      isArrayFilled: jest.fn().mockReturnValue(true),
      markFormAsTouched: jest.fn()
    };

    component = new PasoCapturarSolicitudComponent(
      mockTramite80105Query,
      mockSeccion,
      mockNuevoProgramaIndustrialService,
      mockTramite80105Store,
      mockTramite80105Query,
      mockToastrService,
      mockConsultaQuery,
      mockServicioDeFormularioService
    );
    component.wizardComponent = mockWizardComponent;
    component.wizardService = mockWizardService;
    component.consultaState = { readonly: false, update: false };
    component.solicitudState = { idSolicitud: 1 };
  });

  it('should initialize properties correctly', () => {
    expect(component.padreBtn).toBe(true);
    expect(component.indice).toBe(1);
    expect(component.datosPasos.nroPasos).toBe(component.pasos.length);
    expect(component.cargaEnProgreso).toBe(true);
    expect(component.infoAlert).toBe('alert-info');
    expect(component.activarBotonCargaArchivos).toBe(false);
    expect(component.seccionCargarDocumentos).toBe(true);
    expect(component.btnGuardar).toBe(true);
    expect(component.btnGuardarVisible).toBe('visible');
    expect(component.idSolicitud).toBe(0);
    expect(component.formErrorAlert).toBe(ERROR_FORMA_ALERT);
  });

  it('should call ngOnInit and subscribe to observables', () => {
    const consultaState = { readonly: false, update: false };
    const solicitudState = { idSolicitud: 1 };
    mockConsultaQuery.selectConsultaioState$.pipe = jest.fn().mockReturnValue({
      subscribe: (cb: any) => cb(consultaState)
    });
    mockTramite80105Query.selectSeccionState$.pipe = jest.fn().mockReturnValue({
      subscribe: (cb: any) => cb(solicitudState)
    });
    component.ngOnInit();
    expect(component.consultaState).toEqual(consultaState);
    expect(component.solicitudState).toEqual(solicitudState);
  });

  it('should verify form validity', () => {
    mockServicioDeFormularioService.isFormValid = jest.fn().mockReturnValue(true);
    mockServicioDeFormularioService.isArrayFilled = jest.fn().mockReturnValue(true);
    expect(component.verificarLaValidezDelFormulario()).toBe(true);
  });

  it('should check all arrays filled', () => {
    mockServicioDeFormularioService.isArrayFilled = jest.fn().mockReturnValue(true);
    expect(component.isAllArraysFilledIn80101(['a', 'b'])).toBe(true);
    mockServicioDeFormularioService.isArrayFilled = jest.fn().mockReturnValue(false);
    expect(component.isAllArraysFilledIn80101(['a', 'b'])).toBe(false);
  });

  it('should handle getValorIndice for "cont" action with valid form', () => {
    component.consultaState = { readonly: false, update: false };
    component.verificarLaValidezDelFormulario = jest.fn().mockReturnValue(true);
    component.shouldNavigate$ = jest.fn().mockReturnValue({
      subscribe: (cb: any) => cb(true)
    });
    component.getValorIndice({ valor: 1, accion: 'cont' });
    expect(component.indice).toBe(2);
    expect(component.datosPasos.indice).toBe(2);
    expect(mockWizardService.cambio_indice).toHaveBeenCalledWith(2);
    expect(mockWizardComponent.siguiente).toHaveBeenCalled();
  });

  it('should handle getValorIndice for "cont" action with invalid form', () => {
    component.consultaState = { readonly: false, update: false };
    component.verificarLaValidezDelFormulario = jest.fn().mockReturnValue(false);
    component.getValorIndice({ valor: 1, accion: 'cont' });
    expect(component.indice).toBe(1);
    expect(component.datosPasos.indice).toBe(1);
    expect(mockServicioDeFormularioService.markFormAsTouched).toHaveBeenCalledWith('datosGeneralisForm');
  });

  it('should handle getValorIndice for "ant" action', () => {
    component.getValorIndice({ valor: 2, accion: 'ant' });
    expect(component.indice).toBe(1);
    expect(component.datosPasos.indice).toBe(1);
    expect(mockWizardComponent.atras).toHaveBeenCalled();
  });

  it('should handle getValorIndice for readonly', () => {
    component.consultaState = { readonly: true, update: false };
    component.shouldNavigate$ = jest.fn().mockReturnValue({
      subscribe: (cb: any) => cb(true)
    });
    component.getValorIndice({ valor: 1, accion: 'cont' });
    expect(component.indice).toBe(2);
    expect(component.datosPasos.indice).toBe(2);
  });

  it('should handle shouldNavigate$ with success', async () => {
    mockNuevoProgramaIndustrialService.getAllState = jest.fn().mockReturnValue({
      pipe: jest.fn().mockReturnThis(),
      subscribe: jest.fn()
    });
    mockNuevoProgramaIndustrialService.guardarDatosPost = jest.fn().mockReturnValue({
      subscribe: (cb: any) => cb({ codigo: '00', mensaje: 'OK', datos: { id_solicitud: 1 } })
    });
    const obs = component.shouldNavigate$();
    expect(obs).toBeDefined();
  });

  it('should handle obtenerDatosDelStore', () => {
    mockNuevoProgramaIndustrialService.getAllState = jest.fn().mockReturnValue({
      pipe: jest.fn().mockReturnThis(),
      subscribe: (cb: any) => cb({})
    });
    component.guardar = jest.fn().mockResolvedValue({ codigo: '00', mensaje: 'OK' });
    component.obtenerDatosDelStore();
    expect(mockNuevoProgramaIndustrialService.getAllState).toHaveBeenCalled();
  });

  it('should handle guardar with valid response', async () => {
    const data = { empresasSeleccionadas: [], plantasImmexTablaLista: [], empressaSubFabricantePlantas: { plantasSubfabricantesAgregar: [] }, tablaDatosFederatarios: [], tablaDatosComplimentos: [], tablaDatosComplimentosExtranjera: [] };
    mockNuevoProgramaIndustrialService.guardarDatosPost = jest.fn().mockReturnValue({
      subscribe: (cb: any) => cb({ codigo: '00', mensaje: 'OK', datos: { id_solicitud: 1 } })
    });
    const result = await component.guardar(data as any);
    expect(result.codigo).toBe('00');
    expect(mockTramite80105Store.setIdSolicitud).toHaveBeenCalledWith(1);
  });

  it('should handle guardar with invalid response', async () => {
    mockNuevoProgramaIndustrialService.guardarDatosPost = jest.fn().mockReturnValue({
      subscribe: (cb: any) => cb({ codigo: '01', mensaje: 'Error', datos: {} })
    });
    const data = { empresasSeleccionadas: [], plantasImmexTablaLista: [], empressaSubFabricantePlantas: { plantasSubfabricantesAgregar: [] }, tablaDatosFederatarios: [], tablaDatosComplimentos: [], tablaDatosComplimentosExtranjera: [] };
    const result = await component.guardar(data as any);
    expect(result.codigo).toBe('01');
    expect(mockTramite80105Store.setIdSolicitud).toHaveBeenCalledWith(0);
  });

  it('should call siguiente and update indices', () => {
    component.siguiente();
    expect(mockWizardComponent.siguiente).toHaveBeenCalled();
    expect(component.indice).toBe(2);
    expect(component.datosPasos.indice).toBe(2);
  });

  it('should call anterior and update indices', () => {
    component.anterior();
    expect(mockWizardComponent.atras).toHaveBeenCalled();
    expect(component.indice).toBe(2);
    expect(component.datosPasos.indice).toBe(2);
  });

  it('should handle manejaEventoCargaDocumentos', () => {
    component.manejaEventoCargaDocumentos(true);
    expect(component.activarBotonCargaArchivos).toBe(true);
    component.manejaEventoCargaDocumentos(false);
    expect(component.activarBotonCargaArchivos).toBe(false);
  });

  it('should handle cargaRealizada', () => {
    component.cargaRealizada(true);
    expect(component.seccionCargarDocumentos).toBe(false);
    component.cargaRealizada(false);
    expect(component.seccionCargarDocumentos).toBe(true);
  });

  it('should emit cargarArchivosEvento', () => {
    const spy = jest.spyOn(component.cargarArchivosEvento, 'emit');
    component.onClickCargaArchivos();
    expect(spy).toHaveBeenCalled();
  });

  it('should call ngOnDestroy', () => {
    const spy = jest.spyOn(component.destroyNotifier$, 'next');
    const spy2 = jest.spyOn(component.destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  it('should update cargaEnProgreso', () => {
    component.onCargaEnProgreso(false);
    expect(component.cargaEnProgreso).toBe(false);
    component.onCargaEnProgreso(true);
    expect(component.cargaEnProgreso).toBe(true);
  });
});
describe('PasoCapturarSolicitudComponent Constructor', () => {
  let mockTramiteQuery: any;
  let mockSeccion: any;
  let mockNuevoProgramaIndustrialService: any;
  let mockTramite80105Store: any;
  let mockTramite80105Query: any;
  let mockToastrService: any;
  let mockConsultaQuery: any;
  let mockServicioDeFormularioService: any;

  beforeEach(() => {
    mockTramiteQuery = {};
    mockSeccion = {};
    mockNuevoProgramaIndustrialService = {};
    mockTramite80105Store = {};
    mockTramite80105Query = {};
    mockToastrService = {};
    mockConsultaQuery = {};
    mockServicioDeFormularioService = {};
  });

  it('should create an instance and initialize injected services', () => {
    const component = new PasoCapturarSolicitudComponent(
      mockTramiteQuery,
      mockSeccion,
      mockNuevoProgramaIndustrialService,
      mockTramite80105Store,
      mockTramite80105Query,
      mockToastrService,
      mockConsultaQuery,
      mockServicioDeFormularioService
    );
    expect(component).toBeInstanceOf(PasoCapturarSolicitudComponent);
    expect(component['tramiteQuery']).toBe(mockTramiteQuery);
    expect(component['seccion']).toBe(mockSeccion);
    expect(component['nuevoProgramaIndustrialService']).toBe(mockNuevoProgramaIndustrialService);
    expect(component['tramite80105Store']).toBe(mockTramite80105Store);
    expect(component['tramite80105Query']).toBe(mockTramite80105Query);
    expect(component['toastrService']).toBe(mockToastrService);
    expect(component['consultaQuery']).toBe(mockConsultaQuery);
    expect(component['servicioDeFormularioService']).toBe(mockServicioDeFormularioService);
  });
});
describe('PasoCapturarSolicitudComponent ngOnInit', () => {
  let component: PasoCapturarSolicitudComponent;
  let mockConsultaQuery: any;
  let mockTramite80105Query: any;

  beforeEach(() => {
    mockConsultaQuery = {
      selectConsultaioState$: {
        pipe: jest.fn().mockReturnThis(),
        subscribe: jest.fn()
      }
    };
    mockTramite80105Query = {
      selectSeccionState$: {
        pipe: jest.fn().mockReturnThis(),
        subscribe: jest.fn()
      }
    };

    component = new PasoCapturarSolicitudComponent(
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      mockTramite80105Query,
      {} as any,
      mockConsultaQuery,
      {} as any
    );
  });

  it('should subscribe to consultaQuery and tramite80105Query observables and update states', () => {
    const consultaState = { readonly: false, update: false };
    const solicitudState = { idSolicitud: 123 };

    // Mock pipe and subscribe for consultaQuery
    mockConsultaQuery.selectConsultaioState$.pipe = jest.fn().mockReturnValue({
      subscribe: (cb: any) => cb(consultaState)
    });
    // Mock pipe and subscribe for tramite80105Query
    mockTramite80105Query.selectSeccionState$.pipe = jest.fn().mockReturnValue({
      subscribe: (cb: any) => cb(solicitudState)
    });

    component.ngOnInit();

    expect(component.consultaState).toEqual(consultaState);
    expect(component.solicitudState).toEqual(solicitudState);
    expect(mockConsultaQuery.selectConsultaioState$.pipe).toHaveBeenCalled();
    expect(mockTramite80105Query.selectSeccionState$.pipe).toHaveBeenCalled();
  });
});
describe('PasoCapturarSolicitudComponent Additional Coverage', () => {
  let component: PasoCapturarSolicitudComponent;
  let mockWizardComponent: any;
  let mockWizardService: any;
  let mockTramiteQuery: any;
  let mockSeccion: any;
  let mockNuevoProgramaIndustrialService: any;
  let mockTramite80105Store: any;
  let mockTramite80105Query: any;
  let mockToastrService: any;
  let mockConsultaQuery: any;
  let mockServicioDeFormularioService: any;

  beforeEach(() => {
    mockWizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn(),
      indiceActual: 1
    };
    mockWizardService = { cambio_indice: jest.fn() };
    mockTramiteQuery = {};
    mockSeccion = {};
    mockNuevoProgramaIndustrialService = {
      getAllState: jest.fn().mockReturnValue({
        pipe: jest.fn().mockReturnThis(),
        subscribe: jest.fn()
      }),
      buildComplimentos: jest.fn().mockReturnValue({}),
      buildDeclaracionSolicitudEntries: jest.fn().mockReturnValue([]),
      buildPlantasControladoras: jest.fn().mockReturnValue([]),
      buildPlantas: jest.fn().mockReturnValue([]),
      buildAnexo: jest.fn().mockReturnValue({ anexo: {} }),
      buildPlantasSubmanufactureras: jest.fn().mockReturnValue([]),
      buildDatosFederatarios: jest.fn().mockReturnValue([]),
      buildSociosAccionistas: jest.fn().mockReturnValue([]),
      guardarDatosPost: jest.fn().mockReturnValue({
        subscribe: (cb: any, err: any) => cb({ codigo: '00', mensaje: 'OK', datos: { id_solicitud: 1 } })
      })
    };
    mockTramite80105Store = { setIdSolicitud: jest.fn() };
    mockTramite80105Query = {
      selectSeccionState$: { pipe: jest.fn().mockReturnThis(), subscribe: jest.fn() }
    };
    mockToastrService = { success: jest.fn(), error: jest.fn() };
    mockConsultaQuery = {
      selectConsultaioState$: { pipe: jest.fn().mockReturnThis(), subscribe: jest.fn() }
    };
    mockServicioDeFormularioService = {
      isFormValid: jest.fn().mockReturnValue(true),
      isArrayFilled: jest.fn().mockReturnValue(true),
      markFormAsTouched: jest.fn()
    };

    component = new PasoCapturarSolicitudComponent(
      mockTramite80105Query,
      mockSeccion,
      mockNuevoProgramaIndustrialService,
      mockTramite80105Store,
      mockTramite80105Query,
      mockToastrService,
      mockConsultaQuery,
      mockServicioDeFormularioService
    );
    component.wizardComponent = mockWizardComponent;
    component.wizardService = mockWizardService;
    component.consultaState = { readonly: false, update: false };
    component.solicitudState = { idSolicitud: 1 };
  });

  it('verificarLaValidezDelFormulario returns false if any form is invalid', () => {
    mockServicioDeFormularioService.isFormValid = jest.fn().mockReturnValueOnce(false);
    expect(component.verificarLaValidezDelFormulario()).toBe(false);
  });

  it('verificarLaValidezDelFormulario returns false if arrays not filled', () => {
    mockServicioDeFormularioService.isFormValid = jest.fn().mockReturnValue(true);
    mockServicioDeFormularioService.isArrayFilled = jest.fn().mockReturnValueOnce(false);
    expect(component.verificarLaValidezDelFormulario()).toBe(false);
  });

  it('isAllArraysFilledIn80101 returns false if any array is not filled', () => {
    mockServicioDeFormularioService.isArrayFilled = jest.fn().mockImplementation((item: string) => item === 'filled');
    expect(component.isAllArraysFilledIn80101(['filled', 'notFilled'])).toBe(false);
  });

  it('getValorIndice does nothing if valor is out of bounds', () => {
    const spy = jest.spyOn(component, 'shouldNavigate$');
    component.getValorIndice({ valor: 0, accion: 'cont' });
    expect(spy).not.toHaveBeenCalled();
    component.getValorIndice({ valor: 100, accion: 'cont' });
    expect(spy).not.toHaveBeenCalled();
  });

  it('getValorIndice for cont action with update true skips validation', () => {
    component.consultaState = { readonly: false, update: true };
    const shouldNavigateSpy = jest.fn().mockReturnValue({
      subscribe: (cb: any) => cb(true)
    });
    component.shouldNavigate$ = shouldNavigateSpy;
    component.getValorIndice({ valor: 1, accion: 'cont' });
    expect(shouldNavigateSpy).toHaveBeenCalled();
  });

  it('getValorIndice for unknown accion keeps index unchanged', () => {
    component.getValorIndice({ valor: 1, accion: 'other' as any });
    expect(component.indice).toBe(0);
    expect(component.datosPasos.indice).toBe(0);
    expect(mockWizardComponent.atras).toHaveBeenCalled();
  });

  it('shouldNavigate$ returns false and calls toastrService.error on error response', async () => {
    mockNuevoProgramaIndustrialService.getAllState = jest.fn().mockReturnValue({
      pipe: jest.fn().mockReturnThis(),
      subscribe: jest.fn()
    });
    mockNuevoProgramaIndustrialService.guardarDatosPost = jest.fn().mockReturnValue({
      subscribe: (cb: any) => cb({ codigo: '01', mensaje: 'Error', datos: {} })
    });
    const obs = component.shouldNavigate$();
    let result: boolean | undefined;
    obs.subscribe(val => result = val);
    expect(result).toBe(false);
    expect(mockToastrService.error).toHaveBeenCalled();
  });

  it('obtenerDatosDelStore calls guardar with data', () => {
    const data = { test: 'data' };
    mockNuevoProgramaIndustrialService.getAllState = jest.fn().mockReturnValue({
      pipe: jest.fn().mockReturnThis(),
      subscribe: (cb: any) => cb(data)
    });
    component.guardar = jest.fn().mockResolvedValue({ codigo: '00', mensaje: 'OK' });
    component.obtenerDatosDelStore();
    expect(component.guardar).toHaveBeenCalledWith(data);
  });

  it('guardar sets idSolicitud to 0 if datos.id_solicitud is falsy', async () => {
    mockNuevoProgramaIndustrialService.guardarDatosPost = jest.fn().mockReturnValue({
      subscribe: (cb: any) => cb({ codigo: '00', mensaje: 'OK', datos: { id_solicitud: null } })
    });
    const data = { empresasSeleccionadas: [], plantasImmexTablaLista: [], empressaSubFabricantePlantas: { plantasSubfabricantesAgregar: [] }, tablaDatosFederatarios: [], tablaDatosComplimentos: [], tablaDatosComplimentosExtranjera: [] };
    await component.guardar(data as any);
    expect(mockTramite80105Store.setIdSolicitud).toHaveBeenCalledWith(0);
  });

  it('guardar rejects on error', async () => {
    mockNuevoProgramaIndustrialService.guardarDatosPost = jest.fn().mockReturnValue({
      subscribe: (_cb: any, err: any) => err('error')
    });
    const data = { empresasSeleccionadas: [], plantasImmexTablaLista: [], empressaSubFabricantePlantas: { plantasSubfabricantesAgregar: [] }, tablaDatosFederatarios: [], tablaDatosComplimentos: [], tablaDatosComplimentosExtranjera: [] };
    await expect(component.guardar(data as any)).rejects.toBe('error');
  });

  it('siguiente updates indices correctly', () => {
    component.wizardComponent.indiceActual = 2;
    component.siguiente();
    expect(component.indice).toBe(3);
    expect(component.datosPasos.indice).toBe(3);
  });

  it('anterior updates indices correctly', () => {
    component.wizardComponent.indiceActual = 2;
    component.anterior();
    expect(component.indice).toBe(3);
    expect(component.datosPasos.indice).toBe(3);
  });

  it('manejaEventoCargaDocumentos sets activarBotonCargaArchivos', () => {
    component.manejaEventoCargaDocumentos(true);
    expect(component.activarBotonCargaArchivos).toBe(true);
    component.manejaEventoCargaDocumentos(false);
    expect(component.activarBotonCargaArchivos).toBe(false);
  });

  it('cargaRealizada sets seccionCargarDocumentos', () => {
    component.cargaRealizada(true);
    expect(component.seccionCargarDocumentos).toBe(false);
    component.cargaRealizada(false);
    expect(component.seccionCargarDocumentos).toBe(true);
  });

  it('onClickCargaArchivos emits cargarArchivosEvento', () => {
    const spy = jest.spyOn(component.cargarArchivosEvento, 'emit');
    component.onClickCargaArchivos();
    expect(spy).toHaveBeenCalled();
  });

  it('ngOnDestroy calls destroyNotifier$', () => {
    const spy = jest.spyOn(component.destroyNotifier$, 'next');
    const spy2 = jest.spyOn(component.destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  it('onCargaEnProgreso sets cargaEnProgreso', () => {
    component.onCargaEnProgreso(false);
    expect(component.cargaEnProgreso).toBe(false);
    component.onCargaEnProgreso(true);
    expect(component.cargaEnProgreso).toBe(true);
  });
});