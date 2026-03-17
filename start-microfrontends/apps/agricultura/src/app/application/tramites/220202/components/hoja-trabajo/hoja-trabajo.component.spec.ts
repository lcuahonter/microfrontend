import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HojaTrabajoComponent } from './hoja-trabajo.component';

describe('HojaTrabajoComponent', () => {
  let component: HojaTrabajoComponent;
  let fixture: ComponentFixture<HojaTrabajoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HojaTrabajoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HojaTrabajoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
