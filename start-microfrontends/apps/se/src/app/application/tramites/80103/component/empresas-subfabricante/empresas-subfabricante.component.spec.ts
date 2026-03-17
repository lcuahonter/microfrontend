import { FormBuilder } from "@angular/forms";
import { EmpresasSubfabricanteComponent } from "../../../80103/component/empresas-subfabricante/empresas-subfabricante.component";



describe('EmpresasSubfabricanteComponent', () => {
  let component: EmpresasSubfabricanteComponent;
  let store: any;
  let query: any;
  let router: any;
  let activatedRoute: any;
  let fb: FormBuilder;
  let nuevoProgramaIndustrialService: any;
  let _compartidaSvc: any;

  beforeEach(() => {
    store = {
      setFormValida: jest.fn(),
      setDatosSubcontratista: jest.fn(),
      setPlantasBuscadas: jest.fn(),
      setPlantasSubfabricantesAgregar: jest.fn(),
      eliminarPlantas: jest.fn(),
      setPlantasPorCompletar: jest.fn(),
      setindicePrevioRuta: jest.fn(),
    };
    query = {
      datosSubcontratistaEstado$: { pipe: jest.fn().mockReturnThis(), subscribe: jest.fn() },
      plantasBuscadas$: { pipe: jest.fn().mockReturnThis(), subscribe: jest.fn() },
      plantasSubfabricantesAgregar$: { pipe: jest.fn().mockReturnThis(), subscribe: jest.fn() },
    };
    router = { navigate: jest.fn() };
    activatedRoute = {};
    fb = new FormBuilder();
    nuevoProgramaIndustrialService = {
      obtenerListaEstado: jest.fn().mockReturnValue({ pipe: jest.fn().mockReturnThis(), subscribe: jest.fn() }),
    };
    _compartidaSvc = {
      getSubfabricantesDisponibles: jest.fn().mockReturnValue({ pipe: jest.fn().mockReturnThis(), subscribe: jest.fn() }),
      mapApiResponseToPlantasSubfabricante: jest.fn(),
    };

    component = new EmpresasSubfabricanteComponent(
      nuevoProgramaIndustrialService,
      fb,
      query,
      store,
      router,
      activatedRoute,
      _compartidaSvc
    );
  });

  it('should initialize formularioDatosSubcontratista', () => {
    expect(component.formularioDatosSubcontratista).toBeDefined();
    expect(component.formularioDatosSubcontratista.get('rfc')).toBeDefined();
    expect(component.formularioDatosSubcontratista.get('estado')).toBeDefined();
  });

  it('should call obtenerDatosDelAlmacen and obtenerListaEstado on ngOnInit', () => {
    const spyDatos = jest.spyOn(component, 'obtenerDatosDelAlmacen');
    const spyEstado = jest.spyOn(component, 'obtenerListaEstado');
    component.ngOnInit();
    expect(spyDatos).toHaveBeenCalled();
    expect(spyEstado).toHaveBeenCalled();
  });

  it('should patchValue and call store.setDatosSubcontratista on enEstadoSeleccionado', () => {
    const estado = { clave: 'MX' } as any;
    component.formularioDatosSubcontratista.patchValue({ rfc: 'RFC', estado: '' });
    component.enEstadoSeleccionado(estado);
    expect(component.formularioDatosSubcontratista.value.estado).toBe('MX');
    expect(store.setDatosSubcontratista).toHaveBeenCalled();
  });

  it('should call store.setDatosSubcontratista on alCambiarRFC if datosSubcontratista exists', () => {
    const datos = { rfc: 'RFC', estado: 'MX' } as any;
    component.alCambiarRFC(datos);
    expect(store.setDatosSubcontratista).toHaveBeenCalledWith(datos);
  });

  it('should initialize formularioDatosSubcontratista with empty values', () => {
    component.inicializarFormularioDatosSubcontratista();
    expect(component.formularioDatosSubcontratista.value).toEqual({ rfc: '', estado: '' });
  });

  it('should update estadoCatalogo on obtenerListaEstado', () => {
    const response = { data: [{ clave: 'MX' }] };
    nuevoProgramaIndustrialService.obtenerListaEstado = jest.fn().mockReturnValue({
      pipe: jest.fn().mockReturnThis(),
      subscribe: (cb: any) => cb(response),
    });
    component.obtenerListaEstado();
    expect(component.estadoCatalogo).toEqual(response.data);
  });

  it('should call store.setPlantasBuscadas on obtenerSubfabricantesDisponibles', () => {
    component.formularioDatosSubcontratista.patchValue({ rfc: 'RFC', estado: 'MX' });
    const response = { datos: [{}] };
    _compartidaSvc.getSubfabricantesDisponibles = jest.fn().mockReturnValue({
      pipe: jest.fn().mockReturnThis(),
      subscribe: (cb: any) => cb(response),
    });
    (_compartidaSvc.mapApiResponseToPlantasSubfabricante as jest.Mock).mockReturnValue([{ id: 1 }]);
    (global as any).esValidObject = jest.fn().mockReturnValue(true);
    (global as any).doDeepCopy = jest.fn().mockImplementation((x) => x);
    (global as any).esValidArray = jest.fn().mockReturnValue(true);
    component.obtenerSubfabricantesDisponibles();
    expect(store.setPlantasBuscadas).toHaveBeenCalledWith([{ id: 1 }]);
  });

  it('should set datosDelSubfabricanteSeleccionado on obtenerRegistroSeleccionado', () => {
    const plantas:any = [{ id: 1 }];
    component.obtenerRegistroSeleccionado(plantas);
    expect(component.datosDelSubfabricanteSeleccionado).toEqual(plantas);
  });

  it('should call obtenerSubfabricantesDisponibles on realizarBusqueda if form is valid', () => {
    component.formularioDatosSubcontratista.patchValue({ rfc: 'RFC', estado: 'MX' });
    const spy = jest.spyOn(component, 'obtenerSubfabricantesDisponibles');
    component.realizarBusqueda();
    expect(spy).toHaveBeenCalled();
  });

  it('should call store.setPlantasSubfabricantesAgregar on agregarPlantas', () => {
    const plantas:any = [{ id: 1 }];
    component.agregarPlantas(plantas);
    expect(store.setPlantasSubfabricantesAgregar).toHaveBeenCalledWith(plantas);
  });

  it('should set listaDeSubfabricantesPorEliminar on datosDelSubfabricantePorEliminar', () => {
    const plantas:any = [{ id: 1 }];
    component.datosDelSubfabricantePorEliminar(plantas);
    expect(component.listaDeSubfabricantesPorEliminar).toEqual(plantas);
  });

  it('should call store.eliminarPlantas on eliminarPlantas', () => {
    const plantas:any = [{ id: 1 }];
    component.eliminarPlantas(plantas);
    expect(store.eliminarPlantas).toHaveBeenCalledWith(plantas);
  });

  it('should call store.setPlantasPorCompletar, setindicePrevioRuta and router.navigate on complementarPlantas', () => {
    component.tabIndex = 2;
    const plantas:any = [{ id: 1 }];
    component.complementarPlantas(plantas);
    expect(store.setPlantasPorCompletar).toHaveBeenCalledWith(plantas);
    expect(store.setindicePrevioRuta).toHaveBeenCalledWith(2);
    expect(router.navigate).toHaveBeenCalledWith(['../complementar-plantas'], { relativeTo: activatedRoute });
  });

  it('should complete destroyNotifier$ on ngOnDestroy', () => {
    const spyNext = jest.spyOn((component as any).destroyNotifier$, 'next');
    const spyComplete = jest.spyOn((component as any).destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(spyNext).toHaveBeenCalled();
    expect(spyComplete).toHaveBeenCalled();
  });
});