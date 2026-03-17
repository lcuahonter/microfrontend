import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewChild, Component } from '@angular/core';
import { DatosPasos, ListaPasosWizard, PASOS, WizardComponent, TipoNotificacionEnum, CategoriaMensaje } from '@libs/shared/data-access-user/src';
import { OeaTercerizacionLogisticaRegistroComponent } from './oea-tercerizacion-logistica-registro.component';

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

// Mock del PasoUnoComponent con método de validación
@Component({
  selector: 'app-paso-uno',
  template: '<div>Mock Paso Uno Component</div>'
})
class MockPasoUnoComponent {
  validarFormularios = jest.fn();
}

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

describe('OeaTercerizacionLogisticaRegistroComponent', () => {
  let component: OeaTercerizacionLogisticaRegistroComponent;
  let fixture: ComponentFixture<OeaTercerizacionLogisticaRegistroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        OeaTercerizacionLogisticaRegistroComponent,
        MockWizardComponent,
        MockBtnContinuarComponent,
        MockPasoUnoComponent,
        MockPasoDosComponent,
        MockPasoTresComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OeaTercerizacionLogisticaRegistroComponent);
    component = fixture.componentInstance;
    
    // Configurar el ViewChild mock
    const mockWizardComponent = new MockWizardComponent();
    component.wizardComponent = mockWizardComponent as any;
    
    // Configurar el mock del PasoUnoComponent    
    const mockPasoUnoComponent = new MockPasoUnoComponent();
    component.pasoUnoComponent = mockPasoUnoComponent as any;
    
    // Restablecer comportamiento predeterminado de los mocks
    jest.clearAllMocks();
  });

  describe('Inicialización del componente', () => {
    it('debería crear el componente correctamente', () => {
      expect(component).toBeTruthy();
    });

    it('debería inicializar las propiedades por defecto correctos', () => {
      expect(component.pasos).toBeDefined();
      expect(component.indice).toBe(1);
      expect(component.datosPasos).toBeDefined();
    });

    it('debería inicializar la lista de pasos desde PASOS', () => {
      expect(component.pasos).toEqual(PASOS);
      expect(Array.isArray(component.pasos)).toBe(true);
      expect(component.pasos.length).toBeGreaterThan(0);
    });

    it('debería configurar datosPasos con valores iniciales correctos', () => {
      expect(component.datosPasos.nroPasos).toBe(PASOS.length);
      expect(component.datosPasos.indice).toBe(1);
      expect(component.datosPasos.txtBtnAnt).toBe('Anterior');
      expect(component.datosPasos.txtBtnSig).toBe('Continuar');
    });
  });

  describe('Pruebas de la función getValorIndice', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('debería aumentar el índice en 1 cuando accion es "cont"', () => {
      const valorInicial = 1;
      const evento = { accion: 'cont', valor: valorInicial };
      
      // Simular validación para retornar true en paso 1
      jest.spyOn(component.pasoUnoComponent, 'validarFormularios').mockReturnValue(true);
      
      component.getValorIndice(evento);
      
      expect(component.indice).toBe(valorInicial + 1);
    });

    it('debería disminuir el índice en 1 cuando accion es "ant"', () => {
      const valorInicial = 3;
      const evento = { accion: 'ant', valor: valorInicial };
      
      component.getValorIndice(evento);
      
      expect(component.indice).toBe(valorInicial - 1);
    });

    it('debería mantener el índice igual cuando accion es diferente de "cont" y "ant"', () => {
      const valorInicial = 2;
      const evento = { accion: 'cualquier_otro', valor: valorInicial };
      
      component.getValorIndice(evento);
      
      expect(component.indice).toBe(valorInicial);
    });

    it('debería llamar método siguiente() cuando accion es "cont"', () => {
      const evento = { accion: 'cont', valor: 1 };
      
      // Simular validación para retornar true en paso 1
      jest.spyOn(component.pasoUnoComponent, 'validarFormularios').mockReturnValue(true);
      
      component.getValorIndice(evento);
      
      expect(component.wizardComponent.siguiente).toHaveBeenCalledTimes(1);
    });

    it('debería llamar método atras() cuando accion es "ant"', () => {
      const evento = { accion: 'ant', valor: 2 };
      
      component.getValorIndice(evento);
      
      expect(component.wizardComponent.atras).toHaveBeenCalledTimes(1);
    });

    it('no debería llamar ningún método cuando accion es diferente', () => {
      const evento = { accion: 'otra_accion', valor: 2 };
      
      component.getValorIndice(evento);
      
      expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
      expect(component.wizardComponent.atras).not.toHaveBeenCalled();
    });
  });

  describe('Interacción con WizardComponent', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('debería actualizar el índice antes de llamar los métodos del wizard', () => {
      const valorOriginal = component.indice;
      const nuevoValor = 1;
      const evento = { accion: 'cont', valor: nuevoValor };
      
      // Simular validación para retornar true en paso 1
      jest.spyOn(component.pasoUnoComponent, 'validarFormularios').mockReturnValue(true);
      
      component.getValorIndice(evento);
      
      expect(component.indice).not.toBe(valorOriginal);
      expect(component.indice).toBe(nuevoValor + 1);
      expect(component.wizardComponent.siguiente).toHaveBeenCalledTimes(1);
    });
  });

  describe('Verificación de tipos e interfaces', () => {
    it('debería cumplir con la interfaz AccionBoton', () => {
      const eventosValidos = [
        { accion: 'cont', valor: 1 },
        { accion: 'atras', valor: 2 },
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

    it('debería manejar datosPasos como DatosPasos', () => {
      expect(component.datosPasos).toHaveProperty('nroPasos');
      expect(component.datosPasos).toHaveProperty('indice');
      expect(component.datosPasos).toHaveProperty('txtBtnAnt');
      expect(component.datosPasos).toHaveProperty('txtBtnSig');
      
      expect(typeof component.datosPasos.nroPasos).toBe('number');
      expect(typeof component.datosPasos.indice).toBe('number');
      expect(typeof component.datosPasos.txtBtnAnt).toBe('string');
      expect(typeof component.datosPasos.txtBtnSig).toBe('string');
    });
  });

  describe('Casos de prueba adicionales para cobertura completa', () => {
    it('debería verificar que todas las propiedades están correctamente tipadas', () => {
      expect(typeof component.pasos).toBe('object');
      expect(typeof component.indice).toBe('number');
      expect(typeof component.datosPasos).toBe('object');
      expect(typeof component.wizardComponent).toBe('object');
    });

    it('debería verificar el estado inicial completo del componente', () => {
      const componenteNuevo = new OeaTercerizacionLogisticaRegistroComponent();

      expect(componenteNuevo.pasos).toEqual(PASOS);
      expect(componenteNuevo.indice).toBe(1);
      expect(componenteNuevo.datosPasos.nroPasos).toBe(PASOS.length);
      expect(componenteNuevo.datosPasos.indice).toBe(1);
      expect(componenteNuevo.datosPasos.txtBtnAnt).toBe('Anterior');
      expect(componenteNuevo.datosPasos.txtBtnSig).toBe('Continuar');
    });

    it('debería validar la lógica condicional en getValorIndice', () => {
      const eventoContinuar = { accion: 'cont', valor: 1 };
      const eventoAtras = { accion: 'ant', valor: 2 };
      
      // Mock validation to return true for step 1
      jest.spyOn(component.pasoUnoComponent, 'validarFormularios').mockReturnValue(true);
      
      component.getValorIndice(eventoContinuar);
      expect(component.wizardComponent.siguiente).toHaveBeenCalled();
      
      jest.clearAllMocks();
      
      component.getValorIndice(eventoAtras);
      expect(component.wizardComponent.atras).toHaveBeenCalled();
    });

    it('debería verificar que el operador ternario funciona correctamente', () => {
      const spySiguiente = jest.spyOn(component.wizardComponent, 'siguiente');
      const spyAtras = jest.spyOn(component.wizardComponent, 'atras');
      
      // Simular validación para retornar true en paso 1
      jest.spyOn(component.pasoUnoComponent, 'validarFormularios').mockReturnValue(true);
      
      component.getValorIndice({ accion: 'cont', valor: 1 });
      expect(spySiguiente).toHaveBeenCalled();
      expect(spyAtras).not.toHaveBeenCalled();
      
      jest.clearAllMocks();
      
      component.getValorIndice({ accion: 'ant', valor: 2 });
      expect(spyAtras).toHaveBeenCalled();
      expect(spySiguiente).not.toHaveBeenCalled();
      
      jest.clearAllMocks();
      
      component.getValorIndice({ accion: 'other', valor: 2 });
      expect(spySiguiente).not.toHaveBeenCalled();
      expect(spyAtras).not.toHaveBeenCalled();
    });
  });

  describe('Método seleccionaTab', () => {
    it('debería actualizar el índice correctamente', () => {
      const nuevoIndice = 3;
      
      component.seleccionaTab(nuevoIndice);
      
      expect(component.indice).toBe(nuevoIndice);
    });

    it('debería manejar diferentes valores de índice', () => {
      const valoresPrueba = [1, 2, 3, 4, 5];
      
      valoresPrueba.forEach(valor => {
        component.seleccionaTab(valor);
        expect(component.indice).toBe(valor);
      });
    });

    it('debería manejar valores extremos', () => {
      const valoresExtremos = [0, -1, 100, Number.MAX_SAFE_INTEGER];
      
      valoresExtremos.forEach(valor => {
        const indiceAnterior = component.indice;
        expect(() => {
          component.seleccionaTab(valor);
        }).not.toThrow();
        expect(component.indice).toBe(valor);
      });
    });
  });

  describe('Métodos de notificación', () => {
    describe('mostrarNotificacionError', () => {
      it('debería configurar la notificación de error correctamente', () => {
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

      it('debería activar el botón continuar', () => {
        component.btnContinuar = false;
        
        component.mostrarNotificacionError();
        
        expect(component.btnContinuar).toBe(true);
      });

      it('debería configurar la notificación múltiples veces sin errores', () => {
        expect(() => {
          component.mostrarNotificacionError();
          component.mostrarNotificacionError();
          component.mostrarNotificacionError();
        }).not.toThrow();
        
        expect(component.btnContinuar).toBe(true);
        expect(component.nuevaNotificacion).toBeDefined();
      });
    });

    describe('btnContinuarNotificacion', () => {
      it('debería desactivar el botón continuar', () => {
        component.btnContinuar = true;
        
        component.btnContinuarNotificacion();
        
        expect(component.btnContinuar).toBe(false);
      });

      it('debería manejar el estado cuando ya está desactivado', () => {
        component.btnContinuar = false;
        
        component.btnContinuarNotificacion();
        
        expect(component.btnContinuar).toBe(false);
      });

      it('debería poder ser llamado múltiples veces', () => {
        component.btnContinuar = true;
        
        expect(() => {
          component.btnContinuarNotificacion();
          component.btnContinuarNotificacion();
          component.btnContinuarNotificacion();
        }).not.toThrow();
        
        expect(component.btnContinuar).toBe(false);
      });
    });
  });

  describe('Validación de formularios', () => {
    describe('validarTodosFormulariosPasoUno', () => {
      beforeEach(() => {
        jest.clearAllMocks();
      });

      it('debería retornar true cuando pasoUnoComponent es válido', () => {
        jest.spyOn(component.pasoUnoComponent, 'validarFormularios').mockReturnValue(true);
        
        const resultado = component.validarTodosFormulariosPasoUno();
        
        expect(resultado).toBe(true);
        expect(component.pasoUnoComponent.validarFormularios).toHaveBeenCalledTimes(1);
      });

      it('debería retornar false cuando pasoUnoComponent es inválido', () => {
        jest.spyOn(component.pasoUnoComponent, 'validarFormularios').mockReturnValue(false);
        
        const resultado = component.validarTodosFormulariosPasoUno();
        
        expect(resultado).toBe(false);
        expect(component.pasoUnoComponent.validarFormularios).toHaveBeenCalledTimes(1);
      });

      it('debería retornar true cuando pasoUnoComponent es null', () => {
        component.pasoUnoComponent = null as any;
        
        const resultado = component.validarTodosFormulariosPasoUno();
        
        expect(resultado).toBe(true);
      });

      it('debería retornar true cuando pasoUnoComponent es undefined', () => {
        component.pasoUnoComponent = undefined as any;
        
        const resultado = component.validarTodosFormulariosPasoUno();
        
        expect(resultado).toBe(true);
      });

      it('debería manejar errores en validarFormularios', () => {
        jest.spyOn(component.pasoUnoComponent, 'validarFormularios').mockImplementation(() => {
          throw new Error('Error de validación');
        });
        
        expect(() => {
          component.validarTodosFormulariosPasoUno();
        }).toThrow('Error de validación');
      });
    });
  });

  describe('Casos avanzados de getValorIndice', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      component.esFormaValido = false;
      component.btnContinuar = false;
    });

    describe('Validación de formularios en paso 1', () => {
      it('debería validar formularios cuando está en paso 1 y acción es "cont"', () => {
        component.indice = 1;
        jest.spyOn(component.pasoUnoComponent, 'validarFormularios').mockReturnValue(true);
        const evento = { accion: 'cont', valor: 1 };
        
        component.getValorIndice(evento);
        
        expect(component.pasoUnoComponent.validarFormularios).toHaveBeenCalledTimes(1);
        expect(component.indice).toBe(2); // Se incrementa porque la validación pasa
        expect(component.wizardComponent.siguiente).toHaveBeenCalledTimes(1);
      });

      it('debería detener ejecución cuando formularios son inválidos en paso 1', () => {
        component.indice = 1;
        jest.spyOn(component.pasoUnoComponent, 'validarFormularios').mockReturnValue(false);
        const evento = { accion: 'cont', valor: 1 };
        const spyMostrarError = jest.spyOn(component, 'mostrarNotificacionError');
        
        component.getValorIndice(evento);
        
        expect(component.pasoUnoComponent.validarFormularios).toHaveBeenCalledTimes(1);
        expect(component.esFormaValido).toBe(true);
        expect(spyMostrarError).toHaveBeenCalledTimes(1);
        expect(component.indice).toBe(1); // No se incrementa
        expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
      });

      it('no debería validar formularios cuando no está en paso 1', () => {
        component.indice = 2;
        const evento = { accion: 'cont', valor: 2 };
        
        component.getValorIndice(evento);
        
        expect(component.pasoUnoComponent.validarFormularios).not.toHaveBeenCalled();
        expect(component.indice).toBe(3);
        expect(component.wizardComponent.siguiente).toHaveBeenCalledTimes(1);
      });

      it('no debería validar formularios cuando acción no es "cont"', () => {
        component.indice = 1;
        const evento = { accion: 'ant', valor: 1 };
        
        component.getValorIndice(evento);
        
        expect(component.pasoUnoComponent.validarFormularios).not.toHaveBeenCalled();
        expect(component.indice).toBe(1); // No changes as it would go to 0
        expect(component.wizardComponent.atras).not.toHaveBeenCalled(); // No será llamado debido a la verificación de límites
      });
    });

    describe('Validación de límites de índice', () => {
      it('no debería actualizar índice cuando nuevo valor es 0', () => {
        const indiceOriginal = component.indice;
        const evento = { accion: 'ant', valor: 1 };
        
        component.getValorIndice(evento);
        
        // El nuevo índice sería 0 (1-1), que no está permitido
        expect(component.indice).toBe(indiceOriginal);
        expect(component.wizardComponent.atras).not.toHaveBeenCalled();
      });

      it('no debería actualizar índice cuando nuevo valor excede pasos disponibles', () => {
        const indiceOriginal = component.indice;
        const evento = { accion: 'cont', valor: component.pasos.length };
        
        component.getValorIndice(evento);
        
        // El nuevo índice sería pasos.length + 1, que excede el límite
        expect(component.indice).toBe(indiceOriginal);
        expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
      });

      it('debería actualizar índice cuando está dentro de los límites válidos', () => {
        const valorValido = 1;
        const evento = { accion: 'cont', valor: valorValido };
        
        // Simular validación para retornar true en paso 1
        jest.spyOn(component.pasoUnoComponent, 'validarFormularios').mockReturnValue(true);
        
        component.getValorIndice(evento);
        
        expect(component.indice).toBe(valorValido + 1);
        expect(component.datosPasos.indice).toBe(valorValido + 1);
        expect(component.wizardComponent.siguiente).toHaveBeenCalledTimes(1);
      });

      it('debería manejar el valor límite superior válido', () => {
        // Establecer el índice del componente en 2 para evitar la lógica de validación del paso 1
        component.indice = 2;
        // Para un proceso de 3 pasos, el valor máximo válido es 2 (entonces valor + 1 = 3)
        const valorLimite = 2;
        const evento = { accion: 'cont', valor: valorLimite };
        
        component.getValorIndice(evento);
        
        expect(component.indice).toBe(component.pasos.length);
        expect(component.wizardComponent.siguiente).toHaveBeenCalledTimes(1);
      });

      it('debería manejar el valor límite inferior válido', () => {
        const evento = { accion: 'ant', valor: 2 };
        
        component.getValorIndice(evento);
        
        expect(component.indice).toBe(1);
        expect(component.wizardComponent.atras).toHaveBeenCalledTimes(1);
      });
    });

    describe('Actualización de datosPasos', () => {
      it('debería sincronizar datosPasos.indice con component.indice', () => {
        const evento = { accion: 'cont', valor: 1 };
        
        // Simular validación para retornar true en paso 1
        jest.spyOn(component.pasoUnoComponent, 'validarFormularios').mockReturnValue(true);
        
        component.getValorIndice(evento);
        
        expect(component.indice).toBe(component.datosPasos.indice);
        expect(component.datosPasos.indice).toBe(2);
      });

      it('debería mantener datosPasos.indice sin cambios cuando validación falla', () => {
        component.indice = 1;
        jest.spyOn(component.pasoUnoComponent, 'validarFormularios').mockReturnValue(false);
        const indiceOriginal = component.datosPasos.indice;
        const evento = { accion: 'cont', valor: 1 };
        
        component.getValorIndice(evento);
        
        expect(component.datosPasos.indice).toBe(indiceOriginal);
      });
    });

    describe('Flag esFormaValido', () => {
      it('debería resetear esFormaValido al inicio de cada llamada', () => {
        component.esFormaValido = true;
        const evento = { accion: 'ant', valor: 2 }; // Usar acción 'ant' para evitar la lógica de validación
        
        component.getValorIndice(evento);
        
        expect(component.esFormaValido).toBe(false);
      });

      it('debería establecer esFormaValido en true cuando validación falla', () => {
        component.indice = 1;
        jest.spyOn(component.pasoUnoComponent, 'validarFormularios').mockReturnValue(false);
        const evento = { accion: 'cont', valor: 1 };
        
        component.getValorIndice(evento);
        
        expect(component.esFormaValido).toBe(true);
      });
    });
  });

  describe('🎮 Flujos de integración completos', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('debería manejar flujo completo desde paso 1 con validación exitosa', () => {
      component.indice = 1;
      jest.spyOn(component.pasoUnoComponent, 'validarFormularios').mockReturnValue(true);
      const evento = { accion: 'cont', valor: 1 };
      
      component.getValorIndice(evento);
      
      expect(component.pasoUnoComponent.validarFormularios).toHaveBeenCalled();
      expect(component.esFormaValido).toBe(false);
      expect(component.indice).toBe(2);
      expect(component.datosPasos.indice).toBe(2);
      expect(component.wizardComponent.siguiente).toHaveBeenCalled();
    });

    it('debería manejar flujo completo desde paso 1 con validación fallida', () => {
      component.indice = 1;
      jest.spyOn(component.pasoUnoComponent, 'validarFormularios').mockReturnValue(false);
      const spyMostrarError = jest.spyOn(component, 'mostrarNotificacionError');
      const evento = { accion: 'cont', valor: 1 };
      
      component.getValorIndice(evento);
      
      expect(component.pasoUnoComponent.validarFormularios).toHaveBeenCalled();
      expect(component.esFormaValido).toBe(true);
      expect(spyMostrarError).toHaveBeenCalled();
      expect(component.btnContinuar).toBe(true);
      expect(component.indice).toBe(1);
      expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
    });

    it('debería manejar secuencia completa de notificación', () => {
      // Mostrar notificación
      component.mostrarNotificacionError();
      expect(component.btnContinuar).toBe(true);
      expect(component.nuevaNotificacion).toBeDefined();
      
      // Cerrar notificación
      component.btnContinuarNotificacion();
      expect(component.btnContinuar).toBe(false);
    });
  });
});

describe('Casos extremos y robustez', () => {
  let component: OeaTercerizacionLogisticaRegistroComponent;
  let fixture: ComponentFixture<OeaTercerizacionLogisticaRegistroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        OeaTercerizacionLogisticaRegistroComponent,
        MockWizardComponent,
        MockBtnContinuarComponent,
        MockPasoUnoComponent,
        MockPasoDosComponent,
        MockPasoTresComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OeaTercerizacionLogisticaRegistroComponent);
    component = fixture.componentInstance;
    
    const mockWizardComponent = new MockWizardComponent();
    component.wizardComponent = mockWizardComponent as any;
    
    const mockPasoUnoComponent = new MockPasoUnoComponent();
    component.pasoUnoComponent = mockPasoUnoComponent as any;
  });

  it('debería mantener estabilidad con operaciones múltiples y mixtas', () => {
    const operaciones = [
      () => component.seleccionaTab(2),
      () => component.getValorIndice({ accion: 'cont', valor: 2 }),
      () => component.mostrarNotificacionError(),
      () => component.btnContinuarNotificacion(),
      () => component.validarTodosFormulariosPasoUno(),
      () => component.seleccionaTab(1),
      () => component.getValorIndice({ accion: 'ant', valor: 2 })
    ];
    
    expect(() => {
      operaciones.forEach(op => op());
      operaciones.forEach(op => op());
      operaciones.forEach(op => op());
    }).not.toThrow();
    
    expect(component.indice).toBeDefined();
    expect(typeof component.indice).toBe('number');
  });
  
  it('debería verificar la inicialización de todas las propiedades', () => {
    expect(component.pasos).toBeDefined();
    expect(component.indice).toBeDefined();
    expect(component.datosPasos).toBeDefined();
    expect(component.esFormaValido).toBeDefined();
    expect(component.btnContinuar).toBeDefined();
    
    expect(component.esFormaValido).toBe(false);
    expect(component.btnContinuar).toBe(false);
  });
});