import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

import { GestionAduaneraComponent } from './gestion-aduanera.component';
import { Tramite32609Store } from '../../../estados/tramites32609.store';
import { Tramite32609Query } from '../../../estados/tramites32609.query';

describe('GestionAduaneraComponent', () => {
  let component: GestionAduaneraComponent;
  let fixture: ComponentFixture<GestionAduaneraComponent>;
  let mockStore: jest.Mocked<Tramite32609Store>;
  let mockQuery: jest.Mocked<Tramite32609Query>;

  const mockSolicitudState = {
    perfiles: {
      describaProcedimiento: 'Procedimiento de gestión aduanera',
      indiqueLosCriterios: 'Criterios de evaluación',
      indiqueLosMetodos: 'Métodos de control',
      describaLosIndicadores: 'Indicadores de desempeño',
      comercioExterior: 'Operaciones de comercio exterior'
    }
  };

  beforeEach(async () => {
    mockStore = {
      establecerDatos: jest.fn()
    } as any;

    mockQuery = {
      selectTramite32609$: of(mockSolicitudState)
    } as any;

    await TestBed.configureTestingModule({
      imports: [GestionAduaneraComponent, ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: Tramite32609Store, useValue: mockStore },
        { provide: Tramite32609Query, useValue: mockQuery }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionAduaneraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with form created and state loaded', () => {
    expect(component.gestionAduanera).toBeDefined();
    expect(component.solicitudState).toEqual(mockSolicitudState);
  });

  describe('crearFormularioDeGestión', () => {
    it('should create form with all required controls', () => {
      const expectedControls = [
        'describaProcedimiento',
        'indiqueLosCriterios',
        'indiqueLosMetodos',
        'describaLosIndicadores',
        'comercioExterior'
      ];

      component.solicitudState = mockSolicitudState as any;
      component.crearFormularioDeGestión();

      expectedControls.forEach(controlName => {
        expect(component.gestionAduanera.get(controlName)).toBeDefined();
      });
    });

    it('should create form with state values', () => {
      component.solicitudState = mockSolicitudState as any;
      component.crearFormularioDeGestión();

      expect(component.gestionAduanera.get('describaProcedimiento')?.value).toBe('Procedimiento de gestión aduanera');
      expect(component.gestionAduanera.get('indiqueLosCriterios')?.value).toBe('Criterios de evaluación');
      expect(component.gestionAduanera.get('indiqueLosMetodos')?.value).toBe('Métodos de control');
      expect(component.gestionAduanera.get('describaLosIndicadores')?.value).toBe('Indicadores de desempeño');
      expect(component.gestionAduanera.get('comercioExterior')?.value).toBe('Operaciones de comercio exterior');
    });

    it('should create form with empty values when state has no perfiles', () => {
      component.solicitudState = {} as any;
      component.crearFormularioDeGestión();

      expect(component.gestionAduanera.get('describaProcedimiento')?.value).toBe('');
      expect(component.gestionAduanera.get('indiqueLosCriterios')?.value).toBe('');
      expect(component.gestionAduanera.get('indiqueLosMetodos')?.value).toBe('');
      expect(component.gestionAduanera.get('describaLosIndicadores')?.value).toBe('');
      expect(component.gestionAduanera.get('comercioExterior')?.value).toBe('');
    });

    it('should set required validators on all form controls', () => {
      component.solicitudState = mockSolicitudState as any;
      component.crearFormularioDeGestión();

      Object.keys(component.gestionAduanera.controls).forEach(controlName => {
        const control = component.gestionAduanera.get(controlName);
        expect(control?.hasError('required')).toBeFalsy();
        
        control?.setValue('');
        expect(control?.hasError('required')).toBeTruthy();
      });
    });
  });

  describe('actualizarFormularioConEstado', () => {
    beforeEach(() => {
      component.solicitudState = mockSolicitudState as any;
      component.crearFormularioDeGestión();
    });

    it('should update form controls with new state values', () => {
      const newState = {
        perfiles: {
          describaProcedimiento: 'Nuevo procedimiento',
          indiqueLosCriterios: 'Nuevos criterios',
          indiqueLosMetodos: 'Nuevos métodos',
          describaLosIndicadores: 'Nuevos indicadores',
          comercioExterior: 'Nuevas operaciones'
        }
      };

      component.solicitudState = newState as any;
      component.actualizarFormularioConEstado();

      expect(component.gestionAduanera.get('describaProcedimiento')?.value).toBe('Nuevo procedimiento');
      expect(component.gestionAduanera.get('indiqueLosCriterios')?.value).toBe('Nuevos criterios');
      expect(component.gestionAduanera.get('indiqueLosMetodos')?.value).toBe('Nuevos métodos');
      expect(component.gestionAduanera.get('describaLosIndicadores')?.value).toBe('Nuevos indicadores');
      expect(component.gestionAduanera.get('comercioExterior')?.value).toBe('Nuevas operaciones');
    });

    it('should not update when form is not initialized', () => {
      component.gestionAduanera = null as any;
      
      expect(() => component.actualizarFormularioConEstado()).not.toThrow();
    });

    it('should not update when solicitudState has no perfiles', () => {
      component.solicitudState = {} as any;
      const initialValues = { ...component.gestionAduanera.value };
      
      component.actualizarFormularioConEstado();
      
      expect(component.gestionAduanera.value).toEqual(initialValues);
    });

    it('should skip fields with undefined, null or empty values', () => {
      component.solicitudState = {
        perfiles: {
          describaProcedimiento: '',
          indiqueLosCriterios: '',
          indiqueLosMetodos: undefined,
          describaLosIndicadores: 'Valid Value',
          comercioExterior: 'Another Valid Value'
        }
      } as any;

      const initialDescribaProcedimiento = component.gestionAduanera.get('describaProcedimiento')?.value;
      const initialIndiqueLosCriterios = component.gestionAduanera.get('indiqueLosCriterios')?.value;
      const initialIndiqueLosMetodos = component.gestionAduanera.get('indiqueLosMetodos')?.value;

      component.actualizarFormularioConEstado();

      expect(component.gestionAduanera.get('describaProcedimiento')?.value).toBe(initialDescribaProcedimiento);
      expect(component.gestionAduanera.get('indiqueLosCriterios')?.value).toBe(initialIndiqueLosCriterios);
      expect(component.gestionAduanera.get('indiqueLosMetodos')?.value).toBe(initialIndiqueLosMetodos);
      expect(component.gestionAduanera.get('describaLosIndicadores')?.value).toBe('Valid Value');
      expect(component.gestionAduanera.get('comercioExterior')?.value).toBe('Another Valid Value');
    });
  });

  describe('setValoresStore', () => {
    beforeEach(() => {
      component.solicitudState = mockSolicitudState as any;
      component.crearFormularioDeGestión();
    });

    it('should call store.establecerDatos with correct data when form and field are valid', () => {
      component.gestionAduanera.get('describaProcedimiento')?.setValue('Nuevo valor');
      
      component.setValoresStore(component.gestionAduanera, 'describaProcedimiento');
      
      expect(mockStore.establecerDatos).toHaveBeenCalledWith({
        perfiles: { describaProcedimiento: 'Nuevo valor' }
      });
    });

    it('should not call store when form is null', () => {
      component.setValoresStore(null, 'describaProcedimiento');
      
      expect(mockStore.establecerDatos).not.toHaveBeenCalled();
    });

    it('should not call store when control value is null', () => {
      component.gestionAduanera.get('describaProcedimiento')?.setValue(null);
      
      component.setValoresStore(component.gestionAduanera, 'describaProcedimiento');
      
      expect(mockStore.establecerDatos).not.toHaveBeenCalled();
    });

    it('should not call store when control value is undefined', () => {
      component.gestionAduanera.get('describaProcedimiento')?.setValue(undefined);
      
      component.setValoresStore(component.gestionAduanera, 'describaProcedimiento');
      
      expect(mockStore.establecerDatos).not.toHaveBeenCalled();
    });

    it('should call store when control value is empty string', () => {
      component.gestionAduanera.get('describaProcedimiento')?.setValue('');
      
      component.setValoresStore(component.gestionAduanera, 'describaProcedimiento');
      
      expect(mockStore.establecerDatos).toHaveBeenCalledWith({
        perfiles: { describaProcedimiento: '' }
      });
    });

    it('should not call store when field does not exist in form', () => {
      component.setValoresStore(component.gestionAduanera, 'nonexistentField');
      
      expect(mockStore.establecerDatos).not.toHaveBeenCalled();
    });
  });

  describe('ngOnDestroy', () => {
    it('should complete destroyNotifier$ subject', () => {
      jest.spyOn(component['destroyNotifier$'], 'next');
      jest.spyOn(component['destroyNotifier$'], 'complete');
      
      component.ngOnDestroy();
      
      expect(component['destroyNotifier$'].next).toHaveBeenCalled();
      expect(component['destroyNotifier$'].complete).toHaveBeenCalled();
    });
  });

  describe('Form Integration', () => {
    beforeEach(() => {
      component.solicitudState = mockSolicitudState as any;
      component.crearFormularioDeGestión();
    });

    it('should validate form as invalid when required fields are empty', () => {
      Object.keys(component.gestionAduanera.controls).forEach(controlName => {
        component.gestionAduanera.get(controlName)?.setValue('');
      });

      expect(component.gestionAduanera.valid).toBeFalsy();
    });

    it('should validate form as valid when all required fields have values', () => {
      Object.keys(component.gestionAduanera.controls).forEach(controlName => {
        component.gestionAduanera.get(controlName)?.setValue('Valid Value');
      });

      expect(component.gestionAduanera.valid).toBeTruthy();
    });

    it('should have correct initial values from state', () => {
      expect(component.gestionAduanera.get('describaProcedimiento')?.value).toBe('Procedimiento de gestión aduanera');
      expect(component.gestionAduanera.get('indiqueLosCriterios')?.value).toBe('Criterios de evaluación');
      expect(component.gestionAduanera.get('indiqueLosMetodos')?.value).toBe('Métodos de control');
      expect(component.gestionAduanera.get('describaLosIndicadores')?.value).toBe('Indicadores de desempeño');
      expect(component.gestionAduanera.get('comercioExterior')?.value).toBe('Operaciones de comercio exterior');
    });
  });
});
