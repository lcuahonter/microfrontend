import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

import { CapacitacionSeguridadComponent } from './capacitacion-seguridad.component';
import { Tramite32609Store } from '../../../estados/tramites32609.store';
import { Tramite32609Query } from '../../../estados/tramites32609.query';

describe('CapacitacionSeguridadComponent', () => {
  let component: CapacitacionSeguridadComponent;
  let fixture: ComponentFixture<CapacitacionSeguridadComponent>;
  let mockStore: jest.Mocked<Tramite32609Store>;
  let mockQuery: jest.Mocked<Tramite32609Query>;

  const mockSolicitudState = {
    perfiles: {
      mediosTransporte: 'Terrestres',
      estaDifusion: 'Sí',
      enunciativaLimitativa: 'No',
      procedimientosEmpresa: 'Procedimiento A',
      mediosDeTransporte: 'Camiones'
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
      imports: [CapacitacionSeguridadComponent, ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: Tramite32609Store, useValue: mockStore },
        { provide: Tramite32609Query, useValue: mockQuery }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CapacitacionSeguridadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with form created', () => {
    expect(component.capacitacion).toBeDefined();
    expect(component.solicitudState).toEqual(mockSolicitudState);
  });

  describe('crearFormularioDeGestion', () => {
    it('should create form with state values', () => {
      component.solicitudState = mockSolicitudState as any;
      component.crearFormularioDeGestion();

      expect(component.capacitacion.get('mediosTransporte')?.value).toBe('Terrestres');
      expect(component.capacitacion.get('estaDifusion')?.value).toBe('Sí');
      expect(component.capacitacion.get('enunciativaLimitativa')?.value).toBe('No');
      expect(component.capacitacion.get('procedimientosEmpresa')?.value).toBe('Procedimiento A');
      expect(component.capacitacion.get('mediosDeTransporte')?.value).toBe('Camiones');
    });

    it('should create form with empty values when state has no perfiles', () => {
      component.solicitudState = {} as any;
      component.crearFormularioDeGestion();

      expect(component.capacitacion.get('mediosTransporte')?.value).toBe('');
      expect(component.capacitacion.get('estaDifusion')?.value).toBe('');
      expect(component.capacitacion.get('enunciativaLimitativa')?.value).toBe('');
      expect(component.capacitacion.get('procedimientosEmpresa')?.value).toBe('');
      expect(component.capacitacion.get('mediosDeTransporte')?.value).toBe('');
    });

    it('should set required validators on all form controls', () => {
      component.solicitudState = mockSolicitudState as any;
      component.crearFormularioDeGestion();

      Object.keys(component.capacitacion.controls).forEach(controlName => {
        const control = component.capacitacion.get(controlName);
        expect(control?.hasError('required')).toBeFalsy();
        
        control?.setValue('');
        expect(control?.hasError('required')).toBeTruthy();
      });
    });
  });

  describe('actualizarFormularioConEstado', () => {
    beforeEach(() => {
      component.solicitudState = mockSolicitudState as any;
      component.crearFormularioDeGestion();
    });

    it('should update form controls with new state values', () => {
      const newState = {
        perfiles: {
          mediosTransporte: 'Aéreos',
          estaDifusion: 'No',
          enunciativaLimitativa: 'Sí',
          procedimientosEmpresa: 'Procedimiento B',
          mediosDeTransporte: 'Aviones'
        }
      };

      component.solicitudState = newState as any;
      component.actualizarFormularioConEstado();

      expect(component.capacitacion.get('mediosTransporte')?.value).toBe('Aéreos');
      expect(component.capacitacion.get('estaDifusion')?.value).toBe('No');
      expect(component.capacitacion.get('enunciativaLimitativa')?.value).toBe('Sí');
      expect(component.capacitacion.get('procedimientosEmpresa')?.value).toBe('Procedimiento B');
      expect(component.capacitacion.get('mediosDeTransporte')?.value).toBe('Aviones');
    });

    it('should not update when form is not initialized', () => {
      component.capacitacion = null as any;
      
      expect(() => component.actualizarFormularioConEstado()).not.toThrow();
    });

    it('should not update when solicitudState has no perfiles', () => {
      component.solicitudState = {} as any;
      const initialValues = { ...component.capacitacion.value };
      
      component.actualizarFormularioConEstado();
      
      expect(component.capacitacion.value).toEqual(initialValues);
    });

    it('should skip fields with undefined, null or empty values', () => {
      component.solicitudState = {
        perfiles: {
          mediosTransporte: '',
          estaDifusion: '',
          enunciativaLimitativa: undefined,
          procedimientosEmpresa: 'Valid Value',
          mediosDeTransporte: 'Another Valid Value'
        }
      } as any;

      const initialMediosTransporte = component.capacitacion.get('mediosTransporte')?.value;
      const initialEstaDifusion = component.capacitacion.get('estaDifusion')?.value;
      const initialEnunciativaLimitativa = component.capacitacion.get('enunciativaLimitativa')?.value;

      component.actualizarFormularioConEstado();

      expect(component.capacitacion.get('mediosTransporte')?.value).toBe(initialMediosTransporte);
      expect(component.capacitacion.get('estaDifusion')?.value).toBe(initialEstaDifusion);
      expect(component.capacitacion.get('enunciativaLimitativa')?.value).toBe(initialEnunciativaLimitativa);
      expect(component.capacitacion.get('procedimientosEmpresa')?.value).toBe('Valid Value');
      expect(component.capacitacion.get('mediosDeTransporte')?.value).toBe('Another Valid Value');
    });
  });

  describe('setValoresStore', () => {
    beforeEach(() => {
      component.solicitudState = mockSolicitudState as any;
      component.crearFormularioDeGestion();
    });

    it('should call store.establecerDatos with correct data when form and field are valid', () => {
      component.capacitacion.get('mediosTransporte')?.setValue('Marítimos');
      
      component.setValoresStore(component.capacitacion, 'mediosTransporte');
      
      expect(mockStore.establecerDatos).toHaveBeenCalledWith({
        perfiles: { mediosTransporte: 'Marítimos' }
      });
    });

    it('should not call store when form is null', () => {
      component.setValoresStore(null, 'mediosTransporte');
      
      expect(mockStore.establecerDatos).not.toHaveBeenCalled();
    });

    it('should not call store when control value is null', () => {
      component.capacitacion.get('mediosTransporte')?.setValue(null);
      
      component.setValoresStore(component.capacitacion, 'mediosTransporte');
      
      expect(mockStore.establecerDatos).not.toHaveBeenCalled();
    });

    it('should not call store when control value is undefined', () => {
      component.capacitacion.get('mediosTransporte')?.setValue(undefined);
      
      component.setValoresStore(component.capacitacion, 'mediosTransporte');
      
      expect(mockStore.establecerDatos).not.toHaveBeenCalled();
    });

    it('should call store when control value is empty string', () => {
      component.capacitacion.get('mediosTransporte')?.setValue('');
      
      component.setValoresStore(component.capacitacion, 'mediosTransporte');
      
      expect(mockStore.establecerDatos).toHaveBeenCalledWith({
        perfiles: { mediosTransporte: '' }
      });
    });

    it('should not call store when field does not exist in form', () => {
      component.setValoresStore(component.capacitacion, 'nonexistentField');
      
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
      component.crearFormularioDeGestion();
    });

    it('should have all expected form controls', () => {
      const expectedControls = [
        'mediosTransporte',
        'estaDifusion', 
        'enunciativaLimitativa',
        'procedimientosEmpresa',
        'mediosDeTransporte'
      ];

      expectedControls.forEach(controlName => {
        expect(component.capacitacion.get(controlName)).toBeDefined();
      });
    });

    it('should validate form as invalid when required fields are empty', () => {
      Object.keys(component.capacitacion.controls).forEach(controlName => {
        component.capacitacion.get(controlName)?.setValue('');
      });

      expect(component.capacitacion.valid).toBeFalsy();
    });

    it('should validate form as valid when all required fields have values', () => {
      Object.keys(component.capacitacion.controls).forEach(controlName => {
        component.capacitacion.get(controlName)?.setValue('Valid Value');
      });

      expect(component.capacitacion.valid).toBeTruthy();
    });
  });
});
