import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CriterioDictamenComponent } from './CriterioDictamen.component';

describe('CriterioDictamenComponent', () => {
  let component: CriterioDictamenComponent;
  let fixture: ComponentFixture<CriterioDictamenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CriterioDictamenComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CriterioDictamenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
