import { EmpresasTerciarizadaasComponent } from '../../../80105/component/empresas-terciarizadaas/empresas-terciarizadaas.component';


describe('EmpresasTerciarizadaasComponent', () => {
  let component: EmpresasTerciarizadaasComponent;
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
    const event: any = [{ id: 1 }];
    component.actualizarSeleccionadas(event);
    expect(mockTramite80104Store.setSeleccionadas).toHaveBeenCalledWith(event);
  });

  it('should not call setSeleccionadas if event is falsy', () => {
    component.actualizarSeleccionadas([]);
    expect(mockTramite80104Store.setSeleccionadas).not.toHaveBeenCalled();
  });

  it('should call setEstadosOpciones when actualizarEstados is called', () => {
    const event: any = [{ id: 1 }];
    component.actualizarEstados(event);
    expect(mockTramite80104Store.setEstadosOpciones).toHaveBeenCalledWith(event);
  });

  it('should not call setEstadosOpciones if event is falsy', () => {
    component.actualizarEstados([]);
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

 it('should have parentTablaConfig defined', () => {
    expect(Array.isArray(component.parentTablaConfig)).toBe(true);
    expect(component.parentTablaConfig.length).toBeGreaterThan(0);
  });

   it('should define parentTablaConfig as an array', () => {
    expect(Array.isArray(component.parentTablaConfig)).toBe(true);
  });

  it('should have 11 columns in parentTablaConfig', () => {
    expect(component.parentTablaConfig.length).toBe(11);
  });

  it('should have correct encabezado for first and last columns', () => {
    expect(component.parentTablaConfig[0].encabezado).toBe('Calle');
    expect(component.parentTablaConfig[10].encabezado).toBe('Razón social');
  });

  it('should have correct orden values from 1 to 11', () => {
    const ordenes = component.parentTablaConfig.map(col => col.orden);
    expect(ordenes).toEqual([1,2,3,4,5,6,7,8,9,10,11]);
  });

  it('should extract correct values using clave function', () => {
    const mockItem = {
      calle: 'Calle 1',
      numeroExterior: '123',
      numeroInterior: 'A',
      codigoPostal: '45678',
      colonia: 'Colonia X',
      municipioDelegacion: 'Municipio Y',
      entidadFederativa: 'Entidad Z',
      pais: 'México',
      registroFederalContribuyentes: 'RFC123',
      domicilioFiscalSolicitante: 'Domicilio 456',
      razonSocial: 'Empresa S.A.',
    };
    expect(component.parentTablaConfig[0].clave(mockItem)).toBe(mockItem.calle);
    expect(component.parentTablaConfig[1].clave(mockItem)).toBe(mockItem.numeroExterior);
    expect(component.parentTablaConfig[2].clave(mockItem)).toBe(mockItem.numeroInterior || '');
    expect(component.parentTablaConfig[3].clave(mockItem)).toBe(mockItem.codigoPostal);
    expect(component.parentTablaConfig[4].clave(mockItem)).toBe(mockItem.colonia);
    expect(component.parentTablaConfig[5].clave(mockItem)).toBe(mockItem.municipioDelegacion);
    expect(component.parentTablaConfig[6].clave(mockItem)).toBe(mockItem.entidadFederativa);
    expect(component.parentTablaConfig[7].clave(mockItem)).toBe(mockItem.pais);
    expect(component.parentTablaConfig[8].clave(mockItem)).toBe(mockItem.registroFederalContribuyentes);
    expect(component.parentTablaConfig[9].clave(mockItem)).toBe(mockItem.domicilioFiscalSolicitante);
    expect(component.parentTablaConfig[10].clave(mockItem)).toBe(mockItem.razonSocial);
  });

  it('should return empty string for numeroInterior if undefined', () => {
    const mockItem: any = { numeroInterior: undefined };
    expect(component.parentTablaConfig[2].clave(mockItem)).toBe('');
  });

  it('should initialize rfcError and disponiblesDatos with default values', () => {
    expect(component.rfcError).toBe(false);
    expect(Array.isArray(component.disponiblesDatos)).toBe(true);
    expect(component.disponiblesDatos.length).toBe(0);
  });
});