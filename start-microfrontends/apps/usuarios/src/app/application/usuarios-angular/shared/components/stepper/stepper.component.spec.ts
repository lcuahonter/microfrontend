import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { StepperComponent, WizardStep } from './stepper.component';

const mockPasos: WizardStep[] = [
  { label: 'Paso 1' },
  { label: 'Paso 2' },
  { label: 'Paso 3' },
];

describe('StepperComponent', () => {
  let component: StepperComponent;
  let fixture: ComponentFixture<StepperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepperComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(StepperComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('pasos', mockPasos);
    fixture.componentRef.setInput('pasoActual', 0);
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  describe('Renderizado de pasos', () => {
    it('debería renderizar tantos pasos como el array pasos tenga', () => {
      const pasoElements = fixture.debugElement.queryAll(By.css('.vuc-stepper__step'));
      expect(pasoElements.length).toBe(mockPasos.length);
    });

    it('debería mostrar la etiqueta correcta en cada paso', () => {
      const labels = fixture.debugElement.queryAll(By.css('.vuc-stepper__step-label'));
      expect(labels[0].nativeElement.textContent.trim()).toBe('Paso 1');
      expect(labels[1].nativeElement.textContent.trim()).toBe('Paso 2');
      expect(labels[2].nativeElement.textContent.trim()).toBe('Paso 3');
    });
  });

  describe('pasoActual', () => {
    it('debería marcar como activo el paso correspondiente a pasoActual', () => {
      fixture.componentRef.setInput('pasoActual', 1);
      fixture.detectChanges();
      const pasoElements = fixture.debugElement.queryAll(By.css('.vuc-stepper__step'));
      expect(pasoElements[1].nativeElement.classList).toContain('active');
    });

    it('debería marcar como completados los pasos anteriores al pasoActual', () => {
      fixture.componentRef.setInput('pasoActual', 2);
      fixture.detectChanges();
      const pasoElements = fixture.debugElement.queryAll(By.css('.vuc-stepper__step'));
      expect(pasoElements[0].nativeElement.classList).toContain('completed');
      expect(pasoElements[1].nativeElement.classList).toContain('completed');
    });

    it('no debería marcar como activo un paso diferente al pasoActual', () => {
      fixture.componentRef.setInput('pasoActual', 0);
      fixture.detectChanges();
      const pasoElements = fixture.debugElement.queryAll(By.css('.vuc-stepper__step'));
      expect(pasoElements[1].nativeElement.classList).not.toContain('active');
      expect(pasoElements[2].nativeElement.classList).not.toContain('active');
    });
  });

  describe('Output pasoClick', () => {
    it('debería emitir el índice al hacer click en un paso ya completado (anterior al actual)', () => {
      fixture.componentRef.setInput('pasoActual', 2);
      fixture.detectChanges();

      const emitSpy = jest.spyOn(component.pasoClick, 'emit');
      const pasoElements = fixture.debugElement.queryAll(By.css('.vuc-stepper__step'));
      pasoElements[0].nativeElement.click();

      expect(emitSpy).toHaveBeenCalledWith(0);
    });

    it('debería emitir el índice correcto al hacer click en el primer paso completado', () => {
      fixture.componentRef.setInput('pasoActual', 2);
      fixture.detectChanges();

      const emitSpy = jest.spyOn(component.pasoClick, 'emit');
      component.onStepClick(1);

      expect(emitSpy).toHaveBeenCalledWith(1);
    });

    it('no debería emitir al hacer click en el paso actual', () => {
      fixture.componentRef.setInput('pasoActual', 1);
      fixture.detectChanges();

      const emitSpy = jest.spyOn(component.pasoClick, 'emit');
      component.onStepClick(1);

      expect(emitSpy).not.toHaveBeenCalled();
    });

    it('no debería emitir al hacer click en un paso futuro', () => {
      fixture.componentRef.setInput('pasoActual', 0);
      fixture.detectChanges();

      const emitSpy = jest.spyOn(component.pasoClick, 'emit');
      component.onStepClick(2);

      expect(emitSpy).not.toHaveBeenCalled();
    });
  });
});
