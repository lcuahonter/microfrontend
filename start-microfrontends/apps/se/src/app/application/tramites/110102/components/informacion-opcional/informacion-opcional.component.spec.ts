import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InformacionOpcionalComponent } from './informacion-opcional.component';

describe('InformacionOpcionalComponent', () => {
  let component: InformacionOpcionalComponent;
  let fixture: ComponentFixture<InformacionOpcionalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InformacionOpcionalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InformacionOpcionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
