import { PasoUnoComponent } from './paso-uno.component';
import { of, Subject } from 'rxjs';

describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let mockConsultaQuery: any;
  let mockSolocitud10703Service: any;

  beforeEach(() => {
    mockConsultaQuery = {
      selectConsultaioState$: of({ update: false })
    };
    mockSolocitud10703Service = {
      getExencionDeMercanciasData: jest.fn().mockReturnValue(of({ data: 'mock' })),
      exencionDeMercancias: jest.fn()
    };
    component = new PasoUnoComponent(mockConsultaQuery, mockSolocitud10703Service);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set esDatosRespuesta to true if consultaState.update is false on ngOnInit', () => {
    mockConsultaQuery.selectConsultaioState$ = of({ update: false });
    component.ngOnInit();
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('should call guardarDatosFormulario if consultaState.update is true on ngOnInit', () => {
    const spy = jest.spyOn(component, 'guardarDatosFormulario');
    mockConsultaQuery.selectConsultaioState$ = of({ update: true });
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should set indice when seleccionaTab is called', () => {
    component.seleccionaTab(3);
    expect(component.indice).toBe(3);
  });

  it('guardarDatosFormulario should set esDatosRespuesta to true and call exencionDeMercancias if response exists', () => {
    component.guardarDatosFormulario();
    expect(component.esDatosRespuesta).toBe(true);
    expect(mockSolocitud10703Service.exencionDeMercancias).toHaveBeenCalledWith({ data: 'mock' });
  });

  it('guardarDatosFormulario should not call exencionDeMercancias if response is falsy', () => {
    mockSolocitud10703Service.getExencionDeMercanciasData.mockReturnValue(of(null));
    component.guardarDatosFormulario();
    expect(mockSolocitud10703Service.exencionDeMercancias).not.toHaveBeenCalled();
  });

  it('ngOnDestroy should complete destroyNotifier$', () => {
    const completeSpy = jest.spyOn((component as any).destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(completeSpy).toHaveBeenCalled();
  });
});