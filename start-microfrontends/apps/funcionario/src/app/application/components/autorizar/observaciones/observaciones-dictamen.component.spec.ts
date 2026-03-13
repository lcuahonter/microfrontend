import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ObservacionesDictamenComponent } from './observaciones-dictamen.component';
import { HttpClientModule } from '@angular/common/http'; // Importar HttpClientModule
import { ReactiveFormsModule } from '@angular/forms'; // Importar ReactiveFormsModule si es necesario
import { DictamenObservacionesService } from '../../../core/service/dictamen-observaciones.service'; // Importar el servicio si es necesario

describe('ObservacionesDictamenComponent', () => {
  let component: ObservacionesDictamenComponent;
  let fixture: ComponentFixture<ObservacionesDictamenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ObservacionesDictamenComponent,
        HttpClientModule, // Agregar HttpClientModule aquí
        ReactiveFormsModule // Agregar ReactiveFormsModule si el componente usa formularios reactivos
      ],
      providers: [DictamenObservacionesService] // Asegurarse de que el servicio esté disponible
    }).compileComponents();

    fixture = TestBed.createComponent(ObservacionesDictamenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});