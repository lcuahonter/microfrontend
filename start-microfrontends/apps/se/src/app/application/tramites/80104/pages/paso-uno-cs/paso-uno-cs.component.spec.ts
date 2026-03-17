import { PasoUnoCsComponent } from "./paso-uno-cs.component";

describe('PasoUnoCsComponent (80104)', () => {
  let component: PasoUnoCsComponent;
  let seccionStore: any;
  let Solocitud80104Service: any;
  let consultaQuery: any;
  let tramite80101Store: any;

  beforeEach(() => {
    seccionStore = {
      establecerSeccion: jest.fn(),
      establecerFormaValida: jest.fn(),
    };
    Solocitud80104Service = {
      getRegistroTomaMuestrasMercanciasData: jest.fn().mockReturnValue({ pipe: jest.fn().mockReturnThis(), subscribe: jest.fn() }),
      getRegistroTomaMuestrasMercanciasDatas: jest.fn().mockReturnValue({ pipe: jest.fn().mockReturnThis(), subscribe: jest.fn() }),
      getRegistroComplementosData: jest.fn().mockReturnValue({ pipe: jest.fn().mockReturnThis(), subscribe: jest.fn() }),
      getRegistroFederatoriosData: jest.fn().mockReturnValue({ pipe: jest.fn().mockReturnThis(), subscribe: jest.fn() }),
      getRegistroComplementarData: jest.fn().mockReturnValue({ pipe: jest.fn().mockReturnThis(), subscribe: jest.fn() }),
      actualizarEstadoFormulario: jest.fn(),
      actualizarEstadoFormularios: jest.fn(),
      actualizarComplementos: jest.fn(),
      actualizarFederatorios: jest.fn(),
      actualizarComplementar: jest.fn(),
    };
    consultaQuery = {
      selectConsultaioState$: {
        pipe: jest.fn().mockReturnThis(),
        subscribe: jest.fn(),
      },
    };
    tramite80101Store = {};
    component = new PasoUnoCsComponent(seccionStore, Solocitud80104Service, consultaQuery, tramite80101Store);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize properties', () => {
    expect(component.esDatosRespuesta).toBe(false);
    expect(component.indice).toBe(1);
    expect(component.formularioDeshabilitado).toBe(false);
    expect(Array.isArray(component.configuracionDosDatos)).toBe(true);
  });

  it('should select tab', () => {
    component.seleccionaTab(2);
    expect(component.indice).toBe(2);
  });

  describe('private asignarSecciones', () => {
    it('should call establecerSeccion and establecerFormaValida', () => {
      // Call private method via prototype for coverage
      const instance: any = component;
      instance.asignarSecciones();
      expect(seccionStore.establecerSeccion).toHaveBeenCalled();
      expect(seccionStore.establecerFormaValida).toHaveBeenCalled();
    });
  });

  describe('guardarDatosFormulario', () => {
    beforeEach(() => {
      Solocitud80104Service.getRegistroTomaMuestrasMercanciasData.mockReturnValue({
        pipe: jest.fn().mockReturnThis(),
        subscribe: (fn: any) => fn({}),
      });
      Solocitud80104Service.getRegistroTomaMuestrasMercanciasDatas.mockReturnValue({
        pipe: jest.fn().mockReturnThis(),
        subscribe: (fn: any) => fn({}),
      });
      Solocitud80104Service.getRegistroComplementosData.mockReturnValue({
        pipe: jest.fn().mockReturnThis(),
        subscribe: (fn: any) => fn({}),
      });
      Solocitud80104Service.getRegistroFederatoriosData.mockReturnValue({
        pipe: jest.fn().mockReturnThis(),
        subscribe: (fn: any) => fn({}),
      });
      Solocitud80104Service.getRegistroComplementarData.mockReturnValue({
        pipe: jest.fn().mockReturnThis(),
        subscribe: (fn: any) => fn({}),
      });
    });

    it('should call service methods and update esDatosRespuesta', () => {
      component.esDatosRespuesta = false;
      component.guardarDatosFormulario();
      expect(component.esDatosRespuesta).toBe(true);
      expect(Solocitud80104Service.actualizarEstadoFormulario).toHaveBeenCalled();
      expect(Solocitud80104Service.actualizarEstadoFormularios).toHaveBeenCalled();
      expect(Solocitud80104Service.actualizarComplementos).toHaveBeenCalled();
      expect(Solocitud80104Service.actualizarFederatorios).toHaveBeenCalled();
      expect(Solocitud80104Service.actualizarComplementar).toHaveBeenCalled();
    });

    it('should not call actualizar methods if resp is falsy', () => {
      Solocitud80104Service.getRegistroTomaMuestrasMercanciasData.mockReturnValue({
        pipe: jest.fn().mockReturnThis(),
        subscribe: (fn: any) => fn(null),
      });
      Solocitud80104Service.getRegistroTomaMuestrasMercanciasDatas.mockReturnValue({
        pipe: jest.fn().mockReturnThis(),
        subscribe: (fn: any) => fn(null),
      });
      Solocitud80104Service.getRegistroComplementosData.mockReturnValue({
        pipe: jest.fn().mockReturnThis(),
        subscribe: (fn: any) => fn(null),
      });
      Solocitud80104Service.getRegistroFederatoriosData.mockReturnValue({
        pipe: jest.fn().mockReturnThis(),
        subscribe: (fn: any) => fn(null),
      });
      Solocitud80104Service.getRegistroComplementarData.mockReturnValue({
        pipe: jest.fn().mockReturnThis(),
        subscribe: (fn: any) => fn(null),
      });
      component.guardarDatosFormulario();
      expect(Solocitud80104Service.actualizarEstadoFormulario).not.toHaveBeenCalled();
      expect(Solocitud80104Service.actualizarEstadoFormularios).not.toHaveBeenCalled();
      expect(Solocitud80104Service.actualizarComplementos).not.toHaveBeenCalled();
      expect(Solocitud80104Service.actualizarFederatorios).not.toHaveBeenCalled();
      expect(Solocitud80104Service.actualizarComplementar).not.toHaveBeenCalled();
    });
  });

  describe('ngOnInit', () => {
    it('should subscribe and call guardarDatosFormulario if update is true', () => {
      const mockState = { update: true };
      consultaQuery.selectConsultaioState$.pipe = jest.fn().mockReturnThis();
      consultaQuery.selectConsultaioState$.subscribe = jest.fn((fn: any) => fn(mockState));
      jest.spyOn(component, 'guardarDatosFormulario');
      component.ngOnInit();
      expect(component.consultaState).toEqual(mockState);
      expect(component.guardarDatosFormulario).toHaveBeenCalled();
    });

    it('should set esDatosRespuesta to true if update is false', () => {
      const mockState = { update: false };
      consultaQuery.selectConsultaioState$.pipe = jest.fn().mockReturnThis();
      consultaQuery.selectConsultaioState$.subscribe = jest.fn((fn: any) => fn(mockState));
      jest.spyOn(component, 'guardarDatosFormulario');
      component.ngOnInit();
      expect(component.consultaState).toEqual(mockState);
      expect(component.esDatosRespuesta).toBe(true);
      expect(component.guardarDatosFormulario).not.toHaveBeenCalled();
    });
  });
});