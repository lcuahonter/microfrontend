import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TratadosEvaluacionComponent } from './tratados-evaluacion.component';

describe('TratadosEvaluacionComponent', () => {
  let component: TratadosEvaluacionComponent;
  let fixture: ComponentFixture<TratadosEvaluacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TratadosEvaluacionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TratadosEvaluacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
