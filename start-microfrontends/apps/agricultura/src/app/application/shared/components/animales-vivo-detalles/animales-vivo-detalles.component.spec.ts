import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnimalesVivoDetallesComponent } from './animales-vivo-detalles.component';

describe('AnimalesVivoDetallesComponent', () => {
  let component: AnimalesVivoDetallesComponent;
  let fixture: ComponentFixture<AnimalesVivoDetallesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnimalesVivoDetallesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AnimalesVivoDetallesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
