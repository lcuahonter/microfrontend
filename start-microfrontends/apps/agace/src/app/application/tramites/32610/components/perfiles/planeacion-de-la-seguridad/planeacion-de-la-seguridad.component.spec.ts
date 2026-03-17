import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlaneacionDelaSeguridadComponent } from './planeacion-de-la-seguridad.component';

describe('ProfilesDomocilioDelaComponent', () => {
  let component: PlaneacionDelaSeguridadComponent;
  let fixture: ComponentFixture<PlaneacionDelaSeguridadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaneacionDelaSeguridadComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PlaneacionDelaSeguridadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
