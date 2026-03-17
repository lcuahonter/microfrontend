import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { PaginaDosAcusesYResolucionesDetallesComponent } from './pagina-dos-acuses-y-resoluciones-detalles.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('PaginaDosAcusesYResolucionesDetallesComponent', () => {
  let component: PaginaDosAcusesYResolucionesDetallesComponent;
  let fixture: ComponentFixture<PaginaDosAcusesYResolucionesDetallesComponent>;
  let formBuilder: FormBuilder;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginaDosAcusesYResolucionesDetallesComponent, HttpClientTestingModule],
      providers: [FormBuilder],
      schemas: [NO_ERRORS_SCHEMA] 
    }).compileComponents();

    fixture = TestBed.createComponent(PaginaDosAcusesYResolucionesDetallesComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should inject FormBuilder correctly', () => {
    expect(component.formBuilder).toBeTruthy();
    expect(component.formBuilder).toBeInstanceOf(FormBuilder);
  });
});
