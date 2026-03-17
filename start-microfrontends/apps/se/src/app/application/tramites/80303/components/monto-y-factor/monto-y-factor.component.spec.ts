import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MontoYFactorComponent } from './monto-y-factor.component';

describe('MontoYFactorComponent', () => {
  let component: MontoYFactorComponent;
  let fixture: ComponentFixture<MontoYFactorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MontoYFactorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MontoYFactorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
