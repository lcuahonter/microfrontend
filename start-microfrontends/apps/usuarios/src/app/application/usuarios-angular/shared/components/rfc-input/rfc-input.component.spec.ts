import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { AbstractControl, FormControl } from '@angular/forms';
import { of } from 'rxjs';
import { RfcInputComponent } from './rfc-input.component';
import { UsuariosApiService } from '../../../core/services/usuarios-api.service';

const mockUsuariosApiService = {
  buscarUsuario: jest.fn().mockReturnValue(of(null)),
};

describe('RfcInputComponent', () => {
  let component: RfcInputComponent;
  let fixture: ComponentFixture<RfcInputComponent>;

  beforeEach(async () => {
    jest.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [RfcInputComponent],
      providers: [
        { provide: UsuariosApiService, useValue: mockUsuariosApiService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(RfcInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  describe('Validador RFC', () => {
    const getErrors = (value: string) => {
      const ctrl = new FormControl(value);
      // Acceder al validador a través del rfcControl del componente
      component.rfcControl.setValue(value);
      component.rfcControl.markAsTouched();
      return component.rfcControl.errors;
    };

    it('debería rechazar un RFC con longitud incorrecta (menos de 12 caracteres)', () => {
      component.rfcControl.setValue('GOMA8001');
      component.rfcControl.markAsTouched();
      const errors = component.rfcControl.errors;
      expect(errors).not.toBeNull();
      expect(errors?.['rfcInvalido']).toBeTruthy();
    });

    it('debería rechazar un RFC con longitud incorrecta (más de 13 caracteres)', () => {
      component.rfcControl.setValue('GOMA800101AB1X');
      component.rfcControl.markAsTouched();
      const errors = component.rfcControl.errors;
      expect(errors).not.toBeNull();
      expect(errors?.['rfcInvalido']).toBeTruthy();
    });

    it('debería aceptar un RFC de persona física válido (13 caracteres)', () => {
      component.rfcControl.setValue('GOMA800101AB1');
      component.rfcControl.markAsTouched();
      const errors = component.rfcControl.errors;
      // No debe haber error rfcInvalido para un RFC válido de persona física
      expect(errors?.['rfcInvalido']).toBeFalsy();
    });

    it('debería aceptar un RFC de persona moral válido (12 caracteres)', () => {
      component.rfcControl.setValue('GOM800101AB1');
      component.rfcControl.markAsTouched();
      const errors = component.rfcControl.errors;
      // No debe haber error rfcInvalido para un RFC válido de persona moral
      expect(errors?.['rfcInvalido']).toBeFalsy();
    });

    it('debería rechazar un RFC con caracteres inválidos', () => {
      component.rfcControl.setValue('123A800101AB1');
      component.rfcControl.markAsTouched();
      const errors = component.rfcControl.errors;
      expect(errors?.['rfcInvalido']).toBeTruthy();
    });
  });

  describe('Input label', () => {
    it('debería mostrar el valor del input label en el template', () => {
      fixture.componentRef.setInput('label', 'RFC del solicitante');
      fixture.detectChanges();
      const labelEl = fixture.debugElement.query(By.css('label'));
      expect(labelEl.nativeElement.textContent.trim()).toBe('RFC del solicitante');
    });

    it('debería mostrar el label por defecto "RFC" si no se proporciona', () => {
      fixture.detectChanges();
      const labelEl = fixture.debugElement.query(By.css('label'));
      expect(labelEl.nativeElement.textContent.trim()).toBe('RFC');
    });
  });

  describe('ControlValueAccessor', () => {
    it('debería actualizar el valor del control al llamar writeValue()', () => {
      component.writeValue('GOMA800101AB1');
      expect(component.rfcControl.value).toBe('GOMA800101AB1');
    });

    it('debería actualizar el control a vacío al llamar writeValue() con null', () => {
      component.writeValue(null as any);
      expect(component.rfcControl.value).toBeNull();
    });

    it('debería deshabilitar el control al llamar setDisabledState(true)', () => {
      component.setDisabledState(true);
      expect(component.rfcControl.disabled).toBe(true);
    });

    it('debería habilitar el control al llamar setDisabledState(false)', () => {
      component.setDisabledState(true);
      component.setDisabledState(false);
      expect(component.rfcControl.enabled).toBe(true);
    });
  });

  describe('registerOnChange y registerOnTouched', () => {
    it('debería registrar la función onChange', () => {
      const onChangeFn = jest.fn();
      component.registerOnChange(onChangeFn);
      // Simular input para disparar onChange
      const inputEvent = new Event('input');
      Object.defineProperty(inputEvent, 'target', { value: { value: 'GOMA800101AB1' } });
      component.onInput(inputEvent);
      expect(onChangeFn).toHaveBeenCalledWith('GOMA800101AB1');
    });

    it('debería registrar la función onTouched', () => {
      const onTouchedFn = jest.fn();
      component.registerOnTouched(onTouchedFn);
      const inputEvent = new Event('input');
      Object.defineProperty(inputEvent, 'target', { value: { value: 'GOMA800101AB1' } });
      component.onInput(inputEvent);
      expect(onTouchedFn).toHaveBeenCalled();
    });
  });
});
