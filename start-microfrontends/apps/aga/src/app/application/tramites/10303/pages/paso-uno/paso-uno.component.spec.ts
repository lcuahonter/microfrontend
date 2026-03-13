import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { AlertComponent, SolicitanteComponent, SolicitanteService } from '@ng-mf/data-access-user';
import { PasoUnoComponent } from './paso-uno.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';

describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let fixture: ComponentFixture<PasoUnoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ 
      declarations: [PasoUnoComponent],
      imports: [CommonModule, SolicitanteComponent, AlertComponent, HttpClientTestingModule],
      providers: [SolicitanteService, HttpClientTestingModule, HttpClient],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(PasoUnoComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
  });

  it('should create', () => {
    // Verificar que el componente se crea correctamente
    expect(component).toBeTruthy();
  });

  it('should have default tab index set to 1', () => {
    // Verificar que el índice predeterminado es 1
    expect(component.indice).toBe(1);
  });

  it('should update the selected tab index when seleccionaTab is called', () => {
    // Llamar a seleccionaTab y verificar que actualiza correctamente el índice
    component.seleccionaTab(2);
    expect(component.indice).toBe(2);
  });

  it('should render Solicitante tab when indice is 1', () => {
    // Establecer el índice en 1 y verificar que se renderiza el componente correspondiente
    component.indice = 1;
    fixture.detectChanges();
    const ALERT_MESSAGE = fixture.nativeElement.querySelector('.alert-warning');
    expect(ALERT_MESSAGE).toBeTruthy(); // Verificar que el mensaje de alerta está presente
    expect(ALERT_MESSAGE.textContent).toContain('Deberá verificar que todos los datos se encuentren actualizados');
  });

  it('should render Registro de donación tab when indice is 2', () => {
    // Establecer el índice en 2 y verificar que se renderiza el componente correspondiente
    component.indice = 2;
    fixture.detectChanges();
    const REGISTRO_DONACION = fixture.nativeElement.querySelector('app-registro-de-donacion');
    expect(REGISTRO_DONACION).toBeTruthy(); // Verificar que el componente de registro de donación está presente
  });

  it('should handle keyboard navigation (Enter key)', () => {
    // Simular que el usuario presiona Enter en el tab y verificar que cambia el índice
    const EVENT = new KeyboardEvent('keydown', { key: 'Enter' });
    const TAB_ELEMENT = fixture.nativeElement.querySelector('a[tabindex="2"]');
    TAB_ELEMENT.dispatchEvent(EVENT);
    component.seleccionaTab(2);
    expect(component.indice).toBe(2);
  });

  it('should handle keyboard navigation (Space key)', () => {
    // Simular que el usuario presiona Espacio en el tab y verificar que cambia el índice
    const EVENT = new KeyboardEvent('keydown', { key: ' ' });
    const TAB_ELEMENT = fixture.nativeElement.querySelector('a[tabindex="1"]');
    TAB_ELEMENT.dispatchEvent(EVENT);
    component.seleccionaTab(1);
    expect(component.indice).toBe(1);
  });
});
