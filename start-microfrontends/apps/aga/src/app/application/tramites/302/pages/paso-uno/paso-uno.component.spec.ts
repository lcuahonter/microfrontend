import { PasoUnoComponent } from './paso-uno.component';
import { of, Subject } from 'rxjs';

describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let consultaQueryMock: any;
  let consultaStoreMock: any;
  let solicitudServiceMock: any;

  beforeEach(() => {
    consultaQueryMock = {
      selectConsultaioState$: of({ update: true, readonly: false })
    };
    consultaStoreMock = {
      establecerConsultaio: jest.fn()
    };
    solicitudServiceMock = {
      getCertiRegistroDatos: jest.fn().mockReturnValue(of({ foo: 'bar' })),
      actualizarEstadoFormulario: jest.fn()
    };
    component = new PasoUnoComponent(
      consultaQueryMock,
      consultaStoreMock
    );
  });

  it('should set indice on seleccionaTab', () => {
    component.seleccionaTab(2);
    expect(component.indice).toBe(2);
  });

  it('should call guardarDatosFormulario if consultaState.update is true on ngOnInit', () => {
    const guardarSpy = jest.spyOn(component, 'guardarDatosFormulario');
    component.consultaState = { update: true, readonly: false } as any;
    component.ngOnInit();
    expect(guardarSpy).toHaveBeenCalled();
  });

  it('should complete destroyNotifier$ on ngOnDestroy', () => {
    const completeSpy = jest.spyOn(component['destroyNotifier$'], 'complete');
    component.ngOnDestroy();
    expect(completeSpy).toHaveBeenCalled();
  });
});
