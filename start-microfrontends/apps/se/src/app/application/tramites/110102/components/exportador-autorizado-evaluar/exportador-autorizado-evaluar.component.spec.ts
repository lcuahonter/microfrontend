import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExportadorAutorizadoEvaluarComponent } from './exportador-autorizado-evaluar.component';

describe('ExportadorAutorizadoEvaluarComponent', () => {
  let component: ExportadorAutorizadoEvaluarComponent;
  let fixture: ComponentFixture<ExportadorAutorizadoEvaluarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExportadorAutorizadoEvaluarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExportadorAutorizadoEvaluarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
