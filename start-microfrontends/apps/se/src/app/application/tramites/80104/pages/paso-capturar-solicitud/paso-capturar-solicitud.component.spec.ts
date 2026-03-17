describe('PasoCapturarSolicitudComponent', () => {
  let component: any;
  let nuevoProgramaIndustrialService: any;
  let tramite80104Store: any;
  let tramite80104Query: any;
  let toastrService: any;
  let servicioDeFormularioService: any;
  let consultaQuery: any;
  let wizardService: any;
  let wizardComponent: any;

  beforeEach(() => {
    nuevoProgramaIndustrialService = {
      getAllState: jest.fn().mockReturnValue({ pipe: jest.fn(() => ({ subscribe: jest.fn() })) }),
      buildComplimentos: jest.fn().mockReturnValue({}),
      buildDeclaracionSolicitudEntries: jest.fn().mockReturnValue([]),
      buildPlantasControladoras: jest.fn().mockReturnValue([]),
      buildPlantas: jest.fn().mockReturnValue([]),
      buildAnexo: jest.fn().mockReturnValue({ anexo: {} }),
      buildPlantasSubmanufactureras: jest.fn().mockReturnValue([]),
      buildDatosFederatarios: jest.fn().mockReturnValue([]),
      buildSociosAccionistas: jest.fn().mockReturnValue([]),
      guardarDatosPost: jest.fn().mockReturnValue({ subscribe: jest.fn((cb) => cb({ codigo: '00', mensaje: 'ok', datos: { id_solicitud: 1 } })) }),
    };
    tramite80104Store = { setIdSolicitud: jest.fn() };
    tramite80104Query = {
      selectSolicitud$: { pipe: jest.fn(() => ({ subscribe: jest.fn() })) }
    };
    toastrService = { success: jest.fn(), error: jest.fn() };
    servicioDeFormularioService = {
      isFormValid: jest.fn().mockReturnValue(true),
      isArrayFilled: jest.fn().mockReturnValue(true),
      markFormAsTouched: jest.fn()
    };
    consultaQuery = {
      selectConsultaioState$: { pipe: jest.fn(() => ({ subscribe: jest.fn() })) }
    };
    wizardService = { cambio_indice: jest.fn() };
    wizardComponent = { siguiente: jest.fn(), atras: jest.fn(), indiceActual: 1 };

    component = new (require('../../../../../../../../application/tramites/80104/pages/paso-capturar-solicitud/paso-capturar-solicitud.component').PasoCapturarSolicitudComponent)(
      nuevoProgramaIndustrialService,
      tramite80104Store,
      tramite80104Query,
      toastrService,
      servicioDeFormularioService,
      consultaQuery
    );
    component.wizardService = wizardService;
    component.wizardComponent = wizardComponent;
    component.pasos = [{}, {}, {}, {}];
    component.consultaState = { readonly: false, update: false };
    component.solicitudState = { idSolicitud: 1 };
    component.complimentosBase = {};
    component.basePlantasControladoras = [];
    component.plantasBase = [];
    component.plantasSubmanufacturerasBase = [];
    component.notariosBase = [];
    component.sociosAccionistas = [{}];
    component.indice = 1;
    component.datosPasos = { nroPasos: 4, indice: 1, txtBtnAnt: 'Anterior', txtBtnSig: 'Continuar' };
  });

  it('should initialize and destroy', () => {
    const nextSpy = jest.spyOn(component.destroyNotifier$, 'next');
    const completeSpy = jest.spyOn(component.destroyNotifier$, 'complete');
    component.ngOnInit();
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should verify form validity', () => {
    expect(component.verificarLaValidezDelFormulario()).toBe(true);
  });

  it('should check all arrays filled', () => {
    expect(component.isAllArraysFilledIn80101(['a', 'b'])).toBe(true);
  });

  it('should handle getValorIndice for cont', (done) => {
    component.shouldNavigate$ = jest.fn().mockReturnValue({
      subscribe: (cb: any) => { cb(true); done(); }
    });
    component.consultaState = { readonly: false, update: false };
    component.getValorIndice({ valor: 1, accion: 'cont' });
    expect(component.indice).toBe(2);
    expect(component.datosPasos.indice).toBe(2);
    expect(wizardService.cambio_indice).toHaveBeenCalledWith(2);
    expect(wizardComponent.siguiente).toHaveBeenCalled();
  });

  it('should handle getValorIndice for ant', () => {
    component.getValorIndice({ valor: 2, accion: 'ant' });
    expect(component.indice).toBe(1);
    expect(component.datosPasos.indice).toBe(1);
    expect(wizardComponent.atras).toHaveBeenCalled();
  });

  it('should handle getValorIndice for invalid', () => {
    component.getValorIndice({ valor: 0, accion: 'cont' });
    expect(component.indice).toBe(1);
  });

  it('should handle shouldNavigate$ with OK', (done) => {
    nuevoProgramaIndustrialService.getAllState = jest.fn().mockReturnValue({
      pipe: jest.fn(() => ({
        subscribe: jest.fn()
      }))
    });
    component.guardar = jest.fn().mockResolvedValue({ codigo: '00', mensaje: 'ok' });
    component.shouldNavigate$().subscribe((result: boolean) => {
      expect(result).toBe(true);
      expect(toastrService.success).toHaveBeenCalled();
      done();
    });
  });

  it('should handle shouldNavigate$ with error', (done) => {
    component.guardar = jest.fn().mockResolvedValue({ codigo: '01', mensaje: 'error' });
    component.shouldNavigate$().subscribe((result: boolean) => {
      expect(result).toBe(false);
      expect(toastrService.error).toHaveBeenCalled();
      done();
    });
  });

  it('should handle manejaEventoCargaDocumentos', () => {
    component.manejaEventoCargaDocumentos(true);
    expect(component.activarBotonCargaArchivos).toBe(true);
  });

  it('should handle obtenerDatosDelStore', () => {
    nuevoProgramaIndustrialService.getAllState = jest.fn().mockReturnValue({
      pipe: jest.fn(() => ({
        subscribe: jest.fn((cb: any) => cb({}))
      }))
    });
    component.guardar = jest.fn();
    component.obtenerDatosDelStore();
    expect(component.guardar).toHaveBeenCalled();
  });

  it('should handle guardar', async () => {
    const response = await component.guardar({ idSolicitud: 1 });
    expect(response.codigo).toBe('00');
    expect(tramite80104Store.setIdSolicitud).toHaveBeenCalledWith(1);
  });

  it('should handle guardar with invalid id', async () => {
    nuevoProgramaIndustrialService.guardarDatosPost = jest.fn().mockReturnValue({
      subscribe: (cb: any) => cb({ codigo: '00', mensaje: 'ok', datos: { id_solicitud: null } })
    });
    const response = await component.guardar({ idSolicitud: 0 });
    expect(tramite80104Store.setIdSolicitud).toHaveBeenCalledWith(0);
  });

  it('should handle cargaRealizada', () => {
    component.cargaRealizada(true);
    expect(component.seccionCargarDocumentos).toBe(false);
    component.cargaRealizada(false);
    expect(component.seccionCargarDocumentos).toBe(true);
  });

  it('should handle siguiente', () => {
    wizardComponent.indiceActual = 1;
    component.siguiente();
    expect(wizardComponent.siguiente).toHaveBeenCalled();
    expect(component.indice).toBe(2);
    expect(component.datosPasos.indice).toBe(2);
  });

  it('should handle anterior', () => {
    wizardComponent.indiceActual = 1;
    component.anterior();
    expect(wizardComponent.atras).toHaveBeenCalled();
    expect(component.indice).toBe(2);
    expect(component.datosPasos.indice).toBe(2);
  });

  it('should emit cargarArchivosEvento', () => {
    const emitSpy = jest.spyOn(component.cargarArchivosEvento, 'emit');
    component.onClickCargaArchivos();
    expect(emitSpy).toHaveBeenCalled();
  });

  it('should handle onCargaEnProgreso', () => {
    component.onCargaEnProgreso(false);
    expect(component.cargaEnProgreso).toBe(false);
    component.onCargaEnProgreso(true);
    expect(component.cargaEnProgreso).toBe(true);
  });
});