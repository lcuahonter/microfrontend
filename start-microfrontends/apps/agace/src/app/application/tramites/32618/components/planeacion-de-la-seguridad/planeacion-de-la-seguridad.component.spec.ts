import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlaneacionDeLaSeguridadComponent } from './planeacion-de-la-seguridad.component';

describe('PlaneacionDeLaSeguridadComponent', () => {
  let component: PlaneacionDeLaSeguridadComponent;
  let fixture: ComponentFixture<PlaneacionDeLaSeguridadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaneacionDeLaSeguridadComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PlaneacionDeLaSeguridadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
