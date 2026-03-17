import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosDelTramiteComponent } from './datos-del-tramite.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

describe('DatosDelTramiteComponent', () => {
  let component: DatosDelTramiteComponent;
  let fixture: ComponentFixture<DatosDelTramiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DatosDelTramiteComponent,
        ReactiveFormsModule,
        RouterTestingModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DatosDelTramiteComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should update `seleccionarAduanasDisponiblesDatos` when `aduanasDisponiblesSeleccionadasChange` is called', () => {
    const mockAduanas = ['Aduana 1', 'Aduana 2'];
    component.aduanasDisponiblesSeleccionadasChange(mockAduanas);
    expect(component.seleccionarAduanasDisponiblesDatos).toEqual(mockAduanas);
  });
});
