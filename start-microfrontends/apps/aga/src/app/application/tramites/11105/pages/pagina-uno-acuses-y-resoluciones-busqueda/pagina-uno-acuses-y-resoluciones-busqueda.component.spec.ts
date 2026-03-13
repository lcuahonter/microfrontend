import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PaginaUnoAcusesYResolucionesBusquedaComponent } from './pagina-uno-acuses-y-resoluciones-busqueda.component';
import { AcusesYResolucionesFolioDelTramiteBusquedaComponent } from '@libs/shared/data-access-user/src';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AcusesYResolucionesBusqueda11105Component', () => {
  let component: PaginaUnoAcusesYResolucionesBusquedaComponent;
  let fixture: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        AcusesYResolucionesFolioDelTramiteBusquedaComponent,
        HttpClientTestingModule,
        PaginaUnoAcusesYResolucionesBusquedaComponent
      ],
      declarations: [],
    }).compileComponents();

    fixture = TestBed.createComponent(PaginaUnoAcusesYResolucionesBusquedaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have a defined constructor', () => {
    expect(component).toBeDefined();
  });
});