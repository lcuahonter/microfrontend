import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CapturarSolictudOpinionComponent } from './capturar-solictud-opinion.component';

describe('CapturarSolictudOpinionComponent', () => {
  let component: CapturarSolictudOpinionComponent;
  let fixture: ComponentFixture<CapturarSolictudOpinionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CapturarSolictudOpinionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CapturarSolictudOpinionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
