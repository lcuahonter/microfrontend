import { Validators } from "@angular/forms";
import { ContenedorAnnexoDosTresComponent } from "./contenedor-annexo-dos-tres.component";



describe('ContenedorAnnexoDosTresComponent', () => {
  let component: ContenedorAnnexoDosTresComponent;
  let query: any;
  let store: any;
  let consultaQuery: any;
  let fb: any;

  beforeEach(() => {
    query = {
      anexoDosTableLista$: { pipe: jest.fn().mockReturnThis(), subscribe: jest.fn() },
      anexoTresTablaLista$: { pipe: jest.fn().mockReturnThis(), subscribe: jest.fn() },
      selectDatosAnexoTres$: { pipe: jest.fn().mockReturnThis(), subscribe: jest.fn() },
      selectDatosAnexoTressDos$: { pipe: jest.fn().mockReturnThis(), subscribe: jest.fn() }
    };
    store = {
      setAnnexoDosTableLista: jest.fn(),
      setAnnexoTresTableLista: jest.fn(),
      setDatosAnexoTres: jest.fn(),
      setDatosAnexoTresDos: jest.fn()
    };
    consultaQuery = {
      selectConsultaioState$: { pipe: jest.fn().mockReturnThis(), subscribe: jest.fn() }
    };
    fb = {
      group: jest.fn().mockImplementation((config) => {
        return {
          setValue: jest.fn(),
          controls: config
        };
      })
    };
    component = new ContenedorAnnexoDosTresComponent(query, store, consultaQuery, fb);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize anexoConfig correctly', () => {
    expect(component.anexoConfig.anexoDosTablaSeleccionCheckbox).toBeDefined();
    expect(component.anexoConfig.anexoDosEncabezadoDeTabla).toBeDefined();
    expect(component.anexoConfig.anexoTresTablaSeleccionCheckbox).toBeDefined();
    expect(component.anexoConfig.anexoTresEncabezadoDeTabla).toBeDefined();
  });

  it('should initialize esFormularioSoloLectura as false', () => {
    expect(component.esFormularioSoloLectura).toBe(false);
  });

  it('should call consultaQuery.selectConsultaioState$ subscription in constructor', () => {
    expect(consultaQuery.selectConsultaioState$.pipe).toHaveBeenCalled();
    expect(consultaQuery.selectConsultaioState$.subscribe).toHaveBeenCalled();
  });

  it('should initialize forms in ngOnInit', () => {
    jest.spyOn(component, 'inicializarFormularioDatosSubcontratista');
    jest.spyOn(component, 'obtenerDatosDelAlmacen');
    jest.spyOn(component, 'inicializarFormularioDatosDosSubcontratista');
    jest.spyOn(component, 'obtenerDatosDelAlmacenDos');
    component.ngOnInit();
    expect(component.inicializarFormularioDatosSubcontratista).toHaveBeenCalled();
    expect(component.obtenerDatosDelAlmacen).toHaveBeenCalled();
    expect(component.inicializarFormularioDatosDosSubcontratista).toHaveBeenCalled();
    expect(component.obtenerDatosDelAlmacenDos).toHaveBeenCalled();
  });

  it('should subscribe to anexoDosTableLista$ and update anexoDosTablaLista', () => {
    const mockLista = [{}, {}];
    query.anexoDosTableLista$.subscribe = jest.fn((cb) => cb(mockLista));
    component.ngOnInit();
    expect(component.anexoDosTablaLista).toEqual(mockLista);
  });

  it('should subscribe to anexoTresTablaLista$ and update anexoTresTablaLista', () => {
    const mockLista = [{}, {}];
    query.anexoTresTablaLista$.subscribe = jest.fn((cb) => cb(mockLista));
    component.ngOnInit();
    expect(component.anexoTresTablaLista).toEqual(mockLista);
  });

  it('should set value in anexoTressFormGroup on obtenerDatosDelAlmacen', () => {
    component.anexoTressFormGroup = { setValue: jest.fn() } as any;
    const datos = { fraccionArancelaria: '123', descripcion: 'desc' };
    query.selectDatosAnexoTres$.subscribe = jest.fn((cb) => cb(datos));
    component.obtenerDatosDelAlmacen();
    expect(component.anexoTressFormGroup.setValue).toHaveBeenCalledWith(datos);
  });

  it('should set value in anexoTressDosFormGroup on obtenerDatosDelAlmacenDos', () => {
    component.anexoTressDosFormGroup = { setValue: jest.fn() } as any;
    const datos = { fraccionArancelaria: '456', descripcion: 'desc2' };
    query.selectDatosAnexoTressDos$.subscribe = jest.fn((cb) => cb(datos));
    component.obtenerDatosDelAlmacenDos();
    expect(component.anexoTressDosFormGroup.setValue).toHaveBeenCalledWith(datos);
  });

  it('should initialize anexoTressFormGroup in inicializarFormularioDatosSubcontratista', () => {
    component.inicializarFormularioDatosSubcontratista();
    expect(fb.group).toHaveBeenCalledWith({
      fraccionArancelaria: ['', [Validators.required, Validators.maxLength(10)]],
      descripcion: ['', [Validators.required, Validators.maxLength(1000)]],
    });
  });

  it('should initialize anexoTressDosFormGroup in inicializarFormularioDatosDosSubcontratista', () => {
    component.inicializarFormularioDatosDosSubcontratista();
    expect(fb.group).toHaveBeenCalledWith({
      fraccionArancelaria: ['', [Validators.required, Validators.maxLength(10)]],
      descripcion: ['', [Validators.required, Validators.maxLength(1000)]],
    });
  });

  it('should update anexoDosTablaLista and call store.setAnnexoDosTableLista in obtenerAnexoDosDevolverLaLlamada', () => {
    const event:any = [
      { encabezadoFraccion: 'fraccion1', encabezadoDescripcion: 'desc1', estatus: 'activo' },
      { encabezadoFraccion: 'fraccion2', encabezadoDescripcion: 'desc2', estatus: 'inactivo' }
    ];
    component.obtenerAnexoDosDevolverLaLlamada(event);
    expect(component.anexoDosTablaLista).toEqual(event);
    expect(store.setAnnexoDosTableLista).toHaveBeenCalledWith(event);
  });

  it('should set empty array if event is falsy in obtenerAnexoDosDevolverLaLlamada', () => {
    component.obtenerAnexoDosDevolverLaLlamada(undefined as any);
    expect(component.anexoDosTablaLista).toEqual([]);
    expect(store.setAnnexoDosTableLista).toHaveBeenCalledWith([]);
  });

  it('should update anexoTresTablaLista and call store.setAnnexoTresTableLista in obtenerAnexoTresDevolverLaLlamada', () => {
    const event:any = [
      { encabezadoFraccion: 'fraccion1', encabezadoDescripcion: 'desc1', estatus: 'activo' },
      { encabezadoFraccion: 'fraccion2', encabezadoDescripcion: 'desc2', estatus: 'inactivo' }
    ];
    component.obtenerAnexoTresDevolverLaLlamada(event);
    expect(component.anexoTresTablaLista).toEqual(event);
    expect(store.setAnnexoTresTableLista).toHaveBeenCalledWith(event);
  });

  it('should set empty array if event is falsy in obtenerAnexoTresDevolverLaLlamada', () => {
    component.obtenerAnexoTresDevolverLaLlamada(undefined as any);
    expect(component.anexoTresTablaLista).toEqual([]);
    expect(store.setAnnexoTresTableLista).toHaveBeenCalledWith([]);
  });

  it('should call store.setDatosAnexoTres in modifierComplimentos', () => {
    const complimentos = { fraccionArancelaria: '789', descripcion: 'desc3' };
    component.modifierComplimentos(complimentos);
    expect(store.setDatosAnexoTres).toHaveBeenCalledWith(complimentos);
  });

  it('should call store.setDatosAnexoTresDos in modifierComplimentosDos', () => {
    const complimentos = { fraccionArancelaria: '101', descripcion: 'desc4' };
    component.modifierComplimentosDos(complimentos);
    expect(store.setDatosAnexoTresDos).toHaveBeenCalledWith(complimentos);
  });

  it('should complete destroyNotifier$ on ngOnDestroy', () => {
    const nextSpy = jest.spyOn(component['destroyNotifier$'], 'next');
    const completeSpy = jest.spyOn(component['destroyNotifier$'], 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});