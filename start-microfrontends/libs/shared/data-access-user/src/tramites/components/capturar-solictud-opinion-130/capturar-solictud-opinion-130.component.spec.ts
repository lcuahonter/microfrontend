import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CapturarSolictudOpinion130Component } from './capturar-solictud-opinion-130.component';

describe('CapturarSolictudOpinion130Component', () => {
  let component: CapturarSolictudOpinion130Component;
  let fixture: ComponentFixture<CapturarSolictudOpinion130Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CapturarSolictudOpinion130Component],
    }).compileComponents();

    fixture = TestBed.createComponent(CapturarSolictudOpinion130Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
