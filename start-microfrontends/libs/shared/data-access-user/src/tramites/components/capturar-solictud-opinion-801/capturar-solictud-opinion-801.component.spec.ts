import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CapturarSolictudOpinionComponent801 } from './capturar-solictud-opinion-801.component';

describe('CapturarSolictudOpinionComponent801', () => {
  let component: CapturarSolictudOpinionComponent801;
  let fixture: ComponentFixture<CapturarSolictudOpinionComponent801>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CapturarSolictudOpinionComponent801],
    }).compileComponents();

    fixture = TestBed.createComponent(CapturarSolictudOpinionComponent801);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
