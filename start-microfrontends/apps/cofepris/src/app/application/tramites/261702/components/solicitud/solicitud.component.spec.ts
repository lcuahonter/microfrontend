import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolicitudComponent } from './solicitud.component';
import { HttpClientModule } from '@angular/common/http';

describe('SolicitudComponent', () => {
  let component: SolicitudComponent;
  let fixture: ComponentFixture<SolicitudComponent>;

  // Mock básico para consultaState
  const mockConsultaState = {
    readonly: false,
    // Agrega aquí otras propiedades que tus componentes hijos puedan requerir
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitudComponent, HttpClientModule]
    }).compileComponents();

    fixture = TestBed.createComponent(SolicitudComponent);
    component = fixture.componentInstance;
    // Asigna el mock al input antes de detectar cambios
    component.consultaState = mockConsultaState as any;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });
});
