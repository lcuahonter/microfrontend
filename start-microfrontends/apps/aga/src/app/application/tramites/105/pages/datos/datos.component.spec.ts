import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosComponent } from './datos.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('DatosComponent', () => {
    let componente: DatosComponent;
    let fixture: ComponentFixture<DatosComponent>;
  
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        declarations: [DatosComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [],
        imports: [
          require('@angular/common/http/testing').HttpClientTestingModule
        ]
      }).compileComponents();
  
      fixture = TestBed.createComponent(DatosComponent);
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
