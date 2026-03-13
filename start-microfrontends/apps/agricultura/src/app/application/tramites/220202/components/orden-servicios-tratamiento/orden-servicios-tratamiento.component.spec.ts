import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrdenServiciosTratamientoComponent } from './orden-servicios-tratamiento.component';

describe('OrdenServiciosTratamientoComponent', () => {
  let component: OrdenServiciosTratamientoComponent;
  let fixture: ComponentFixture<OrdenServiciosTratamientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdenServiciosTratamientoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OrdenServiciosTratamientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
