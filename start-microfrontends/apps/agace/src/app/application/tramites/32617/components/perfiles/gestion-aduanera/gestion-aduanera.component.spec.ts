import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, Subject } from 'rxjs';

import { GestionAduaneraComponent } from './gestion-aduanera.component';
import { Tramite32617Store, Tramites32617State } from '../../../estados/tramites32617.store';
import { Tramite32617Query } from '../../../estados/tramites32617.query';
import { TEXTOS_ESTATICOS_GESTION_ADUANERA } from '../../../constants/texto-estatico.enum';

describe('GestionAduaneraComponent', () => {
  let component: GestionAduaneraComponent;
  let fixture: ComponentFixture<GestionAduaneraComponent>;
  let mockTramite32617Store: any;
  let mockTramite32617Query: any;
  let formBuilder: FormBuilder;

  const mockSolicitudState: Partial<Tramites32617State> = {
    perfiles: {
      describaProcedimiento: 'Procedimiento de prueba',
      indiqueLosCriterios: 'Criterios de prueba',
      indiqueLosMetodos: 'Métodos de prueba',
      describaLosIndicadores: 'Indicadores de prueba',
      comercioExterior: 'Comercio exterior de prueba'
    }
  };

  beforeEach(async () => {
    // Crear mocks para los servicios
    mockTramite32617Store = {
      establecerDatos: jest.fn()
    } as any;
    
    mockTramite32617Query = {
      selectTramite32617$: of(mockSolicitudState as Tramites32617State)
    } as any;

    await TestBed.configureTestingModule({
      imports: [GestionAduaneraComponent, ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: Tramite32617Store, useValue: mockTramite32617Store },
        { provide: Tramite32617Query, useValue: mockTramite32617Query }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionAduaneraComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);
  });

  describe('Inicialización del componente', () => {
    it('debería crear el componente correctamente', () => {
      expect(component).toBeTruthy();
    });

    it('debería inicializar las propiedades correctamente', () => {
      expect(component.textos).toBe(TEXTOS_ESTATICOS_GESTION_ADUANERA);
      expect(component.solicitudState).toBeUndefined();
      expect(component.gestionAduanera).toBeUndefined();
    });

    it('debería tener una instancia de destroyNotifier$ como Subject', () => {
      expect(component['destroyNotifier$']).toBeInstanceOf(Subject);
    });
  });

  describe('Ciclo de vida del componente', () => {
    it('debería ejecutar ngOnInit sin errores', () => {
      expect(() => component.ngOnInit()).not.toThrow();
    });

    it('debería suscribirse al query y actualizar el estado en ngOnInit', () => {
      component.ngOnInit();
      fixture.detectChanges();

      expect(component.solicitudState).toEqual(mockSolicitudState);
      expect(component.gestionAduanera).toBeDefined();
    });

    it('debería ejecutar ngOnDestroy sin errores', () => {
      jest.spyOn(component['destroyNotifier$'], 'next');
      jest.spyOn(component['destroyNotifier$'], 'complete');

      component.ngOnDestroy();

      expect(component['destroyNotifier$'].next).toHaveBeenCalled();
      expect(component['destroyNotifier$'].complete).toHaveBeenCalled();
    });
  });

  describe('Creación y manejo del formulario', () => {
    beforeEach(() => {
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('debería crear el formulario con los campos requeridos', () => {
      expect(component.gestionAduanera).toBeDefined();
      expect(component.gestionAduanera.get('describaProcedimiento')).toBeDefined();
      expect(component.gestionAduanera.get('indiqueLosCriterios')).toBeDefined();
      expect(component.gestionAduanera.get('indiqueLosMetodos')).toBeDefined();
      expect(component.gestionAduanera.get('describaLosIndicadores')).toBeDefined();
      expect(component.gestionAduanera.get('comercioExterior')).toBeDefined();
    });

    it('debería asignar validadores requeridos a todos los campos', () => {
      const campos = ['describaProcedimiento', 'indiqueLosCriterios', 'indiqueLosMetodos', 'describaLosIndicadores', 'comercioExterior'];
      
      campos.forEach(campo => {
        const control = component.gestionAduanera.get(campo);
        expect(control?.hasError('required')).toBe(false); // No tiene error porque tiene valor inicial
        control?.setValue('');
        expect(control?.hasError('required')).toBe(true);
      });
    });

    it('debería inicializar los campos con valores del estado', () => {
      expect(component.gestionAduanera.get('describaProcedimiento')?.value).toBe('Procedimiento de prueba');
      expect(component.gestionAduanera.get('indiqueLosCriterios')?.value).toBe('Criterios de prueba');
      expect(component.gestionAduanera.get('indiqueLosMetodos')?.value).toBe('Métodos de prueba');
      expect(component.gestionAduanera.get('describaLosIndicadores')?.value).toBe('Indicadores de prueba');
      expect(component.gestionAduanera.get('comercioExterior')?.value).toBe('Comercio exterior de prueba');
    });
  });

  describe('Método crearFormularioDeGestión', () => {
    beforeEach(() => {
      component.solicitudState = mockSolicitudState as any;
    });

    it('debería crear un formulario con valores del estado', () => {
      component.crearFormularioDeGestión();

      expect(component.gestionAduanera).toBeDefined();
      expect(component.gestionAduanera.get('describaProcedimiento')?.value).toBe('Procedimiento de prueba');
    });

    it('debería crear un formulario con valores vacíos cuando no hay perfiles en el estado', () => {
      component.solicitudState = {} as any;
      component.crearFormularioDeGestión();

      expect(component.gestionAduanera.get('describaProcedimiento')?.value).toBe('');
      expect(component.gestionAduanera.get('indiqueLosCriterios')?.value).toBe('');
    });

    it('debería crear un formulario con valores vacíos cuando el estado es null', () => {
      component.solicitudState = null as any;
      component.crearFormularioDeGestión();

      expect(component.gestionAduanera.get('describaProcedimiento')?.value).toBe('');
    });
  });

  describe('Método actualizarFormularioConEstado', () => {
    beforeEach(() => {
      component.solicitudState = mockSolicitudState as any;
      component.crearFormularioDeGestión();
    });

    it('debería actualizar los valores del formulario con el estado actual', () => {
      const nuevosPerfiles = {
        describaProcedimiento: 'Nuevo procedimiento',
        indiqueLosCriterios: 'Nuevos criterios'
      };
      component.solicitudState = { perfiles: nuevosPerfiles } as any;

      component.actualizarFormularioConEstado();

      expect(component.gestionAduanera.get('describaProcedimiento')?.value).toBe('Nuevo procedimiento');
      expect(component.gestionAduanera.get('indiqueLosCriterios')?.value).toBe('Nuevos criterios');
    });

    it('debería salir temprano si no existe el formulario', () => {
      component.gestionAduanera = null as any;
      expect(() => component.actualizarFormularioConEstado()).not.toThrow();
    });

    it('debería salir temprano si no existen perfiles en el estado', () => {
      component.solicitudState = { perfiles: null } as any;
      expect(() => component.actualizarFormularioConEstado()).not.toThrow();
    });

    it('debería manejar valores undefined, null o vacíos sin actualizar', () => {
      const perfilesConValoresNulos = {
        describaProcedimiento: undefined,
        indiqueLosCriterios: undefined,
        indiqueLosMetodos: ''
      };
      component.solicitudState = { perfiles: perfilesConValoresNulos } as any;
      const valorOriginal = component.gestionAduanera.get('describaProcedimiento')?.value;

      component.actualizarFormularioConEstado();

      expect(component.gestionAduanera.get('describaProcedimiento')?.value).toBe(valorOriginal);
    });
  });

  describe('Método setValoresStore', () => {
    beforeEach(() => {
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('debería establecer valores en el store cuando el control tiene valor', () => {
      const nuevoValor = 'Nuevo valor de prueba';
      component.gestionAduanera.get('describaProcedimiento')?.setValue(nuevoValor);

      component.setValoresStore(component.gestionAduanera, 'describaProcedimiento');

      expect(mockTramite32617Store.establecerDatos).toHaveBeenCalledWith({
        perfiles: { describaProcedimiento: nuevoValor }
      });
    });

    it('debería salir temprano si el formulario es null', () => {
      component.setValoresStore(null, 'describaProcedimiento');

      expect(mockTramite32617Store.establecerDatos).not.toHaveBeenCalled();
    });

    it('debería salir temprano si el control no existe', () => {
      component.setValoresStore(component.gestionAduanera, 'campoInexistente');

      expect(mockTramite32617Store.establecerDatos).not.toHaveBeenCalled();
    });

    it('debería salir temprano si el valor del control es null', () => {
      component.gestionAduanera.get('describaProcedimiento')?.setValue(null);

      component.setValoresStore(component.gestionAduanera, 'describaProcedimiento');

      expect(mockTramite32617Store.establecerDatos).not.toHaveBeenCalled();
    });

    it('debería salir temprano si el valor del control es undefined', () => {
      component.gestionAduanera.get('describaProcedimiento')?.setValue(undefined);

      component.setValoresStore(component.gestionAduanera, 'describaProcedimiento');

      expect(mockTramite32617Store.establecerDatos).not.toHaveBeenCalled();
    });
  });

  describe('Integración con Angular y renderizado', () => {
    it('debería renderizar sin errores después de la inicialización', () => {
      expect(() => {
        component.ngOnInit();
        fixture.detectChanges();
      }).not.toThrow();
    });

    it('debería tener acceso a los servicios inyectados', () => {
      expect(component['fb']).toBeDefined();
      expect(component['tramite32617Store']).toBeDefined();
      expect(component['tramite32617Query']).toBeDefined();
    });

    it('debería manejar cambios en la detección de cambios de Angular', () => {
      component.ngOnInit();
      expect(() => fixture.detectChanges()).not.toThrow();
    });
  });

  describe('Manejo de errores y casos extremos', () => {
    it('debería manejar errores en la suscripción del query', () => {
      const errorQuery = {
        selectTramite32617$: of(null as any)
      };
      
      component['tramite32617Query'] = errorQuery as any;

      expect(() => {
        component.ngOnInit();
        fixture.detectChanges();
      }).not.toThrow();
    });

    it('debería manejar estado undefined en la suscripción', () => {
      const queryConUndefined = {
        selectTramite32617$: of(undefined as any)
      };
      
      component['tramite32617Query'] = queryConUndefined as any;

      expect(() => {
        component.ngOnInit();
        fixture.detectChanges();
      }).not.toThrow();
    });

    it('debería manejar múltiples llamadas a ngOnInit', () => {
      component.ngOnInit();
      expect(() => component.ngOnInit()).not.toThrow();
    });

    it('debería manejar múltiples llamadas a ngOnDestroy', () => {
      expect(() => {
        component.ngOnDestroy();
        component.ngOnDestroy();
      }).not.toThrow();
    });
  });

  describe('Validación de formularios y validadores', () => {
    beforeEach(() => {
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('debería ser válido cuando todos los campos requeridos tienen valores', () => {
      component.gestionAduanera.patchValue({
        describaProcedimiento: 'Procedimiento válido',
        indiqueLosCriterios: 'Criterios válidos',
        indiqueLosMetodos: 'Métodos válidos',
        describaLosIndicadores: 'Indicadores válidos',
        comercioExterior: 'Comercio válido'
      });

      expect(component.gestionAduanera.valid).toBe(true);
    });

    it('debería ser inválido cuando falta algún campo requerido', () => {
      component.gestionAduanera.patchValue({
        describaProcedimiento: '',
        indiqueLosCriterios: 'Criterios válidos',
        indiqueLosMetodos: 'Métodos válidos',
        describaLosIndicadores: 'Indicadores válidos',
        comercioExterior: 'Comercio válido'
      });

      expect(component.gestionAduanera.valid).toBe(false);
      expect(component.gestionAduanera.get('describaProcedimiento')?.hasError('required')).toBe(true);
    });
  });

  describe('Gestión de memoria y suscripciones', () => {
    it('debería completar el destroyNotifier$ en ngOnDestroy para evitar memory leaks', () => {
      jest.spyOn(component['destroyNotifier$'], 'complete');
      component.ngOnDestroy();
      expect(component['destroyNotifier$'].complete).toHaveBeenCalled();
    });

    it('debería cancelar suscripciones activas al destruir el componente', () => {
      jest.spyOn(component['destroyNotifier$'], 'next');
      component.ngOnDestroy();
      expect(component['destroyNotifier$'].next).toHaveBeenCalled();
    });
  });

  describe('Métodos públicos - Verificación de accesibilidad', () => {
    const metodosPublicos = ['ngOnInit', 'ngOnDestroy', 'crearFormularioDeGestión', 'actualizarFormularioConEstado', 'setValoresStore'];

    metodosPublicos.forEach(metodo => {
      it(`debería tener el método público ${metodo} accesible`, () => {
        expect(typeof (component as any)[metodo]).toBe('function');
      });

      it(`debería poder ejecutar ${metodo} sin errores cuando sea apropiado`, () => {
        if (metodo === 'ngOnInit') {
          expect(() => component[metodo]()).not.toThrow();
        } else if (metodo === 'ngOnDestroy') {
          expect(() => component[metodo]()).not.toThrow();
        } else if (metodo === 'crearFormularioDeGestión') {
          component.solicitudState = mockSolicitudState as any;
          expect(() => component[metodo]()).not.toThrow();
        } else if (metodo === 'actualizarFormularioConEstado') {
          component.ngOnInit();
          expect(() => component[metodo]()).not.toThrow();
        } else if (metodo === 'setValoresStore') {
          component.ngOnInit();
          expect(() => component[metodo](component.gestionAduanera, 'describaProcedimiento')).not.toThrow();
        }
      });
    });
  });
});
