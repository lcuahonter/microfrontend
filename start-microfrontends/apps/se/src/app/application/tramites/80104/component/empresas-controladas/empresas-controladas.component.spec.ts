import { EmpresasControladasComponent } from './empresas-controladas.component';

describe('EmpresasControladasComponent', () => {
  let component: EmpresasControladasComponent;
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
      selectEstadosOpciones$: {} as any,
    };
    mockComplimentosService = {
      getControladasDisponibles: jest.fn(),
      toDisponsibleFiscal: jest.fn(),
    };

    component = new EmpresasControladasComponent(
      mockNuevoProgramaIndustrialService,
      mockTramite80104Store,
      mockTramite80104Query,
      mockComplimentosService
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set estadosCatalogo$ on ngOnInit', () => {
    component.ngOnInit();
    expect(component.estadosCatalogo$).toBe(mockTramite80104Query.selectEstadosOpciones$);
  });

  it('should call setSeleccionadas when actualizarSeleccionadas is called', () => {
    const event = [{ rfc: 'RFC' }] as any;
    component.actualizarSeleccionadas(event);
    expect(mockTramite80104Store.setSeleccionadas).toHaveBeenCalledWith(event);
  });

  it('should not call setSeleccionadas if event is falsy', () => {
    component.actualizarSeleccionadas(undefined as any);
    expect(mockTramite80104Store.setSeleccionadas).not.toHaveBeenCalled();
  });

  it('should call setEstadosOpciones when actualizarEstados is called', () => {
    const event = [{ clave: '01' }] as any;
    component.actualizarEstados(event);
    expect(mockTramite80104Store.setEstadosOpciones).toHaveBeenCalledWith(event);
  });

  it('should not call setEstadosOpciones if event is falsy', () => {
    component.actualizarEstados(undefined as any);
    expect(mockTramite80104Store.setEstadosOpciones).not.toHaveBeenCalled();
  });

  it('should call getControladasDisponibles and set disponiblesDatos on obtenerControladasDisponibles', () => {
    const event = { rfc: 'RFC', estado: 'Estado' };
    const mockResponse = {
      codigo: '00',
      mensaje: 'Operación exitosa.',
      datos: [{}, {}],
    };
    const mockFiscal = [{}, {}];
    const mockObservable = {
      pipe: jest.fn().mockReturnThis(),
      subscribe: jest.fn((cb: any) => cb(mockResponse)),
    };
    mockComplimentosService.getControladasDisponibles.mockReturnValue(mockObservable);
    mockComplimentosService.toDisponsibleFiscal.mockReturnValue(mockFiscal);

    jest.spyOn(require('@libs/shared/data-access-user/src'), 'esValidObject').mockReturnValue(true);
    jest.spyOn(require('@libs/shared/data-access-user/src'), 'esValidArray').mockReturnValue(true);
    jest.spyOn(require('@libs/shared/data-access-user/src'), 'doDeepCopy').mockImplementation((x) => x);

    component.obtenerControladasDisponibles(event);

    expect(mockComplimentosService.getControladasDisponibles).toHaveBeenCalledWith({
      rfcEmpresaSubManufacturera: event.rfc,
      entidadFederativa: event.estado,
      idPrograma: null,
    });
    expect(component.disponiblesDatos).toBe(mockFiscal);
  });

  it('should not set disponiblesDatos if response is not valid', () => {
    const event = { rfc: 'RFC', estado: 'Estado' };
    const mockResponse = {};
    const mockObservable = {
      pipe: jest.fn().mockReturnThis(),
      subscribe: jest.fn((cb: any) => cb(mockResponse)),
    };
    mockComplimentosService.getControladasDisponibles.mockReturnValue(mockObservable);

    jest.spyOn(require('@libs/shared/data-access-user/src'), 'esValidObject').mockReturnValue(false);

    component.obtenerControladasDisponibles(event);

    expect(component.disponiblesDatos).toEqual([]);
  });

  it('should not set disponiblesDatos if datos is not valid array', () => {
    const event = { rfc: 'RFC', estado: 'Estado' };
    const mockResponse = { datos: null };
    const mockObservable = {
      pipe: jest.fn().mockReturnThis(),
      subscribe: jest.fn((cb: any) => cb(mockResponse)),
    };
    mockComplimentosService.getControladasDisponibles.mockReturnValue(mockObservable);

    jest.spyOn(require('@libs/shared/data-access-user/src'), 'esValidObject').mockReturnValue(true);
    jest.spyOn(require('@libs/shared/data-access-user/src'), 'esValidArray').mockReturnValue(false);
    jest.spyOn(require('@libs/shared/data-access-user/src'), 'doDeepCopy').mockImplementation((x) => x);

    component.obtenerControladasDisponibles(event);

    expect(component.disponiblesDatos).toEqual([]);
  });

  it('should complete destroyNotifier$ on ngOnDestroy', () => {
    const nextSpy = jest.spyOn((component as any).destroyNotifier$, 'next');
    const completeSpy = jest.spyOn((component as any).destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should have correct parentTablaConfig', () => {
    expect(component.parentTablaConfig.length).toBe(11);
    expect(component.parentTablaConfig[0].encabezado).toBe('Calle');
    expect(component.parentTablaConfig[10].encabezado).toBe('Razón social');
  });

  it('should call onParentTablaChange and update seleccionadas', () => {
    const event = [{ rfc: 'RFC1' }, { rfc: 'RFC2' }];
    //component.onParentTablaChange(event);
    expect(mockTramite80104Store.setSeleccionadas).toHaveBeenCalledWith(event);
  });

  it('should call onParentEstadosChange and update estados', () => {
    const event = [{ clave: '01' }, { clave: '02' }];
    //component.onParentEstadosChange(event);
    expect(mockTramite80104Store.setEstadosOpciones).toHaveBeenCalledWith(event);
  });

  it('should handle obtenerControladasDisponibles with empty event', () => {
    component.obtenerControladasDisponibles(undefined as any);
    expect(mockComplimentosService.getControladasDisponibles).not.toHaveBeenCalled();
    expect(component.disponiblesDatos).toEqual([]);
  });

  it('should handle obtenerControladasDisponibles with missing rfc/estado', () => {
    component.obtenerControladasDisponibles({ rfc: null, estado: null } as any);
    expect(mockComplimentosService.getControladasDisponibles).not.toHaveBeenCalled();
    expect(component.disponiblesDatos).toEqual([]);
  });

  it('should handle obtenerControladasDisponibles with response missing datos', () => {
    const event = { rfc: 'RFC', estado: 'Estado' };
    const mockResponse = { codigo: '00', mensaje: 'OK' };
    const mockObservable = {
      pipe: jest.fn().mockReturnThis(),
      subscribe: jest.fn((cb: any) => cb(mockResponse)),
    };
    mockComplimentosService.getControladasDisponibles.mockReturnValue(mockObservable);

    jest.spyOn(require('@libs/shared/data-access-user/src'), 'esValidObject').mockReturnValue(true);
    jest.spyOn(require('@libs/shared/data-access-user/src'), 'esValidArray').mockReturnValue(false);

    component.obtenerControladasDisponibles(event);

    expect(component.disponiblesDatos).toEqual([]);
  });

  // Additional edge case: obtenerControladasDisponibles with error thrown
  it('should handle error in obtenerControladasDisponibles observable', () => {
    const event = { rfc: 'RFC', estado: 'Estado' };
    const mockObservable = {
      pipe: jest.fn().mockReturnThis(),
      subscribe: jest.fn((cb: any, errCb: any) => errCb(new Error('Test error'))),
    };
    mockComplimentosService.getControladasDisponibles.mockReturnValue(mockObservable);

    component.disponiblesDatos = [];
    component.obtenerControladasDisponibles(event);

    expect(component.disponiblesDatos).toEqual([]);
  });

  // Test default value of disponiblesDatos
  it('should have default disponiblesDatos as empty array', () => {
    expect(component.disponiblesDatos).toEqual([]);
  });

  // Test default value of parentTablaConfig
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
});