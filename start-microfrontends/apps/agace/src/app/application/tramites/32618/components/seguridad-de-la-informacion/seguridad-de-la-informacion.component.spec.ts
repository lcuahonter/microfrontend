import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SeguridadDeLaInformacionComponent } from './seguridad-de-la-informacion.component';

describe('SeguridadDeLaInformacionComponent', () => {
  let component: SeguridadDeLaInformacionComponent;
  let fixture: ComponentFixture<SeguridadDeLaInformacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeguridadDeLaInformacionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SeguridadDeLaInformacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
