import { of } from 'rxjs';
import { PasoUnoComponent } from './paso-uno.component';

describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let solocitud220503ServiceMock: any;
  let consultaQueryMock: any;

  beforeEach(() => {
    solocitud220503ServiceMock = {
      getRegistroTomaMuestrasMercanciasData: jest.fn(),
      actualizarEstadoFormulario: jest.fn(),
    };

    consultaQueryMock = {
      selectConsultaioState$: of({ update: false }),
    };

    component = new PasoUnoComponent(
      solocitud220503ServiceMock,
      consultaQueryMock
    );
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe establecer esDatosRespuesta en true y llamar actualizarEstadoFormulario en guardarDatosFormulario', () => {
    const resp = { some: 'data' };
    solocitud220503ServiceMock.getRegistroTomaMuestrasMercanciasData.mockReturnValue(of(resp));
    component.guardarDatosFormulario();
    expect(component.esDatosRespuesta).toBe(true);
    expect(solocitud220503ServiceMock.actualizarEstadoFormulario).toHaveBeenCalledWith(resp);
  });

  it('no debe llamar actualizarEstadoFormulario si la respuesta es falsy en guardarDatosFormulario', () => {
    solocitud220503ServiceMock.getRegistroTomaMuestrasMercanciasData.mockReturnValue(of(null));
    component.guardarDatosFormulario();
    expect(solocitud220503ServiceMock.actualizarEstadoFormulario).not.toHaveBeenCalled();
  });

  it('debe actualizar indice cuando se llama seleccionaTab', () => {
    component.seleccionaTab(3);
    expect(component.indice).toBe(3);
  });

  it('debe completar destroyNotifier$ en ngOnDestroy', () => {
    const nextSpy = jest.spyOn((component as any).destroyNotifier$, 'next');
    const completeSpy = jest.spyOn((component as any).destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  describe('validarFormularios', () => {
    it('debe retornar true cuando todos los formularios son válidos', () => {
      component.solicitante = {
        form: {
          invalid: false,
          markAllAsTouched: jest.fn()
        }
      } as any;

      component.solicitudDatos = {
        validarFormularios: jest.fn().mockReturnValue(true)
      } as any;

      component.revisionDocumental = {
        validarFormularios: jest.fn().mockReturnValue(true)
      } as any;

      const result = component.validarFormularios();

      expect(result).toBe(true);
      expect(component.solicitante.form.markAllAsTouched).not.toHaveBeenCalled();
    });

    it('debe retornar false cuando el formulario solicitante es inválido', () => {
      component.solicitante = {
        form: {
          invalid: true,
          markAllAsTouched: jest.fn()
        }
      } as any;

      component.solicitudDatos = {
        validarFormularios: jest.fn().mockReturnValue(true)
      } as any;

      component.revisionDocumental = {
        validarFormularios: jest.fn().mockReturnValue(true)
      } as any;

      const result = component.validarFormularios();

      expect(result).toBe(false);
      expect(component.solicitante.form.markAllAsTouched).toHaveBeenCalled();
    });

    it('debe retornar false cuando solicitante no está disponible', () => {
      component.solicitante = undefined as any;

      component.solicitudDatos = {
        validarFormularios: jest.fn().mockReturnValue(true)
      } as any;

      component.revisionDocumental = {
        validarFormularios: jest.fn().mockReturnValue(true)
      } as any;

      const result = component.validarFormularios();

      expect(result).toBe(false);
    });

    it('debe retornar false cuando la validación de solicitudDatos falla', () => {
      component.solicitante = {
        form: {
          invalid: false,
          markAllAsTouched: jest.fn()
        }
      } as any;

      component.solicitudDatos = {
        validarFormularios: jest.fn().mockReturnValue(false)
      } as any;

      component.revisionDocumental = {
        validarFormularios: jest.fn().mockReturnValue(true)
      } as any;

      const result = component.validarFormularios();

      expect(result).toBe(false);
    });

    it('debe retornar false cuando solicitudDatos no está disponible', () => {
      component.solicitante = {
        form: {
          invalid: false,
          markAllAsTouched: jest.fn()
        }
      } as any;

      component.solicitudDatos = undefined as any;

      component.revisionDocumental = {
        validarFormularios: jest.fn().mockReturnValue(true)
      } as any;

      const result = component.validarFormularios();

      expect(result).toBe(false);
    });

    it('debe retornar false cuando la validación de revisionDocumental falla', () => {
      component.solicitante = {
        form: {
          invalid: false,
          markAllAsTouched: jest.fn()
        }
      } as any;

      component.solicitudDatos = {
        validarFormularios: jest.fn().mockReturnValue(true)
      } as any;

      component.revisionDocumental = {
        validarFormularios: jest.fn().mockReturnValue(false)
      } as any;

      const result = component.validarFormularios();

      expect(result).toBe(false);
    });

    it('debe retornar false cuando revisionDocumental no está disponible', () => {
      component.solicitante = {
        form: {
          invalid: false,
          markAllAsTouched: jest.fn()
        }
      } as any;

      component.solicitudDatos = {
        validarFormularios: jest.fn().mockReturnValue(true)
      } as any;

      component.revisionDocumental = undefined as any;

      const result = component.validarFormularios();

      expect(result).toBe(false);
    });

    it('debe retornar false cuando el formulario solicitante es null', () => {
      component.solicitante = {
        form: null
      } as any;

      component.solicitudDatos = {
        validarFormularios: jest.fn().mockReturnValue(true)
      } as any;

      component.revisionDocumental = {
        validarFormularios: jest.fn().mockReturnValue(true)
      } as any;

      const result = component.validarFormularios();

      expect(result).toBe(false);
    });
  });

  it('debe inicializar las propiedades correctamente', () => {
    expect(component.esDatosRespuesta).toBe(false);
    expect(component.indice).toBe(1);
    expect((component as any).destroyNotifier$).toBeDefined();
  });
});
