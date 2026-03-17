import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosMercanciaEvaluacionComponent } from './datos-mercancia-evaluacion.component';

describe('DatosMercanciaEvaluacionComponent', () => {
  let component: DatosMercanciaEvaluacionComponent;
  let fixture: ComponentFixture<DatosMercanciaEvaluacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatosMercanciaEvaluacionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DatosMercanciaEvaluacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
