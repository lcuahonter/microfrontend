const { EmpresasTerciarizadaasComponent } = require('../../../../../../80105/component/empresas-terciarizadaas/empresas-terciarizadaas.component');

describe('EmpresasTerciarizadaasComponent', () => {
  let component: any;
  let mockNuevoProgramaIndustrialService: any;
  let mockTramite80104Store: any;
  let mockTramite80104Query: any;
  let mockComplimentosService: any;

  beforeEach(() => {
    mockNuevoProgramaIndustrialService = {};
    mockTramite80104Store = {
      setSeleccionadas: jest.fn(),
      setEstadosOpciones: jest.fn(),
    };
    mockTramite80104Query = {
      selectEstadosOpciones$: { subscribe: jest.fn() }
    };
    mockComplimentosService = {
      getTerciarizadasDisponibles: jest.fn(),
      toDisponsibleFiscal: jest.fn()
    };

    component = new EmpresasTerciarizadaasComponent(
      mockNuevoProgramaIndustrialService,
      mockTramite80104Store,
      mockTramite80104Query,
      mockComplimentosService
    );
  });

  it('should initialize estadosCatalogo$ on ngOnInit', () => {
    mockTramite80104Query.selectEstadosOpciones$ = 'observable';
    component.ngOnInit();
    expect(component.estadosCatalogo$).toBe('observable');
  });

  it('should call setSeleccionadas when actualizarSeleccionadas is called', () => {
    const event = [{ id: 1 }];
    component.actualizarSeleccionadas(event);
    expect(mockTramite80104Store.setSeleccionadas).toHaveBeenCalledWith(event);
  });

  it('should not call setSeleccionadas if event is falsy', () => {
    component.actualizarSeleccionadas(undefined);
    expect(mockTramite80104Store.setSeleccionadas).not.toHaveBeenCalled();
  });

  it('should call setEstadosOpciones when actualizarEstados is called', () => {
    const event = [{ id: 1 }];
    component.actualizarEstados(event);
    expect(mockTramite80104Store.setEstadosOpciones).toHaveBeenCalledWith(event);
  });

  it('should not call setEstadosOpciones if event is falsy', () => {
    component.actualizarEstados(undefined);
    expect(mockTramite80104Store.setEstadosOpciones).not.toHaveBeenCalled();
  });

  it('should set disponiblesDatos when obtenerTerciarizadasDisponibles returns valid data', () => {
    const mockResponse = { datos: [{}, {}] };
    const mockFiscal = [{}, {}];
    mockComplimentosService.getTerciarizadasDisponibles.mockReturnValue({
      pipe: () => ({
        subscribe: (success: any, error: any) => success(mockResponse)
      })
    });
    mockComplimentosService.toDisponsibleFiscal.mockReturnValue(mockFiscal);

    // Mock esValidObject and esValidArray
    jest.spyOn(require('@libs/shared/data-access-user/src'), 'esValidObject').mockReturnValue(true);
    jest.spyOn(require('@libs/shared/data-access-user/src'), 'doDeepCopy').mockImplementation((x) => x);
    jest.spyOn(require('@libs/shared/data-access-user/src'), 'esValidArray').mockReturnValue(true);

    component.obtenerTerciarizadasDisponibles({ rfc: 'RFC', estado: 'Estado' });
    expect(component.disponiblesDatos).toBe(mockFiscal);
    expect(component.rfcError).toBe(false);
  });

  it('should set rfcError true when obtenerTerciarizadasDisponibles error codigo is 01', () => {
    mockComplimentosService.getTerciarizadasDisponibles.mockReturnValue({
      pipe: () => ({
        subscribe: (success: any, error: any) => error({ error: { codigo: '01' } })
      })
    });

    component.obtenerTerciarizadasDisponibles({ rfc: 'RFC', estado: 'Estado' });
    expect(component.rfcError).toBe(true);
  });

  it('should not set disponiblesDatos if response is not valid object', () => {
    mockComplimentosService.getTerciarizadasDisponibles.mockReturnValue({
      pipe: () => ({
        subscribe: (success: any, error: any) => success({})
      })
    });
    jest.spyOn(require('@libs/shared/data-access-user/src'), 'esValidObject').mockReturnValue(false);

    component.obtenerTerciarizadasDisponibles({ rfc: 'RFC', estado: 'Estado' });
    expect(component.disponiblesDatos).toEqual([]);
  });

  it('should not set disponiblesDatos if datos is not valid array', () => {
    const mockResponse = { datos: null };
    mockComplimentosService.getTerciarizadasDisponibles.mockReturnValue({
      pipe: () => ({
        subscribe: (success: any, error: any) => success(mockResponse)
      })
    });
    jest.spyOn(require('@libs/shared/data-access-user/src'), 'esValidObject').mockReturnValue(true);
    jest.spyOn(require('@libs/shared/data-access-user/src'), 'doDeepCopy').mockImplementation((x) => x);
    jest.spyOn(require('@libs/shared/data-access-user/src'), 'esValidArray').mockReturnValue(false);

    component.obtenerTerciarizadasDisponibles({ rfc: 'RFC', estado: 'Estado' });
    expect(component.disponiblesDatos).toEqual([]);
  });

  it('should complete destroyNotifier$ on ngOnDestroy', () => {
    const nextSpy = jest.spyOn(component['destroyNotifier$'], 'next');
    const completeSpy = jest.spyOn(component['destroyNotifier$'], 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should have correct parentTablaConfig', () => {
    expect(component.parentTablaConfig.length).toBe(11);
    expect(component.parentTablaConfig[0].encabezado).toBe('Calle');
    expect(typeof component.parentTablaConfig[0].clave).toBe('function');
  });

  it('should initialize rfcError and disponiblesDatos with default values', () => {
    expect(component.rfcError).toBe(false);
    expect(Array.isArray(component.disponiblesDatos)).toBe(true);
    expect(component.disponiblesDatos.length).toBe(0);
  });
});