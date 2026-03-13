import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SeguridadDeLosEquiposComponent } from './seguridad-de-los-equipos.component';

describe('SeguridadDeLosEquiposComponent', () => {
  let component: SeguridadDeLosEquiposComponent;
  let fixture: ComponentFixture<SeguridadDeLosEquiposComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeguridadDeLosEquiposComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SeguridadDeLosEquiposComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
