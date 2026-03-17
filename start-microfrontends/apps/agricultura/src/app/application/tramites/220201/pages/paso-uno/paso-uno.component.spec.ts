import { Subject, of, throwError } from 'rxjs';
import { PasoUnoComponent } from './paso-uno.component';

describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;

  let seccionStoreMock: any;
  let certificadoServiceMock: any;
  let consultaQueryMock: any;
  let certificadoZoosanitarioStoreMock: any;

  beforeEach(() => {
    seccionStoreMock = {
      establecerFormaValida: jest.fn(),
      establecerSeccion: jest.fn(),
    };

    certificadoServiceMock = {
      guardarDatosFormulario: jest.fn().mockReturnValue(of({})),
    };

    consultaQueryMock = {
      selectConsultaioState$: new Subject<any>(),
    };

    certificadoZoosanitarioStoreMock = {
      actualizarTodoElEstado: jest.fn()
    };

    component = new PasoUnoComponent(
      seccionStoreMock,
      certificadoServiceMock,
      consultaQueryMock,
      certificadoZoosanitarioStoreMock
    );

    component.solicitante = {
      form: {
        invalid: false,
        markAllAsTouched: jest.fn()
      }
    } as any;

    component.datosDelaSolicitu = {
      validarFormulario: jest.fn(() => true)
    } as any;

    component.datosParaMovilizacionNacional = {
      validarFormulario: jest.fn(() => true)
    } as any;

    component.pagoDeDerechosComponent = {
      validarFormulario: jest.fn(() => true)
    } as any;

    component.tercerospage = {
      validarFormulario: jest.fn(() => true)
    } as any;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe suscribirse y llamar guardarDatosFormulario cuando update=true', (done) => {
    const guardarSpy = jest.spyOn(component, 'guardarDatosFormulario');

    component.ngOnInit();

    (consultaQueryMock.selectConsultaioState$ as Subject<any>).next({ update: true });

    setTimeout(() => {
      expect(guardarSpy).toHaveBeenCalled();
      done();
    }, 0);
  });

  it('debe llamar los métodos del servicio correctamente al guardarDatosFormulario exitoso', (done) => {
    const fakeData = { foo: 'bar' };
    certificadoServiceMock.guardarDatosFormulario.mockReturnValue(of(fakeData));

    component.guardarDatosFormulario();

    setTimeout(() => {
      expect(certificadoServiceMock.guardarDatosFormulario).toHaveBeenCalled();
      expect(certificadoZoosanitarioStoreMock.actualizarTodoElEstado).toHaveBeenCalledWith(fakeData);
      expect(seccionStoreMock.establecerFormaValida).toHaveBeenCalledWith([true]);
      expect(seccionStoreMock.establecerSeccion).toHaveBeenCalledWith([true]);
      done();
    }, 0);
  });

  it('debe manejar el error en guardarDatosFormulario', (done) => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
    certificadoServiceMock.guardarDatosFormulario.mockReturnValue(throwError(() => new Error('API error')));

    component.guardarDatosFormulario();

    setTimeout(() => {
      expect(certificadoServiceMock.guardarDatosFormulario).toHaveBeenCalled();
      expect(certificadoZoosanitarioStoreMock.actualizarTodoElEstado).not.toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
      consoleSpy.mockRestore();
      done();
    }, 0);
  });

  describe('validarFormularios', () => {

    it('debe regresar falso si falta algún componente hijo o es inválido', () => {
      component.solicitante = undefined as any;
      expect(component.validarFormularios()).toBe(false);

      component.solicitante = {
        form: { invalid: false, markAllAsTouched: jest.fn() }
      } as any;
      component.datosDelaSolicitu = undefined as any;
      expect(component.validarFormularios()).toBe(false);

      component.datosDelaSolicitu = { validarFormulario: () => true } as any;
      component.datosParaMovilizacionNacional = undefined as any;
      expect(component.validarFormularios()).toBe(false);

      component.datosParaMovilizacionNacional = { validarFormulario: () => true } as any;
      component.pagoDeDerechosComponent = undefined as any;
      expect(component.validarFormularios()).toBe(false);

      component.pagoDeDerechosComponent = { validarFormulario: () => true } as any;
      component.tercerospage = undefined as any;
      expect(component.validarFormularios()).toBe(false);
    });

    it('debe regresar verdadero cuando todos los formularios son válidos incluyendo tercerospage', () => {
      // Arrange - configurar todos los componentes como válidos
      component.solicitante = {
        form: { invalid: false, markAllAsTouched: jest.fn() }
      } as any;

      component.datosDelaSolicitu = {
        validarFormulario: jest.fn(() => true)
      } as any;

      component.datosParaMovilizacionNacional = {
        validarFormulario: jest.fn(() => true)
      } as any;

      component.pagoDeDerechosComponent = {
        validarFormulario: jest.fn(() => true)
      } as any;

      component.tercerospage = {
        validarFormulario: jest.fn(() => true)
      } as any;

      // Act
      const result = component.validarFormularios();

      // Assert
      expect(result).toBe(true);
    });
  });

  it('debe actualizar el índice al seleccionar una pestaña', () => {
    expect(component.indice).toBe(1);
    component.seleccionaTab(3);
    expect(component.indice).toBe(3);
  });

  it('debe llamar next y complete en destroyNotifier$ al ejecutar ngOnDestroy', () => {
    const nextSpy = jest.spyOn((component as any).destroyNotifier$, 'next');
    const completeSpy = jest.spyOn((component as any).destroyNotifier$, 'complete');

    component.ngOnDestroy();

    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});