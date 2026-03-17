import { ComplementarFraccionVistaComponent } from "./complementar-fraccion-vista.component";



describe('ComplementarFraccionVistaComponent', () => {
  let component: ComplementarFraccionVistaComponent;
  let queryMock: any;
  let consultaQueryMock: any;

  beforeEach(() => {
    queryMock = {
      selectDatosParaNavegar$: {
        pipe: jest.fn().mockReturnThis(),
        subscribe: jest.fn((fn) => {
          fn({ encabezadoDescripcionComercial: 'desc comercial' });
          return { unsubscribe: jest.fn() };
        }),
      },
    };
    consultaQueryMock = {
      selectConsultaioState$: {
        pipe: jest.fn().mockReturnThis(),
        subscribe: jest.fn(),
      },
    };
    component = new ComplementarFraccionVistaComponent(queryMock, consultaQueryMock);
    component.descripcion = 'test descripcion';
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize esFormularioSoloLectura from consultaQuery', () => {
    const pipeMock = jest.fn().mockReturnValue({
      subscribe: (fn: any) => fn({ readonly: true }),
    });
    consultaQueryMock.selectConsultaioState$.pipe = pipeMock;
    const comp = new ComplementarFraccionVistaComponent(queryMock, consultaQueryMock);
    expect(comp.esFormularioSoloLectura).toBe(true);
  });

  it('should set complimentarFraccionDatos.descripcion on ngOnInit', () => {
    component.complimentarFraccionDatos = { descripcion: '' } as any;
    component.ngOnInit();
    expect(component.complimentarFraccionDatos.descripcion).toBe('desc comercial');
  });

  it('should emit guardarComplementarFraccion with descripcion on getDatos', () => {
    const emitSpy = jest.spyOn(component.guardarComplementarFraccion, 'emit');
    const event = { descripcion: 'old' } as any;
    component.getDatos(event);
    expect(emitSpy).toHaveBeenCalledWith({
      ...event,
      descripcion: 'test descripcion',
    });
  });

  it('should emit cerrarPopup', () => {
    const emitSpy = jest.spyOn(component.cerrarPopup, 'emit');
    component.cerrarPopup.emit();
    expect(emitSpy).toHaveBeenCalled();
  });

  it('should complete destroyNotifier$ on ngOnDestroy', () => {
    const nextSpy = jest.spyOn((component as any).destroyNotifier$, 'next');
    const completeSpy = jest.spyOn((component as any).destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should have default values for public properties', () => {
    expect(Array.isArray(component.catagoriaSeleccionDatos)).toBe(true);
    expect(typeof component.complimentarFraccionDatos).toBe('object');
    expect(component.esFormularioSoloLectura).toBe(false);
  });
});