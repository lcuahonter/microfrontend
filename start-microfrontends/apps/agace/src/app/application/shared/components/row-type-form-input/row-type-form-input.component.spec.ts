import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RowTypeFormInputComponent } from './row-type-form-input.component';

describe('RowTypeFormInputComponent', () => {
  let component: RowTypeFormInputComponent;
  let fixture: ComponentFixture<RowTypeFormInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RowTypeFormInputComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RowTypeFormInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
