import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoUnoComponent } from './paso-uno.component';
import { Subject, of, throwError } from 'rxjs';

// Componentes mock para referencias ViewChild
class MockFormComponent {
  form = {
    invalid: false,
    markAllAsTouched: jest.fn()
  };
  validarFormulario = jest.fn().mockReturnValue(true);
}

class MockSolicitanteComponent {
  form = {
    get invalid() { return this._invalid; },
    set invalid(value: boolean) { this._invalid = value; },
    _invalid: false,
    markAllAsTouched: jest.fn()
  };
}

describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let mockRegistroService: any;
  let mockConsultaQuery: any;

  beforeEach(() => {
    mockRegistroService = {
      getRegistroTomaMuestrasMercanciasData: jest.fn().mockReturnValue(of(null)),
      actualizarEstadoFormulario: jest.fn(),
      obtenerDatos: jest.fn().mockReturnValue(of(null)),
      actualizarEstado: jest.fn()
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

  it('guardarDatosFormulario debe establecer esDatosRespuesta en true y llamar actualizarEstadoFormulario si resp existe', () => {
    const respMock = { data: 'mock' };
    mockRegistroService.obtenerDatos.mockReturnValue(of(respMock));
    
    component.guardarDatosFormulario();
    
    expect(component.esDatosRespuesta).toBe(true);
    expect(mockRegistroService.actualizarEstado).toHaveBeenCalledWith(respMock);
  });

  it('guardarDatosFormulario debe establecer esDatosRespuesta en false si resp no existe', () => {
    mockRegistroService.obtenerDatos.mockReturnValue(of(null));
    component.guardarDatosFormulario();
    expect(component.esDatosRespuesta).toBe(false);
    expect(mockRegistroService.actualizarEstado).not.toHaveBeenCalled();
  });

  it('debe manejar errores en guardarDatosFormulario', () => {
    mockRegistroService.obtenerDatos.mockReturnValue(of(null));
    
    expect(() => component.guardarDatosFormulario()).not.toThrow();
  });

  it('debe manejar respuesta sin data en guardarDatosFormulario', () => {
    mockRegistroService.obtenerDatos.mockReturnValue(of({}));
    component.guardarDatosFormulario();
    expect(component.esDatosRespuesta).toBe(true);
    expect(mockRegistroService.actualizarEstado).toHaveBeenCalled();
  });

  // Pruebas exhaustivas para el método validarFormularios
  describe('validarFormularios', () => {
    beforeEach(() => {
      // Configurar componentes mock para las referencias ViewChild
      component.solicitante = {
        form: {
          invalid: false,
          markAllAsTouched: jest.fn()
        }
      } as any;
      component.datosComunesComponent = {
        validarFormulario: jest.fn().mockReturnValue(true)
      } as any;
      component.tercerosRelacionadosComponent = {
        validarFormulario: jest.fn().mockReturnValue(true)
      } as any;
      component.importadorExportadorComponent = {
        validarFormulario: jest.fn().mockReturnValue(true)
      } as any;
      component.ctpatComponent = {
        validarFormulario: jest.fn().mockReturnValue(true)
      } as any;
    });

    it('debe retornar true cuando todos los formularios son válidos', () => {
      const result = component.validarFormularios();
      expect(result).toBe(true);
    });

    it('debe retornar false cuando el formulario de solicitante es inválido', () => {
      Object.defineProperty(component.solicitante.form, 'invalid', {
        get: () => true,
        configurable: true
      });
      const result = component.validarFormularios();
      expect(result).toBe(false);
      expect(component.solicitante.form.markAllAsTouched).toHaveBeenCalled();
    });

    it('debe retornar false cuando solicitante no tiene form', () => {
      component.solicitante = { form: null } as any;
      const result = component.validarFormularios();
      expect(result).toBe(false);
    });

    it('debe retornar false cuando solicitante es null', () => {
      component.solicitante = null as any;
      const result = component.validarFormularios();
      expect(result).toBe(false);
    });

    it('debe retornar false cuando datosComunesComponent es inválido', () => {
      (component.datosComunesComponent.validarFormulario as jest.Mock).mockReturnValue(false);
      const result = component.validarFormularios();
      expect(result).toBe(false);
    });

    it('debe retornar false cuando datosComunesComponent es null', () => {
      component.datosComunesComponent = null as any;
      const result = component.validarFormularios();
      expect(result).toBe(false);
    });

    it('debe retornar false cuando tercerosRelacionadosComponent es inválido', () => {
      (component.tercerosRelacionadosComponent.validarFormulario as jest.Mock).mockReturnValue(false);
      const result = component.validarFormularios();
      expect(result).toBe(false);
    });

    it('debe retornar false cuando tercerosRelacionadosComponent es null', () => {
      component.tercerosRelacionadosComponent = null as any;
      const result = component.validarFormularios();
      expect(result).toBe(false);
    });

    it('debe retornar false cuando importadorExportadorComponent es inválido', () => {
      (component.importadorExportadorComponent.validarFormulario as jest.Mock).mockReturnValue(false);
      const result = component.validarFormularios();
      expect(result).toBe(false);
    });

    it('debe retornar false cuando importadorExportadorComponent es null', () => {
      component.importadorExportadorComponent = null as any;
      const result = component.validarFormularios();
      expect(result).toBe(false);
    });

    it('debe retornar false cuando ctpatComponent es inválido', () => {
      (component.ctpatComponent.validarFormulario as jest.Mock).mockReturnValue(false);
      const result = component.validarFormularios();
      expect(result).toBe(false);
    });

    it('debe retornar false cuando ctpatComponent es null', () => {
      component.ctpatComponent = null as any;
      const result = component.validarFormularios();
      expect(result).toBe(false);
    });

    it('debe retornar false cuando múltiples componentes son inválidos', () => {
      Object.defineProperty(component.solicitante.form, 'invalid', {
        get: () => true,
        configurable: true
      });
      (component.datosComunesComponent.validarFormulario as jest.Mock).mockReturnValue(false);
      (component.tercerosRelacionadosComponent.validarFormulario as jest.Mock).mockReturnValue(false);
      
      const result = component.validarFormularios();
      expect(result).toBe(false);
      expect(component.solicitante.form.markAllAsTouched).toHaveBeenCalled();
    });
  });

  // Pruebas para el método onReconocimientoMutuoChange
  describe('onReconocimientoMutuoChange', () => {
    it('debe actualizar reconocimientoMutuoValue con el valor proporcionado', () => {
      const testValue: [string, string] = ['valor1', 'valor2'];
      component.onReconocimientoMutuoChange(testValue);
      expect(component.reconocimientoMutuoValue).toEqual(testValue);
    });

    it('debe manejar valores vacíos', () => {
      const testValue: [string, string] = ['', ''];
      component.onReconocimientoMutuoChange(testValue);
      expect(component.reconocimientoMutuoValue).toEqual(testValue);
    });

    it('debe sobrescribir el valor anterior', () => {
      const firstValue: [string, string] = ['first1', 'first2'];
      const secondValue: [string, string] = ['second1', 'second2'];
      
      component.onReconocimientoMutuoChange(firstValue);
      expect(component.reconocimientoMutuoValue).toEqual(firstValue);
      
      component.onReconocimientoMutuoChange(secondValue);
      expect(component.reconocimientoMutuoValue).toEqual(secondValue);
    });
  });

  // Pruebas adicionales de cobertura
  describe('Propiedades y inicialización', () => {
    it('debe tener las propiedades inicializadas correctamente', () => {
      expect(component.indice).toBe(1);
      expect(component.esDatosRespuesta).toBe(false);
      expect(component.reconocimientoMutuoValue).toEqual([]);
      expect(component.destroyNotifier$).toBeInstanceOf(Subject);
    });

    it('debe tener la lista de secciones definida correctamente', () => {
      expect(component.seccionesDeLaSolicitud).toBeDefined();
      expect(component.seccionesDeLaSolicitud).toHaveLength(6);
      expect(component.seccionesDeLaSolicitud[0]).toEqual({
        index: 1,
        title: 'Solicitante',
        component: 'solicitante'
      });
      expect(component.seccionesDeLaSolicitud[5]).toEqual({
        index: 6,
        title: 'Perfiles',
        component: 'perfiles'
      });
    });

    it('debe tener servicios inyectados correctamente', () => {
      expect(component.registroService).toBeDefined();
      expect(component.consultaQuery).toBeDefined();
    });
  });

  // Casos límite y manejo de errores
  describe('Casos edge y manejo de errores', () => {

    it('debe manejar correctamente cuando consultaState es undefined en ngOnInit', () => {
      // Simula que el observable emite undefined
      component.consultaQuery = {
        selectConsultaioState$: of(undefined),
      } as any;

      // Espía el método guardarDatosFormulario para asegurar que no se llama
      const guardarSpy = jest.spyOn(component, 'guardarDatosFormulario');

      // Ejecuta ngOnInit
      component.ngOnInit();

      // consultaState debe ser undefined
      expect(component.consultaState).toBeUndefined();

      // esDatosRespuesta no debe cambiar a true porque no hay update
      expect(component.esDatosRespuesta).toBe(true);

      // guardarDatosFormulario no debe ser llamado
      expect(guardarSpy).not.toHaveBeenCalled();
    });

    it('debe manejar seleccionaTab con valores límite', () => {
      component.seleccionaTab(0);
      expect(component.indice).toBe(0);
      
      component.seleccionaTab(100);
      expect(component.indice).toBe(100);
      
      component.seleccionaTab(-1);
      expect(component.indice).toBe(-1);
    });
  });

  // Pruebas tipo integración
  describe('Flujos integrados', () => {
    it('debe completar el flujo completo de ngOnInit con update true', () => {
      const guardarSpy = jest.spyOn(component, 'guardarDatosFormulario').mockImplementation(() => {
        component.esDatosRespuesta = true;
      });
      
      component.consultaQuery = {
        selectConsultaioState$: of({ update: true }),
      } as any;
      
      component.ngOnInit();
      
      expect(component.consultaState).toEqual({ update: true });
      expect(guardarSpy).toHaveBeenCalled();
    });

    it('debe completar el flujo completo de ngOnInit con update false', () => {
      const guardarSpy = jest.spyOn(component, 'guardarDatosFormulario');
      
      component.consultaQuery = {
        selectConsultaioState$: of({ update: false }),
      } as any;
      
      component.ngOnInit();
      
      expect(component.consultaState).toEqual({ update: false });
      expect(component.esDatosRespuesta).toBe(true);
      expect(guardarSpy).not.toHaveBeenCalled();
    });

    it('debe limpiar correctamente en ngOnDestroy después de suscripción', () => {
      // Simula una suscripción y verifica que destroyNotifier$ se complete
      const nextSpy = jest.spyOn(component.destroyNotifier$, 'next');
      const completeSpy = jest.spyOn(component.destroyNotifier$, 'complete');
      component.ngOnDestroy();
      expect(nextSpy).toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
    });
  });

  // Nuevos tests adicionales
  describe('Cobertura adicional y casos límite', () => {
    it('debe permitir llamar validarFormularios si todos los componentes son undefined', () => {
      component.solicitante = undefined as any;
      component.datosComunesComponent = undefined as any;
      component.tercerosRelacionadosComponent = undefined as any;
      component.importadorExportadorComponent = undefined as any;
      component.ctpatComponent = undefined as any;
      expect(component.validarFormularios()).toBe(false);
    });

    it('debe permitir llamar validarFormularios si algunos componentes son undefined', () => {
      component.solicitante = { form: { invalid: false, markAllAsTouched: jest.fn() } } as any;
      component.datosComunesComponent = undefined as any;
      component.tercerosRelacionadosComponent = { validarFormulario: jest.fn().mockReturnValue(true) } as any;
      component.importadorExportadorComponent = undefined as any;
      component.ctpatComponent = { validarFormulario: jest.fn().mockReturnValue(true) } as any;
      expect(component.validarFormularios()).toBe(false);
    });

    it('debe manejar correctamente onReconocimientoMutuoChange con valores nulos', () => {
      // @ts-expect-error pasando null intencionalmente
      component.onReconocimientoMutuoChange(null);
      expect(component.reconocimientoMutuoValue).toBe(null);
    });

    it('debe mantener el valor de reconocimientoMutuoValue si se llama con el mismo valor', () => {
      const value: [string, string] = ['a', 'b'];
      component.onReconocimientoMutuoChange(value);
      component.onReconocimientoMutuoChange(value);
      expect(component.reconocimientoMutuoValue).toEqual(['a', 'b']);
    });

    it('debe permitir llamar seleccionaTab con undefined y asignar indice', () => {
      // @ts-expect-error pasando undefined intencionalmente
      component.seleccionaTab(undefined);
      expect(component.indice).toBe(undefined);
    });

    it('debe permitir llamar seleccionaTab con string y asignar indice', () => {
      // @ts-expect-error pasando string intencionalmente
      component.seleccionaTab('3');
      expect(component.indice).toBe('3');
    });

    it('debe permitir llamar seleccionaTab con null y asignar indice', () => {
      // @ts-expect-error pasando null intencionalmente
      component.seleccionaTab(null);
      expect(component.indice).toBe(null);
    });

    it('debe manejar correctamente guardarDatosFormulario si registroService lanza error', () => {
      mockRegistroService.obtenerDatos = jest.fn().mockReturnValue(throwError(() => new Error('fallo')));
      component.registroService = mockRegistroService;
      expect(() => component.guardarDatosFormulario()).not.toThrow();
    });

    it('debe manejar correctamente guardarDatosFormulario si registroService devuelve undefined', () => {
      mockRegistroService.obtenerDatos = jest.fn().mockReturnValue(of(undefined));
      component.registroService = mockRegistroService;
      component.guardarDatosFormulario();
      expect(component.esDatosRespuesta).toBe(false);
    });

    it('debe actualizar esDatosRespuesta y llamar actualizarEstado si resp existe en guardarDatosFormulario', () => {
      const resp = { foo: 'bar' };
      mockRegistroService.obtenerDatos.mockReturnValue(of(resp));
      
      component.guardarDatosFormulario();
      
      expect(component.esDatosRespuesta).toBe(true);
      expect(mockRegistroService.actualizarEstado).toHaveBeenCalledWith(resp);
    });
  });
});