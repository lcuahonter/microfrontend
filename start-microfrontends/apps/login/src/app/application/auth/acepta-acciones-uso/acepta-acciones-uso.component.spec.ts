import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AceptaAccionesUsoComponent } from './acepta-acciones-uso.component';

describe('AceptaAccionesUsoComponent', () => {
  let component: AceptaAccionesUsoComponent;
  let fixture: ComponentFixture<AceptaAccionesUsoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AceptaAccionesUsoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AceptaAccionesUsoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
