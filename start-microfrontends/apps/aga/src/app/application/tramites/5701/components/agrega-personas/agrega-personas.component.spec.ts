import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgregaPersonasComponent } from './agrega-personas.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ValidacionesFormularioService } from '@ng-mf/data-access-user';
import { Tramite5701Query } from '../../../../core/queries/tramite5701.query';
import { Tramite5701Store } from '../../../../core/estados/tramites/tramite5701.store';
import { ConsultaResponsableService } from '../../../../core/services/5701/consulta-responsable.service';
import { of, Subject } from 'rxjs';
import { ResponsablesDespacho } from '../../../../core/models/5701/tramite5701.model';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AgregaPersonasComponent', () => {
  let component: AgregaPersonasComponent;
  let fixture: ComponentFixture<AgregaPersonasComponent>;
  let mockValidacionesService: any;
  let mockTramite5701Query: any;
  let mockTramite5701Store: any;
  let mockConsultaResponsableService: any;

  beforeEach(async () => {
    mockValidacionesService = { isValid: jest.fn().mockReturnValue(true) };
    mockTramite5701Query = {
      selectSolicitud$: of({
        personasResponsablesDespacho: [],
      }),
    };
    mockTramite5701Store = {
      setValor: jest.fn(),
    };
    mockConsultaResponsableService = {
      getGafeteResponsable: jest.fn().mockReturnValue(of({ datos: null })),
    };

    await TestBed.configureTestingModule({
      imports: [AgregaPersonasComponent, ReactiveFormsModule],
      providers: [
        FormBuilder,
        {
          provide: ValidacionesFormularioService,
          useValue: mockValidacionesService,
        },
        { provide: Tramite5701Query, useValue: mockTramite5701Query },
        { provide: Tramite5701Store, useValue: mockTramite5701Store },
        {
          provide: ConsultaResponsableService,
          useValue: mockConsultaResponsableService,
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AgregaPersonasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set solicitudState and personas if personasResponsablesDespacho exists', () => {
      const personas = [
        { gafeteRespoDespacho: '123' },
      ] as ResponsablesDespacho[];
      mockTramite5701Query.selectSolicitud$ = of({
        personasResponsablesDespacho: personas,
      });
      component.ngOnInit();
      expect(component.solicitudState.personasResponsablesDespacho).toEqual(
        personas
      );
      expect(component.personas).toEqual(personas);
    });
  });

  describe('ngOnChanges', () => {
    it('should update personas when personasResponsablesDespachoSeleccionados changes', () => {
      const newPersonas = [
        { gafeteRespoDespacho: '456' },
      ] as ResponsablesDespacho[];
      component.ngOnChanges({
        personasResponsablesDespachoSeleccionados: {
          currentValue: newPersonas,
          previousValue: [],
          firstChange: false,
          isFirstChange: () => false,
        },
      });
      expect(component.personas).toEqual(newPersonas);
    });
  });

  describe('gafeteIsValid', () => {
    it('should return true if gafeteRespoDespacho has errors and touched', () => {
      component.gafeteRespoDespacho.setErrors({ required: true });
      component.gafeteRespoDespacho.markAsTouched();
      expect(component.gafeteIsValid).toBeTruthy();
    });
    it('should return false if gafeteRespoDespacho has no errors', () => {
      component.gafeteRespoDespacho.setErrors(null);
      expect(component.gafeteIsValid).toBeFalsy();
    });
  });

  describe('buscarGafete', () => {
    it('should set notificacion if gafete is empty', () => {
      component.gafeteRespoDespacho.setValue('');
      component.buscarGafete();
      expect(component.nuevaNotificacion).toBeDefined();
    });

    it('should fill personaForm if response.datos exists', () => {
      mockConsultaResponsableService.getGafeteResponsable = jest
        .fn()
        .mockReturnValue(
          of({
            datos: {
              nombre: 'Juan',
              apellido_paterno: 'Pérez',
              apellido_materno: 'López',
            },
          })
        );
      component.gafeteRespoDespacho.setValue('123');
      component.buscarGafete();
      expect(component.personaForm.get('nombreRespoDespacho')?.value).toBe(
        'Juan'
      );
      expect(component.personaForm.get('paternoRespoDespacho')?.value).toBe(
        'Pérez'
      );
      expect(component.personaForm.get('maternoRespoDespacho')?.value).toBe(
        'López'
      );
    });

    it('should set notificacion and enable fields if response.datos is null', () => {
      mockConsultaResponsableService.getGafeteResponsable = jest
        .fn()
        .mockReturnValue(of({ datos: null }));
      component.gafeteRespoDespacho.setValue('123');
      const spy = jest.spyOn(component, 'habilitarCamposFormulario');
      component.buscarGafete();
      expect(component.nuevaNotificacion).toBeDefined();
      expect(spy).toHaveBeenCalled();
    });

    it('should clear form fields when gafete is not found', () => {
      // Setup: Fill form fields first
      component.personaForm.get('nombreRespoDespacho')?.enable();
      component.personaForm.get('paternoRespoDespacho')?.enable();
      component.personaForm.get('maternoRespoDespacho')?.enable();
      component.personaForm.get('nombreRespoDespacho')?.setValue('R');
      component.personaForm.get('paternoRespoDespacho')?.setValue('A');
      component.personaForm.get('maternoRespoDespacho')?.setValue('Z');
      
      // Mock service to return no data (gafete not found)
      mockConsultaResponsableService.getGafeteResponsable = jest
        .fn()
        .mockReturnValue(of({ datos: null }));
      
      component.gafeteRespoDespacho.setValue('1');
      component.buscarGafete();
      
      // Verify error notification is shown
      expect(component.nuevaNotificacion).toBeDefined();
      
      // Verify form fields are cleared after reset
      expect(component.personaForm.get('nombreRespoDespacho')?.value).toBeNull();
      expect(component.personaForm.get('paternoRespoDespacho')?.value).toBeNull();
      expect(component.personaForm.get('maternoRespoDespacho')?.value).toBeNull();
    });
  });

  describe('habilitarCamposFormulario', () => {
    it('should enable and set validators for all controls', () => {
      component.habilitarCamposFormulario();
      Object.keys(component.personaForm.controls).forEach((campo) => {
        expect(component.personaForm.get(campo)?.enabled).toBeTruthy();
      });
    });
  });

  describe('agregarPersona', () => {
    beforeEach(() => {
      component.gafeteRespoDespacho.setValue('123');
      component.personaForm.get('nombreRespoDespacho')?.enable();
      component.personaForm.get('paternoRespoDespacho')?.enable();
      component.personaForm.get('maternoRespoDespacho')?.enable();
      component.personaForm.get('nombreRespoDespacho')?.setValue('Juan');
      component.personaForm.get('paternoRespoDespacho')?.setValue('Pérez');
      component.personaForm.get('maternoRespoDespacho')?.setValue('López');
    });

    it('should show error if gafeteRespoDespacho is invalid', () => {
      component.gafeteRespoDespacho.setValue('');
      component.agregarPersona();
      expect(component.nuevaNotificacion).toBeDefined();
    });

    it('should show error if personaForm is invalid', () => {
      component.personaForm.get('nombreRespoDespacho')?.setValue('');
      component.agregarPersona();
      expect(component.nuevaNotificacion).toBeDefined();
    });

    it('should show warning if personas length >= 5', () => {
      component.personas = Array(5).fill({ gafeteRespoDespacho: 'x' });
      component.agregarPersona();
      expect(component.nuevaNotificacion).toBeDefined();
    });

    it('should show error if responsable already exists', () => {
      component.personas = [
        { gafeteRespoDespacho: '123' } as ResponsablesDespacho,
      ];
      component.agregarPersona();
      expect(component.nuevaNotificacion).toBeDefined();
    });

    it('should preserve form values when responsable already exists (duplicate badge)', () => {
      // Setup: existing person with same badge
      component.personas = [
        { gafeteRespoDespacho: '123' } as ResponsablesDespacho,
      ];
      
      // Form should preserve these values after duplicate error
      const expectedGafete = '123';
      const expectedNombre = 'Juan';
      const expectedPaterno = 'Pérez';
      const expectedMaterno = 'López';
      
      component.gafeteRespoDespacho.setValue(expectedGafete);
      component.personaForm.get('nombreRespoDespacho')?.setValue(expectedNombre);
      component.personaForm.get('paternoRespoDespacho')?.setValue(expectedPaterno);
      component.personaForm.get('maternoRespoDespacho')?.setValue(expectedMaterno);
      
      // Attempt to add duplicate
      component.agregarPersona();
      
      // Verify error is shown
      expect(component.nuevaNotificacion).toBeDefined();
      
      // Verify form values are preserved (not reset)
      expect(component.gafeteRespoDespacho.value).toBe(expectedGafete);
      expect(component.personaForm.get('nombreRespoDespacho')?.value).toBe(expectedNombre);
      expect(component.personaForm.get('paternoRespoDespacho')?.value).toBe(expectedPaterno);
      expect(component.personaForm.get('maternoRespoDespacho')?.value).toBe(expectedMaterno);
    });

    it('should add persona if valid and not duplicate', () => {
      const emitSpy = jest.spyOn(component.responsablesDespachoChange, 'emit');
      component.personas = [];
      component.agregarPersona();
      expect(component.personas.length).toBe(1);
      expect(emitSpy).toHaveBeenCalled();
    });

    it('should reset form fields when persona is successfully added', () => {
      const emitSpy = jest.spyOn(component.responsablesDespachoChange, 'emit');
      component.personas = [];
      
      // Set form values
      component.gafeteRespoDespacho.setValue('123');
      component.personaForm.get('nombreRespoDespacho')?.setValue('Juan');
      component.personaForm.get('paternoRespoDespacho')?.setValue('Pérez');
      component.personaForm.get('maternoRespoDespacho')?.setValue('López');
      
      component.agregarPersona();
      
      // Verify person was added
      expect(component.personas.length).toBe(1);
      expect(emitSpy).toHaveBeenCalled();
      
      // Verify form fields are reset
      expect(component.gafeteRespoDespacho.value).toBe('');
      expect(component.personaForm.get('nombreRespoDespacho')?.value).toBe('');
      expect(component.personaForm.get('paternoRespoDespacho')?.value).toBe('');
      expect(component.personaForm.get('maternoRespoDespacho')?.value).toBe('');
    });

    it('should set userHasInteracted to true when agregarPersona is called', () => {
      // Arrange
      component.userHasInteracted = false;
      component.gafeteRespoDespacho.setValue('123');
      component.personaForm.get('nombreRespoDespacho')?.setValue('Juan');
      component.personaForm.get('paternoRespoDespacho')?.setValue('Pérez');
      component.personaForm.get('maternoRespoDespacho')?.setValue('López');

      // Act
      component.agregarPersona();

      // Assert
      expect(component.userHasInteracted).toBe(true);
    });
  });

  describe('setValoresStore', () => {
    it('should call tramite5701Store method with value', () => {
      const form = component.personaForm;
      form.get('nombreRespoDespacho')?.setValue('Juan');
      mockTramite5701Store.setNombre = jest.fn();
      component.setValoresStore(
        form,
        'nombreRespoDespacho',
        'setNombre' as any
      );
      expect(mockTramite5701Store.setNombre).toHaveBeenCalledWith('Juan');
    });
  });

  describe('eliminarResponsables', () => {
    it('should show aviso if responsableSeleccionado is empty', () => {
      component.responsableSeleccionado = [];
      component.eliminarResponsables();
      expect(component.nuevaNotificacion).toBeDefined();
    });

    it('should remove selected responsables and emit', () => {
      component.personas = [
        { gafeteRespoDespacho: '1' } as ResponsablesDespacho,
        { gafeteRespoDespacho: '2' } as ResponsablesDespacho,
      ];
      component.responsableSeleccionado = [
        { gafeteRespoDespacho: '1' } as ResponsablesDespacho,
      ];
      const emitSpy = jest.spyOn(component.responsablesDespachoChange, 'emit');
      component.eliminarResponsables();
      expect(component.personas.length).toBe(1);
      expect(component.personas[0].gafeteRespoDespacho).toBe('2');
      expect(emitSpy).toHaveBeenCalled();
    });
  });

  describe('ngOnDestroy', () => {
    it('should complete destroyNotifier$', () => {
      const spy = jest.spyOn((component as any).destroyNotifier$, 'next');
      const spyComplete = jest.spyOn(
        (component as any).destroyNotifier$,
        'complete'
      );
      component.ngOnDestroy();
      expect(spy).toHaveBeenCalled();
      expect(spyComplete).toHaveBeenCalled();
    });
  });
});
