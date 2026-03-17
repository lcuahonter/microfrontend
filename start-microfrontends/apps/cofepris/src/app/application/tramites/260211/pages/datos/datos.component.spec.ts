import { DatosComponent } from './datos.component';
import { of, Subject } from 'rxjs';

describe('DatosComponent', () => {
  let component: DatosComponent;
  let consultaQueryMock: any;
  let sanitarioServiceMock: any;

  beforeEach(() => {
    consultaQueryMock = {
      selectConsultaioState$: of({ update: false })
    };
    sanitarioServiceMock = {
      getSolicitudData: jest.fn().mockReturnValue(of({ test: 'data' })),
      actualizarEstadoFormulario: jest.fn()
    };
    component = new DatosComponent(consultaQueryMock, sanitarioServiceMock);
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe establecer esDatosRespuesta en true si update es false al inicializar', () => {
    consultaQueryMock.selectConsultaioState$ = of({ update: false });
    component.ngOnInit();
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('debe llamar a guardarDatosFormulario si update es true al inicializar', () => {
    consultaQueryMock.selectConsultaioState$ = of({ update: true });
    const guardarSpy = jest.spyOn(component, 'guardarDatosFormulario');
    component.ngOnInit();
    expect(guardarSpy).toHaveBeenCalled();
  });

  it('guardarDatosFormulario debe establecer esDatosRespuesta en true y llamar a actualizarEstadoFormulario cuando la respuesta existe', () => {
    sanitarioServiceMock.getSolicitudData.mockReturnValue(of({ test: 'data' }));
    component.guardarDatosFormulario();
    expect(component.esDatosRespuesta).toBe(true);
    expect(sanitarioServiceMock.actualizarEstadoFormulario).toHaveBeenCalledWith({ test: 'data' });
  });

  it('guardarDatosFormulario no debe llamar a actualizarEstadoFormulario si la respuesta es nula', () => {
    sanitarioServiceMock.getSolicitudData.mockReturnValue(of(null));
    component.guardarDatosFormulario();
    expect(component.esDatosRespuesta).toBe(false);
    expect(sanitarioServiceMock.actualizarEstadoFormulario).not.toHaveBeenCalled();
  });

  it('seleccionaTab debe actualizar el índice', () => {
    component.seleccionaTab(3);
    expect(component.indice).toBe(3);
  });

  it('seleccionaTab debe actualizar el índice a 0', () => {
    component.seleccionaTab(0);
    expect(component.indice).toBe(0);
  });

  it('el índice debe ser 1 por defecto', () => {
    expect(component.indice).toBe(1);
  });

  it('debe permitir cambiar el índice varias veces', () => {
    component.seleccionaTab(2);
    expect(component.indice).toBe(2);
    component.seleccionaTab(5);
    expect(component.indice).toBe(5);
  });

  it('no debe lanzar error si seleccionaTab se llama con un valor negativo', () => {
    expect(() => component.seleccionaTab(-1)).not.toThrow();
    expect(component.indice).toBe(-1);
  });

  it('ngOnDestroy debe completar destroyNotifier$', () => {
    const nextSpy = jest.spyOn<any, any>(component['destroyNotifier$'], 'next');
    const completeSpy = jest.spyOn<any, any>(component['destroyNotifier$'], 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('debe desuscribirse de los observables al destruir', () => {
    const destroyNotifier$ = (component as any).destroyNotifier$ as Subject<void>;
    const completeSpy = jest.spyOn(destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('no debe lanzar error si guardarDatosFormulario se llama varias veces', () => {
    sanitarioServiceMock.getSolicitudData.mockReturnValue(of({ test: 'data' }));
    expect(() => {
      component.guardarDatosFormulario();
      component.guardarDatosFormulario();
    }).not.toThrow();
  });

  it('debe establecer esDatosRespuesta en true si guardarDatosFormulario recibe datos válidos', () => {
    sanitarioServiceMock.getSolicitudData.mockReturnValue(of({ foo: 'bar' }));
    component.guardarDatosFormulario();
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('debe establecer esDatosRespuesta en false si guardarDatosFormulario recibe null', () => {
    sanitarioServiceMock.getSolicitudData.mockReturnValue(of(null));
    component.guardarDatosFormulario();
    expect(component.esDatosRespuesta).toBe(false);
  });
});
