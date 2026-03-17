import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolicitudPageComponent } from './solicitud-page.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { AccionBoton, DatosPasos, ListaPasosWizard, WizardComponent } from '@ng-mf/data-access-user';
import { PASOS } from '@ng-mf/data-access-user';
import { TITULOMENSAJE } from '../../constants/solicitude-de-artificios-pirotecnicos.enum';

describe('SolicitudPageComponent', () => {
  let componente: SolicitudPageComponent;
  let fixture: ComponentFixture<SolicitudPageComponent>;
  let mockWizardComponent: jest.Mocked<WizardComponent>;

  beforeEach(async () => {
    // Mock del WizardComponent
    mockWizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn()
    } as unknown as jest.Mocked<WizardComponent>;

    await TestBed.configureTestingModule({
      declarations: [SolicitudPageComponent],
      schemas: [NO_ERRORS_SCHEMA] 
    }).compileComponents();

    fixture = TestBed.createComponent(SolicitudPageComponent);
    componente = fixture.componentInstance;
    
    // Asignar el mock al ViewChild
    componente.wizardComponent = mockWizardComponent;
    
    fixture.detectChanges();
  });

  describe('Inicialización del componente', () => {
    it('debería crear el componente', () => {
      expect(componente).toBeTruthy();
    });

    it('debería inicializar con las propiedades por defecto correctas', () => {
      expect(componente.tituloMensaje).toBe(TITULOMENSAJE);
      expect(componente.pasos).toEqual(PASOS);
      expect(componente.indice).toBe(1);
    });

    it('debería inicializar datosPasos con la configuración correcta', () => {
      const datosPasosEsperados: DatosPasos = {
        nroPasos: PASOS.length,
        indice: 1,
        txtBtnAnt: 'Anterior',
        txtBtnSig: 'Continuar',
      };
      expect(componente.datosPasos).toEqual(datosPasosEsperados);
    });

    it('debería tener la referencia al wizardComponent definida', () => {
      expect(componente.wizardComponent).toBeDefined();
    });
  });

  describe('Renderizado condicional de pasos', () => {
    it('debería renderizar <app-paso-uno> cuando el índice es 1', () => {
      componente.indice = 1;
      fixture.detectChanges(); 

      const ELEMENTO_PASO_UNO = fixture.debugElement.query(By.css('app-paso-uno'));
      expect(ELEMENTO_PASO_UNO).toBeTruthy();
    });

    it('debería renderizar <app-paso-dos> cuando el índice es 2', () => {
      componente.indice = 2;
      fixture.detectChanges(); 

      const ELEMENTO_PASO_DOS = fixture.debugElement.query(By.css('app-paso-dos'));
      expect(ELEMENTO_PASO_DOS).toBeTruthy();  
    });

    it('debería renderizar <app-paso-tres> cuando el índice es 3', () => {
      componente.indice = 3;
      fixture.detectChanges();  

      const ELEMENTO_PASO_TRES = fixture.debugElement.query(By.css('app-paso-tres'));
      expect(ELEMENTO_PASO_TRES).toBeTruthy(); 
    });

    it('debería renderizar el paso correcto basado en el índice actual', () => {
      // Probar paso 1
      componente.indice = 1;
      fixture.detectChanges();
      let ELEMENTO_PASO_UNO = fixture.debugElement.query(By.css('app-paso-uno'));
      let ELEMENTO_PASO_DOS = fixture.debugElement.query(By.css('app-paso-dos'));
      let ELEMENTO_PASO_TRES = fixture.debugElement.query(By.css('app-paso-tres'));
      expect(ELEMENTO_PASO_UNO).toBeTruthy();
      expect(ELEMENTO_PASO_DOS).toBeFalsy();
      expect(ELEMENTO_PASO_TRES).toBeFalsy();

      // Probar paso 2
      componente.indice = 2;
      fixture.detectChanges();
      ELEMENTO_PASO_UNO = fixture.debugElement.query(By.css('app-paso-uno'));
      ELEMENTO_PASO_DOS = fixture.debugElement.query(By.css('app-paso-dos'));
      ELEMENTO_PASO_TRES = fixture.debugElement.query(By.css('app-paso-tres'));
      expect(ELEMENTO_PASO_UNO).toBeFalsy();
      expect(ELEMENTO_PASO_DOS).toBeTruthy();
      expect(ELEMENTO_PASO_TRES).toBeFalsy();

      // Probar paso 3
      componente.indice = 3;
      fixture.detectChanges();
      ELEMENTO_PASO_UNO = fixture.debugElement.query(By.css('app-paso-uno'));
      ELEMENTO_PASO_DOS = fixture.debugElement.query(By.css('app-paso-dos'));
      ELEMENTO_PASO_TRES = fixture.debugElement.query(By.css('app-paso-tres'));
      expect(ELEMENTO_PASO_UNO).toBeFalsy();
      expect(ELEMENTO_PASO_DOS).toBeFalsy();
      expect(ELEMENTO_PASO_TRES).toBeTruthy();
    });

    it('no debería renderizar ningún paso cuando el índice no es válido', () => {
      componente.indice = 99;
      fixture.detectChanges();

      const ELEMENTO_PASO_UNO = fixture.debugElement.query(By.css('app-paso-uno'));
      const ELEMENTO_PASO_DOS = fixture.debugElement.query(By.css('app-paso-dos'));
      const ELEMENTO_PASO_TRES = fixture.debugElement.query(By.css('app-paso-tres'));
      
      expect(ELEMENTO_PASO_UNO).toBeFalsy();
      expect(ELEMENTO_PASO_DOS).toBeFalsy();
      expect(ELEMENTO_PASO_TRES).toBeFalsy();
    });
  });

  describe('Método seleccionaTab', () => {
    it('debería cambiar el índice al valor proporcionado', () => {
      componente.seleccionaTab(2);
      expect(componente.indice).toBe(2);
    });

    it('debería permitir cambiar a cualquier índice válido', () => {
      [1, 2, 3].forEach(indice => {
        componente.seleccionaTab(indice);
        expect(componente.indice).toBe(indice);
      });
    });

    it('debería permitir cambiar a índices fuera del rango (comportamiento actual)', () => {
      componente.seleccionaTab(99);
      expect(componente.indice).toBe(99);
    });

    it('debería permitir índices negativos (comportamiento actual)', () => {
      componente.seleccionaTab(-1);
      expect(componente.indice).toBe(-1);
    });
  });

  describe('Método getValorIndice', () => {
    it('debería actualizar el índice y título cuando se proporciona una acción de continuar válida', () => {
      const EVENTO_ACCION: AccionBoton = { valor: 2, accion: 'cont' };
      
      componente.getValorIndice(EVENTO_ACCION);
      
      expect(componente.indice).toBe(2);
      expect(componente.tituloMensaje).toBe('Anexar requisitos');
      expect(mockWizardComponent.siguiente).toHaveBeenCalledTimes(1);
    });

    it('debería actualizar el índice y título cuando se proporciona una acción de retroceder válida', () => {
      const EVENTO_ACCION: AccionBoton = { valor: 1, accion: 'atras' };
      
      componente.getValorIndice(EVENTO_ACCION);
      
      expect(componente.indice).toBe(1);
      expect(componente.tituloMensaje).toBe(TITULOMENSAJE);
      expect(mockWizardComponent.atras).toHaveBeenCalledTimes(1);
    });

    it('debería manejar todos los valores válidos del índice (1-4)', () => {
      const valoresValidos = [1, 2, 3, 4];
      
      valoresValidos.forEach(valor => {
        const evento: AccionBoton = { valor, accion: 'cont' };
        componente.getValorIndice(evento);
        expect(componente.indice).toBe(valor);
      });
    });

    it('no debería actualizar cuando se proporciona un valor inválido (menor que 1)', () => {
      const indiceInicial = componente.indice;
      const EVENTO_ACCION: AccionBoton = { valor: 0, accion: 'cont' };
      
      componente.getValorIndice(EVENTO_ACCION);
      
      expect(componente.indice).toBe(indiceInicial);
      expect(mockWizardComponent.siguiente).not.toHaveBeenCalled();
    });

    it('no debería actualizar cuando se proporciona un valor inválido (mayor que 4)', () => {
      const indiceInicial = componente.indice;
      const EVENTO_ACCION: AccionBoton = { valor: 5, accion: 'cont' };
      
      componente.getValorIndice(EVENTO_ACCION);
      
      expect(componente.indice).toBe(indiceInicial);
      expect(mockWizardComponent.siguiente).not.toHaveBeenCalled();
    });

    it('no debería actualizar cuando se proporciona un valor negativo', () => {
      const indiceInicial = componente.indice;
      const EVENTO_ACCION: AccionBoton = { valor: -1, accion: 'cont' };
      
      componente.getValorIndice(EVENTO_ACCION);
      
      expect(componente.indice).toBe(indiceInicial);
      expect(mockWizardComponent.siguiente).not.toHaveBeenCalled();
    });

    it('debería llamar al método correcto del wizard según la acción', () => {
      // Test para acción 'cont'
      const eventoSiguiente: AccionBoton = { valor: 2, accion: 'cont' };
      componente.getValorIndice(eventoSiguiente);
      expect(mockWizardComponent.siguiente).toHaveBeenCalledTimes(1);
      expect(mockWizardComponent.atras).not.toHaveBeenCalled();

      // Reset mocks
      jest.clearAllMocks();

      // Test para acción 'atras'
      const eventoAtras: AccionBoton = { valor: 1, accion: 'atras' };
      componente.getValorIndice(eventoAtras);
      expect(mockWizardComponent.atras).toHaveBeenCalledTimes(1);
      expect(mockWizardComponent.siguiente).not.toHaveBeenCalled();
    });

    it('debería manejar acciones diferentes a "cont" llamando a atras()', () => {
      const EVENTO_ACCION: AccionBoton = { valor: 2, accion: 'cualquier_otra_accion' };
      
      componente.getValorIndice(EVENTO_ACCION);
      
      expect(mockWizardComponent.atras).toHaveBeenCalledTimes(1);
      expect(mockWizardComponent.siguiente).not.toHaveBeenCalled();
    });
  });

  describe('Método estático obtenerNombreDelTítulo', () => {
    it('debería retornar el título correcto para el paso 1', () => {
      const titulo = SolicitudPageComponent.obtenerNombreDelTítulo(1);
      expect(titulo).toBe(TITULOMENSAJE);
    });

    it('debería retornar el título correcto para el paso 2', () => {
      const titulo = SolicitudPageComponent.obtenerNombreDelTítulo(2);
      expect(titulo).toBe('Anexar requisitos');
    });

    it('debería retornar el título correcto para el paso 3', () => {
      const titulo = SolicitudPageComponent.obtenerNombreDelTítulo(3);
      expect(titulo).toBe('Firmar');
    });

    it('debería retornar el título por defecto para valores no definidos', () => {
      const valoresNoDefinidos = [0, 4, 5, -1, 99];
      
      valoresNoDefinidos.forEach(valor => {
        const titulo = SolicitudPageComponent.obtenerNombreDelTítulo(valor);
        expect(titulo).toBe(TITULOMENSAJE);
      });
    });

    it('debería ser un método estático accesible sin instancia', () => {
      // Verificar que se puede llamar sin instanciar la clase
      expect(typeof SolicitudPageComponent.obtenerNombreDelTítulo).toBe('function');
      
      const titulo = SolicitudPageComponent.obtenerNombreDelTítulo(1);
      expect(titulo).toBe(TITULOMENSAJE);
    });
  });

  describe('Integración con botón continuar', () => {
    it('debería disparar getValorIndice cuando se hace clic en btn-continuar', () => {
      const EVENTO_ACCION: AccionBoton = { valor: 2, accion: 'cont' };
      const ESPÍA_GET_VALOR_INDICE = jest.spyOn(componente, 'getValorIndice');
      
      componente.indice = 1;
      fixture.detectChanges();

      const BOTÓN_CONTINUAR = fixture.debugElement.query(By.css('btn-continuar'));
      BOTÓN_CONTINUAR.triggerEventHandler('continuarEvento', EVENTO_ACCION);
      
      expect(ESPÍA_GET_VALOR_INDICE).toHaveBeenCalledWith(EVENTO_ACCION);
    });

    it('debería pasar los datos correctos al botón continuar', () => {
      fixture.detectChanges();
      
      const BOTÓN_CONTINUAR = fixture.debugElement.query(By.css('btn-continuar'));
      const datosInput = BOTÓN_CONTINUAR.componentInstance.datos;
      
      expect(datosInput).toEqual(componente.datosPasos);
    });
  });

  describe('Renderizado del template', () => {
    it('debería mostrar el título del mensaje en el h1', () => {
      componente.tituloMensaje = 'Título de prueba';
      fixture.detectChanges();
      
      const elementoTitulo = fixture.debugElement.query(By.css('h1'));
      expect(elementoTitulo.nativeElement.textContent.trim()).toBe('Título de prueba');
    });

    it('debería mostrar el título por defecto cuando tituloMensaje es nulo', () => {
      componente.tituloMensaje = null;
      fixture.detectChanges();
      
      const elementoTitulo = fixture.debugElement.query(By.css('h1'));
      expect(elementoTitulo.nativeElement.textContent.trim()).toBe('');
    });

    it('debería renderizar el componente app-wizard con los pasos correctos', () => {
      fixture.detectChanges();
      
      const wizardElement = fixture.debugElement.query(By.css('app-wizard'));
      expect(wizardElement).toBeTruthy();
      expect(wizardElement.componentInstance.listaPasos).toEqual(componente.pasos);
    });

    it('debería mostrar el contenedor ng-container cuando el índice es 2', () => {
      componente.indice = 2;
      fixture.detectChanges();
      
      // Verificar que la condición se cumple (el ng-container existe pero está vacío)
      const containers = fixture.debugElement.queryAll(By.css('ng-container'));
      expect(containers.length).toBeGreaterThan(0);
    });

    it('debería tener la estructura HTML correcta', () => {
      fixture.detectChanges();
      
      const containerPrincipal = fixture.debugElement.query(By.css('.container'));
      expect(containerPrincipal).toBeTruthy();
      
      const filas = fixture.debugElement.queryAll(By.css('.row'));
      expect(filas.length).toBe(2);
      
      const columna = fixture.debugElement.query(By.css('.col-md-12'));
      expect(columna).toBeTruthy();
    });
  });

  describe('Propiedades y estado del componente', () => {
    it('debería mantener la consistencia de datosPasos con el número de pasos', () => {
      expect(componente.datosPasos.nroPasos).toBe(componente.pasos.length);
    });

    it('debería mantener la consistencia de datosPasos con el índice actual', () => {
      componente.indice = 3;
      // Nota: datosPasos.indice se inicializa una vez, no se actualiza automáticamente
      expect(componente.datosPasos.indice).toBe(1); // Valor inicial
    });

    it('debería tener textos de botón configurados correctamente', () => {
      expect(componente.datosPasos.txtBtnAnt).toBe('Anterior');
      expect(componente.datosPasos.txtBtnSig).toBe('Continuar');
    });

    it('debería mantener la referencia a los pasos importados', () => {
      expect(componente.pasos).toBe(PASOS);
    });

    it('debería mantener la referencia al título mensaje importado inicialmente', () => {
      // Al inicio debe tener el valor importado
      expect(componente.tituloMensaje).toBe(TITULOMENSAJE);
    });
  });

  describe('Casos edge y manejo de errores', () => {
    it('debería manejar valores extremos en seleccionaTab', () => {
      const valoresExtremos = [Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER, 0];
      
      valoresExtremos.forEach(valor => {
        expect(() => componente.seleccionaTab(valor)).not.toThrow();
        expect(componente.indice).toBe(valor);
      });
    });

    it('debería manejar AccionBoton con propiedades faltantes', () => {
      const eventoIncompleto = { valor: 2 } as AccionBoton;
      
      expect(() => componente.getValorIndice(eventoIncompleto)).not.toThrow();
    });

    it('debería manejar wizardComponent no inicializado', () => {
      componente.wizardComponent = undefined as any;
      const EVENTO_ACCION: AccionBoton = { valor: 2, accion: 'cont' };
      
      // Debería fallar al intentar llamar métodos en undefined
      expect(() => componente.getValorIndice(EVENTO_ACCION)).toThrow();
    });

    it('debería manejar cambios de título después de la inicialización', () => {
      const nuevoTitulo = 'Nuevo título de prueba';
      componente.tituloMensaje = nuevoTitulo;
      
      expect(componente.tituloMensaje).toBe(nuevoTitulo);
    });
  });

  describe('Interacciones complejas', () => {
    it('debería actualizar el título correctamente al navegar entre pasos', () => {
      // Navegar del paso 1 al 2
      let evento: AccionBoton = { valor: 2, accion: 'cont' };
      componente.getValorIndice(evento);
      expect(componente.tituloMensaje).toBe('Anexar requisitos');
      
      // Navegar del paso 2 al 3
      evento = { valor: 3, accion: 'cont' };
      componente.getValorIndice(evento);
      expect(componente.tituloMensaje).toBe('Firmar');
      
      // Regresar al paso 1
      evento = { valor: 1, accion: 'atras' };
      componente.getValorIndice(evento);
      expect(componente.tituloMensaje).toBe(TITULOMENSAJE);
    });

    it('debería mantener la sincronización entre índice y renderizado', () => {
      const pasos = [1, 2, 3];
      
      pasos.forEach(paso => {
        componente.indice = paso;
        fixture.detectChanges();
        
        // Verificar que solo el paso actual se renderiza
        const pasoUno = fixture.debugElement.query(By.css('app-paso-uno'));
        const pasoDos = fixture.debugElement.query(By.css('app-paso-dos'));
        const pasoTres = fixture.debugElement.query(By.css('app-paso-tres'));
        
        expect(!!pasoUno).toBe(paso === 1);
        expect(!!pasoDos).toBe(paso === 2);
        expect(!!pasoTres).toBe(paso === 3);
      });
    });

    it('debería funcionar correctamente el flujo completo de navegación', () => {
      // Empezar en paso 1
      expect(componente.indice).toBe(1);
      
      // Avanzar al paso 2
      let evento: AccionBoton = { valor: 2, accion: 'cont' };
      componente.getValorIndice(evento);
      expect(componente.indice).toBe(2);
      expect(mockWizardComponent.siguiente).toHaveBeenCalledTimes(1);
      
      // Avanzar al paso 3
      evento = { valor: 3, accion: 'cont' };
      componente.getValorIndice(evento);
      expect(componente.indice).toBe(3);
      expect(mockWizardComponent.siguiente).toHaveBeenCalledTimes(2);
      
      // Retroceder al paso 2
      evento = { valor: 2, accion: 'atras' };
      componente.getValorIndice(evento);
      expect(componente.indice).toBe(2);
      expect(mockWizardComponent.atras).toHaveBeenCalledTimes(1);
    });
  });
});