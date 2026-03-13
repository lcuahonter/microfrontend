import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoUnoComponent } from './paso-uno.component';
import {NO_ERRORS_SCHEMA } from '@angular/core';

describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let fixture: ComponentFixture<PasoUnoComponent>;

  beforeEach(async () => {
      await TestBed.configureTestingModule({
        declarations: [PasoUnoComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [],
        imports: [
          require('@angular/common/http/testing').HttpClientTestingModule
        ]
      }).compileComponents();
  
      fixture = TestBed.createComponent(PasoUnoComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería tener el índice inicial en 1', () => {
    expect(component.indice).toBe(1);
  });

  it('debería actualizar el índice al llamar seleccionaTab', () => {
    const NUEVO_INDICE = 3;
    component.seleccionaTab(NUEVO_INDICE);
    expect(component.indice).toBe(NUEVO_INDICE);
  });
});