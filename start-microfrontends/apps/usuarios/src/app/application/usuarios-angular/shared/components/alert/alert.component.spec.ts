import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectorRef, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { AlertComponent } from './alert.component';

describe('AlertComponent', () => {
  let component: AlertComponent;
  let fixture: ComponentFixture<AlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  describe('Input type', () => {
    it('debería aplicar la clase CSS "vuc-alert--info" cuando type es "info"', () => {
      fixture.componentRef.setInput('type', 'info');
      fixture.detectChanges();
      const alertDiv = fixture.debugElement.query(By.css('.vuc-alert'));
      expect(alertDiv.nativeElement.classList).toContain('vuc-alert--info');
    });

    it('debería aplicar la clase CSS "vuc-alert--success" cuando type es "success"', () => {
      fixture.componentRef.setInput('type', 'success');
      fixture.detectChanges();
      const alertDiv = fixture.debugElement.query(By.css('.vuc-alert'));
      expect(alertDiv.nativeElement.classList).toContain('vuc-alert--success');
    });

    it('debería aplicar la clase CSS "vuc-alert--warning" cuando type es "warning"', () => {
      fixture.componentRef.setInput('type', 'warning');
      fixture.detectChanges();
      const alertDiv = fixture.debugElement.query(By.css('.vuc-alert'));
      expect(alertDiv.nativeElement.classList).toContain('vuc-alert--warning');
    });

    it('debería aplicar la clase CSS "vuc-alert--error" cuando type es "error"', () => {
      fixture.componentRef.setInput('type', 'error');
      fixture.detectChanges();
      const alertDiv = fixture.debugElement.query(By.css('.vuc-alert'));
      expect(alertDiv.nativeElement.classList).toContain('vuc-alert--error');
    });
  });

  describe('Input closable', () => {
    it('debería mostrar el botón de cierre cuando closable es true', () => {
      fixture.componentRef.setInput('closable', true);
      fixture.detectChanges();
      const closeBtn = fixture.debugElement.query(By.css('.vuc-alert__close'));
      expect(closeBtn).not.toBeNull();
    });

    it('debería ocultar el botón de cierre cuando closable es false', () => {
      fixture.componentRef.setInput('closable', false);
      fixture.detectChanges();
      const closeBtn = fixture.debugElement.query(By.css('.vuc-alert__close'));
      expect(closeBtn).toBeNull();
    });
  });

  describe('Output closed', () => {
    it('debería emitir el evento "closed" al hacer click en el botón de cierre', () => {
      fixture.componentRef.setInput('closable', true);
      fixture.detectChanges();

      const emitSpy = jest.spyOn(component.closed, 'emit');
      const closeBtn = fixture.debugElement.query(By.css('.vuc-alert__close'));
      closeBtn.nativeElement.click();

      expect(emitSpy).toHaveBeenCalledTimes(1);
    });

    it('debería ocultar el alert después de llamar a close()', () => {
      fixture.componentRef.setInput('closable', true);
      fixture.detectChanges();

      component.close();
      fixture.debugElement.injector.get(ChangeDetectorRef).markForCheck();
      fixture.detectChanges();

      const alertDiv = fixture.debugElement.query(By.css('.vuc-alert'));
      expect(alertDiv).toBeNull();
    });
  });

  describe('Input title', () => {
    it('debería mostrar el título cuando se proporciona el input title', () => {
      fixture.componentRef.setInput('title', 'Título de prueba');
      fixture.detectChanges();
      const titleEl = fixture.debugElement.query(By.css('.vuc-alert__title'));
      expect(titleEl).not.toBeNull();
      expect(titleEl.nativeElement.textContent).toContain('Título de prueba');
    });

    it('no debería mostrar el elemento de título cuando title está vacío', () => {
      fixture.componentRef.setInput('title', '');
      fixture.detectChanges();
      const titleEl = fixture.debugElement.query(By.css('.vuc-alert__title'));
      expect(titleEl).toBeNull();
    });
  });
});
