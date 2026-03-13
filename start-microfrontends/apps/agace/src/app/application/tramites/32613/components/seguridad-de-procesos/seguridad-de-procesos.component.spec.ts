import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SeguridadDeProcesosComponent } from './seguridad-de-procesos.component';

describe('SeguridadDeProcesosComponent', () => {
  let component: SeguridadDeProcesosComponent;
  let fixture: ComponentFixture<SeguridadDeProcesosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeguridadDeProcesosComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SeguridadDeProcesosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
