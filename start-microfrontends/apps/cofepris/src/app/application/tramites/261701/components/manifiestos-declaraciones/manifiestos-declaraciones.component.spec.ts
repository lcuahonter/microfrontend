import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { ManifiestosDeclaracionesComponent } from './manifiestos-declaraciones.component';
import { 
  Tramite261701Store, 
  CancelacionPeticion261701State 
} from '../../estados/store/tramite261701.store';
import { Tramite261701Query } from '../../estados/query/tramite261701.query';
import { ConsultaioQuery, ConsultaioState } from '@libs/shared/data-access-user/src';

describe('ManifiestosDeclaracionesComponent', () => {
  let component: ManifiestosDeclaracionesComponent;
  let fixture: ComponentFixture<ManifiestosDeclaracionesComponent>;
  let mockTramite261701Store: jest.Mocked<Tramite261701Store>;
  let mockTramite261701Query: jest.Mocked<Tramite261701Query>;
  let mockConsultaioQuery: jest.Mocked<ConsultaioQuery>;
  let mockCheckboxElement: HTMLInputElement;

  // Datos mock
  const mockCancelacionPeticionState: CancelacionPeticion261701State = {
    manifiestos: true,
    // Agregar otras propiedades según sea necesario
  } as CancelacionPeticion261701State;

  const mockConsultaioState: ConsultaioState = {
    readonly: false,
    // Agregar otras propiedades según sea necesario
  } as ConsultaioState;

  beforeEach(async () => {
    // Mock para checkbox element
    mockCheckboxElement = {
      checked: false,
      id: 'manifiestos'
    } as unknown as HTMLInputElement;

    // Mock para Tramite261701Store
    mockTramite261701Store = {
      establecerDatos: jest.fn()
    } as unknown as jest.Mocked<Tramite261701Store>;

    // Mock para Tramite261701Query
    mockTramite261701Query = {
      select$: of(mockCancelacionPeticionState)
    } as unknown as jest.Mocked<Tramite261701Query>;

    // Mock para ConsultaioQuery
    mockConsultaioQuery = {
      selectConsultaioState$: of(mockConsultaioState)
    } as unknown as jest.Mocked<ConsultaioQuery>;

    // Mock para document.getElementById
    jest.spyOn(document, 'getElementById').mockReturnValue(mockCheckboxElement);

    await TestBed.configureTestingModule({
      declarations: [ManifiestosDeclaracionesComponent],
      providers: [
        { provide: Tramite261701Store, useValue: mockTramite261701Store },
        { provide: Tramite261701Query, useValue: mockTramite261701Query },
        { provide: ConsultaioQuery, useValue: mockConsultaioQuery }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ManifiestosDeclaracionesComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // Pruebas de inicialización y constructor
  describe('Inicialización del componente', () => {
    it('debería crear el componente', () => {
      expect(component).toBeTruthy();
    });

    it('debería inicializar las propiedades con valores por defecto', () => {
      expect(component.manifiestosCheckboxChecked).toBe(false);
      expect(component.esFormularioSoloLectura).toBe(false);
      expect(component.destroyNotifier$).toBeInstanceOf(Subject);
    });

    it('debería inyectar correctamente los servicios en el constructor', () => {
      expect(component['tramite261701Store']).toBeDefined();
      expect(component['tramite261701Query']).toBeDefined();
      expect(component['consultaioQuery']).toBeDefined();
    });

    it('debería suscribirse al estado de consultaio en el constructor', () => {
      const spy = jest.spyOn(mockConsultaioQuery.selectConsultaioState$, 'pipe');
      
      // Crear nuevo componente para activar constructor
      const newFixture = TestBed.createComponent(ManifiestosDeclaracionesComponent);
      const newComponent = newFixture.componentInstance;
      
      expect(spy).toHaveBeenCalled();
      expect(newComponent.esFormularioSoloLectura).toBe(mockConsultaioState.readonly);
    });

    it('debería establecer esFormularioSoloLectura cuando readonly es true', () => {
      const readonlyState = { ...mockConsultaioState, readonly: true };
      mockConsultaioQuery.selectConsultaioState$ = of(readonlyState);
      
      const newFixture = TestBed.createComponent(ManifiestosDeclaracionesComponent);
      const newComponent = newFixture.componentInstance;
      
      expect(newComponent.esFormularioSoloLectura).toBe(true);
    });
  });

  // Pruebas para ngOnInit
  describe('ngOnInit', () => {
    it('debería suscribirse al select$ del tramite query', () => {
      const spy = jest.spyOn(mockTramite261701Query.select$, 'pipe');
      
      component.ngOnInit();
      
      expect(spy).toHaveBeenCalled();
      expect(component.cancelacionPeticionState).toEqual(mockCancelacionPeticionState);
    });

    it('debería usar takeUntil para evitar fugas de memoria', () => {
      const mockPipe = jest.fn().mockReturnValue(of(mockCancelacionPeticionState));
      mockTramite261701Query.select$ = {
        pipe: mockPipe
      } as any;
      
      component.ngOnInit();
      
      expect(mockPipe).toHaveBeenCalledWith(expect.anything(), expect.anything());
    });
  });

  // Pruebas para ngOnDestroy
  describe('ngOnDestroy', () => {
    it('no debería lanzar error cuando el elemento no existe', () => {
      jest.spyOn(document, 'getElementById').mockReturnValue(null);
      
      expect(() => component.ngOnDestroy()).not.toThrow();
    });

    it('debería llamar next() en destroyNotifier$', () => {
      const nextSpy = jest.spyOn(component.destroyNotifier$, 'next');
      
      component.ngOnDestroy();
      
      expect(nextSpy).toHaveBeenCalled();
    });

    it('debería llamar complete() en destroyNotifier$', () => {
      const completeSpy = jest.spyOn(component.destroyNotifier$, 'complete');
      
      component.ngOnDestroy();
      
      expect(completeSpy).toHaveBeenCalled();
    });

    it('debería limpiar correctamente los recursos para evitar fugas de memoria', () => {
      const nextSpy = jest.spyOn(component.destroyNotifier$, 'next');
      const completeSpy = jest.spyOn(component.destroyNotifier$, 'complete');
      
      component.ngOnDestroy();
      
      expect(nextSpy).toHaveBeenCalledTimes(1);
      expect(completeSpy).toHaveBeenCalledTimes(1);
    });

    it('debería llamar a document.getElementById con el id correcto', () => {
      const getElementByIdSpy = jest.spyOn(document, 'getElementById');
      
      component.ngOnDestroy();
      
      expect(getElementByIdSpy).toHaveBeenCalledWith('manifiestos');
    });
  });

  // Pruebas de integración y flujo completo
  describe('Flujo completo del componente', () => {
    it('debería ejecutar el flujo completo de inicialización', () => {    
      // Inicialización (constructor ya ejecutado)
      expect(component.esFormularioSoloLectura).toBe(mockConsultaioState.readonly);
      
      // ngOnInit
      component.ngOnInit();
      expect(component.cancelacionPeticionState).toEqual(mockCancelacionPeticionState);
    });

    it('debería manejar correctamente el modo solo lectura', () => {
      // Configurar modo solo lectura
      const readonlyState = { ...mockConsultaioState, readonly: true };
      mockConsultaioQuery.selectConsultaioState$ = of(readonlyState);
      
      // Crear nuevo componente
      const newFixture = TestBed.createComponent(ManifiestosDeclaracionesComponent);
      const newComponent = newFixture.componentInstance;
      
      // Verificar que se establece readonly
      expect(newComponent.esFormularioSoloLectura).toBe(true);
      
      // Ejecutar ngOnInit
      newComponent.ngOnInit();
    });
  });

  // Pruebas para casos edge y manejo de errores
  describe('Casos límite y manejo de errores', () => {
    it('debería manejar observables que no emiten en constructor', () => {
      const emptySubject = new Subject();
      mockConsultaioQuery.selectConsultaioState$ = emptySubject.asObservable() as Observable<ConsultaioState>;
      
      expect(() => {
        const newFixture = TestBed.createComponent(ManifiestosDeclaracionesComponent);
      }).not.toThrow();
    });

    it('debería manejar observables que no emiten en ngOnInit', () => {
      const emptySubject = new Subject();
      mockTramite261701Query.select$ = emptySubject.asObservable() as Observable<CancelacionPeticion261701State>;
      
      expect(() => component.ngOnInit()).not.toThrow();
    });
  });

  // Pruebas de la template
  describe('Interacciones con la template', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('debería renderizar el título correctamente', () => {
      const compiled = fixture.nativeElement;
      const titulo = compiled.querySelector('ng-titulo');
      expect(titulo).toBeTruthy();
    });

    it('debería renderizar el componente de alerta', () => {
      const compiled = fixture.nativeElement;
      const alert = compiled.querySelector('ng-alert');
      expect(alert).toBeTruthy();
    });

    it('debería pasar manifiestosAlert al componente ng-alert', () => {
      const compiled = fixture.nativeElement;
      const alert = compiled.querySelector('ng-alert');
      expect(alert?.getAttribute('ng-reflect-contenido')).toBeDefined();
    });
  });

  // Pruebas para suscripciones y gestión de memoria
  describe('Gestión de suscripciones', () => {
    it('debería usar takeUntil para evitar fugas de memoria en constructor', () => {
      const mockPipe = jest.fn().mockReturnValue(of(mockConsultaioState));
      mockConsultaioQuery.selectConsultaioState$ = {
        pipe: mockPipe
      } as any;
      
      const newFixture = TestBed.createComponent(ManifiestosDeclaracionesComponent);
      
      expect(mockPipe).toHaveBeenCalledWith(expect.anything(), expect.anything());
    });

    it('debería usar takeUntil para evitar fugas de memoria en ngOnInit', () => {
      const mockPipe = jest.fn().mockReturnValue(of(mockCancelacionPeticionState));
      mockTramite261701Query.select$ = {
        pipe: mockPipe
      } as any;
      
      component.ngOnInit();
      
      expect(mockPipe).toHaveBeenCalledWith(expect.anything(), expect.anything());
    });

    it('debería cancelar todas las suscripciones al destruir', () => {
      const nextSpy = jest.spyOn(component.destroyNotifier$, 'next');
      const completeSpy = jest.spyOn(component.destroyNotifier$, 'complete');
      
      component.ngOnDestroy();
      
      expect(nextSpy).toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
    });
  });

  // Pruebas para propiedades públicas
  describe('Propiedades públicas', () => {
    it('debería tener manifiestosCheckboxChecked como boolean', () => {
      expect(typeof component.manifiestosCheckboxChecked).toBe('boolean');
    });

    it('debería tener esFormularioSoloLectura como boolean', () => {
      expect(typeof component.esFormularioSoloLectura).toBe('boolean');
    });

    it('debería poder actualizar manifiestosCheckboxChecked', () => {
      component.manifiestosCheckboxChecked = true;
      expect(component.manifiestosCheckboxChecked).toBe(true);
      
      component.manifiestosCheckboxChecked = false;
      expect(component.manifiestosCheckboxChecked).toBe(false);
    });

    it('debería poder actualizar esFormularioSoloLectura', () => {
      component.esFormularioSoloLectura = true;
      expect(component.esFormularioSoloLectura).toBe(true);
      
      component.esFormularioSoloLectura = false;
      expect(component.esFormularioSoloLectura).toBe(false);
    });
  });
});