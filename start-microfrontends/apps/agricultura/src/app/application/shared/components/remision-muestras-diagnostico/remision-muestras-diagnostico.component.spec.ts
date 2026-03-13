import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RemisionMuestrasDiagnosticoComponent } from './remision-muestras-diagnostico.component';

describe('RemisionMuestrasDiagnosticoComponent', () => {
  let component: RemisionMuestrasDiagnosticoComponent;
  let fixture: ComponentFixture<RemisionMuestrasDiagnosticoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RemisionMuestrasDiagnosticoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RemisionMuestrasDiagnosticoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
