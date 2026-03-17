import { TestBed, ComponentFixture } from '@angular/core/testing';
import { PagoDerechoAnualComponent } from './pago-derecho-anual.component';

describe('PagoDerechoAnualComponent', () => {
  let component: PagoDerechoAnualComponent;
  let fixture: ComponentFixture<PagoDerechoAnualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagoDerechoAnualComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PagoDerechoAnualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe tener el mensaje de alerta definido correctamente', () => {
    expect(component.alertMessage)
      .toBe('El periodo autorizado para la consulta de complimiento de pago de derecho anual es del 08/12/2025 al 31/12/2025.');
  });
});
