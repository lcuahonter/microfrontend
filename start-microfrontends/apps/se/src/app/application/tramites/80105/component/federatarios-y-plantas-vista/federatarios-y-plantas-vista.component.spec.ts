import { FederatariosYPlantasVistaComponent } from "../../../80105/component/federatarios-y-plantas-vista/federatarios-y-plantas-vista.component";



describe('FederatariosYPlantasVistaComponent', () => {
  let component: FederatariosYPlantasVistaComponent;
  let store: any;
  let query: any;
  let complimentoSvc: any;

  beforeEach(() => {
    store = {
      setFederatarios: jest.fn(),
      setPlantasDisponiblesTablaLista: jest.fn(),
      setPlantasImmexTablaLista: jest.fn(),
      setComplementarPlantaDatos: jest.fn(),
      setFirmantesDatos: jest.fn(),
      setMontosInversionDatos: jest.fn(),
      setEmpleadosDatos: jest.fn(),
      setFederatariosCatalogo: jest.fn(),
      setCapacidadInstaladaTableLista: jest.fn(),
    };
    query = {
      selectDatosFederatarios$: { subscribe: jest.fn() },
      selectDatosPlantasDisponibles$: { subscribe: jest.fn() },
      selectDatosPlantasImmex$: { subscribe: jest.fn() },
      selectDatosFederatariosFormulario$: { pipe: jest.fn(() => ({ subscribe: jest.fn() })) },
    };
    complimentoSvc = {
      getPlantasDisponibles: jest.fn(),
      mapApiResponseToPlantasDisponibles: jest.fn(),
    };
    component = new FederatariosYPlantasVistaComponent(store, query, complimentoSvc);
  });

  it('should initialize observables and subscribe on ngOnInit', () => {
    const federatarios$ = {};
    const plantasDisponibles$ = {};
    const plantasImmex$ = {};
    query.selectDatosFederatarios$ = federatarios$ as any;
    query.selectDatosPlantasDisponibles$ = plantasDisponibles$ as any;
    query.selectDatosPlantasImmex$ = plantasImmex$ as any;
    const datos = { estadoDos: 'JALISCO' };
    const subscribeMock = jest.fn(cb => cb(datos));
    query.selectDatosFederatariosFormulario$.pipe = jest.fn(() => ({ subscribe: subscribeMock }));

    component.ngOnInit();

    expect(component.federatariosTablaLista$).toBe(federatarios$);
    expect(component.plantasDisponiblesTablaLista$).toBe(plantasDisponibles$);
    expect(component.plantasImmexTablaLista$).toBe(plantasImmex$);
    expect(component.datosFederatarios).toBe(datos);
  });

  it('should call store.setFederatarios in setFormaDatos', () => {
    const datos = { estadoDos: 'JALISCO' };
    component.setFormaDatos(datos as any);
    expect(store.setFederatarios).toHaveBeenCalledWith(datos);
  });

  it('should call store.setPlantasDisponiblesTablaLista when setPlantasDisponiblesDatos succeeds', () => {
    const payload = {
      rfcEmpresaSubManufacturera: "AAL0409235E6",
      entidadFederativa: '',
      idPrograma: null
    };
    const response = { datos: [{}] };
    complimentoSvc.getPlantasDisponibles.mockReturnValue({
      pipe: () => ({
        subscribe: (success: any, error: any) => success(response)
      })
    });
    complimentoSvc.mapApiResponseToPlantasDisponibles.mockReturnValue([{}]);
    jest.spyOn(console, 'error').mockImplementation(() => {});
    (global as any).esValidObject = jest.fn(() => true);
    (global as any).doDeepCopy = jest.fn(obj => obj);
    (global as any).esValidArray = jest.fn(() => true);

    component.setPlantasDisponiblesDatos();

    expect(complimentoSvc.getPlantasDisponibles).toHaveBeenCalledWith(payload);
    expect(store.setPlantasDisponiblesTablaLista).toHaveBeenCalledWith([{}]);
  });

  it('should handle error in setPlantasDisponiblesDatos', () => {
    complimentoSvc.getPlantasDisponibles.mockReturnValue({
      pipe: () => ({
        subscribe: (success: any, error: any) => error('error')
      })
    });
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    component.setPlantasDisponiblesDatos();
    expect(errorSpy).toHaveBeenCalledWith('Error al obtener los plantas disponibles:', 'error');
    errorSpy.mockRestore();
  });

  it('should call store.setPlantasImmexTablaLista in setPlantasImmexDatos', () => {
    const datos = [{}];
    component.setPlantasImmexDatos(datos as any);
    expect(store.setPlantasImmexTablaLista).toHaveBeenCalledWith(datos);
  });

  it('should call store.setComplementarPlantaDatos in setComplementarPlantaList', () => {
    const datos = [{}];
    component.setComplementarPlantaList(datos as any);
    expect(store.setComplementarPlantaDatos).toHaveBeenCalledWith(datos);
  });

  it('should call store.setFirmantesDatos in setFirmantesList', () => {
    const datos = [{}];
    component.setFirmantesList(datos as any);
    expect(store.setFirmantesDatos).toHaveBeenCalledWith(datos);
  });

  it('should call store.setMontosInversionDatos in setMontosInversionList', () => {
    const datos = [{}];
    component.setMontosInversionList(datos as any);
    expect(store.setMontosInversionDatos).toHaveBeenCalledWith(datos);
  });

  it('should call store.setEmpleadosDatos in setEmpleadosList', () => {
    const datos = [{}];
    component.setEmpleadosList(datos as any);
    expect(store.setEmpleadosDatos).toHaveBeenCalledWith(datos);
  });

  it('should set estadoValor and call store.setFederatariosCatalogo in setDatosFederatarios', () => {
    const datos = { estadoDos: 'JALISCO' };
    component.setDatosFederatarios(datos as any);
    expect(component.estadoValor).toBe('JALISCO');
    expect(store.setFederatariosCatalogo).toHaveBeenCalledWith(datos);
  });

  it('should call store.setCapacidadInstaladaTableLista in obtenerCapacidadInstaladaTablaList', () => {
    const datos = [{}];
    component.obtenerCapacidadInstaladaTablaList(datos as any);
    expect(store.setCapacidadInstaladaTableLista).toHaveBeenCalledWith(datos);
  });

  it('should complete destroyNotifier$ on ngOnDestroy', () => {
    const nextSpy = jest.spyOn(component['destroyNotifier$'], 'next');
    const completeSpy = jest.spyOn(component['destroyNotifier$'], 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should have default values for table configurations and estadosCatalogos', () => {
    expect(component.federatariosTablaConfiguracion).toBeDefined();
    expect(component.plantasDisponiblesTablaConfiguracion).toBeDefined();
    expect(component.plantasImmexTablaConfiguracion).toBeDefined();
    expect(component.estadosCatalogos).toEqual([{ "id": 1, "descripcion": "JALISCO" }]);
  });
});