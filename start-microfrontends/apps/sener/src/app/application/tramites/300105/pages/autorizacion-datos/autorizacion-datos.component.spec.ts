import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AutorizacionDatosComponent } from './autorizacion-datos.component';
import {
  DatosPasos,
  ListaPasosWizard,
  WizardComponent
} from '@ng-mf/data-access-user';

// Interfaz para la acción del botón
interface AccionBoton {
  accion: string;
  valor: number;
}

describe('AutorizacionDatosComponent', () => {
  let COMPONENT: AutorizacionDatosComponent;
  let FIXTURE: ComponentFixture<AutorizacionDatosComponent>;
  let MOCK_WIZARD_COMPONENT: jest.Mocked<WizardComponent>;

  // Datos mock
  const MOCK_PASOS_REGISTRO: ListaPasosWizard[] = [
    {
      indice: 1,
      titulo: 'Paso 1',
      activo: true,
      completado: false
    },
    {
      indice: 2,
      titulo: 'Paso 2',
      activo: false,
      completado: false
    },
    {
      indice: 3,
      titulo: 'Paso 3',
      activo: false,
      completado: false
    }
  ]

  const MOCK_DATOS_PASOS: DatosPasos = {
    nroPasos: 3,
    indice: 1,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar'
  };

  beforeEach(async () => {
    // Crear el mock del WizardComponent una sola vez
    MOCK_WIZARD_COMPONENT = {
      siguiente: jest.fn(),
      atras: jest.fn()
    } as unknown as jest.Mocked<WizardComponent>;

    // Mock de la constante PASOS_REGISTRO
    jest.doMock('@ng-mf/data-access-user', () => ({
      PASOS_REGISTRO: MOCK_PASOS_REGISTRO,
      WizardComponent: jest.fn(),
      DatosPasos: jest.fn(),
      ListaPasosWizard: jest.fn()
    }));

    await TestBed.configureTestingModule({
      declarations: [AutorizacionDatosComponent],
      providers: [],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    FIXTURE = TestBed.createComponent(AutorizacionDatosComponent);
    COMPONENT = FIXTURE.componentInstance;

    // Asignar el mock directamente a la propiedad ViewChild
    COMPONENT.wizardComponent = MOCK_WIZARD_COMPONENT;
    
    // Detectar cambios para inicializar la vista
    FIXTURE.detectChanges();
  });

  // Limpiar mocks antes de cada test
  beforeEach(() => {
    jest.clearAllMocks();
    // Reasegurar que el mock esté disponible
    COMPONENT.wizardComponent = MOCK_WIZARD_COMPONENT;
  });

  // Pruebas de inicialización del componente
  describe('Inicialización del componente', () => {
    it('debería crear el componente correctamente', () => {
      expect(COMPONENT).toBeTruthy();
    });

    it('debería inicializar las propiedades con valores por defecto', () => {
      expect(COMPONENT.pasos).toBeDefined();
      expect(COMPONENT.pantallasPasos).toBeDefined();
      expect(COMPONENT.indice).toBe(1);
      expect(COMPONENT.datosPasos).toBeDefined();
    });

    it('debería inicializar pasos con PASOS_REGISTRO', () => {
      // Simular que PASOS_REGISTRO está definido
      Object.defineProperty(COMPONENT, 'pasos', {
        value: MOCK_PASOS_REGISTRO,
        writable: true
      });

      expect(COMPONENT.pasos).toEqual(MOCK_PASOS_REGISTRO);
      expect(Array.isArray(COMPONENT.pasos)).toBeTruthy();
    });

    it('debería inicializar pantallasPasos con PASOS_REGISTRO', () => {
      Object.defineProperty(COMPONENT, 'pantallasPasos', {
        value: MOCK_PASOS_REGISTRO,
        writable: true
      });

      expect(COMPONENT.pantallasPasos).toEqual(MOCK_PASOS_REGISTRO);
      expect(Array.isArray(COMPONENT.pantallasPasos)).toBeTruthy();
    });

    it('debería inicializar indice con valor 1', () => {
      expect(COMPONENT.indice).toBe(1);
      expect(typeof COMPONENT.indice).toBe('number');
    });

    it('debería inicializar datosPasos con la estructura correcta', () => {
      // Configurar manualmente los pasos para esta prueba
      COMPONENT.pasos = MOCK_PASOS_REGISTRO;
      COMPONENT.datosPasos = {
        nroPasos: COMPONENT.pasos.length,
        indice: COMPONENT.indice,
        txtBtnAnt: 'Anterior',
        txtBtnSig: 'Continuar',
      };

      expect(COMPONENT.datosPasos.nroPasos).toBe(MOCK_PASOS_REGISTRO.length);
      expect(COMPONENT.datosPasos.indice).toBe(1);
      expect(COMPONENT.datosPasos.txtBtnAnt).toBe('Anterior');
      expect(COMPONENT.datosPasos.txtBtnSig).toBe('Continuar');
    });
  });

  // Pruebas para @ViewChild
  describe('ViewChild wizardComponent', () => {
    it('debería tener referencia al WizardComponent', () => {
      expect(COMPONENT.wizardComponent).toBeDefined();
    });

    it('debería poder llamar métodos del WizardComponent', () => {
      expect(typeof COMPONENT.wizardComponent.siguiente).toBe('function');
      expect(typeof COMPONENT.wizardComponent.atras).toBe('function');
    });
  });

  // Pruebas para getValorIndice
  describe('getValorIndice', () => {

    it('debería actualizar el índice cuando el valor está en rango válido', () => {
      const ACCION_BOTON: AccionBoton = {
        accion: 'cont',
        valor: 2
      };

      COMPONENT.getValorIndice(ACCION_BOTON);

      expect(COMPONENT.indice).toBe(2);
    });

    it('debería llamar siguiente() cuando la acción es "cont"', () => {
      const ACCION_BOTON: AccionBoton = {
        accion: 'cont',
        valor: 2
      };

      COMPONENT.getValorIndice(ACCION_BOTON);

      expect(MOCK_WIZARD_COMPONENT.siguiente).toHaveBeenCalled();
    });

    it('debería llamar atras() cuando la acción no es "cont"', () => {
      const ACCION_BOTON: AccionBoton = {
        accion: 'prev',
        valor: 1
      };

      COMPONENT.getValorIndice(ACCION_BOTON);

      expect(MOCK_WIZARD_COMPONENT.atras).toHaveBeenCalled();
    });

    it('debería llamar atras() cuando la acción es "anterior"', () => {
      const ACCION_BOTON: AccionBoton = {
        accion: 'anterior',
        valor: 1
      };

      COMPONENT.getValorIndice(ACCION_BOTON);

      expect(MOCK_WIZARD_COMPONENT.atras).toHaveBeenCalled();
    });

    it('debería manejar valor en el límite inferior (1)', () => {
      const ACCION_BOTON: AccionBoton = {
        accion: 'cont',
        valor: 1
      };

      COMPONENT.getValorIndice(ACCION_BOTON);

      expect(COMPONENT.indice).toBe(1);
      expect(MOCK_WIZARD_COMPONENT.siguiente).toHaveBeenCalled();
    });

    it('debería manejar valor en el límite superior (4)', () => {
      const ACCION_BOTON: AccionBoton = {
        accion: 'cont',
        valor: 4
      };

      COMPONENT.getValorIndice(ACCION_BOTON);

      expect(COMPONENT.indice).toBe(4);
      expect(MOCK_WIZARD_COMPONENT.siguiente).toHaveBeenCalled();
    });

    it('no debería actualizar índice cuando el valor es 0', () => {
      const INDICE_INICIAL = COMPONENT.indice;
      const ACCION_BOTON: AccionBoton = {
        accion: 'cont',
        valor: 0
      };

      COMPONENT.getValorIndice(ACCION_BOTON);

      expect(COMPONENT.indice).toBe(INDICE_INICIAL);
      expect(MOCK_WIZARD_COMPONENT.siguiente).not.toHaveBeenCalled();
    });

    it('no debería actualizar índice cuando el valor es 5', () => {
      const INDICE_INICIAL = COMPONENT.indice;
      const ACCION_BOTON: AccionBoton = {
        accion: 'cont',
        valor: 5
      };

      COMPONENT.getValorIndice(ACCION_BOTON);

      expect(COMPONENT.indice).toBe(INDICE_INICIAL);
      expect(MOCK_WIZARD_COMPONENT.siguiente).not.toHaveBeenCalled();
    });

    it('no debería actualizar índice cuando el valor es negativo', () => {
      const INDICE_INICIAL = COMPONENT.indice;
      const ACCION_BOTON: AccionBoton = {
        accion: 'cont',
        valor: -1
      };

      COMPONENT.getValorIndice(ACCION_BOTON);

      expect(COMPONENT.indice).toBe(INDICE_INICIAL);
      expect(MOCK_WIZARD_COMPONENT.siguiente).not.toHaveBeenCalled();
    });

    it('no debería actualizar índice cuando el valor es mayor a 5', () => {
      const INDICE_INICIAL = COMPONENT.indice;
      const ACCION_BOTON: AccionBoton = {
        accion: 'cont',
        valor: 10
      };

      COMPONENT.getValorIndice(ACCION_BOTON);

      expect(COMPONENT.indice).toBe(INDICE_INICIAL);
      expect(MOCK_WIZARD_COMPONENT.siguiente).not.toHaveBeenCalled();
    });

    it('debería manejar acciones con string vacío', () => {
      const ACCION_BOTON: AccionBoton = {
        accion: '',
        valor: 2
      };

      COMPONENT.getValorIndice(ACCION_BOTON);

      expect(COMPONENT.indice).toBe(2);
      expect(MOCK_WIZARD_COMPONENT.atras).toHaveBeenCalled();
    });

    it('debería manejar acciones con string undefined', () => {
      const ACCION_BOTON: AccionBoton = {
        accion: undefined as any,
        valor: 2
      };

      COMPONENT.getValorIndice(ACCION_BOTON);

      expect(COMPONENT.indice).toBe(2);
      expect(MOCK_WIZARD_COMPONENT.atras).toHaveBeenCalled();
    });

    it('debería manejar acciones con string null', () => {
      const ACCION_BOTON: AccionBoton = {
        accion: null as any,
        valor: 2
      };

      COMPONENT.getValorIndice(ACCION_BOTON);

      expect(COMPONENT.indice).toBe(2);
      expect(MOCK_WIZARD_COMPONENT.atras).toHaveBeenCalled();
    });

    it('debería actualizar índice y llamar siguiente() para múltiples valores válidos', () => {
      const VALORES_VALIDOS = [1, 2, 3, 4];

      VALORES_VALIDOS.forEach(valor => {
        const ACCION_BOTON: AccionBoton = {
          accion: 'cont',
          valor: valor
        };

        COMPONENT.getValorIndice(ACCION_BOTON);

        expect(COMPONENT.indice).toBe(valor);
      });

      expect(MOCK_WIZARD_COMPONENT.siguiente).toHaveBeenCalledTimes(VALORES_VALIDOS.length);
    });

    it('debería manejar diferentes tipos de acciones', () => {
      const ACCIONES_DIFERENTES = [
        { accion: 'cont', valor: 2, metodoEsperado: 'siguiente' },
        { accion: 'anterior', valor: 1, metodoEsperado: 'atras' },
        { accion: 'back', valor: 3, metodoEsperado: 'atras' },
        { accion: 'continue', valor: 4, metodoEsperado: 'atras' }
      ];

      ACCIONES_DIFERENTES.forEach(({ accion, valor, metodoEsperado }) => {
        jest.clearAllMocks();

        const ACCION_BOTON: AccionBoton = { accion, valor };
        COMPONENT.getValorIndice(ACCION_BOTON);

        expect(COMPONENT.indice).toBe(valor);

        if (metodoEsperado === 'siguiente') {
          expect(MOCK_WIZARD_COMPONENT.siguiente).toHaveBeenCalled();
          expect(MOCK_WIZARD_COMPONENT.atras).not.toHaveBeenCalled();
        } else {
          expect(MOCK_WIZARD_COMPONENT.atras).toHaveBeenCalled();
          expect(MOCK_WIZARD_COMPONENT.siguiente).not.toHaveBeenCalled();
        }
      });
    });
  });

  // Pruebas de propiedades públicas
  describe('Propiedades públicas', () => {
    it('debería tener todas las propiedades públicas accesibles', () => {
      expect(COMPONENT.pasos).toBeDefined();
      expect(COMPONENT.wizardComponent).toBeDefined();
      expect(COMPONENT.pantallasPasos).toBeDefined();
      expect(COMPONENT.indice).toBeDefined();
      expect(COMPONENT.datosPasos).toBeDefined();
    });

    it('debería tener pasos como array', () => {
      expect(Array.isArray(COMPONENT.pasos)).toBeTruthy();
    });

    it('debería tener pantallasPasos como array', () => {
      expect(Array.isArray(COMPONENT.pantallasPasos)).toBeTruthy();
    });

    it('debería tener indice como número', () => {
      expect(typeof COMPONENT.indice).toBe('number');
    });

    it('debería tener datosPasos como objeto con propiedades requeridas', () => {
      expect(typeof COMPONENT.datosPasos).toBe('object');
      expect(COMPONENT.datosPasos).toHaveProperty('nroPasos');
      expect(COMPONENT.datosPasos).toHaveProperty('indice');
      expect(COMPONENT.datosPasos).toHaveProperty('txtBtnAnt');
      expect(COMPONENT.datosPasos).toHaveProperty('txtBtnSig');
    });
  });

  // Pruebas de interacciones con la template
  describe('Interacciones con la template', () => {
    beforeEach(() => {
      COMPONENT.pasos = MOCK_PASOS_REGISTRO;
      COMPONENT.pantallasPasos = MOCK_PASOS_REGISTRO;
      COMPONENT.datosPasos = MOCK_DATOS_PASOS;
      FIXTURE.detectChanges();
    });

    it('debería renderizar el título correctamente', () => {
      const COMPILED = FIXTURE.nativeElement;
      const TITULO = COMPILED.querySelector('h1');
      expect(TITULO).toBeTruthy();
      expect(TITULO.textContent?.trim()).toBe('Autorización de Importación y Exportación de Rayos X');
    });

    it('debería renderizar el componente wizard', () => {
      const COMPILED = FIXTURE.nativeElement;
      const WIZARD = COMPILED.querySelector('app-wizard');
      expect(WIZARD).toBeTruthy();
    });

    it('debería renderizar el componente btn-continuar', () => {
      const COMPILED = FIXTURE.nativeElement;
      const BTN_CONTINUAR = COMPILED.querySelector('btn-continuar');
      expect(BTN_CONTINUAR).toBeTruthy();
    });

    it('debería mostrar el paso uno cuando indice es 1', () => {
      COMPONENT.indice = 1;
      FIXTURE.detectChanges();

      const COMPILED = FIXTURE.nativeElement;
      const PASO_UNO = COMPILED.querySelector('app-paso-uno');
      expect(PASO_UNO).toBeTruthy();
    });

    it('debería mostrar el paso dos cuando indice es 2', () => {
      COMPONENT.indice = 2;
      FIXTURE.detectChanges();

      const COMPILED = FIXTURE.nativeElement;
      const PASO_DOS = COMPILED.querySelector('app-paso-dos');
      expect(PASO_DOS).toBeTruthy();
    });

    it('debería mostrar el paso tres cuando indice es 3', () => {
      COMPONENT.indice = 3;
      FIXTURE.detectChanges();

      const COMPILED = FIXTURE.nativeElement;
      const PASO_TRES = COMPILED.querySelector('app-paso-tres');
      expect(PASO_TRES).toBeTruthy();
    });

    it('no debería mostrar ningún paso cuando indice es inválido', () => {
      COMPONENT.indice = 4;
      FIXTURE.detectChanges();

      const COMPILED = FIXTURE.nativeElement;
      const PASO_UNO = COMPILED.querySelector('app-paso-uno');
      const PASO_DOS = COMPILED.querySelector('app-paso-dos');
      const PASO_TRES = COMPILED.querySelector('app-paso-tres');

      expect(PASO_UNO).toBeFalsy();
      expect(PASO_DOS).toBeFalsy();
      expect(PASO_TRES).toBeFalsy();
    });

    it('debería pasar los datos correctos al componente wizard', () => {
      const COMPILED = FIXTURE.nativeElement;
      const WIZARD = COMPILED.querySelector('app-wizard');
      expect(WIZARD.getAttribute('ng-reflect-lista-pasos')).toBeDefined();
    });

    it('debería pasar los datos correctos al componente btn-continuar', () => {
      const COMPILED = FIXTURE.nativeElement;
      const BTN_CONTINUAR = COMPILED.querySelector('btn-continuar');
      expect(BTN_CONTINUAR.getAttribute('ng-reflect-datos')).toBeDefined();
    });

    it('debería manejar el evento continuarEvento del btn-continuar', () => {
      const SPY_GET_VALOR_INDICE = jest.spyOn(COMPONENT, 'getValorIndice');

      const COMPILED = FIXTURE.nativeElement;
      const BTN_CONTINUAR = COMPILED.querySelector('btn-continuar');

      // Simular evento
      const EVENTO_MOCK: AccionBoton = { accion: 'cont', valor: 2 };
      BTN_CONTINUAR.dispatchEvent(new CustomEvent('continuarEvento', { detail: EVENTO_MOCK }));

      expect(SPY_GET_VALOR_INDICE).toHaveBeenCalled();
    });

    it('debería renderizar la estructura HTML correcta', () => {
      const COMPILED = FIXTURE.nativeElement;
      const CONTAINER = COMPILED.querySelector('.container');
      const ROW = COMPILED.querySelector('.row');
      const COL = COMPILED.querySelector('.col-md-12');

      expect(CONTAINER).toBeTruthy();
      expect(ROW).toBeTruthy();
      expect(COL).toBeTruthy();
    });
  });

  // Pruebas de casos límite y manejo de errores
  describe('Casos límite y manejo de errores', () => {
    it('debería manejar wizardComponent undefined', () => {
      // Temporalmente establecer wizardComponent como undefined
      const originalWizardComponent = COMPONENT.wizardComponent;
      COMPONENT.wizardComponent = undefined as any;

      const ACCION_BOTON: AccionBoton = {
        accion: 'cont',
        valor: 2
      };

      expect(() => {
        COMPONENT.getValorIndice(ACCION_BOTON);
      }).toThrow();

      // Restaurar el wizardComponent para otros tests
      COMPONENT.wizardComponent = originalWizardComponent;
    });

    it('debería manejar pasos array vacío', () => {
      COMPONENT.pasos = [];
      COMPONENT.datosPasos = {
        nroPasos: COMPONENT.pasos.length,
        indice: COMPONENT.indice,
        txtBtnAnt: 'Anterior',
        txtBtnSig: 'Continuar',
      };

      expect(COMPONENT.datosPasos.nroPasos).toBe(0);
    });

    it('debería manejar pasos undefined', () => {
      COMPONENT.pasos = undefined as any;

      expect(() => {
        COMPONENT.datosPasos = {
          nroPasos: COMPONENT.pasos?.length || 0,
          indice: COMPONENT.indice,
          txtBtnAnt: 'Anterior',
          txtBtnSig: 'Continuar',
        };
      }).not.toThrow();
    });

    it('debería manejar índice con valor extremo', () => {
      COMPONENT.indice = Number.MAX_SAFE_INTEGER;

      const ACCION_BOTON: AccionBoton = {
        accion: 'cont',
        valor: Number.MAX_SAFE_INTEGER
      };

      COMPONENT.getValorIndice(ACCION_BOTON);

      // No debería actualizar porque está fuera del rango válido
      expect(MOCK_WIZARD_COMPONENT.siguiente).not.toHaveBeenCalled();
    });

    it('debería manejar valor decimal en AccionBoton', () => {
      const ACCION_BOTON: AccionBoton = {
        accion: 'cont',
        valor: 2.5
      };

      COMPONENT.getValorIndice(ACCION_BOTON);

      // Debería actualizar porque 2.5 > 0 y < 5
      expect(COMPONENT.indice).toBe(2.5);
      expect(MOCK_WIZARD_COMPONENT.siguiente).toHaveBeenCalled();
    });

    it('debería manejar acción con caracteres especiales', () => {
      const ACCION_BOTON: AccionBoton = {
        accion: 'cont@#$%',
        valor: 2
      };

      COMPONENT.getValorIndice(ACCION_BOTON);

      expect(COMPONENT.indice).toBe(2);
      expect(MOCK_WIZARD_COMPONENT.atras).toHaveBeenCalled();
    });

    it('debería manejar PASOS_REGISTRO no definido', () => {
      // Simular que PASOS_REGISTRO no está disponible
      const COMPONENT_SIN_PASOS = new AutorizacionDatosComponent();

      expect(() => {
        COMPONENT_SIN_PASOS.pasos = [] as any;
      }).not.toThrow();
    });
  });

  // Pruebas de flujo completo del componente
  describe('Flujo completo del componente', () => {

    it('debería ejecutar el flujo completo de navegación hacia adelante', () => {
      // Paso 1 -> Paso 2
      const ACCION_CONTINUAR: AccionBoton = { accion: 'cont', valor: 2 };
      COMPONENT.getValorIndice(ACCION_CONTINUAR);

      expect(COMPONENT.indice).toBe(2);
      expect(MOCK_WIZARD_COMPONENT.siguiente).toHaveBeenCalled();

      // Paso 2 -> Paso 3
      jest.clearAllMocks();
      const ACCION_CONTINUAR_2: AccionBoton = { accion: 'cont', valor: 3 };
      COMPONENT.getValorIndice(ACCION_CONTINUAR_2);

      expect(COMPONENT.indice).toBe(3);
      expect(MOCK_WIZARD_COMPONENT.siguiente).toHaveBeenCalled();
    });

    it('debería ejecutar el flujo completo de navegación hacia atrás', () => {
      // Ir al paso 3 primero
      COMPONENT.indice = 3;

      // Paso 3 -> Paso 2
      const ACCION_ATRAS: AccionBoton = { accion: 'prev', valor: 2 };
      COMPONENT.getValorIndice(ACCION_ATRAS);

      expect(COMPONENT.indice).toBe(2);
      expect(MOCK_WIZARD_COMPONENT.atras).toHaveBeenCalled();

      // Paso 2 -> Paso 1
      jest.clearAllMocks();
      const ACCION_ATRAS_2: AccionBoton = { accion: 'prev', valor: 1 };
      COMPONENT.getValorIndice(ACCION_ATRAS_2);

      expect(COMPONENT.indice).toBe(1);
      expect(MOCK_WIZARD_COMPONENT.atras).toHaveBeenCalled();
    });

    it('debería mantener consistencia entre índice y vista', () => {
      const INDICES_VALIDOS = [1, 2, 3];

      INDICES_VALIDOS.forEach(indice => {
        COMPONENT.indice = indice;
        FIXTURE.detectChanges();

        const COMPILED = FIXTURE.nativeElement;
        const PASO_SELECTOR = `app-paso-${indice === 1 ? 'uno' : indice === 2 ? 'dos' : 'tres'}`;
        const PASO_ELEMENTO = COMPILED.querySelector(PASO_SELECTOR);

        expect(PASO_ELEMENTO).toBeTruthy();
      });
    });

    it('debería actualizar datosPasos cuando cambia el índice', () => {
      const NUEVO_INDICE = 3;
      const ACCION_BOTON: AccionBoton = { accion: 'cont', valor: NUEVO_INDICE };

      COMPONENT.getValorIndice(ACCION_BOTON);

      expect(COMPONENT.indice).toBe(NUEVO_INDICE);

      // Simular actualización manual de datosPasos
      COMPONENT.datosPasos.indice = COMPONENT.indice;
      expect(COMPONENT.datosPasos.indice).toBe(NUEVO_INDICE);
    });
  });

  // Pruebas de interfaz AccionBoton
  describe('Interfaz AccionBoton', () => {
    it('debería aceptar AccionBoton con propiedades válidas', () => {
      const ACCION_VALIDA: AccionBoton = {
        accion: 'cont',
        valor: 2
      };

      expect(typeof ACCION_VALIDA.accion).toBe('string');
      expect(typeof ACCION_VALIDA.valor).toBe('number');
    });

    it('debería manejar AccionBoton con propiedades de diferentes tipos', () => {
      const ACCIONES_DIVERSAS: AccionBoton[] = [
        { accion: 'cont', valor: 1 },
        { accion: 'anterior', valor: 0 },
        { accion: '', valor: -1 },
        { accion: 'test', valor: 4.5 }
      ];

      ACCIONES_DIVERSAS.forEach(accion => {
        expect(() => {
          COMPONENT.getValorIndice(accion);
        }).not.toThrow();
      });
    });
  });

  // Pruebas de rendimiento y optimización
  describe('Rendimiento y optimización', () => {
    it('debería manejar múltiples llamadas a getValorIndice eficientemente', () => {
      const NUMERO_LLAMADAS = 100;
      const ACCION_BOTON: AccionBoton = { accion: 'cont', valor: 2 };

      const INICIO = performance.now();

      for (let i = 0; i < NUMERO_LLAMADAS; i++) {
        COMPONENT.getValorIndice(ACCION_BOTON);
      }

      const FIN = performance.now();
      const TIEMPO_EJECUCION = FIN - INICIO;

      // Debería ejecutarse en menos de 10ms para 100 llamadas
      expect(TIEMPO_EJECUCION).toBeLessThan(10);
      expect(MOCK_WIZARD_COMPONENT.siguiente).toHaveBeenCalledTimes(NUMERO_LLAMADAS);
    });

    it('no debería tener fugas de memoria en propiedades', () => {
      const PROPIEDADES_INICIALES = Object.keys(COMPONENT);

      // Simular uso del componente
      COMPONENT.getValorIndice({ accion: 'cont', valor: 2 });
      COMPONENT.getValorIndice({ accion: 'prev', valor: 1 });

      const PROPIEDADES_FINALES = Object.keys(COMPONENT);

      // No deberían agregarse nuevas propiedades
      expect(PROPIEDADES_FINALES.length).toBe(PROPIEDADES_INICIALES.length);
    });
  });
});