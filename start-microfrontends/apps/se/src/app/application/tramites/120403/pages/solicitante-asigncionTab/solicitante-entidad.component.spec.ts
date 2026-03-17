import { SolicitanteAsigncionComponent } from './solicitante-entidad.component';
import { Subject, of } from 'rxjs';

describe('SolicitanteAsigncionComponent', () => {
  let component: SolicitanteAsigncionComponent;
  let solocitud120403Service: any;
  let consultaQuery: any;
  let tramite120403Query: any;

  beforeEach(() => {
    solocitud120403Service = {
      getRegistroTomaMuestrasMercanciasData: jest.fn().mockReturnValue(of({ test: 'data' })),
      actualizarEstadoFormulario: jest.fn(),
    };
    consultaQuery = {
      selectConsultaioState$: of({ update: false }),
    };
    tramite120403Query = {
      getValue: jest.fn().mockReturnValue({ formValidity: { asigncion: true } }),
    };

    component = new SolicitanteAsigncionComponent(
      solocitud120403Service,
      consultaQuery,
      tramite120403Query
    );
  });

  it('debe inicializar y suscribirse al estado de consulta', () => {
    const guardarSpy = jest.spyOn(component, 'guardarDatosFormulario');
    component.ngOnInit();
    expect(component.consultaState).toBeDefined();
    expect(component.esDatosRespuesta).toBe(true);
    expect(guardarSpy).not.toHaveBeenCalled();
  });

  it('debe llamar a guardarDatosFormulario si update es true', () => {
    consultaQuery.selectConsultaioState$ = of({ update: true });
    component = new SolicitanteAsigncionComponent(
      solocitud120403Service,
      consultaQuery,
      tramite120403Query
    );
    const guardarSpy = jest.spyOn(component, 'guardarDatosFormulario');
    component.ngOnInit();
    expect(guardarSpy).toHaveBeenCalled();
  });

  it('debe guardar los datos del formulario correctamente', () => {
    component.guardarDatosFormulario();
    expect(solocitud120403Service.getRegistroTomaMuestrasMercanciasData).toHaveBeenCalled();
    expect(solocitud120403Service.actualizarEstadoFormulario).toHaveBeenCalledWith({ test: 'data' });
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('debe seleccionar una pestaña', () => {
    component.seleccionaTab(2);
    expect(component.indice).toBe(2);
  });

  it('debe emitir el evento buscarIntento', () => {
    const emitSpy = jest.spyOn(component.buscarIntento, 'emit');
    const evento = { submitted: true, invalid: false, numTramite: '123' };
    component.onBuscarIntento(evento);
    expect(emitSpy).toHaveBeenCalledWith(evento);
  });

  it('debe validar los formularios correctamente', () => {
    expect(component.validarFormularios()).toBe(true);
    tramite120403Query.getValue.mockReturnValue({ formValidity: { asigncion: false } });
    expect(component.validarFormularios()).toBe(false);
  });

  it('debe destruir el componente correctamente', () => {
    const nextSpy = jest.spyOn(component.destroyNotifier$, 'next');
    const completeSpy = jest.spyOn(component.destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});