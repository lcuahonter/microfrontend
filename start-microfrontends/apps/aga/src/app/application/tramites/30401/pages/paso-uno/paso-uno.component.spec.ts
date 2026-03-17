import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoUnoComponent } from './paso-uno.component';
import { Subject, of } from 'rxjs';

describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let mockRegistroService: any;
  let mockConsultaQuery: any;

  beforeEach(() => {
    mockRegistroService = {
      getRegistroTomaMuestrasMercanciasData: jest.fn(),
      actualizarEstadoFormulario: jest.fn(),
    };
    mockConsultaQuery = {
      selectConsultaioState$: of({ update: true }),
    };
    component = new PasoUnoComponent(
      mockRegistroService,
      mockConsultaQuery
    );
    component.consultaQuery = mockConsultaQuery;
  });

  it('debe inicializar indice en 1', () => {
    expect(component.indice).toBe(1);
  });

  it('debe actualizar indice cuando seleccionaTab es llamado', () => {
    component.seleccionaTab(2);
    expect(component.indice).toBe(2);

    component.seleccionaTab(1);
    expect(component.indice).toBe(1);
  });

  it('debe limpiar las suscripciones en ngOnDestroy', () => {
    const nextSpy = jest.spyOn(component.destroyNotifier$, 'next');
    const completeSpy = jest.spyOn(component.destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('debe asignar consultaState y llamar guardarDatosFormulario si update es true en ngOnInit', () => {
  const guardarSpy = jest.spyOn(component, 'guardarDatosFormulario').mockImplementation(() => {});
  component.consultaQuery = {
    selectConsultaioState$: of({ update: true }),
  } as any;
  component.ngOnInit();
  expect(component.consultaState).toEqual({ update: true });
  expect(guardarSpy).toHaveBeenCalled();
});

  it('debe asignar consultaState y establecer esDatosRespuesta en true si update es false en ngOnInit', () => {
    component.consultaQuery = {
      selectConsultaioState$: of({ update: false }),
    } as any;
    component.ngOnInit();
    expect(component.consultaState).toEqual({ update: false });
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('guardarDatosFormulario debe establecer esDatosRespuesta en true y llamar actualizarEstadoFormulario si resp existe', (done) => {
    const respMock = { data: 'mock' };
    mockRegistroService.getRegistroTomaMuestrasMercanciasData.mockReturnValue(of(respMock));
    component.guardarDatosFormulario();
    setTimeout(() => {
      expect(component.esDatosRespuesta).toBe(true);
      expect(mockRegistroService.actualizarEstadoFormulario).toHaveBeenCalledWith(respMock);
      done();
    });
  });

  it('guardarDatosFormulario debe establecer esDatosRespuesta en false si resp no existe', () => {
    mockRegistroService.getRegistroTomaMuestrasMercanciasData.mockReturnValue(of(null));
    component.guardarDatosFormulario();
    expect(component.esDatosRespuesta).toBe(false);
    expect(mockRegistroService.actualizarEstadoFormulario).not.toHaveBeenCalled();
  });
});