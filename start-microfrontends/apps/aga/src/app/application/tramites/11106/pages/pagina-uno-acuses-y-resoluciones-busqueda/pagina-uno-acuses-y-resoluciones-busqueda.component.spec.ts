import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { PaginaUnoAcusesYResolucionesBusquedaComponent } from './pagina-uno-acuses-y-resoluciones-busqueda.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PaginaUnoAcusesYResolucionesBusquedaComponent', () => {
  let component: PaginaUnoAcusesYResolucionesBusquedaComponent;
  let fixture: ComponentFixture<PaginaUnoAcusesYResolucionesBusquedaComponent>;
  let formBuilder: FormBuilder;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginaUnoAcusesYResolucionesBusquedaComponent, HttpClientTestingModule],
      providers: [FormBuilder]
    }).compileComponents();

    fixture = TestBed.createComponent(PaginaUnoAcusesYResolucionesBusquedaComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should inject FormBuilder correctly', () => {
    expect(component['formBuilder']).toBeTruthy();
    expect(component['formBuilder']).toBeInstanceOf(FormBuilder);
  });
});
