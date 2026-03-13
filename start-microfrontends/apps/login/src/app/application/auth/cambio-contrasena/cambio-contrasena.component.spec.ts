import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CambioContrasenaComponent } from './cambio-contrasena.component';
import { provideHttpClient } from '@angular/common/http';

describe('CambioContrasenaComponent', () => {
  let component: CambioContrasenaComponent;
  let fixture: ComponentFixture<CambioContrasenaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CambioContrasenaComponent],
      providers: [provideHttpClient()]
    }).compileComponents();

    fixture = TestBed.createComponent(CambioContrasenaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
