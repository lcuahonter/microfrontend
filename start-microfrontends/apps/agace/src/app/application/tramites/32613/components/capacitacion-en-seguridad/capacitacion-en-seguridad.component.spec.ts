import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CapacitacionEnSeguridadComponent } from './capacitacion-en-seguridad.component';

describe('CapacitacionEnSeguridadComponent', () => {
  let component: CapacitacionEnSeguridadComponent;
  let fixture: ComponentFixture<CapacitacionEnSeguridadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CapacitacionEnSeguridadComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CapacitacionEnSeguridadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
