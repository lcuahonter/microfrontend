import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoUnoComponent } from './paso-uno.component';
import {NO_ERRORS_SCHEMA } from '@angular/core';

describe('PasoUnoComponent', () => {
  let componente: PasoUnoComponent;
  let fixture: ComponentFixture<PasoUnoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PasoUnoComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [],
      imports: [
        // Import HttpClientTestingModule to provide HttpClient and its dependencies
        require('@angular/common/http/testing').HttpClientTestingModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PasoUnoComponent);
    componente = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(componente).toBeTruthy();
  });

  it('debería tener el índice inicial en 1', () => {
    expect(componente.indice).toBe(1);
  });

  it('debería actualizar el índice al llamar seleccionaTab', () => {
    const NUEVO_INDICE = 3;
    componente.seleccionaTab(NUEVO_INDICE);
    expect(componente.indice).toBe(NUEVO_INDICE);
  });
});
