import { DatosComponent } from './datos.component';
import { Subject, of } from 'rxjs';

const mockConsultaioQuery = {
  selectConsultaioState$: of({ update: false }),
};
const mockService317Service = {
  getRegistroTomaMuestrasMercanciasData: jest.fn().mockReturnValue(of({})),
  actualizarEstadoFormulario: jest.fn(),
};

describe('DatosComponent', () => {
  let component: DatosComponent;

  beforeEach(() => {
    jest.clearAllMocks();
    component = new DatosComponent(
      mockConsultaioQuery as any,
      mockService317Service as any
    );
    
    (component as any).destroyNotifier$ = new Subject<void>();
  });

  it('should initialize and set consultaState', () => {
    component.ngOnInit();
    expect(component.consultaState).toEqual({ update: false });
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('should call guardarDatosFormulario if consultaState.update is true', () => {
    mockConsultaioQuery.selectConsultaioState$ = of({ update: true });
    const comp = new DatosComponent(
      mockConsultaioQuery as any,
      mockService317Service as any
    );
    const spy = jest.spyOn(comp, 'guardarDatosFormulario');
    comp.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should set esDatosRespuesta and call actualizarEstadoFormulario on guardarDatosFormulario', () => {
    component.esDatosRespuesta = false;
    component.guardarDatosFormulario();
    expect(component.esDatosRespuesta).toBe(true);
    expect(mockService317Service.actualizarEstadoFormulario).toHaveBeenCalled();
  });

  it('should set indice on seleccionaTab', () => {
    component.indice = 1;
    component.seleccionaTab(3);
    expect(component.indice).toBe(3);
  });

  it('should complete destroyNotifier$ on ngOnDestroy', () => {
    const destroyNotifier$ = new Subject<void>();
    (component as any).destroyNotifier$ = destroyNotifier$;
    const spy = jest.spyOn(destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
  });

  it('should call obtenerTipoPersona on ngAfterViewInit', () => {
    component.solicitante = { obtenerTipoPersona: jest.fn() } as any;
    component.ngAfterViewInit();
    expect(component.solicitante.obtenerTipoPersona).toHaveBeenCalled();
  });
});
