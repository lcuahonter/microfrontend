import { DatosComponent } from './datos.component';
import { of, Subject } from 'rxjs';

describe('DatosComponent', () => {
  let component: DatosComponent;
  let consultaQueryMock: any;
  let consultaStoreMock: any;
  let productoresServiceMock: any;
  let tramiteStoreMock: any;

  beforeEach(() => {
    consultaQueryMock = {
      selectConsultaioState$: of({ update: true })
    };
    consultaStoreMock = {
      establecerConsultaio: jest.fn()
    };
    productoresServiceMock = {
      getRegistroExpansionDeProductoresData: jest.fn().mockReturnValue(of({
        actividadProductiva: 'AP',
        representacionFederal: 'RF',
        rfc: 'RFC',
        fraccion: 'FR',
        sector: 'SEC'
      }))
    };
    tramiteStoreMock = {
      setActividadProductiva: jest.fn(),
      setRepresentacionFederal: jest.fn(),
      setRfc: jest.fn(),
      setFraccion: jest.fn(),
      setSector: jest.fn()
    };
    component = new DatosComponent(
      consultaQueryMock,
      productoresServiceMock,
      tramiteStoreMock
    );
  });

  it('should set indice on seleccionaTab', () => {
    component.seleccionaTab(3);
    expect(component.indice).toBe(3);
  });

  it('should call guardarDatosFormulario if consultaState.update is true on ngOnInit', () => {
    const guardarSpy = jest.spyOn(component, 'guardarDatosFormulario');
    component.consultaState = { update: true } as any;
    component.ngOnInit();
    expect(guardarSpy).toHaveBeenCalled();
  });

  it('should set esDatosRespuesta true and call tramiteStore methods in guardarDatosFormulario', () => {
    component.guardarDatosFormulario();
    expect(component.esDatosRespuesta).toBe(true);
    expect(tramiteStoreMock.setActividadProductiva).toHaveBeenCalledWith('AP');
    expect(tramiteStoreMock.setRepresentacionFederal).toHaveBeenCalledWith('RF');
    expect(tramiteStoreMock.setRfc).toHaveBeenCalledWith('RFC');
    expect(tramiteStoreMock.setFraccion).toHaveBeenCalledWith('FR');
    expect(tramiteStoreMock.setSector).toHaveBeenCalledWith('SEC');
  });

  it('should complete destroyNotifier$ on ngOnDestroy', () => {
    const completeSpy = jest.spyOn(component['destroyNotifier$'], 'complete');
    component.ngOnDestroy();
    expect(completeSpy).toHaveBeenCalled();
  });
});
