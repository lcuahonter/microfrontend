import { WizardComponent } from "@libs/shared/data-access-user/src";
import { SolicitudPageComponent } from "./solicitud-page.component";



describe('SolicitudPageComponent', () => {
  let component: SolicitudPageComponent;
  let mockSeccionLibStore: any;
  let mockAutorizacionProgrmaNuevoService: any;
  let mockTramite80102Store: any;
  let mockTramite80102Query: any;
  let mockToastrService: any;
  let mockConsultaQuery: any;
  let mockServicioDeFormularioService: any;
  let mockWizardService: any;
  let mockWizardComponent: any;
  let formErrorAlert: any;
  let padreBtn: any;
  let cargarArchivosEvento: any;
  let idTipoTRamite: any;
  let datosUsuario: any;
  let activarBotonCargaArchivos: any;
  let seccionCargarDocumentos: any;
  let tituloMensaje: any;
  let indice: any;
  let datosPasos: any;
  let consultaState: any;
  let solicitudState: any;
  let empresasNacionales: any;
  let empresasExtranjera: any;
  let plantasImmexTablaLista: any;
  let empressaSubFabricantePlantas: any;

  beforeEach(() => {
    mockSeccionLibStore = {};
    mockAutorizacionProgrmaNuevoService = {
      getAllState: jest.fn().mockReturnValue({
        pipe: jest.fn().mockReturnThis(),
        subscribe: jest.fn(),
      }),
      buildComplimentos: jest.fn().mockReturnValue({}),
      buildDeclaracionSolicitudEntries: jest.fn().mockReturnValue([]),
      buildPlantas: jest.fn().mockReturnValue([]),
      buildAnexo: jest.fn().mockReturnValue({ anexo: {} }),
      buildPlantasSubmanufactureras: jest.fn().mockReturnValue([]),
      buildDatosFederatarios: jest.fn().mockReturnValue([]),
      buildSociosAccionistas: jest.fn().mockReturnValue([]),
      buildEmpresaNacionales: jest.fn().mockReturnValue([]),
      buildEmpresaExtranjera: jest.fn().mockReturnValue([]),
      guardarDatosPost: jest.fn().mockReturnValue({
        subscribe: (cb: any, err: any) => cb({ datos: { id_solicitud: 1 }, codigo: '00', mensaje: 'ok' }),
      }),
    };
    mockTramite80102Store = { setIdSolicitud: jest.fn() };
    mockTramite80102Query = { selectSeccionState$: { pipe: jest.fn().mockReturnThis(), subscribe: jest.fn() } };
    mockToastrService = { success: jest.fn(), error: jest.fn() };
    mockConsultaQuery = { selectConsultaioState$: { pipe: jest.fn().mockReturnThis(), subscribe: jest.fn() } };
    mockServicioDeFormularioService = {
      isFormValid: jest.fn().mockReturnValue(true),
      isArrayFilled: jest.fn().mockReturnValue(true),
      markFormAsTouched: jest.fn(),
    };
    mockWizardService = { cambio_indice: jest.fn() };
    mockWizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn(),
      indiceActual: 0,
    };
    

    component = new SolicitudPageComponent(
      mockSeccionLibStore,
      mockAutorizacionProgrmaNuevoService,
      mockTramite80102Store,
      mockTramite80102Query,
      mockToastrService,
      mockConsultaQuery,
      mockServicioDeFormularioService
    );
    component.wizardService = mockWizardService;
    component.wizardComponent = mockWizardComponent as WizardComponent;
    component.consultaState = { 
        procedureId: '',
        parameter: '',
        department: '',
        folioTramite: '',
        tipoDeTramite: '',
        estadoDeTramite: '',
        readonly: false,
        create: false,
        update: false,
        consultaioSolicitante: null,
        action_id: '',
        current_user: '',
        id_solicitud: '',
        nombre_pagina: '',
        idSolicitudSeleccionada: ''
     };
    component.solicitudState = { idSolicitud: 1 } as any;
    component.pasos = [
      { titulo: 'Paso 1' },
      { titulo: 'Paso 2' },
      { titulo: 'Paso 3' },
      { titulo: 'Paso 4' },
    ] as any;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize and destroy', () => {
    const nextSpy = jest.spyOn(component.destroyNotifier$, 'next');
    const completeSpy = jest.spyOn(component.destroyNotifier$, 'complete');
    component.ngOnInit();
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should select tab', () => {
    component.seleccionaTab(2);
    expect(component.indice).toBe(2);
  });

  it('should verify form validity', () => {
    expect(component.verificarLaValidezDelFormulario()).toBe(true);
  });

  it('should check all arrays filled', () => {
    expect(component.isAllArraysFilledIn80102(['a', 'b'])).toBe(true);
  });

  it('should handle getValorIndice for cont action with valid form', (done) => {
    //component.consultaState = { readonly: false, update: false };
    jest.spyOn(component, 'verificarLaValidezDelFormulario').mockReturnValue(true);
    jest.spyOn(component, 'shouldNavigate$').mockReturnValue({
      subscribe: (cb: any) => {
        cb(true);
        expect(component.indice).toBe(2);
        expect(component.datosPasos.indice).toBe(2);
        expect(mockWizardService.cambio_indice).toHaveBeenCalledWith(2);
        expect(mockWizardComponent.siguiente).toHaveBeenCalled();
        done();
      },
    } as any);
    component.getValorIndice({ accion: 'cont', valor: 1 });
  });

  it('should handle getValorIndice for cont action with invalid form', () => {
    //component.consultaState = { readonly: false, update: false };
    jest.spyOn(component, 'verificarLaValidezDelFormulario').mockReturnValue(false);
    component.getValorIndice({ accion: 'cont', valor: 1 });
    expect(component.indice).toBe(1);
    expect(component.datosPasos.indice).toBe(1);
    expect(mockServicioDeFormularioService.markFormAsTouched).toHaveBeenCalledWith('datosGeneralisForm');
  });

  it('should handle getValorIndice for ant action', () => {
    component.getValorIndice({ accion: 'ant', valor: 2 });
    expect(component.indice).toBe(1);
    expect(component.datosPasos.indice).toBe(1);
    expect(mockWizardComponent.atras).toHaveBeenCalled();
  });

  it('should handle getValorIndice for cont action when readonly', (done) => {
    component.consultaState = {
      procedureId: 0,
      parameter: '',
      department: '',
      folioTramite: '',
      // Add other required properties with default/mock values
      readonly: true,
      update: false,
      // Example additional properties, replace with actual ones as needed
      property1: '',
      property2: '',
      property3: '',
      property4: '',
      property5: '',
      property6: '',
      property7: '',
      property8: '',
      property9: '',
      property10: ''
    } as any;
    jest.spyOn(component, 'shouldNavigate$').mockReturnValue({
      subscribe: (cb: any) => {
        cb(true);
        expect(component.indice).toBe(2);
        expect(component.datosPasos.indice).toBe(2);
        expect(mockWizardService.cambio_indice).toHaveBeenCalledWith(2);
        expect(mockWizardComponent.siguiente).toHaveBeenCalled();
        done();
      },
    } as any);
    component.getValorIndice({ accion: 'cont', valor: 1 });
  });

  it('should handle shouldNavigate$ with success', (done) => {
    jest.spyOn(component, 'guardar').mockReturnValue(Promise.resolve({ codigo: '00', mensaje: 'ok' }) as any);
    jest.spyOn(mockAutorizacionProgrmaNuevoService, 'getAllState').mockReturnValue({
      pipe: jest.fn().mockReturnThis(),
      subscribe: jest.fn(),
    });
    const obs = component.shouldNavigate$();
    expect(obs).toBeTruthy();
    done();
  });

  it('should get title for each page', () => {
    component.obtenerNombreDelTítulo(1);
    expect(component.tituloMensaje).toBeDefined();
    component.obtenerNombreDelTítulo(2);
    expect(component.tituloMensaje).toBe('Paso 2');
    component.obtenerNombreDelTítulo(3);
    expect(component.tituloMensaje).toBe('Paso 3');
    component.obtenerNombreDelTítulo(4);
    expect(component.tituloMensaje).toBe('Paso 4');
    component.obtenerNombreDelTítulo(99);
    expect(component.tituloMensaje).toBeDefined();
  });

  it('should call obtenerDatosDelStore', () => {
    jest.spyOn(component, 'guardar').mockReturnValue(Promise.resolve({}) as any);
    component.obtenerDatosDelStore();
    expect(mockAutorizacionProgrmaNuevoService.getAllState).toHaveBeenCalled();
  });

  it('should call guardar and set idSolicitud', async () => {
    const response = { datos: { id_solicitud: 123 }, codigo: '00', mensaje: 'ok' };
    mockAutorizacionProgrmaNuevoService.guardarDatosPost.mockReturnValue({
      subscribe: (cb: any) => cb(response),
    });
    const result = await component.guardar({ plantasImmexTablaLista: [], empressaSubFabricantePlantas: {}, tablaDatosFederatarios: [], tablaDatosComplimentos: [], tablaDatosComplimentosExtranjera: [], datos: {}, datosEmpresaExtranjera: {} } as any);
    expect(result).toEqual(response);
    expect(mockTramite80102Store.setIdSolicitud).toHaveBeenCalledWith(123);
  });

  it('should handle guardar with error', async () => {
    mockAutorizacionProgrmaNuevoService.guardarDatosPost.mockReturnValue({
      subscribe: (cb: any, err: any) => err('error'),
    });
    await expect(component.guardar({ plantasImmexTablaLista: [], empressaSubFabricantePlantas: {}, tablaDatosFederatarios: [], tablaDatosComplimentos: [], tablaDatosComplimentosExtranjera: [], datos: {}, datosEmpresaExtranjera: {} } as any)).rejects.toBe('error');
  });

  it('should emit cargarArchivosEvento', () => {
    const emitSpy = jest.spyOn(component.cargarArchivosEvento, 'emit');
    component.onClickCargaArchivos();
    expect(emitSpy).toHaveBeenCalled();
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

  it('should navigate anterior', () => {
    mockWizardComponent.indiceActual = 1;
    component.anterior();
    expect(component.indice).toBe(2);
    expect(component.datosPasos.indice).toBe(2);
    expect(mockWizardComponent.atras).toHaveBeenCalled();
  });

  it('should navigate siguiente', () => {
    mockWizardComponent.indiceActual = 1;
    component.siguiente();
    expect(component.indice).toBe(2);
    expect(component.datosPasos.indice).toBe(2);
    expect(mockWizardComponent.siguiente).toHaveBeenCalled();
  });

  it('should call ngOnDestroy', () => {
    const spyNext = jest.spyOn(component['destroyNotifier$'], 'next');
    const spyComplete = jest.spyOn(component['destroyNotifier$'], 'complete');
    component.ngOnDestroy();
    expect(spyNext).toHaveBeenCalled();
    expect(spyComplete).toHaveBeenCalled();
  });
});