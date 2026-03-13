import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MercanciaEvaluacionComponent } from './mercancia-evaluacion.component';

describe('MercanciaEvaluacionComponent', () => {
  let component: MercanciaEvaluacionComponent;
  let fixture: ComponentFixture<MercanciaEvaluacionComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MercanciaEvaluacionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MercanciaEvaluacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
