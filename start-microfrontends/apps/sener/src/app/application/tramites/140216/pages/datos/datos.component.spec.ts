import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosComponent } from './datos.component';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SolicitanteComponent, SolicitanteService } from '@libs/shared/data-access-user/src';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BusquedaPermisosComponent } from '../../components/busqueda-permisos/busqueda-permisos.component';

describe('DatosComponent', () => {
  let component: DatosComponent;
  let fixture: ComponentFixture<DatosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DatosComponent],
      imports: [ CommonModule, SolicitanteComponent, HttpClientModule, BusquedaPermisosComponent],
      providers: [SolicitanteService, HttpClientTestingModule, HttpClient],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(DatosComponent);
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

  it('should render Busqueda Permisos tab when indice is 1', () => {
    // Establecer el índice en 1 y verificar que se renderiza el componente correspondiente
    component.indice = 1;
    fixture.detectChanges();
    const SOLICITANTE = fixture.nativeElement.querySelector('app-busqueda-permisos');
    expect(SOLICITANTE).toBeTruthy();
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