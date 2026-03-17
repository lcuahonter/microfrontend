import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SanidadComponent } from './sanidad.component';


describe('SanidadComponent', () => {
  let component: SanidadComponent;
  let fixture: ComponentFixture<SanidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SanidadComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SanidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
