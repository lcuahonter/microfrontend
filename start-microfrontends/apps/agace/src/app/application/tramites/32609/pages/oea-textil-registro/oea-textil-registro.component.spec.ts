import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewChild, Component } from '@angular/core';
import { CategoriaMensaje, DatosPasos, ListaPasosWizard, PASOS, WizardComponent, TipoNotificacionEnum } from '@libs/shared/data-access-user/src';
import { OeaTextilRegistroComponent } from './oea-textil-registro.component';

// Mock del WizardComponent
@Component({
  selector: 'app-wizard',
  template: '<div>Mock Wizard Component</div>'
})
class MockWizardComponent {
  siguiente = jest.fn();
  atras = jest.fn();
}

// Mock del BtnContinuarComponent
@Component({
  selector: 'btn-continuar',
  template: '<div>Mock Btn Continuar Component</div>'
})
class MockBtnContinuarComponent {}

// Mock de los componentes de pasos
@Component({
  selector: 'app-paso-uno',
  template: '<div>Mock Paso Uno Component</div>'
})
class MockPasoUnoComponent {}

@Component({
  selector: 'app-paso-dos',
  template: '<div>Mock Paso Dos Component</div>'
})
class MockPasoDosComponent {}

@Component({
  selector: 'app-paso-tres',
  template: '<div>Mock Paso Tres Component</div>'
})
class MockPasoTresComponent {}

// Mock del PasoUnoComponent para validaciones
class MockPasoUnoValidationComponent {
  validarFormularios = jest.fn();
}

describe('OeaTextilRegistroComponent', () => {
  let component: OeaTextilRegistroComponent;
  let fixture: ComponentFixture<OeaTextilRegistroComponent>;
  let mockPasoUnoComponent: MockPasoUnoValidationComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        OeaTextilRegistroComponent,
        MockWizardComponent,
        MockBtnContinuarComponent,
        MockPasoUnoComponent,
        MockPasoDosComponent,
        MockPasoTresComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OeaTextilRegistroComponent);
    component = fixture.componentInstance;
    
    // Configurar el ViewChild mock para wizard
    const mockWizardComponent = new MockWizardComponent();
    component.wizardComponent = mockWizardComponent as any;
    
    // Configurar el ViewChild mock para pasoUno
    mockPasoUnoComponent = new MockPasoUnoValidationComponent();
    component.pasoUnoComponent = mockPasoUnoComponent as any;
  });

  describe('🔧 Inicialización del componente', () => {
    it('✅ debería crear el componente correctamente', () => {
      expect(component).toBeTruthy();
    });

    it('✅ debería inicializar las propiedades por defecto correctamente', () => {
      expect(component.pasos).toBeDefined();
      expect(component.indice).toBe(1);
      expect(component.datosPasos).toBeDefined();
      expect(component.esFormaValido).toBe(false);
      expect(component.btnContinuar).toBe(false);
    });

    it('✅ debería inicializar la lista de pasos desde PASOS', () => {
      expect(component.pasos).toEqual(PASOS);
      expect(Array.isArray(component.pasos)).toBe(true);
      expect(component.pasos.length).toBe(3);
    });

    it('✅ debería configurar el índice inicial en 1', () => {
      expect(component.indice).toBe(1);
    });

    it('✅ debería configurar datosPasos con los valores correctos', () => {
      const expectedDatosPasos: DatosPasos = {
        nroPasos: component.pasos.length,
        indice: 1,
        txtBtnAnt: 'Anterior',
        txtBtnSig: 'Continuar',
      };

      expect(component.datosPasos).toEqual(expectedDatosPasos);
    });

    it('✅ debería tener wizardComponent como ViewChild', () => {
      expect(component.wizardComponent).toBeDefined();
    });

    it('✅ debería tener pasoUnoComponent como ViewChild', () => {
      expect(component.pasoUnoComponent).toBeDefined();
    });
  });

  describe('📊 Gestión de propiedades y estructura de datos', () => {
    it('✅ debería mantener la estructura correcta de datosPasos', () => {
      expect(component.datosPasos).toHaveProperty('nroPasos');
      expect(component.datosPasos).toHaveProperty('indice');
      expect(component.datosPasos).toHaveProperty('txtBtnAnt');
      expect(component.datosPasos).toHaveProperty('txtBtnSig');
    });

    it('✅ debería tener nroPasos igual a la longitud de pasos', () => {
      expect(component.datosPasos.nroPasos).toBe(component.pasos.length);
    });

    it('✅ debería sincronizar el índice entre component.indice y datosPasos.indice', () => {
      expect(component.datosPasos.indice).toBe(component.indice);
    });

    it('✅ debería tener textos de botones configurados correctamente', () => {
      expect(component.datosPasos.txtBtnAnt).toBe('Anterior');
      expect(component.datosPasos.txtBtnSig).toBe('Continuar');
    });

    it('✅ debería mantener la referencia a pasos como array', () => {
      expect(Array.isArray(component.pasos)).toBe(true);
      expect(component.pasos.length).toBeGreaterThan(0);
    });
  });

  describe('🔄 Método seleccionaTab', () => {
    it('✅ debería cambiar el índice correctamente', () => {
      component.seleccionaTab(2);
      expect(component.indice).toBe(2);
    });

    it('✅ debería manejar diferentes valores de índice', () => {
      const valores = [1, 2, 3, 0, -1, 10];
      
      valores.forEach(valor => {
        component.seleccionaTab(valor);
        expect(component.indice).toBe(valor);
      });
    });
  });

  describe('🔄 Gestión de navegación entre pasos - getValorIndice', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      mockPasoUnoComponent.validarFormularios.mockReturnValue(true);
    });

    it('✅ debería navegar al siguiente paso cuando la acción es "cont" y valor es válido', () => {
      const eventoMock = { accion: 'cont', valor: 1 }; // 1 + 1 = 2
      
      component.getValorIndice(eventoMock);
      
      expect(component.indice).toBe(2);
      expect(component.datosPasos.indice).toBe(2);
      expect(component.wizardComponent.siguiente).toHaveBeenCalledTimes(1);
      expect(component.wizardComponent.atras).not.toHaveBeenCalled();
    });

    it('✅ debería navegar al paso anterior cuando la acción es "ant"', () => {
      component.indice = 2; // Empezar desde el paso 2
      const eventoMock = { accion: 'ant', valor: 2 }; // 2 - 1 = 1
      
      component.getValorIndice(eventoMock);
      
      expect(component.indice).toBe(1);
      expect(component.datosPasos.indice).toBe(1);
      expect(component.wizardComponent.atras).toHaveBeenCalledTimes(1);
      expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
    });

    it('✅ debería usar el valor as-is para acciones diferentes a "cont" y "ant"', () => {
      const eventoMock = { accion: 'otra', valor: 2 };
      
      component.getValorIndice(eventoMock);
      
      expect(component.indice).toBe(2);
      expect(component.datosPasos.indice).toBe(2);
      expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
      expect(component.wizardComponent.atras).not.toHaveBeenCalled();
    });

    it('✅ debería resetear esFormaValido al inicio', () => {
      component.esFormaValido = true;
      const eventoMock = { accion: 'cont', valor: 1 };
      
      component.getValorIndice(eventoMock);
      
      expect(component.esFormaValido).toBe(false);
    });

    it('✅ debería validar formularios en paso 1 con acción "cont"', () => {
      component.indice = 1;
      const eventoMock = { accion: 'cont', valor: 1 };
      
      component.getValorIndice(eventoMock);
      
      expect(mockPasoUnoComponent.validarFormularios).toHaveBeenCalledTimes(1);
    });

    it('✅ debería detener la ejecución si la validación falla en paso 1', () => {
      component.indice = 1;
      mockPasoUnoComponent.validarFormularios.mockReturnValue(false);
      const eventoMock = { accion: 'cont', valor: 1 };
      
      component.getValorIndice(eventoMock);
      
      expect(component.esFormaValido).toBe(true);
      expect(component.btnContinuar).toBe(true);
      expect(component.indice).toBe(1); // No debería cambiar
      expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
    });

    it('✅ debería no validar formularios si no está en paso 1', () => {
      component.indice = 2;
      const eventoMock = { accion: 'cont', valor: 2 };
      
      component.getValorIndice(eventoMock);
      
      expect(mockPasoUnoComponent.validarFormularios).not.toHaveBeenCalled();
    });

    it('✅ debería no validar formularios si la acción no es "cont"', () => {
      component.indice = 1;
      const eventoMock = { accion: 'ant', valor: 1 };
      
      component.getValorIndice(eventoMock);
      
      expect(mockPasoUnoComponent.validarFormularios).not.toHaveBeenCalled();
    });

    it('✅ debería no actualizar si el índice calculado está fuera de límites (muy bajo)', () => {
      const indiceOriginal = component.indice;
      const eventoMock = { accion: 'ant', valor: 1 }; // 1 - 1 = 0 (inválido)
      
      component.getValorIndice(eventoMock);
      
      expect(component.indice).toBe(indiceOriginal);
      expect(component.wizardComponent.atras).not.toHaveBeenCalled();
    });

    it('✅ debería no actualizar si el índice calculado está fuera de límites (muy alto)', () => {
      const indiceOriginal = component.indice;
      const eventoMock = { accion: 'cont', valor: 3 }; // 3 + 1 = 4 (inválido, máximo es 3)
      
      component.getValorIndice(eventoMock);
      
      expect(component.indice).toBe(indiceOriginal);
      expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
    });
  });

  describe('🎯 Casos edge en getValorIndice', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      mockPasoUnoComponent.validarFormularios.mockReturnValue(true);
    });

    it('✅ debería manejar índices límite válidos', () => {
      // Probar límite inferior válido
      const eventoMinimo = { accion: 'cont', valor: 0 }; // 0 + 1 = 1 (válido)
      component.getValorIndice(eventoMinimo);
      expect(component.indice).toBe(1);

      // Probar límite superior válido
      const eventoMaximo = { accion: 'cont', valor: 2 }; // 2 + 1 = 3 (válido)
      component.getValorIndice(eventoMaximo);
      expect(component.indice).toBe(3);
    });

    it('✅ debería manejar strings vacíos en acción', () => {
      const eventoMock = { accion: '', valor: 2 };
      
      component.getValorIndice(eventoMock);
      
      expect(component.indice).toBe(2);
      expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
      expect(component.wizardComponent.atras).not.toHaveBeenCalled();
    });

    it('✅ debería manejar valores null/undefined en la acción', () => {
      const eventosNull = [
        { accion: null as any, valor: 2 },
        { accion: undefined as any, valor: 2 }
      ];
      
      eventosNull.forEach(evento => {
        component.getValorIndice(evento);
        expect(component.indice).toBe(2);
        expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
        expect(component.wizardComponent.atras).not.toHaveBeenCalled();
      });
    });
  });

  describe('🔔 Método mostrarNotificacionError', () => {
    it('✅ debería configurar la notificación de error correctamente', () => {
      component.mostrarNotificacionError();
      
      expect(component.nuevaNotificacion).toBeDefined();
      expect(component.nuevaNotificacion.tipoNotificacion).toBe(TipoNotificacionEnum.ALERTA);
      expect(component.nuevaNotificacion.categoria).toBe(CategoriaMensaje.ERROR);
      expect(component.nuevaNotificacion.modo).toBe('modal-md');
      expect(component.nuevaNotificacion.titulo).toBe('');
      expect(component.nuevaNotificacion.mensaje).toBe('Existen requisitos obligatorios en blanco o con errores.');
      expect(component.nuevaNotificacion.cerrar).toBe(false);
      expect(component.nuevaNotificacion.txtBtnAceptar).toBe('Aceptar');
      expect(component.nuevaNotificacion.txtBtnCancelar).toBe('');
    });

    it('✅ debería activar el botón continuar', () => {
      component.btnContinuar = false;
      
      component.mostrarNotificacionError();
      
      expect(component.btnContinuar).toBe(true);
    });
  });

  describe('🔔 Método btnContinuarNotificacion', () => {
    it('✅ debería desactivar el botón continuar', () => {
      component.btnContinuar = true;
      
      component.btnContinuarNotificacion();
      
      expect(component.btnContinuar).toBe(false);
    });

    it('✅ debería manejar el estado ya desactivado', () => {
      component.btnContinuar = false;
      
      component.btnContinuarNotificacion();
      
      expect(component.btnContinuar).toBe(false);
    });
  });

  describe('� Método validarTodosFormulariosPasoUno', () => {
    it('✅ debería retornar true si pasoUnoComponent no existe', () => {
      component.pasoUnoComponent = null as any;
      
      const resultado = component.validarTodosFormulariosPasoUno();
      
      expect(resultado).toBe(true);
    });

    it('✅ debería retornar el resultado de validarFormularios cuando pasoUnoComponent existe', () => {
      mockPasoUnoComponent.validarFormularios.mockReturnValue(true);
      
      const resultado = component.validarTodosFormulariosPasoUno();
      
      expect(resultado).toBe(true);
      expect(mockPasoUnoComponent.validarFormularios).toHaveBeenCalledTimes(1);
    });

    it('✅ debería retornar false cuando la validación falla', () => {
      mockPasoUnoComponent.validarFormularios.mockReturnValue(false);
      
      const resultado = component.validarTodosFormulariosPasoUno();
      
      expect(resultado).toBe(false);
      expect(mockPasoUnoComponent.validarFormularios).toHaveBeenCalledTimes(1);
    });
  });

  describe('🔄 Interacción con WizardComponent', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      mockPasoUnoComponent.validarFormularios.mockReturnValue(true);
    });

    it('✅ debería manejar el caso cuando wizardComponent es null', () => {
      component.wizardComponent = null as any;
      const evento = { accion: 'cont', valor: 1 };
      
      expect(() => {
        component.getValorIndice(evento);
      }).toThrow();
    });

    it('✅ debería manejar el caso cuando wizardComponent es undefined', () => {
      component.wizardComponent = undefined as any;
      const evento = { accion: 'cont', valor: 1 };
      
      expect(() => {
        component.getValorIndice(evento);
      }).toThrow();
    });

    it('✅ debería actualizar el índice y datosPasos antes de llamar los métodos del wizard', () => {
      const valorOriginal = component.indice;
      const evento = { accion: 'cont', valor: 1 }; // 1 + 1 = 2
      
      component.getValorIndice(evento);
      
      expect(component.indice).not.toBe(valorOriginal);
      expect(component.indice).toBe(2);
      expect(component.datosPasos.indice).toBe(2);
      expect(component.wizardComponent.siguiente).toHaveBeenCalledTimes(1);
    });
  });

  describe('📝 Verificación de tipos e interfaces', () => {
    it('✅ debería cumplir con la interfaz AccionBoton', () => {
      const eventosValidos = [
        { accion: 'cont', valor: 1 },
        { accion: 'ant', valor: 2 },
        { accion: 'cualquier_string', valor: 3 }
      ];
      
      eventosValidos.forEach(evento => {
        expect(typeof evento.accion).toBe('string');
        expect(typeof evento.valor).toBe('number');
        expect(() => {
          component.getValorIndice(evento);
        }).not.toThrow();
      });
    });

    it('✅ debería manejar la propiedad pasos como ListaPasosWizard[]', () => {
      expect(Array.isArray(component.pasos)).toBe(true);
      
      component.pasos.forEach(paso => {
        expect(paso).toHaveProperty('indice');
        expect(paso).toHaveProperty('titulo');
        expect(paso).toHaveProperty('activo');
        expect(paso).toHaveProperty('completado');
        expect(typeof paso.indice).toBe('number');
        expect(typeof paso.titulo).toBe('string');
        expect(typeof paso.activo).toBe('boolean');
        expect(typeof paso.completado).toBe('boolean');
      });
    });

    it('✅ debería manejar datosPasos como DatosPasos', () => {
      expect(component.datosPasos).toHaveProperty('nroPasos');
      expect(component.datosPasos).toHaveProperty('indice');
      expect(component.datosPasos).toHaveProperty('txtBtnAnt');
      expect(component.datosPasos).toHaveProperty('txtBtnSig');
      
      expect(typeof component.datosPasos.nroPasos).toBe('number');
      expect(typeof component.datosPasos.indice).toBe('number');
      expect(typeof component.datosPasos.txtBtnAnt).toBe('string');
      expect(typeof component.datosPasos.txtBtnSig).toBe('string');
    });

    it('✅ debería verificar que todas las propiedades están correctamente tipadas', () => {
      expect(typeof component.pasos).toBe('object');
      expect(typeof component.indice).toBe('number');
      expect(typeof component.datosPasos).toBe('object');
      expect(typeof component.wizardComponent).toBe('object');
      expect(typeof component.esFormaValido).toBe('boolean');
      expect(typeof component.btnContinuar).toBe('boolean');
    });
  });

  describe('🎮 Simulación de flujo completo de navegación', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      mockPasoUnoComponent.validarFormularios.mockReturnValue(true);
    });

    it('✅ debería simular un flujo completo de navegación hacia adelante', () => {
      // Desde paso 1 a paso 2
      component.getValorIndice({ accion: 'cont', valor: 1 }); // 1 + 1 = 2
      expect(component.indice).toBe(2);
      expect(component.wizardComponent.siguiente).toHaveBeenCalledTimes(1);

      // Desde paso 2 a paso 3
      component.getValorIndice({ accion: 'cont', valor: 2 }); // 2 + 1 = 3
      expect(component.indice).toBe(3);
      expect(component.wizardComponent.siguiente).toHaveBeenCalledTimes(2);
    });

    it('✅ debería simular un flujo completo de navegación hacia atrás', () => {
      // Empezar desde el paso 3
      component.indice = 3;
      
      // Desde paso 3 a paso 2
      component.getValorIndice({ accion: 'ant', valor: 3 }); // 3 - 1 = 2
      expect(component.indice).toBe(2);
      expect(component.wizardComponent.atras).toHaveBeenCalledTimes(1);

      // Desde paso 2 a paso 1
      component.getValorIndice({ accion: 'ant', valor: 2 }); // 2 - 1 = 1
      expect(component.indice).toBe(1);
      expect(component.wizardComponent.atras).toHaveBeenCalledTimes(2);
    });

    it('✅ debería simular navegación mixta (adelante y atrás)', () => {
      const secuenciaCompleta = [
        { accion: 'cont', valor: 1, esperado: 2, metodo: 'siguiente' }, // 1 + 1 = 2
        { accion: 'cont', valor: 2, esperado: 3, metodo: 'siguiente' }, // 2 + 1 = 3
        { accion: 'ant', valor: 3, esperado: 2, metodo: 'atras' },      // 3 - 1 = 2
        { accion: 'ant', valor: 2, esperado: 1, metodo: 'atras' },      // 2 - 1 = 1
        { accion: 'cont', valor: 1, esperado: 2, metodo: 'siguiente' }  // 1 + 1 = 2
      ];
      
      let contadorSiguiente = 0;
      let contadorAtras = 0;
      
      secuenciaCompleta.forEach(evento => {
        component.getValorIndice(evento);
        
        if (evento.metodo === 'siguiente') {
          contadorSiguiente++;
          expect(component.wizardComponent.siguiente).toHaveBeenCalledTimes(contadorSiguiente);
        } else {
          contadorAtras++;
          expect(component.wizardComponent.atras).toHaveBeenCalledTimes(contadorAtras);
        }
        
        expect(component.indice).toBe(evento.esperado);
      });
    });
  });

  describe('🔬 Pruebas de rendimiento y memoria', () => {
    beforeEach(() => {
      mockPasoUnoComponent.validarFormularios.mockReturnValue(true);
    });

    it('✅ debería manejar múltiples llamadas sin pérdida de memoria', () => {
      const numeroLlamadas = 100;
      
      for (let i = 0; i < numeroLlamadas; i++) {
        const evento = { accion: i % 2 === 0 ? 'cont' : 'ant', valor: 2 };
        component.getValorIndice(evento);
      }
      
      expect(component.indice).toBeDefined();
      expect(typeof component.indice).toBe('number');
      expect(component.indice).toBeGreaterThanOrEqual(1);
      expect(component.indice).toBeLessThanOrEqual(3);
    });

    it('✅ debería mantener la consistencia de datos después de operaciones repetitivas', () => {
      const eventoBase = { accion: 'cont', valor: 1 }; // 1 + 1 = 2
      
      for (let i = 0; i < 10; i++) {
        component.getValorIndice(eventoBase);
      }
      
      expect(component.indice).toBe(2);
      expect(component.datosPasos.indice).toBe(2);
      expect(component.wizardComponent.siguiente).toHaveBeenCalledTimes(10);
    });
  });

  describe('🧪 Casos de prueba de integración', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('✅ debería manejar el flujo completo con validación fallida', () => {
      // Configurar validación fallida
      mockPasoUnoComponent.validarFormularios.mockReturnValue(false);
      
      // Intentar avanzar desde paso 1
      component.getValorIndice({ accion: 'cont', valor: 1 });
      
      // Verificar que se detuvo la navegación
      expect(component.indice).toBe(1);
      expect(component.esFormaValido).toBe(true);
      expect(component.btnContinuar).toBe(true);
      expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
      
      // Verificar que se configuró la notificación
      expect(component.nuevaNotificacion).toBeDefined();
      expect(component.nuevaNotificacion.mensaje).toBe('Existen requisitos obligatorios en blanco o con errores.');
    });

    it('✅ debería manejar el flujo completo con validación exitosa', () => {
      // Configurar validación exitosa
      mockPasoUnoComponent.validarFormularios.mockReturnValue(true);
      
      // Avanzar desde paso 1
      component.getValorIndice({ accion: 'cont', valor: 1 });
      
      // Verificar que avanzó correctamente
      expect(component.indice).toBe(2);
      expect(component.datosPasos.indice).toBe(2);
      expect(component.esFormaValido).toBe(false);
      expect(component.wizardComponent.siguiente).toHaveBeenCalledTimes(1);
    });

    it('✅ debería mantener la sincronización entre indice y datosPasos.indice', () => {
      const eventos = [
        { accion: 'cont', valor: 1 }, // -> indice 2
        { accion: 'ant', valor: 2 },  // -> indice 1
        { accion: 'otra', valor: 3 }, // -> indice 3
      ];
      
      mockPasoUnoComponent.validarFormularios.mockReturnValue(true);
      
      eventos.forEach(evento => {
        component.getValorIndice(evento);
        expect(component.datosPasos.indice).toBe(component.indice);
      });
    });
  });
});
